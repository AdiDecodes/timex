import { notFound } from "next/navigation";
import { getSpaceBySlug, getProductsForSpace, generateSpaceMetadata } from "@/services/spaces";
import { SpaceTilesPage } from "@/components/space/SpaceTilesPage";

export const revalidate = 10;

export async function generateMetadata() {
  return generateSpaceMetadata("cafe-restaurant-tiles");
}

export default async function CafeRestaurantTilesPage() {
  const space = await getSpaceBySlug("cafe-restaurant-tiles");
  if (!space) notFound();

  const products = await getProductsForSpace(space);

  return <SpaceTilesPage space={space} initialProducts={products} />;
}
