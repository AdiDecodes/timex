import { notFound } from "next/navigation";
import { getSpaceBySlug, getProductsForSpace, generateSpaceMetadata } from "@/services/spaces";
import { SpaceTilesPage } from "@/components/space/SpaceTilesPage";

export const revalidate = 10;

export async function generateMetadata() {
  return generateSpaceMetadata("elevation-exterior-tiles");
}

export default async function ElevationExteriorTilesPage() {
  const space = await getSpaceBySlug("elevation-exterior-tiles");
  if (!space) notFound();

  const products = await getProductsForSpace(space);

  return <SpaceTilesPage space={space} initialProducts={products} />;
}
