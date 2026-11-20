const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getPool, isMysqlConnected, loadFallbackStore, saveFallbackStore } = require("../config/db");
const {
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
  formatCatalogueUrl,
} = require("../utils/mediaHelper");

// Ensure upload directories exist
try {
  [UPLOAD_ROOT_DIR, UPLOAD_PRODUCTS_DIR, UPLOAD_CATALOGUES_DIR, CATALOGUES_DIR, PUBLIC_CATALOGUE_DIR, THUMBNAILS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
} catch (e) {
  console.warn("Could not create upload dirs:", e);
}

// Configure multer storage with original filename preservation & duplicate resolution
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isDoc =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");
    const dest = isDoc ? PUBLIC_CATALOGUE_DIR : UPLOAD_PRODUCTS_DIR;
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    try {
      req._batchAssigned = req._batchAssigned || new Set();
      if (!req._cachedStore) {
        req._cachedStore = loadFallbackStore();
      }
      const existingMedia = Array.isArray(req._cachedStore?.media) ? req._cachedStore.media : [];
      const isDoc =
        file.mimetype === "application/pdf" ||
        file.originalname.toLowerCase().endsWith(".pdf");
      const dest = isDoc ? PUBLIC_CATALOGUE_DIR : UPLOAD_PRODUCTS_DIR;
      const uniqueFilename = getUniqueFilename(
        file.originalname,
        dest,
        existingMedia,
        req._batchAssigned
      );
      cb(null, uniqueFilename);
    } catch (err) {
      cb(err);
    }
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|avif|gif|svg|pdf|mp4|webm/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetypeValid = allowed.test(file.mimetype) || file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");

  if (mimetypeValid) {
    return cb(null, true);
  }
  cb(new Error("Allowed formats: JPG, PNG, WebP, AVIF, GIF, SVG, PDF, MP4, WebM."));
};

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter,
});

function detectFileType(mimeType, ext) {
  const m = (mimeType || "").toLowerCase();
  const e = (ext || "").toLowerCase();
  if (e === ".svg" || m.includes("svg")) return "svg";
  if (m.startsWith("video/") || e === ".mp4" || e === ".webm") return "video";
  if (e === ".pdf" || m.includes("pdf") || e === ".doc" || e === ".docx") return "document";
  return "image";
}

// GET /api/v1/media/stats
router.get("/stats", (req, res) => {
  try {
    const store = loadFallbackStore();
    seedInitialMedia(store);
    const stats = getMediaStatistics(store);
    return res.json({ success: true, stats });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/media/thumbnail/:filename
router.get("/thumbnail/:filename", async (req, res) => {
  try {
    const rawFilename = req.params.filename || "";
    const filename = path.basename(decodeURIComponent(rawFilename));
    if (!filename) return res.status(400).send("Filename required");

    const width = Math.min(Math.max(parseInt(req.query.w) || 240, 32), 1600);
    const quality = Math.min(Math.max(parseInt(req.query.q) || 80, 20), 100);

    const ext = path.extname(filename).toLowerCase();
    // Non-raster images or documents
    if (ext === ".svg" || ext === ".pdf" || ext === ".mp4" || ext === ".webm") {
      const candidateDirs = [UPLOAD_PRODUCTS_DIR, UPLOAD_ROOT_DIR, PUBLIC_CATALOGUE_DIR];
      for (const dir of candidateDirs) {
        const p = path.join(dir, filename);
        if (fs.existsSync(p)) {
          return res.sendFile(p);
        }
      }
      return res.status(404).send("File not found");
    }

    // Locate source file
    let sourcePath = null;
    const searchDirs = [
      UPLOAD_PRODUCTS_DIR,
      UPLOAD_ROOT_DIR,
      path.resolve(__dirname, "../../public/images/collections"),
      path.resolve(__dirname, "../../public/images"),
    ];

    for (const dir of searchDirs) {
      const candidate = path.join(dir, filename);
      if (fs.existsSync(candidate)) {
        sourcePath = candidate;
        break;
      }
    }

    if (!sourcePath) {
      return res.status(404).send("Source image not found");
    }

    const thumbBase = path.basename(filename, ext);
    const thumbFilename = `thumb_${thumbBase}_w${width}q${quality}.webp`;
    const thumbPath = path.join(THUMBNAILS_DIR, thumbFilename);

    res.setHeader("Cache-Control", "public, max-age=2592000, immutable");

    if (fs.existsSync(thumbPath)) {
      return res.sendFile(thumbPath);
    }

    const sharp = require("sharp");
    await sharp(sourcePath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(thumbPath);

    return res.sendFile(thumbPath);
  } catch (err) {
    // Graceful fallback to original image
    try {
      const rawFilename = req.params.filename || "";
      const filename = path.basename(decodeURIComponent(rawFilename));
      for (const dir of [UPLOAD_PRODUCTS_DIR, UPLOAD_ROOT_DIR]) {
        const p = path.join(dir, filename);
        if (fs.existsSync(p)) return res.sendFile(p);
      }
    } catch (_) {}
    return res.status(500).send("Thumbnail processing error");
  }
});

let _cachedUsageIndex = null;
let _lastUsageIndexBuild = 0;

function getCachedUsageIndex(store) {
  const now = Date.now();
  if (_cachedUsageIndex && now - _lastUsageIndexBuild < 15000) {
    return _cachedUsageIndex;
  }
  _cachedUsageIndex = buildMediaUsageIndex(store);
  _lastUsageIndexBuild = now;
  return _cachedUsageIndex;
}

// GET /api/v1/media
router.get("/", (req, res) => {
  try {
    const store = loadFallbackStore();
    seedInitialMedia(store);

    let mediaList = Array.isArray(store.media) ? store.media : [];
    const includeTrashed = req.query.includeTrashed === "true";
    // Accept both `fileType` and `type` (the admin UI sends `type`)
    const fileType = req.query.fileType || req.query.type || "all";
    const search = (req.query.search || "").toLowerCase().trim();
    const rawSort = req.query.sort || "newest";
    // Map legacy short sort names used by the admin UI
    const sortAliases = { name: "name_asc", size: "size_desc" };
    const sort = sortAliases[rawSort] || rawSort;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = req.query.limit !== undefined ? Math.max(0, parseInt(req.query.limit)) : 0;

    // Filter trashed
    if (!includeTrashed) {
      mediaList = mediaList.filter((m) => !m.is_trashed);
    }

    // Filter file type
    if (fileType !== "all") {
      mediaList = mediaList.filter((m) => m.fileType === fileType);
    }

    // Filter search
    if (search) {
      mediaList = mediaList.filter(
        (m) =>
          (m.filename && m.filename.toLowerCase().includes(search)) ||
          (m.originalName && m.originalName.toLowerCase().includes(search)) ||
          (m.altText && m.altText.toLowerCase().includes(search))
      );
    }

    // Sort
    mediaList.sort((a, b) => {
      if (sort === "oldest") {
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      }
      if (sort === "name_asc") {
        return (a.originalName || "").localeCompare(b.originalName || "");
      }
      if (sort === "name_desc") {
        return (b.originalName || "").localeCompare(a.originalName || "");
      }
      if (sort === "size_desc") {
        return (b.size || 0) - (a.size || 0);
      }
      if (sort === "size_asc") {
        return (a.size || 0) - (b.size || 0);
      }
      // default: newest
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });

    const total = mediaList.length;
    const totalPages = limit > 0 ? Math.ceil(total / limit) || 1 : 1;

    // Slice for pagination if limit > 0
    const pagedSlice = limit > 0 ? mediaList.slice((page - 1) * limit, page * limit) : mediaList;

    // Precompute usage index in a single pass O(Products + Blogs + SEO) with memory caching
    const usageIndex = getCachedUsageIndex(store);

    // Fast O(1) enrichment for each item in the slice
    const enriched = pagedSlice.map((m) => {
      const usage = getUsageFromIndex(m.url || m.filename, usageIndex);
      return {
        ...m,
        thumbnailUrl: m.fileType === "image" ? `/api/v1/media/thumbnail/${encodeURIComponent(m.filename)}?w=240` : m.url,
        usedBy: usage.usedBy,
        usedByCount: usage.count,
        activeUsedCount: usage.activeCount,
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      total,
      page,
      totalPages,
      limit,
      media: enriched,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/media/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    seedInitialMedia(store);
    const media = (store.media || []).find((m) => m.id === id);
    if (!media) {
      return res.status(404).json({ success: false, error: "Media item not found." });
    }

    const usage = calculateMediaUsage(media.url || media.filename, store);
    return res.json({
      success: true,
      media: {
        ...media,
        usedBy: usage.usedBy,
        usedByCount: usage.count,
        activeUsedCount: usage.activeCount,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/media/upload
router.post("/upload", upload.any(), (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, error: "No media files uploaded." });
    }

    const store = req._cachedStore || loadFallbackStore();
    seedInitialMedia(store);

    const uploadedMedia = files.map((file) => {
      const ext = path.extname(file.filename || file.originalname).toLowerCase();
      const fileType = detectFileType(file.mimetype, ext);
      const isDoc = fileType === "document" || ext === ".pdf";
      const cleanFilename = isDoc ? file.filename.toLowerCase() : file.filename;
      const publicUrl = isDoc
        ? `/catalogue/${cleanFilename}`
        : `/uploads/products/${file.filename}`;
      const id = `media-${Date.now()}-${Math.round(Math.random() * 1e5)}`;

      // Mirror file across directories asynchronously for non-blocking I/O
      try {
        if (isDoc) {
          const srcPath = path.join(file.destination || PUBLIC_CATALOGUE_DIR, file.filename);
          [PUBLIC_CATALOGUE_DIR, CATALOGUES_DIR, UPLOAD_CATALOGUES_DIR].forEach((targetDir) => {
            try {
              if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
              const targetPath = path.join(targetDir, cleanFilename);
              if (srcPath !== targetPath && fs.existsSync(srcPath)) {
                fs.copyFile(srcPath, targetPath, () => {});
              }
            } catch (_) {}
          });
        } else {
          const prodPath = path.join(UPLOAD_PRODUCTS_DIR, file.filename);
          const rootPath = path.join(UPLOAD_ROOT_DIR, file.filename);
          if (fs.existsSync(prodPath) && !fs.existsSync(rootPath)) {
            fs.copyFile(prodPath, rootPath, () => {});
          }
        }
      } catch (_) {}

      return {
        id,
        filename: cleanFilename,
        originalName: file.originalname || cleanFilename,
        url: publicUrl,
        mimeType: isDoc ? "application/pdf" : (file.mimetype || "image/jpeg"),
        fileType,
        size: file.size,
        dimensions: fileType === "image" ? "1200 x 800" : undefined,
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.body?.uploadedBy || "admin",
        is_trashed: false,
        deleted_at: null,
        deleted_by: null,
        altText: req.body?.altText || path.basename(file.filename, ext).replace(/[_-]/g, " "),
        caption: req.body?.caption || "",
      };
    });

    store.media = [...uploadedMedia, ...(store.media || [])];
    saveFallbackStore(store);

    return res.status(201).json({
      success: true,
      count: uploadedMedia.length,
      media: uploadedMedia[0],
      allMedia: uploadedMedia,
      urls: uploadedMedia.map((m) => m.url),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/media/:id
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const store = loadFallbackStore();
    seedInitialMedia(store);
    const media = (store.media || []).find((m) => m.id === id);
    if (!media) {
      return res.status(404).json({ success: false, error: "Media item not found." });
    }

    if (updates.altText !== undefined) media.altText = updates.altText;
    if (updates.caption !== undefined) media.caption = updates.caption;
    if (updates.originalName !== undefined) media.originalName = updates.originalName;

    saveFallbackStore(store);
    return res.json({ success: true, media });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/media/:id (SOFT DELETE -> Recycle Bin)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    seedInitialMedia(store);
    const media = (store.media || []).find((m) => m.id === id);
    if (!media) {
      return res.status(404).json({ success: false, error: "Media item not found." });
    }

    media.is_trashed = true;
    media.deleted_at = new Date().toISOString();
    media.deleted_by = req.body?.deletedBy || "admin";

    saveFallbackStore(store);
    const usage = calculateMediaUsage(media.url, store);

    return res.json({
      success: true,
      message: `Media "${media.originalName || media.filename}" moved to Recycle Bin.`,
      media,
      activeUsageWarning: usage.activeCount > 0 ? usage.usedBy.filter((u) => !u.is_trashed) : null,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/media/:id/restore (RESTORE from Recycle Bin)
router.post("/:id/restore", (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    seedInitialMedia(store);
    const media = (store.media || []).find((m) => m.id === id);
    if (!media) {
      return res.status(404).json({ success: false, error: "Media item not found." });
    }

    media.is_trashed = false;
    media.deleted_at = null;
    media.deleted_by = null;

    saveFallbackStore(store);
    return res.json({
      success: true,
      message: `Media "${media.originalName || media.filename}" restored to library.`,
      media,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/media/:id/permanent (PERMANENT DELETE)
router.delete("/:id/permanent", (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    seedInitialMedia(store);
    const idx = (store.media || []).findIndex((m) => m.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: "Media item not found." });
    }

    const media = store.media[idx];
    const usage = calculateMediaUsage(media.url, store);

    // SAFETY CHECK: If still used by ACTIVE non-trashed items, prevent permanent file deletion
    // (unless force=true is supplied, matching the admin UI's override checkbox)
    if (usage.activeCount > 0 && req.query.force !== "true") {
      const activeNames = usage.usedBy
        .filter((u) => !u.is_trashed)
        .map((u) => `${u.name} (${u.type})`)
        .join(", ");
      return res.status(400).json({
        success: false,
        error: `Cannot permanently delete media. It is actively used by: ${activeNames}. Please reassign or delete referencing items first.`,
        usedBy: usage.usedBy.filter((u) => !u.is_trashed),
      });
    }

    // Safely delete physical file if local
    const fileResult = safeDeleteMediaFile(media, store);

    // Remove from database
    store.media.splice(idx, 1);
    saveFallbackStore(store);

    return res.json({
      success: true,
      message: `Media "${media.originalName || media.filename}" permanently deleted.`,
      fileResult,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
