import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSpaceBySlug, getProductsForSpace, generateSpaceMetadata, getStoredSpaces } from "@/services/spaces";
import { getProducts } from "@/services/product";
import { SpaceTilesPage } from "@/components/space/SpaceTilesPage";
import { ProductListContainer } from "@/components/product/ProductListContainer";
import {
  getFilterRouteInfo,
  NAVIGATION_FILTER_GROUPS,
} from "@/data/navigationFilters";

interface PageProps {
  params: Promise<{ spaceSlug: string }>;
}

export const dynamicParams = true;

const EXISTING_STATIC_SLUGS = new Set([
  "bathroom-tiles",
  "kitchen-tiles",
  "living-dining-room-tiles",
  "bedroom-tiles",
  "balcony-terrace-tiles",
  "elevation-exterior-tiles",
  "hotel-hospitality-tiles",
  "cafe-restaurant-tiles",
  "commercial-office-tiles",
  "spa-wellness-tiles",
  "swimming-pool-tiles",
  "outdoor-landscape-tiles",
  "living-room-tiles",
  "dining-room-tiles",
  "cafe-tiles",
  "restaurant-tiles",
  "commercial-tiles",
  "office-tiles",
  "elevation-tiles",
  "featured-wall-tiles",
  "hotel-tiles",
  "outdoor-tiles",
  "parking-tiles",
  "about",
  "applications",
  "architect-portal",
  "blogs",
  "calculator",
  "catalogue-maker",
  "collections",
  "compare",
  "contact",
  "dealer-portal",
  "disclaimer",
  "downloads",
  "inspiration",
  "privacy-policy",
  "product",
  "product-category",
  "products",
  "projects",
  "spaces",
  "visualiser",
  "wishlist",
]);

export async function generateStaticParams() {
  const params: { spaceSlug: string }[] = [];

  // 1. Dynamic Space Slugs
  const spaces = getStoredSpaces();
  spaces
    .filter((s) => !EXISTING_STATIC_SLUGS.has(s.slug))
    .forEach((s) => {
      params.push({ spaceSlug: s.slug });
    });

  // 2. All Filter Landing Slugs from NAVIGATION_FILTER_GROUPS
  NAVIGATION_FILTER_GROUPS.forEach((group) => {
    group.items.forEach((item) => {
      if (!EXISTING_STATIC_SLUGS.has(item.slug)) {
        params.push({ spaceSlug: item.slug });
      }
    });
  });

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { spaceSlug } = await params;
  if (EXISTING_STATIC_SLUGS.has(spaceSlug)) {
    return {};
  }

  // 1. Check if this slug matches a space
  const space = await getSpaceBySlug(spaceSlug);
  if (space) {
    return generateSpaceMetadata(spaceSlug);
  }

  // 2. Check if this slug matches a filter landing route
  const filterInfo = getFilterRouteInfo(spaceSlug);
  if (filterInfo && filterInfo.group.id !== "space") {
    const title = `${filterInfo.pageTitle} | Timex Ceramic`;
    const description = filterInfo.pageDescription;
    const canonical = filterInfo.canonicalUrl;
    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  }

  return {};
}

import { Suspense } from "react";

export default async function DynamicSpaceOrFilterPage({ params }: PageProps) {
  const { spaceSlug } = await params;
  if (EXISTING_STATIC_SLUGS.has(spaceSlug)) {
    notFound();
  }

  // 1. Check Space Route (e.g. featured-wall-tiles or dynamic spaces)
  const space = await getSpaceBySlug(spaceSlug);
  if (space) {
    const products = await getProductsForSpace(space);
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0]" />}>
        <SpaceTilesPage space={space} initialProducts={products} />
      </Suspense>
    );
  }

  // 2. Check Filter Route (Application, Material, Finish, Shape, Design, Color, Size, Origin)
  const filterInfo = getFilterRouteInfo(spaceSlug);
  if (filterInfo && filterInfo.group.id !== "space") {
    const allProducts = await getProducts();
    return (
      <div className="bg-[#F7F5F0] min-h-screen">
        <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0]" />}>
          <ProductListContainer
            initialProducts={allProducts}
            primaryFilterGroup={filterInfo.group.id}
            initialFilter={{
              key: filterInfo.item.filterKey,
              value: filterInfo.item.filterValue,
            }}
            pageTitle={filterInfo.pageTitle}
            pageDescription={filterInfo.pageDescription}
            pageEyebrow={filterInfo.pageEyebrow}
            basePath={`/${spaceSlug}`}
          />
        </Suspense>
      </div>
    );
  }

  // If neither space nor filter, return 404
  notFound();
}
