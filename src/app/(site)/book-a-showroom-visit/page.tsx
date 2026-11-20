import type { Metadata } from "next";
import { BookShowroomVisitClient } from "./BookShowroomVisitClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/book-a-showroom-visit");
  return buildPageMetadata({
    ...seo,
    title:
      seo.title || "Book a Showroom Visit | Timex Ceramic Mumbai Experience Centre",
    description:
      seo.description ||
      "Plan your visit to Timex Ceramic Mumbai showroom. Experience the world of designer tiles, imported collections, and personalized assistance from tile experts.",
    canonicalUrl:
      seo.canonicalUrl || "https://www.timexceramic.com/book-a-showroom-visit",
  });
}

export default function BookShowroomVisitPage() {
  return <BookShowroomVisitClient />;
}
