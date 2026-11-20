import type { Metadata } from "next";
import { DownloadsClient } from "./DownloadsClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/downloads");
  return buildPageMetadata(seo);
}

export default function DownloadsPage() {
  return <DownloadsClient />;
}
