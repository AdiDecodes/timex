import { MetadataRoute } from "next";
import { getGlobalSeoSettings } from "@/services/seo";
import { getProducts } from "@/services/product";
import { getBlogs } from "@/services/blog";
import { getStoredSpaces } from "@/services/spaces";

export const revalidate = 60;

const CORE_STATIC_ROUTES = [
  "",
  "/about",
  "/products",
  "/collections",
  "/spaces",
  "/visualiser",
  "/calculator",
  "/catalogue-maker",
  "/dealer-portal",
  "/architect-portal",
  "/blogs",
  "/contact",
  "/downloads",
  "/inspiration",
  "/watch-and-choose",
  "/projects",
  "/compare",
  "/wishlist",
  "/applications",
  "/sitemap",
  "/disclaimer",
];

import { getAllCollections } from "@/data/collections";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = getGlobalSeoSettings();
  const baseUrl = (settings.site_url || "https://www.timexceramic.com").replace(/\/$/, "");
  const cfg = settings.sitemap_config || {
    include_pages: true,
    include_posts: true,
    include_products: true,
    include_categories: true,
    include_images: true,
  };

  const sitemapItems: MetadataRoute.Sitemap = [];

  // 1. Static Core Pages
  if (cfg.include_pages !== false) {
    for (const route of CORE_STATIC_ROUTES) {
      sitemapItems.push({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
        priority: route === "" ? 1.0 : (route === "/products" || route === "/collections" ? 0.9 : 0.75),
      });
    }
  }

  // 2. Collection Series Pages (Dynamic & Base)
  if (cfg.include_categories !== false) {
    const allCollections = getAllCollections();
    for (const col of allCollections) {
      sitemapItems.push({
        url: `${baseUrl}/product-category/${col.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      });
    }
  }

  // 3. Dynamic Products
  if (cfg.include_products !== false) {
    try {
      const products = await getProducts();
      for (const p of products) {
        if (p.isActive !== false && p.is_active !== false) {
          sitemapItems.push({
            url: `${baseUrl}/product/${p.slug}`,
            lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          });
        }
      }
    } catch (err) {
      console.warn("Sitemap failed to index products:", err);
    }
  }

  // 4. Dynamic Blog Journal Articles
  if (cfg.include_posts !== false) {
    try {
      const blogs = await getBlogs();
      for (const b of blogs) {
        if (b.status !== "Draft") {
          sitemapItems.push({
            url: `${baseUrl}/blogs/${b.slug}`,
            lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          });
        }
      }
    } catch (err) {
      console.warn("Sitemap failed to index blogs:", err);
    }
  }

  // 5. Dedicated Tiles by Space Pages (16 canonical direct URLs)
  try {
    const spaces = getStoredSpaces();
    for (const s of spaces) {
      if (s.status !== "draft") {
        sitemapItems.push({
          url: `${baseUrl}/${s.slug}`,
          lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.85,
        });
      }
    }
  } catch (err) {
    console.warn("Sitemap failed to index spaces:", err);
  }

  // 6. Navigation Filter Landing Pages (Application, Material, Finish, Shape, Design, Color, Size, Origin)
  try {
    const seenUrls = new Set(sitemapItems.map((item) => item.url));
    const { NAVIGATION_FILTER_GROUPS } = await import("@/data/navigationFilters");
    NAVIGATION_FILTER_GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        const itemUrl = `${baseUrl}/${item.slug}`;
        if (!seenUrls.has(itemUrl)) {
          seenUrls.add(itemUrl);
          sitemapItems.push({
            url: itemUrl,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          });
        }
      });
    });
  } catch (err) {
    console.warn("Sitemap failed to index navigation filter routes:", err);
  }

  return sitemapItems;
}
