import { notFound } from "next/navigation";
import { getSpaceBySlug, getProductsForSpace, generateSpaceMetadata } from "@/services/spaces";
import { Suspense } from "react";
import { SpaceTilesPage } from "@/components/space/SpaceTilesPage";

export const revalidate = 10;

export async function generateMetadata() {
  return generateSpaceMetadata("balcony-terrace-tiles");
}

export default async function BalconyTerraceTilesPage() {
  const space = await getSpaceBySlug("balcony-terrace-tiles");
  if (!space) notFound();

  const products = await getProductsForSpace(space);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0]" />}>
      <SpaceTilesPage space={space} initialProducts={products} />
    </Suspense>
  );
}
