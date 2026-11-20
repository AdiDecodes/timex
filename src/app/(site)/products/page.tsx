import { Suspense } from "react";
import { Metadata } from "next";
import { ProductsRedirectClient } from "./ProductsRedirectClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/products");
  return buildPageMetadata(seo);
}

export default function ProductsRedirectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0]" />}>
      <ProductsRedirectClient />
    </Suspense>
  );
}
