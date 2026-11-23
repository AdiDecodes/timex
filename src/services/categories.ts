import { Collection, COLLECTIONS } from "@/data/collections";
import { matchesProductCategory } from "@/utils/productCategories";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  parentName?: string | null;
  description: string;
  banner: string;
  image?: string;
  mediaId?: string;
  status: "published" | "draft";
  order: number;
  productCount?: number;
  url: string;
  isBase?: boolean;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: "summary_large_image" | "summary";
  schemaType?: string;
  schemaJson?: string;
  showInNav?: boolean;
  showInExplore?: boolean;
  showInWorldOfTiles?: boolean;
  customCode?: string;
  redirectUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  mediaId?: string;
  status: "published" | "draft";
  order: number;
  seoTitle?: string;
  metaDescription?: string;
  blogCount?: number;
}

let _cachedStoreData: any = null;
let _cachedStoreMtime = 0;
let _lastStoreCheck = 0;

export function invalidateCategoriesCache(): void {
  _cachedStoreData = null;
  _cachedStoreMtime = 0;
  _lastStoreCheck = 0;
}

function getStoreData(): any {
  if (typeof window === "undefined") {
    try {
      const now = Date.now();
      // Fast path: return in-memory cached store if checked within last 3 seconds
      if (_cachedStoreData && now - _lastStoreCheck < 3000) {
        return _cachedStoreData;
      }

      const fs = eval("require")("fs");
      const path = eval("require")("path");
      const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
      const storePath =
        isServerless && fs.existsSync("/tmp/data/store.json")
          ? "/tmp/data/store.json"
          : path.resolve(process.cwd(), "server/data/store.json");

      if (fs.existsSync(storePath)) {
        const stat = fs.statSync(storePath);
        if (_cachedStoreData && stat.mtimeMs === _cachedStoreMtime) {
          _lastStoreCheck = now;
          return _cachedStoreData;
        }

        const content = fs.readFileSync(storePath, "utf8");
        _cachedStoreData = JSON.parse(content);
        _cachedStoreMtime = stat.mtimeMs;
        _lastStoreCheck = now;
        return _cachedStoreData;
      }
    } catch (e) {
      console.warn("Could not read store.json in categories service:", e);
    }
  }
  return _cachedStoreData || null;
}

export const STANDARD_PRODUCT_CATEGORIES: CategoryItem[] = [
  { id: "brick", name: "Brick", slug: "brick", description: "Urban textures for timeless charm.", banner: "/uploads/products/timex-ceramic-ascot-series-brown-mix-til.webp", status: "published", order: 1, url: "/product-category/brick", isBase: true },
  { id: "marble", name: "Marble", slug: "marble", description: "Luxury that never goes out of style.", banner: "/uploads/products/204-Conept-AMB_1.webp", status: "published", order: 2, url: "/product-category/marble", isBase: true },
  { id: "hexagon", name: "Hexagon", slug: "hexagon", description: "Geometric beauty in every detail.", banner: "/uploads/products/AMB_LANCASTER-GREY_BANO_result.webp", status: "published", order: 3, url: "/product-category/hexagon", isBase: true },
  { id: "modular", name: "Modular", slug: "modular", description: "Sleek. Versatile. Effortlessly modern.", banner: "/uploads/products/amb-02-albany_teka_pag.53.webp", status: "published", order: 4, url: "/product-category/modular", isBase: true },
  { id: "stone", name: "Stone", slug: "stone", description: "Raw textures. Grounded elegance.", banner: "/uploads/products/AMB_NAZCA-BEIGE-1.webp", status: "published", order: 5, url: "/product-category/stone", isBase: true },
  { id: "subway", name: "Subway", slug: "subway", description: "Classic lines for contemporary spaces.", banner: "/uploads/products/Amb-Makalu-Beige-5x50_hq.webp", status: "published", order: 6, url: "/product-category/subway", isBase: true },
  { id: "moroccan", name: "Moroccan", slug: "moroccan", description: "Bold patterns. Timeless soul.", banner: "/uploads/products/1004-AMB-3.webp", status: "published", order: 7, url: "/product-category/moroccan", isBase: true },
  { id: "octagonal", name: "Octagonal", slug: "octagonal", description: "Vintage shapes. Modern appeal.", banner: "/uploads/products/Ambiente-Betera-Blanco-58x58_result.webp", status: "published", order: 8, url: "/product-category/octagonal", isBase: true },
  { id: "wooden", name: "Wooden", slug: "wooden", description: "The warmth of wood. The ease of tile.", banner: "/uploads/products/6001-3.webp", status: "published", order: 9, url: "/product-category/wooden", isBase: true },
  { id: "texture", name: "Texture", slug: "texture", description: "Feel the surface. See the depth.", banner: "/uploads/products/Amb-Teguise-cotto-15x30-Lagoon-green-15x15.webp", status: "published", order: 10, url: "/product-category/texture", isBase: true },
  { id: "colorful", name: "Colorful", slug: "colorful", description: "Add life. Add personality.", banner: "/uploads/products/Blinds-Ambience-3.webp", status: "published", order: 11, url: "/product-category/colorful", isBase: true },
  { id: "terrazzo", name: "Terrazzo", slug: "terrazzo", description: "Retro vibes. Modern twist.", banner: "/uploads/products/12001-1200X1200-MM.webp", status: "published", order: 12, url: "/product-category/terrazzo", isBase: true },
  { id: "tropical", name: "Tropical", slug: "tropical", description: "Inspired by nature. Made for calm.", banner: "/uploads/products/1004-AMB-3.webp", status: "published", order: 13, url: "/product-category/tropical", isBase: true },
  { id: "metallic", name: "Metallic", slug: "metallic", description: "Shine subtly. Stand out effortlessly.", banner: "/uploads/products/202-Light-232-Light_AMB.webp", status: "published", order: 14, url: "/product-category/metallic", isBase: true },
  { id: "highlighter", name: "Highlighter", slug: "highlighter", description: "Make a statement. Every single time.", banner: "/uploads/products/208-Concept-AMB_2.webp", status: "published", order: 15, url: "/product-category/highlighter", isBase: true },
  { id: "mosaic", name: "Mosaic", slug: "mosaic", description: "Tiny tiles. Big impact.", banner: "/uploads/products/amb_GM-91_result.webp", status: "published", order: 16, url: "/product-category/mosaic", isBase: true },
  { id: "boutique", name: "Boutique", slug: "boutique", description: "Unique designs for unique spaces.", banner: "/uploads/products/Raku-Sand-Line-Sand-10-x-10-cm.webp", status: "published", order: 17, url: "/product-category/boutique", isBase: true },
  { id: "french-frames", name: "French frames", slug: "french-frames", description: "Timeless patterns. Effortless grace.", banner: "/uploads/products/Fables-Plinth-Blue-Mate-Fables-Dama-Night-300-x-900.webp", status: "published", order: 18, url: "/product-category/french-frames", isBase: true },
  { id: "fabric", name: "Fabric", slug: "fabric", description: "Soft strokes. Strong presence.", banner: "/uploads/products/9005-AMB-6.webp", status: "published", order: 19, url: "/product-category/fabric", isBase: true },
];

export function resolveCategoryImage(cat: {
  banner?: string;
  ogImage?: string;
  image?: string;
  fallbackImage?: string;
  referenceImage?: string;
}): string {
  if (cat.banner && (cat.banner.startsWith("http") || cat.banner.startsWith("/uploads"))) {
    return cat.banner;
  }
  if (cat.ogImage && cat.ogImage.startsWith("http")) {
    return cat.ogImage;
  }
  if (cat.image && cat.image.startsWith("http")) {
    return cat.image;
  }
  if (cat.banner) {
    return cat.banner;
  }
  if (cat.referenceImage) {
    return cat.referenceImage;
  }
  if (cat.fallbackImage) {
    return cat.fallbackImage;
  }
  return "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80";
}

export function countProductsForCategory(
  products: any[],
  catId: string,
  catSlug: string,
  catName: string
): number {
  if (!Array.isArray(products)) return 0;

  const seen = new Set<string>();
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

    const isMatch =
      matchesProductCategory(p, catSlug) ||
      matchesProductCategory(p, catId) ||
      matchesProductCategory(p, catName);

    if (!isMatch) return false;

    const key = String(p.id || p.slug || "").trim();
    if (key) {
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  }).length;
}

export function getStoredCategories(
  options: { includeDrafts?: boolean; worldOfTilesOnly?: boolean } = {}
): CategoryItem[] {
  const store = getStoreData();
  const customCats: any[] = store && Array.isArray(store.custom_categories) ? store.custom_categories : [];
  const products: any[] = store && Array.isArray(store.products) ? store.products : [];
  const deletedIds = new Set(
    store && Array.isArray(store.deleted_category_ids)
      ? store.deleted_category_ids.map((s: string) => String(s).toLowerCase().trim())
      : []
  );

  const catMap = new Map<string, CategoryItem>();

  // Base standard 19 categories
  STANDARD_PRODUCT_CATEGORIES.forEach((base, idx) => {
    if (deletedIds.has(base.id.toLowerCase()) || deletedIds.has(base.slug.toLowerCase())) {
      return;
    }
    const realCount = countProductsForCategory(products, base.id, base.slug, base.name);
    catMap.set(base.slug.toLowerCase(), {
      ...base,
      parentId: null,
      parentName: null,
      mediaId: "",
      seoTitle: `${base.name} Tiles & Slabs | Timex Ceramic`,
      metaDescription: base.description,
      focusKeyword: `${base.name.toLowerCase()} tiles`,
      canonicalUrl: `/product-category/${base.slug}`,
      ogTitle: `${base.name} Tiles - Timex Ceramic`,
      ogDescription: base.description,
      ogImage: base.banner,
      productCount: realCount,
      showInNav: true,
      showInExplore: true,
      showInWorldOfTiles: true,
    });
  });

  // Custom categories from store
  customCats.forEach((custom, idx) => {
    const slug = (custom.slug || "").toLowerCase().trim();
    const id = (custom.id || `cat-${slug}`).toLowerCase().trim();
    if (!slug || deletedIds.has(slug) || deletedIds.has(id)) {
      return;
    }

    const existing = catMap.get(slug);
    let parentName = null;
    if (custom.parentId) {
      const parent = Array.from(catMap.values()).find(
        (c) => c.id === custom.parentId || c.slug === custom.parentId.toLowerCase()
      );
      if (parent) parentName = parent.name;
    }

    const realCount = countProductsForCategory(products, id, slug, custom.name || slug);

    catMap.set(slug, {
      id: custom.id || (existing ? existing.id : `cat-${slug}`),
      name: custom.name || (existing ? existing.name : slug),
      slug: custom.slug,
      parentId: custom.parentId || null,
      parentName,
      description: custom.description || (existing ? existing.description : ""),
      banner: custom.banner || (existing ? existing.banner : "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"),
      mediaId: custom.mediaId || "",
      status: custom.status || (existing ? existing.status : "published"),
      order: custom.order !== undefined ? Number(custom.order) : (existing ? existing.order : STANDARD_PRODUCT_CATEGORIES.length + idx + 1),
      seoTitle: custom.seoTitle || (existing ? existing.seoTitle : `${custom.name} Tiles | Timex Ceramic`),
      metaDescription: custom.metaDescription || custom.description || (existing ? existing.metaDescription : ""),
      focusKeyword: custom.focusKeyword || (existing ? existing.focusKeyword : ""),
      canonicalUrl: custom.canonicalUrl || `/product-category/${slug}`,
      ogTitle: custom.ogTitle || `${custom.name} Tiles`,
      ogDescription: custom.ogDescription || custom.description || "",
      ogImage: custom.ogImage || custom.banner || (existing ? existing.ogImage : ""),
      productCount: realCount,
      url: `/product-category/${slug}`,
      isBase: existing ? existing.isBase : false,
      showInNav: custom.showInNav !== undefined ? custom.showInNav : (existing ? existing.showInNav : true),
      showInExplore: custom.showInExplore !== undefined ? custom.showInExplore : (existing ? existing.showInExplore : true),
      showInWorldOfTiles: custom.showInWorldOfTiles !== undefined ? custom.showInWorldOfTiles : (existing ? existing.showInWorldOfTiles : true),
    });
  });

  let list = Array.from(catMap.values());
  if (!options.includeDrafts) {
    list = list.filter((c) => c.status !== "draft");
  }
  if (options.worldOfTilesOnly) {
    list = list.filter((c) => c.showInWorldOfTiles !== false);
  }
  return list.sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999));
}

export function getWorldOfTilesCategories(): CategoryItem[] {
  return getStoredCategories({ includeDrafts: false, worldOfTilesOnly: true });
}

export function getPublishedCategories(): CategoryItem[] {
  return getStoredCategories({ includeDrafts: false });
}

export function getCategoryBySlug(slug: string): CategoryItem | undefined {
  const cats = getStoredCategories({ includeDrafts: true });
  const clean = slug.toLowerCase().trim();
  const alias = clean === "colourful" ? "colorful" : clean === "colorful" ? "colourful" : clean;
  return cats.find(
    (c) =>
      c.slug.toLowerCase() === clean ||
      c.slug.toLowerCase() === alias ||
      c.id.toLowerCase() === clean ||
      c.id.toLowerCase() === alias ||
      clean.replace("-series", "") === c.slug.toLowerCase() ||
      clean.replace("-series", "") === c.id.toLowerCase() ||
      clean.replace(/-/g, "") === c.slug.toLowerCase().replace(/-/g, "")
  );
}

export function getStoredBlogCategories(): BlogCategoryItem[] {
  const store = getStoreData();
  if (store && Array.isArray(store.blog_categories) && store.blog_categories.length > 0) {
    return store.blog_categories;
  }

  // Fallback defaults
  return [
    {
      id: "bcat-trends",
      name: "TRENDS",
      slug: "trends",
      description: "Latest architectural movements and emerging design trends.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      status: "published",
      order: 1,
      seoTitle: "Tile & Architectural Trends | Timex Ceramic",
      metaDescription: "Explore international ceramic surface trends and modern palettes.",
    },
    {
      id: "bcat-design-tips",
      name: "DESIGN TIPS",
      slug: "design-tips",
      description: "Expert advice on selecting finishes, laying patterns, and styling luxury spaces.",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      status: "published",
      order: 2,
      seoTitle: "Tile Design & Installation Tips | Timex Ceramic",
      metaDescription: "Actionable interior design and tile installation advice.",
    },
    {
      id: "bcat-creative",
      name: "CREATIVE",
      slug: "creative",
      description: "Inspiring projects, creative architectural applications, and pattern layouts.",
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
      description: "Timex Ceramic updates, new collection launches, and exhibition highlights.",
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
      description: "Comprehensive buying guides and technical maintenance instructions.",
      image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      status: "published",
      order: 5,
      seoTitle: "Tile Specification & Buying Guides | Timex Ceramic",
      metaDescription: "Technical guidelines on water absorption and surface finishes.",
    },
    {
      id: "bcat-architecture",
      name: "ARCHITECTURE",
      slug: "architecture",
      description: "Large format porcelain slabs and commercial architectural solutions.",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      status: "published",
      order: 6,
      seoTitle: "Architectural Porcelain & Cladding | Timex Ceramic",
      metaDescription: "Engineered porcelain slabs for exterior facades and large-scale projects.",
    },
  ];
}
