import { notFound } from "next/navigation";
import { getSpaceBySlug, getProductsForSpace, generateSpaceMetadata } from "@/services/spaces";
import { SpaceTilesPage } from "@/components/space/SpaceTilesPage";

export const dynamic = "force-static";

export async function generateMetadata() {
  return generateSpaceMetadata("spa-wellness-tiles");
}

export default async function SpaWellnessTilesPage() {
  const space = await getSpaceBySlug("spa-wellness-tiles");
  if (!space) notFound();

  const products = await getProductsForSpace(space);

  return <SpaceTilesPage space={space} initialProducts={products} />;
}
