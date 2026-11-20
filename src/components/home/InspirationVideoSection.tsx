"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  ExternalLink,
} from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import {
  INSTAGRAM_CATEGORIES,
  INSTAGRAM_INSPIRATION_ITEMS,
  InstagramInspirationItem,
  InstagramCategoryFilter,
} from "@/data/instagramInspiration";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function getBadgeStyle(category: string): string {
  switch (category) {
    case "DESIGN TIPS":
      return "bg-[#E3EFE9] text-[#2D5A43]";
    case "PRODUCT HIGHLIGHTS":
      return "bg-[#FCEEE5] text-[#914D28]";
    case "BEHIND THE SCENES":
      return "bg-[#EDE7F6] text-[#553E8A]";
    case "REAL SPACES":
      return "bg-[#FEF9C3] text-[#7A6016]";
    case "TRENDS":
      return "bg-[#E0F2FE] text-[#0369A1]";
    case "HOW TO":
      return "bg-[#F5EAE6] text-[#863D2F]";
    default:
      return "bg-[#EDEAE4] text-[#101B38]";
  }
}

export function InspirationVideoSection() {
  const [activeCategory, setActiveCategory] = useState<InstagramCategoryFilter>("ALL VIDEOS");
  const [activeItem, setActiveItem] = useState<InstagramInspirationItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter items: ALL VIDEOS shows all 16 items; specific category shows matching items
  const filteredItems =
    activeCategory === "ALL VIDEOS"
      ? INSTAGRAM_INSPIRATION_ITEMS
      : INSTAGRAM_INSPIRATION_ITEMS.filter((item) =>
          item.categories.includes(activeCategory as any)
        );

  const currentModalIndex = activeItem
    ? filteredItems.findIndex((item) => item.id === activeItem.id)
    : -1;

  const handlePrevVideo = () => {
    if (filteredItems.length === 0) return;
    const prevIdx =
      currentModalIndex <= 0 ? filteredItems.length - 1 : currentModalIndex - 1;
    setActiveItem(filteredItems[prevIdx]);
  };

  const handleNextVideo = () => {
    if (filteredItems.length === 0) return;
    const nextIdx =
      currentModalIndex >= filteredItems.length - 1 ? 0 : currentModalIndex + 1;
    setActiveItem(filteredItems[nextIdx]);
  };

  // Keyboard navigation for video modal (Escape to close, Left Arrow for Previous, Right Arrow for Next)
  useEffect(() => {
    if (!activeItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveItem(null);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevVideo();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextVideo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem, currentModalIndex, filteredItems]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (activeItem) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [activeItem]);

  const handleScrollLeft = () => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleCategoryClick = (category: InstagramCategoryFilter) => {
    setActiveCategory(category);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 md:py-28 relative z-10 bg-[#F7F5F0] border-b border-[#EDEAE4] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10 md:mb-12">
          <div className="flex items-center justify-center space-x-3">
            <span className="w-8 h-[1px] bg-[#C95745]"></span>
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C95745] font-semibold uppercase">
              TILE INSPIRATION | DESIGN IDEAS &amp; TRENDS
            </span>
            <span className="w-8 h-[1px] bg-[#C95745]"></span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#101B38] leading-[1.15]">
            Tile Design Ideas, Trends &amp; <span className="text-[#C95745] italic">Inspiration</span>
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#333333]/75 font-normal leading-relaxed max-w-2xl sm:max-w-3xl mx-auto pt-1">
            Get inspired by premium imported tiles, designer wall and floor tiles, ceramic and porcelain tiles through expert videos, product highlights and real-space ideas. Discover practical tile selection tips, interior design trends, textures, patterns, colours and finishes for homes, commercial spaces and hospitality projects.
          </p>
        </div>

        {/* Category Navigation Bar (Matches Attached Reference Image) */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3 mb-10 md:mb-12">
          {INSTAGRAM_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`px-4 sm:px-6 py-2.5 rounded-[2px] text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#101B38] text-[#FCFBF8] shadow-sm"
                    : "bg-[#FCFBF8] text-[#333333] border border-[#EDEAE4] hover:text-[#C95745] hover:border-[#101B38]/30"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Horizontal Video Carousel with Previous / Next Controls */}
        <div className="relative py-2">
          {/* Previous Arrow Button */}
          {filteredItems.length > 1 && (
            <button
              onClick={handleScrollLeft}
              className="absolute -left-2 sm:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-[2px] bg-[#FCFBF8] backdrop-blur-sm shadow-md border border-[#DED9D0] flex items-center justify-center text-[#101B38] hover:text-[#FCFBF8] hover:bg-[#C95745] hover:border-[#C95745] transition-all duration-300 cursor-pointer focus:outline-none"
              aria-label="Previous videos"
              title="Previous videos"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Carousel Track (9:16 Portrait Cards, ~5 visible on large desktop) */}
          <div
            ref={carouselRef}
            className={`flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] ${
              filteredItems.length === 0 ? "justify-center items-center min-h-[300px]" : ""
            }`}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => {
                // Determine display category badge based on active tab or primary assigned category
                const displayCategory =
                  activeCategory !== "ALL VIDEOS" && item.categories.includes(activeCategory as any)
                    ? activeCategory
                    : item.categories[0];

                const badgeStyle = getBadgeStyle(displayCategory);

                return (
                  <div
                    key={`${item.id}-${activeCategory}`}
                    className="snap-start shrink-0 w-[230px] sm:w-[250px] lg:w-[255px] xl:w-[258px]"
                  >
                    <Reveal direction="up" delay={Math.min(idx * 0.05, 0.4)}>
                      <div
                        onClick={() => setActiveItem(item)}
                        className="w-full h-[430px] sm:h-[460px] lg:h-[470px] rounded-[2px] overflow-hidden relative group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 bg-[#101B38] select-none flex flex-col justify-between border border-[#EDEAE4] hover:border-[#C95745]/50"
                      >
                        {/* 1. Preview Image (Full cover filling 9:16 card without distortion) */}
                        <img
                          src={item.previewImage}
                          alt={`Timex Ceramic Instagram ${item.postType} #${item.order}`}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* 2. Top & Bottom Gradient Overlays for High Contrast Readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10 pointer-events-none" />

                        {/* 3. Top-Left Category Badge */}
                        <div className="relative z-20 p-4 flex items-center justify-between">
                          <span
                            className={`text-[9.5px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-[2px] shadow-sm ${badgeStyle}`}
                          >
                            {displayCategory}
                          </span>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Open original Instagram post"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 rounded bg-black/40 text-white hover:text-[#C95745]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        {/* 4. Center Circular Play Button (Transparent with thin white border) */}
                        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border border-white/80 bg-black/25 backdrop-blur-xs text-white flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:border-white">
                            <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                          </div>
                        </div>

                        {/* 5. Bottom Information Overlay */}
                        <div className="relative z-20 p-4 sm:p-5 space-y-1.5 text-[#FCFBF8]">
                          {/* Duration / Type Pill */}
                          <div className="w-fit">
                            <span className="text-[10px] font-semibold tracking-wider text-white/95 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-[2px] inline-flex items-center gap-1.5">
                              <InstagramIcon className="w-3 h-3 text-[#C95745]" />
                              <span>{item.postType}</span>
                            </span>
                          </div>

                          {/* Progress Accent Line */}
                          <div className="pt-1.5">
                            <div className="w-10 h-0.5 bg-[#C95745] rounded-full" />
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                );
              })
            ) : (
              <div className="py-16 px-4 text-center space-y-3 max-w-md mx-auto">
                <p className="text-sm font-medium text-[#101B38]/80">
                  New inspiration reels coming soon in{" "}
                  <span className="font-semibold text-[#C95745]">{activeCategory}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("ALL VIDEOS")}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#101B38] bg-white border border-[#DED9D0] rounded-[2px] hover:bg-[#101B38] hover:text-[#FCFBF8] transition-all duration-300 shadow-sm"
                >
                  View All Videos
                </button>
              </div>
            )}
          </div>

          {/* Next Arrow Button */}
          {filteredItems.length > 1 && (
            <button
              onClick={handleScrollRight}
              className="absolute -right-2 sm:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-[2px] bg-[#FCFBF8] backdrop-blur-sm shadow-md border border-[#DED9D0] flex items-center justify-center text-[#101B38] hover:text-[#FCFBF8] hover:bg-[#C95745] hover:border-[#C95745] transition-all duration-300 cursor-pointer focus:outline-none"
              aria-label="Next videos"
              title="Next videos"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Section Bottom CTA Link */}
        <div className="mt-10 sm:mt-12 text-center">
          <a
            href="https://www.instagram.com/timexceramic/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[#101B38] text-[#101B38] hover:bg-[#101B38] hover:text-[#FCFBF8] text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-all duration-300"
          >
            <InstagramIcon className="w-4 h-4 text-[#C95745]" />
            <span>Follow @TimexCeramic on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>

      {/* Video Modal Lightbox Portal (Opens Instagram video with sound, controls, 9:16 portrait sizing & Previous/Next navigation) */}
      {mounted && activeItem && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/90 backdrop-blur-md animate-fade-in select-none"
          onClick={() => setActiveItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Instagram Video Lightbox"
        >
          {/* Always Visible Fixed Floating Close (×) Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveItem(null);
            }}
            className="fixed top-3 right-3 sm:top-5 sm:right-6 z-[100003] w-10 h-10 sm:w-11 sm:h-11 rounded-[2px] bg-[#101B38]/90 text-[#FCFBF8] hover:bg-[#C95745] hover:text-[#FCFBF8] border border-white/20 hover:border-[#C95745] shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C95745]"
            aria-label="Close video"
            title="Close video (Esc)"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>

          {/* Floating Mobile Touch Navigation Arrows (Easy thumb tap on phone screens) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevVideo();
            }}
            className="flex md:hidden fixed left-2 top-1/2 -translate-y-1/2 z-[100002] w-10 h-10 rounded-full bg-black/70 backdrop-blur-md text-white items-center justify-center border border-white/25 shadow-xl active:scale-95 transition-transform cursor-pointer"
            aria-label="Previous video"
            title="Previous video"
          >
            <ChevronLeft className="w-5 h-5 -translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextVideo();
            }}
            className="flex md:hidden fixed right-2 top-1/2 -translate-y-1/2 z-[100002] w-10 h-10 rounded-full bg-black/70 backdrop-blur-md text-white items-center justify-center border border-white/25 shadow-xl active:scale-95 transition-transform cursor-pointer"
            aria-label="Next video"
            title="Next video"
          >
            <ChevronRight className="w-5 h-5 translate-x-0.5" />
          </button>

          {/* Center Modal Wrapper with Flanking Desktop Arrows */}
          <div className="relative flex items-center justify-center max-w-full max-h-full">
            {/* Desktop Previous Video Arrow (Flanking Left, centered vertically) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevVideo();
              }}
              className="hidden md:flex absolute -left-16 lg:-left-20 top-1/2 -translate-y-1/2 z-[100001] w-12 h-12 lg:w-13 lg:h-13 rounded-full bg-[#101B38]/95 hover:bg-[#C95745] text-white border border-white/25 hover:border-[#C95745] shadow-2xl items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer focus:outline-none"
              aria-label="Previous video"
              title="Previous video (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6 -translate-x-0.5" />
            </button>

            {/* Modal Dialog Card (Strict 9:16 portrait proportion, no viewport overflow, zero unnecessary black bars) */}
            <div
              className="relative w-[min(90vw,410px)] max-h-[92vh] bg-[#101B38] rounded-[4px] overflow-hidden shadow-2xl border border-white/20 z-[100000] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 bg-[#101B38] text-[#FCFBF8] border-b border-white/10 shrink-0 gap-2">
                {/* Brand & Account Info */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-[1.5px] shrink-0">
                    <div className="w-full h-full rounded-full bg-[#101B38] flex items-center justify-center">
                      <InstagramIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-white tracking-wide truncate">
                      timexceramic
                    </span>
                    <span className="text-[9px] text-gray-300/80 -mt-0.5">
                      Timex Ceramic
                    </span>
                  </div>
                </div>

                {/* Badges & Actions */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-[2px] bg-[#C95745] text-white tracking-wider">
                    {activeItem.postType}
                  </span>
                  {activeItem.categories.map((c) => (
                    <span
                      key={c}
                      className={`text-[8.5px] font-semibold uppercase px-1.5 py-0.5 rounded-[2px] ${getBadgeStyle(
                        c
                      )}`}
                    >
                      {c}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setActiveItem(null)}
                    className="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer ml-1"
                    aria-label="Close modal"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal 9:16 Video Frame Container */}
              <div className="relative w-full aspect-[9/16] max-h-[calc(92vh-104px)] bg-black flex items-center justify-center overflow-hidden">
                {/* Poster image preview behind iframe while loading */}
                <img
                  src={activeItem.previewImage}
                  alt={`Timex Ceramic Preview #${activeItem.order}`}
                  className="absolute inset-0 w-full h-full object-cover filter blur-[2px] opacity-40 pointer-events-none"
                />

                {/* Subtle loading spinner */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div className="flex flex-col items-center gap-2 text-white/60">
                    <div className="w-7 h-7 border-2 border-[#C95745] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] tracking-wide">Loading video...</span>
                  </div>
                </div>

                {/* Fresh Interactive Instagram Embed Frame (key ensures clean remount on navigation) */}
                <iframe
                  key={activeItem.id}
                  src={activeItem.embedUrl}
                  title={`Timex Ceramic Instagram ${activeItem.postType} #${activeItem.order}`}
                  className="relative z-10 w-full h-full border-0 bg-transparent"
                  allowTransparency={true}
                  allow="encrypted-media; picture-in-picture; autoplay"
                  scrolling="no"
                />
              </div>

              {/* Modal Footer with Controls, Counter & Instagram CTA */}
              <div className="px-3.5 py-2.5 bg-[#0d152b] border-t border-white/10 flex items-center justify-between text-xs text-gray-300 shrink-0 gap-2">
                {/* Post Counter & Position */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-gray-300">
                    #{activeItem.order}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-[10.5px] text-gray-400">
                    {currentModalIndex >= 0 ? `${currentModalIndex + 1} of ${filteredItems.length}` : ""}
                  </span>
                </div>

                {/* Mobile Prev / Next Buttons */}
                <div className="flex items-center gap-1.5 md:hidden">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevVideo();
                    }}
                    aria-label="Previous video"
                    className="px-2 py-1 rounded-[2px] bg-white/10 hover:bg-white/20 active:bg-[#C95745] text-white flex items-center gap-0.5 text-[10px] font-semibold transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextVideo();
                    }}
                    aria-label="Next video"
                    className="px-2 py-1 rounded-[2px] bg-white/10 hover:bg-white/20 active:bg-[#C95745] text-white flex items-center gap-0.5 text-[10px] font-semibold transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Direct Instagram Action Link */}
                <a
                  href={activeItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C95745] hover:bg-[#a84434] text-white text-[10.5px] font-semibold rounded-[2px] transition-colors shrink-0 shadow-sm"
                  title="Open original Instagram post"
                >
                  <InstagramIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">Open on Instagram</span>
                  <span className="sm:hidden">Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Desktop Next Video Arrow (Flanking Right, centered vertically) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextVideo();
              }}
              className="hidden md:flex absolute -right-16 lg:-right-20 top-1/2 -translate-y-1/2 z-[100001] w-12 h-12 lg:w-13 lg:h-13 rounded-full bg-[#101B38]/95 hover:bg-[#C95745] text-white border border-white/25 hover:border-[#C95745] shadow-2xl items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer focus:outline-none"
              aria-label="Next video"
              title="Next video (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6 translate-x-0.5" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}