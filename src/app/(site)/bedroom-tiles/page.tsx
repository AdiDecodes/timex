import { notFound } from "next/navigation";
import { getSpaceBySlug, getProductsForSpace, generateSpaceMetadata } from "@/services/spaces";
import { SpaceTilesPage } from "@/components/space/SpaceTilesPage";

export const dynamic = "force-static";

export async function generateMetadata() {
  return generateSpaceMetadata("bedroom-tiles");
}

export default async function BedroomTilesPage() {
  const space = await getSpaceBySlug("bedroom-tiles");
  if (!space) notFound();

  const products = await getProductsForSpace(space);

  return <SpaceTilesPage space={space} initialProducts={products} />;
}
