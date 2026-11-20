"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { SpaceItem } from "@/types/spaces";
import defaultSpaces from "../../../server/data/defaultSpaces.json";

function formatSpaceTitle(name: string): string {
  if (!name) return "";
  const cleaned = name
    .replace(/\s*\bTiles\b\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || name;
}

function SpaceCard({ space, idx }: { space: SpaceItem; idx: number }) {
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

  const directUrl = `/${space.slug}`;
  const displayTitle = formatSpaceTitle(space.name);

  return (
    <Reveal direction="up" delay={(idx % 4) * 0.05}>
      <Link
        ref={cardRef}
        href={directUrl}
        onClick={handleCardClick}
        className="block group"
      >
        <div className="relative aspect-[4/5] min-h-[360px] rounded-[2px] overflow-hidden bg-[#101B38] border border-[#EDEAE4] shadow-xs hover:shadow-lg transition-all duration-350 ease-out">
          {/* Background Space Image */}
          <Image
            src={
              space.image ||
              "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
            }
            alt={space.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 ease-out ${
              touchActive ? "scale-105" : "group-hover:scale-105"
            }`}
            priority={idx < 4}
          />

          {/* Dark Gradient Overlay for Crisp Text Readability */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-[#0A1124]/95 via-[#0A1124]/50 to-transparent transition-opacity duration-350 ease-out ${
              touchActive
                ? "opacity-98"
                : "opacity-75 group-hover:opacity-98"
            }`}
          />

          {/* Bottom Text & Action Button */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col justify-end z-10">
            <h3 className="font-serif text-lg md:text-xl font-normal tracking-wide text-[#FCFBF8] leading-tight transition-transform duration-350 ease-out">
              {displayTitle}
            </h3>

            {/* Smoothly Revealed Complete Description & Arrow Button on Hover / Tap */}
            <div
              className={`grid transition-all duration-350 ease-out ${
                touchActive
                  ? "grid-rows-[1fr] opacity-100 translate-y-0 pt-2.5"
                  : "grid-rows-[0fr] opacity-0 translate-y-3 pt-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:translate-y-0 group-hover:pt-2.5"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-3">
                  <p className="font-sans text-[11.5px] sm:text-xs text-[#EDEAE4]/90 font-normal leading-relaxed">
                    {space.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/10">
                    <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-[#EDEAE4]/80 group-hover:text-[#C95745] transition-colors inline-flex items-center gap-1.5">
                      EXPLORE TILES
                    </span>
                    {/* Arrow Button */}
                    <div className="w-7 h-7 rounded-[2px] bg-[#F7F5F0] text-[#000000] flex items-center justify-center shadow-xs transition-all duration-350 ease-out flex-shrink-0 group-hover:bg-[#C95745] group-hover:text-white">
                      <ArrowRight
                        className={`w-3.5 h-3.5 transform transition-transform duration-350 ease-out ${
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
        </div>
      </Link>
    </Reveal>
  );
}

export function TilesBySpacesSection() {
  const [spaces, setSpaces] = useState<SpaceItem[]>(defaultSpaces as SpaceItem[]);

  // Live database rehydration: sync space images, titles, and descriptions from backend API
  useEffect(() => {
    let isMounted = true;
    const loadLiveSpaces = () => {
      fetch(`/api/v1/spaces?status=published&_t=${Date.now()}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load spaces");
          return res.json();
        })
        .then((data) => {
          if (data.spaces && Array.isArray(data.spaces) && data.spaces.length > 0 && isMounted) {
            const published = data.spaces.filter(
              (s: SpaceItem) => s.status !== "draft" && !s.name.toLowerCase().includes("rooftop")
            );
            setSpaces(published);
          }
        })
        .catch(() => {});
    };

    loadLiveSpaces();

    const handleUpdate = () => loadLiveSpaces();
    window.addEventListener("timex-taxonomy-updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("timex-taxonomy-updated", handleUpdate);
    };
  }, []);

  return (
    <section className="py-20 md:py-24 relative z-10 bg-[#F7F5F0] border-t border-b border-[#EDEAE4]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-14 pb-4 border-b border-[#EDEAE4] gap-6">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C95745] font-bold uppercase font-sans block">
              EXPLORE BY SPACE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#101B38]">
              Tiles Designed for Every Space
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#333333]/75 font-normal leading-relaxed max-w-2xl pt-1">
              Discover premium imported tiles curated for residential, commercial and hospitality spaces, from refined interiors to distinctive outdoor settings.
            </p>
          </div>
          <Link
            href="/spaces"
            className="group text-xs font-semibold text-[#101B38] hover:text-[#C95745] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors font-sans pb-2 border-b border-[#EDEAE4] hover:border-[#C95745] self-start md:self-auto flex-shrink-0"
          >
            <span>VIEW ALL SPACES</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* 4-column Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {spaces.map((space, idx) => (
            <SpaceCard key={space.id || space.slug} space={space} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
