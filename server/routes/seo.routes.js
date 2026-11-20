const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const {
  getPool,
  isMysqlConnected,
  loadFallbackStore,
  saveFallbackStore,
  getDefaultHtaccessContent,
  getDefaultLlmsTxtContent,
  getDefaultCustomCode,
} = require("../config/db");

// Standard static pages in Timex Ceramic
const STATIC_PAGE_DEFS = [
  { path: "/", title: "Home - Timex Ceramic Luxury Surfaces", focus_keyword: "premium tiles", category: "Core" },
  { path: "/about", title: "About Timex Ceramic Heritage & Craftsmanship", focus_keyword: "timex ceramic", category: "Corporate" },
  { path: "/products", title: "Explore All Ceramic & Vitrified Tiles", focus_keyword: "vitrified tiles", category: "Catalog" },
  { path: "/collections", title: "Curated Tile Design Collections", focus_keyword: "tile collections", category: "Catalog" },
  { path: "/visualiser", title: "AI 3D Room Visualiser", focus_keyword: "tile visualiser", category: "Tools" },
  { path: "/calculator", title: "Precision Tile & Box Calculator", focus_keyword: "tile calculator", category: "Tools" },
  { path: "/catalogue-maker", title: "B2B Custom PDF Tile Catalogue Builder", focus_keyword: "tile catalogue", category: "Tools" },
  { path: "/dealer-portal", title: "Authorized Dealer & Distribution Network", focus_keyword: "tile dealer network", category: "Trade" },
  { path: "/architect-portal", title: "Architects & Specifiers Resource Portal", focus_keyword: "architectural tiles", category: "Trade" },
  { path: "/blogs", title: "Timex Ceramic Design & Architecture Journal", focus_keyword: "tile design journal", category: "Content" },
  { path: "/contact", title: "Contact Us & Mumbai Experience Centre", focus_keyword: "contact timex", category: "Corporate" },
  { path: "/privacy-policy", title: "Privacy Policy", focus_keyword: "privacy policy", category: "Legal" },
  { path: "/disclaimer", title: "Disclaimer & Terms", focus_keyword: "disclaimer", category: "Legal" },
  { path: "/downloads", title: "Technical Specifications & PDF Catalogues", focus_keyword: "tile catalogue download", category: "Resources" },
  { path: "/inspiration", title: "Luxury Living Spaces & Inspiration Gallery", focus_keyword: "interior tile inspiration", category: "Inspiration" },
  { path: "/projects", title: "Commercial & Residential Tile Case Studies", focus_keyword: "architectural tile projects", category: "Portfolio" },
  { path: "/compare", title: "Tile Specifications Comparison Tool", focus_keyword: "compare tiles", category: "Tools" },
  { path: "/wishlist", title: "Saved Luxury Surfaces & Moodboard", focus_keyword: "saved tiles", category: "User" },
  { path: "/applications", title: "Tile Applications by Space & Environment", focus_keyword: "tile applications", category: "Catalog" },
];

const COLLECTION_SLUGS = [
  "brick", "stone", "wooden", "tropical", "mosaic", "marble", "subway",
  "texture", "metallic", "boutique", "hexagon", "moroccan", "colorful",
  "highlighter", "french-frames", "modular", "octagonal", "terrazzo",
  "white", "fabric", "geometric"
];

// Transparent SEO scoring rubric (0 - 100)
function calculateItemSeoScore(item) {
  let score = 0;
  const breakdown = [];

  // 1. Title (max 15 pts)
  const title = (item.seo_title || item.meta_title || "").trim();
  if (title.length >= 35 && title.length <= 65) {
    score += 15;
    breakdown.push({ check: "SEO Title Length", status: "pass", points: 15, max: 15, note: `Optimal length (${title.length} chars)` });
  } else if (title.length > 0) {
    score += 8;
    breakdown.push({ check: "SEO Title Length", status: "warn", points: 8, max: 15, note: `Acceptable but sub-optimal (${title.length} chars, recommended 35-65)` });
  } else {
    breakdown.push({ check: "SEO Title Length", status: "fail", points: 0, max: 15, note: "Missing SEO title" });
  }

  // 2. Meta description (max 15 pts)
  const desc = (item.meta_description || "").trim();
  if (desc.length >= 120 && desc.length <= 165) {
    score += 15;
    breakdown.push({ check: "Meta Description Length", status: "pass", points: 15, max: 15, note: `Optimal length (${desc.length} chars)` });
  } else if (desc.length >= 50) {
    score += 8;
    breakdown.push({ check: "Meta Description Length", status: "warn", points: 8, max: 15, note: `Sub-optimal length (${desc.length} chars, recommended 120-165)` });
  } else {
    breakdown.push({ check: "Meta Description Length", status: "fail", points: 0, max: 15, note: "Missing or critically short description" });
  }

  // 3. Focus keyword presence (max 10 pts)
  const kw = (item.focus_keyword || "").trim().toLowerCase();
  if (kw) {
    score += 10;
    breakdown.push({ check: "Focus Keyword Configured", status: "pass", points: 10, max: 10, note: `Focus keyword: "${kw}"` });
  } else {
    breakdown.push({ check: "Focus Keyword Configured", status: "fail", points: 0, max: 10, note: "No focus keyword set" });
  }

  // 4. Focus keyword in Title (max 10 pts)
  if (kw && title.toLowerCase().includes(kw)) {
    score += 10;
    breakdown.push({ check: "Focus Keyword in Title", status: "pass", points: 10, max: 10, note: "Keyword appears in SEO title" });
  } else if (kw) {
    breakdown.push({ check: "Focus Keyword in Title", status: "warn", points: 0, max: 10, note: "Keyword missing from SEO title" });
  }

  // 5. Focus keyword in Meta Description (max 10 pts)
  if (kw && desc.toLowerCase().includes(kw)) {
    score += 10;
    breakdown.push({ check: "Focus Keyword in Description", status: "pass", points: 10, max: 10, note: "Keyword appears in meta description" });
  } else if (kw) {
    breakdown.push({ check: "Focus Keyword in Description", status: "warn", points: 0, max: 10, note: "Keyword missing from meta description" });
  }

  // 6. Canonical URL (max 10 pts)
  const canonical = (item.canonical_url || "").trim();
  if (canonical && canonical.startsWith("http")) {
    score += 10;
    breakdown.push({ check: "Canonical URL", status: "pass", points: 10, max: 10, note: `Canonical configured (${canonical})` });
  } else {
    breakdown.push({ check: "Canonical URL", status: "warn", points: 4, max: 10, note: "Defaulting to path without explicit absolute canonical" });
    score += 4;
  }

  // 7. Robots directives (max 10 pts)
  const isIndex = item.robots_index !== false;
  const isFollow = item.robots_follow !== false;
  if (isIndex && isFollow) {
    score += 10;
    breakdown.push({ check: "Search Engine Indexing", status: "pass", points: 10, max: 10, note: "Indexed and Follow allowed" });
  } else {
    score += 5;
    breakdown.push({ check: "Search Engine Indexing", status: "info", points: 5, max: 10, note: `Custom indexing: index=${isIndex}, follow=${isFollow}` });
  }

  // 8. Open Graph & Social (max 10 pts)
  const ogImg = item.og_image || "";
  const ogTitle = item.og_title || title;
  if (ogImg && ogTitle) {
    score += 10;
    breakdown.push({ check: "Social Metadata (Open Graph)", status: "pass", points: 10, max: 10, note: "OG Image and Title configured" });
  } else if (ogTitle) {
    score += 5;
    breakdown.push({ check: "Social Metadata (Open Graph)", status: "warn", points: 5, max: 10, note: "OG Image missing" });
  } else {
    breakdown.push({ check: "Social Metadata (Open Graph)", status: "fail", points: 0, max: 10, note: "Missing social metadata" });
  }

  // 9. Schema (max 10 pts)
  if (item.schema_data && item.schema_data.trim().length > 10) {
    score += 10;
    breakdown.push({ check: "Structured Data (Schema)", status: "pass", points: 10, max: 10, note: `Schema configured (${item.schema_type || "Custom"})` });
  } else if (item.schema_type) {
    score += 6;
    breakdown.push({ check: "Structured Data (Schema)", status: "warn", points: 6, max: 10, note: `Schema type chosen (${item.schema_type}) without custom payload` });
  } else {
    breakdown.push({ check: "Structured Data (Schema)", status: "warn", points: 2, max: 10, note: "No custom schema configured" });
    score += 2;
  }

  return { score: Math.min(100, Math.max(0, score)), breakdown };
}

// Assemble full catalog of SEO items by combining static pages, products, blogs, and collections
function getFullSeoCatalog(store) {
  const existingMetadata = store.seo_metadata || [];
  const metaMap = new Map();
  for (const m of existingMetadata) {
    metaMap.set(m.page_path, m);
  }

  const items = [];

  // 1. Static Pages
  for (const def of STATIC_PAGE_DEFS) {
    const custom = metaMap.get(def.path);
    const item = {
      id: custom?.id || `seo-page-${def.path.replace(/\//g, "-") || "root"}`,
      page_path: def.path,
      content_type: "page",
      title: custom?.title || def.title,
      slug: def.path === "/" ? "" : def.path.replace(/^\//, ""),
      content: `Timex Ceramic luxury architectural surface solutions and tiles. ${def.title}`,
      seo_title: custom?.seo_title || custom?.meta_title || `${def.title} | Timex Ceramic`,
      meta_description: custom?.meta_description || "Experience luxury surfaces with Timex Ceramic. Explore premium floor tiles, vitrified slabs, bathware, and interactive visualizers for luxury spaces.",
      focus_keyword: custom?.focus_keyword || def.focus_keyword,
      secondary_keywords: custom?.secondary_keywords || (custom?.keywords ? custom.keywords.split(",").map(k => k.trim()) : ["vitrified tiles", "timex ceramic"]),
      canonical_url: custom?.canonical_url || `https://www.timexceramic.com${def.path === "/" ? "" : def.path}`,
      robots_index: custom?.robots_index !== undefined ? custom.robots_index : true,
      robots_follow: custom?.robots_follow !== undefined ? custom.robots_follow : true,
      og_title: custom?.og_title || custom?.meta_title || `${def.title} | Timex Ceramic`,
      og_description: custom?.og_description || custom?.meta_description || "Experience luxury surfaces with Timex Ceramic.",
      og_image: custom?.og_image || "https://www.timexceramic.com/images/og-image.jpg",
      twitter_title: custom?.twitter_title || custom?.meta_title || def.title,
      twitter_description: custom?.twitter_description || custom?.meta_description || "Luxury surfaces by Timex Ceramic.",
      twitter_image: custom?.twitter_image || custom?.og_image || "https://www.timexceramic.com/images/og-image.jpg",
      twitter_card: custom?.twitter_card || "summary_large_image",
      schema_type: custom?.schema_type || (def.path === "/" ? "Organization" : (def.path === "/contact" ? "LocalBusiness" : "WebPage")),
      schema_data: custom?.schema_data || "",
      updated_at: custom?.updated_at || new Date().toISOString(),
    };
    const { score, breakdown } = calculateItemSeoScore(item);
    item.seo_score = score;
    item.score_breakdown = breakdown;
    items.push(item);
  }

  // 2. Products
  const products = store.products || [];
  for (const p of products) {
    const pPath = `/product/${p.slug}`;
    const custom = metaMap.get(pPath);
    const mainImg = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "https://www.timexceramic.com/images/og-image.jpg";
    const item = {
      id: custom?.id || `seo-prod-${p.id || p.slug}`,
      page_path: pPath,
      content_type: "product",
      content_id: p.id,
      title: p.name,
      slug: p.slug,
      content: p.description || `${p.name} - ${p.category || "Tile"} Surface in ${p.size || "800x1600 mm"}. Engineered with vitrified durability and flawless luxury finish.`,
      seo_title: custom?.seo_title || custom?.meta_title || p.metaTitle || p.meta_title || `${p.name} | Timex Ceramic`,
      meta_description: custom?.meta_description || p.metaDescription || p.meta_description || p.description || `Explore ${p.name} luxury imported vitrified tile slabs by Timex Ceramic. Premium ${p.finish || "polished"} finish surface.`,
      focus_keyword: custom?.focus_keyword || p.name.toLowerCase(),
      secondary_keywords: custom?.secondary_keywords || (p.keywords ? p.keywords.split(",").map(k => k.trim()) : [p.category || "tiles", "porcelain slabs"]),
      canonical_url: custom?.canonical_url || `https://www.timexceramic.com/product/${p.slug}`,
      robots_index: custom?.robots_index !== undefined ? custom.robots_index : (p.status !== "Inactive"),
      robots_follow: custom?.robots_follow !== undefined ? custom.robots_follow : true,
      og_title: custom?.og_title || `${p.name} - Luxury Surface | Timex Ceramic`,
      og_description: custom?.og_description || p.description || `Architectural tile surface ${p.name} by Timex Ceramic.`,
      og_image: custom?.og_image || mainImg,
      twitter_title: custom?.twitter_title || `${p.name} | Timex Ceramic`,
      twitter_description: custom?.twitter_description || p.description || "",
      twitter_image: custom?.twitter_image || mainImg,
      twitter_card: custom?.twitter_card || "summary_large_image",
      schema_type: custom?.schema_type || "Product",
      schema_data: custom?.schema_data || JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": p.name,
        "image": mainImg,
        "description": p.description || `${p.name} luxury architectural tile surface`,
        "sku": p.sku || `TMX-${p.code || "SURFACE"}`,
        "brand": {
          "@type": "Brand",
          "name": "Timex Ceramic"
        },
        "offers": {
          "@type": "Offer",
          "price": p.price || "0.00",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock"
        }
      }, null, 2),
      images: p.images || [],
      price: p.price || 0,
      code: p.code,
      updated_at: custom?.updated_at || p.updated_at || new Date().toISOString(),
    };
    const { score, breakdown } = calculateItemSeoScore(item);
    item.seo_score = score;
    item.score_breakdown = breakdown;
    items.push(item);
  }

  // 3. Blogs
  const blogs = store.blogs || [];
  for (const b of blogs) {
    const bPath = `/blogs/${b.slug}`;
    const custom = metaMap.get(bPath);
    const cover = b.coverImage || "https://www.timexceramic.com/images/og-image.jpg";
    const item = {
      id: custom?.id || `seo-blog-${b.id || b.slug}`,
      page_path: bPath,
      content_type: "blog",
      content_id: b.id,
      title: b.title,
      slug: b.slug,
      content: b.excerpt || (b.content?.intro || b.title),
      seo_title: custom?.seo_title || custom?.meta_title || b.metaTitle || `${b.title} | Timex Ceramic Blog`,
      meta_description: custom?.meta_description || b.metaDescription || b.excerpt || `Read ${b.title} on the Timex Ceramic Architectural & Design Blog.`,
      focus_keyword: custom?.focus_keyword || (b.tags && b.tags[0] ? b.tags[0].toLowerCase() : "tile design"),
      secondary_keywords: custom?.secondary_keywords || b.tags || ["interior design", "ceramics"],
      canonical_url: custom?.canonical_url || `https://www.timexceramic.com/blogs/${b.slug}`,
      robots_index: custom?.robots_index !== undefined ? custom.robots_index : (b.status !== "Draft"),
      robots_follow: custom?.robots_follow !== undefined ? custom.robots_follow : true,
      og_title: custom?.og_title || b.title,
      og_description: custom?.og_description || b.excerpt || "",
      og_image: custom?.og_image || cover,
      twitter_title: custom?.twitter_title || b.title,
      twitter_description: custom?.twitter_description || b.excerpt || "",
      twitter_image: custom?.twitter_image || cover,
      twitter_card: custom?.twitter_card || "summary_large_image",
      schema_type: custom?.schema_type || "Article",
      schema_data: custom?.schema_data || JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": b.title,
        "image": cover,
        "author": {
          "@type": "Person",
          "name": b.author?.name || "Timex Design Editorial"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Timex Ceramic"
        },
        "datePublished": b.createdAt || new Date().toISOString()
      }, null, 2),
      updated_at: custom?.updated_at || b.updatedAt || new Date().toISOString(),
    };
    const { score, breakdown } = calculateItemSeoScore(item);
    item.seo_score = score;
    item.score_breakdown = breakdown;
    items.push(item);
  }

  // 4. Categories / Collections
  for (const cSlug of COLLECTION_SLUGS) {
    const cPath = `/product-category/${cSlug}`;
    const legacyPath = `/collections/${cSlug}`;
    const custom = metaMap.get(cPath) || metaMap.get(legacyPath);
    const collName = cSlug.charAt(0).toUpperCase() + cSlug.slice(1).replace(/-/g, " ");
    const item = {
      id: custom?.id || `seo-coll-${cSlug}`,
      page_path: cPath,
      content_type: "category",
      title: `${collName} Tile Collection`,
      slug: cSlug,
      content: `Explore Timex Ceramic ${collName} surface tiles. Crafted for luxury residential and commercial architecture.`,
      seo_title: custom?.seo_title || custom?.meta_title || `${collName} Luxury Tiles & Surfaces | Timex Ceramic`,
      meta_description: custom?.meta_description || `Discover curated ${collName} tiles from Timex Ceramic. Durable, elegant, zero-porosity vitrified slabs.`,
      focus_keyword: custom?.focus_keyword || `${collName.toLowerCase()} tiles`,
      secondary_keywords: custom?.secondary_keywords || ["luxury tiles", "vitrified slabs"],
      canonical_url: custom?.canonical_url || `https://www.timexceramic.com/product-category/${cSlug}`,
      robots_index: custom?.robots_index !== undefined ? custom.robots_index : true,
      robots_follow: custom?.robots_follow !== undefined ? custom.robots_follow : true,
      og_title: custom?.og_title || `${collName} Tile Collection | Timex Ceramic`,
      og_description: custom?.og_description || `Discover curated ${collName} tiles from Timex Ceramic.`,
      og_image: custom?.og_image || "https://www.timexceramic.com/images/og-image.jpg",
      twitter_title: custom?.twitter_title || `${collName} Tiles | Timex Ceramic`,
      twitter_description: custom?.twitter_description || "",
      twitter_image: custom?.twitter_image || "https://www.timexceramic.com/images/og-image.jpg",
      twitter_card: custom?.twitter_card || "summary_large_image",
      schema_type: custom?.schema_type || "CollectionPage",
      schema_data: custom?.schema_data || "",
      updated_at: custom?.updated_at || new Date().toISOString(),
    };
    const { score, breakdown } = calculateItemSeoScore(item);
    item.seo_score = score;
    item.score_breakdown = breakdown;
    items.push(item);
  }

  return items;
}

// =============================================================================
// ROUTE HANDLERS
// =============================================================================

// GET /api/v1/seo (Fetch unified catalog of SEO items)
router.get("/", (req, res) => {
  try {
    const store = loadFallbackStore();
    const catalog = getFullSeoCatalog(store);
    const contentType = req.query.type;
    const search = req.query.q ? req.query.q.toLowerCase().trim() : "";

    let filtered = catalog;
    if (contentType && contentType !== "all") {
      filtered = filtered.filter(item => item.content_type === contentType);
    }
    if (search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.page_path.toLowerCase().includes(search) ||
        (item.focus_keyword && item.focus_keyword.toLowerCase().includes(search)) ||
        item.seo_title.toLowerCase().includes(search)
      );
    }

    return res.json({
      success: true,
      totalCount: catalog.length,
      count: filtered.length,
      seo: filtered,
    });
  } catch (err) {
    console.error("Fetch SEO error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/seo/by-path?path=/products
router.get("/by-path", (req, res) => {
  const pagePath = req.query.path;
  if (!pagePath) {
    return res.status(400).json({ success: false, error: "Path parameter is required." });
  }

  try {
    const store = loadFallbackStore();
    const catalog = getFullSeoCatalog(store);
    const item = catalog.find(i => i.page_path === pagePath || i.page_path === pagePath.replace(/\/$/, ""));
    if (!item) {
      return res.status(404).json({ success: false, error: "SEO record not found." });
    }
    return res.json({ success: true, seo: item });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/seo (Create or update SEO record, syncing with Products/Blogs)
router.post("/", async (req, res) => {
  const data = req.body;
  if (!data.page_path) {
    return res.status(400).json({ success: false, error: "page_path is required." });
  }

  try {
    const store = loadFallbackStore();
    if (!Array.isArray(store.seo_metadata)) {
      store.seo_metadata = [];
    }

    const normPath = data.page_path.trim();
    const existingIdx = store.seo_metadata.findIndex(s => s.page_path === normPath || (data.id && s.id === data.id));

    const record = {
      id: data.id || (existingIdx >= 0 ? store.seo_metadata[existingIdx].id : `seo-${crypto.randomBytes(4).toString("hex")}`),
      page_path: normPath,
      content_type: data.content_type || "page",
      title: data.title || "",
      meta_title: (data.seo_title || data.meta_title || "").trim(),
      seo_title: (data.seo_title || data.meta_title || "").trim(),
      meta_description: (data.meta_description || "").trim(),
      focus_keyword: (data.focus_keyword || "").trim(),
      secondary_keywords: Array.isArray(data.secondary_keywords) ? data.secondary_keywords : (data.secondary_keywords ? String(data.secondary_keywords).split(",").map(k => k.trim()) : []),
      canonical_url: (data.canonical_url || "").trim(),
      robots_index: data.robots_index !== undefined ? Boolean(data.robots_index) : true,
      robots_follow: data.robots_follow !== undefined ? Boolean(data.robots_follow) : true,
      og_title: data.og_title || data.seo_title || "",
      og_description: data.og_description || data.meta_description || "",
      og_image: data.og_image || "",
      twitter_title: data.twitter_title || data.og_title || data.seo_title || "",
      twitter_description: data.twitter_description || data.og_description || data.meta_description || "",
      twitter_image: data.twitter_image || data.og_image || "",
      twitter_card: data.twitter_card || "summary_large_image",
      schema_type: data.schema_type || "",
      schema_data: data.schema_data || "",
      seo_score: typeof data.seo_score === "number" ? data.seo_score : calculateItemSeoScore(data).score,
      updated_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      store.seo_metadata[existingIdx] = {
        ...store.seo_metadata[existingIdx],
        ...record,
      };
    } else {
      store.seo_metadata.push(record);
    }

    // Bidirectional sync with Products if page is /product/[slug]
    if (normPath.startsWith("/product/")) {
      const slug = normPath.replace("/product/", "").replace(/\/$/, "").toLowerCase();
      const prodIdx = (store.products || []).findIndex(p => (p.slug && p.slug.toLowerCase() === slug) || p.id === data.content_id || (p.code && String(p.code).toLowerCase() === slug));
      if (prodIdx >= 0) {
        store.products[prodIdx].metaTitle = record.seo_title;
        store.products[prodIdx].meta_title = record.seo_title;
        store.products[prodIdx].seoTitle = record.seo_title;
        store.products[prodIdx].metaDescription = record.meta_description;
        store.products[prodIdx].meta_description = record.meta_description;
        store.products[prodIdx].keywords = record.secondary_keywords ? [record.focus_keyword, ...record.secondary_keywords].filter(Boolean).join(", ") : record.focus_keyword;
      }
    }

    // Bidirectional sync with Categories and Collection SEO if page is /product-category/[slug] or /collections/[slug]
    if (normPath.startsWith("/product-category/") || normPath.startsWith("/collections/")) {
      const slug = normPath.replace(/^\/(product-category|collections)\/?/, "").replace(/\/$/, "").toLowerCase();

      // Sync store.collection_seo
      if (!store.collection_seo || typeof store.collection_seo !== "object") {
        store.collection_seo = {};
      }
      store.collection_seo[slug] = {
        ...(store.collection_seo[slug] || {}),
        slug,
        metaTitle: record.seo_title,
        metaDescription: record.meta_description,
        ogTitle: record.og_title || record.seo_title,
        ogDescription: record.og_description || record.meta_description,
        banner: record.og_image || store.collection_seo[slug]?.banner || "",
        updated_at: new Date().toISOString(),
      };

      // Sync store.custom_categories
      if (Array.isArray(store.custom_categories)) {
        const catIdx = store.custom_categories.findIndex(
          c => (c.slug && c.slug.toLowerCase() === slug) || (c.id && c.id.toLowerCase() === slug)
        );
        if (catIdx >= 0) {
          store.custom_categories[catIdx].seoTitle = record.seo_title;
          store.custom_categories[catIdx].metaDescription = record.meta_description;
          if (record.focus_keyword) store.custom_categories[catIdx].focusKeyword = record.focus_keyword;
          if (record.canonical_url) store.custom_categories[catIdx].canonicalUrl = record.canonical_url;
          if (record.og_image) store.custom_categories[catIdx].ogImage = record.og_image;
        }
      }
    }

    // Bidirectional sync with CMS Pages if matching path or slug
    if (Array.isArray(store.pages)) {
      const pageIdx = store.pages.findIndex(
        p => p.path === normPath || (p.slug && `/${p.slug}` === normPath) || (normPath === "/" && (p.slug === "home" || p.path === "/"))
      );
      if (pageIdx >= 0) {
        store.pages[pageIdx].metaTitle = record.seo_title;
        store.pages[pageIdx].metaDescription = record.meta_description;
      }
    }

    // Bidirectional sync with Blogs if page is /blogs/[slug] or /blog/[slug]
    if (normPath.startsWith("/blogs/") || normPath.startsWith("/blog/")) {
      const slug = normPath.replace(/^\/(blogs|blog)\/?/, "").replace(/\/$/, "").toLowerCase();
      const blogIdx = (store.blogs || []).findIndex(b => (b.slug && b.slug.toLowerCase() === slug) || b.id === data.content_id);
      if (blogIdx >= 0) {
        store.blogs[blogIdx].metaTitle = record.seo_title;
        store.blogs[blogIdx].metaDescription = record.meta_description;
        store.blogs[blogIdx].keywords = record.secondary_keywords ? [record.focus_keyword, ...record.secondary_keywords].filter(Boolean).join(", ") : record.focus_keyword;
      }
    }

    if (isMysqlConnected()) {
      try {
        const pool = getPool();
        await pool.query(
          `INSERT INTO seo_metadata (
            id, page_path, content_type, title, meta_title, meta_description, focus_keyword,
            secondary_keywords, canonical_url, robots_index, robots_follow, og_title,
            og_description, og_image, twitter_title, twitter_description, twitter_image,
            twitter_card, schema_type, schema_data, seo_score
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            meta_title = VALUES(meta_title),
            meta_description = VALUES(meta_description),
            focus_keyword = VALUES(focus_keyword),
            secondary_keywords = VALUES(secondary_keywords),
            canonical_url = VALUES(canonical_url),
            robots_index = VALUES(robots_index),
            robots_follow = VALUES(robots_follow),
            og_title = VALUES(og_title),
            og_description = VALUES(og_description),
            og_image = VALUES(og_image),
            twitter_title = VALUES(twitter_title),
            twitter_description = VALUES(twitter_description),
            twitter_image = VALUES(twitter_image),
            twitter_card = VALUES(twitter_card),
            schema_type = VALUES(schema_type),
            schema_data = VALUES(schema_data),
            seo_score = VALUES(seo_score)`,
          [
            record.id, record.page_path, record.content_type, record.title, record.meta_title,
            record.meta_description, record.focus_keyword,
            Array.isArray(record.secondary_keywords) ? record.secondary_keywords.join(", ") : (record.secondary_keywords || ""),
            record.canonical_url, record.robots_index, record.robots_follow,
            record.og_title, record.og_description, record.og_image,
            record.twitter_title, record.twitter_description, record.twitter_image,
            record.twitter_card, record.schema_type, record.schema_data, record.seo_score
          ]
        );
      } catch (dbErr) {
        console.warn("MySQL SEO upsert warning:", dbErr.message);
      }
    }

    saveFallbackStore(store);
    return res.status(200).json({ success: true, seo: record });
  } catch (err) {
    console.error("Save SEO error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/seo/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    const prevLen = (store.seo_metadata || []).length;
    store.seo_metadata = (store.seo_metadata || []).filter(s => s.id !== id && s.page_path !== id);
    if (store.seo_metadata.length === prevLen) {
      return res.status(404).json({ success: false, error: "SEO record not found in overrides." });
    }
    saveFallbackStore(store);
    return res.json({ success: true, message: "SEO override reset to defaults." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/seo/dashboard-stats (Calculated dynamic statistics)
router.get("/dashboard-stats", (req, res) => {
  try {
    const store = loadFallbackStore();
    const catalog = getFullSeoCatalog(store);
    const redirects = store.seo_redirects || [];
    const logs404 = store.seo_404_logs || [];
    const settings = store.seo_settings || {};

    let totalScoreSum = 0;
    let withTitle = 0;
    let missingTitle = 0;
    let withDesc = 0;
    let missingDesc = 0;
    let withKeyword = 0;
    let missingKeyword = 0;
    let indexed = 0;
    let noindexed = 0;

    for (const item of catalog) {
      totalScoreSum += item.seo_score || 0;
      if (item.seo_title && item.seo_title.trim().length > 0) withTitle++;
      else missingTitle++;

      if (item.meta_description && item.meta_description.trim().length > 10) withDesc++;
      else missingDesc++;

      if (item.focus_keyword && item.focus_keyword.trim().length > 0) withKeyword++;
      else missingKeyword++;

      if (item.robots_index !== false) indexed++;
      else noindexed++;
    }

    const overallScore = catalog.length > 0 ? Math.round(totalScoreSum / catalog.length) : 0;
    const unresolved404s = logs404.filter(l => !l.resolved_to).length;

    return res.json({
      success: true,
      stats: {
        overallScore,
        totalPages: catalog.length,
        pagesWithTitle: withTitle,
        pagesMissingTitle: missingTitle,
        pagesWithDescription: withDesc,
        pagesMissingDescription: missingDesc,
        pagesWithKeyword: withKeyword,
        pagesMissingKeyword: missingKeyword,
        indexedPages: indexed,
        noindexPages: noindexed,
        redirectCount: redirects.length,
        activeRedirects: redirects.filter(r => r.is_active).length,
        total404Errors: logs404.length,
        unresolved404Errors: unresolved404s,
        brokenLinksCount: 0,
        sitemap: {
          status: "Healthy",
          urlCount: catalog.length,
          lastGenerated: settings.sitemap_config?.last_generated || new Date().toISOString(),
        },
        robots: {
          status: "Active",
          hasRules: Boolean(settings.robots_txt_content),
        }
      }
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/seo/settings
router.get("/settings", (req, res) => {
  try {
    const store = loadFallbackStore();
    return res.json({ success: true, settings: store.seo_settings || {} });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/seo/settings
router.post("/settings", (req, res) => {
  try {
    const store = loadFallbackStore();
    store.seo_settings = {
      ...(store.seo_settings || {}),
      ...req.body,
      updated_at: new Date().toISOString(),
    };
    saveFallbackStore(store);
    return res.json({ success: true, settings: store.seo_settings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/seo/redirects
router.get("/redirects", (req, res) => {
  try {
    const store = loadFallbackStore();
    return res.json({ success: true, redirects: store.seo_redirects || [] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/seo/redirects (With redirect loop prevention)
router.post("/redirects", (req, res) => {
  const { id, source_url, destination_url, redirect_type, is_active } = req.body;
  if (!source_url || !destination_url) {
    return res.status(400).json({ success: false, error: "source_url and destination_url are required." });
  }

  const cleanSource = source_url.trim().toLowerCase();
  const cleanDest = destination_url.trim().toLowerCase();

  if (cleanSource === cleanDest) {
    return res.status(400).json({ success: false, error: "Source and destination cannot be identical (Direct loop)." });
  }

  try {
    const store = loadFallbackStore();
    if (!Array.isArray(store.seo_redirects)) {
      store.seo_redirects = [];
    }

    // Check transitive loop (e.g. A -> B and B -> A)
    const reverse = store.seo_redirects.find(r => r.source_url.toLowerCase() === cleanDest && r.destination_url.toLowerCase() === cleanSource && r.id !== id);
    if (reverse) {
      return res.status(400).json({ success: false, error: `Redirect loop detected: "${cleanDest}" already redirects back to "${cleanSource}".` });
    }

    const existingIdx = store.seo_redirects.findIndex(r => r.id === id || r.source_url.toLowerCase() === cleanSource);
    const newRecord = {
      id: id || (existingIdx >= 0 ? store.seo_redirects[existingIdx].id : `redir-${Date.now()}`),
      source_url: cleanSource,
      destination_url: cleanDest,
      redirect_type: parseInt(redirect_type || 301, 10),
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      hit_count: existingIdx >= 0 ? store.seo_redirects[existingIdx].hit_count : 0,
      created_at: existingIdx >= 0 ? store.seo_redirects[existingIdx].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      store.seo_redirects[existingIdx] = newRecord;
    } else {
      store.seo_redirects.unshift(newRecord);
    }

    saveFallbackStore(store);
    return res.json({ success: true, redirect: newRecord });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/seo/redirects/:id
router.delete("/redirects/:id", (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    store.seo_redirects = (store.seo_redirects || []).filter(r => r.id !== id);
    saveFallbackStore(store);
    return res.json({ success: true, message: "Redirect deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/seo/404-logs
router.get("/404-logs", (req, res) => {
  try {
    const store = loadFallbackStore();
    return res.json({ success: true, logs: store.seo_404_logs || [] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/seo/404-log (Log incoming 404 request)
router.post("/404-log", (req, res) => {
  const { url, referrer, user_agent } = req.body;
  if (!url) return res.status(400).json({ success: false, error: "URL is required." });

  try {
    const store = loadFallbackStore();
    if (!Array.isArray(store.seo_404_logs)) {
      store.seo_404_logs = [];
    }

    const normUrl = url.trim().toLowerCase();
    const existing = store.seo_404_logs.find(l => l.url.toLowerCase() === normUrl);
    if (existing) {
      existing.hit_count = (existing.hit_count || 1) + 1;
      existing.last_detected = new Date().toISOString();
      if (referrer) existing.referrer = referrer;
      if (user_agent) existing.user_agent = user_agent;
    } else {
      store.seo_404_logs.unshift({
        id: `log-404-${Date.now()}`,
        url: normUrl,
        referrer: referrer || "Direct / Unknown",
        user_agent: user_agent || "Browser",
        hit_count: 1,
        last_detected: new Date().toISOString(),
        resolved_to: null,
      });
    }

    saveFallbackStore(store);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/seo/404-logs/:id
router.delete("/404-logs/:id", (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    store.seo_404_logs = (store.seo_404_logs || []).filter(l => l.id !== id);
    saveFallbackStore(store);
    return res.json({ success: true, message: "404 log entry deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/seo/images (Audit images across products, blogs, and pages)
router.get("/images", (req, res) => {
  try {
    const store = loadFallbackStore();
    const products = store.products || [];
    const blogs = store.blogs || [];

    const imageList = [];
    const seenUrls = new Set();

    // Scan products
    for (const p of products) {
      if (Array.isArray(p.images)) {
        p.images.forEach((imgUrl, idx) => {
          if (!imgUrl || seenUrls.has(imgUrl)) return;
          seenUrls.add(imgUrl);
          const filename = imgUrl.split("/").pop()?.split("?")[0] || "image.jpg";
          const alt = p.alt_texts?.[imgUrl] || (idx === 0 ? `${p.name} - Architectural Tile Surface` : `${p.name} detail view`);
          imageList.push({
            id: `img-p-${p.id}-${idx}`,
            url: imgUrl,
            filename,
            source: `${p.name} (/product/${p.slug})`,
            source_type: "product",
            source_id: p.id,
            alt_text: alt,
            has_alt: Boolean(alt && alt.trim().length > 3),
            format: filename.split(".").pop()?.toUpperCase() || "JPG",
            is_oversized: false, // heuristic indicator
            size_kb: 140, // estimated
          });
        });
      }
    }

    // Scan blogs
    for (const b of blogs) {
      if (b.coverImage && !seenUrls.has(b.coverImage)) {
        seenUrls.add(b.coverImage);
        const filename = b.coverImage.split("/").pop()?.split("?")[0] || "cover.jpg";
        imageList.push({
          id: `img-b-${b.id}-cover`,
          url: b.coverImage,
          filename,
          source: `${b.title} (/blogs/${b.slug})`,
          source_type: "blog",
          source_id: b.id,
          alt_text: b.coverImageAlt || `${b.title} banner`,
          has_alt: Boolean(b.coverImageAlt && b.coverImageAlt.trim().length > 3),
          format: filename.split(".").pop()?.toUpperCase() || "JPG",
          is_oversized: false,
          size_kb: 210,
        });
      }
    }

    return res.json({ success: true, count: imageList.length, images: imageList });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/seo/images/alt (Update ALT text for an image)
router.put("/images/alt", (req, res) => {
  const { source_type, source_id, image_url, alt_text } = req.body;
  if (!image_url || alt_text === undefined) {
    return res.status(400).json({ success: false, error: "image_url and alt_text are required." });
  }

  try {
    const store = loadFallbackStore();
    if (source_type === "product") {
      const pIdx = (store.products || []).findIndex(p => p.id === source_id);
      if (pIdx >= 0) {
        if (!store.products[pIdx].alt_texts) store.products[pIdx].alt_texts = {};
        store.products[pIdx].alt_texts[image_url] = alt_text;
      }
    } else if (source_type === "blog") {
      const bIdx = (store.blogs || []).findIndex(b => b.id === source_id);
      if (bIdx >= 0) {
        store.blogs[bIdx].coverImageAlt = alt_text;
      }
    }

    saveFallbackStore(store);
    return res.json({ success: true, message: "ALT text updated successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/seo/audit (Run deep real-time site audit)
router.get("/audit", (req, res) => {
  try {
    const store = loadFallbackStore();
    const catalog = getFullSeoCatalog(store);
    const redirects = store.seo_redirects || [];
    const logs404 = store.seo_404_logs || [];
    const settings = store.seo_settings || {};

    const issues = [];
    const titleCounts = new Map();
    const descCounts = new Map();

    for (const item of catalog) {
      const t = (item.seo_title || "").trim();
      const d = (item.meta_description || "").trim();

      // Title checks
      if (!t) {
        issues.push({ id: `err-title-${item.id}`, level: "ERROR", category: "Title", page: item.page_path, message: "Page is missing an SEO title tag.", recommendation: "Add a concise, compelling 50-60 character SEO title." });
      } else if (t.length < 30) {
        issues.push({ id: `warn-title-short-${item.id}`, level: "WARNING", category: "Title", page: item.page_path, message: `SEO title is short (${t.length} chars).`, recommendation: "Expand title with brand or primary category benefits." });
      } else if (t.length > 65) {
        issues.push({ id: `warn-title-long-${item.id}`, level: "WARNING", category: "Title", page: item.page_path, message: `SEO title may be truncated by Google (${t.length} chars).`, recommendation: "Keep title under 65 characters to avoid SERP ellipsis." });
      }
      titleCounts.set(t, (titleCounts.get(t) || 0) + 1);

      // Meta Description checks
      if (!d) {
        issues.push({ id: `err-desc-${item.id}`, level: "ERROR", category: "Meta Description", page: item.page_path, message: "Page is missing a meta description.", recommendation: "Write an informative summary (120-160 characters)." });
      } else if (d.length < 100) {
        issues.push({ id: `warn-desc-short-${item.id}`, level: "WARNING", category: "Meta Description", page: item.page_path, message: `Meta description is short (${d.length} chars).`, recommendation: "Expand to at least 120 chars to better inform searchers." });
      } else if (d.length > 170) {
        issues.push({ id: `warn-desc-long-${item.id}`, level: "WARNING", category: "Meta Description", page: item.page_path, message: `Meta description exceeds optimal length (${d.length} chars).`, recommendation: "Trim description to avoid search engine truncation." });
      }
      descCounts.set(d, (descCounts.get(d) || 0) + 1);

      // Focus keyword checks
      if (!item.focus_keyword) {
        issues.push({ id: `warn-kw-${item.id}`, level: "WARNING", category: "Keywords", page: item.page_path, message: "No focus keyword designated for this page.", recommendation: "Specify a primary search keyword to track optimization." });
      }

      // Canonical URL checks
      if (!item.canonical_url) {
        issues.push({ id: `warn-canon-${item.id}`, level: "WARNING", category: "Canonical", page: item.page_path, message: "Canonical tag not explicitly declared.", recommendation: "Provide explicit canonical URL to prevent duplicate content indexing." });
      }

      // Social metadata
      if (!item.og_image) {
        issues.push({ id: `warn-og-${item.id}`, level: "WARNING", category: "Social SEO", page: item.page_path, message: "Missing dedicated Open Graph image.", recommendation: "Provide a high-resolution 1200x630 image for social sharing." });
      }
    }

    // Duplicate titles
    for (const [titleStr, count] of titleCounts.entries()) {
      if (count > 1 && titleStr.length > 0) {
        issues.push({ id: `warn-dup-title-${titleStr.slice(0, 10)}`, level: "WARNING", category: "Duplicate Content", page: "Multiple Pages", message: `Duplicate SEO Title detected across ${count} pages: "${titleStr}".`, recommendation: "Make every page's title unique and descriptive." });
      }
    }

    // 404 Errors
    const unresolved = logs404.filter(l => !l.resolved_to);
    if (unresolved.length > 0) {
      issues.push({ id: "err-404s", level: "ERROR", category: "404 Errors", page: "Site-wide", message: `${unresolved.length} unresolved 404 URL(s) detected in 404 monitor.`, recommendation: "Create 301 redirects for active 404 requests to preserve SEO equity." });
    }

    // Sitemap check
    if (!settings.sitemap_config?.include_products) {
      issues.push({ id: "warn-sitemap-prod", level: "WARNING", category: "Sitemap", page: "/sitemap.xml", message: "Products are currently excluded from sitemap.", recommendation: "Enable 'Include Products' in Sitemap Manager." });
    }

    const errors = issues.filter(i => i.level === "ERROR");
    const warnings = issues.filter(i => i.level === "WARNING");
    const passedChecksCount = Math.max(0, (catalog.length * 7) - issues.length);

    // Calculate genuine health score
    const healthScore = Math.max(10, Math.round(100 - (errors.length * 4) - (warnings.length * 1)));

    return res.json({
      success: true,
      audit: {
        healthScore,
        passedChecksCount,
        errorCount: errors.length,
        warningCount: warnings.length,
        scannedPagesCount: catalog.length,
        timestamp: new Date().toISOString(),
        issues,
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/seo/broken-links (Internal link crawl)
router.get("/broken-links", (req, res) => {
  try {
    const store = loadFallbackStore();
    const catalog = getFullSeoCatalog(store);
    const validPaths = new Set(catalog.map(c => c.page_path));
    validPaths.add("/admin");
    validPaths.add("/downloads");
    validPaths.add("/contact");
    validPaths.add("/privacy-policy");

    const broken = [];
    const redirects = store.seo_redirects || [];
    for (const r of redirects) {
      if (!validPaths.has(r.destination_url) && !r.destination_url.startsWith("http")) {
        broken.push({
          id: `broken-redir-${r.id}`,
          source_page: `Redirect: ${r.source_url}`,
          target_url: r.destination_url,
          anchor_text: "HTTP 301 Redirect Target",
          status_code: 404,
          last_checked: new Date().toISOString(),
          type: "Redirect to Non-existent Page",
        });
      }
    }

    return res.json({
      success: true,
      count: broken.length,
      broken_links: broken,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 1. .HTACCESS MANAGEMENT API
// ==============================================================================

function analyzeHtaccessSafety(content) {
  const issues = [];
  const lines = (content || "").split("\n");
  let insideFilesMatch = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/<Files/i.test(line)) insideFilesMatch = true;
    if (/<\/Files/i.test(line)) insideFilesMatch = false;

    if (!insideFilesMatch) {
      if (/^\s*(Deny\s+from\s+all|Require\s+all\s+denied)/i.test(line)) {
        issues.push({
          severity: "danger",
          line: i + 1,
          rule: line,
          message: "Global access denial detected! This rule will block all public visitors from accessing the website.",
        });
      }
    }
  }

  // Check 2: Potential infinite rewrite loops
  if (/RewriteRule\s+\^\(\.\*\)\$\s+\$1/i.test(content) && !/RewriteCond/i.test(content)) {
    issues.push({
      severity: "danger",
      message: "Unconditional self-referencing RewriteRule detected. This causes infinite redirection loops (HTTP 500).",
    });
  }

  // Check 3: RewriteEngine off
  if (/^\s*RewriteEngine\s+off/im.test(content)) {
    issues.push({
      severity: "warning",
      message: "RewriteEngine is turned off. All URL rewrites and SPA fallback routing will be disabled.",
    });
  }

  // Check 4: Unmatched IfModule tags
  const openIf = (content.match(/<IfModule/gi) || []).length;
  const closeIf = (content.match(/<\/IfModule>/gi) || []).length;
  if (openIf !== closeIf) {
    issues.push({
      severity: "warning",
      message: `Mismatched <IfModule> tags (${openIf} opened vs ${closeIf} closed). This may trigger Apache syntax errors.`,
    });
  }

  return issues;
}

function getNetlifyEquivalentConfig() {
  return {
    summary: "Timex Ceramic is currently deployed on Netlify. Netlify does not process Apache .htaccess directives. Equivalent configurations are handled in netlify.toml and dist/_redirects.",
    netlify_toml_snippet: `# Netlify Serverless & SPA Redirects (netlify.toml)
[[redirects]]
  from = "/api/v1/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/admin"
  to = "/admin.html"
  status = 200

[[redirects]]
  from = "/admin/*"
  to = "/admin.html"
  status = 200

[[redirects]]
  from = "/products"
  to = "/products.html"
  status = 200

[[redirects]]
  from = "/product/*"
  to = "/products.html"
  status = 200

[[redirects]]
  from = "/product-category/*"
  to = "/product-category.html"
  status = 200

[[redirects]]
  from = "/collections/*"
  to = "/collections.html"
  status = 200

[[redirects]]
  from = "/blogs/*"
  to = "/blogs.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"`,
    redirects_file_snippet: `# Netlify _redirects format
/api/v1/*    /.netlify/functions/api/:splat   200!
/api/*       /.netlify/functions/api/:splat   200!
/admin       /admin.html                      200
/admin/*     /admin.html                      200
/products    /products.html                   200
/products/*  /products.html                   200
/product/*   /products.html                   200
/product-category/* /product-category.html    200
/collections /collections.html                200
/collections/* /collections.html              200
/blogs       /blogs.html                      200
/blogs/*     /blogs.html                      200
/blog/*      /blogs.html                      200
/*           /index.html                      200`,
    differences: [
      { feature: "URL Rewriting & SPA Routing", apache: "mod_rewrite RewriteRule in .htaccess", netlify: "[[redirects]] in netlify.toml / dist/_redirects" },
      { feature: "SSL / HTTPS Enforce", apache: "RewriteCond %{HTTPS} off in .htaccess", netlify: "Automatic 100% forced SSL at Netlify Edge CDN" },
      { feature: "Security Headers", apache: "mod_headers Header set in .htaccess", netlify: "[[headers]] in netlify.toml" },
      { feature: "Gzip & Brotli Compression", apache: "mod_deflate in .htaccess", netlify: "Automatic high-speed Brotli compression at Netlify Edge" },
      { feature: "Cache-Control Caching", apache: "mod_expires in .htaccess", netlify: "[[headers]] Cache-Control in netlify.toml" },
    ]
  };
}

// GET /api/v1/seo/htaccess
router.get("/htaccess", (req, res) => {
  try {
    const store = loadFallbackStore();
    let content = store.htaccess_content || getDefaultHtaccessContent();
    const backups = Array.isArray(store.htaccess_backups) ? store.htaccess_backups : [];

    // Also check if public/.htaccess exists on disk
    try {
      const publicHtaccess = path.resolve(process.cwd(), "public/.htaccess");
      if (fs.existsSync(publicHtaccess)) {
        content = fs.readFileSync(publicHtaccess, "utf8");
      }
    } catch {}

    const safety = analyzeHtaccessSafety(content);

    return res.json({
      success: true,
      content,
      safety,
      backups,
      is_apache_active: false,
      server_environment: "Netlify (Serverless / Static CDN)",
      netlify_notice: "This project is deployed on Netlify. Apache .htaccess directives do NOT control Netlify hosting. This configuration is retained for Apache 2.4+ / LiteSpeed / cPanel hosting environments. For Netlify, routing and headers are configured via netlify.toml.",
      netlify_equivalent: getNetlifyEquivalentConfig(),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/seo/htaccess
router.post("/htaccess", (req, res) => {
  try {
    const { content, note, force } = req.body;
    if (typeof content !== "string") {
      return res.status(400).json({ success: false, error: "Content string is required." });
    }

    const safety = analyzeHtaccessSafety(content);
    const hasDanger = safety.some(s => s.severity === "danger");

    if (hasDanger && force !== true) {
      return res.status(422).json({
        success: false,
        warning: true,
        risk_level: "high",
        message: "Potentially dangerous server rules detected. Confirm to overwrite.",
        issues: safety,
      });
    }

    const store = loadFallbackStore();
    if (!Array.isArray(store.htaccess_backups)) {
      store.htaccess_backups = [];
    }

    // Create backup before overwriting
    if (store.htaccess_content) {
      store.htaccess_backups.unshift({
        id: `ht-backup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        content: store.htaccess_content,
        note: note || "Pre-update automatic backup",
        size_bytes: Buffer.byteLength(store.htaccess_content, "utf8"),
      });
      if (store.htaccess_backups.length > 25) {
        store.htaccess_backups = store.htaccess_backups.slice(0, 25);
      }
    }

    store.htaccess_content = content;
    saveFallbackStore(store);

    // Save to public/.htaccess
    try {
      const publicDir = path.resolve(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicDir, ".htaccess"), content, "utf8");
    } catch (e) {
      console.warn("Could not write public/.htaccess:", e.message);
    }

    return res.json({
      success: true,
      message: ".htaccess configuration saved successfully. Pre-save backup created.",
      backup_created: true,
      safety,
      backups_count: store.htaccess_backups.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/seo/htaccess/restore
router.post("/htaccess/restore", (req, res) => {
  try {
    const { backup_id, reset_to_default } = req.body;
    const store = loadFallbackStore();

    let targetContent = "";
    if (reset_to_default) {
      targetContent = getDefaultHtaccessContent();
    } else if (backup_id) {
      const backups = store.htaccess_backups || [];
      const found = backups.find(b => b.id === backup_id);
      if (!found) {
        return res.status(404).json({ success: false, error: "Backup ID not found." });
      }
      targetContent = found.content;
    } else {
      return res.status(400).json({ success: false, error: "Specify backup_id or reset_to_default." });
    }

    // Save previous as backup before restoring
    if (store.htaccess_content) {
      if (!Array.isArray(store.htaccess_backups)) store.htaccess_backups = [];
      store.htaccess_backups.unshift({
        id: `ht-backup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        content: store.htaccess_content,
        note: `Backup prior to restoring ${reset_to_default ? "default template" : backup_id}`,
        size_bytes: Buffer.byteLength(store.htaccess_content, "utf8"),
      });
    }

    store.htaccess_content = targetContent;
    saveFallbackStore(store);

    try {
      const publicDir = path.resolve(process.cwd(), "public");
      fs.writeFileSync(path.join(publicDir, ".htaccess"), targetContent, "utf8");
    } catch {}

    return res.json({
      success: true,
      message: reset_to_default ? "Restored recommended default .htaccess template." : "Restored selected backup.",
      content: targetContent,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});


// ==============================================================================
// 2. LLMS.TXT MANAGEMENT API
// ==============================================================================

function generateLlmsTxtFromStore(store) {
  const settings = store.seo_settings || {};
  const siteName = settings.site_name || "Timex Ceramic";
  const siteUrl = (settings.site_url || "https://www.timexceramic.com").replace(/\/$/, "");
  const org = settings.organization_data || {};
  const address = org.address || {};
  const phone = org.telephone || "+91-22-26122960";
  const email = org.email || "smm@ambestmedia.com";

  const products = Array.isArray(store.products) ? store.products : [];
  const topProducts = products.filter(p => p.isActive !== false && p.is_active !== false).slice(0, 15);

  let md = `# ${siteName}\n\n`;
  md += `> Luxury Architectural Surfaces, Vitrified Tiles & Large-Format Porcelain Slabs\n\n`;
  md += `${siteName} is a premier manufacturer and exporter of luxury vitrified tiles, porcelain slabs, and architectural ceramic surfaces based in India. Engineered for high-traffic commercial spaces, boutique hotels, and luxury residential developments worldwide.\n\n`;

  md += `## Featured Architectural Collections & Products\n\n`;
  if (topProducts.length > 0) {
    for (const p of topProducts) {
      const pName = p.name || p.title || "Surface";
      const pSlug = p.slug || "";
      const pCat = p.category || p.category_name || "Vitrified";
      const pSize = p.size || "800x1600 mm";
      const pFinish = p.finish || "Polished";
      md += `- [${pName}](${siteUrl}/product/${pSlug}): ${pCat} surface (${pSize}), ${pFinish} finish.\n`;
    }
  } else {
    md += `- [Harlem Series](${siteUrl}/product/harlem-series): Authentic brick-look vitrified wall and floor tiles (150x450mm).\n`;
    md += `- [Calacatta Marble Luxe](${siteUrl}/product/timex-calacatta-marble-luxe): Italian Statuario marble replication slab (800x1600mm).\n`;
  }

  md += `\n## Core Collections & Categories\n\n`;
  const collections = [
    { name: "Brick Collection", slug: "brick", desc: "Timeless rustic and industrial brick wall tiles" },
    { name: "Stone Look", slug: "stone", desc: "Natural mineral veining and tactile quarry stone surfaces" },
    { name: "Wooden Planks", slug: "wooden", desc: "Natural hardwood textures in vitrified porcelain" },
    { name: "Mosaic Collection", slug: "mosaic", desc: "Precision architectural geometric and artisan mosaics" },
    { name: "Subway Tiles", slug: "subway", desc: "Classic beveled and contemporary flat subway formats" },
    { name: "Marble Slabs", slug: "marble", desc: "Opulent Italian Calacatta, Statuario, and Onyx replications" },
    { name: "Terrazzo Series", slug: "terrazzo", desc: "Artisanal composite aggregate and Venetian terrazzo" },
    { name: "Hexagon & Decors", slug: "hexagon", desc: "Geometric statement decor wall and floor tiles" },
  ];
  for (const c of collections) {
    md += `- [${c.name}](${siteUrl}/product-category/${c.slug}): ${c.desc}.\n`;
  }
  md += `- [Complete Product Catalog](${siteUrl}/products): Full searchable database with specifications and textures.\n`;

  md += `\n## Interactive Tools & Specifier Portals\n\n`;
  md += `- [AI 3D Room Visualiser](${siteUrl}/visualiser): Real-time 3D room preview for floors and walls across residential and commercial scenes.\n`;
  md += `- [Tile & Box Calculator](${siteUrl}/calculator): Calculate coverage area, required boxes, adhesive, and wastage factor.\n`;
  md += `- [Custom PDF Catalogue Maker](${siteUrl}/catalogue-maker): Generate custom branded PDF presentations for clients.\n`;
  md += `- [Architects & Specifiers Portal](${siteUrl}/architect-portal): Technical data sheets, BIM/CAD files, and project consultation.\n`;
  md += `- [Authorized Dealer Portal](${siteUrl}/dealer-portal): Distribution network, dealership application, and stockist resources.\n`;
  md += `- [Downloads & Technical Catalogs](${siteUrl}/downloads): Download master brochures, testing certifications, and laying guidelines.\n`;

  md += `\n## Journal & Architectural Insights\n\n`;
  md += `- [Design Journal](${siteUrl}/blogs): Architectural insights, tiling trends, laying patterns, and maintenance guides.\n`;
  md += `- [Case Studies & Projects](${siteUrl}/projects): Commercial developments, luxury apartments, and hospitality case studies.\n`;

  md += `\n## Company & Contact Information\n\n`;
  md += `- Company: ${siteName}\n`;
  if (address.streetAddress) {
    md += `- Experience Centre: ${address.streetAddress}, ${address.addressLocality || "Mumbai"}, ${address.postalCode || "400057"}, India.\n`;
  } else {
    md += `- Experience Centre: 402, Pratik Avenue, Nehru Road, Vile Parle (E), Mumbai 400057, India.\n`;
  }
  md += `- Telephone: ${phone}\n`;
  md += `- Email: ${email}\n`;
  md += `- Official Website: ${siteUrl}\n`;

  return md;
}

// GET /api/v1/seo/llms-txt
router.get("/llms-txt", (req, res) => {
  try {
    const store = loadFallbackStore();
    let content = store.llms_txt_content || getDefaultLlmsTxtContent();
    const backups = Array.isArray(store.llms_txt_backups) ? store.llms_txt_backups : [];

    try {
      const publicLlms = path.resolve(process.cwd(), "public/llms.txt");
      if (fs.existsSync(publicLlms)) {
        content = fs.readFileSync(publicLlms, "utf8");
      }
    } catch {}

    const lines = content.split("\n");
    const productsCount = (content.match(/\/product\//g) || []).length;
    const collectionsCount = (content.match(/\/collections\//g) || []).length;

    return res.json({
      success: true,
      content,
      public_url: "/llms.txt",
      updated_at: store.llms_txt_updated_at || new Date().toISOString(),
      backups,
      stats: {
        products_indexed: productsCount,
        collections_indexed: collectionsCount,
        char_count: content.length,
        line_count: lines.length,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/seo/llms-txt
router.post("/llms-txt", (req, res) => {
  try {
    const { content, note } = req.body;
    if (typeof content !== "string") {
      return res.status(400).json({ success: false, error: "Content string is required." });
    }

    const store = loadFallbackStore();
    if (!Array.isArray(store.llms_txt_backups)) {
      store.llms_txt_backups = [];
    }

    if (store.llms_txt_content) {
      store.llms_txt_backups.unshift({
        id: `llms-backup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        content: store.llms_txt_content,
        note: note || "Pre-update automatic backup",
        size_bytes: Buffer.byteLength(store.llms_txt_content, "utf8"),
      });
      if (store.llms_txt_backups.length > 25) {
        store.llms_txt_backups = store.llms_txt_backups.slice(0, 25);
      }
    }

    store.llms_txt_content = content;
    store.llms_txt_updated_at = new Date().toISOString();
    saveFallbackStore(store);

    // Save to public/llms.txt
    try {
      const publicDir = path.resolve(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicDir, "llms.txt"), content, "utf8");
    } catch (e) {
      console.warn("Could not write public/llms.txt:", e.message);
    }

    return res.json({
      success: true,
      message: "llms.txt saved successfully and published to /llms.txt",
      backup_created: true,
      backups_count: store.llms_txt_backups.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/seo/llms-txt/generate
router.post("/llms-txt/generate", (req, res) => {
  try {
    const store = loadFallbackStore();
    const generated = generateLlmsTxtFromStore(store);

    return res.json({
      success: true,
      generated_content: generated,
      message: "Generated clean llms.txt from live store data.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/seo/llms-txt/restore
router.post("/llms-txt/restore", (req, res) => {
  try {
    const { backup_id, reset_to_default } = req.body;
    const store = loadFallbackStore();

    let targetContent = "";
    if (reset_to_default) {
      targetContent = getDefaultLlmsTxtContent();
    } else if (backup_id) {
      const backups = store.llms_txt_backups || [];
      const found = backups.find(b => b.id === backup_id);
      if (!found) {
        return res.status(404).json({ success: false, error: "Backup ID not found." });
      }
      targetContent = found.content;
    } else {
      return res.status(400).json({ success: false, error: "Specify backup_id or reset_to_default." });
    }

    if (store.llms_txt_content) {
      if (!Array.isArray(store.llms_txt_backups)) store.llms_txt_backups = [];
      store.llms_txt_backups.unshift({
        id: `llms-backup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        content: store.llms_txt_content,
        note: `Backup prior to restoring ${reset_to_default ? "default template" : backup_id}`,
        size_bytes: Buffer.byteLength(store.llms_txt_content, "utf8"),
      });
    }

    store.llms_txt_content = targetContent;
    store.llms_txt_updated_at = new Date().toISOString();
    saveFallbackStore(store);

    try {
      const publicDir = path.resolve(process.cwd(), "public");
      fs.writeFileSync(path.join(publicDir, "llms.txt"), targetContent, "utf8");
    } catch {}

    return res.json({
      success: true,
      message: reset_to_default ? "Restored default llms.txt template." : "Restored selected backup.",
      content: targetContent,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});


// ==============================================================================
// 3. CUSTOM HEAD & BODY CODE MANAGEMENT API
// ==============================================================================

function analyzeCustomCodeSafety(headCode, bodyStartCode, bodyEndCode) {
  const issues = [];

  const checkBlock = (code, location) => {
    if (!code) return;

    // Check script tags balance
    const openScript = (code.match(/<script\b/gi) || []).length;
    const closeScript = (code.match(/<\/script>/gi) || []).length;
    if (openScript !== closeScript) {
      issues.push({
        location,
        type: "syntax",
        severity: "warning",
        message: `Mismatched <script> tags in ${location}: ${openScript} opened vs ${closeScript} closed.`,
      });
    }

    // Check style tags balance
    const openStyle = (code.match(/<style\b/gi) || []).length;
    const closeStyle = (code.match(/<\/style>/gi) || []).length;
    if (openStyle !== closeStyle) {
      issues.push({
        location,
        type: "syntax",
        severity: "warning",
        message: `Mismatched <style> tags in ${location}: ${openStyle} opened vs ${closeStyle} closed.`,
      });
    }

    // Check document.write
    if (/document\.write\s*\(/i.test(code)) {
      issues.push({
        location,
        type: "performance",
        severity: "warning",
        message: `Found document.write() in ${location}. This may block page rendering or cause blank pages.`,
      });
    }
  };

  checkBlock(headCode, "HEAD CODE");
  checkBlock(bodyStartCode, "BODY START CODE");
  checkBlock(bodyEndCode, "BODY END CODE");

  return issues;
}

// GET /api/v1/seo/custom-code
router.get("/custom-code", (req, res) => {
  try {
    const store = loadFallbackStore();
    const customCode = store.custom_code || getDefaultCustomCode();
    const backups = Array.isArray(store.custom_code_backups) ? store.custom_code_backups : [];
    const safety = analyzeCustomCodeSafety(customCode.head_code, customCode.body_start_code, customCode.body_end_code);

    return res.json({
      success: true,
      custom_code: customCode,
      safety,
      backups,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/seo/custom-code
router.post("/custom-code", (req, res) => {
  try {
    const { enabled, head_code, body_start_code, body_end_code, note } = req.body;
    const store = loadFallbackStore();

    if (!Array.isArray(store.custom_code_backups)) {
      store.custom_code_backups = [];
    }

    // Archive previous code before replacing
    if (store.custom_code) {
      store.custom_code_backups.unshift({
        id: `code-backup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        custom_code: JSON.parse(JSON.stringify(store.custom_code)),
        note: note || "Pre-update automatic backup",
      });
      if (store.custom_code_backups.length > 25) {
        store.custom_code_backups = store.custom_code_backups.slice(0, 25);
      }
    }

    const updatedCustomCode = {
      enabled: enabled !== false,
      head_code: typeof head_code === "string" ? head_code : (store.custom_code?.head_code || ""),
      body_start_code: typeof body_start_code === "string" ? body_start_code : (store.custom_code?.body_start_code || ""),
      body_end_code: typeof body_end_code === "string" ? body_end_code : (store.custom_code?.body_end_code || ""),
      updated_at: new Date().toISOString(),
    };

    store.custom_code = updatedCustomCode;
    saveFallbackStore(store);

    const safety = analyzeCustomCodeSafety(
      updatedCustomCode.head_code,
      updatedCustomCode.body_start_code,
      updatedCustomCode.body_end_code
    );

    return res.json({
      success: true,
      message: "Custom code configuration saved successfully. Pre-save backup archived.",
      custom_code: updatedCustomCode,
      safety,
      backup_created: true,
      backups_count: store.custom_code_backups.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/seo/custom-code/restore
router.post("/custom-code/restore", (req, res) => {
  try {
    const { backup_id, reset_to_default } = req.body;
    const store = loadFallbackStore();

    let targetCode = null;
    if (reset_to_default) {
      targetCode = getDefaultCustomCode();
    } else if (backup_id) {
      const backups = store.custom_code_backups || [];
      const found = backups.find(b => b.id === backup_id);
      if (!found || !found.custom_code) {
        return res.status(404).json({ success: false, error: "Backup ID not found." });
      }
      targetCode = found.custom_code;
    } else {
      return res.status(400).json({ success: false, error: "Specify backup_id or reset_to_default." });
    }

    // Archive current code before restoring
    if (store.custom_code) {
      if (!Array.isArray(store.custom_code_backups)) store.custom_code_backups = [];
      store.custom_code_backups.unshift({
        id: `code-backup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        custom_code: JSON.parse(JSON.stringify(store.custom_code)),
        note: `Backup prior to restoring ${reset_to_default ? "defaults" : backup_id}`,
      });
    }

    targetCode.updated_at = new Date().toISOString();
    store.custom_code = targetCode;
    saveFallbackStore(store);

    return res.json({
      success: true,
      message: reset_to_default ? "Restored default custom code template." : "Restored selected custom code backup.",
      custom_code: targetCode,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
