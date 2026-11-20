"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SpaceItem } from "@/types/spaces";
import { ProductListContainer } from "@/components/product/ProductListContainer";
import { matchesProductSpace } from "@/services/spaces";
import { normalizeImageUrl } from "@/utils/imageUrl";

interface SpaceTilesPageProps {
  space: SpaceItem;
  initialProducts: any[];
}

const DEFAULT_SPACE_IMAGES: Record<string, string> = {
  "bathroom-tiles": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
  "kitchen-tiles": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80",
  "living-dining-room-tiles": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
  "bedroom-tiles": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
  "balcony-terrace-tiles": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
  "elevation-exterior-tiles": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  "hotel-hospitality-tiles": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
  "cafe-restaurant-tiles": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
  "commercial-office-tiles": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
  "spa-wellness-tiles": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
  "swimming-pool-tiles": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=80",
  "outdoor-landscape-tiles": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
};

export function SpaceTilesPage({ space, initialProducts }: SpaceTilesPageProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [spaceData, setSpaceData] = useState<SpaceItem>(space);

  const fallbackImage =
    DEFAULT_SPACE_IMAGES[space.slug] ||
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80";

  const [imgSrc, setImgSrc] = useState<string>(normalizeImageUrl(space.image) || fallbackImage);

  // Live database rehydration: fetch fresh space details and products
  useEffect(() => {
    // 1. Fetch space details to get latest admin-selected hero image
    fetch(`/api/v1/spaces/${space.slug}?_t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch space");
        return res.json();
      })
      .then((data) => {
        if (data.space) {
          setSpaceData(data.space);
          if (data.space.image) {
            setImgSrc(normalizeImageUrl(data.space.image));
          }
        }
      })
      .catch(() => {});

    // 2. Fetch products matching this space
    fetch(`/api/v1/spaces/${space.slug}/products?_t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch space products");
        return res.json();
      })
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
        if (data.space) {
          setSpaceData((prev) => ({ ...prev, ...data.space }));
          if (data.space.image) {
            setImgSrc(data.space.image);
          }
        }
      })
      .catch(() => {
        // Fallback query general products
        fetch(`/api/v1/products?_t=${Date.now()}`)
          .then((res) => res.json())
          .then((pData) => {
            const all = Array.isArray(pData.products) ? pData.products : (Array.isArray(pData) ? pData : []);
            const matched = all.filter((p: any) => !p.is_trashed && p.isActive !== false && matchesProductSpace(p, space.name));
            if (matched.length > 0) {
              setProducts(matched);
            }
          })
          .catch(() => {});
      });
  }, [space.slug, space.name]);

  const activeSpace = spaceData || space;
  const currentImage = normalizeImageUrl(imgSrc || activeSpace.image) || fallbackImage;

  // Structured Data Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: activeSpace.seoTitle || `${activeSpace.name} | Luxury Ceramic & Porcelain Tiles | Timex Ceramic`,
    description: activeSpace.metaDescription || activeSpace.description,
    url: `https://timexceramic.com/${activeSpace.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((prod, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `https://timexceramic.com/product/${prod.slug}`,
        name: prod.name,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ========================================================================= */}
      {/* 1. HERO BANNER SECTION — FULL-WIDTH DYNAMIC BACKGROUND & DARK NAVY TINT   */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[50vh] min-h-[440px] md:min-h-[480px] lg:min-h-[520px] overflow-hidden flex items-center justify-center bg-[#101B38] text-white select-none">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0">
          <Image
            src={currentImage}
            alt={activeSpace.name}
            fill
            priority
            unoptimized
            className="object-cover object-center transition-opacity duration-700"
            sizes="100vw"
            onError={() => {
              if (imgSrc !== fallbackImage) {
                setImgSrc(fallbackImage);
              }
            }}
          />
        </div>

        {/* Dark Navy Overlay matching reference screenshot */}
        <div className="absolute inset-0 bg-[#0C1427]/75 sm:bg-[#0C1427]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101B38] via-[#0C1427]/50 to-[#101B38]/80 pointer-events-none" />

        {/* Centered Hero Content matching reference screenshot */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6 sm:space-y-8">
          {/* Eyebrow: ← TILES BY SPACE */}
          <div>
            <Link
              href="/products?primaryGroup=space"
              className="inline-flex items-center space-x-2 text-[11px] sm:text-xs uppercase font-semibold tracking-[0.25em] text-[#C95745] hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>TILES BY SPACE</span>
            </Link>
          </div>

          {/* Main Heading: Dynamic Space Name */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal tracking-tight text-white leading-tight">
            {activeSpace.name}
          </h1>

          {/* Trust Indicators (3 Columns, Centered with Dividers) */}
          <div className="flex items-center justify-center gap-6 sm:gap-12 md:gap-16 pt-2">
            {/* 1. Designs Available */}
            <div className="text-center">
              <span className="block font-serif text-2xl sm:text-3xl font-normal text-[#C95745]">
                {Math.max(products.length, 1)}+
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#EDEAE4]/80 font-medium mt-1 block">
                DESIGNS AVAILABLE
              </span>
            </div>

            <div className="w-[1px] h-9 bg-white/20" />

            {/* 2. Grade Quality */}
            <div className="text-center">
              <span className="block font-serif text-2xl sm:text-3xl font-normal text-white">
                Imported
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#EDEAE4]/80 font-medium mt-1 block">
                GRADE QUALITY
              </span>
            </div>

            <div className="w-[1px] h-9 bg-white/20" />

            {/* 3. Space Curation */}
            <div className="text-center">
              <span className="block font-serif text-2xl sm:text-3xl font-normal text-[#C95745]">
                Exclusive
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#EDEAE4]/80 font-medium mt-1 block">
                SPACE CURATION
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CENTRAL PRODUCT LISTING WITH SPACE-FIRST FILTERING (Req 7, 14, 15)       */}
      {/* ========================================================================= */}
      <ProductListContainer
        initialProducts={products}
        primaryFilterGroup="space"
        initialFilter={{ key: "space", value: activeSpace.name }}
        pageTitle={`Curated Designs for ${activeSpace.name}`}
        pageDescription={activeSpace.description || `Explore our exclusive selection of ${activeSpace.name.toLowerCase()} curated for luxury architectural spaces.`}
        pageEyebrow="SPACE CURATION"
        basePath={`/${activeSpace.slug}`}
      />

      {/* ========================================================================= */}
      {/* 3. DESIGN CONSULTATION CALLOUT                                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
        <div className="bg-[#101B38] rounded-[2px] p-8 sm:p-12 text-[#FCFBF8] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-md">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <span className="text-xs font-semibold text-[#C95745] tracking-widest uppercase">
              Architectural Advisory
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-normal text-[#FCFBF8]">
              Planning a Project with {activeSpace.name}?
            </h3>
            <p className="text-sm text-[#EDEAE4]/80 leading-relaxed font-light">
              Our technical ceramic specialists assist architects, builders, and interior designers with customized sizing, slip-resistance certifications, and bulk sample kits.
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#FCFBF8] hover:text-[#C95745] pb-2 border-b border-[#EDEAE4]/35 hover:border-[#C95745] tracking-wider uppercase transition-colors font-sans"
            >
              <span>Consult Our Experts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
