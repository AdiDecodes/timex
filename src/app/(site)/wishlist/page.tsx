import type { Metadata } from "next";
import { WishlistClient } from "./WishlistClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/wishlist");
  return buildPageMetadata(seo);
}

export default function WishlistPage() {
  return <WishlistClient />;
}
