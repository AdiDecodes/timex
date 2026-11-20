"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CollectionsGridClient } from "@/components/collection/CollectionsGridClient";
import { ProductListContainer } from "@/components/product/ProductListContainer";

interface CollectionsViewClientProps {
  allProducts: any[];
  publishedCategories: any[];
}

export function CollectionsViewClient({
  allProducts,
  publishedCategories,
}: CollectionsViewClientProps) {
  const searchParams = useSearchParams();

  const rawFilter = useMemo(() => {
    const f = searchParams ? searchParams.get("filter") || searchParams.get("tag") || "" : "";
    return f.toLowerCase().trim();
  }, [searchParams]);

  const isNewArrivalFilter =
    rawFilter === "new-arrivals" ||
    rawFilter === "new_arrivals" ||
    rawFilter === "new-arrival" ||
    rawFilter === "new";

  const isFeaturedFilter =
    rawFilter === "featured" ||
    rawFilter === "featured-collection" ||
    rawFilter === "featured-collections" ||
    rawFilter === "featured_collection";

  const newArrivalProducts = useMemo(() => {
    if (!isNewArrivalFilter) return [];
    const seen = new Set<string>();
    return allProducts.filter((p: any) => {
      if (p.is_trashed || p.isTrashed) return false;
      if (p.isActive === false || p.is_active === false || p.status === "Inactive" || p.status === "Draft") return false;
      if (!Boolean(p.isNewArrival || p.is_new_arrival)) return false;
      const key = p.id || p.slug;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allProducts, isNewArrivalFilter]);

  const featuredProducts = useMemo(() => {
    if (!isFeaturedFilter) return [];
    const featuredCategorySlugs = new Set(publishedCategories.slice(0, 3).map((c) => c.slug.toLowerCase()));
    const featuredCategoryIds = new Set(publishedCategories.slice(0, 3).map((c) => (c.id || "").toLowerCase()));

    const seen = new Set<string>();
    return allProducts.filter((p: any) => {
      if (p.is_trashed || p.isTrashed) return false;
      if (p.isActive === false || p.is_active === false || p.status === "Inactive" || p.status === "Draft") return false;
      
      const isDirect = Boolean(p.isFeatured || p.is_featured || p.featured);
      const catId = (p.categoryId || p.category_id || "").toLowerCase();
      const catName = (p.category || p.category_name || "").toLowerCase();
      const secondary = [
        ...(Array.isArray(p.secondaryCategories) ? p.secondaryCategories : []),
        ...(Array.isArray(p.secondary_categories) ? p.secondary_categories : []),
      ].map((s: string) => String(s).toLowerCase());

      const inCat =
        featuredCategorySlugs.has(catId) ||
        featuredCategoryIds.has(catId) ||
        Array.from(featuredCategorySlugs).some((s) => catName.includes(s) || secondary.includes(s));

      if (!isDirect && !inCat) return false;

      const key = p.id || p.slug;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allProducts, publishedCategories, isFeaturedFilter]);

  if (isNewArrivalFilter) {
    return (
      <ProductListContainer
        initialProducts={newArrivalProducts}
        basePath="/collections"
        pageEyebrow="LATEST COLLECTIONS"
        pageTitle="All New Arrivals"
        pageDescription="Explore our newest tile collections, selected for architects and designers seeking distinctive textures, contemporary finishes, and versatile surfaces."
        backLink={{ label: "View All Master Collections", href: "/collections" }}
      />
    );
  }

  if (isFeaturedFilter) {
    return (
      <ProductListContainer
        initialProducts={featuredProducts}
        basePath="/collections"
        pageEyebrow="FEATURED COLLECTION"
        pageTitle="Featured Collections"
        pageDescription="Discover handcrafted and premium-grade tile collections designed to bring depth, character, and luxury to modern interiors."
        backLink={{ label: "View All Master Collections", href: "/collections" }}
      />
    );
  }

  return (
    <div>
      {/* Hero Header */}
      <section className="py-20 md:py-28 relative z-10 bg-[#EDEAE4] border-b border-[#DED9D0]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] tracking-[0.3em] text-[#C95745] font-semibold uppercase block">
            Signature Surface Series
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#101B38] leading-tight tracking-tight">
            Our Master Collections
          </h1>
          <div className="w-16 h-[2px] bg-[#C95745] mx-auto my-4" />
          <p className="text-sm md:text-base text-[#333333]/80 font-light max-w-2xl mx-auto leading-relaxed">
            Explore our curated tile collections. From Italian Marble slabs to rustic Brick slips and modular architectural patterns.
          </p>
        </div>
      </section>

      {/* Visual Showcase Grid Cards */}
      <section className="py-20 max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <span className="text-[10px] tracking-[0.25em] text-[#C95745] font-semibold uppercase block">
            Visual Catalog Showcase
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#101B38] tracking-tight">
            Explore All Collections
          </h2>
        </div>

        <CollectionsGridClient initialCategories={publishedCategories} />
      </section>
    </div>
  );
}

