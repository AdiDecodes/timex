import type { Metadata } from "next";
import { ProductsPluralSlugClient } from "./ProductsPluralSlugClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = await getSeoMetadata(`/product/${slug}`);
  return buildPageMetadata(seo);
}

export async function generateStaticParams() {
  const { getProducts } = await import("@/services/product");
  const products = await getProducts({ includeInactive: true });
  const { MOCK_PRODUCTS } = await import("@/data/products");
  const slugSet = new Set<string>();
  products.forEach((p) => p.slug && slugSet.add(p.slug));
  MOCK_PRODUCTS.forEach((p) => p.slug && slugSet.add(p.slug));
  return Array.from(slugSet).map((slug) => ({ slug }));
}

export default async function ProductsPluralSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  return <ProductsPluralSlugClient slug={resolved.slug} />;
}
