import { notFound } from "next/navigation";
import { getSpaceBySlug, getProductsForSpace, generateSpaceMetadata } from "@/services/spaces";
import { SpaceTilesPage } from "@/components/space/SpaceTilesPage";

export const dynamic = "force-static";

export async function generateMetadata() {
  return generateSpaceMetadata("commercial-office-tiles");
}

export default async function CommercialOfficeTilesPage() {
  const space = await getSpaceBySlug("commercial-office-tiles");
  if (!space) notFound();

  const products = await getProductsForSpace(space);

  return <SpaceTilesPage space={space} initialProducts={products} />;
}
