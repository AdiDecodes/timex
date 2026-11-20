const express = require("express");
const router = express.Router();
const { loadFallbackStore, saveFallbackStore } = require("../config/db");

const DEFAULT_PAGES = [
  { id: "page-home", title: "Home - Luxury Surfaces", slug: "home", path: "/", template: "Landing Page", status: "Published", metaTitle: "Timex Ceramic | International Premium Tiles", metaDescription: "Experience luxury surfaces with Timex Ceramic. Explore premium floor tiles, vitrified slabs, bathware, and interactive visualizers.", is_trashed: false },
  { id: "page-products", title: "World of Tiles", slug: "world-of-tiles", path: "/world-of-tiles", template: "World of Tiles Grid", status: "Published", metaTitle: "World of Tiles | Timex Ceramic", metaDescription: "Explore 500+ architectural tile surfaces across 20 curated categories.", is_trashed: false },
  { id: "page-collections", title: "Design Collections", slug: "collections", path: "/collections", template: "Collections Gallery", status: "Published", metaTitle: "Curated Design Collections | Timex Ceramic", metaDescription: "Explore our curated design collections inspired by Italian artistry.", is_trashed: false },
  { id: "page-about", title: "About Timex Ceramic", slug: "about", path: "/about", template: "Corporate Story", status: "Published", metaTitle: "About Us | Timex Ceramic Luxury Surfaces", metaDescription: "Over two decades of ceramic innovation, global exports, and architectural surface engineering.", is_trashed: false },
  { id: "page-contact", title: "Contact & Experience Centre", slug: "contact", path: "/contact", template: "Contact & Locator", status: "Published", metaTitle: "Contact Us & Mumbai Experience Centre | Timex Ceramic", metaDescription: "Connect with Timex Ceramic relationship managers or visit our Mumbai Experience Centre.", is_trashed: false },
  { id: "page-visualiser", title: "3D Room Visualizer", slug: "visualiser", path: "/visualiser", template: "Interactive Tool", status: "Published", metaTitle: "AI 3D Room Visualiser | Timex Ceramic", metaDescription: "Experience virtual reality tile placement inside 3D architectures.", is_trashed: false },
  { id: "page-calculator", title: "Tile Area Calculator", slug: "calculator", path: "/calculator", template: "Utility Calculator", status: "Published", metaTitle: "Tile Area & Box Requirement Calculator | Timex Ceramic", metaDescription: "Calculate boxes, wastage allowance, and adhesive requirements.", is_trashed: false },
  { id: "page-catalogue-maker", title: "PDF Catalogue Maker", slug: "catalogue-maker", path: "/catalogue-maker", template: "Export Tool", status: "Published", metaTitle: "Custom PDF Catalogue Maker | Timex Ceramic", metaDescription: "Curate tailored product specifications into branded client presentations.", is_trashed: false },
  { id: "page-architect-portal", title: "Architect Portal", slug: "architect-portal", path: "/architect-portal", template: "B2B Portal", status: "Published", metaTitle: "Architect & Specifier Portal | Timex Ceramic", metaDescription: "Technical specifications, CAD/BIM downloads, and commercial procurement for specifiers.", is_trashed: false },
  { id: "page-dealer-portal", title: "Dealer Portal", slug: "dealer-portal", path: "/dealer-portal", template: "B2B Portal", status: "Published", metaTitle: "Authorized Dealer & Stockist Portal | Timex Ceramic", metaDescription: "Distributor onboarding and dealer inventory resources.", is_trashed: false },
  { id: "page-downloads", title: "Technical Downloads", slug: "downloads", path: "/downloads", template: "Download Center", status: "Published", metaTitle: "Technical Downloads & Certifications | Timex Ceramic", metaDescription: "Download test reports, ISO certificates, and product brochures.", is_trashed: false },
  { id: "page-inspiration", title: "Inspiration Gallery", slug: "inspiration", path: "/inspiration", template: "Lookbook", status: "Published", metaTitle: "Inspiration Lookbook & Spaces | Timex Ceramic", metaDescription: "Architectural inspiration for living spaces, wet lounges, and luxury facades.", is_trashed: false },
  { id: "page-projects", title: "Architectural Projects", slug: "projects", path: "/projects", template: "Case Studies", status: "Published", metaTitle: "Architectural Projects & Installations | Timex Ceramic", metaDescription: "Case studies across luxury villas, corporate towers, and boutique hotels.", is_trashed: false },
  { id: "page-compare", title: "Product Comparison", slug: "compare", path: "/compare", template: "Compare Table", status: "Published", metaTitle: "Compare Surfaces & Slabs | Timex Ceramic", metaDescription: "Compare tile technical specifications side-by-side.", is_trashed: false },
  { id: "page-wishlist", title: "Project Wishlist", slug: "wishlist", path: "/wishlist", template: "Client Wishlist", status: "Published", metaTitle: "Saved Surfaces & Project Wishlist | Timex Ceramic", metaDescription: "Review saved finishes and generate enquiry proposals.", is_trashed: false },
];

function ensurePagesInitialized(store) {
  if (!Array.isArray(store.pages) || store.pages.length === 0) {
    store.pages = JSON.parse(JSON.stringify(DEFAULT_PAGES));
    saveFallbackStore(store);
  }
  return store.pages;
}

// GET /api/v1/pages
router.get("/", (req, res) => {
  try {
    const store = loadFallbackStore();
    ensurePagesInitialized(store);

    const includeTrashed = req.query.includeTrashed === "true";
    let pages = store.pages || [];

    if (!includeTrashed) {
      pages = pages.filter((p) => !p.is_trashed);
    }

    const search = (req.query.search || "").toLowerCase().trim();
    if (search) {
      pages = pages.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.slug.toLowerCase().includes(search) ||
          p.path.toLowerCase().includes(search)
      );
    }

    return res.json({ success: true, count: pages.length, pages });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/pages
router.post("/", (req, res) => {
  const data = req.body;
  if (!data.title || !data.path) {
    return res.status(400).json({ success: false, error: "Page title and path are required." });
  }

  try {
    const store = loadFallbackStore();
    ensurePagesInitialized(store);

    const slug = data.slug || data.path.replace(/^\//, "").replace(/\//g, "-") || "custom-page";
    const newPage = {
      id: `page-${Date.now()}`,
      title: data.title.trim(),
      slug,
      path: data.path.startsWith("/") ? data.path : `/${data.path}`,
      template: data.template || "Standard Page",
      status: data.status || "Published",
      metaTitle: data.metaTitle || `${data.title} | Timex Ceramic`,
      metaDescription: data.metaDescription || "",
      is_trashed: false,
      deleted_at: null,
      deleted_by: null,
      updatedAt: new Date().toISOString(),
    };

    store.pages = [newPage, ...(store.pages || [])];
    saveFallbackStore(store);

    return res.status(201).json({ success: true, page: newPage });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/pages/:id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const store = loadFallbackStore();
    ensurePagesInitialized(store);

    const idx = (store.pages || []).findIndex((p) => p.id === id || p.slug === id);
    if (idx === -1) return res.status(404).json({ success: false, error: "Page not found." });

    const updated = {
      ...store.pages[idx],
      ...updates,
      id: store.pages[idx].id,
      updatedAt: new Date().toISOString(),
    };

    store.pages[idx] = updated;

    // Sync to store.seo_metadata
    if (!Array.isArray(store.seo_metadata)) {
      store.seo_metadata = [];
    }
    const pageTarget = updated.path || (updated.slug ? `/${updated.slug}` : "/");
    const seoIdx = store.seo_metadata.findIndex((s) => s.page_path === pageTarget);
    const seoRecord = {
      id: seoIdx >= 0 ? store.seo_metadata[seoIdx].id : `seo-page-${updated.id}`,
      page_path: pageTarget,
      content_type: "page",
      content_id: updated.id,
      title: updated.title || "",
      meta_title: updated.metaTitle || updated.meta_title || updated.title || "",
      seo_title: updated.metaTitle || updated.meta_title || updated.title || "",
      meta_description: updated.metaDescription || updated.meta_description || "",
      updated_at: new Date().toISOString(),
    };
    if (seoIdx >= 0) {
      store.seo_metadata[seoIdx] = { ...store.seo_metadata[seoIdx], ...seoRecord };
    } else {
      store.seo_metadata.push(seoRecord);
    }

    saveFallbackStore(store);

    return res.json({ success: true, page: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/pages/:id (SOFT DELETE -> Recycle Bin)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    ensurePagesInitialized(store);

    const page = (store.pages || []).find((p) => p.id === id || p.slug === id);
    if (!page) return res.status(404).json({ success: false, error: "Page not found." });

    page.is_trashed = true;
    page.deleted_at = new Date().toISOString();
    page.deleted_by = req.body?.deletedBy || "admin";

    saveFallbackStore(store);
    return res.json({ success: true, message: `Page "${page.title}" moved to Recycle Bin.`, page });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/pages/:id/restore
router.post("/:id/restore", (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    ensurePagesInitialized(store);

    const page = (store.pages || []).find((p) => p.id === id || p.slug === id);
    if (!page) return res.status(404).json({ success: false, error: "Page not found in Recycle Bin." });

    page.is_trashed = false;
    page.deleted_at = null;
    page.deleted_by = null;

    saveFallbackStore(store);
    return res.json({ success: true, message: `Page "${page.title}" restored.`, page });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/pages/:id/permanent
router.delete("/:id/permanent", (req, res) => {
  const { id } = req.params;
  try {
    const store = loadFallbackStore();
    ensurePagesInitialized(store);

    const idx = (store.pages || []).findIndex((p) => p.id === id || p.slug === id);
    if (idx === -1) return res.status(404).json({ success: false, error: "Page not found." });

    const page = store.pages[idx];
    store.pages.splice(idx, 1);
    saveFallbackStore(store);

    return res.json({ success: true, message: `Page "${page.title}" permanently deleted.` });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
