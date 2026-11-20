"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { STANDARD_PRODUCT_CATEGORIES, CategoryItem } from "@/services/categories";
import { CollectionHoverOverlay, resolveCollectionSpecs } from "./CollectionHoverOverlay";

interface FeaturedCard {
  id: string;
  slug?: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  link: string;
  size?: string;
  kgPerBox?: string | number;
  pcsPerBox?: string | number;
  specs?: any;
}

const DEFAULT_CATEGORY_TAGLINES: Record<string, string> = {
  "combo-series": "Striking patterns tailored for modern spaces.",
  brick: "Urban textures for timeless charm.",
  "lumina-series": "Where light sculpts the wall.",
  "vestige-series": "Where marble begins to soften.",
  marble: "Luxury that never goes out of style.",
  hexagon: "Geometric beauty in every detail.",
  modular: "Sleek. Versatile. Effortlessly modern.",
  stone: "Raw textures. Grounded elegance.",
  subway: "Classic lines for contemporary spaces.",
  moroccan: "Bold patterns. Timeless soul.",
  octagonal: "Vintage shapes. Modern appeal.",
  wooden: "The warmth of wood. The ease of tile.",
  texture: "Feel the surface. See the depth.",
  colorful: "Add life. Add personality.",
  terrazzo: "Retro vibes. Modern twist.",
  tropical: "Inspired by nature. Made for calm.",
  metallic: "Shine subtly. Stand out effortlessly.",
  highlighter: "Make a statement. Every single time.",
  mosaic: "Tiny tiles. Big impact.",
  boutique: "Unique designs for unique spaces.",
  "french-frames": "Timeless patterns. Effortless grace.",
  fabric: "Soft strokes. Strong presence.",
};

function FeaturedCollectionCard({
  card,
  priority = false,
  allProducts = [],
}: {
  card: FeaturedCard;
  priority?: boolean;
  allProducts?: any[];
}) {
  const [touchActive, setTouchActive] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!touchActive) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setTouchActive(false);
      }
    };
    document.addEventListener("click", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("click", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [touchActive]);

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // On touch devices (or screens without hover capability), reveal specs on first tap
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches && !touchActive) {
      e.preventDefault();
      setTouchActive(true);
    }
  };

  const specs = resolveCollectionSpecs(card, allProducts);
  const description = card.tagline || card.description || "";

  return (
    <Link
      ref={cardRef}
      href={card.link}
      onClick={handleCardClick}
      className="group flex flex-col bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] overflow-hidden hover:border-[#101B38]/30 hover:shadow-lg transition-all duration-300 h-full relative"
    >
      {/* 1. Large Top Image Area */}
      <div className="relative w-full aspect-[4/5] min-h-[260px] sm:min-h-[290px] lg:min-h-[310px] bg-[#EDEAE4]/40 overflow-hidden">
        <Image
          src={card.image}
          alt={card.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Dark Blurred Image Overlay on Hover */}
        <CollectionHoverOverlay
          name={card.name}
          description={description}
          specs={specs}
          touchActive={touchActive}
        />
      </div>
    </Link>
  );
}

interface FeaturedCollectionsCarouselSectionProps {
  initialCategories?: CategoryItem[];
  initialProducts?: any[];
}

export function FeaturedCollectionsCarouselSection({
  initialCategories = [],
  initialProducts = [],
}: FeaturedCollectionsCarouselSectionProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    if (initialCategories && initialCategories.length > 0) return initialCategories;
    return STANDARD_PRODUCT_CATEGORIES;
  });
  const [products, setProducts] = useState<any[]>(initialProducts);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveCategories() {
      try {
        const res = await fetch(`/api/v1/taxonomies/categories?status=published&_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.categories) && data.categories.length > 0 && isMounted) {
            const published = data.categories.filter((c: any) => c.status !== "draft");
            setCategories(published);
          }
        }
      } catch (e) {
        console.warn("Failed to rehydrate live categories:", e);
      }
    }

    async function loadLiveProducts() {
      try {
        const res = await fetch(`/api/v1/products?_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data?.products)
            ? data.products
            : Array.isArray(data)
            ? data
            : [];
          if (list.length > 0 && isMounted) {
            setProducts(list);
          }
        }
      } catch (e) {
        console.warn("Failed to rehydrate live products for categories:", e);
      }
    }

    loadLiveCategories();
    if (initialProducts.length === 0) {
      loadLiveProducts();
    }

    const handleTaxonomyUpdate = () => loadLiveCategories();
    const handleProductUpdate = () => loadLiveProducts();

    window.addEventListener("timex-taxonomy-updated", handleTaxonomyUpdate);
    window.addEventListener("product-updated", handleProductUpdate);
    window.addEventListener("storage", handleProductUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("timex-taxonomy-updated", handleTaxonomyUpdate);
      window.removeEventListener("product-updated", handleProductUpdate);
      window.removeEventListener("storage", handleProductUpdate);
    };
  }, [initialProducts.length]);

  // Featured collection cards: Combo Series, Lumina Series, Vestige Series
  const comboProd = products.find(
    (p) =>
      p.slug === "combo-series" ||
      p.id === "prod-1793691029424-d048fc" ||
      String(p.name || "").toLowerCase() === "combo series"
  );

  const comboCard: FeaturedCard = {
    id: comboProd?.id || "prod-1793691029424-d048fc",
    slug: "combo-series",
    name: comboProd?.name || "Combo Series",
    size:
      comboProd?.size ||
      (Array.isArray(comboProd?.availableSizes) ? comboProd.availableSizes[0] : "240mm x 740mm"),
    kgPerBox: comboProd?.kgPerBox || comboProd?.kg_per_box || "20",
    pcsPerBox: comboProd?.pcsPerBox || comboProd?.pcs_per_box || "7",
    specs: comboProd?.specs,
    tagline: "Striking patterns tailored for modern spaces.",
    description: "Striking patterns tailored for modern spaces.",
    image:
      (Array.isArray(comboProd?.images) && comboProd?.images[0]) ||
      comboProd?.image ||
      "/uploads/products/Combo-Burdeos-AMB.webp",
    link: "/product/combo-series",
  };

  const luminaProd = products.find(
    (p) =>
      p.slug === "lumina-series" ||
      p.id === "prod-1792413081668-ee740e" ||
      String(p.name || "").toLowerCase() === "lumina series"
  );

  const luminaCard: FeaturedCard = {
    id: luminaProd?.id || "prod-1792413081668-ee740e",
    slug: "lumina-series",
    name: luminaProd?.name || "Lumina Series",
    size:
      luminaProd?.size ||
      (Array.isArray(luminaProd?.availableSizes) ? luminaProd.availableSizes[0] : "60mm x 246mm"),
    kgPerBox: luminaProd?.kgPerBox || luminaProd?.kg_per_box || "7/8",
    pcsPerBox: luminaProd?.pcsPerBox || luminaProd?.pcs_per_box || "34/30",
    specs: luminaProd?.specs,
    tagline:
      DEFAULT_CATEGORY_TAGLINES["lumina-series"] ||
      luminaProd?.description?.split("\n")[0]?.trim() ||
      "Where light sculpts the wall.",
    description: luminaProd?.description || "Where light sculpts the wall.",
    image:
      (Array.isArray(luminaProd?.images) && luminaProd?.images[0]) ||
      luminaProd?.image ||
      "/uploads/products/lumina-6174_result.webp",
    link: "/product/lumina-series",
  };

  const vestigeProd = products.find(
    (p) =>
      p.slug === "vestige-series" ||
      p.id === "prod-1792744711222-58fc97" ||
      String(p.name || "").toLowerCase() === "vestige series"
  );

  const vestigeCard: FeaturedCard = {
    id: vestigeProd?.id || "prod-1792744711222-58fc97",
    slug: "vestige-series",
    name: vestigeProd?.name || "Vestige Series",
    size:
      vestigeProd?.size ||
      (Array.isArray(vestigeProd?.availableSizes) ? vestigeProd.availableSizes[0] : "55mm x 220mm"),
    kgPerBox: vestigeProd?.kgPerBox || vestigeProd?.kg_per_box || "8",
    pcsPerBox: vestigeProd?.pcsPerBox || vestigeProd?.pcs_per_box || "34",
    specs: vestigeProd?.specs,
    tagline:
      DEFAULT_CATEGORY_TAGLINES["vestige-series"] ||
      vestigeProd?.description?.split("\n")[0]?.trim() ||
      "Where marble begins to soften.",
    description: vestigeProd?.description || "Where marble begins to soften.",
    image:
      (Array.isArray(vestigeProd?.images) && vestigeProd?.images[0]) ||
      vestigeProd?.image ||
      "/uploads/products/Vestige-Brescia-AMB-2.webp",
    link: "/product/vestige-series",
  };

  const featuredCards: FeaturedCard[] = [comboCard, luminaCard, vestigeCard];

  return (
    <section className="py-20 md:py-24 lg:py-28 relative z-10 bg-[#EDEAE4] border-t border-[#E2DED6] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* LEFT: Editorial Content Block (~30-32%) */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center">
            <Reveal direction="up">
              {/* Eyebrow with subtle horizontal divider line */}
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C95745] font-sans">
                  FEATURED COLLECTION
                </span>
                <div className="h-[1px] w-12 sm:w-16 bg-[#333333]/25" />
              </div>
            </Reveal>

            {/* Editorial Heading */}
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] xl:text-[46px] font-normal text-[#101B38] tracking-tight leading-[1.15] mb-5 sm:mb-6">
                Artistry in Every Detail. <br className="hidden sm:inline" />
                Sourced for Distinction.
              </h2>
            </Reveal>

            {/* Editorial Description */}
            <Reveal direction="up" delay={0.15}>
              <p className="font-sans text-xs sm:text-sm text-[#333333]/75 font-normal leading-relaxed mb-6 sm:mb-8 max-w-md">
                Discover handcrafted and premium-grade tile collections
                designed to bring depth, character, and luxury to modern
                interiors.
              </p>
            </Reveal>

            {/* CTA Button directly below description */}
            <Reveal direction="up" delay={0.2}>
              <div>
                <Link
                  href="/collections?filter=featured"
                  className="group text-xs font-semibold text-[#101B38] hover:text-[#C95745] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors font-sans pb-2 border-b border-[#D8D3C8] hover:border-[#C95745]"
                >
                  <span>EXPLORE ALL COLLECTIONS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: 3 Featured Collection Cards (~68-70%) */}
          <div className="lg:col-span-8 xl:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6 items-stretch">
              {featuredCards.map((card, idx) => (
                <Reveal
                  key={card.id}
                  direction="up"
                  delay={idx * 0.1}
                  className="h-full"
                >
                  <FeaturedCollectionCard
                    card={card}
                    priority={idx === 0}
                    allProducts={products}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
