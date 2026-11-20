"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { resolveProductImage } from "@/utils/productImages";
import { CollectionHoverOverlay, resolveCollectionSpecs } from "./CollectionHoverOverlay";
import { TileOfSpainBadge } from "@/components/product/TileOfSpainBadge";

interface NewCollectionsProps {
  initialProducts?: any[];
}

function NewArrivalCard({
  product,
  priority = false,
}: {
  product: any;
  priority?: boolean;
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

  const rawImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : (product.thumbnail || product.image || "");

  const displayImage = resolveProductImage(
    rawImage,
    product.categoryId || product.category_id || product.category,
    0
  );

  // Existing description from product data
  const description =
    product.description ||
    product.short_description ||
    (product.look && product.finish
      ? `${product.look} • ${product.finish?.trim().toLowerCase() === "matte" ? "Matt" : product.finish}`
      : product.look || product.category_name || product.category || "");

  const specs = resolveCollectionSpecs(product);

  return (
    <Link
      ref={cardRef}
      href={`/product/${product.slug}`}
      onClick={handleCardClick}
      className="group flex flex-col bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] overflow-hidden hover:border-[#101B38]/30 hover:shadow-lg transition-all duration-300 h-full relative"
    >
      {/* 1. Large Top Image Area */}
      <div className="relative w-full aspect-[4/5] min-h-[260px] sm:min-h-[290px] lg:min-h-[310px] bg-[#EDEAE4]/40 overflow-hidden">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Visible NEW Tag Badge */}
        {Boolean(product.isNewArrival || product.is_new_arrival) && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="text-[9px] font-bold tracking-widest text-[#101b38] bg-[#FFFFFF] px-2.5 py-0.5 rounded-[2px] uppercase font-sans">
              NEW
            </span>
          </div>
        )}

        {/* Tile of Spain Badge */}
        {Boolean(product.showTileOfSpainBadge || product.show_tile_of_spain_badge) && (
          <TileOfSpainBadge size="md" />
        )}

        {/* Dark Blurred Image Overlay on Hover */}
        <CollectionHoverOverlay
          name={product.name}
          description={description}
          specs={specs}
          touchActive={touchActive}
        />
      </div>
    </Link>
  );
}

export function NewCollectionsCarouselSection({
  initialProducts = [],
}: NewCollectionsProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);

  const fetchNewArrivals = () => {
    fetch("/api/v1/products?_t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        const all = Array.isArray(data?.products)
          ? data.products
          : (Array.isArray(data) ? data : null);

        if (Array.isArray(all)) {
          const seen = new Set<string>();
          const filtered = all.filter((p: any) => {
            if (p.is_trashed || p.isTrashed) return false;
            if (
              p.isActive === false ||
              p.is_active === false ||
              p.status === "Inactive" ||
              p.status === "Draft"
            )
              return false;
            if (!Boolean(p.isNewArrival || p.is_new_arrival)) return false;
            const key = p.id || p.slug;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setProducts(filtered);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNewArrivals();

    const handleRefresh = () => fetchNewArrivals();
    window.addEventListener("product-updated", handleRefresh);
    window.addEventListener("storage", handleRefresh);
    return () => {
      window.removeEventListener("product-updated", handleRefresh);
      window.removeEventListener("storage", handleRefresh);
    };
  }, []);

  // Gracefully hide section if no products are marked New Arrival
  if (!loading && products.length === 0) {
    return null;
  }

  // Display up to the first 3 active New Arrival items
  const displayProducts = products.slice(0, 3);

  return (
    <section className="py-20 md:py-24 lg:py-28 relative z-10 bg-[#F7F5F0] border-b border-[#EDEAE4] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* LEFT SIDE (Desktop): Up to 3 New Arrival Cards */}
          <div className="order-2 lg:order-1 lg:col-span-8 xl:col-span-8">
            <div
              className={`grid grid-cols-1 ${
                displayProducts.length === 1
                  ? "sm:grid-cols-1 max-w-sm"
                  : displayProducts.length === 2
                  ? "sm:grid-cols-2 max-w-2xl"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              } gap-5 xl:gap-6 items-stretch`}
            >
              {(Array.isArray(displayProducts) ? displayProducts : []).map((product, idx) => (
                <Reveal
                  key={product.id || product.slug}
                  direction="up"
                  delay={idx * 0.1}
                  className="h-full"
                >
                  <NewArrivalCard product={product} priority={idx === 0} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE (Desktop): Editorial Text Block (Stacked on top for Mobile) */}
          <div className="order-1 lg:order-2 lg:col-span-4 xl:col-span-4 flex flex-col justify-center lg:pl-4 xl:pl-6">
            <Reveal direction="up">
              {/* Eyebrow with small horizontal divider line */}
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C95745] font-sans">
                  LATEST COLLECTIONS
                </span>
                <div className="h-[1px] w-12 sm:w-16 bg-[#333333]/25" />
              </div>
            </Reveal>

            {/* Editorial Heading */}
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] xl:text-[46px] font-normal text-[#101B38] tracking-tight leading-[1.15] mb-5 sm:mb-6">
                New Materials for New <br className="hidden sm:inline" />
                Design Ideas.
              </h2>
            </Reveal>

            {/* Editorial Description */}
            <Reveal direction="up" delay={0.15}>
              <p className="font-sans text-xs sm:text-sm text-[#333333]/75 font-normal leading-relaxed mb-6 sm:mb-8 max-w-md">
                Explore our newest tile collections, selected for architects and
                designers seeking distinctive textures, contemporary finishes
                and versatile surfaces for exceptional projects.
              </p>
            </Reveal>

            {/* CTA Button directly below description */}
            <Reveal direction="up" delay={0.2}>
              <div>
                <Link
                  href="/collections?filter=new-arrivals"
                  className="group text-xs font-semibold text-[#101B38] hover:text-[#C95745] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors font-sans pb-2 border-b border-[#EDEAE4] hover:border-[#C95745]"
                >
                  <span>EXPLORE ALL NEW COLLECTIONS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
