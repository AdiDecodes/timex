"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroBackground {
  id: string;
  url: string;
  alt: string;
}

const HERO_BACKGROUNDS: HeroBackground[] = [
  {
    id: "hero-bg-1",
    url: "/uploads/products/AMBIENTE-DELORMO-Pira-mocha.webp",
    alt: "Luxury Bathroom Vanity & Architectural Surfaces",
  },
  {
    id: "hero-bg-2",
    url: "/uploads/products/Combo-Burdeos-240x740-AMB.webp",
    alt: "Architectural Grandeur & Timeless Surfaces",
  },
  {
    id: "hero-bg-3",
    url: "/uploads/products/AMB_NAZCA-BEIGE-1.webp",
    alt: "Distinctive Porcelain Textures & Imported Tiles",
  },
];

export function HomeHeroSection() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-rotate background image every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  // Preload all 3 images on mount to eliminate flicker or blank white frames
  useEffect(() => {
    HERO_BACKGROUNDS.forEach((bg) => {
      const img = new Image();
      img.src = bg.url;
    });
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#000000] text-[#FFFFFF]">
      {/* ========================================================================= */}
      {/* 1. HERO SLIDER — THREE BACKGROUND IMAGES WITH SMOOTH CROSSFADE             */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
        {HERO_BACKGROUNDS.map((bg, idx) => (
          <div
            key={bg.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionProperty: "opacity",
              transitionDuration: "1200ms",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <img
              src={bg.url}
              alt={bg.alt}
              className="w-full h-full object-cover object-center"
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2. LOCALIZED LEFT-SIDE BLACK GRADIENT (BEHIND TEXT ONLY)                   */}
      {/* ========================================================================= */}
      {/* Desktop: Solid black on the left behind text, smoothly fading to 100%      */}
      {/* transparent by ~56% width so the photo on the right stays bright & clear   */}
      <div
        className="absolute inset-0 pointer-events-none z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgb(0 0 0 / 95%) 0%, rgb(7 7 7 / 83%) 24%, rgb(0 0 0 / 38%) 36%, rgb(160 152 152 / 0%) 46%, rgba(0, 0, 0, 0) 56%)",
        }}
      />
      {/* Mobile/Tablet: Smooth gradient coverage to keep text readable on narrow screens */}
      <div
        className="absolute inset-0 pointer-events-none z-10 md:hidden"
        style={{
          background:
            "linear-gradient(to right, rgba(0, 0, 0, 0.95) 0%, rgb(0 0 0 / 50%) 50%, rgb(0 0 0 / 0%) 80%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      {/* ========================================================================= */}
      {/* 3. FIXED HERO CONTENT (CRISP WHITE TEXT ON BLACK BACKGROUND)               */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 min-h-[580px] sm:min-h-[640px] md:min-h-[720px] lg:min-h-[85vh] xl:min-h-[88vh] flex flex-col justify-center py-20 sm:py-24 lg:py-28">
        <div className="max-w-2xl space-y-4 sm:space-y-5">
          {/* Eyebrow in uppercase tracked text */}
          <div>
            <span className="font-sans text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-[0.25em] text-[#FFFFFF] md:text-[#C95745] uppercase block lg:pl-[5px]">
              WHERE DESIGN MEETS TIMELESS ELEGANCE
            </span>
          </div>

          {/* Cormorant Garamond Heading in pure white */}
          <h1 className="font-serif text-[42px] md:text-[53px] font-normal text-[#FFFFFF] leading-[1.12] tracking-tight">
            Surfaces That <br />
            Define Extraordinary <br />
            Spaces
          </h1>

          {/* Manrope Supporting Description in clean white text */}
          <p className="font-sans text-xs sm:text-[13px] md:text-sm text-[#FFFFFF]/85 font-normal leading-relaxed max-w-xl">
            Discover premium imported wall and floor tiles from a curated <br />
            world of contemporary patterns, textures, colours and finishes.
          </p>

          {/* Horizontally Aligned Action Buttons matching the reference editorial styling */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-3">
            {/* Primary Action: Explore Collections with editorial underline */}
            <Link
              href="/collections"
              className="group inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] uppercase text-[#FFFFFF] hover:text-[#C95745] pb-2 border-b border-[#EDEAE4]/40 hover:border-[#C95745] transition-all duration-300"
            >
              <span>EXPLORE COLLECTIONS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            {/* Secondary Action: Book a Showroom Visit with cohesive editorial styling */}
            <Link
              href="/book-a-showroom-visit"
              className="group inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] uppercase text-[#FFFFFF]/85 hover:text-[#C95745] pb-2 border-b border-[#EDEAE4]/40 hover:border-[#C95745] transition-all duration-300"
            >
              <span>BOOK A SHOWROOM VISIT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Slide Pagination Indicator (01 ── 03) matching reference screenshot */}
          <div className="flex items-center gap-3 pt-6 sm:pt-8 select-none" aria-label="Hero slide indicators">
            <span className="text-xs font-semibold text-[#FFFFFF]/90 tracking-wider">
              0{currentSlideIndex + 1}
            </span>
            <div className="flex items-center gap-1.5">
              {HERO_BACKGROUNDS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-[2px] transition-all duration-500 rounded-full cursor-pointer focus:outline-none ${
                    idx === currentSlideIndex
                      ? "w-8 bg-[#C95745]"
                      : "w-3 bg-[#FFFFFF]/30 hover:bg-[#FFFFFF]/60"
                  }`}
                  aria-label={`Jump to background slide ${idx + 1}`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#FFFFFF]/50 tracking-wider">
              0{HERO_BACKGROUNDS.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
