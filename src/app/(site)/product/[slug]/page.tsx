import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import { getProductBySlug, getProductByCode, getProducts } from "@/services/product";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = await getProducts({ includeInactive: true });
  const { MOCK_PRODUCTS } = await import("@/data/products");
  const slugSet = new Set<string>();
  products.forEach((p) => p.slug && slugSet.add(p.slug));
  MOCK_PRODUCTS.forEach((p) => p.slug && slugSet.add(p.slug));
  return Array.from(slugSet).map((slug) => ({ slug }));
}

import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const seo = await getSeoMetadata(`/product/${slug}`);
  return buildPageMetadata(seo);
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Attempt to fetch product by slug, fallback to code lookup
  let product = await getProductBySlug(slug);
  if (!product) {
    product = await getProductByCode(slug);
  }

  // Render 404 if no product matches either query
  if (!product) {
    notFound();
  }

  const seo = await getSeoMetadata(`/product/${slug}`);

  // Fetch related products based on same category or collection
  let relatedProducts: any[] = [];
  try {
    const allProducts = await getProducts();
    relatedProducts = allProducts.filter(
      (p) =>
        p.id !== product.id &&
        (p.categoryId === product.categoryId ||
          p.category_id === product.category_id ||
          p.collectionId === product.collectionId ||
          p.category === product.category)
    ).slice(0, 10);

    if (relatedProducts.length === 0) {
      relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 8);
    }
  } catch (err) {
    console.warn("Failed to retrieve related products:", err);
  }

  return (
    <div className="bg-white min-h-screen">
      {seo.schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seo.schemaData }}
        />
      )}
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </Suspense>
    </div>
  );
}
