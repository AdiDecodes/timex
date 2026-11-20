"use client";

import { useState, useEffect } from "react";
import { CategoryItem, STANDARD_PRODUCT_CATEGORIES } from "@/services/categories";

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

// Module-level in-memory cache and promise deduplication
let cachedCategories: CategoryItem[] | null = null;
let inflightCategoriesPromise: Promise<CategoryItem[] | null> | null = null;

async function fetchDynamicCategoriesData(): Promise<CategoryItem[] | null> {
  if (inflightCategoriesPromise) return inflightCategoriesPromise;

  inflightCategoriesPromise = (async () => {
    try {
      const res = await fetch(`/api/v1/taxonomies/categories?status=published&worldOfTiles=true`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.categories)) {
          const valid: CategoryItem[] = data.categories
            .filter((c: any) => c.status === "published" && c.showInWorldOfTiles !== false)
            .sort((a: any, b: any) => Number(a.order ?? 999) - Number(b.order ?? 999))
            .map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              url: c.url || `/product-category/${c.slug}`,
              description: c.description || "",
              banner: c.banner || "",
              ogImage: c.ogImage || "",
              image: c.image || "",
              mediaId: c.mediaId || "",
              status: c.status || "published",
              order: Number(c.order ?? 999),
              productCount: c.productCount || 0,
              isBase: Boolean(c.isBase),
              showInNav: c.showInNav !== false,
              showInWorldOfTiles: c.showInWorldOfTiles !== false,
            }));

          cachedCategories = valid;
          return valid;
        }
      }
      return null;
    } catch (err) {
      console.warn("Could not sync World of Tiles categories with Admin:", err);
      return null;
    } finally {
      inflightCategoriesPromise = null;
    }
  })();

  return inflightCategoriesPromise;
}

export function useWorldOfTilesCategories(
  initialCategories?: CategoryItem[]
): CategoryItem[] {
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    if (cachedCategories && cachedCategories.length > 0) {
      return cachedCategories;
    }
    if (initialCategories && initialCategories.length > 0) {
      return initialCategories;
    }
    return STANDARD_PRODUCT_CATEGORIES.filter(
      (c) => c.status === "published" && c.showInWorldOfTiles !== false
    );
  });

  useEffect(() => {
    let isMounted = true;

    // If not cached yet, fetch once
    if (!cachedCategories) {
      fetchDynamicCategoriesData().then((valid) => {
        if (isMounted && valid) {
          setCategories(valid);
        }
      });
    }

    const handleUpdate = () => {
      cachedCategories = null;
      fetchDynamicCategoriesData().then((valid) => {
        if (isMounted && valid) {
          setCategories(valid);
        }
      });
    };

    window.addEventListener("timex-taxonomy-updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("timex-taxonomy-updated", handleUpdate);
    };
  }, []);

  return categories;
}
