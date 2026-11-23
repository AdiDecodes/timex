const express = require("express");
const router = express.Router();
const { getPool, isMysqlConnected, loadFallbackStore, saveFallbackStore } = require("../config/db");
const {
  calculateMediaUsage,
  safeDeleteMediaFile,
  seedInitialMedia,
} = require("../utils/mediaHelper");

// GET /api/v1/trash
router.get("/", (req, res) => {
  try {
    const store = loadFallbackStore();
    seedInitialMedia(store);

    const trashedProducts = (store.products || [])
      .filter((p) => Boolean(p.is_trashed))
      .map((p) => {
        const previewUrl = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "";
        return {
          id: p.id,
          name: p.name,
          type: "Product",
          originalCategory: p.category || p.category_name || "Brick",
          deleted_at: p.deleted_at || p.updated_at || new Date().toISOString(),
          deleted_by: p.deleted_by || "admin",
          previewUrl,
          slug: p.slug,
          code: p.code,
          details: {
            size: p.size,
            finish: p.finish,
            material: p.material,
            price: p.price,
            imagesCount: Array.isArray(p.images) ? p.images.length : 0,
          },
        };
      });

    const trashedBlogs = (store.blogs || [])
      .filter((b) => Boolean(b.is_trashed))
      .map((b) => ({
        id: b.id || b.slug,
        name: b.title,
        type: "Blog",
        originalCategory: b.category || "TRENDS",
        deleted_at: b.deleted_at || b.updatedAt || new Date().toISOString(),
        deleted_by: b.deleted_by || "admin",
        previewUrl: b.coverImage || "",
        slug: b.slug,
        details: {
          author: b.author?.name || "Editorial",
          readTime: b.readTime,
        },
      }));

    const trashedMedia = (store.media || [])
      .filter((m) => Boolean(m.is_trashed))
      .map((m) => {
        const usage = calculateMediaUsage(m.url, store);
        const activeRefs = usage.usedBy.filter((u) => !u.is_trashed);
        return {
          id: m.id,
          name: m.originalName || m.filename,
          type: "Media",
          originalCategory: m.fileType.toUpperCase(),
          deleted_at: m.deleted_at || m.uploadedAt || new Date().toISOString(),
          deleted_by: m.deleted_by || "admin",
          previewUrl: m.url,
          details: {
            filename: m.filename,
            size: m.size,
            mimeType: m.mimeType,
            dimensions: m.dimensions,
          },
          usedByCount: usage.count,
          usedByNames: activeRefs.map((u) => `${u.name} (${u.type})`),
          safeToDelete: activeRefs.length === 0,
        };
      });

    const trashedPages = (store.pages || [])
      .filter((p) => Boolean(p.is_trashed))
      .map((p) => ({
        id: p.id,
        name: p.title,
        type: "Page",
        originalCategory: "Site Page",
        deleted_at: p.deleted_at || new Date().toISOString(),
        deleted_by: p.deleted_by || "admin",
        slug: p.slug || p.path,
        details: {
          path: p.path,
          template: p.template || "Standard",
        },
      }));

    const allTrashed = [
      ...trashedProducts,
      ...trashedBlogs,
      ...trashedMedia,
      ...trashedPages,
    ].sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());

    // Optional type filter (admin tabs send "products" | "blogs" | "media" | "pages")
    const typeFilter = (req.query.type || "").toString().toLowerCase().replace(/s$/, "");
    const filtered =
      typeFilter && typeFilter !== "all"
        ? allTrashed.filter((item) => item.type.toLowerCase() === typeFilter)
        : allTrashed;

    const stats = {
      total: allTrashed.length,
      products: trashedProducts.length,
      blogs: trashedBlogs.length,
      media: trashedMedia.length,
      pages: trashedPages.length,
    };

    return res.json({
      success: true,
      count: filtered.length,
      items: filtered,
      stats,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/trash/restore
router.post("/restore", async (req, res) => {
  const { type, id } = req.body;
  if (!type || !id) {
    return res.status(400).json({ success: false, error: "Item type and ID are required." });
  }

  try {
    const store = loadFallbackStore();
    seedInitialMedia(store);

    if (type === "Product") {
      const prod = (store.products || []).find((p) => p.id === id || p.slug === id);
      if (!prod) return res.status(404).json({ success: false, error: "Product not found in Recycle Bin." });

      prod.is_trashed = false;
      prod.is_active = true;
      prod.deleted_at = null;
      prod.deleted_by = null;

      if (isMysqlConnected()) {
        try {
          const pool = getPool();
          await pool.query(
            "UPDATE products SET is_trashed = FALSE, is_active = TRUE WHERE id = ? OR slug = ?",
            [id, id]
          );
        } catch (_) {}
      }

      // Restore any media attached to this product that were trashed
      if (Array.isArray(prod.images)) {
        (store.media || []).forEach((m) => {
          if (m.is_trashed && prod.images.includes(m.url)) {
            m.is_trashed = false;
            m.deleted_at = null;
            m.deleted_by = null;
          }
        });
      }

      saveFallbackStore(store);
      return res.json({ success: true, message: `Product "${prod.name}" restored successfully.`, item: prod });
    }

    if (type === "Blog") {
      const blog = (store.blogs || []).find((b) => b.id === id || b.slug === id);
      if (!blog) return res.status(404).json({ success: false, error: "Blog post not found in Recycle Bin." });

      blog.is_trashed = false;
      blog.status = "Published";
      blog.deleted_at = null;
      blog.deleted_by = null;

      if (isMysqlConnected()) {
        try {
          const pool = getPool();
          await pool.query(
            "UPDATE blogs SET is_trashed = FALSE, status = 'Published' WHERE id = ? OR slug = ?",
            [id, id]
          );
        } catch (_) {}
      }

      // Restore cover image if it was trashed
      if (blog.coverImage) {
        (store.media || []).forEach((m) => {
          if (m.is_trashed && m.url === blog.coverImage) {
            m.is_trashed = false;
            m.deleted_at = null;
          }
        });
      }

      saveFallbackStore(store);
      return res.json({ success: true, message: `Blog post "${blog.title}" restored successfully.`, item: blog });
    }

    if (type === "Media") {
      const media = (store.media || []).find((m) => m.id === id);
      if (!media) return res.status(404).json({ success: false, error: "Media item not found in Recycle Bin." });

      media.is_trashed = false;
      media.deleted_at = null;
      media.deleted_by = null;

      saveFallbackStore(store);
      return res.json({ success: true, message: `Media "${media.originalName || media.filename}" restored successfully.`, item: media });
    }

    if (type === "Page") {
      const page = (store.pages || []).find((p) => p.id === id || p.slug === id);
      if (!page) return res.status(404).json({ success: false, error: "Page not found in Recycle Bin." });

      page.is_trashed = false;
      page.deleted_at = null;
      page.deleted_by = null;

      saveFallbackStore(store);
      return res.json({ success: true, message: `Page "${page.title}" restored successfully.`, item: page });
    }

    return res.status(400).json({ success: false, error: `Unsupported item type: ${type}` });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/trash/permanent
router.delete("/permanent", async (req, res) => {
  const { type, id } = req.body;
  if (!type || !id) {
    return res.status(400).json({ success: false, error: "Item type and ID are required." });
  }

  try {
    const store = loadFallbackStore();
    seedInitialMedia(store);

    if (type === "Product") {
      const idx = (store.products || []).findIndex((p) => p.id === id || p.slug === id);
      if (idx === -1) return res.status(404).json({ success: false, error: "Product not found in Recycle Bin." });

      const prod = store.products[idx];
      const prodImages = Array.isArray(prod.images) ? [...prod.images] : [];

      // Remove product record
      store.products.splice(idx, 1);

      // Remove the MySQL row as well (plain row delete, no schema dependency)
      if (isMysqlConnected()) {
        try {
          const pool = getPool();
          await pool.query("DELETE FROM products WHERE id = ? OR slug = ?", [prod.id, prod.slug]);
        } catch (_) {}
      }

      // Check attached media: If an image was ONLY used by this deleted product, delete it permanently
      const cleanedFiles = [];
      for (const imgUrl of prodImages) {
        const usage = calculateMediaUsage(imgUrl, store);
        if (usage.activeCount === 0) {
          // Find media record
          const mIdx = (store.media || []).findIndex((m) => m.url === imgUrl);
          if (mIdx !== -1) {
            const m = store.media[mIdx];
            safeDeleteMediaFile(m, store);
            store.media.splice(mIdx, 1);
            cleanedFiles.push(m.filename);
          }
        }
      }

      saveFallbackStore(store);
      return res.json({
        success: true,
        message: `Product "${prod.name}" permanently deleted.`,
        cleanedAttachedMedia: cleanedFiles,
      });
    }

    if (type === "Blog") {
      const idx = (store.blogs || []).findIndex((b) => b.id === id || b.slug === id);
      if (idx === -1) return res.status(404).json({ success: false, error: "Blog post not found in Recycle Bin." });

      const blog = store.blogs[idx];
      store.blogs.splice(idx, 1);
      saveFallbackStore(store);

      return res.json({ success: true, message: `Blog post "${blog.title}" permanently deleted.` });
    }

    if (type === "Media") {
      const idx = (store.media || []).findIndex((m) => m.id === id);
      if (idx === -1) return res.status(404).json({ success: false, error: "Media item not found in Recycle Bin." });

      const media = store.media[idx];
      const usage = calculateMediaUsage(media.url, store);

      // Block permanent deletion if active references exist (unless force=true)
      if (usage.activeCount > 0 && req.body?.force !== true) {
        const activeNames = usage.usedBy
          .filter((u) => !u.is_trashed)
          .map((u) => `${u.name} (${u.type})`)
          .join(", ");
        return res.status(400).json({
          success: false,
          error: `Cannot permanently delete media. It is actively used by: ${activeNames}.`,
        });
      }

      safeDeleteMediaFile(media, store);
      store.media.splice(idx, 1);
      saveFallbackStore(store);

      return res.json({ success: true, message: `Media "${media.originalName || media.filename}" permanently deleted.` });
    }

    if (type === "Page") {
      const idx = (store.pages || []).findIndex((p) => p.id === id || p.slug === id);
      if (idx === -1) return res.status(404).json({ success: false, error: "Page not found in Recycle Bin." });

      const page = store.pages[idx];
      store.pages.splice(idx, 1);
      saveFallbackStore(store);

      return res.json({ success: true, message: `Page "${page.title}" permanently deleted.` });
    }

    return res.status(400).json({ success: false, error: `Unsupported item type: ${type}` });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/trash/empty (Empty Recycle Bin)
// Optional body { type: "products"|"blogs"|"media"|"pages" } — empties only that type; omits = everything.
router.post("/empty", async (req, res) => {
  try {
    const store = loadFallbackStore();
    seedInitialMedia(store);

    const rawType = (req.body?.type || "").toString().toLowerCase().replace(/s$/, "");
    const shouldDelete = (entityType) => !rawType || rawType === "all" || entityType === rawType;

    let deletedCount = 0;

    // 1. Delete trashed products
    if (shouldDelete("product")) {
      const remainingProducts = (store.products || []).filter((p) => {
        if (p.is_trashed) {
          deletedCount++;
          return false;
        }
        return true;
      });
      store.products = remainingProducts;
    }

    // 2. Delete trashed blogs
    if (shouldDelete("blog")) {
      const remainingBlogs = (store.blogs || []).filter((b) => {
        if (b.is_trashed) {
          deletedCount++;
          return false;
        }
        return true;
      });
      store.blogs = remainingBlogs;
    }

    // 3. Delete trashed media safely (only if not used by active items)
    if (shouldDelete("media")) {
      const remainingMedia = (store.media || []).filter((m) => {
        if (m.is_trashed) {
          const usage = calculateMediaUsage(m.url, store);
          if (usage.activeCount === 0) {
            safeDeleteMediaFile(m, store);
            deletedCount++;
            return false;
          }
        }
        return true;
      });
      store.media = remainingMedia;
    }

    // 4. Delete trashed pages
    if (shouldDelete("page")) {
      const remainingPages = (store.pages || []).filter((p) => {
        if (p.is_trashed) {
          deletedCount++;
          return false;
        }
        return true;
      });
      store.pages = remainingPages;
    }

    saveFallbackStore(store);
    return res.json({
      success: true,
      message: `Recycle Bin emptied successfully (${deletedCount} items permanently removed).`,
      count: deletedCount,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
