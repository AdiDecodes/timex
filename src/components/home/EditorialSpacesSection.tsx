"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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

export function EditorialSpacesSection() {
  const [spaces, setSpaces] = useState<SpaceItem[]>(defaultSpaces as SpaceItem[]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

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

  // Close active preview when tapping outside on touch devices
  useEffect(() => {
    if (activeIndex === null) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setActiveIndex(null);
      }
    };
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [activeIndex]);

  if (!spaces || spaces.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5E5E5] relative z-10 text-[#000000] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Top Eyebrow & Header Bar */}
        <div className="border-b border-[#E5E5E5] pb-6 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[10px] sm:text-xs tracking-[0.25em] text-[#C95745] font-bold uppercase font-sans">
              <span>EXPLORE BY SPACE</span>
              <span className="w-8 h-[1px] bg-[#C95745]" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#000000]">
              Tiles Designed for Every Space
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#000000]/70 font-normal leading-relaxed max-w-2xl pt-1">
              Discover premium imported tiles curated for residential, commercial and hospitality spaces, from refined interiors to distinctive outdoor settings.
            </p>
          </div>

          <Link
            href="/spaces"
            className="group text-xs font-semibold text-[#000000] hover:opacity-60 uppercase tracking-wider inline-flex items-center gap-1.5 transition-opacity font-sans pb-1 border-b border-[#E5E5E5] self-start md:self-auto flex-shrink-0"
          >
            <span>VIEW ALL SPACES</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Interactive Space Titles List with Contextual Right-Side Image Popup */}
        <div
          ref={listRef}
          onMouseLeave={() => setActiveIndex(null)}
          className="relative flex flex-col divide-y divide-[#E5E5E5] border-b border-[#E5E5E5]"
        >
          {spaces.map((space, idx) => {
            const isActive = activeIndex === idx;
            const displayTitle = formatSpaceTitle(space.name);
            const directUrl = `/${space.slug}`;
            const imageUrl =
              space.image ||
              "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80";

            // Keep popup within vertical section bounds across the list
            const verticalAlignClass =
              idx === 0
                ? "top-0 translate-y-0"
                : idx === 1 && spaces.length > 3
                  ? "top-0 translate-y-0"
                  : idx === spaces.length - 1
                    ? "bottom-0 translate-y-0"
                    : idx === spaces.length - 2 && spaces.length > 3
                      ? "bottom-0 translate-y-0"
                      : "top-1/2 -translate-y-1/2";

            return (
              <div
                key={space.id || space.slug || idx}
                onMouseEnter={() => setActiveIndex(idx)}
                onFocus={() => setActiveIndex(idx)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setActiveIndex(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveIndex(idx);
                  } else if (e.key === "Escape") {
                    setActiveIndex(null);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                className={`group relative py-6 sm:py-8 cursor-pointer transition-colors focus:outline-none ${
                  isActive ? "z-30" : "z-10"
                }`}
              >
                {/* Left Column: Space Title & Description (Never Overlapped by Right Popup) */}
                <div className="w-full lg:max-w-[46%] xl:max-w-[43%] 2xl:max-w-[41%] pr-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <Link
                      href={directUrl}
                      onClick={(e) => {
                        if (
                          typeof window !== "undefined" &&
                          window.matchMedia("(hover: none)").matches &&
                          !isActive
                        ) {
                          e.preventDefault();
                          setActiveIndex(idx);
                        }
                      }}
                      className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-normal tracking-tight transition-colors duration-300 block ${
                        isActive
                          ? "text-[#000000]"
                          : "text-[#CCCCCC] hover:text-[#777777]"
                      }`}
                    >
                      {displayTitle}
                    </Link>
                  </div>

                  {/* Smoothly Revealed Description & Mobile Preview when Active */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: 0, height: 0, marginTop: 0 }
                        }
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: 1, height: "auto", marginTop: 12 }
                        }
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, height: 0, marginTop: 0 }
                        }
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        {space.description && (
                          <p className="font-sans text-xs sm:text-sm text-[#000000]/80 font-normal leading-relaxed max-w-lg">
                            {space.description}
                          </p>
                        )}

                        {/* Mobile / Tablet Inline Preview Card */}
                        <div className="lg:hidden mt-4">
                          <Link
                            href={directUrl}
                            className="block relative aspect-[16/10] w-full max-w-full sm:max-w-lg md:max-w-xl rounded-[2px] overflow-hidden bg-[#F5F5F5] border border-[#E5E5E5] shadow-md"
                          >
                            <Image
                              src={imageUrl}
                              alt={space.name}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="object-cover"
                            />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Desktop Contextual Floating Image Popup on the Right */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              transition: { duration: 0.22, ease: "easeOut" },
                            }
                      }
                      transition={{
                        duration: prefersReducedMotion ? 0.15 : 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`hidden lg:block absolute right-0 lg:right-2 xl:right-4 ${verticalAlignClass} w-[50%] lg:w-[52%] xl:w-[55%] 2xl:w-[57%] max-w-[780px] xl:max-w-[800px] z-30 pointer-events-auto`}
                    >
                      <motion.div
                        initial={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, scale: 0.88, y: 8 }
                        }
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : {
                                opacity: 0,
                                scale: 0.94,
                                y: -4,
                                transition: { duration: 0.22, ease: "easeOut" },
                              }
                        }
                        transition={{
                          duration: prefersReducedMotion ? 0.15 : 0.6,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          willChange: "transform, opacity",
                          transformOrigin: "center center",
                        }}
                        className="w-full origin-center"
                      >
                        <Link
                          href={directUrl}
                          className="block group/popup relative aspect-[16/10] w-full rounded-[2px] overflow-hidden bg-[#F5F5F5] border border-[#E5E5E5] shadow-2xl"
                        >
                          <Image
                            src={imageUrl}
                            alt={space.name}
                            fill
                            sizes="(max-width: 1024px) 52vw, (max-width: 1280px) 55vw, 800px"
                            className="object-cover transition-transform duration-500 group-hover/popup:scale-105"
                            priority={idx < 2}
                          />
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
