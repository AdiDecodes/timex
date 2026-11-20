const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { getPool, isMysqlConnected, loadFallbackStore, saveFallbackStore } = require("../config/db");
const { normalizeProduct } = require("./products.routes");

// Load default spaces seed
const DEFAULT_SPACES_PATH = path.join(__dirname, "../data/defaultSpaces.json");
let defaultSpaces = [];
try {
  if (fs.existsSync(DEFAULT_SPACES_PATH)) {
    defaultSpaces = JSON.parse(fs.readFileSync(DEFAULT_SPACES_PATH, "utf8"));
  }
} catch (e) {
  console.warn("Failed to read defaultSpaces.json:", e);
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  let trimmed = url.trim();
  if (!trimmed) return "";

  if (/^(localhost|127\.0\.0\.1)(:\d+)?\//i.test(trimmed)) {
    trimmed = "http://" + trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const host = parsed.hostname.toLowerCase();

      const isLocalOrTunnel =
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "0.0.0.0" ||
        /^192\.168\./.test(host) ||
        /^10\./.test(host) ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
        host.endsWith(".trycloudflare.com") ||
        host.endsWith(".loca.lt") ||
        host.endsWith(".ngrok-free.app") ||
        host.endsWith(".ngrok.io");

      if (isLocalOrTunnel) {
        return parsed.pathname + parsed.search;
      }

      if (parsed.pathname.startsWith("/uploads/")) {
        return parsed.pathname + parsed.search;
      }

      return trimmed;
    } catch (_) {
      return trimmed;
    }
  }

  if (trimmed.startsWith("uploads/") || trimmed.startsWith("images/")) {
    return "/" + trimmed;
  }

  return trimmed;
}

function ensureSpacesInitialized(store) {
  const LEGACY_OBSOLETE_SLUGS = new Set([
    "living-room-tiles",
    "dining-room-tiles",
    "elevation-tiles",
    "featured-wall-tiles",
    "cafe-tiles",
    "restaurant-tiles",
    "commercial-tiles",
    "office-tiles",
    "hotel-tiles",
    "outdoor-tiles",
    "parking-tiles",
  ]);

  if (Array.isArray(store.tiles_by_space)) {
    const beforeLen = store.tiles_by_space.length;
    store.tiles_by_space = store.tiles_by_space.filter(
      (s) => !LEGACY_OBSOLETE_SLUGS.has(s.slug)
    );
    if (store.tiles_by_space.length !== beforeLen) {
      saveFallbackStore(store);
    }
  }

  if (!Array.isArray(store.tiles_by_space) || store.tiles_by_space.length === 0) {
    store.tiles_by_space = JSON.parse(JSON.stringify(defaultSpaces)).map((s, idx) => ({
      ...s,
      status: s.status || "published",
      order: s.order !== undefined ? s.order : idx + 1,
    }));
    saveFallbackStore(store);
  } else {
    const deleted = new Set(Array.isArray(store.deleted_spaces) ? store.deleted_spaces : []);
    const existingSlugs = new Set(store.tiles_by_space.map((s) => s.slug));
    let added = false;
    for (const def of defaultSpaces) {
      if (!existingSlugs.has(def.slug) && !deleted.has(def.slug)) {
        store.tiles_by_space.push({
          ...def,
          status: def.status || "published",
          order: store.tiles_by_space.length + 1,
        });
        added = true;
      }
    }
    if (added) {
      saveFallbackStore(store);
    }
  }

  // Normalize image paths for all spaces in store
  let modified = false;
  if (Array.isArray(store.tiles_by_space)) {
    store.tiles_by_space.forEach((space) => {
      if (space.image) {
        const norm = normalizeImageUrl(space.image);
        if (norm !== space.image) {
          space.image = norm;
          modified = true;
        }
      }
      if (space.ogImage) {
        const norm = normalizeImageUrl(space.ogImage);
        if (norm !== space.ogImage) {
          space.ogImage = norm;
          modified = true;
        }
      }
    });
    if (modified) {
      saveFallbackStore(store);
    }
  }

  return store.tiles_by_space;
}

function matchesSpace(product, space) {
  const rawSpace = product.tilesBySpace || product.tiles_by_space || product.spaceArea || product.spaces || "";
  const sName = space.name.toLowerCase().trim();
  const sSlug = space.slug.toLowerCase().trim();
  const sBase = sName.replace(/\s+tiles$/, "");

  const spaceList = Array.isArray(rawSpace)
    ? rawSpace
    : String(rawSpace).split(",").map((s) => s.trim());

  return spaceList.some((entry) => {
    const pSpace = String(entry || "").toLowerCase().trim();
    if (!pSpace || pSpace === "not specified" || pSpace === "default / not specified") {
      return false;
    }
    const pBase = pSpace.replace(/\s+tiles$/, "");
    return (
      pSpace === sName ||
      pSpace === sBase ||
      pSpace === sSlug ||
      pBase === sBase ||
      (sSlug === "living-dining-room-tiles" && (pSpace.includes("living") || pSpace.includes("dining"))) ||
      (sSlug === "cafe-restaurant-tiles" && (pSpace.includes("cafe") || pSpace.includes("café") || pSpace.includes("restaurant"))) ||
      (sSlug === "commercial-office-tiles" && (pSpace.includes("commercial") || pSpace.includes("office"))) ||
      (sSlug === "elevation-exterior-tiles" && (pSpace.includes("elevation") || pSpace.includes("exterior") || pSpace.includes("featured wall"))) ||
      (sSlug === "hotel-hospitality-tiles" && (pSpace.includes("hotel") || pSpace.includes("hospitality"))) ||
      (sSlug === "outdoor-landscape-tiles" && (pSpace.includes("outdoor") || pSpace.includes("landscape") || pSpace.includes("parking"))) ||
      (sSlug === "spa-wellness-tiles" && (pSpace.includes("spa") || pSpace.includes("wellness"))) ||
      (sSlug === "balcony-terrace-tiles" && (pSpace.includes("balcony") || pSpace.includes("terrace")))
    );
  });
}

// GET /api/v1/spaces
router.get("/", (req, res) => {
  try {
    const store = loadFallbackStore();
    const spaces = ensureSpacesInitialized(store);
    const products = Array.isArray(store.products) ? store.products : [];

    // Calculate product counts dynamically for each space
    let withCounts = spaces.map((space, idx) => {
      const count = products.filter(
        (p) => !p.is_trashed && p.isActive !== false && p.is_active !== false && matchesSpace(p, space)
      ).length;
      return {
        ...space,
        status: space.status || "published",
        order: space.order !== undefined ? Number(space.order) : idx + 1,
        productCount: count,
      };
    });

    if (req.query.status === "published") {
      withCounts = withCounts.filter((s) => s.status === "published");
    }

    withCounts.sort((a, b) => (a.order || 0) - (b.order || 0));

    return res.json({ success: true, count: withCounts.length, spaces: withCounts });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/spaces/:slug
router.get("/:slug", (req, res) => {
  try {
    const store = loadFallbackStore();
    const spaces = ensureSpacesInitialized(store);
    const slug = req.params.slug.toLowerCase().trim();
    const space = spaces.find((s) => s.slug.toLowerCase() === slug || s.id === slug);

    if (!space) {
      return res.status(404).json({ success: false, error: `Space '${req.params.slug}' not found` });
    }

    const products = Array.isArray(store.products) ? store.products : [];
    const count = products.filter(
      (p) => !p.is_trashed && p.isActive !== false && p.is_active !== false && matchesSpace(p, space)
    ).length;

    return res.json({ success: true, space: { ...space, productCount: count } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/spaces/:slug/products
router.get("/:slug/products", async (req, res) => {
  try {
    const store = loadFallbackStore();
    const spaces = ensureSpacesInitialized(store);
    const slug = req.params.slug.toLowerCase().trim();
    const space = spaces.find((s) => s.slug.toLowerCase() === slug || s.id === slug);

    if (!space) {
      return res.status(404).json({ success: false, error: `Space '${req.params.slug}' not found` });
    }

    let allProducts = [];
    if (isMysqlConnected()) {
      try {
        const pool = getPool();
        const [rows] = await pool.query("SELECT * FROM products WHERE is_active = TRUE ORDER BY updated_at DESC");
        allProducts = rows.map((r) => {
          const imgs = r.images_json ? JSON.parse(r.images_json) : [];
          let spImgs = {};
          try {
            if (r.space_images_json) spImgs = JSON.parse(r.space_images_json);
          } catch (_) {}
          return normalizeProduct({ ...r, images: imgs, spaceImages: spImgs });
        });
      } catch (dbErr) {
        console.warn("Error querying products from MySQL in space products route:", dbErr.message);
        allProducts = (store.products || []).map((p) => normalizeProduct(p));
      }
    } else {
      allProducts = (store.products || []).map((p) => normalizeProduct(p));
    }

    const matchingProducts = allProducts.filter(
      (p) => !p.is_trashed && p.isActive !== false && p.is_active !== false && matchesSpace(p, space)
    );

    return res.json({
      success: true,
      space: space,
      count: matchingProducts.length,
      products: matchingProducts,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/spaces (create new space)
router.post("/", (req, res) => {
  try {
    const raw = req.body || {};
    if (!raw.name || !raw.name.trim()) {
      return res.status(400).json({ success: false, error: "Space name is required." });
    }

    let cleanName = raw.name.trim();
    if (!cleanName.toLowerCase().endsWith("tiles") && !cleanName.toLowerCase().includes("tiles")) {
      cleanName = `${cleanName} Tiles`;
    }
    const slug = slugify(raw.slug || cleanName);
    const id = `space-${slug}`;

    const store = loadFallbackStore();
    const spaces = ensureSpacesInitialized(store);

    const exists = spaces.find((s) => s.slug.toLowerCase() === slug || s.id === id);
    if (exists) {
      return res.status(409).json({ success: false, error: "A space with this name or slug already exists." });
    }

    const newSpace = {
      id,
      name: cleanName,
      slug,
      spaceArea: raw.spaceArea ? raw.spaceArea.trim() : cleanName,
      pageTitle: raw.pageTitle ? raw.pageTitle.trim() : `${cleanName} | Luxury Tiles | Timex Ceramic`,
      description: raw.description ? raw.description.trim() : `Explore premium architectural tiles designed specifically for ${cleanName.replace(/\s+Tiles$/i, "")}.`,
      image: raw.image ? normalizeImageUrl(raw.image) : "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      mediaId: raw.mediaId || "",
      status: raw.status === "draft" ? "draft" : "published",
      order: raw.order !== undefined ? Number(raw.order) : spaces.length + 1,
      seoTitle: raw.seoTitle ? raw.seoTitle.trim() : `${cleanName} - Premium Tiles | Timex Ceramic`,
      metaDescription: raw.metaDescription ? raw.metaDescription.trim() : `Discover durable and aesthetic ${cleanName.toLowerCase()} crafted for luxury modern spaces.`,
      focusKeyword: raw.focusKeyword ? raw.focusKeyword.trim() : cleanName.toLowerCase(),
      secondaryKeywords: raw.secondaryKeywords ? raw.secondaryKeywords.trim() : "",
      canonicalUrl: raw.canonicalUrl ? raw.canonicalUrl.trim() : `https://timexceramic.com/${slug}`,
      robotsIndex: raw.robotsIndex !== undefined ? Boolean(raw.robotsIndex) : true,
      robotsFollow: raw.robotsFollow !== undefined ? Boolean(raw.robotsFollow) : true,
      ogTitle: raw.ogTitle ? raw.ogTitle.trim() : (raw.seoTitle || `${cleanName} - Premium Tiles`),
      ogDescription: raw.ogDescription ? raw.ogDescription.trim() : (raw.metaDescription || ""),
      ogImage: raw.ogImage ? normalizeImageUrl(raw.ogImage) : (raw.image ? normalizeImageUrl(raw.image) : ""),
      schemaType: raw.schemaType || "CollectionPage",
      schemaData: raw.schemaData || "",
      seoScore: raw.seoScore !== undefined ? Number(raw.seoScore) : 85,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    spaces.push(newSpace);
    store.tiles_by_space = spaces;

    // Also track in custom_spaces
    if (!Array.isArray(store.custom_spaces)) {
      store.custom_spaces = [];
    }
    if (!store.custom_spaces.includes(cleanName)) {
      store.custom_spaces.push(cleanName);
    }

    saveFallbackStore(store);

    return res.status(201).json({ success: true, space: newSpace, message: "Space created successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/spaces/:slug
router.put("/:slug", (req, res) => {
  try {
    const store = loadFallbackStore();
    const spaces = ensureSpacesInitialized(store);
    const slug = req.params.slug.toLowerCase().trim();
    const idx = spaces.findIndex((s) => s.slug.toLowerCase() === slug || s.id === slug);

    if (idx === -1) {
      return res.status(404).json({ success: false, error: `Space '${req.params.slug}' not found` });
    }

    const current = spaces[idx];
    const raw = req.body || {};

    const updated = {
      ...current,
      name: raw.name !== undefined ? raw.name.trim() : current.name,
      slug: raw.slug !== undefined ? slugify(raw.slug.trim()) : current.slug,
      status: raw.status !== undefined ? (raw.status === "draft" ? "draft" : "published") : (current.status || "published"),
      order: raw.order !== undefined ? Number(raw.order) : (current.order || idx + 1),
      pageTitle: raw.pageTitle !== undefined ? raw.pageTitle.trim() : current.pageTitle,
      description: raw.description !== undefined ? raw.description.trim() : current.description,
      image: raw.image !== undefined ? normalizeImageUrl(raw.image) : normalizeImageUrl(current.image),
      mediaId: raw.mediaId !== undefined ? raw.mediaId : (current.mediaId || ""),
      seoTitle: raw.seoTitle !== undefined ? raw.seoTitle.trim() : current.seoTitle,
      metaDescription: raw.metaDescription !== undefined ? raw.metaDescription.trim() : current.metaDescription,
      focusKeyword: raw.focusKeyword !== undefined ? raw.focusKeyword.trim() : current.focusKeyword,
      secondaryKeywords: raw.secondaryKeywords !== undefined ? raw.secondaryKeywords.trim() : current.secondaryKeywords,
      canonicalUrl: raw.canonicalUrl !== undefined ? raw.canonicalUrl.trim() : current.canonicalUrl,
      robotsIndex: raw.robotsIndex !== undefined ? Boolean(raw.robotsIndex) : current.robotsIndex,
      robotsFollow: raw.robotsFollow !== undefined ? Boolean(raw.robotsFollow) : current.robotsFollow,
      ogTitle: raw.ogTitle !== undefined ? raw.ogTitle.trim() : current.ogTitle,
      ogDescription: raw.ogDescription !== undefined ? raw.ogDescription.trim() : current.ogDescription,
      ogImage: raw.ogImage !== undefined ? normalizeImageUrl(raw.ogImage) : normalizeImageUrl(raw.image || current.ogImage),
      schemaType: raw.schemaType !== undefined ? raw.schemaType.trim() : current.schemaType,
      schemaData: raw.schemaData !== undefined ? raw.schemaData : current.schemaData,
      seoScore: raw.seoScore !== undefined ? Number(raw.seoScore) : current.seoScore,
      updatedAt: new Date().toISOString(),
    };

    spaces[idx] = updated;
    store.tiles_by_space = spaces;
    saveFallbackStore(store);

    return res.json({ success: true, space: updated, message: "Space updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/spaces/:slug (with delete protection)
router.delete("/:slug", (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    const force = req.query.force === "true" || req.body?.force === true;
    const store = loadFallbackStore();
    const spaces = ensureSpacesInitialized(store);

    const idx = spaces.findIndex((s) => s.slug.toLowerCase() === slug || s.id === slug);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: `Space '${req.params.slug}' not found` });
    }

    const space = spaces[idx];
    const products = Array.isArray(store.products) ? store.products : [];
    const matchingProductsCount = products.filter(
      (p) => !p.is_trashed && p.isActive !== false && p.is_active !== false && matchesSpace(p, space)
    ).length;

    if (!force && matchingProductsCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete '${space.name}'. It is linked to ${matchingProductsCount} product(s).`,
        productCount: matchingProductsCount,
        space: space,
        requiresConfirmation: true,
      });
    }

    spaces.splice(idx, 1);
    store.tiles_by_space = spaces;

    if (!Array.isArray(store.deleted_spaces)) {
      store.deleted_spaces = [];
    }
    if (!store.deleted_spaces.includes(space.slug)) {
      store.deleted_spaces.push(space.slug);
    }

    if (Array.isArray(store.custom_spaces)) {
      store.custom_spaces = store.custom_spaces.filter((s) => s.toLowerCase() !== space.name.toLowerCase());
    }

    saveFallbackStore(store);

    return res.json({
      success: true,
      message: `Space '${space.name}' deleted successfully. Associated products remain intact.`,
      space,
      unassignedProducts: matchingProductsCount,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
