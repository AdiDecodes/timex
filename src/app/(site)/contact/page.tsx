import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/contact");
  return buildPageMetadata(seo);
}

export default function ContactPage() {
  return <ContactClient />;
}
