import type { Metadata } from "next";
import { CalculatorClient } from "./CalculatorClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";
import { getProducts } from "@/services/product";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/calculator");
  return buildPageMetadata(seo);
}

export default async function CalculatorPage() {
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
    console.warn("Notice loading initial products for tile calculator:", err);
  }

  return <CalculatorClient initialProducts={initialProducts} />;
}
