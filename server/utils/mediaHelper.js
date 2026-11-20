const fs = require("fs");
const path = require("path");

const isServerless = Boolean(
  process.env.NETLIFY ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.VERCEL ||
  process.env.LAMBDA_TASK_ROOT
);

const UPLOAD_ROOT_DIR = isServerless
  ? "/tmp/uploads"
  : path.resolve(__dirname, "../../public/uploads");

const UPLOAD_PRODUCTS_DIR = path.join(UPLOAD_ROOT_DIR, "products");
const UPLOAD_CATALOGUES_DIR = path.join(UPLOAD_ROOT_DIR, "catalogues");
const CATALOGUES_DIR = path.resolve(__dirname, "../../public/catalogues");
const PUBLIC_CATALOGUE_DIR = isServerless
  ? "/tmp/catalogue"
  : path.resolve(__dirname, "../../public/catalogue");
const THUMBNAILS_DIR = path.resolve(__dirname, "../../public/uploads/thumbnails");
const UPLOAD_DIR = UPLOAD_PRODUCTS_DIR;

// Ensure directories exist
try {
  [UPLOAD_ROOT_DIR, UPLOAD_PRODUCTS_DIR, UPLOAD_CATALOGUES_DIR, CATALOGUES_DIR, PUBLIC_CATALOGUE_DIR, THUMBNAILS_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
} catch (_) {}

function sanitizeBaseName(rawBase) {
  if (!rawBase) return "media";
  // Clean whitespace to hyphens, remove unsafe filesystem / URL characters
  let clean = rawBase
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_\-\.]/g, "")
    .replace(/-+/g, "-");
  clean = clean.replace(/^[.\-]+|[.\-]+$/g, "");
  return clean || "media";
}

function sanitizeCatalogueBaseName(rawBase) {
  if (!rawBase) return "catalogue";
  let clean = rawBase
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_\-\.]/g, "")
    .replace(/-+/g, "-")
    .replace(/^[.\-]+|[.\-]+$/g, "");
  return clean || "catalogue";
}

function formatCatalogueUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.toLowerCase() === "no catalogue" || trimmed.toLowerCase() === "none") return "";
  const fn = path.basename(trimmed).toLowerCase();
  if (fn && fn.endsWith(".pdf")) {
    return `/catalogue/${fn}`;
  }
  return trimmed;
}

/**
 * Generates a unique, clean filename preserving the original filename.
 * For catalogues/PDFs: enforces lowercase, hyphenated, URL-safe filenames.
 * If duplicate, safely increments: filename.pdf -> filename-1.pdf -> filename-2.pdf.
 */
function getUniqueFilename(originalName, destinationDir = UPLOAD_PRODUCTS_DIR, existingMediaList = [], activeBatchSet = new Set()) {
  const ext = (path.extname(originalName) || "").toLowerCase();
  const rawBase = path.basename(originalName, path.extname(originalName));
  const isPdf = ext === ".pdf";
  const cleanBase = isPdf ? sanitizeCatalogueBaseName(rawBase) : sanitizeBaseName(rawBase);

  // Pre-index existing media names for fast O(1) checks
  const existingMediaNames = new Set();
  if (Array.isArray(existingMediaList)) {
    for (const m of existingMediaList) {
      if (!m || m.is_trashed) continue;
      if (m.filename) existingMediaNames.add(m.filename.toLowerCase());
      if (m.url) {
        const uFn = m.url.split("/").pop();
        if (uFn) existingMediaNames.add(uFn.toLowerCase());
      }
    }
  }

  const dirsToCheck = isPdf
    ? [PUBLIC_CATALOGUE_DIR, CATALOGUES_DIR, UPLOAD_CATALOGUES_DIR]
    : Array.from(new Set([destinationDir, UPLOAD_PRODUCTS_DIR, UPLOAD_ROOT_DIR].filter(Boolean)));

  let candidate = `${cleanBase}${ext}`;

  const isTaken = (filename) => {
    const fnLower = filename.toLowerCase();

    // 1. Check in-memory batch set (for concurrent files in same upload request)
    if (activeBatchSet && activeBatchSet.has(fnLower)) {
      return true;
    }

    // 2. Check indexed media list records
    if (existingMediaNames.has(fnLower)) {
      return true;
    }

    // 3. Check disk in relevant directories
    for (const dir of dirsToCheck) {
      try {
        if (fs.existsSync(path.join(dir, filename))) {
          return true;
        }
      } catch (_) {}
    }

    return false;
  };

  if (!isTaken(candidate)) {
    if (activeBatchSet) activeBatchSet.add(candidate.toLowerCase());
    return candidate;
  }

  let counter = 1;
  while (isTaken(candidate)) {
    candidate = `${cleanBase}-${counter}${ext}`;
    counter++;
  }

  if (activeBatchSet) activeBatchSet.add(candidate.toLowerCase());
  return candidate;
}

function normalizeMediaUrl(url) {
  if (!url) return "";
  return url.toString().trim();
}

/**
 * Calculates all places where a media URL or filename is referenced
 */
function calculateMediaUsage(urlOrFilename, store) {
  if (!urlOrFilename || !store) return { count: 0, activeCount: 0, usedBy: [] };

  const target = normalizeMediaUrl(urlOrFilename).toLowerCase();
  const filename = path.basename(target);
  const usedBy = [];

  const matchesUrl = (img) => {
    if (!img) return false;
    const norm = normalizeMediaUrl(img).toLowerCase();
    return norm === target || norm.includes(filename) || target.includes(path.basename(norm));
  };

  // 1. Check Products
  if (Array.isArray(store.products)) {
    for (const p of store.products) {
      let isUsed = false;
      if (Array.isArray(p.images) && p.images.some(matchesUrl)) {
        isUsed = true;
      }
      if (p.colorImages && typeof p.colorImages === "object") {
        if (Object.values(p.colorImages).some(matchesUrl)) {
          isUsed = true;
        }
      }
      if (isUsed) {
        usedBy.push({
          type: "Product",
          id: p.id,
          name: p.name || p.title || "Product",
          slug: p.slug,
          is_trashed: Boolean(p.is_trashed),
        });
      }
    }
  }

  // 2. Check Blogs
  if (Array.isArray(store.blogs)) {
    for (const b of store.blogs) {
      let isUsed = false;
      if (matchesUrl(b.coverImage)) isUsed = true;
      if (b.author && matchesUrl(b.author.avatar)) isUsed = true;
      if (typeof b.content === "string" && b.content.toLowerCase().includes(filename)) isUsed = true;
      if (b.content && typeof b.content === "object") {
        const contentStr = JSON.stringify(b.content).toLowerCase();
        if (contentStr.includes(filename)) isUsed = true;
      }

      if (isUsed) {
        usedBy.push({
          type: "Blog",
          id: b.id,
          name: b.title || "Blog Post",
          slug: b.slug,
          is_trashed: Boolean(b.is_trashed),
        });
      }
    }
  }

  // 3. Check SEO & Collections
  if (Array.isArray(store.seo_metadata)) {
    for (const s of store.seo_metadata) {
      if (matchesUrl(s.og_image) || matchesUrl(s.twitter_image)) {
        usedBy.push({
          type: "Page",
          id: s.id,
          name: s.title || s.page_path || "Page SEO",
          slug: s.page_path,
          is_trashed: false,
        });
      }
    }
  }

  const activeCount = usedBy.filter((u) => !u.is_trashed).length;

  return {
    count: usedBy.length,
    activeCount,
    usedBy,
  };
}

/**
 * Fast O(N) Media Usage Index Builder.
 * Precomputes references across all products, blogs, and SEO records in a single pass.
 */
function buildMediaUsageIndex(store) {
  const usageMap = new Map();

  if (!store) return usageMap;

  const registerUsage = (rawUrl, item) => {
    if (!rawUrl || typeof rawUrl !== "string") return;
    const target = normalizeMediaUrl(rawUrl).toLowerCase();
    const filename = path.basename(target);
    const keys = [target, filename];

    for (const k of keys) {
      if (!k) continue;
      let record = usageMap.get(k);
      if (!record) {
        record = { count: 0, activeCount: 0, usedBy: [] };
        usageMap.set(k, record);
      }
      if (!record.usedBy.some((u) => u.type === item.type && u.id === item.id)) {
        record.usedBy.push(item);
        record.count++;
        if (!item.is_trashed) record.activeCount++;
      }
    }
  };

  // 1. Single pass: Products
  if (Array.isArray(store.products)) {
    for (const p of store.products) {
      const pItem = {
        type: "Product",
        id: p.id,
        name: p.name || p.title || "Product",
        slug: p.slug,
        is_trashed: Boolean(p.is_trashed),
      };
      if (Array.isArray(p.images)) {
        for (const img of p.images) {
          registerUsage(img, pItem);
        }
      }
      if (p.colorImages && typeof p.colorImages === "object") {
        for (const img of Object.values(p.colorImages)) {
          registerUsage(img, pItem);
        }
      }
      if (p.catalogueUrl || p.catalogue) {
        registerUsage(p.catalogueUrl || p.catalogue, pItem);
      }
    }
  }

  // 2. Single pass: Blogs
  if (Array.isArray(store.blogs)) {
    for (const b of store.blogs) {
      const bItem = {
        type: "Blog",
        id: b.id,
        name: b.title || "Blog Post",
        slug: b.slug,
        is_trashed: Boolean(b.is_trashed),
      };
      if (b.coverImage) registerUsage(b.coverImage, bItem);
      if (b.author && b.author.avatar) registerUsage(b.author.avatar, bItem);
    }
  }

  // 3. Single pass: SEO
  if (Array.isArray(store.seo_metadata)) {
    for (const s of store.seo_metadata) {
      const sItem = {
        type: "Page",
        id: s.id,
        name: s.title || s.page_path || "Page SEO",
        slug: s.page_path,
        is_trashed: false,
      };
      if (s.og_image) registerUsage(s.og_image, sItem);
      if (s.twitter_image) registerUsage(s.twitter_image, sItem);
    }
  }

  return usageMap;
}

function getUsageFromIndex(urlOrFilename, usageMap) {
  if (!urlOrFilename || !usageMap) return { count: 0, activeCount: 0, usedBy: [] };
  const target = normalizeMediaUrl(urlOrFilename).toLowerCase();
  const filename = path.basename(target);
  return usageMap.get(target) || usageMap.get(filename) || { count: 0, activeCount: 0, usedBy: [] };
}

/**
 * Seed initial media from disk and current references if store.media is missing/empty
 */
function seedInitialMedia(store) {
  if (!store) return [];
  if (Array.isArray(store.media) && store.media.length > 0) {
    return store.media;
  }

  const mediaList = [];
  const registeredUrls = new Set();

  function addMediaEntry({ filename, originalName, url, fileType = "image", mimeType = "image/jpeg", size = 102400, dimensions = "1200 x 800" }) {
    const cleanUrl = normalizeMediaUrl(url);
    if (!cleanUrl || registeredUrls.has(cleanUrl)) return;
    registeredUrls.add(cleanUrl);

    const id = `media-${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    mediaList.push({
      id,
      filename: filename || path.basename(cleanUrl),
      originalName: originalName || path.basename(cleanUrl),
      url: cleanUrl,
      mimeType,
      fileType,
      size,
      dimensions,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "System Seed",
      is_trashed: false,
      deleted_at: null,
      deleted_by: null,
      altText: originalName || filename || "Timex Ceramic Surface",
      caption: "",
    });
  }

  // 1. Read existing uploads directory on disk
  try {
    // Check root uploads directory
    if (fs.existsSync(UPLOAD_ROOT_DIR)) {
      const files = fs.readdirSync(UPLOAD_ROOT_DIR);
      for (const file of files) {
        const fullPath = path.join(UPLOAD_ROOT_DIR, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          const ext = path.extname(file).toLowerCase();
          let mime = "image/jpeg";
          if (ext === ".png") mime = "image/png";
          else if (ext === ".webp") mime = "image/webp";
          else if (ext === ".svg") mime = "image/svg+xml";

          addMediaEntry({
            filename: file,
            originalName: file,
            url: `/uploads/${file}`,
            mimeType: mime,
            fileType: ext === ".svg" ? "svg" : "image",
            size: stat.size,
            dimensions: "1200 x 800",
          });
        }
      }
    }
    // Also check products/ subdirectory for legacy files
    if (fs.existsSync(UPLOAD_PRODUCTS_DIR)) {
      const files = fs.readdirSync(UPLOAD_PRODUCTS_DIR);
      for (const file of files) {
        const fullPath = path.join(UPLOAD_PRODUCTS_DIR, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          const ext = path.extname(file).toLowerCase();
          let mime = "image/jpeg";
          if (ext === ".png") mime = "image/png";
          else if (ext === ".webp") mime = "image/webp";
          else if (ext === ".svg") mime = "image/svg+xml";

          addMediaEntry({
            filename: file,
            originalName: file,
            url: `/uploads/products/${file}`,
            mimeType: mime,
            fileType: ext === ".svg" ? "svg" : "image",
            size: stat.size,
            dimensions: "1200 x 800",
          });
        }
      }
    }
  } catch (err) {
    console.warn("[Media Helper] Error scanning upload dir:", err.message);
  }

  // 2. Scan products in store
  if (Array.isArray(store.products)) {
    for (const p of store.products) {
      if (Array.isArray(p.images)) {
        p.images.forEach((img, idx) => {
          if (img) {
            addMediaEntry({
              filename: `${p.slug || "product"}-${idx + 1}.jpg`,
              originalName: `${p.name || "Product"} View ${idx + 1}`,
              url: img,
              mimeType: "image/jpeg",
              fileType: "image",
              size: 256000,
              dimensions: p.size ? `${p.size} Tile Spec` : "1200 x 800",
            });
          }
        });
      }
      if (p.colorImages && typeof p.colorImages === "object") {
        Object.entries(p.colorImages).forEach(([color, img]) => {
          if (img) {
            addMediaEntry({
              filename: `${p.slug || "product"}-${color.toLowerCase()}.jpg`,
              originalName: `${p.name || "Product"} (${color})`,
              url: img,
              mimeType: "image/jpeg",
              fileType: "image",
              size: 210000,
              dimensions: "1200 x 800",
            });
          }
        });
      }
    }
  }

  // 3. Scan blogs in store
  if (Array.isArray(store.blogs)) {
    for (const b of store.blogs) {
      if (b.coverImage) {
        addMediaEntry({
          filename: `${b.slug || "blog"}-cover.jpg`,
          originalName: `${b.title || "Blog"} Editorial Cover`,
          url: b.coverImage,
          mimeType: "image/jpeg",
          fileType: "image",
          size: 384000,
          dimensions: "1920 x 1080",
        });
      }
      if (b.author && b.author.avatar) {
        addMediaEntry({
          filename: `author-${(b.author.name || "user").toLowerCase().replace(/\s+/g, "-")}.jpg`,
          originalName: `${b.author.name || "Author"} Avatar`,
          url: b.author.avatar,
          mimeType: "image/jpeg",
          fileType: "image",
          size: 64000,
          dimensions: "300 x 300",
        });
      }
    }
  }

  // 4. Scan collection banners from public/images/collections
  const collDir = path.resolve(__dirname, "../../public/images/collections");
  try {
    if (fs.existsSync(collDir)) {
      const collFiles = fs.readdirSync(collDir);
      for (const f of collFiles) {
        const ext = path.extname(f).toLowerCase();
        const stat = fs.statSync(path.join(collDir, f));
        if (stat.isFile()) {
          addMediaEntry({
            filename: f,
            originalName: `Collection: ${path.basename(f, ext)}`,
            url: `/images/collections/${f}`,
            mimeType: ext === ".svg" ? "image/svg+xml" : "image/png",
            fileType: ext === ".svg" ? "svg" : "image",
            size: stat.size,
            dimensions: "800 x 800",
          });
        }
      }
    }
  } catch (e) {}

  store.media = mediaList;
  return mediaList;
}

/**
 * Safely delete physical file on disk ONLY if not used by any active item
 */
function safeDeleteMediaFile(mediaItem, store) {
  if (!mediaItem || !mediaItem.url) {
    return { deleted: false, reason: "No media URL specified." };
  }

  const usage = calculateMediaUsage(mediaItem.url, store);
  if (usage.activeCount > 0) {
    const activeNames = usage.usedBy.filter((u) => !u.is_trashed).map((u) => `${u.name} (${u.type})`).join(", ");
    return {
      deleted: false,
      reason: `Media file is actively used by: ${activeNames}. Physical file was preserved.`,
    };
  }

  // If URL points to local /uploads/ directory
  if (mediaItem.url.startsWith("/uploads/")) {
    const relPath = mediaItem.url.replace(/^\/uploads\//, "");
    const diskPath = path.resolve(__dirname, "../../public/uploads", relPath);
    try {
      let removed = false;
      if (fs.existsSync(diskPath)) {
        fs.unlinkSync(diskPath);
        removed = true;
      }
      // Also clean up mirrored copy in products/ subdirectory if present
      const baseFilename = path.basename(relPath);
      const prodPath = path.resolve(__dirname, "../../public/uploads/products", baseFilename);
      if (fs.existsSync(prodPath) && prodPath !== diskPath) {
        fs.unlinkSync(prodPath);
        removed = true;
      }
      if (removed) {
        return { deleted: true, path: diskPath };
      }
    } catch (err) {
      console.warn("[Media Helper] Unlink error:", err.message);
      return { deleted: false, reason: err.message };
    }
  }

  return { deleted: true, reason: "External or static asset record removed." };
}

/**
 * Calculate total storage size and media counts
 */
function getMediaStatistics(store) {
  const media = Array.isArray(store?.media) ? store.media : [];
  const activeMedia = media.filter((m) => !m.is_trashed);
  const trashedMedia = media.filter((m) => Boolean(m.is_trashed));

  const totalSize = activeMedia.reduce((acc, m) => acc + (m.size || 0), 0);
  const totalImages = activeMedia.filter((m) => m.fileType === "image").length;
  const totalSvgs = activeMedia.filter((m) => m.fileType === "svg").length;
  const totalVideos = activeMedia.filter((m) => m.fileType === "video").length;
  const totalDocuments = activeMedia.filter((m) => m.fileType === "document").length;

  const oneDayAgo = Date.now() - 86400000;
  const recentlyUploadedCount = activeMedia.filter((m) => new Date(m.uploadedAt).getTime() > oneDayAgo).length;

  return {
    totalMedia: activeMedia.length,
    totalImages,
    totalSvgs,
    totalVideos,
    totalDocuments,
    totalSize,
    trashedCount: trashedMedia.length,
    recentlyUploadedCount,
  };
}

module.exports = {
  calculateMediaUsage,
  buildMediaUsageIndex,
  getUsageFromIndex,
  seedInitialMedia,
  safeDeleteMediaFile,
  getMediaStatistics,
  UPLOAD_DIR,
  UPLOAD_ROOT_DIR,
  UPLOAD_PRODUCTS_DIR,
  UPLOAD_CATALOGUES_DIR,
  CATALOGUES_DIR,
  PUBLIC_CATALOGUE_DIR,
  THUMBNAILS_DIR,
  getUniqueFilename,
  sanitizeBaseName,
  sanitizeCatalogueBaseName,
  formatCatalogueUrl,
};
