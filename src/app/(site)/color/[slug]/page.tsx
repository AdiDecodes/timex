import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProducts } from "@/services/product";
import { ProductListContainer } from "@/components/product/ProductListContainer";
import { getStoredColors, getColorBySlug } from "@/services/colors";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const colors = getStoredColors();
  return colors.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const color = getColorBySlug(slug);

  const colorName = color
    ? color.name
    : slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

  const title = `${colorName} Color Tiles | Premium Ceramic Collection`;
  const description = `Explore Timex Ceramic's exclusive ${colorName} tile collection. High-durability vitrified porcelain slabs and designer wall surfaces.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.timexceramic.com/color/${slug}`,
    },
    alternates: {
      canonical: `https://www.timexceramic.com/color/${slug}`,
    },
  };
}

export default async function ColorCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const color = getColorBySlug(slug);

  const colorName = color
    ? color.name
    : slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

  const allProducts = await getProducts();

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0]" />}>
        <ProductListContainer
          initialProducts={allProducts}
          primaryFilterGroup="color"
          initialFilter={{
            key: "color",
            value: colorName,
          }}
          pageTitle={`${colorName} Color Tiles`}
          pageDescription={`Discover Timex Ceramic's exclusive ${colorName} collection. Engineered with high-durability porcelain and imported ceramic craftsmanship for luxury spaces.`}
          pageEyebrow="TILES BY COLOR"
          basePath={`/color/${slug}`}
        />
      </Suspense>
    </div>
  );
}
