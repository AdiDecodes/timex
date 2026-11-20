"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Reveal } from "@/components/animations/Reveal";
import { STANDARD_PRODUCT_CATEGORIES, CategoryItem } from "@/services/categories";
import { useTileExpertModal } from "@/store/useTileExpertModal";

const DEFAULT_CATEGORY_TAGLINES: Record<string, string> = {
  brick: "Urban textures for timeless charm.",
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

interface CollectionGridItem {
  id: string;
  name: string;
  tagline: string;
  image: string;
  link: string;
}

function CollectionGridCard({
  collection,
  idx,
}: {
  collection: CollectionGridItem;
  idx: number;
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
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches &&
      !touchActive
    ) {
      e.preventDefault();
      setTouchActive(true);
    }
  };

  return (
    <Reveal direction="up" delay={(idx % 4) * 0.04}>
      <Link
        ref={cardRef}
        href={collection.link}
        onClick={handleCardClick}
        className="block group"
      >
        <div className="relative aspect-[4/3] rounded-[2px] overflow-hidden bg-[#101B38] border border-[#EDEAE4] shadow-xs hover:shadow-lg transition-shadow duration-350 ease-out">
          {/* Background Image */}
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-500 ease-out ${
              touchActive ? "scale-105" : "group-hover:scale-105"
            }`}
            priority={idx < 4}
          />

          {/* Dark Bottom Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-350 ease-out ${
              touchActive
                ? "opacity-95"
                : "opacity-85 group-hover:opacity-95"
            }`}
          />

          {/* Bottom Info & Action Arrow */}
          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end z-10">
            <h3 className="font-serif text-base md:text-lg font-normal tracking-wide text-[#FCFBF8] uppercase leading-tight transition-transform duration-350 ease-out">
              {collection.name}
            </h3>

            {/* Smoothly Revealed Description & Arrow Icon on Hover / Tap */}
            <div
              className={`grid transition-all duration-350 ease-out ${
                touchActive
                  ? "grid-rows-[1fr] opacity-100 translate-y-0 pt-2"
                  : "grid-rows-[0fr] opacity-0 translate-y-3 pt-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:translate-y-0 group-hover:pt-2"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex items-end justify-between gap-2">
                  <p className="font-sans text-[11px] text-[#EDEAE4]/80 font-normal leading-snug line-clamp-2 pr-2">
                    {collection.tagline}
                  </p>

                  {/* Arrow Icon Button */}
                  <div className="w-8 h-8 rounded-[2px] bg-[#F7F5F0] text-[#000000] flex items-center justify-center shadow-xs transition-all duration-350 ease-out flex-shrink-0">
                    <ArrowRight
                      className={`w-3.5 h-3.5 text-[#000000] transform transition-transform duration-350 ease-out ${
                        touchActive
                          ? "translate-x-0.5"
                          : "group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function AllCollectionsGridSection() {
  const [categories, setCategories] = useState<CategoryItem[]>(STANDARD_PRODUCT_CATEGORIES);
  const openTileExpertModal = useTileExpertModal((state) => state.openModal);
  const headerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [viewportMode, setViewportMode] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const checkViewport = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setViewportMode("mobile");
      } else if (w < 1024) {
        setViewportMode("tablet");
      } else {
        setViewportMode("desktop");
      }
    };
    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start 0.88", "start 0.12"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.45,
    restDelta: 0.001,
  });

  const imageX = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion || viewportMode === "mobile"
      ? ["0%", "0%"]
      : viewportMode === "tablet"
        ? ["-12%", "0%"]
        : ["-24%", "0%"]
  );
  const innerImageScale = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1.06, 1]
  );
  const innerImageX = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion || viewportMode === "mobile" ? ["0%", "0%"] : ["-3%", "0%"]
  );

  useEffect(() => {
    let isMounted = true;
    async function loadLiveCategories() {
      try {
        const res = await fetch(`/api/v1/taxonomies/categories?status=published&_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            const published = data.categories.filter((c: any) => c.status !== "draft");
            if (isMounted) {
              setCategories(published);
            }
          }
        }
      } catch (e) {
        console.warn("Failed to rehydrate live categories:", e);
      }
    }

    loadLiveCategories();

    const handleUpdate = () => loadLiveCategories();
    window.addEventListener("timex-taxonomy-updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("timex-taxonomy-updated", handleUpdate);
    };
  }, []);

  const items: CollectionGridItem[] = categories.map((cat) => ({
    id: cat.id || cat.slug,
    name: cat.name.toUpperCase(),
    tagline:
      cat.description ||
      cat.metaDescription ||
      DEFAULT_CATEGORY_TAGLINES[cat.slug] ||
      "Distinctive architectural tile surfaces.",
    image:
      cat.banner ||
      cat.ogImage ||
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    link: `/product-category/${cat.slug}`,
  }));

  return (
    <>
      <section className="pt-10 md:pt-14 lg:pt-12 pb-12 md:pb-16 lg:pb-20 relative z-10 bg-[#F7F5F0] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          
          {/* Asymmetric 40/60 Equal-Height Two-Column Showcase */}
          <div
            ref={headerRef}
            className="relative flex flex-col md:flex-row md:items-stretch justify-between gap-8 md:gap-8 lg:gap-10 pb-8 md:pb-10 mb-10 md:mb-14 border-b border-[#EDEAE4]"
          >
            {/* Left Column (60% on desktop) */}
            <div className="w-full md:w-[56%] lg:w-[60%] relative z-10 flex md:min-h-[360px] lg:min-h-[420px]">
              <motion.div
                style={{
                  x: imageX,
                }}
                className="relative w-full h-[280px] sm:h-[340px] md:h-full rounded-[2px] overflow-hidden border border-[#DED9D0] shadow-xl bg-[#EDEAE4] will-change-transform"
              >
                <motion.div
                  style={{
                    scale: innerImageScale,
                    x: innerImageX,
                  }}
                  className="relative w-full h-full will-change-transform"
                >
                  <Image
                    src="/uploads/products/Belle-Beige-AMB.webp"
                    alt="Discover Premium Imported Ceramic & Porcelain Tiles"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 56vw, 60vw"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column (40% on desktop) */}
            <div className="w-full md:w-[44%] lg:w-[40%] flex-shrink-0 relative z-20 flex flex-col justify-center space-y-3.5 bg-[#F7F5F0] md:pl-5 lg:pl-8 after:hidden md:after:block after:content-[''] after:absolute after:top-0 after:-left-6 after:bottom-0 after:w-6 after:bg-gradient-to-l after:from-[#F7F5F0] after:to-transparent after:pointer-events-none">
              <div className="flex items-center space-x-2 text-[#C95745] text-xs font-bold uppercase tracking-widest font-sans">
                <span>EXPLORE BY COLLECTION</span>
                <span className="w-8 h-[2px] bg-[#C95745]"></span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[45px] font-normal tracking-tight text-[#101B38] leading-[1.12]">
                Discover Premium Imported Ceramic &amp; Porcelain Tiles
              </h2>

              <p className="font-sans text-xs sm:text-sm text-[#333333] font-normal leading-relaxed pt-1">
                At Timex Ceramic, we bring you a world of premium imported tiles sourced from renowned tile-producing countries, including Spain, Italy, China, and Turkey. Our carefully curated collection features a wide range of luxury, designer, ceramic, and porcelain tiles, offering distinctive designs, textures, colours, and finishes to complement every style and space.
              </p>

              <div className="pt-2">
                <Link
                  href="/collections"
                  className="group text-xs font-semibold text-[#101B38] hover:text-[#C95745] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors font-sans pb-2 border-b border-[#EDEAE4] hover:border-[#C95745]"
                >
                  <span>VIEW ALL COLLECTIONS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>

          {/* Dynamic Collections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {items.map((collection, idx) => (
              <CollectionGridCard
                key={collection.id}
                collection={collection}
                idx={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Full-width "Can't Find the Right Tile Design?" Section */}
      <section className="w-full bg-[#101b38] relative z-10 m-0 p-0 border-0">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10 sm:py-12 md:py-14">
          <Reveal direction="up" delay={0.1}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10">
              <div className="max-w-2xl space-y-1">
                <h4 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-white">
                  Can&apos;t Find the Right Tile Design?
                </h4>
                <p className="font-sans text-xs sm:text-sm text-white/90 font-normal leading-relaxed">
                  Explore our complete range of premium imported ceramic and porcelain tiles, or speak with our team to find the right solution for your project.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 sm:gap-8 w-full md:w-auto">
                <Link
                  href="/collections"
                  className="group text-xs font-semibold text-white hover:text-[#C95745] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors font-sans pb-2 border-b border-white/30 hover:border-[#C95745] whitespace-nowrap"
                >
                  <span>VIEW ALL COLLECTIONS</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-[#C95745] group-hover:translate-x-1 transition-all duration-300" />
                </Link>

                <button
                  type="button"
                  onClick={openTileExpertModal}
                  className="group text-xs font-semibold text-white hover:text-[#C95745] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors font-sans pb-2 border-b border-white/30 hover:border-[#C95745] whitespace-nowrap cursor-pointer"
                >
                  <span>TALK TO A TILE EXPERT</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-[#C95745] group-hover:translate-x-1 transition-all duration-300" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
