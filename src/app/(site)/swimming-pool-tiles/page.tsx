import { notFound } from "next/navigation";
import { getSpaceBySlug, getProductsForSpace, generateSpaceMetadata } from "@/services/spaces";
import { SpaceTilesPage } from "@/components/space/SpaceTilesPage";

export const dynamic = "force-static";

export async function generateMetadata() {
  return generateSpaceMetadata("swimming-pool-tiles");
}

export default async function SwimmingPoolTilesPage() {
  const space = await getSpaceBySlug("swimming-pool-tiles");
  if (!space) notFound();

  const products = await getProductsForSpace(space);

  return <SpaceTilesPage space={space} initialProducts={products} />;
}
