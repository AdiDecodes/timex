import type { Metadata } from "next";

function getNodeFs(): any {
  if (typeof window === "undefined") {
    try {
      return eval("require")("fs");
    } catch {}
  }
  return null;
}

function getNodePath(): any {
  if (typeof window === "undefined") {
    try {
      return eval("require")("path");
    } catch {}
  }
  return null;
}

export interface SeoMetadataResult {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  robots: {
    index: boolean;
    follow: boolean;
  };
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
    type: string;
    images: { url: string; alt?: string }[];
  };
  twitter: {
    card: "summary" | "summary_large_image";
    title: string;
    description: string;
    images: string[];
  };
  schemaType?: string;
  schemaData?: string;
}

/**
 * Standard Next.js Metadata builder from SeoMetadataResult.
 * Uses { absolute: seo.title } to ensure the exact configured title is rendered
 * without being distorted by layout title templates.
 */
export function buildPageMetadata(seo: SeoMetadataResult): Metadata {
  return {
    title: {
      absolute: seo.title,
    },
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    robots: {
      index: seo.robots.index,
      follow: seo.robots.follow,
    },
    openGraph: {
      title: seo.openGraph.title || seo.title,
      description: seo.openGraph.description || seo.description,
      url: seo.openGraph.url,
      siteName: seo.openGraph.siteName || "Timex Ceramic",
      type: (seo.openGraph.type as any) || "website",
      images: seo.openGraph.images,
    },
    twitter: {
      card: seo.twitter.card || "summary_large_image",
      title: seo.twitter.title || seo.title,
      description: seo.twitter.description || seo.description,
      images: seo.twitter.images,
    },
  };
}

export interface GlobalSeoSettings {
  site_name: string;
  site_url: string;
  default_title_template: string;
  default_meta_description: string;
  default_og_image: string;
  default_robots_index: boolean;
  default_robots_follow: boolean;
  robots_txt_content: string;
  sitemap_config: {
    include_pages: boolean;
    include_posts: boolean;
    include_products: boolean;
    include_categories: boolean;
    include_images: boolean;
    last_generated?: string;
  };
  organization_data: Record<string, any>;
  verification_codes: {
    google?: string;
    bing?: string;
    pinterest?: string;
  };
  social_links: Record<string, string>;
}

function getSeoStorePath(): string {
  const fs = getNodeFs();
  const path = getNodePath();
  if (!path) return "server/data/store.json";

  const isServerless = Boolean(
    process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL ||
    process.env.LAMBDA_TASK_ROOT
  );
  if (isServerless && fs) {
    const tmpDir = "/tmp/data";
    const tmpPath = path.join(tmpDir, "store.json");
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      if (!fs.existsSync(tmpPath)) {
        const bundled = path.resolve(process.cwd(), "server/data/store.json");
        if (fs.existsSync(bundled)) {
          fs.copyFileSync(bundled, tmpPath);
        }
      }
    } catch {}
    return fs.existsSync(tmpPath) ? tmpPath : path.resolve(process.cwd(), "server/data/store.json");
  }
  return path.resolve(process.cwd(), "server/data/store.json");
}

let _cachedSeoStore: any = null;
let _cachedSeoMtime = 0;
let _lastSeoCheck = 0;

export function invalidateSeoCache(): void {
  _cachedSeoStore = null;
  _cachedSeoMtime = 0;
  _lastSeoCheck = 0;
}

function readStoreFile(): any {
  if (typeof window !== "undefined") return {};
  const fs = getNodeFs();
  if (!fs) return {};
  try {
    const now = Date.now();
    // Return memory-cached store immediately if checked within last 3 seconds
    if (_cachedSeoStore && now - _lastSeoCheck < 3000) {
      return _cachedSeoStore;
    }

    const storePath = getSeoStorePath();
    if (fs.existsSync(storePath)) {
      const stat = fs.statSync(storePath);
      if (_cachedSeoStore && stat.mtimeMs === _cachedSeoMtime) {
        _lastSeoCheck = now;
        return _cachedSeoStore;
      }

      const content = fs.readFileSync(storePath, "utf8");
      _cachedSeoStore = JSON.parse(content);
      _cachedSeoMtime = stat.mtimeMs;
      _lastSeoCheck = now;
      return _cachedSeoStore;
    }
  } catch (err) {
    console.warn("Could not read store.json in seo service:", err);
  }
  return _cachedSeoStore || {};
}

function writeStoreFile(store: any): boolean {
  if (typeof window !== "undefined") return false;
  const fs = getNodeFs();
  if (!fs) return false;
  try {
    const storePath = getSeoStorePath();
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
    _cachedSeoStore = store;
    _lastSeoCheck = Date.now();
    return true;
  } catch (err) {
    console.error("Could not write store.json in seo service:", err);
    return false;
  }
}

export function getGlobalSeoSettings(): GlobalSeoSettings {
  const store = readStoreFile();
  if (store.seo_settings && typeof store.seo_settings === "object") {
    return store.seo_settings;
  }

  return {
    site_name: "Timex Ceramic",
    site_url: "https://www.timexceramic.com",
    default_title_template: "%s | Timex Ceramic",
    default_meta_description: "Experience luxury surfaces with Timex Ceramic. Explore premium floor tiles, vitrified slabs, bathware, and interactive visualizers for luxury spaces.",
    default_og_image: "https://www.timexceramic.com/images/og-image.jpg",
    default_robots_index: true,
    default_robots_follow: true,
    robots_txt_content: `# Timex Ceramic Robots.txt Exclusion Standard\nUser-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /customer-dashboard\nDisallow: /_next/\n\nSitemap: https://www.timexceramic.com/sitemap.xml\n`,
    sitemap_config: {
      include_pages: true,
      include_posts: true,
      include_products: true,
      include_categories: true,
      include_images: true,
    },
    organization_data: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://www.timexceramic.com/#organization",
      name: "Timex Ceramic",
      url: "https://www.timexceramic.com/",
      logo: "https://www.timexceramic.com/wp-content/uploads/2023/07/Timex-Ceramic-Logo.png",
      email: "smm@ambestmedia.com",
      telephone: "+91-22-26122960",
      address: {
        "@type": "PostalAddress",
        streetAddress: "402, Pratik Avenue, Opp. Shiv Sagar Rest., Nehru Road, Vile Parle (E)",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        postalCode: "400057",
        addressCountry: "IN"
      }
    },
    verification_codes: {
      google: "google-site-verification-timex-sample",
    },
    social_links: {
      facebook: "https://facebook.com/timexceramic",
      instagram: "https://instagram.com/timexceramic",
      linkedin: "https://linkedin.com/company/timexceramic",
    }
  };
}

export interface CustomCodeSettings {
  enabled: boolean;
  head_code: string;
  body_start_code: string;
  body_end_code: string;
  updated_at: string;
  backups?: { id: string; timestamp: string; note?: string; custom_code: any }[];
}

export function getCustomCodeSettings(): CustomCodeSettings {
  const store = readStoreFile();
  if (store.custom_code && typeof store.custom_code === "object") {
    return {
      enabled: store.custom_code.enabled !== false,
      head_code: store.custom_code.head_code || "",
      body_start_code: store.custom_code.body_start_code || "",
      body_end_code: store.custom_code.body_end_code || "",
      updated_at: store.custom_code.updated_at || new Date().toISOString(),
      backups: store.custom_code_backups || [],
    };
  }

  return {
    enabled: true,
    head_code: "<!-- Google Verification & Metadata -->\n<meta name=\"robots\" content=\"max-image-preview:large\" />",
    body_start_code: "",
    body_end_code: "",
    updated_at: new Date().toISOString(),
    backups: [],
  };
}

export function getLlmsTxtContent(): string {
  const store = readStoreFile();
  if (store.llms_txt_content && typeof store.llms_txt_content === "string") {
    return store.llms_txt_content;
  }
  const fs = getNodeFs();
  const path = getNodePath();
  if (fs && path) {
    try {
      const p = path.resolve(process.cwd(), "public/llms.txt");
      if (fs.existsSync(p)) {
        return fs.readFileSync(p, "utf8");
      }
    } catch {}
  }

  return `# Timex Ceramic\n\n> Luxury Architectural Surfaces, Vitrified Tiles & Porcelain Slabs\n\nTimex Ceramic is a premier manufacturer and exporter of luxury vitrified tiles, large-format porcelain slabs, and architectural ceramic surfaces based in India.\n\n## Core Products\n- [Harlem Series](/product/harlem-series): Brick-look vitrified tiles (150x450mm).\n- [Calacatta Marble Luxe](/product/timex-calacatta-marble-luxe): Italian marble replication slab.\n- [All Products](/products): Full catalog of vitrified and ceramic tiles.\n\n## Tools & Portals\n- [AI Visualiser](/visualiser): 3D Room Visualiser.\n- [Calculator](/calculator): Tile requirement calculator.\n\n## Contact\n- Head Office: Mumbai, India | Phone: +91-22-26122960\n- Website: https://www.timexceramic.com\n`;
}

export function getHtaccessContent(): string {
  const store = readStoreFile();
  if (store.htaccess_content && typeof store.htaccess_content === "string") {
    return store.htaccess_content;
  }
  const fs = getNodeFs();
  const path = getNodePath();
  if (fs && path) {
    try {
      const p = path.resolve(process.cwd(), "public/.htaccess");
      if (fs.existsSync(p)) {
        return fs.readFileSync(p, "utf8");
      }
    } catch {}
  }

  return `# Apache / LiteSpeed .htaccess Configuration\nRewriteEngine On\nRewriteBase /\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n`;
}

export function getActiveRedirects(): { source_url: string; destination_url: string; redirect_type: number }[] {
  const store = readStoreFile();
  const list = store.seo_redirects || [];
  return list.filter((r: any) => r.is_active);
}

export function record404Hit(url: string, referrer?: string, userAgent?: string): void {
  const store = readStoreFile();
  if (!Array.isArray(store.seo_404_logs)) {
    store.seo_404_logs = [];
  }

  const norm = url.trim().toLowerCase();
  const existing = store.seo_404_logs.find((l: any) => l.url?.toLowerCase() === norm);
  if (existing) {
    existing.hit_count = (existing.hit_count || 1) + 1;
    existing.last_detected = new Date().toISOString();
  } else {
    store.seo_404_logs.unshift({
      id: `log-404-${Date.now()}`,
      url: norm,
      referrer: referrer || "Direct",
      user_agent: userAgent || "Unknown",
      hit_count: 1,
      last_detected: new Date().toISOString(),
      resolved_to: null,
    });
  }

  writeStoreFile(store);
}

export async function getSeoMetadata(pagePath: string): Promise<SeoMetadataResult> {
  const store = readStoreFile();
  const settings = getGlobalSeoSettings();
  const siteUrl = settings.site_url || "https://www.timexceramic.com";
  const defaultOgImg = settings.default_og_image || `${siteUrl}/images/og-image.jpg`;

  // Normalization helper: trims, lowercases, ensures leading slash, strips trailing slash (unless root /)
  const normalizePath = (p?: string): string => {
    if (!p) return "/";
    let norm = p.trim().toLowerCase();
    if (!norm.startsWith("/")) norm = "/" + norm;
    if (norm.length > 1 && norm.endsWith("/")) norm = norm.slice(0, -1);
    return norm;
  };

  const normPath = normalizePath(pagePath);
  const overrides: any[] = Array.isArray(store.seo_metadata) ? store.seo_metadata : [];

  // Match direct override in store.seo_metadata (including cross-matching /collections/ vs /product-category/)
  let custom = overrides.find((s: any) => normalizePath(s.page_path) === normPath);
  if (!custom && normPath.startsWith("/product-category/")) {
    const alt = normPath.replace("/product-category/", "/collections/");
    custom = overrides.find((s: any) => normalizePath(s.page_path) === alt);
  } else if (!custom && normPath.startsWith("/collections/")) {
    const alt = normPath.replace("/collections/", "/product-category/");
    custom = overrides.find((s: any) => normalizePath(s.page_path) === alt);
  }

  // 1. PRODUCT CATEGORY / COLLECTION PAGES
  if (normPath.startsWith("/product-category/") || normPath.startsWith("/collections/")) {
    const slug = normPath.replace(/^\/(product-category|collections)\/?/, "").replace(/\/$/, "");
    const collName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") : "Collection";

    // Check store.custom_categories
    const customCats = Array.isArray(store.custom_categories) ? store.custom_categories : [];
    const cat = customCats.find((c: any) =>
      (c.slug && c.slug.toLowerCase() === slug) ||
      (c.id && c.id.toLowerCase() === slug)
    );

    // Check store.collection_seo
    const collSeo = store.collection_seo && typeof store.collection_seo === "object" ? store.collection_seo[slug] : null;

    // Check default collection SEO registry
    let defaultMetaTitle = "";
    let defaultMetaDesc = "";
    let defaultBanner = defaultOgImg;
    try {
      const { getDefaultCollectionSeo } = require("@/data/collectionSeoData");
      const defData = getDefaultCollectionSeo(slug);
      if (defData) {
        defaultMetaTitle = defData.metaTitle || defData.title || "";
        defaultMetaDesc = defData.metaDescription || "";
        if (defData.banner) defaultBanner = defData.banner;
      }
    } catch {}

    const catTitle = cat?.seoTitle || cat?.metaTitle || cat?.meta_title;
    const catDesc = cat?.metaDescription || cat?.meta_description || cat?.description;

    const collTitle = collSeo?.metaTitle || collSeo?.meta_title || collSeo?.title;
    const collDesc = collSeo?.metaDescription || collSeo?.meta_description;

    // Priority:
    // 1. store.seo_metadata direct entry (admin SEO management)
    // 2. store.custom_categories (admin category editor)
    // 3. store.collection_seo (admin collection SEO / JSON store)
    // 4. default collection registry
    // 5. standard fallback
    const title = (custom?.seo_title || custom?.meta_title || "").trim() ||
                  (catTitle || "").trim() ||
                  (collTitle || "").trim() ||
                  defaultMetaTitle ||
                  `${cat?.name || collName} Tiles & Slabs | Timex Ceramic`;

    const description = (custom?.meta_description || "").trim() ||
                        (catDesc || "").trim() ||
                        (collDesc || "").trim() ||
                        defaultMetaDesc ||
                        `Discover curated ${cat?.name || collName} surface tiles from Timex Ceramic. Durable, elegant, zero-porosity vitrified slabs.`;

    const bannerImg = custom?.og_image || cat?.ogImage || cat?.banner || collSeo?.banner || collSeo?.image || defaultBanner || defaultOgImg;

    const keywords = custom?.secondary_keywords?.length
      ? [custom.focus_keyword, ...custom.secondary_keywords].filter(Boolean)
      : (cat?.focusKeyword ? [cat.focusKeyword, `${slug} tiles`, "timex ceramic"] : [`${slug} tiles`, "luxury tiles", "vitrified slabs", "timex ceramic"]);

    const canonicalUrl = custom?.canonical_url || cat?.canonicalUrl || `${siteUrl}/product-category/${slug}`;

    return {
      title,
      description,
      keywords,
      canonicalUrl,
      robots: {
        index: custom?.robots_index !== undefined ? custom.robots_index : (cat?.robotsIndex !== undefined ? cat.robotsIndex : true),
        follow: custom?.robots_follow !== undefined ? custom.robots_follow : (cat?.robotsFollow !== undefined ? cat.robotsFollow : true),
      },
      openGraph: {
        title: custom?.og_title || cat?.ogTitle || title,
        description: custom?.og_description || cat?.ogDescription || description,
        url: canonicalUrl,
        siteName: settings.site_name,
        locale: "en_US",
        type: "website",
        images: [{ url: bannerImg, alt: cat?.name || collName }],
      },
      twitter: {
        card: (custom?.twitter_card as any) || (cat?.twitterCard as any) || "summary_large_image",
        title: custom?.twitter_title || cat?.twitterTitle || title,
        description: custom?.twitter_description || cat?.twitterDescription || description,
        images: [custom?.twitter_image || cat?.twitterImage || bannerImg],
      },
      schemaType: custom?.schema_type || cat?.schemaType || "CollectionPage",
      schemaData: custom?.schema_data || cat?.schemaJson,
    };
  }

  // 2. INDIVIDUAL PRODUCT PAGES (/product/:slug)
  if (normPath.startsWith("/product/")) {
    const slug = normPath.replace("/product/", "").replace(/\/$/, "");
    const products = Array.isArray(store.products) ? store.products : [];
    const prod = products.find((p: any) =>
      (p.slug && p.slug.toLowerCase() === slug) ||
      (p.id && String(p.id).toLowerCase() === slug) ||
      (p.code && String(p.code).toLowerCase() === slug)
    );

    const prodImg = prod && Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : defaultOgImg;
    const prodTitle = prod?.metaTitle || prod?.meta_title || prod?.seoTitle;
    const prodDesc = prod?.metaDescription || prod?.meta_description || prod?.description;

    const title = (custom?.seo_title || custom?.meta_title || "").trim() ||
                  (prodTitle || "").trim() ||
                  (prod?.name ? `${prod.name} | Timex Ceramic` : "Luxury Tile Surface | Timex Ceramic");

    const description = (custom?.meta_description || "").trim() ||
                        (prodDesc || "").trim() ||
                        (prod?.name ? `Discover ${prod.name} luxury tile surfaces by Timex Ceramic.` : settings.default_meta_description);

    const keywords = custom?.secondary_keywords?.length
      ? [custom.focus_keyword, ...custom.secondary_keywords].filter(Boolean)
      : (prod?.keywords ? prod.keywords.split(",").map((k: string) => k.trim()) : [prod?.name || "tiles", prod?.category || "tiles", "timex ceramic"]);

    const canonicalUrl = custom?.canonical_url || `${siteUrl}/product/${prod?.slug || slug}`;

    return {
      title,
      description,
      keywords,
      canonicalUrl,
      robots: {
        index: custom?.robots_index !== undefined ? custom.robots_index : (prod?.status !== "Inactive" && prod?.is_active !== false),
        follow: custom?.robots_follow !== undefined ? custom.robots_follow : true,
      },
      openGraph: {
        title: custom?.og_title || title,
        description: custom?.og_description || description,
        url: canonicalUrl,
        siteName: settings.site_name,
        locale: "en_US",
        type: "website",
        images: [{ url: custom?.og_image || prodImg, alt: prod?.name || title }],
      },
      twitter: {
        card: (custom?.twitter_card as any) || "summary_large_image",
        title: custom?.twitter_title || title,
        description: custom?.twitter_description || description,
        images: [custom?.twitter_image || prodImg],
      },
      schemaType: custom?.schema_type || "Product",
      schemaData: custom?.schema_data,
    };
  }

  // 3. BLOG POST PAGES (/blogs/:slug or /blog/:slug)
  if (normPath.startsWith("/blogs/") || normPath.startsWith("/blog/")) {
    const slug = normPath.replace(/^\/(blogs|blog)\/?/, "").replace(/\/$/, "");
    const blogs = Array.isArray(store.blogs) ? store.blogs : [];
    const blog = blogs.find((b: any) =>
      (b.slug && b.slug.toLowerCase() === slug) ||
      (b.id && String(b.id).toLowerCase() === slug)
    );

    const cover = blog?.coverImage || defaultOgImg;
    const blogTitle = blog?.metaTitle || blog?.meta_title || blog?.seoTitle;
    const blogDesc = blog?.metaDescription || blog?.meta_description || blog?.excerpt;

    const title = (custom?.seo_title || custom?.meta_title || "").trim() ||
                  (blogTitle || "").trim() ||
                  (blog?.title ? `${blog.title} | Timex Ceramic Blog` : "Timex Ceramic Design Blog");

    const description = (custom?.meta_description || "").trim() ||
                        (blogDesc || "").trim() ||
                        settings.default_meta_description;

    const keywords = custom?.secondary_keywords?.length
      ? [custom.focus_keyword, ...custom.secondary_keywords].filter(Boolean)
      : (blog?.tags || [blog?.category || "TILES", "Timex Ceramic"]);

    const canonicalUrl = custom?.canonical_url || `${siteUrl}/blogs/${blog?.slug || slug}`;

    return {
      title,
      description,
      keywords,
      canonicalUrl,
      robots: {
        index: custom?.robots_index !== undefined ? custom.robots_index : (blog?.status !== "Draft"),
        follow: custom?.robots_follow !== undefined ? custom.robots_follow : true,
      },
      openGraph: {
        title: custom?.og_title || title,
        description: custom?.og_description || description,
        url: canonicalUrl,
        siteName: settings.site_name,
        locale: "en_US",
        type: "article",
        images: [{ url: custom?.og_image || cover, alt: blog?.title || title }],
      },
      twitter: {
        card: (custom?.twitter_card as any) || "summary_large_image",
        title: custom?.twitter_title || title,
        description: custom?.twitter_description || description,
        images: [custom?.twitter_image || cover],
      },
      schemaType: custom?.schema_type || "Article",
      schemaData: custom?.schema_data,
    };
  }

  // 4. CMS PAGES, SPACES, AND STATIC PAGES
  // Check store.pages (CMS pages created or managed in admin)
  const pages = Array.isArray(store.pages) ? store.pages : [];
  const page = pages.find((p: any) =>
    normalizePath(p.path) === normPath ||
    (p.slug && normalizePath(p.slug) === normPath.replace(/^\//, ""))
  );
  const pageTitle = page?.metaTitle || page?.meta_title || page?.seo_title;
  const pageDesc = page?.metaDescription || page?.meta_description;

  // Check store.tiles_by_space or store.custom_spaces
  const spaceSlug = normPath.replace(/^\//, "");
  const spaceList = Array.isArray(store.tiles_by_space) && store.tiles_by_space.length > 0
    ? store.tiles_by_space
    : (Array.isArray(store.custom_spaces) ? store.custom_spaces : []);
  const space = spaceList.find((s: any) =>
    (s.slug && s.slug.toLowerCase() === spaceSlug) ||
    (s.id && s.id.toLowerCase() === spaceSlug)
  );
  const spaceTitle = space?.seoTitle || space?.metaTitle || (space?.name ? `${space.name} | Timex Ceramic` : "");
  const spaceDesc = space?.metaDescription || space?.description;

  // Well-known static page sensible defaults
  let defaultStaticTitle = "";
  let defaultStaticDesc = settings.default_meta_description;

  if (normPath === "/") {
    defaultStaticTitle = "Timex Ceramic | International Premium Tiles & Ceramics";
    defaultStaticDesc = "Experience luxury surfaces with Timex Ceramic. Explore premium floor tiles, vitrified slabs, bathware, and interactive visualizers for luxury spaces.";
  } else if (normPath === "/about") {
    defaultStaticTitle = "About Us | Timex Ceramic Luxury Surfaces";
    defaultStaticDesc = "Learn about the 22+ year legacy of Timex Ceramic, a pioneer in premium imported wall and floor tiles in India.";
  } else if (normPath === "/contact") {
    defaultStaticTitle = "Contact Us & Mumbai Experience Centre | Timex Ceramic";
    defaultStaticDesc = "Visit our Mumbai Experience Centre or connect with our luxury surface consultants for bespoke tile selections.";
  } else if (normPath === "/book-a-showroom-visit") {
    defaultStaticTitle = "Book a Showroom Visit | Timex Ceramic Mumbai";
    defaultStaticDesc = "Plan your visit to Timex Ceramic Mumbai showroom. Experience the world of designer tiles, imported collections, and personalized assistance from tile experts.";
  } else if (normPath === "/products") {
    defaultStaticTitle = "Explore All Ceramic & Vitrified Tiles | Timex Ceramic";
    defaultStaticDesc = "Explore over 500+ premium vitrified tiles, porcelain slabs, and designer surfaces.";
  } else if (normPath === "/collections") {
    defaultStaticTitle = "Curated Design Collections | Timex Ceramic";
    defaultStaticDesc = "Explore curated tile collections inspired by Italian artistry, natural textures, and modern architecture.";
  } else if (normPath === "/world-of-tiles") {
    defaultStaticTitle = "World of Tiles | Timex Ceramic";
    defaultStaticDesc = "Explore 500+ architectural tile surfaces across curated collections, spaces, and formats.";
  } else if (normPath === "/inspiration") {
    defaultStaticTitle = "Inspiration Lookbook & Spaces | Timex Ceramic";
    defaultStaticDesc = "Architectural inspiration for living spaces, wet lounges, and luxury facades.";
  } else if (normPath === "/calculator") {
    defaultStaticTitle = "Precision Tile & Box Calculator | Timex Ceramic";
    defaultStaticDesc = "Calculate tiles, boxes, wastage allowance, and adhesive requirements for any room dimension.";
  } else if (normPath === "/catalogue-maker") {
    defaultStaticTitle = "Custom PDF Tile Catalogue Builder | Timex Ceramic";
    defaultStaticDesc = "Curate tailored product specifications into branded client PDF presentations.";
  } else if (normPath === "/projects") {
    defaultStaticTitle = "Commercial & Residential Tile Case Studies | Timex Ceramic";
    defaultStaticDesc = "Case studies across luxury villas, corporate towers, and boutique hotels.";
  } else if (normPath === "/blogs") {
    defaultStaticTitle = "Design & Architecture Journal | Timex Ceramic";
    defaultStaticDesc = "Insights on ceramic engineering, Italian tile styling, and modern surface architectures.";
  } else if (normPath === "/spaces") {
    defaultStaticTitle = "Tile Applications by Space & Environment | Timex Ceramic";
    defaultStaticDesc = "Browse designer surfaces tailored for bathrooms, kitchens, living rooms, bedrooms, and outdoor elevations.";
  } else if (normPath === "/visualiser") {
    defaultStaticTitle = "AI 3D Room Visualiser | Timex Ceramic";
    defaultStaticDesc = "Experience virtual tile placement in 3D realistic interior and exterior room sets.";
  } else if (normPath === "/dealer-portal") {
    defaultStaticTitle = "Authorized Dealer & Stockist Portal | Timex Ceramic";
    defaultStaticDesc = "Distributor onboarding, dealer inventory resources, and B2B pricing catalogs.";
  } else if (normPath === "/architect-portal") {
    defaultStaticTitle = "Architects & Specifiers Resource Portal | Timex Ceramic";
    defaultStaticDesc = "Technical specifications, CAD/BIM downloads, and commercial procurement for specifiers.";
  } else if (normPath === "/downloads") {
    defaultStaticTitle = "Technical Downloads & Certifications | Timex Ceramic";
    defaultStaticDesc = "Download technical data sheets, ISO test certificates, and full collection catalogs.";
  } else if (normPath === "/compare") {
    defaultStaticTitle = "Tile Specifications Comparison Tool | Timex Ceramic";
    defaultStaticDesc = "Compare technical specifications, dimensions, finishes, and applications side-by-side.";
  } else if (normPath === "/wishlist") {
    defaultStaticTitle = "Saved Luxury Surfaces & Moodboard | Timex Ceramic";
    defaultStaticDesc = "Review saved finishes and generate enquiry proposals for your architectural project.";
  } else if (normPath === "/applications") {
    defaultStaticTitle = "Tile Applications by Space | Timex Ceramic";
    defaultStaticDesc = "Discover recommended tiles for residential, commercial, and industrial installations.";
  } else if (normPath === "/sitemap") {
    defaultStaticTitle = "Sitemap | Timex Ceramic";
    defaultStaticDesc = "Explore all pages, tile collections, spatial applications, and design resources on Timex Ceramic.";
  } else if (normPath === "/disclaimer") {
    defaultStaticTitle = "Disclaimer | Timex Ceramic";
    defaultStaticDesc = "Important legal notice, limitation of liability, and website terms of use for Timex Ceramic.";
  } else {
    const formattedSlug = normPath.replace("/", "").replace(/-/g, " ");
    const capitalised = formattedSlug.charAt(0).toUpperCase() + formattedSlug.slice(1);
    defaultStaticTitle = `${capitalised} | Timex Ceramic`;
  }

  const title = (custom?.seo_title || custom?.meta_title || "").trim() ||
                (pageTitle || "").trim() ||
                (spaceTitle || "").trim() ||
                defaultStaticTitle;

  const description = (custom?.meta_description || "").trim() ||
                      (pageDesc || "").trim() ||
                      (spaceDesc || "").trim() ||
                      defaultStaticDesc;

  const keywords = custom?.secondary_keywords?.length
    ? [custom.focus_keyword, ...custom.secondary_keywords].filter(Boolean)
    : ["premium tiles", "luxury ceramics", "vitrified tiles", "timex ceramic"];

  const canonicalUrl = custom?.canonical_url || `${siteUrl}${normPath === "/" ? "" : normPath}`;

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    robots: {
      index: custom?.robots_index !== undefined ? custom.robots_index : settings.default_robots_index,
      follow: custom?.robots_follow !== undefined ? custom.robots_follow : settings.default_robots_follow,
    },
    openGraph: {
      title: custom?.og_title || title,
      description: custom?.og_description || description,
      url: canonicalUrl,
      siteName: settings.site_name,
      locale: "en_US",
      type: "website",
      images: [{ url: custom?.og_image || defaultOgImg, alt: title }],
    },
    twitter: {
      card: (custom?.twitter_card as any) || "summary_large_image",
      title: custom?.twitter_title || title,
      description: custom?.twitter_description || description,
      images: [custom?.twitter_image || defaultOgImg],
    },
    schemaType: custom?.schema_type,
    schemaData: custom?.schema_data,
  };
}
