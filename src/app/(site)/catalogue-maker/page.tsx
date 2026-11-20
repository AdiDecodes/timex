import type { Metadata } from "next";
import { CatalogueMakerClient } from "./CatalogueMakerClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";
import { getProducts } from "@/services/product";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/catalogue-maker");
  return buildPageMetadata(seo);
}

export default async function CatalogueMakerPage() {
  let initialProducts: any[] = [];
  try {
    const raw = await getProducts({ includeInactive: false });
    if (Array.isArray(raw)) {
      initialProducts = raw.filter(
        (p) =>
          p &&
          !p.is_trashed &&
          !p.isTrashed &&
          p.isActive !== false &&
          p.is_active !== false &&
          p.status !== "Inactive"
      );
    }
  } catch (err) {
    console.warn("Notice loading initial products for catalogue maker:", err);
  }

  return <CatalogueMakerClient initialProducts={initialProducts} />;
}
