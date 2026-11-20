const express = require("express");
const router = express.Router();
const { getPool, isMysqlConnected, loadFallbackStore, saveFallbackStore } = require("../config/db");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseMysqlBlog(r) {
  return {
    ...r,
    author: {
      name: r.author_name || "Timex Design Editorial",
      role: r.author_role || "Senior Tile Architect",
      avatar: r.author_avatar || "",
    },
    coverImage: r.cover_image,
    content: r.content_json ? JSON.parse(r.content_json) : { intro: r.excerpt || "", sections: [] },
    tags: r.tags_json ? JSON.parse(r.tags_json) : [r.category || "TILES"],
    readTime: r.read_time,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// GET /api/v1/blogs
router.get("/", async (req, res) => {
  const allowTrashed = req.query.includeTrashed === "true";

  try {
    if (isMysqlConnected()) {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM blogs ORDER BY created_at DESC");
      let blogs = rows.map(parseMysqlBlog);
      if (!allowTrashed) {
        blogs = blogs.filter((b) => !b.is_trashed);
      }
      return res.json({ success: true, count: blogs.length, blogs });
    }

    const store = loadFallbackStore();
    let blogs = store.blogs || [];
    if (!allowTrashed) {
      blogs = blogs.filter((b) => !b.is_trashed);
    }
    return res.json({ success: true, count: blogs.length, blogs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/blogs/:slug
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const norm = slug.toLowerCase().trim();
  const allowTrashed = req.query.includeTrashed === "true";

  try {
    if (isMysqlConnected()) {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM blogs WHERE LOWER(slug) = ? OR LOWER(id) = ? LIMIT 1", [norm, norm]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Blog post not found." });
      }
      const blog = parseMysqlBlog(rows[0]);
      if (blog.is_trashed && !allowTrashed) {
        return res.status(404).json({ success: false, error: "Blog post not found." });
      }
      return res.json({ success: true, blog });
    }

    const store = loadFallbackStore();
    const blog = (store.blogs || []).find((b) => b.slug?.toLowerCase().trim() === norm || b.id?.toLowerCase().trim() === norm);
    if (!blog || (blog.is_trashed && !allowTrashed)) {
      return res.status(404).json({ success: false, error: "Blog post not found." });
    }
    return res.json({ success: true, blog });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/blogs
router.post("/", async (req, res) => {
  const data = req.body;
  if (!data.title || !data.title.trim()) {
    return res.status(400).json({ success: false, error: "Blog title is required." });
  }

  try {
    const store = loadFallbackStore();
    const blogs = store.blogs || [];
    const baseSlug = data.slug ? slugify(data.slug) : slugify(data.title);

    let candidateSlug = baseSlug;
    let counter = 1;
    while (blogs.some((b) => b.slug === candidateSlug)) {
      candidateSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newBlog = {
      ...data,
      id: data.id || `blog-${Date.now()}`,
      slug: candidateSlug,
      title: data.title.trim(),
      subtitle: data.subtitle || "",
      category: data.category || "DESIGN TIPS",
      date: data.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: data.readTime || "5 Min Read",
      author: data.author || {
        name: data.authorName || "Timex Design Editorial",
        role: data.authorRole || "Senior Tile Architect",
        avatar: data.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      },
      coverImage: data.coverImage || "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
      excerpt: data.excerpt || "",
      content: data.content || {
        intro: data.excerpt || "",
        sections: [{ heading: "1. Overview", body: [data.excerpt || ""] }],
        keyTakeaways: ["High quality ceramic tiles", "Expert design insights"],
      },
      tags: Array.isArray(data.tags) ? data.tags : [data.category || "TILES"],
      status: data.status || "Published",
      metaTitle: data.metaTitle || `${data.title} | Timex Ceramic Blog`,
      metaDescription: data.metaDescription || data.excerpt || "",
      keywords: data.keywords || `${data.title}, ${data.category}, tiles, timex ceramic`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isMysqlConnected()) {
      const pool = getPool();
      await pool.query(
        `INSERT INTO blogs (
          id, slug, title, subtitle, category, author_name, author_role, author_avatar,
          cover_image, excerpt, content_json, tags_json, status, read_time, meta_title,
          meta_description, keywords
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newBlog.id, newBlog.slug, newBlog.title, newBlog.subtitle, newBlog.category,
          newBlog.author.name, newBlog.author.role, newBlog.author.avatar,
          newBlog.coverImage, newBlog.excerpt,
          JSON.stringify(newBlog.content), JSON.stringify(newBlog.tags),
          newBlog.status, newBlog.readTime, newBlog.metaTitle,
          newBlog.metaDescription, newBlog.keywords
        ]
      );
    }

    store.blogs = [newBlog, ...blogs];
    saveFallbackStore(store);

    return res.status(201).json({ success: true, blog: newBlog });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/blogs/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const store = loadFallbackStore();
    const blogs = store.blogs || [];
    const idx = blogs.findIndex((b) => b.id === id || b.slug === id);

    if (idx === -1) {
      return res.status(404).json({ success: false, error: "Blog post not found." });
    }

    const current = blogs[idx];
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      slug: updates.slug ? slugify(updates.slug) : current.slug,
      updatedAt: new Date().toISOString(),
    };

    if (isMysqlConnected()) {
      const pool = getPool();
      await pool.query(
        `UPDATE blogs SET
          slug = ?, title = ?, subtitle = ?, category = ?, author_name = ?, author_role = ?,
          author_avatar = ?, cover_image = ?, excerpt = ?, content_json = ?, tags_json = ?,
          status = ?, read_time = ?, meta_title = ?, meta_description = ?, keywords = ?
        WHERE id = ?`,
        [
          updated.slug, updated.title, updated.subtitle || "", updated.category || "DESIGN TIPS",
          updated.author?.name || current.author?.name, updated.author?.role || current.author?.role,
          updated.author?.avatar || current.author?.avatar, updated.coverImage || current.coverImage,
          updated.excerpt || "", JSON.stringify(updated.content || current.content),
          JSON.stringify(updated.tags || current.tags), updated.status || "Published",
          updated.readTime || "5 Min Read", updated.metaTitle || `${updated.title} | Timex Ceramic Blog`,
          updated.metaDescription || updated.excerpt || "", updated.keywords || "",
          current.id
        ]
      );
    }

    blogs[idx] = updated;
    store.blogs = blogs;
    saveFallbackStore(store);

    return res.json({ success: true, blog: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/blogs/:id (SOFT DELETE -> Recycle Bin)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    const blog = (store.blogs || []).find((b) => b.id === id || b.slug === id);

    if (!blog) {
      return res.status(404).json({ success: false, error: "Blog post not found." });
    }

    blog.is_trashed = true;
    blog.deleted_at = new Date().toISOString();
    blog.deleted_by = req.body?.deletedBy || "admin";

    saveFallbackStore(store);
    return res.json({ success: true, message: `Blog post "${blog.title}" moved to Recycle Bin.`, blog });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/blogs/:id/restore (RESTORE from Recycle Bin)
router.post("/:id/restore", async (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    const blog = (store.blogs || []).find((b) => b.id === id || b.slug === id);

    if (!blog) {
      return res.status(404).json({ success: false, error: "Blog post not found in Recycle Bin." });
    }

    blog.is_trashed = false;
    blog.status = "Published";
    blog.deleted_at = null;
    blog.deleted_by = null;

    saveFallbackStore(store);
    return res.json({ success: true, message: `Blog post "${blog.title}" restored.`, blog });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/blogs/:id/permanent (PERMANENT DELETE)
router.delete("/:id/permanent", async (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    const initialLen = (store.blogs || []).length;
    const blogToDelete = (store.blogs || []).find((b) => b.id === id || b.slug === id);

    if (!blogToDelete && initialLen > 0) {
      return res.status(404).json({ success: false, error: "Blog post not found in Recycle Bin." });
    }

    if (isMysqlConnected() && blogToDelete) {
      const pool = getPool();
      await pool.query("DELETE FROM blogs WHERE id = ? OR slug = ?", [blogToDelete.id, blogToDelete.slug]);
    }

    store.blogs = (store.blogs || []).filter((b) => b.id !== id && b.slug !== id);
    saveFallbackStore(store);
    return res.json({ success: true, message: "Blog post permanently deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
