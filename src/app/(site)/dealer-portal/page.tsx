import type { Metadata } from "next";
import { DealerPortalClient } from "./DealerPortalClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/dealer-portal");
  return buildPageMetadata(seo);
}

export default function DealerPortalPage() {
  return <DealerPortalClient />;
}
