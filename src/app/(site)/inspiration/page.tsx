import type { Metadata } from "next";
import { InspirationClient } from "./InspirationClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/inspiration");
  return buildPageMetadata({
    ...seo,
    title:
      seo.title || "Tile Inspiration – Ideas to Transform Your Spaces | Timex Ceramic",
    description:
      seo.description ||
      "Explore a world of designer tile inspiration with Timex Ceramic. Creative wall and floor tile ideas, contemporary patterns, sophisticated finishes and distinctive surface designs for bathrooms, kitchens, living rooms and outdoor spaces.",
    canonicalUrl: seo.canonicalUrl || "https://www.timexceramic.com/inspiration",
  });
}

export default function InspirationPage() {
  return <InspirationClient />;
}
