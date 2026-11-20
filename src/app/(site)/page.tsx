import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { TrustCredibilitySection } from "@/components/home/TrustCredibilitySection";
import { NewCollectionsCarouselSection } from "@/components/home/NewCollectionsCarouselSection";
import { FeaturedCollectionsCarouselSection } from "@/components/home/FeaturedCollectionsCarouselSection";
import { TilesBySpacesSection } from "@/components/home/TilesBySpacesSection";
import { AllCollectionsGridSection } from "@/components/home/AllCollectionsGridSection";
import { WhyTimexSection } from "@/components/home/WhyTimexSection";
import { VideoGallerySection } from "@/components/home/VideoGallerySection";
import { InspirationGallerySection } from "@/components/home/InspirationGallerySection";
import { BlogJournalSection } from "@/components/home/BlogJournalSection";
import { InspirationVideoSection } from "@/components/home/InspirationVideoSection";
import { StickyVerticalCta } from "@/components/home/StickyVerticalCta";

import { Metadata } from "next";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";
import { getProducts } from "@/services/product";
import { getPublishedCategories } from "@/services/categories";

export const dynamic = "auto";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/");
  return buildPageMetadata(seo);
}

export default async function HomePage() {
  const allProducts = await getProducts({ includeInactive: false });
  const publishedCategories = getPublishedCategories();

  const seenNew = new Set<string>();
  const initialNewArrivals = allProducts.filter((p: any) => {
    if (p.is_trashed || p.isTrashed) return false;
    if (p.isActive === false || p.is_active === false || p.status === "Inactive" || p.status === "Draft") return false;
    if (!Boolean(p.isNewArrival || p.is_new_arrival)) return false;
    const key = p.id || p.slug;
    if (seenNew.has(key)) return false;
    seenNew.add(key);
    return true;
  });

  return (
    <div className="relative w-full bg-[#F7F5F0] overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute w-[600px] h-[600px] top-[15%] -left-[10%] rounded-full bg-[#EDEAE4] blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute w-[800px] h-[800px] top-[45%] -right-[15%] rounded-full bg-[#EDEAE4] blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bottom-[10%] -left-[10%] rounded-full bg-[#EDEAE4] blur-3xl opacity-40 pointer-events-none" />

      {/* 1. HERO */}
      <HomeHeroSection />

      {/* 2. TRUST. EXPERIENCE. EXCELLENCE. */}
      <TrustCredibilitySection />

      {/* 3. LATEST COLLECTIONS (New Arrivals) */}
      <NewCollectionsCarouselSection initialProducts={initialNewArrivals} />

      {/* 4. FEATURED COLLECTION */}
      <FeaturedCollectionsCarouselSection
        initialCategories={publishedCategories}
        initialProducts={allProducts}
      />

      {/* 5. TILES BY SPACE */}
      <TilesBySpacesSection />

      {/* 6. WORLD OF TILES / ALL COLLECTIONS */}
      <AllCollectionsGridSection />

      {/* 7. WHY DESIGNERS CHOOSE TIMEX CERAMIC */}
      <WhyTimexSection />

      {/* 8. TILE TALK / DESIGN & EXPERT INSIGHTS */}
      <VideoGallerySection />

      {/* 9. INSPIRATION GALLERY */}
      <InspirationGallerySection />

      {/* 10. TILE TALK | DESIGN & EXPERT INSIGHTS */}
      <InspirationVideoSection />

      {/* 11. DESIGN JOURNAL */}
      <BlogJournalSection />

      {/* Sticky Right-Side Call-To-Action Panel */}
      <StickyVerticalCta />
    </div>
  );
}
