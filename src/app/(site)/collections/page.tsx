import React, { Suspense } from "react";
import { Metadata } from "next";
import { getPublishedCategories } from "@/services/categories";
import { getProducts } from "@/services/product";
import { CollectionsViewClient } from "./CollectionsViewClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export const dynamic = "auto";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/collections");
  return buildPageMetadata(seo);
}

export default async function CollectionsPage() {
  const [allProducts, publishedCategories] = await Promise.all([
    getProducts({ includeInactive: false }),
    getPublishedCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[#F7F5F0] relative overflow-hidden">
      <Suspense
        fallback={
          <div className="py-24 text-center text-xs uppercase tracking-widest text-[#C95745] font-semibold animate-pulse">
            Loading Collections...
          </div>
        }
      >
        <CollectionsViewClient
          allProducts={allProducts}
          publishedCategories={publishedCategories}
        />
      </Suspense>
    </div>
  );
}
