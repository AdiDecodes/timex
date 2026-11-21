const express = require("express");
const router = express.Router();
const { getPool, isMysqlConnected, loadFallbackStore, saveFallbackStore } = require("../config/db");

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function countProductsForColor(colorName, colorSlug, products) {
  if (!Array.isArray(products) || !colorName) return 0;
  const nameLower = colorName.toLowerCase().trim();
  const slugLower = colorSlug ? colorSlug.toLowerCase().trim() : "";

  return products.filter((p) => {
    if (p.is_trashed) return false;
    const avail = Array.isArray(p.availableColors)
      ? p.availableColors.map((c) => String(c).toLowerCase().trim())
      : [];
    const mainCol = (p.color || "").toLowerCase().trim();

    return (
      avail.includes(nameLower) ||
      (slugLower && avail.includes(slugLower)) ||
      mainCol === nameLower ||
      (slugLower && mainCol === slugLower)
    );
  }).length;
}

// GET /api/v1/colors
router.get("/", async (req, res) => {
  try {
    const activeOnly = req.query.activeOnly === "true";
    const search = (req.query.search || "").toLowerCase().trim();

    if (isMysqlConnected()) {
      const pool = getPool();
      let sql = "SELECT * FROM colors WHERE 1=1";
      const params = [];

      if (activeOnly) {
        sql += " AND is_active = TRUE";
      }
      if (search) {
        sql += " AND (LOWER(name) LIKE ? OR LOWER(slug) LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
      }
      sql += " ORDER BY display_order ASC, name ASC";

      const [rows] = await pool.query(sql, params);

      // Get products for count
      const [prodRows] = await pool.query("SELECT id, color, available_colors_json, is_active FROM products");
      const productsForCount = prodRows.map((r) => {
        let avail = [];
        try {
          if (r.available_colors_json) avail = JSON.parse(r.available_colors_json);
        } catch (_) {}
        return {
          id: r.id,
          color: r.color,
          availableColors: avail,
          isActive: r.is_active,
        };
      });

      const colors = rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        hex: r.hex,
        isActive: Boolean(r.is_active),
        displayOrder: r.display_order,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        productCount: countProductsForColor(r.name, r.slug, productsForCount),
      }));

      return res.json({
        success: true,
        count: colors.length,
        colors,
      });
    }

    // Fallback Store
    const store = loadFallbackStore();
    let colors = Array.isArray(store.colors) ? [...store.colors] : [];
    const products = Array.isArray(store.products) ? store.products : [];

    if (activeOnly) {
      colors = colors.filter((c) => c.isActive !== false);
    }
    if (search) {
      colors = colors.filter(
        (c) =>
          c.name?.toLowerCase().includes(search) ||
          c.slug?.toLowerCase().includes(search)
      );
    }

    colors.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

    const enriched = colors.map((c) => ({
      ...c,
      isActive: c.isActive !== false,
      productCount: countProductsForColor(c.name, c.slug, products),
    }));

    return res.json({
      success: true,
      count: enriched.length,
      colors: enriched,
    });
  } catch (err) {
    console.error("GET /colors error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/colors/:id
router.get("/:id", async (req, res) => {
  try {
    const lookup = String(req.params.id).trim().toLowerCase();

    if (isMysqlConnected()) {
      const pool = getPool();
      const [rows] = await pool.query(
        "SELECT * FROM colors WHERE LOWER(id) = ? OR LOWER(slug) = ? LIMIT 1",
        [lookup, lookup]
      );
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Color not found" });
      }
      const r = rows[0];
      return res.json({
        success: true,
        color: {
          id: r.id,
          name: r.name,
          slug: r.slug,
          hex: r.hex,
          isActive: Boolean(r.is_active),
          displayOrder: r.display_order,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        },
      });
    }

    const store = loadFallbackStore();
    const color = (store.colors || []).find(
      (c) => c.id?.toLowerCase() === lookup || c.slug?.toLowerCase() === lookup
    );
    if (!color) {
      return res.status(404).json({ success: false, error: "Color not found" });
    }
    return res.json({ success: true, color });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/colors
router.post("/", async (req, res) => {
  try {
    const { name, slug, hex, isActive, displayOrder } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ success: false, error: "Color name is required" });
    }

    const trimmedName = name.trim();
    const finalSlug = slugify(slug || trimmedName);
    const finalHex = hex && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim()) ? hex.trim().toUpperCase() : (hex?.trim() || "#808080");
    const active = isActive !== undefined ? Boolean(isActive) : true;
    const order = Number.isInteger(Number(displayOrder)) ? Number(displayOrder) : 100;
    const id = `color-${finalSlug}-${Date.now().toString(36)}`;

    if (isMysqlConnected()) {
      const pool = getPool();
      // Check for duplicate name or slug
      const [existing] = await pool.query(
        "SELECT id, name, slug FROM colors WHERE LOWER(name) = ? OR LOWER(slug) = ? LIMIT 1",
        [trimmedName.toLowerCase(), finalSlug.toLowerCase()]
      );
      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          error: `A color with the name "${trimmedName}" or slug "${finalSlug}" already exists.`,
        });
      }

      await pool.query(
        `INSERT INTO colors (id, name, slug, hex, is_active, display_order, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [id, trimmedName, finalSlug, finalHex, active, order]
      );
    }

    // Always update fallback store
    const store = loadFallbackStore();
    if (!Array.isArray(store.colors)) {
      store.colors = [];
    }
    const duplicate = store.colors.find(
      (c) => c.name?.toLowerCase() === trimmedName.toLowerCase() || c.slug?.toLowerCase() === finalSlug.toLowerCase()
    );
    if (duplicate && !isMysqlConnected()) {
      return res.status(409).json({
        success: false,
        error: `A color with the name "${trimmedName}" or slug "${finalSlug}" already exists.`,
      });
    }

    const newColor = {
      id,
      name: trimmedName,
      slug: finalSlug,
      hex: finalHex,
      isActive: active,
      displayOrder: order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!duplicate) {
      store.colors.push(newColor);
      saveFallbackStore(store);
    }

    return res.status(201).json({
      success: true,
      color: newColor,
    });
  } catch (err) {
    console.error("POST /colors error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/colors/:id
router.put("/:id", async (req, res) => {
  try {
    const colorId = String(req.params.id).trim();
    const { name, slug, hex, isActive, displayOrder } = req.body;

    const trimmedName = name ? name.trim() : undefined;
    const finalSlug = slug ? slugify(slug) : (trimmedName ? slugify(trimmedName) : undefined);
    const finalHex = hex && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim()) ? hex.trim().toUpperCase() : hex?.trim();
    const active = isActive !== undefined ? Boolean(isActive) : undefined;
    const order = displayOrder !== undefined ? Number(displayOrder) : undefined;

    let previousName = null;

    if (isMysqlConnected()) {
      const pool = getPool();
      const [existing] = await pool.query("SELECT * FROM colors WHERE id = ? OR slug = ? LIMIT 1", [colorId, colorId]);
      if (existing.length === 0) {
        return res.status(404).json({ success: false, error: "Color not found" });
      }

      const current = existing[0];
      previousName = current.name;

      // Check conflict if name or slug changed
      if (trimmedName || finalSlug) {
        const [conflict] = await pool.query(
          "SELECT id FROM colors WHERE (LOWER(name) = ? OR LOWER(slug) = ?) AND id != ? LIMIT 1",
          [(trimmedName || current.name).toLowerCase(), (finalSlug || current.slug).toLowerCase(), current.id]
        );
        if (conflict.length > 0) {
          return res.status(409).json({ success: false, error: "Color name or slug is already in use by another color." });
        }
      }

      await pool.query(
        `UPDATE colors SET
          name = COALESCE(?, name),
          slug = COALESCE(?, slug),
          hex = COALESCE(?, hex),
          is_active = COALESCE(?, is_active),
          display_order = COALESCE(?, display_order),
          updated_at = NOW()
        WHERE id = ?`,
        [
          trimmedName !== undefined ? trimmedName : null,
          finalSlug !== undefined ? finalSlug : null,
          finalHex !== undefined ? finalHex : null,
          active !== undefined ? active : null,
          order !== undefined ? order : null,
          current.id,
        ]
      );
    }

    // Update fallback store
    const store = loadFallbackStore();
    if (!Array.isArray(store.colors)) {
      store.colors = [];
    }
    const idx = store.colors.findIndex((c) => c.id === colorId || c.slug === colorId);
    if (idx === -1 && !isMysqlConnected()) {
      return res.status(404).json({ success: false, error: "Color not found" });
    }

    let updatedColor = null;
    if (idx !== -1) {
      if (!previousName) previousName = store.colors[idx].name;
      store.colors[idx] = {
        ...store.colors[idx],
        name: trimmedName !== undefined ? trimmedName : store.colors[idx].name,
        slug: finalSlug !== undefined ? finalSlug : store.colors[idx].slug,
        hex: finalHex !== undefined ? finalHex : store.colors[idx].hex,
        isActive: active !== undefined ? active : store.colors[idx].isActive,
        displayOrder: order !== undefined ? order : store.colors[idx].displayOrder,
        updatedAt: new Date().toISOString(),
      };
      updatedColor = store.colors[idx];
      saveFallbackStore(store);
    }

    // If color name changed, update product assignments if necessary
    if (trimmedName && previousName && trimmedName !== previousName) {
      if (Array.isArray(store.products)) {
        let storeChanged = false;
        const affectedIds = [];
        store.products.forEach((p) => {
          if (Array.isArray(p.availableColors)) {
            const pIdx = p.availableColors.findIndex(
              (c) => c.toLowerCase() === previousName.toLowerCase()
            );
            if (pIdx !== -1) {
              p.availableColors[pIdx] = trimmedName;
              storeChanged = true;
            }
          }
          if (p.color && p.color.toLowerCase() === previousName.toLowerCase()) {
            p.color = trimmedName;
            storeChanged = true;
          }
          if (storeChanged) affectedIds.push(p.id);
        });
        if (storeChanged) {
          saveFallbackStore(store);

          // Mirror the rename into MySQL product rows
          if (isMysqlConnected()) {
            try {
              const pool = getPool();
              for (const pid of affectedIds) {
                const row = store.products.find((p) => p.id === pid);
                if (!row) continue;
                await pool.query(
                  "UPDATE products SET color = ?, available_colors_json = ?, updated_at = NOW() WHERE id = ?",
                  [
                    row.color || null,
                    JSON.stringify(row.availableColors || []),
                    pid,
                  ]
                );
              }
            } catch (_) {}
          }
        }
      }
    }

    return res.json({
      success: true,
      color: updatedColor || { id: colorId, name: trimmedName, slug: finalSlug, hex: finalHex, isActive: active },
    });
  } catch (err) {
    console.error("PUT /colors error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/colors/:id
router.delete("/:id", async (req, res) => {
  try {
    const colorId = String(req.params.id).trim();
    const force = req.query.force === "true";

    const store = loadFallbackStore();
    const products = Array.isArray(store.products) ? store.products : [];

    let targetColor = null;

    if (isMysqlConnected()) {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM colors WHERE id = ? OR slug = ? LIMIT 1", [colorId, colorId]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Color not found" });
      }
      targetColor = rows[0];

      // Safety check: count assigned products
      const assignedCount = countProductsForColor(targetColor.name, targetColor.slug, products);
      if (assignedCount > 0 && !force) {
        return res.status(400).json({
          success: false,
          error: `Cannot delete color "${targetColor.name}". It is currently assigned to ${assignedCount} product(s). Please remove it from products first or confirm force deletion.`,
          productCount: assignedCount,
        });
      }

      await pool.query("DELETE FROM colors WHERE id = ?", [targetColor.id]);
    }

    // Fallback store update
    if (Array.isArray(store.colors)) {
      const idx = store.colors.findIndex((c) => c.id === colorId || c.slug === colorId);
      if (idx !== -1) {
        if (!targetColor) targetColor = store.colors[idx];
        const assignedCount = countProductsForColor(targetColor.name, targetColor.slug, products);
        if (assignedCount > 0 && !force && !isMysqlConnected()) {
          return res.status(400).json({
            success: false,
            error: `Cannot delete color "${targetColor.name}". It is currently assigned to ${assignedCount} product(s). Please remove it from products first or confirm force deletion.`,
            productCount: assignedCount,
          });
        }
        store.colors.splice(idx, 1);
        saveFallbackStore(store);
      } else if (!isMysqlConnected()) {
        return res.status(404).json({ success: false, error: "Color not found" });
      }
    }

    return res.json({
      success: true,
      message: `Color "${targetColor?.name || colorId}" deleted successfully.`,
    });
  } catch (err) {
    console.error("DELETE /colors error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
