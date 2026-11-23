const express = require("express");
const router = express.Router();
const { getPool, isMysqlConnected, loadFallbackStore, saveFallbackStore } = require("../config/db");

function extractYouTubeId(url) {
  const m = url.match(/(?:shorts\/|v\/|watch\?v=|embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function extractInstagramShortcode(url) {
  const m = url.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

// GET /api/v1/videos
router.get("/", (req, res) => {
  try {
    const store = loadFallbackStore();
    let videos = Array.isArray(store.videos) ? store.videos : [];

    // Filter out trashed unless requested
    if (req.query.include_trashed !== "true") {
      videos = videos.filter((v) => !v.is_trashed);
    }

    // Filter by platform
    if (req.query.platform) {
      const p = String(req.query.platform).toLowerCase();
      videos = videos.filter((v) => v.platform?.toLowerCase() === p);
    }

    // Filter by category
    if (req.query.category && req.query.category !== "ALL VIDEOS") {
      const c = String(req.query.category).toUpperCase();
      videos = videos.filter((v) => Array.isArray(v.categories) && v.categories.includes(c));
    }

    // Filter by status
    if (req.query.status) {
      videos = videos.filter((v) => v.status === req.query.status);
    }

    // Sort by order ascending
    videos.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    return res.json({
      success: true,
      total: videos.length,
      data: videos,
    });
  } catch (err) {
    console.error("Error fetching videos:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/videos/:id
router.get("/:id", (req, res) => {
  try {
    const store = loadFallbackStore();
    const videos = Array.isArray(store.videos) ? store.videos : [];
    const video = videos.find((v) => v.id === req.params.id || String(v.order) === req.params.id);

    if (!video) {
      return res.status(404).json({ success: false, error: "Video not found" });
    }

    return res.json({ success: true, data: video });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/videos (Add new video)
router.post("/", async (req, res) => {
  try {
    const { url, categories = ["PRODUCT HIGHLIGHTS"], status = "published" } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ success: false, error: "A valid video URL is required." });
    }

    const store = loadFallbackStore();
    store.videos = Array.isArray(store.videos) ? store.videos : [];

    // Duplicate check
    const cleanUrl = url.replace(/\?.*$/, "").replace(/\/$/, "");
    const existing = store.videos.find((v) => {
      const vClean = (v.url || "").replace(/\?.*$/, "").replace(/\/$/, "");
      return vClean === cleanUrl;
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: "A video with this URL already exists.",
        data: existing,
      });
    }

    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
    const isInstagram = url.includes("instagram.com");

    if (!isYouTube && !isInstagram) {
      return res.status(400).json({
        success: false,
        error: "URL must be a valid YouTube Shorts or Instagram Reel/Post URL.",
      });
    }

    const newOrder = store.videos.length > 0
      ? Math.max(...store.videos.map((v) => Number(v.order) || 0)) + 1
      : 1;

    let newEntry;
    if (isYouTube) {
      const videoId = extractYouTubeId(url);
      if (!videoId) {
        return res.status(400).json({ success: false, error: "Could not extract YouTube video ID." });
      }
      newEntry = {
        id: `wac-yt-${Date.now()}`,
        order: newOrder,
        platform: "YouTube",
        post_type: "Short",
        url,
        video_id: videoId,
        categories: Array.isArray(categories) ? categories : [categories],
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        hq_thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        embed_url: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
        status,
        is_trashed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      const shortcode = extractInstagramShortcode(url);
      const isReel = url.includes("/reel/");
      if (!shortcode) {
        return res.status(400).json({ success: false, error: "Could not extract Instagram shortcode." });
      }
      newEntry = {
        id: `wac-ig-${Date.now()}`,
        order: newOrder,
        platform: "Instagram",
        post_type: isReel ? "Reel" : "Post",
        url,
        shortcode,
        categories: Array.isArray(categories) ? categories : [categories],
        thumbnail: `/images/instagram/${shortcode}.jpg`,
        embed_url: `https://www.instagram.com/${isReel ? "reel" : "p"}/${shortcode}/embed/`,
        status,
        is_trashed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    store.videos.push(newEntry);
    saveFallbackStore(store);

    if (isMysqlConnected()) {
      try {
        const pool = getPool();
        await pool.query(
          `INSERT INTO videos (
            id, display_order, platform, post_type, url, video_id, shortcode,
            categories_json, thumbnail, hq_thumbnail, embed_url, status, is_trashed, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            display_order = VALUES(display_order), platform = VALUES(platform),
            post_type = VALUES(post_type), url = VALUES(url), video_id = VALUES(video_id),
            shortcode = VALUES(shortcode), categories_json = VALUES(categories_json),
            thumbnail = VALUES(thumbnail), hq_thumbnail = VALUES(hq_thumbnail),
            embed_url = VALUES(embed_url), status = VALUES(status),
            is_trashed = VALUES(is_trashed), updated_at = NOW()`,
          [
            newEntry.id, newEntry.order || 1, newEntry.platform || "YouTube", newEntry.post_type || "Short",
            newEntry.url, newEntry.video_id || null, newEntry.shortcode || null, JSON.stringify(newEntry.categories || []),
            newEntry.thumbnail || null, newEntry.hq_thumbnail || null, newEntry.embed_url || null,
            newEntry.status || "published", false
          ]
        );
      } catch (dbErr) {
        console.warn("[Database] Could not sync video to MySQL:", dbErr.message);
      }
    }

    return res.status(201).json({ success: true, data: newEntry });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/videos/:id (Update video)
router.put("/:id", async (req, res) => {
  try {
    const store = loadFallbackStore();
    store.videos = Array.isArray(store.videos) ? store.videos : [];
    const idx = store.videos.findIndex((v) => v.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({ success: false, error: "Video not found" });
    }

    const current = store.videos[idx];
    const { categories, status, order } = req.body;

    if (Array.isArray(categories)) current.categories = categories;
    if (status) current.status = status;
    if (order !== undefined) current.order = Number(order) || current.order;
    current.updated_at = new Date().toISOString();

    store.videos[idx] = current;
    saveFallbackStore(store);

    if (isMysqlConnected()) {
      try {
        const pool = getPool();
        await pool.query(
          `UPDATE videos SET
            display_order = ?, categories_json = ?, status = ?, updated_at = NOW()
           WHERE id = ?`,
          [current.order || 1, JSON.stringify(current.categories || []), current.status || "published", current.id]
        );
      } catch (_) {}
    }

    return res.json({ success: true, data: current });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/videos/:id (Soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const store = loadFallbackStore();
    store.videos = Array.isArray(store.videos) ? store.videos : [];
    const idx = store.videos.findIndex((v) => v.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({ success: false, error: "Video not found" });
    }

    store.videos[idx].is_trashed = true;
    store.videos[idx].updated_at = new Date().toISOString();
    saveFallbackStore(store);

    if (isMysqlConnected()) {
      try {
        const pool = getPool();
        await pool.query("UPDATE videos SET is_trashed = TRUE, updated_at = NOW() WHERE id = ?", [req.params.id]);
      } catch (_) {}
    }

    return res.json({ success: true, message: "Video moved to trash" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
