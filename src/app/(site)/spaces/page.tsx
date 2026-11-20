import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowRight, ChevronRight, Home, Sparkles } from "lucide-react";
import { getStoredSpaces, getProductsForSpace } from "@/services/spaces";
import { SpaceItem } from "@/types/spaces";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export const dynamic = "auto";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/spaces");
  return buildPageMetadata(seo);
}

export default async function SpacesLandingPage() {
  const allSpaces = getStoredSpaces({ includeDrafts: false }).filter(
    (s) => !s.name.toLowerCase().includes("rooftop")
  );

  // Compute product counts in parallel
  const spacesWithCounts: (SpaceItem & { productCount: number })[] = await Promise.all(
    allSpaces.map(async (sp) => {
      try {
        const prods = await getProductsForSpace(sp);
        return {
          ...sp,
          productCount: prods.length,
        };
      } catch (e) {
        return {
          ...sp,
          productCount: 0,
        };
      }
    })
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.timexceramic.com",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Spaces",
            "item": "https://www.timexceramic.com/spaces",
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": "https://www.timexceramic.com/spaces#webpage",
        "url": "https://www.timexceramic.com/spaces",
        "name": "Tiles by Space & Area | Timex Ceramic",
        "description":
          "Discover luxury ceramic and vitrified porcelain surfaces engineered for residential, commercial, and outdoor spaces.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.timexceramic.com/#website",
          "name": "Timex Ceramic",
          "url": "https://www.timexceramic.com",
        },
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": spacesWithCounts.map((sp, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": sp.name,
            "url": `https://www.timexceramic.com/${sp.slug}`,
            "image": sp.image,
          })),
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] relative overflow-hidden">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="py-16 md:py-24 relative z-10 bg-[#EDEAE4] border-b border-[#DED9D0]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center space-x-2 text-xs text-[#333333]/70 pb-2"
          >
            <Link
              href="/"
              className="hover:text-[#C95745] transition-colors flex items-center space-x-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#333333]/40" />
            <span className="text-[#101B38] font-semibold">Spaces</span>
          </nav>

          <span className="text-[10px] tracking-[0.3em] text-[#C95745] font-semibold uppercase block">
            EXPLORE TILES BY SPACE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#101B38] leading-tight tracking-tight">
            Tiles Designed for Every Architectural Space
          </h1>
          <div className="w-16 h-[2px] bg-[#C95745] mx-auto my-3" />
          <p className="text-xs sm:text-sm md:text-base text-[#333333]/80 font-normal max-w-2xl mx-auto leading-relaxed">
            From expansive living room floors to statement feature walls and resilient exterior terraces, discover luxury imported porcelain surfaces curated for every area.
          </p>
        </div>
      </section>

      {/* Main Spaces Showcase Grid */}
      <section className="py-16 md:py-20 max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EDEAE4] gap-4">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.25em] text-[#C95745] font-semibold uppercase block">
              SPATIAL ARCHITECTURE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#101B38] tracking-tight">
              All Architectural Spaces ({spacesWithCounts.length})
            </h2>
          </div>
          <p className="text-xs text-[#555555] font-sans">
            Select a space below to view targeted porcelain tiles, surface finishes, and spatial ambiences.
          </p>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {spacesWithCounts.map((space, idx) => {
            const directUrl = `/${space.slug}`;
            return (
              <Reveal key={space.id || space.slug} direction="up" delay={(idx % 4) * 0.05}>
                <Link href={directUrl} className="block group h-full">
                  <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden bg-[#101B38] border border-[#EDEAE4] shadow-xs hover:shadow-xl transition-all duration-400 transform group-hover:-translate-y-1 flex flex-col justify-end">
                    {/* Background Space Image */}
                    <Image
                      src={
                        space.image ||
                        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={space.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={idx < 4}
                    />

                    {/* Dark Gradient Overlay for Crisp Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101B38]/95 via-[#101B38]/40 to-transparent transition-opacity duration-300 opacity-85 group-hover:opacity-95" />

                    {/* Top Badge: Designs Count */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[9px] bg-[#101B38]/80 backdrop-blur-xs text-[#FCFBF8] font-medium uppercase tracking-widest px-2.5 py-1 rounded-[2px] border border-white/10">
                        {space.productCount > 0 ? `${space.productCount} Designs` : "Curated Surfaces"}
                      </span>
                    </div>

                    {/* Bottom Text & Action CTA */}
                    <div className="relative p-5 z-10 flex items-end justify-between gap-3">
                      <div className="space-y-1 text-[#FCFBF8]">
                        <h3 className="font-serif text-lg md:text-xl font-normal tracking-wide text-[#FCFBF8] leading-tight">
                          {space.name}
                        </h3>
                        <p className="font-sans text-[11px] text-[#EDEAE4]/80 font-normal leading-snug line-clamp-2">
                          {space.description}
                        </p>
                      </div>

                      {/* Arrow CTA Button */}
                      <div className="w-8 h-8 rounded-[2px] bg-[#FCFBF8] text-[#101B38] flex items-center justify-center shadow-xs transition-all duration-300 shrink-0 group-hover:bg-[#C95745] group-hover:text-[#FCFBF8]">
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
