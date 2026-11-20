import type { Metadata } from "next";
import { ArchitectPortalClient } from "./ArchitectPortalClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/architect-portal");
  return buildPageMetadata(seo);
}

export default function ArchitectPortalPage() {
  return <ArchitectPortalClient />;
}
