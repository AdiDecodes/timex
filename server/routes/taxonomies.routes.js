const express = require("express");
const router = express.Router();
const { getPool, isMysqlConnected, loadFallbackStore, saveFallbackStore } = require("../config/db");
const defaultSpaces = require("../data/defaultSpaces.json");

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const BASE_CATEGORIES = [
  { id: "brick", name: "Brick", slug: "brick", description: "Urban textures for timeless charm.", banner: "https://www.timexceramic.com/wp-content/uploads/2025/08/timex-ceramic-harlem-series-blue-wall-and-floor-tiles-shiny-finish-tiles-ambience.jpg" },
  { id: "marble", name: "Marble", slug: "marble", description: "Luxury that never goes out of style.", banner: "https://www.timexceramic.com/wp-content/uploads/2022/10/204-Conept-Ambiance1.jpg" },
  { id: "hexagon", name: "Hexagon", slug: "hexagon", description: "Geometric beauty in every detail.", banner: "https://www.timexceramic.com/wp-content/uploads/2025/05/Lancaster-amb1.jpg" },
  { id: "modular", name: "Modular", slug: "modular", description: "Sleek. Versatile. Effortlessly modern.", banner: "https://www.timexceramic.com/wp-content/uploads/2024/02/clinker-amb1.jpg" },
  { id: "stone", name: "Stone", slug: "stone", description: "Raw textures. Grounded elegance.", banner: "https://www.timexceramic.com/wp-content/uploads/2026/06/AMB_NAZCA-BEIGE.webp" },
  { id: "subway", name: "Subway", slug: "subway", description: "Classic lines for contemporary spaces.", banner: "https://www.timexceramic.com/wp-content/uploads/2025/02/Makalu-amb.jpg" },
  { id: "moroccan", name: "Moroccan", slug: "moroccan", description: "Bold patterns. Timeless soul.", banner: "https://www.timexceramic.com/wp-content/uploads/2026/03/1004-01.webp" },
  { id: "octagonal", name: "Octagonal", slug: "octagonal", description: "Vintage shapes. Modern appeal.", banner: "https://www.timexceramic.com/wp-content/uploads/2024/05/Ambiente-Betera-Blanco-amb.jpg" },
  { id: "wooden", name: "Wooden", slug: "wooden", description: "The warmth of wood. The ease of tile.", banner: "https://www.timexceramic.com/wp-content/uploads/2024/07/Couvet-Roble-amb.jpg" },
  { id: "texture", name: "Texture", slug: "texture", description: "Feel the surface. See the depth.", banner: "https://www.timexceramic.com/wp-content/uploads/2024/11/8002-amb.jpg" },
  { id: "colorful", name: "Colorful", slug: "colorful", description: "Add life. Add personality.", banner: "https://www.timexceramic.com/wp-content/uploads/2025/12/Blinds-Ambience1.jpg" },
  { id: "terrazzo", name: "Terrazzo", slug: "terrazzo", description: "Retro vibes. Modern twist.", banner: "https://www.timexceramic.com/wp-content/uploads/2024/11/12001-amb.jpg" },
  { id: "tropical", name: "Tropical", slug: "tropical", description: "Inspired by nature. Made for calm.", banner: "https://www.timexceramic.com/wp-content/uploads/2026/03/1004-01-650x650.webp" },
  { id: "metallic", name: "Metallic", slug: "metallic", description: "Shine subtly. Stand out effortlessly.", banner: "https://www.timexceramic.com/wp-content/uploads/2022/05/202-light-amb-newly.jpg" },
  { id: "highlighter", name: "Highlighter", slug: "highlighter", description: "Make a statement. Every single time.", banner: "https://www.timexceramic.com/wp-content/uploads/2022/05/5136-amb-n.jpg" },
  { id: "mosaic", name: "Mosaic", slug: "mosaic", description: "Tiny tiles. Big impact.", banner: "https://www.timexceramic.com/wp-content/uploads/2023/11/GM-02-Blue-Amb.jpg" },
  { id: "boutique", name: "Boutique", slug: "boutique", description: "Unique designs for unique spaces.", banner: "https://www.timexceramic.com/wp-content/uploads/2024/11/kyoto-snow-palace.jpg" },
  { id: "french-frames", name: "French frames", slug: "french-frames", description: "Timeless patterns. Effortless grace.", banner: "https://www.timexceramic.com/wp-content/uploads/2025/12/Fables-Amb1.jpg" },
  { id: "fabric", name: "Fabric", slug: "fabric", description: "Soft strokes. Strong presence.", banner: "https://www.timexceramic.com/wp-content/uploads/2023/11/Fabric-Crema-Tropical-Amb.jpg" },
];

const BASE_COLLECTIONS = [
  { id: "coll-brick", name: "Brick Collection", slug: "brick" },
  { id: "coll-marble", name: "Marble Collection", slug: "marble" },
  { id: "coll-hexagon", name: "Hexagon Collection", slug: "hexagon" },
  { id: "coll-modular", name: "Modular Collection", slug: "modular" },
  { id: "coll-stone", name: "Stone Collection", slug: "stone" },
  { id: "coll-subway", name: "Subway Collection", slug: "subway" },
  { id: "coll-moroccan", name: "Moroccan Collection", slug: "moroccan" },
  { id: "coll-octagonal", name: "Octagonal Collection", slug: "octagonal" },
  { id: "coll-wooden", name: "Wooden Collection", slug: "wooden" },
  { id: "coll-texture", name: "Texture Collection", slug: "texture" },
  { id: "coll-colorful", name: "Colorful Collection", slug: "colorful" },
  { id: "coll-terrazzo", name: "Terrazzo Collection", slug: "terrazzo" },
  { id: "coll-tropical", name: "Tropical Collection", slug: "tropical" },
  { id: "coll-metallic", name: "Metallic Collection", slug: "metallic" },
  { id: "coll-highlighter", name: "Highlighter Collection", slug: "highlighter" },
  { id: "coll-mosaic", name: "Mosaic Collection", slug: "mosaic" },
  { id: "coll-boutique", name: "Boutique Collection", slug: "boutique" },
  { id: "coll-french-frames", name: "French Frames Collection", slug: "french-frames" },
  { id: "coll-fabric", name: "Fabric Collection", slug: "fabric" },
];

const BASE_SPACES = [
  "Bathroom Tiles",
  "Kitchen Tiles",
  "Living & Dining Room Tiles",
  "Bedroom Tiles",
  "Balcony & Terrace Tiles",
  "Elevation & Exterior Tiles",
  "Hotel & Hospitality Tiles",
  "Café & Restaurant Tiles",
  "Commercial & Office Tiles",
  "Spa & Wellness Tiles",
  "Swimming Pool Tiles",
  "Outdoor & Landscape Tiles",
];

const DEFAULT_SUBCATEGORIES_BY_CATEGORY = {
  brick: ["Rustic Brick", "Glossy Brick", "Subway Brick", "Antique Brick", "Exposed Brick", "Handmade Brick"],
  stone: ["Slate Look", "Travertine", "Limestone", "Sandstone", "Quartzite", "River Pebble", "Cleft Stone"],
  wooden: ["Oak Wood", "Teak Wood", "Walnut Wood", "Chevron Planks", "Rustic Hardwood", "Weathered Timber"],
  marble: ["Calacatta", "Statuario", "Carrara", "Black Marquina", "Onyx", "Travertino Marble", "Gold Vein"],
  subway: ["Beveled Subway", "Flat Subway", "Crackle Glaze Subway", "Gloss Subway", "Matte Subway", "Fluted Subway"],
  mosaic: ["Glass Mosaic", "Hexagonal Mosaic", "Penny Round Mosaic", "Herringbone Mosaic", "Stone Mosaic", "Metallic Mosaic"],
  hexagon: ["Mini Hexagon", "Large Hexagon", "Geometric Hexagon", "3D Hexagon", "Patterned Hexagon"],
  moroccan: ["Encaustic Star", "Floral Arabesque", "Zellige", "Mediterranean Patchwork", "Geometric Moroccan"],
  modular: ["French Pattern", "4-Format Modular", "Versailles Pattern", "Border Framing", "Roman Modular"],
  terrazzo: ["Micro-Terrazzo", "Venetian Chunky Aggregate", "Pastel Terrazzo", "Monochrome Terrazzo", "Polished Terrazzo"],
  tropical: ["Botanical Leaves", "Palm Fronds", "Exotic Floral", "Jungle Green", "Paradise Bloom"],
  metallic: ["Brushed Gold", "Oxidized Rust", "Copper Glaze", "Titanium Steel", "Gunmetal Metallic"],
  texture: ["Fluted Lines", "Wave Relief", "Chiseled Carving", "Ribbed Texture", "Geometric Embossed"],
  colorful: ["Emerald Green", "Cobalt Blue", "Terracotta Clay", "Mustard Yellow", "Pastel Pink", "Sage Green"],
  highlighter: ["Gold Leaf Accents", "Decorative Feature Strips", "Luxury Highlighter Slabs", "Lustre Motifs"],
  white: ["Pure Super White", "Silk Off-White", "Chalk Matte", "Warm Ivory", "Frost Polished"],
  "french-frames": ["Classic French Moulding", "Ornate Frame", "Geometric Border", "Panel Dado"],
  octagonal: ["Victorian Octagon with Dot", "Classic Octagonal", "Beveled Octagon"],
  fabric: ["Linen Weave", "Tweed Texture", "Silk Canvas", "Burlap Relief"],
  geometric: ["Chevron", "Diamonds", "Cube 3D", "Abstract Lines", "Harlequin"],
  boutique: ["Art Deco", "Handcrafted Cotto", "Bespoke Atelier", "Designer Boutique"],
};

const DEFAULT_BLOG_CATEGORIES = [
  {
    id: "bcat-trends",
    name: "TRENDS",
    slug: "trends",
    description: "Latest architectural movements, contemporary tile styling, and emerging design trends.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    order: 1,
    seoTitle: "Tile & Architectural Trends | Timex Ceramic Blog",
    metaDescription: "Explore international ceramic surface trends, modern palettes, and architectural styles.",
  },
  {
    id: "bcat-design-tips",
    name: "DESIGN TIPS",
    slug: "design-tips",
    description: "Expert advice on selecting finishes, laying patterns, and styling luxury residential and commercial spaces.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    order: 2,
    seoTitle: "Tile Design & Installation Tips | Timex Ceramic",
    metaDescription: "Actionable interior design and tile installation advice from industry masters.",
  },
  {
    id: "bcat-creative",
    name: "CREATIVE",
    slug: "creative",
    description: "Inspiring projects, creative architectural applications, and bespoke pattern layouts.",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    order: 3,
    seoTitle: "Creative Tile Design Concepts | Timex Ceramic",
    metaDescription: "Innovative spatial concepts and artistic porcelain tile installations.",
  },
  {
    id: "bcat-news",
    name: "NEWS",
    slug: "news",
    description: "Timex Ceramic company updates, new collection launches, and exhibition highlights.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    order: 4,
    seoTitle: "Timex Ceramic News & Launches",
    metaDescription: "Stay updated with company announcements and new architectural tile arrivals.",
  },
  {
    id: "bcat-guides",
    name: "GUIDES",
    slug: "guides",
    description: "Comprehensive buying guides, technical maintenance instructions, and specification documents.",
    image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    order: 5,
    seoTitle: "Tile Specification & Buying Guides | Timex Ceramic",
    metaDescription: "Technical guidelines on water absorption, PEI ratings, and surface finishes.",
  },
  {
    id: "bcat-architecture",
    name: "ARCHITECTURE",
    slug: "architecture",
    description: "Large format porcelain slabs, exterior facade claddings, and commercial architectural solutions.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    order: 6,
    seoTitle: "Architectural Porcelain & Cladding | Timex Ceramic",
    metaDescription: "Engineered porcelain slabs for exterior facades and large-scale architectural projects.",
  },
];

// Helper to calculate product count for a category
function countProductsForCategory(products, catId, catSlug, catName) {
  if (!Array.isArray(products)) return 0;
  const cId = String(catId || "").toLowerCase().trim();
  const cSlug = String(catSlug || "").toLowerCase().trim();
  const cName = String(catName || "").toLowerCase().trim();
  const cleanToken = cSlug.replace(/^(cat|coll)-/i, "").replace(/\s+(look|finish|tiles|collection|series|pattern)$/i, "").trim();

  const seen = new Set();
  return products.filter((p) => {
    if (
      !p ||
      p.is_trashed ||
      p.isTrashed ||
      p.isActive === false ||
      p.is_active === false ||
      p.status === "Inactive" ||
      p.status === "Draft"
    ) {
      return false;
    }
    const pCatId = (p.categoryId || p.category_id || "").toLowerCase().trim();
    const pCatName = (p.category || p.category_name || "").toLowerCase().trim();
    const pColId = (p.collectionId || p.collection_id || "").toLowerCase().trim();
    const pColName = (p.collection || p.collection_name || "").toLowerCase().trim();

    const secCats = [
      ...(Array.isArray(p.secondaryCategories) ? p.secondaryCategories : []),
      ...(Array.isArray(p.secondary_categories) ? p.secondary_categories : []),
      ...(typeof p.secondary_categories_json === "string" ? (() => { try { return JSON.parse(p.secondary_categories_json); } catch(_) { return []; } })() : [])
    ].map((s) => String(s).toLowerCase().trim());

    const subCats = [
      ...(Array.isArray(p.subcategories) ? p.subcategories : []),
      ...(typeof p.subcategories_json === "string" ? (() => { try { return JSON.parse(p.subcategories_json); } catch(_) { return []; } })() : [])
    ].map((s) => (typeof s === "string" ? s.toLowerCase().trim() : String(s?.name || s?.slug || "").toLowerCase().trim()));

    const isMatch = (
      pCatId === cId ||
      pCatId === cSlug ||
      pCatId === cleanToken ||
      pCatName === cName ||
      pCatName.includes(cSlug) ||
      pCatName.includes(cleanToken) ||
      (cName && pCatName.includes(cName)) ||
      pColId === `coll-${cSlug}` ||
      pColId === cId ||
      pColId.includes(cSlug) ||
      (cName && pColName.includes(cName)) ||
      secCats.includes(cId) ||
      secCats.includes(cSlug) ||
      secCats.includes(cName) ||
      secCats.includes(cleanToken) ||
      secCats.some((sc) => sc === cleanToken || sc.includes(cleanToken) || cleanToken.includes(sc)) ||
      subCats.includes(cId) ||
      subCats.includes(cSlug) ||
      subCats.includes(cName) ||
      subCats.includes(cleanToken)
    );

    if (!isMatch) return false;
    const key = String(p.id || p.slug || "").trim();
    if (key) {
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  }).length;
}

// Helper to normalize category identifier (strip leading cat-)
function normalizeCategoryIdentifier(str) {
  if (!str) return "";
  return String(str).toLowerCase().trim().replace(/^cat-/, "");
}

// Helper to get category FAQs
function getCategoryFaqs(store, catId, catSlug) {
  const normSlug = normalizeCategoryIdentifier(catSlug || catId);
  const rawId = String(catId || "").toLowerCase().trim();
  const rawSlug = String(catSlug || "").toLowerCase().trim();

  let faqs = [];

  // 1. Check store.category_faqs
  if (Array.isArray(store.category_faqs)) {
    faqs = store.category_faqs.filter((f) => {
      const fCatId = String(f.categoryId || f.category_id || "").toLowerCase().trim();
      const fNorm = normalizeCategoryIdentifier(fCatId);
      return (
        fCatId === rawId ||
        fCatId === rawSlug ||
        fCatId === `cat-${normSlug}` ||
        fNorm === normSlug
      );
    });
  }

  // 2. Fallback to store.collection_seo[normSlug].faqs if empty
  if (faqs.length === 0 && store.collection_seo && store.collection_seo[normSlug]?.faqs) {
    const collFaqs = store.collection_seo[normSlug].faqs;
    if (Array.isArray(collFaqs) && collFaqs.length > 0) {
      faqs = collFaqs.map((f, idx) => ({
        id: f.id || `faq-${normSlug}-${idx + 1}`,
        categoryId: catId || `cat-${normSlug}`,
        category_id: catId || `cat-${normSlug}`,
        question: f.question || "",
        answer: f.answer || "",
        displayOrder: Number(f.displayOrder || f.order || idx + 1),
        order: Number(f.displayOrder || f.order || idx + 1),
        status: f.status || "published",
        createdAt: f.createdAt || new Date().toISOString(),
        updatedAt: f.updatedAt || new Date().toISOString(),
      }));
    }
  }

  // Sort by displayOrder / order ascending
  faqs.sort((a, b) => {
    const orderA = Number(a.displayOrder || a.order || 0);
    const orderB = Number(b.displayOrder || b.order || 0);
    return orderA - orderB;
  });

  return faqs;
}

// Helper to save category FAQs
function saveCategoryFaqsHelper(store, catId, catSlug, faqsArray) {
  if (!Array.isArray(store.category_faqs)) {
    store.category_faqs = [];
  }

  const normSlug = normalizeCategoryIdentifier(catSlug || catId);
  const rawId = String(catId || `cat-${normSlug}`).toLowerCase().trim();
  const rawSlug = String(catSlug || normSlug).toLowerCase().trim();

  // Remove existing FAQs for this category
  store.category_faqs = store.category_faqs.filter((f) => {
    const fCatId = String(f.categoryId || f.category_id || "").toLowerCase().trim();
    const fNorm = normalizeCategoryIdentifier(fCatId);
    return !(
      fCatId === rawId ||
      fCatId === rawSlug ||
      fCatId === `cat-${normSlug}` ||
      fNorm === normSlug
    );
  });

  // Add new/updated FAQs
  const savedFaqs = (faqsArray || []).map((item, idx) => {
    const displayOrder = item.displayOrder !== undefined ? Number(item.displayOrder) : (item.order !== undefined ? Number(item.order) : idx + 1);
    return {
      id: item.id && !item.id.startsWith("faq-temp-") ? String(item.id) : `faq-${normSlug}-${Date.now()}-${idx + 1}`,
      categoryId: rawId,
      category_id: rawId,
      question: (item.question || "").trim(),
      answer: (item.answer || "").trim(),
      displayOrder,
      order: displayOrder,
      status: item.status === "draft" ? "draft" : "published",
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  store.category_faqs.push(...savedFaqs);

  // Synchronize store.collection_seo
  if (!store.collection_seo) {
    store.collection_seo = {};
  }
  if (!store.collection_seo[normSlug]) {
    store.collection_seo[normSlug] = {
      slug: normSlug,
      faqs: savedFaqs,
    };
  } else {
    store.collection_seo[normSlug].faqs = savedFaqs;
  }

  return savedFaqs;
}

// Helper to get all combined categories
function getFullCategoriesList(store) {
  const customCats = Array.isArray(store.custom_categories) ? store.custom_categories : [];
  const products = Array.isArray(store.products) ? store.products : [];
  const deletedIds = new Set(Array.isArray(store.deleted_category_ids) ? store.deleted_category_ids.map((s) => String(s).toLowerCase().trim()) : []);
  const catMap = new Map();

  // Populate base categories
  BASE_CATEGORIES.forEach((base, index) => {
    const slug = base.slug;
    if (deletedIds.has(base.id.toLowerCase()) || deletedIds.has(slug.toLowerCase())) {
      return;
    }
    const count = countProductsForCategory(products, base.id, slug, base.name);
    catMap.set(base.id, {
      ...base,
      parentId: null,
      parentName: null,
      url: `/product-category/${slug}`,
      status: "published",
      order: index + 1,
      seoTitle: `${base.name} Tiles & Architectural Surfaces | Timex Ceramic`,
      metaDescription: base.description,
      focusKeyword: `${base.name.toLowerCase()} tiles`,
      secondaryKeywords: "",
      canonicalUrl: `/product-category/${slug}`,
      robotsIndex: true,
      robotsFollow: true,
      ogTitle: `${base.name} Tiles - Timex Ceramic`,
      ogDescription: base.description,
      ogImage: base.banner,
      twitterTitle: `${base.name} Tiles - Timex Ceramic`,
      twitterDescription: base.description,
      twitterImage: base.banner,
      twitterCard: "summary_large_image",
      schemaType: "CollectionPage",
      schemaJson: "",
      showInNav: true,
      showInExplore: true,
      showInWorldOfTiles: true,
      customCode: "",
      redirectUrls: [`/collections/${slug}`],
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2026-10-01T00:00:00.000Z",
      productCount: count,
      isBase: true,
      faqs: getCategoryFaqs(store, base.id, slug),
    });
  });

  // Merge custom categories
  customCats.forEach((custom, index) => {
    const slug = custom.slug || slugify(custom.name);
    const id = custom.id || (catMap.has(slug) ? slug : `cat-${slug}`);
    if (deletedIds.has(id.toLowerCase()) || deletedIds.has(slug.toLowerCase())) {
      return;
    }
    const count = countProductsForCategory(products, id, slug, custom.name);

    // Look up parent name if parentId is set
    let parentName = null;
    if (custom.parentId) {
      const parentObj = catMap.get(custom.parentId) || customCats.find((c) => c.id === custom.parentId || c.slug === custom.parentId);
      if (parentObj) parentName = parentObj.name;
    }

    const mapKey = catMap.has(id) ? id : (catMap.has(slug) ? slug : id);
    const existing = catMap.get(mapKey) || {};
    catMap.set(mapKey, {
      ...existing,
      ...custom,
      id: mapKey,
      slug,
      name: custom.name,
      parentId: custom.parentId || null,
      parentName,
      description: custom.description || existing.description || "",
      banner: custom.banner || existing.banner || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      mediaId: custom.mediaId || existing.mediaId || "",
      url: `/product-category/${slug}`,
      status: custom.status || existing.status || "published",
      order: custom.order !== undefined ? Number(custom.order) : (existing.order || BASE_CATEGORIES.length + index + 1),
      seoTitle: custom.seoTitle || existing.seoTitle || `${custom.name} Tiles | Timex Ceramic`,
      metaDescription: custom.metaDescription || existing.metaDescription || custom.description || "",
      focusKeyword: custom.focusKeyword || existing.focusKeyword || "",
      secondaryKeywords: custom.secondaryKeywords || existing.secondaryKeywords || "",
      canonicalUrl: custom.canonicalUrl || `/product-category/${slug}`,
      robotsIndex: custom.robotsIndex !== undefined ? custom.robotsIndex : (existing.robotsIndex !== undefined ? existing.robotsIndex : true),
      robotsFollow: custom.robotsFollow !== undefined ? custom.robotsFollow : (existing.robotsFollow !== undefined ? existing.robotsFollow : true),
      ogTitle: custom.ogTitle || custom.seoTitle || `${custom.name} Tiles`,
      ogDescription: custom.ogDescription || custom.metaDescription || "",
      ogImage: custom.ogImage || custom.banner || existing.banner || "",
      twitterTitle: custom.twitterTitle || existing.twitterTitle || custom.ogTitle || `${custom.name} Tiles`,
      twitterDescription: custom.twitterDescription || existing.twitterDescription || custom.ogDescription || custom.description || "",
      twitterImage: custom.twitterImage || existing.twitterImage || custom.ogImage || custom.banner || "",
      twitterCard: custom.twitterCard || existing.twitterCard || "summary_large_image",
      schemaType: custom.schemaType || existing.schemaType || "CollectionPage",
      schemaJson: custom.schemaJson || existing.schemaJson || "",
      showInNav: custom.showInNav !== undefined ? custom.showInNav : (existing.showInNav !== undefined ? existing.showInNav : true),
      showInExplore: custom.showInExplore !== undefined ? custom.showInExplore : (existing.showInExplore !== undefined ? existing.showInExplore : true),
      showInWorldOfTiles: custom.showInWorldOfTiles !== undefined ? custom.showInWorldOfTiles : (existing.showInWorldOfTiles !== undefined ? existing.showInWorldOfTiles : true),
      customCode: custom.customCode || existing.customCode || "",
      redirectUrls: custom.redirectUrls || existing.redirectUrls || [`/collections/${slug}`],
      createdAt: custom.createdAt || existing.createdAt || new Date().toISOString(),
      updatedAt: custom.updatedAt || existing.updatedAt || new Date().toISOString(),
      productCount: count,
      isBase: false,
      faqs: getCategoryFaqs(store, id, slug),
    });
  });

  return Array.from(catMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Helper to get combined taxonomies (backward compatibility)
function getAllTaxonomies(store) {
  const fullCats = getFullCategoriesList(store);
  const customColls = Array.isArray(store.custom_collections) ? store.custom_collections : [];
  const customSpaces = Array.isArray(store.custom_spaces) ? store.custom_spaces : [];
  const customSubcats = Array.isArray(store.custom_subcategories) ? store.custom_subcategories : [];

  const collMap = new Map();
  BASE_COLLECTIONS.forEach((c) => collMap.set(c.id, { ...c, url: `/product-category/${c.slug}` }));
  customColls.forEach((c) => collMap.set(c.id, { ...c, url: `/product-category/${c.slug}` }));

  const spaceSet = new Set(BASE_SPACES);
  customSpaces.forEach((s) => spaceSet.add(s));
  if (Array.isArray(store.tiles_by_space)) {
    store.tiles_by_space.forEach((s) => {
      if (s.name) spaceSet.add(s.name);
    });
  }

  const subcatsMap = {};
  Object.keys(DEFAULT_SUBCATEGORIES_BY_CATEGORY).forEach((catId) => {
    subcatsMap[catId] = [...DEFAULT_SUBCATEGORIES_BY_CATEGORY[catId]];
  });
  customSubcats.forEach((sub) => {
    const cId = (sub.categoryId || sub.category_id || "").toLowerCase().replace(/^cat-/, "");
    if (!subcatsMap[cId]) subcatsMap[cId] = [];
    if (!subcatsMap[cId].includes(sub.name)) subcatsMap[cId].push(sub.name);
  });

  return {
    categories: fullCats,
    collections: Array.from(collMap.values()),
    spaces: Array.from(spaceSet),
    subcategoriesByCategory: subcatsMap,
  };
}

// Ensure blog categories are initialized in store
function ensureBlogCategoriesInitialized(store) {
  if (!Array.isArray(store.blog_categories) || store.blog_categories.length === 0) {
    store.blog_categories = JSON.parse(JSON.stringify(DEFAULT_BLOG_CATEGORIES));
    saveFallbackStore(store);
  }
  return store.blog_categories;
}

// ==========================================
// 1. GENERAL TAXONOMIES
// ==========================================

// GET /api/v1/taxonomies
router.get("/", (req, res) => {
  try {
    const store = loadFallbackStore();
    const data = getAllTaxonomies(store);
    return res.json({ success: true, ...data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. PRODUCT CATEGORIES CRUD
// ==========================================

// GET /api/v1/taxonomies/categories (dedicated full categories endpoint)
router.get("/categories", (req, res) => {
  try {
    const store = loadFallbackStore();
    let categories = getFullCategoriesList(store);
    if (req.query.status === "published") {
      categories = categories.filter((c) => c.status === "published");
    }
    if (req.query.worldOfTiles === "true") {
      categories = categories.filter((c) => c.showInWorldOfTiles !== false);
    }
    return res.json({ success: true, count: categories.length, categories });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/taxonomies/category/:identifier
router.get("/category/:identifier", (req, res) => {
  try {
    const { identifier } = req.params;
    const cleanId = String(identifier || "").toLowerCase().trim();
    const store = loadFallbackStore();
    const categories = getFullCategoriesList(store);
    const cat = categories.find((c) => c.id.toLowerCase() === cleanId || c.slug.toLowerCase() === cleanId);
    if (!cat) {
      return res.status(404).json({ success: false, error: "Category not found." });
    }
    return res.json({ success: true, category: cat });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/taxonomies/category
router.post("/category", (req, res) => {
  try {
    const {
      name,
      slug: customSlug,
      parentId,
      description,
      banner,
      mediaId,
      status,
      order,
      seoTitle,
      metaDescription,
      focusKeyword,
      secondaryKeywords,
      canonicalUrl,
      robotsIndex,
      robotsFollow,
      ogTitle,
      ogDescription,
      ogImage,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Category name is required." });
    }

    const cleanName = name.trim();
    const slug = slugify(customSlug || cleanName);
    const id = `cat-${slug}`;
    const url = `/product-category/${slug}`;

    const store = loadFallbackStore();
    if (!Array.isArray(store.custom_categories)) {
      store.custom_categories = [];
    }

    // Check if category already exists in custom or base
    const existing = store.custom_categories.find(
      (c) => c.id === id || c.name.toLowerCase() === cleanName.toLowerCase() || c.slug === slug
    );
    if (existing) {
      return res.status(409).json({
        success: false,
        error: "A category with this name or slug already exists.",
        category: existing,
      });
    }

    const newCategory = {
      id,
      name: cleanName,
      slug,
      parentId: parentId || null,
      description: description ? description.trim() : "",
      banner: banner ? banner.trim() : "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      mediaId: mediaId || "",
      status: status === "draft" ? "draft" : "published",
      order: order !== undefined ? Number(order) : store.custom_categories.length + BASE_CATEGORIES.length + 1,
      seoTitle: seoTitle ? seoTitle.trim() : `${cleanName} Tiles | Timex Ceramic`,
      metaDescription: metaDescription ? metaDescription.trim() : (description ? description.trim() : ""),
      focusKeyword: focusKeyword ? focusKeyword.trim() : "",
      secondaryKeywords: secondaryKeywords ? secondaryKeywords.trim() : "",
      canonicalUrl: canonicalUrl ? canonicalUrl.trim() : url,
      robotsIndex: robotsIndex !== undefined ? Boolean(robotsIndex) : true,
      robotsFollow: robotsFollow !== undefined ? Boolean(robotsFollow) : true,
      ogTitle: ogTitle ? ogTitle.trim() : (seoTitle ? seoTitle.trim() : `${cleanName} Tiles`),
      ogDescription: ogDescription ? ogDescription.trim() : (metaDescription ? metaDescription.trim() : ""),
      ogImage: ogImage ? ogImage.trim() : (banner ? banner.trim() : ""),
      twitterTitle: req.body.twitterTitle ? req.body.twitterTitle.trim() : (ogTitle || `${cleanName} Tiles`),
      twitterDescription: req.body.twitterDescription ? req.body.twitterDescription.trim() : (ogDescription || metaDescription || ""),
      twitterImage: req.body.twitterImage ? req.body.twitterImage.trim() : (ogImage || banner || ""),
      twitterCard: req.body.twitterCard || "summary_large_image",
      schemaType: req.body.schemaType || "CollectionPage",
      schemaJson: req.body.schemaJson || "",
      showInNav: req.body.showInNav !== undefined ? Boolean(req.body.showInNav) : true,
      showInExplore: req.body.showInExplore !== undefined ? Boolean(req.body.showInExplore) : true,
      showInWorldOfTiles: req.body.showInWorldOfTiles !== undefined ? Boolean(req.body.showInWorldOfTiles) : true,
      customCode: req.body.customCode || "",
      redirectUrls: Array.isArray(req.body.redirectUrls) ? req.body.redirectUrls : [`/collections/${slug}`],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (Array.isArray(store.deleted_category_ids)) {
      store.deleted_category_ids = store.deleted_category_ids.filter((s) => s !== slug && s !== newCategory.id);
    }

    store.custom_categories.push(newCategory);

    // Also auto-register corresponding collection entry
    if (!Array.isArray(store.custom_collections)) {
      store.custom_collections = [];
    }
    const collId = `coll-${slug}`;
    if (!store.custom_collections.some((c) => c.id === collId || c.slug === slug)) {
      store.custom_collections.push({
        id: collId,
        name: `${cleanName} Collection`,
        slug,
      });
    }

    // Handle FAQs if provided
    let savedFaqs = [];
    if (Array.isArray(req.body.faqs)) {
      savedFaqs = saveCategoryFaqsHelper(store, newCategory.id, newCategory.slug, req.body.faqs);
    } else {
      savedFaqs = getCategoryFaqs(store, newCategory.id, newCategory.slug);
    }
    newCategory.faqs = savedFaqs;

    // Sync collection_seo
    if (!store.collection_seo || typeof store.collection_seo !== "object") {
      store.collection_seo = {};
    }
    store.collection_seo[newCategory.slug] = {
      slug: newCategory.slug,
      name: newCategory.name,
      metaTitle: newCategory.seoTitle || `${newCategory.name} Tiles & Slabs | Timex Ceramic`,
      metaDescription: newCategory.metaDescription || newCategory.description || "",
      banner: newCategory.banner || "",
      updated_at: new Date().toISOString(),
    };

    // Sync store.seo_metadata
    if (!Array.isArray(store.seo_metadata)) {
      store.seo_metadata = [];
    }
    const catPagePath = `/product-category/${newCategory.slug}`;
    store.seo_metadata.push({
      id: `seo-cat-${newCategory.slug}`,
      page_path: catPagePath,
      content_type: "category",
      title: newCategory.name,
      meta_title: newCategory.seoTitle || `${newCategory.name} Tiles & Slabs | Timex Ceramic`,
      seo_title: newCategory.seoTitle || `${newCategory.name} Tiles & Slabs | Timex Ceramic`,
      meta_description: newCategory.metaDescription || newCategory.description || "",
      focus_keyword: newCategory.focusKeyword || `${newCategory.name.toLowerCase()} tiles`,
      canonical_url: newCategory.canonicalUrl || `https://www.timexceramic.com${catPagePath}`,
      robots_index: newCategory.robotsIndex !== undefined ? Boolean(newCategory.robotsIndex) : true,
      robots_follow: newCategory.robotsFollow !== undefined ? Boolean(newCategory.robotsFollow) : true,
      og_title: newCategory.ogTitle || newCategory.seoTitle || newCategory.name,
      og_description: newCategory.ogDescription || newCategory.metaDescription || newCategory.description || "",
      og_image: newCategory.ogImage || newCategory.banner || "",
      twitter_title: newCategory.twitterTitle || newCategory.ogTitle || newCategory.seoTitle || newCategory.name,
      twitter_description: newCategory.twitterDescription || newCategory.ogDescription || newCategory.metaDescription || "",
      twitter_image: newCategory.twitterImage || newCategory.ogImage || newCategory.banner || "",
      updated_at: new Date().toISOString(),
    });

    saveFallbackStore(store);

    return res.status(201).json({ success: true, category: newCategory, message: "Category created successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/taxonomies/category/:identifier
router.put("/category/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const body = req.body || {};
    const store = loadFallbackStore();
    if (!Array.isArray(store.custom_categories)) {
      store.custom_categories = [];
    }

    const cleanId = String(identifier || "").toLowerCase().trim();
    let catIndex = store.custom_categories.findIndex(
      (c) => c.id.toLowerCase() === cleanId || c.slug.toLowerCase() === cleanId
    );

    let cat;
    if (catIndex >= 0) {
      cat = store.custom_categories[catIndex];
    } else {
      // If it's a base category, promote it to custom_categories so edits are stored
      const base = BASE_CATEGORIES.find(
        (c) => c.id.toLowerCase() === cleanId || c.slug.toLowerCase() === cleanId
      );
      if (base) {
        cat = {
          ...base,
          parentId: null,
          banner: base.banner || "",
          mediaId: "",
          status: "published",
          order: BASE_CATEGORIES.indexOf(base) + 1,
          seoTitle: `${base.name} Tiles & Architectural Surfaces | Timex Ceramic`,
          metaDescription: base.description,
          focusKeyword: `${base.name.toLowerCase()} tiles`,
          canonicalUrl: `/product-category/${base.slug}`,
          ogTitle: `${base.name} Tiles`,
          ogDescription: base.description,
          ogImage: base.banner,
        };
        store.custom_categories.push(cat);
        catIndex = store.custom_categories.length - 1;
      }
    }

    if (!cat) {
      return res.status(404).json({ success: false, error: "Category not found." });
    }

    const oldSlug = cat.slug;
    const oldId = cat.id;

    if (body.name !== undefined && body.name.trim()) {
      cat.name = body.name.trim();
    }
    if (body.slug !== undefined && body.slug.trim()) {
      cat.slug = slugify(body.slug.trim());
    }
    if (body.parentId !== undefined) {
      cat.parentId = body.parentId || null;
    }
    if (body.description !== undefined) {
      cat.description = body.description.trim();
    }
    if (body.banner !== undefined) {
      cat.banner = body.banner.trim();
    }
    if (body.mediaId !== undefined) {
      cat.mediaId = body.mediaId;
    }
    if (body.status !== undefined) {
      cat.status = body.status === "draft" ? "draft" : "published";
    }
    if (body.order !== undefined) {
      cat.order = Number(body.order);
    }
    if (body.seoTitle !== undefined) {
      cat.seoTitle = body.seoTitle.trim();
    }
    if (body.metaDescription !== undefined) {
      cat.metaDescription = body.metaDescription.trim();
    }
    if (body.focusKeyword !== undefined) {
      cat.focusKeyword = body.focusKeyword.trim();
    }
    if (body.secondaryKeywords !== undefined) {
      cat.secondaryKeywords = body.secondaryKeywords.trim();
    }
    if (body.canonicalUrl !== undefined) {
      cat.canonicalUrl = body.canonicalUrl.trim();
    }
    if (body.robotsIndex !== undefined) {
      cat.robotsIndex = Boolean(body.robotsIndex);
    }
    if (body.robotsFollow !== undefined) {
      cat.robotsFollow = Boolean(body.robotsFollow);
    }
    if (body.ogTitle !== undefined) {
      cat.ogTitle = body.ogTitle.trim();
    }
    if (body.ogDescription !== undefined) {
      cat.ogDescription = body.ogDescription.trim();
    }
    if (body.ogImage !== undefined) {
      cat.ogImage = body.ogImage.trim();
    }
    if (body.twitterTitle !== undefined) {
      cat.twitterTitle = body.twitterTitle.trim();
    }
    if (body.twitterDescription !== undefined) {
      cat.twitterDescription = body.twitterDescription.trim();
    }
    if (body.twitterImage !== undefined) {
      cat.twitterImage = body.twitterImage.trim();
    }
    if (body.twitterCard !== undefined) {
      cat.twitterCard = body.twitterCard;
    }
    if (body.schemaType !== undefined) {
      cat.schemaType = body.schemaType;
    }
    if (body.schemaJson !== undefined) {
      cat.schemaJson = body.schemaJson;
    }
    if (body.showInNav !== undefined) {
      cat.showInNav = Boolean(body.showInNav);
    }
    if (body.showInExplore !== undefined) {
      cat.showInExplore = Boolean(body.showInExplore);
    }
    if (body.showInWorldOfTiles !== undefined) {
      cat.showInWorldOfTiles = Boolean(body.showInWorldOfTiles);
    }
    if (body.customCode !== undefined) {
      cat.customCode = body.customCode;
    }
    if (body.redirectUrls !== undefined) {
      cat.redirectUrls = Array.isArray(body.redirectUrls) ? body.redirectUrls : [];
    }

    cat.url = `/product-category/${cat.slug}`;
    cat.updatedAt = new Date().toISOString();

    // Safely update product references if slug changed
    const mysqlAffectedProducts = new Set();
    if (Array.isArray(store.products) && oldSlug !== cat.slug) {
      store.products.forEach((p) => {
        const pCatId = (p.categoryId || p.category_id || "").toLowerCase();
        const pColId = (p.collectionId || p.collection_id || "").toLowerCase();
        let touched = false;
        if (pCatId === oldSlug || pCatId === oldId.toLowerCase()) {
          p.categoryId = cat.id;
          p.category_id = cat.id;
          touched = true;
        }
        if (pColId === oldSlug || pColId === `coll-${oldSlug}`) {
          p.collectionId = `coll-${cat.slug}`;
          p.collection_id = `coll-${cat.slug}`;
          touched = true;
        }
        if (p.category && (p.category.toLowerCase() === oldSlug || p.category.toLowerCase() === cleanId)) {
          p.category = cat.name;
          touched = true;
        }
        if (touched) mysqlAffectedProducts.add(p.id);
      });
    }

    // Assign / unassign products if assignedProductIds array provided
    if (Array.isArray(body.assignedProductIds) && Array.isArray(store.products)) {
      const assignedIds = new Set(body.assignedProductIds.map(String));
      const targetSlug = cat.slug.toLowerCase();
      const targetId = cat.id.toLowerCase();
      const targetName = (cat.name || "").toLowerCase();

      store.products.forEach((p) => {
        const pid = String(p.id);
        let sec = Array.isArray(p.secondaryCategories)
          ? [...p.secondaryCategories]
          : (Array.isArray(p.secondary_categories) ? [...p.secondary_categories] : []);
        sec = sec.map((s) => String(s).toLowerCase().trim());

        if (assignedIds.has(pid)) {
          if (!sec.includes(targetSlug) && !sec.includes(targetId)) {
            sec.push(cat.slug);
          }
        } else {
          sec = sec.filter((s) => s !== targetSlug && s !== targetId && s !== targetName);
        }
        p.secondaryCategories = sec;
        p.secondary_categories = sec;
        mysqlAffectedProducts.add(p.id);
      });
    }

    // Mirror product reference changes into MySQL
    if (isMysqlConnected() && mysqlAffectedProducts.size > 0) {
      try {
        const pool = getPool();
        for (const pid of mysqlAffectedProducts) {
          const row = store.products.find((p) => p.id === pid);
          if (!row) continue;
          await pool.query(
            "UPDATE products SET category_id = ?, category_name = ?, collection_id = ?, collection_name = ?, secondary_categories_json = ?, updated_at = NOW() WHERE id = ?",
            [
              row.category_id || row.categoryId || "",
              row.category || row.category_name || "",
              row.collection_id || row.collectionId || "",
              row.collection || row.collection_name || "",
              JSON.stringify(row.secondaryCategories || row.secondary_categories || []),
              pid,
            ]
          );
        }
      } catch (_) {}
    }

    // Sync collection_seo
    if (!store.collection_seo || typeof store.collection_seo !== "object") {
      store.collection_seo = {};
    }
    if (store.collection_seo[oldSlug] && oldSlug !== cat.slug) {
      delete store.collection_seo[oldSlug];
    }
    store.collection_seo[cat.slug] = {
      ...(store.collection_seo[cat.slug] || {}),
      slug: cat.slug,
      name: cat.name,
      metaTitle: cat.seoTitle || `${cat.name} Tiles & Slabs | Timex Ceramic`,
      metaDescription: cat.metaDescription || cat.description || "",
      banner: cat.banner || store.collection_seo[cat.slug]?.banner || "",
      updated_at: new Date().toISOString(),
    };

    // Sync store.seo_metadata
    if (!Array.isArray(store.seo_metadata)) {
      store.seo_metadata = [];
    }
    const catPagePath = `/product-category/${cat.slug}`;
    const seoIdx = store.seo_metadata.findIndex(
      (s) => s.page_path === catPagePath || (oldSlug && s.page_path === `/product-category/${oldSlug}`)
    );
    const seoRecord = {
      id: seoIdx >= 0 ? store.seo_metadata[seoIdx].id : `seo-cat-${cat.slug}`,
      page_path: catPagePath,
      content_type: "category",
      title: cat.name,
      meta_title: cat.seoTitle || `${cat.name} Tiles & Slabs | Timex Ceramic`,
      seo_title: cat.seoTitle || `${cat.name} Tiles & Slabs | Timex Ceramic`,
      meta_description: cat.metaDescription || cat.description || "",
      focus_keyword: cat.focusKeyword || `${cat.name.toLowerCase()} tiles`,
      canonical_url: cat.canonicalUrl || `https://www.timexceramic.com${catPagePath}`,
      robots_index: cat.robotsIndex !== undefined ? Boolean(cat.robotsIndex) : true,
      robots_follow: cat.robotsFollow !== undefined ? Boolean(cat.robotsFollow) : true,
      og_title: cat.ogTitle || cat.seoTitle || cat.name,
      og_description: cat.ogDescription || cat.metaDescription || cat.description || "",
      og_image: cat.ogImage || cat.banner || "",
      twitter_title: cat.twitterTitle || cat.ogTitle || cat.seoTitle || cat.name,
      twitter_description: cat.twitterDescription || cat.ogDescription || cat.metaDescription || "",
      twitter_image: cat.twitterImage || cat.ogImage || cat.banner || "",
      updated_at: new Date().toISOString(),
    };
    if (seoIdx >= 0) {
      store.seo_metadata[seoIdx] = { ...store.seo_metadata[seoIdx], ...seoRecord };
    } else {
      store.seo_metadata.push(seoRecord);
    }

    // Handle FAQs if provided
    if (Array.isArray(body.faqs)) {
      const savedFaqs = saveCategoryFaqsHelper(store, cat.id, cat.slug, body.faqs);
      cat.faqs = savedFaqs;
    } else {
      cat.faqs = getCategoryFaqs(store, cat.id, cat.slug);
    }

    saveFallbackStore(store);
    return res.json({ success: true, category: cat, message: "Category updated successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ========================================================
// DEDICATED CATEGORY FAQ ENDPOINTS
// ========================================================

// GET /api/v1/taxonomies/category/:identifier/faqs
router.get("/category/:identifier/faqs", (req, res) => {
  try {
    const { identifier } = req.params;
    const store = loadFallbackStore();
    const categories = getFullCategoriesList(store);
    const cat = categories.find((c) => c.id.toLowerCase() === String(identifier).toLowerCase() || c.slug.toLowerCase() === String(identifier).toLowerCase());
    if (!cat) {
      return res.status(404).json({ success: false, error: "Category not found." });
    }
    const faqs = getCategoryFaqs(store, cat.id, cat.slug);
    return res.json({ success: true, categoryId: cat.id, slug: cat.slug, count: faqs.length, faqs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/taxonomies/category/:identifier/faqs
router.post("/category/:identifier/faqs", (req, res) => {
  try {
    const { identifier } = req.params;
    const { question, answer, displayOrder, status } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, error: "Question is required." });
    }
    if (!answer || !answer.trim()) {
      return res.status(400).json({ success: false, error: "Answer is required." });
    }
    const store = loadFallbackStore();
    const categories = getFullCategoriesList(store);
    const cat = categories.find((c) => c.id.toLowerCase() === String(identifier).toLowerCase() || c.slug.toLowerCase() === String(identifier).toLowerCase());
    if (!cat) {
      return res.status(404).json({ success: false, error: "Category not found." });
    }

    const currentFaqs = getCategoryFaqs(store, cat.id, cat.slug);
    const orderNum = displayOrder !== undefined ? Number(displayOrder) : currentFaqs.length + 1;
    const newFaq = {
      id: `faq-${cat.slug}-${Date.now()}`,
      categoryId: cat.id,
      category_id: cat.id,
      question: question.trim(),
      answer: answer.trim(),
      displayOrder: orderNum,
      order: orderNum,
      status: status === "draft" ? "draft" : "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!Array.isArray(store.category_faqs)) store.category_faqs = [];
    store.category_faqs.push(newFaq);

    if (!store.collection_seo) store.collection_seo = {};
    if (!store.collection_seo[cat.slug]) store.collection_seo[cat.slug] = { slug: cat.slug, faqs: [] };
    store.collection_seo[cat.slug].faqs = getCategoryFaqs(store, cat.id, cat.slug);

    saveFallbackStore(store);
    return res.status(201).json({ success: true, faq: newFaq, message: "FAQ created successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/taxonomies/category/:identifier/faqs/reorder
router.put("/category/:identifier/faqs/reorder", (req, res) => {
  try {
    const { identifier } = req.params;
    const { faqs, faqIds } = req.body;
    const store = loadFallbackStore();
    if (!Array.isArray(store.category_faqs)) store.category_faqs = [];

    if (Array.isArray(faqIds)) {
      faqIds.forEach((id, idx) => {
        const item = store.category_faqs.find((f) => f.id === id);
        if (item) {
          item.displayOrder = idx + 1;
          item.order = idx + 1;
          item.updatedAt = new Date().toISOString();
        }
      });
    } else if (Array.isArray(faqs)) {
      faqs.forEach((item, idx) => {
        const found = store.category_faqs.find((f) => f.id === item.id);
        if (found) {
          const ord = item.displayOrder !== undefined ? Number(item.displayOrder) : idx + 1;
          found.displayOrder = ord;
          found.order = ord;
          found.updatedAt = new Date().toISOString();
        }
      });
    }

    const catSlug = normalizeCategoryIdentifier(identifier);
    const updatedFaqs = getCategoryFaqs(store, `cat-${catSlug}`, catSlug);
    if (store.collection_seo && store.collection_seo[catSlug]) {
      store.collection_seo[catSlug].faqs = updatedFaqs;
    }

    saveFallbackStore(store);
    return res.json({ success: true, faqs: updatedFaqs, message: "FAQs reordered successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/taxonomies/category/:identifier/faqs/:faqId
router.put("/category/:identifier/faqs/:faqId", (req, res) => {
  try {
    const { identifier, faqId } = req.params;
    const { question, answer, displayOrder, status } = req.body;
    const store = loadFallbackStore();
    if (!Array.isArray(store.category_faqs)) store.category_faqs = [];

    const faqIndex = store.category_faqs.findIndex((f) => f.id === faqId);
    if (faqIndex === -1) {
      return res.status(404).json({ success: false, error: "FAQ not found." });
    }

    const item = store.category_faqs[faqIndex];
    if (question !== undefined) item.question = question.trim();
    if (answer !== undefined) item.answer = answer.trim();
    if (displayOrder !== undefined) {
      item.displayOrder = Number(displayOrder);
      item.order = Number(displayOrder);
    }
    if (status !== undefined) item.status = status === "draft" ? "draft" : "published";
    item.updatedAt = new Date().toISOString();

    const catSlug = normalizeCategoryIdentifier(item.categoryId || identifier);
    if (store.collection_seo && store.collection_seo[catSlug]) {
      store.collection_seo[catSlug].faqs = getCategoryFaqs(store, item.categoryId, catSlug);
    }

    saveFallbackStore(store);
    return res.json({ success: true, faq: item, message: "FAQ updated successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/taxonomies/category/:identifier/faqs/:faqId
router.delete("/category/:identifier/faqs/:faqId", (req, res) => {
  try {
    const { identifier, faqId } = req.params;
    const store = loadFallbackStore();
    if (!Array.isArray(store.category_faqs)) store.category_faqs = [];

    const initialLength = store.category_faqs.length;
    store.category_faqs = store.category_faqs.filter((f) => f.id !== faqId);

    if (store.category_faqs.length === initialLength) {
      return res.status(404).json({ success: false, error: "FAQ not found." });
    }

    const catSlug = normalizeCategoryIdentifier(identifier);
    if (store.collection_seo && store.collection_seo[catSlug]) {
      store.collection_seo[catSlug].faqs = getCategoryFaqs(store, `cat-${catSlug}`, catSlug);
    }

    saveFallbackStore(store);
    return res.json({ success: true, message: "FAQ deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/taxonomies/category/:identifier/products
router.get("/category/:identifier/products", (req, res) => {
  try {
    const { identifier } = req.params;
    const { q, limit = 50 } = req.query;
    const cleanId = String(identifier || "").toLowerCase().trim();
    const store = loadFallbackStore();
    const products = Array.isArray(store.products) ? store.products : [];

    const categories = getFullCategoriesList(store);
    const cat = categories.find((c) => c.id.toLowerCase() === cleanId || c.slug.toLowerCase() === cleanId)
      || { id: cleanId, slug: cleanId, name: cleanId };

    const targetSlug = cat.slug.toLowerCase();
    const targetId = cat.id.toLowerCase();
    const targetName = (cat.name || "").toLowerCase();

    const assigned = [];
    const searchResults = [];
    const queryLower = q ? String(q).toLowerCase().trim() : "";

    products.forEach((p) => {
      if (p.is_trashed || p.isActive === false || p.is_active === false) return;
      const pCatId = (p.categoryId || p.category_id || "").toLowerCase();
      const pCatName = (p.category || p.category_name || "").toLowerCase();
      const pColId = (p.collectionId || p.collection_id || "").toLowerCase();

      const secCats = Array.isArray(p.secondaryCategories)
        ? p.secondaryCategories.map((s) => String(s).toLowerCase().trim())
        : (Array.isArray(p.secondary_categories) ? p.secondary_categories.map((s) => String(s).toLowerCase().trim()) : []);

      const subCats = Array.isArray(p.subcategories)
        ? p.subcategories.map((s) => (typeof s === "string" ? s.toLowerCase().trim() : String(s?.name || s?.slug || "").toLowerCase().trim()))
        : [];

      const isAssigned = (
        pCatId === targetId ||
        pCatId === targetSlug ||
        pCatName === targetName ||
        pColId === `coll-${targetSlug}` ||
        pColId === targetId ||
        secCats.includes(targetId) ||
        secCats.includes(targetSlug) ||
        secCats.includes(targetName) ||
        subCats.includes(targetId) ||
        subCats.includes(targetSlug) ||
        subCats.includes(targetName)
      );

      const pSummary = {
        id: p.id,
        name: p.name,
        code: p.code || p.sku || "",
        sku: p.sku || p.code || "",
        price: p.price || 0,
        image: p.image || p.thumbnail || (Array.isArray(p.gallery) ? p.gallery[0] : "") || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80",
        category: p.category || p.category_name || "",
        isAssigned,
      };

      if (isAssigned) {
        assigned.push(pSummary);
      }

      if (queryLower) {
        const matchName = (p.name || "").toLowerCase().includes(queryLower);
        const matchCode = (p.code || "").toLowerCase().includes(queryLower);
        const matchSku = (p.sku || "").toLowerCase().includes(queryLower);
        if (matchName || matchCode || matchSku) {
          searchResults.push(pSummary);
        }
      }
    });

    return res.json({
      success: true,
      category: { id: cat.id, name: cat.name, slug: cat.slug },
      totalAssigned: assigned.length,
      assigned,
      searchResults: queryLower ? searchResults.slice(0, Number(limit)) : [],
      totalStoreProducts: products.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/taxonomies/category/:identifier/products
router.post("/category/:identifier/products", (req, res) => {
  try {
    const { identifier } = req.params;
    const { assignedProductIds = [] } = req.body;
    const cleanId = String(identifier || "").toLowerCase().trim();
    const store = loadFallbackStore();
    if (!Array.isArray(store.products)) {
      store.products = [];
    }

    const categories = getFullCategoriesList(store);
    const cat = categories.find((c) => c.id.toLowerCase() === cleanId || c.slug.toLowerCase() === cleanId)
      || { id: cleanId, slug: cleanId, name: cleanId };

    const targetSlug = cat.slug.toLowerCase();
    const targetId = cat.id.toLowerCase();
    const targetName = (cat.name || "").toLowerCase();
    const assignedSet = new Set(assignedProductIds.map(String));

    store.products.forEach((p) => {
      const pid = String(p.id);
      let sec = Array.isArray(p.secondaryCategories)
        ? [...p.secondaryCategories]
        : (Array.isArray(p.secondary_categories) ? [...p.secondary_categories] : []);
      sec = sec.map((s) => String(s).toLowerCase().trim());

      if (assignedSet.has(pid)) {
        if (!sec.includes(targetSlug) && !sec.includes(targetId)) {
          sec.push(cat.slug);
        }
      } else {
        sec = sec.filter((s) => s !== targetSlug && s !== targetId && s !== targetName);
      }
      p.secondaryCategories = sec;
      p.secondary_categories = sec;
    });

    saveFallbackStore(store);

    return res.json({
      success: true,
      message: "Category products assignment updated successfully.",
      totalAssigned: assignedProductIds.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/taxonomies/category/:identifier (with delete protection)
router.delete("/category/:identifier", (req, res) => {
  try {
    const { identifier } = req.params;
    const force = req.query.force === "true" || req.body?.force === true;
    const store = loadFallbackStore();
    const cleanId = String(identifier || "").toLowerCase().trim();

    // Find category
    const categories = getFullCategoriesList(store);
    const cat = categories.find((c) => c.id.toLowerCase() === cleanId || c.slug.toLowerCase() === cleanId);

    if (!cat) {
      return res.status(404).json({ success: false, error: "Category not found." });
    }

    const products = Array.isArray(store.products) ? store.products : [];
    const assignedProductsCount = countProductsForCategory(products, cat.id, cat.slug, cat.name);

    // Check if any subcategories have this as parent
    const childCategories = categories.filter((c) => c.parentId === cat.id || c.parentId === cat.slug);
    const childCount = childCategories.length;

    // Protection check
    if (!force && (assignedProductsCount > 0 || childCount > 0)) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete '${cat.name}' directly. It is assigned to ${assignedProductsCount} product(s) and has ${childCount} subcategory/subcategories.`,
        assignedProducts: assignedProductsCount,
        childCount: childCount,
        category: cat,
        requiresConfirmation: true,
      });
    }

    // Proceed with safe deletion
    if (!Array.isArray(store.deleted_category_ids)) {
      store.deleted_category_ids = [];
    }
    if (!store.deleted_category_ids.includes(cat.id)) store.deleted_category_ids.push(cat.id);
    if (!store.deleted_category_ids.includes(cat.slug)) store.deleted_category_ids.push(cat.slug);

    if (Array.isArray(store.custom_categories)) {
      store.custom_categories = store.custom_categories.filter(
        (c) => c.id.toLowerCase() !== cleanId && c.slug.toLowerCase() !== cleanId
      );
    }

    // Clean up any subcategories under this parent if child categories exist
    if (Array.isArray(store.custom_subcategories)) {
      store.custom_subcategories = store.custom_subcategories.filter(
        (s) => (s.categoryId || s.category_id || "").toLowerCase() !== cat.slug.toLowerCase() &&
               (s.categoryId || s.category_id || "").toLowerCase() !== cat.id.toLowerCase()
      );
    }

    // If child categories were linked, clear their parentId so they aren't orphaned
    if (Array.isArray(store.custom_categories)) {
      store.custom_categories.forEach((c) => {
        if (c.parentId === cat.id || c.parentId === cat.slug) {
          c.parentId = null;
        }
      });
    }

    saveFallbackStore(store);

    return res.json({
      success: true,
      message: `Category '${cat.name}' removed successfully. Associated products remain intact.`,
      category: cat,
      unassignedProducts: assignedProductsCount,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. BLOG CATEGORIES CRUD
// ==========================================

// GET /api/v1/taxonomies/blog-categories
router.get("/blog-categories", (req, res) => {
  try {
    const store = loadFallbackStore();
    const categories = ensureBlogCategoriesInitialized(store);
    const blogs = Array.isArray(store.blogs) ? store.blogs : [];

    // Calculate blog count for each category
    const withCounts = categories.map((cat) => {
      const cName = cat.name.toLowerCase().trim();
      const cSlug = cat.slug.toLowerCase().trim();
      const count = blogs.filter((b) => {
        const bCat = String(b.category || "").toLowerCase().trim();
        return bCat === cName || bCat === cSlug;
      }).length;
      return { ...cat, blogCount: count };
    });

    withCounts.sort((a, b) => (a.order || 0) - (b.order || 0));

    return res.json({ success: true, count: withCounts.length, categories: withCounts });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/taxonomies/blog-categories
router.post("/blog-categories", (req, res) => {
  try {
    const { name, slug: customSlug, description, image, mediaId, status, order, seoTitle, metaDescription } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Blog category name is required." });
    }

    const cleanName = name.trim();
    const slug = slugify(customSlug || cleanName);
    const id = `bcat-${slug}`;

    const store = loadFallbackStore();
    const categories = ensureBlogCategoriesInitialized(store);

    const exists = categories.find(
      (c) => c.id === id || c.slug === slug || c.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (exists) {
      return res.status(409).json({ success: false, error: "A blog category with this name or slug already exists." });
    }

    const newCategory = {
      id,
      name: cleanName,
      slug,
      description: description ? description.trim() : "",
      image: image ? image.trim() : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      mediaId: mediaId || "",
      status: status === "draft" ? "draft" : "published",
      order: order !== undefined ? Number(order) : categories.length + 1,
      seoTitle: seoTitle ? seoTitle.trim() : `${cleanName} | Timex Ceramic Blog`,
      metaDescription: metaDescription ? metaDescription.trim() : (description ? description.trim() : ""),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    categories.push(newCategory);
    store.blog_categories = categories;
    saveFallbackStore(store);

    return res.status(201).json({ success: true, category: newCategory, message: "Blog category created successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/taxonomies/blog-categories/:id
router.put("/blog-categories/:id", (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const store = loadFallbackStore();
    const categories = ensureBlogCategoriesInitialized(store);

    const cleanId = String(id).toLowerCase().trim();
    const idx = categories.findIndex((c) => c.id.toLowerCase() === cleanId || c.slug.toLowerCase() === cleanId);

    if (idx === -1) {
      return res.status(404).json({ success: false, error: "Blog category not found." });
    }

    const current = categories[idx];
    const oldName = current.name;

    const updated = {
      ...current,
      name: body.name !== undefined ? body.name.trim() : current.name,
      slug: body.slug !== undefined ? slugify(body.slug.trim()) : current.slug,
      description: body.description !== undefined ? body.description.trim() : current.description,
      image: body.image !== undefined ? body.image.trim() : current.image,
      mediaId: body.mediaId !== undefined ? body.mediaId : (current.mediaId || ""),
      status: body.status !== undefined ? (body.status === "draft" ? "draft" : "published") : current.status,
      order: body.order !== undefined ? Number(body.order) : current.order,
      seoTitle: body.seoTitle !== undefined ? body.seoTitle.trim() : current.seoTitle,
      metaDescription: body.metaDescription !== undefined ? body.metaDescription.trim() : current.metaDescription,
      updatedAt: new Date().toISOString(),
    };

    // If name changed, update blogs safely
    if (updated.name !== oldName && Array.isArray(store.blogs)) {
      store.blogs.forEach((b) => {
        if (b.category && b.category.toLowerCase() === oldName.toLowerCase()) {
          b.category = updated.name;
        }
      });
    }

    categories[idx] = updated;
    store.blog_categories = categories;
    saveFallbackStore(store);

    return res.json({ success: true, category: updated, message: "Blog category updated successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/taxonomies/blog-categories/:id (with protection)
router.delete("/blog-categories/:id", (req, res) => {
  try {
    const { id } = req.params;
    const force = req.query.force === "true" || req.body?.force === true;
    const store = loadFallbackStore();
    const categories = ensureBlogCategoriesInitialized(store);

    const cleanId = String(id).toLowerCase().trim();
    const cat = categories.find((c) => c.id.toLowerCase() === cleanId || c.slug.toLowerCase() === cleanId);

    if (!cat) {
      return res.status(404).json({ success: false, error: "Blog category not found." });
    }

    const blogs = Array.isArray(store.blogs) ? store.blogs : [];
    const assignedBlogsCount = blogs.filter((b) => {
      const bCat = String(b.category || "").toLowerCase().trim();
      return bCat === cat.name.toLowerCase() || bCat === cat.slug.toLowerCase();
    }).length;

    if (!force && assignedBlogsCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete '${cat.name}'. It is used in ${assignedBlogsCount} blog post(s).`,
        assignedBlogs: assignedBlogsCount,
        category: cat,
        requiresConfirmation: true,
      });
    }

    store.blog_categories = categories.filter((c) => c.id !== cat.id && c.slug !== cat.slug);
    saveFallbackStore(store);

    return res.json({
      success: true,
      message: `Blog category '${cat.name}' removed successfully. Blog posts remain intact.`,
      category: cat,
      unassignedBlogs: assignedBlogsCount,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. LEGACY / ADDITIONAL TAXONOMY ENDPOINTS
// ==========================================

// POST /api/v1/taxonomies/collection
router.post("/collection", (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Collection name is required." });
    }

    let cleanName = name.trim();
    cleanName = cleanName.replace(/^(timex\s+)+(premium\s+|royal\s+)?/i, "");
    cleanName = cleanName.replace(/^(premium\s+|royal\s+)/i, "");
    cleanName = cleanName.replace(/\s+(look|series|collection)$/i, "").trim();
    if (!cleanName) cleanName = name.trim();
    const finalName = `${cleanName} Collection`;
    const slug = slugify(cleanName);
    const id = `coll-${slug}`;

    const store = loadFallbackStore();
    if (!Array.isArray(store.custom_collections)) {
      store.custom_collections = [];
    }

    const existing = store.custom_collections.find(
      (c) => c.id === id || c.name.toLowerCase() === finalName.toLowerCase()
    );
    if (existing) {
      return res.json({ success: true, collection: existing, message: "Collection already exists." });
    }

    const newCollection = { id, name: finalName, slug };
    store.custom_collections.push(newCollection);
    saveFallbackStore(store);

    return res.status(201).json({ success: true, collection: newCollection });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/taxonomies/space
router.post("/space", (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Space name is required." });
    }

    let cleanName = name.trim();
    if (!cleanName.toLowerCase().endsWith("tiles") && !cleanName.toLowerCase().includes("tiles")) {
      cleanName = `${cleanName} Tiles`;
    }
    const slug = slugify(cleanName);

    const store = loadFallbackStore();
    if (!Array.isArray(store.custom_spaces)) {
      store.custom_spaces = [];
    }

    if (!store.custom_spaces.includes(cleanName)) {
      store.custom_spaces.push(cleanName);
    }

    if (!Array.isArray(store.tiles_by_space)) {
      store.tiles_by_space = JSON.parse(JSON.stringify(defaultSpaces));
    }
    const spaceObjExists = store.tiles_by_space.find(
      (s) => s.slug === slug || s.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (!spaceObjExists) {
      store.tiles_by_space.push({
        id: `space-${slug}`,
        name: cleanName,
        slug,
        spaceArea: cleanName,
        pageTitle: `${cleanName} | Luxury Tiles | Timex Ceramic`,
        description: `Explore premium architectural tiles designed specifically for ${cleanName.replace(/\s+Tiles$/i, "")}.`,
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
        mediaId: "",
        status: "published",
        order: store.tiles_by_space.length + 1,
        seoTitle: `${cleanName} - Premium Tiles | Timex Ceramic`,
        metaDescription: `Discover durable and aesthetic ${cleanName.toLowerCase()} crafted for luxury modern spaces.`,
      });
    }

    saveFallbackStore(store);

    return res.status(201).json({
      success: true,
      space: { id: `space-${slug}`, name: cleanName, slug },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/taxonomies/subcategory
router.post("/subcategory", (req, res) => {
  try {
    const { categoryId, name } = req.body;
    if (!categoryId || !name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Category ID and Subcategory name are required." });
    }

    const cleanName = name.trim();
    const cleanCat = String(categoryId).toLowerCase().trim().replace(/^cat-/, "");
    const slug = slugify(cleanName);

    const store = loadFallbackStore();
    if (!Array.isArray(store.custom_subcategories)) {
      store.custom_subcategories = [];
    }

    const exists = store.custom_subcategories.some(
      (s) => (s.categoryId === cleanCat || s.category_id === cleanCat) && s.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (!exists) {
      store.custom_subcategories.push({
        id: `sub-${cleanCat}-${slug}`,
        categoryId: cleanCat,
        category_id: cleanCat,
        name: cleanName,
        slug,
      });
      saveFallbackStore(store);
    }

    return res.status(201).json({
      success: true,
      subcategory: {
        id: `sub-${cleanCat}-${slug}`,
        categoryId: cleanCat,
        name: cleanName,
        slug,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/taxonomies/shapes - Retrieve manageable tile shapes
router.get("/shapes", (req, res) => {
  try {
    const store = loadFallbackStore();
    const defaultShapes = [
      "Rectangle",
      "Square",
      "Circle",
      "Hexagon",
      "Octagon",
      "Triangle",
      "Oval",
      "Other",
    ];
    const customShapes = Array.isArray(store.custom_shapes) ? store.custom_shapes : [];
    const combined = [...new Set([...defaultShapes, ...customShapes])];
    return res.json({ success: true, shapes: combined });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/taxonomies/shapes - Add a manageable tile shape
router.post("/shapes", (req, res) => {
  try {
    const { shape } = req.body;
    if (!shape || typeof shape !== "string" || !shape.trim()) {
      return res.status(400).json({ success: false, error: "Shape name is required." });
    }
    const cleanShape = shape.trim();
    const store = loadFallbackStore();
    if (!Array.isArray(store.custom_shapes)) {
      store.custom_shapes = [];
    }
    if (!store.custom_shapes.some((s) => s.toLowerCase() === cleanShape.toLowerCase())) {
      store.custom_shapes.push(cleanShape);
      saveFallbackStore(store);
    }
    const defaultShapes = [
      "Rectangle",
      "Square",
      "Circle",
      "Hexagon",
      "Octagon",
      "Triangle",
      "Oval",
      "Other",
    ];
    const combined = [...new Set([...defaultShapes, ...store.custom_shapes])];
    return res.json({ success: true, shapes: combined });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DEFAULT TILE SIZE OPTIONS
const DEFAULT_TILE_SIZES = [
  "Large Format Tiles",
  "Medium Format Tiles",
  "Small Format Tiles",
];

// GET /api/v1/taxonomies/tiles-by-size - Retrieve manageable tile size classifications
router.get("/tiles-by-size", (req, res) => {
  try {
    const store = loadFallbackStore();
    const customSizes = Array.isArray(store.custom_tiles_by_size) ? store.custom_tiles_by_size : [];
    const combined = [...new Set([...DEFAULT_TILE_SIZES, ...customSizes])];
    return res.json({
      success: true,
      sizes: combined,
      defaultSizes: DEFAULT_TILE_SIZES,
      customSizes,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/taxonomies/tiles-by-size - Add a custom tile size classification
router.post("/tiles-by-size", (req, res) => {
  try {
    const { size } = req.body;
    if (!size || typeof size !== "string" || !size.trim()) {
      return res.status(400).json({ success: false, error: "Size name is required." });
    }
    const cleanSize = size.trim();
    if (DEFAULT_TILE_SIZES.some((s) => s.toLowerCase() === cleanSize.toLowerCase())) {
      return res.status(400).json({ success: false, error: "This size already exists as a default option." });
    }

    const store = loadFallbackStore();
    if (!Array.isArray(store.custom_tiles_by_size)) {
      store.custom_tiles_by_size = [];
    }
    if (store.custom_tiles_by_size.some((s) => s.toLowerCase() === cleanSize.toLowerCase())) {
      return res.status(400).json({ success: false, error: "This custom size already exists." });
    }

    store.custom_tiles_by_size.push(cleanSize);
    saveFallbackStore(store);

    const combined = [...new Set([...DEFAULT_TILE_SIZES, ...store.custom_tiles_by_size])];
    return res.json({
      success: true,
      sizes: combined,
      defaultSizes: DEFAULT_TILE_SIZES,
      customSizes: store.custom_tiles_by_size,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/taxonomies/tiles-by-size - Edit an existing custom tile size classification
router.put("/tiles-by-size", (req, res) => {
  try {
    const { oldSize, newSize } = req.body;
    if (!oldSize || !newSize || !newSize.trim()) {
      return res.status(400).json({ success: false, error: "Both old and new size names are required." });
    }
    const cleanOld = oldSize.trim();
    const cleanNew = newSize.trim();

    if (DEFAULT_TILE_SIZES.some((s) => s.toLowerCase() === cleanOld.toLowerCase())) {
      return res.status(400).json({ success: false, error: "Default size options cannot be renamed." });
    }

    const store = loadFallbackStore();
    if (!Array.isArray(store.custom_tiles_by_size)) {
      store.custom_tiles_by_size = [];
    }

    const idx = store.custom_tiles_by_size.findIndex((s) => s.toLowerCase() === cleanOld.toLowerCase());
    if (idx === -1) {
      return res.status(404).json({ success: false, error: "Custom size not found." });
    }

    // Duplicate check
    if (
      DEFAULT_TILE_SIZES.some((s) => s.toLowerCase() === cleanNew.toLowerCase()) ||
      store.custom_tiles_by_size.some((s, i) => i !== idx && s.toLowerCase() === cleanNew.toLowerCase())
    ) {
      return res.status(400).json({ success: false, error: "A size with this name already exists." });
    }

    store.custom_tiles_by_size[idx] = cleanNew;

    // Update products that use this size
    if (Array.isArray(store.products)) {
      store.products.forEach((p) => {
        if (p.tilesBySize) {
          const parts = p.tilesBySize.split(",").map((s) => s.trim());
          const newParts = parts.map((s) => (s.toLowerCase() === cleanOld.toLowerCase() ? cleanNew : s));
          p.tilesBySize = newParts.join(", ");
          p.tiles_by_size = p.tilesBySize;
        }
        if (Array.isArray(p.tilesBySizeList)) {
          p.tilesBySizeList = p.tilesBySizeList.map((s) => (s.toLowerCase() === cleanOld.toLowerCase() ? cleanNew : s));
        }
      });
    }

    saveFallbackStore(store);

    const combined = [...new Set([...DEFAULT_TILE_SIZES, ...store.custom_tiles_by_size])];
    return res.json({
      success: true,
      sizes: combined,
      defaultSizes: DEFAULT_TILE_SIZES,
      customSizes: store.custom_tiles_by_size,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/taxonomies/tiles-by-size - Delete a custom tile size classification
router.delete("/tiles-by-size", (req, res) => {
  try {
    const size = req.body?.size || req.query?.size;
    if (!size || typeof size !== "string" || !size.trim()) {
      return res.status(400).json({ success: false, error: "Size name is required." });
    }
    const cleanSize = size.trim();

    if (DEFAULT_TILE_SIZES.some((s) => s.toLowerCase() === cleanSize.toLowerCase())) {
      return res.status(400).json({ success: false, error: "Cannot delete default tile size options." });
    }

    const store = loadFallbackStore();
    if (Array.isArray(store.custom_tiles_by_size)) {
      store.custom_tiles_by_size = store.custom_tiles_by_size.filter(
        (s) => s.toLowerCase() !== cleanSize.toLowerCase()
      );
      saveFallbackStore(store);
    }

    const combined = [...new Set([...DEFAULT_TILE_SIZES, ...(store.custom_tiles_by_size || [])])];
    return res.json({
      success: true,
      sizes: combined,
      defaultSizes: DEFAULT_TILE_SIZES,
      customSizes: store.custom_tiles_by_size || [],
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
