"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const INSPIRATION_IMAGES = [
  {
    id: "insp-1",
    src: "/uploads/products/1002-2.webp",
    alt: "Timex Ceramic Tile 1002-2",
  },
  {
    id: "insp-2",
    src: "/uploads/products/5109-insparation-3.webp",
    alt: "Timex Ceramic Tile 5109-3",
  },
  {
    id: "insp-3",
    src: "/uploads/products/allowy-insparation-1.webp",
    alt: "Timex Ceramic Tile Allowy-1",
  },
  {
    id: "insp-4",
    src: "/uploads/products/wood-story-insparation.webp",
    alt: "Timex Ceramic Tile Wood Story",
  },
  {
    id: "insp-5",
    src: "/uploads/products/gm91-insparation-1.webp",
    alt: "Timex Ceramic Tile GM91-1",
  },
  {
    id: "insp-6",
    src: "/uploads/products/zelij-insparation.webp",
    alt: "Timex Ceramic Tile Zelij",
  },
  {
    id: "insp-7",
    src: "/uploads/products/6016-insparation.webp",
    alt: "Timex Ceramic Tile 6016",
  },
  {
    id: "insp-8",
    src: "/uploads/products/6014-instaration.webp",
    alt: "Timex Ceramic Tile 6014",
  },
];

export function InspirationHeroGallery() {
  // Start with index 4 (GM91-1 green tile, 5th image) matching the reference screenshot exactly
  const [activeIndex, setActiveIndex] = useState(4);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const scrollToThumbnail = (index: number) => {
    const el = thumbnailRefs.current[index];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    scrollToThumbnail(index);
  };

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => {
      const nextIdx = (prev - 1 + INSPIRATION_IMAGES.length) % INSPIRATION_IMAGES.length;
      scrollToThumbnail(nextIdx);
      return nextIdx;
    });
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => {
      const nextIdx = (prev + 1) % INSPIRATION_IMAGES.length;
      scrollToThumbnail(nextIdx);
      return nextIdx;
    });
  }, []);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    scrollToThumbnail(4);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  return (
    <section className="relative w-full bg-[#121212] overflow-hidden select-none">
      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* =========================================================================
          1. MAIN IMAGE AREA — FULL WIDTH PANORAMIC VIEWPORT
          ========================================================================= */}
      <div
        className="relative w-full h-[360px] sm:h-[480px] md:h-[560px] lg:h-[640px] xl:h-[700px] overflow-hidden bg-[#10141E]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {INSPIRATION_IMAGES.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === activeIndex
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              priority={idx === 0 || idx === 4}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* Previous Navigation Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous inspiration image"
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 text-white/85 hover:text-white transition-all duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] cursor-pointer group p-2 focus:outline-none"
        >
          <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 stroke-[1.3] group-hover:-translate-x-1 transition-transform duration-200" />
        </button>

        {/* Next Navigation Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next inspiration image"
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 text-white/85 hover:text-white transition-all duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] cursor-pointer group p-2 focus:outline-none"
        >
          <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 stroke-[1.3] group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      {/* =========================================================================
          2. THUMBNAIL NAVIGATION STRIP — HORIZONTAL PREVIEW BAR
          ========================================================================= */}
      <div className="w-full bg-[#181818] border-t border-black/60 border-b border-[#252525] py-1.5 sm:py-2 px-2 sm:px-4">
        <div
          ref={thumbnailContainerRef}
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none justify-start md:justify-center"
        >
          {INSPIRATION_IMAGES.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`thumb-${item.id}`}
                type="button"
                ref={(el) => {
                  thumbnailRefs.current[idx] = el;
                }}
                onClick={() => handleSelect(idx)}
                aria-label={`Select ${item.alt}`}
                className={`relative shrink-0 overflow-hidden transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "ring-2 ring-white opacity-100 z-10 shadow-lg"
                    : "opacity-35 hover:opacity-75"
                } w-20 h-12 sm:w-28 sm:h-16 md:w-32 md:h-18 lg:w-36 lg:h-20`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 144px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
