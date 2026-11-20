"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  ExternalLink,
  ChevronDown,
  Sparkles,
  ArrowUp,
  Search,
  Filter,
} from "lucide-react";
import {
  WATCH_AND_CHOOSE_VIDEOS,
  WATCH_AND_CHOOSE_CATEGORIES,
  WatchAndChooseItem,
  WatchAndChooseCategory,
  WatchAndChoosePlatform,
} from "@/data/watchAndChoose";

function YouTubeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.163c-.272-.997-1.078-1.782-2.106-2.051C19.502 3.5 12 3.5 12 3.5s-7.502 0-9.392.612c-1.028.269-1.834 1.054-2.106 2.051C.1 8.051.1 12 .1 12s0 3.949.502 5.837c.272.997 1.078 1.782 2.106 2.051C4.498 20.5 12 20.5 12 20.5s7.502 0 9.392-.612c1.028-.269 1.834-1.054 2.106-2.051.502-1.888.502-5.837.502-5.837s0-3.949-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

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
      return "bg-[#E3EFE9] text-[#2D5A43] border-[#2D5A43]/20";
    case "PRODUCT HIGHLIGHTS":
      return "bg-[#FCEEE5] text-[#914D28] border-[#914D28]/20";
    case "TRENDS":
      return "bg-[#E0F2FE] text-[#0369A1] border-[#0369A1]/20";
    case "REAL SPACES":
      return "bg-[#FEF3C7] text-[#92400E] border-[#92400E]/20";
    case "BEHIND THE SCENES":
      return "bg-[#EDE9FE] text-[#6B21A8] border-[#6B21A8]/20";
    default:
      return "bg-[#EDEAE4] text-[#101B38] border-[#101B38]/20";
  }
}

const ITEMS_PER_PAGE = 20;

export function WatchAndChooseClient() {
  const [activeCategory, setActiveCategory] = useState<WatchAndChooseCategory>("ALL VIDEOS");
  const [platformFilter, setPlatformFilter] = useState<"ALL" | WatchAndChoosePlatform>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [activeItem, setActiveItem] = useState<WatchAndChooseItem | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [videos, setVideos] = useState<WatchAndChooseItem[]>(WATCH_AND_CHOOSE_VIDEOS);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live rehydration: load admin-managed videos from the API, keeping the
  // static list as fallback while it loads or if the API is unreachable.
  useEffect(() => {
    fetch("/api/v1/videos")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          const normalized: WatchAndChooseItem[] = json.data
            .filter((v: any) => !v.is_trashed && (v.status || "published") === "published")
            .map((v: any) => ({
              id: v.id,
              order: Number(v.order) || 0,
              platform: v.platform,
              postType: v.post_type || v.postType || "Short",
              url: v.url,
              videoId: v.video_id || v.videoId,
              shortcode: v.shortcode,
              categories: v.categories || [],
              thumbnail: v.thumbnail,
              hqThumbnail: v.hq_thumbnail || v.hqThumbnail,
              embedUrl: v.embed_url || v.embedUrl,
              status: v.status || "published",
            }));
          if (normalized.length > 0) {
            setVideos(normalized);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Compute category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "ALL VIDEOS": videos.length,
    };
    WATCH_AND_CHOOSE_CATEGORIES.forEach((cat) => {
      if (cat !== "ALL VIDEOS") {
        counts[cat] = videos.filter((v) => v.categories.includes(cat)).length;
      }
    });
    return counts;
  }, [videos]);

  // Filtered dataset based on Category, Platform, and Search
  const filteredItems = useMemo(() => {
    return videos.filter((item) => {
      // 1. Category filter
      if (activeCategory !== "ALL VIDEOS" && !item.categories.includes(activeCategory)) {
        return false;
      }

      // 2. Platform filter
      if (platformFilter !== "ALL" && item.platform !== platformFilter) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesOrder = String(item.order).includes(q) || `#${item.order}`.includes(q);
        const matchesPlatform = item.platform.toLowerCase().includes(q);
        const matchesPostType = item.postType.toLowerCase().includes(q);
        const matchesCategories = item.categories.some((c) => c.toLowerCase().includes(q));
        const matchesId =
          (item.videoId && item.videoId.toLowerCase().includes(q)) ||
          (item.shortcode && item.shortcode.toLowerCase().includes(q));

        if (!matchesOrder && !matchesPlatform && !matchesPostType && !matchesCategories && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, platformFilter, searchQuery]);

  // Reset pagination when category, platform, or search changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeCategory, platformFilter, searchQuery]);

  // Sliced items for display
  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = visibleCount < filteredItems.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredItems.length));
  };

  // Modal navigation index
  const currentModalIndex = activeItem
    ? filteredItems.findIndex((item) => item.id === activeItem.id)
    : -1;

  const handlePrevVideo = () => {
    if (filteredItems.length === 0) return;
    const prevIdx = currentModalIndex <= 0 ? filteredItems.length - 1 : currentModalIndex - 1;
    setActiveItem(filteredItems[prevIdx]);
  };

  const handleNextVideo = () => {
    if (filteredItems.length === 0) return;
    const nextIdx = currentModalIndex >= filteredItems.length - 1 ? 0 : currentModalIndex + 1;
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#F7F5F0] min-h-screen text-[#101B38] font-sans">
      {/* 1. Page Header & Hero Section */}
      <section className="relative bg-[#101B38] text-[#FCFBF8] py-12 md:py-16 border-b border-white/10 overflow-hidden">
        {/* Decorative subtle background grid */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
          {/* Title Area */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-[2px] bg-[#C95745]/20 border border-[#C95745]/40 text-[#C95745] text-[11px] font-semibold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TILE VIDEO GALLERY • YOUTUBE SHORTS &amp; INSTAGRAM REELS</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#FCFBF8] leading-[1.12]">
              Watch and <span className="text-[#C95745] italic">Choose</span>
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#EDEAE4]/85 font-normal leading-relaxed max-w-2xl">
              Immerse yourself in our curated tile video showcase. Watch YouTube Shorts and Instagram Reels featuring premium imported vitrified tiles, designer porcelain surfaces, real installation tips, design trends, and architectural inspirations to make your tile selection effortless.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Interactive Category Navigation Bar & Search Filters */}
      <section className="sticky top-20 z-30 bg-[#FCFBF8]/95 backdrop-blur-md border-b border-[#EDEAE4] shadow-xs py-3.5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
            {/* Category Navigation Pills (Exact categories from data) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              {WATCH_AND_CHOOSE_CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                const count = categoryCounts[category] || 0;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-[2px] text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#101B38] text-[#FCFBF8] shadow-sm"
                        : "bg-[#FFFFFF] text-[#333333] border border-[#EDEAE4] hover:text-[#C95745] hover:border-[#101B38]/30"
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? "bg-[#C95745] text-white" : "bg-[#EDEAE4] text-[#101B38]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Platform & Search Controls */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
              {/* Platform Selector */}
              <div className="flex items-center bg-[#FFFFFF] border border-[#EDEAE4] rounded-[2px] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPlatformFilter("ALL")}
                  className={`px-2.5 py-1 rounded-[2px] text-[10.5px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    platformFilter === "ALL"
                      ? "bg-[#101B38] text-[#FCFBF8]"
                      : "text-[#555] hover:text-[#101B38]"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setPlatformFilter("YouTube")}
                  className={`px-2.5 py-1 rounded-[2px] text-[10.5px] font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
                    platformFilter === "YouTube"
                      ? "bg-[#101B38] text-[#FCFBF8]"
                      : "text-[#555] hover:text-[#101B38]"
                  }`}
                >
                  <YouTubeIcon className="w-3 h-3 text-[#FF0000]" />
                  <span>YouTube</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlatformFilter("Instagram")}
                  className={`px-2.5 py-1 rounded-[2px] text-[10.5px] font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
                    platformFilter === "Instagram"
                      ? "bg-[#101B38] text-[#FCFBF8]"
                      : "text-[#555] hover:text-[#101B38]"
                  }`}
                >
                  <InstagramIcon className="w-3 h-3 text-[#E1306C]" />
                  <span>Instagram</span>
                </button>
              </div>

              {/* Quick Search Input */}
              <div className="relative flex-1 sm:w-48 md:w-56">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos (#, category)..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-[#EDEAE4] rounded-[2px] text-[#101B38] placeholder-gray-400 focus:outline-none focus:border-[#C95745] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Video Gallery Grid (Inspired by MyTyles Watch and Choose) */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-10 md:py-14">
        {/* Results Bar */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EDEAE4] text-xs text-[#555]">
          <div>
            Showing <strong className="text-[#101B38] font-bold">{displayedItems.length}</strong> of{" "}
            <strong className="text-[#101B38] font-bold">{filteredItems.length}</strong> videos
            {activeCategory !== "ALL VIDEOS" && (
              <span className="ml-1.5 text-[#C95745] font-semibold">in {activeCategory}</span>
            )}
            {platformFilter !== "ALL" && (
              <span className="ml-1 text-gray-500 font-normal">({platformFilter} only)</span>
            )}
          </div>

          {(activeCategory !== "ALL VIDEOS" || platformFilter !== "ALL" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory("ALL VIDEOS");
                setPlatformFilter("ALL");
                setSearchQuery("");
              }}
              className="text-[#C95745] hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Video Cards Grid (Strict 9:16 portrait aspect ratio, ~5 per row on desktop, 2-3 on tablet, 1-2 on mobile) */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2px] border border-[#EDEAE4] p-8 max-w-xl mx-auto shadow-xs">
            <Filter className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-normal text-[#101B38] mb-1">No videos found</h3>
            <p className="text-xs text-gray-600 mb-4">
              No videos matched your selected filter criteria. Try choosing a different category or clearing search.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("ALL VIDEOS");
                setPlatformFilter("ALL");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-[#101B38] text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-[#C95745] transition-colors"
            >
              Show All {videos.length} Videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {displayedItems.map((item) => {
              const displayCategory =
                activeCategory !== "ALL VIDEOS" && item.categories.includes(activeCategory)
                  ? activeCategory
                  : item.categories[0];
              const badgeStyle = getBadgeStyle(displayCategory);

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className="group relative aspect-[9/16] w-full rounded-[3px] overflow-hidden bg-[#101B38] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#EDEAE4] hover:border-[#C95745]/60 flex flex-col justify-between select-none"
                >
                  {/* Thumbnail Preview Image with Lazy Loading */}
                  <img
                    src={item.thumbnail}
                    alt={`Timex Ceramic #${item.order}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // Graceful fallback for YouTube HQ thumbnail to standard if needed
                      if (item.platform === "YouTube" && item.videoId) {
                        const target = e.currentTarget;
                        if (!target.src.includes("default.jpg")) {
                          target.src = `https://img.youtube.com/vi/${item.videoId}/default.jpg`;
                        }
                      }
                    }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Overlays for High Contrast Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none z-10" />

                  {/* Top-Left Category Badge & Platform Indicator */}
                  <div className="relative z-20 p-2.5 sm:p-3 flex items-start justify-between gap-1.5">
                    <span
                      className={`text-[8.5px] sm:text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-[2px] shadow-sm truncate max-w-[130px] border ${badgeStyle}`}
                    >
                      {displayCategory}
                    </span>

                    {/* Platform Badge */}
                    <span
                      className={`shrink-0 text-[8.5px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-[2px] flex items-center gap-1 shadow-sm ${
                        item.platform === "YouTube"
                          ? "bg-black/75 text-white border border-white/20"
                          : "bg-black/75 text-white border border-white/20"
                      }`}
                    >
                      {item.platform === "YouTube" ? (
                        <>
                          <YouTubeIcon className="w-2.5 h-2.5 text-[#FF0000]" />
                          <span className="hidden sm:inline">Shorts</span>
                        </>
                      ) : (
                        <>
                          <InstagramIcon className="w-2.5 h-2.5 text-[#E1306C]" />
                          <span className="hidden sm:inline">Reel</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Centered Circular Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/80 bg-black/35 backdrop-blur-xs text-white flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:border-white">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Bottom Information Overlay */}
                  <div className="relative z-20 p-3 sm:p-3.5 space-y-1 text-[#FCFBF8]">
                    <div className="flex items-center justify-between text-[9.5px] text-white/90">
                      <span className="font-semibold bg-black/60 px-1.5 py-0.5 rounded-[2px] backdrop-blur-xs">
                        #{item.order}
                      </span>
                    </div>

                    {/* Terracotta progress line */}
                    <div className="pt-0.5">
                      <div className="w-8 h-0.5 bg-[#C95745] rounded-full group-hover:w-12 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. Load More / Pagination Controls */}
        {hasMore && (
          <div className="mt-12 text-center space-y-4">
            <div className="max-w-xs mx-auto">
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                <span>
                  Showing {displayedItems.length} of {filteredItems.length}
                </span>
                <span>{Math.round((displayedItems.length / filteredItems.length) * 100)}%</span>
              </div>
              <div className="w-full bg-[#EDEAE4] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#C95745] h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${(displayedItems.length / filteredItems.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#101B38] hover:bg-[#C95745] text-[#FCFBF8] text-xs font-semibold uppercase tracking-widest rounded-[2px] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Load More Videos</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Reached End Indicator */}
        {!hasMore && filteredItems.length > 0 && (
          <div className="mt-14 text-center border-t border-[#EDEAE4] pt-8 space-y-3">
            <p className="text-xs text-gray-500">
              You&apos;ve explored all <strong className="text-[#101B38]">{filteredItems.length}</strong> videos in this view.
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#101B38] text-[#101B38] hover:bg-[#101B38] hover:text-[#FCFBF8] text-[11px] font-semibold uppercase tracking-wider rounded-[2px] transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        )}
      </main>

      {/* 5. Video Lightbox Modal (Reusing existing portal pattern with YouTube + Instagram support) */}
      {mounted && activeItem && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/90 backdrop-blur-md animate-fade-in select-none"
          onClick={() => setActiveItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.platform} Video Viewer`}
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

          {/* Floating Mobile Touch Navigation Arrows */}
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
            {/* Desktop Previous Video Arrow (Flanking Left) */}
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

            {/* Modal Dialog Card (Strict 9:16 portrait proportion, no viewport overflow) */}
            <div
              className="relative w-[min(90vw,420px)] max-h-[92vh] bg-[#101B38] rounded-[4px] overflow-hidden shadow-2xl border border-white/20 z-[100000] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 bg-[#101B38] text-[#FCFBF8] border-b border-white/10 shrink-0 gap-2">
                {/* Platform & Account Info */}
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      activeItem.platform === "YouTube"
                        ? "bg-[#FF0000] text-white"
                        : "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white"
                    }`}
                  >
                    {activeItem.platform === "YouTube" ? (
                      <YouTubeIcon className="w-4 h-4" />
                    ) : (
                      <InstagramIcon className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-white tracking-wide truncate">
                      {activeItem.platform === "YouTube" ? "Timex Ceramic" : "timexceramic"}
                    </span>
                    <span className="text-[9px] text-gray-300/80 -mt-0.5">
                      {activeItem.platform === "YouTube" ? "YouTube Shorts" : "Instagram"}
                    </span>
                  </div>
                </div>

                {/* Badges & Actions */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-[2px] bg-[#C95745] text-white tracking-wider">
                    {activeItem.platform === "YouTube" ? "SHORTS" : "REEL"}
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
                  src={activeItem.thumbnail}
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

                {/* YouTube or Instagram Embed */}
                {activeItem.platform === "YouTube" ? (
                  <iframe
                    key={`yt-${activeItem.id}`}
                    src={activeItem.embedUrl}
                    title={`Timex Ceramic YouTube Shorts #${activeItem.order}`}
                    className="relative z-10 w-full h-full border-0 bg-transparent"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    key={`ig-${activeItem.id}`}
                    src={activeItem.embedUrl}
                    title={`Timex Ceramic Instagram ${activeItem.postType} #${activeItem.order}`}
                    className="relative z-10 w-full h-full border-0 bg-transparent"
                    allowTransparency={true}
                    allow="encrypted-media; picture-in-picture; autoplay"
                    scrolling="no"
                  />
                )}
              </div>

              {/* Modal Footer with Controls, Counter & Direct Link */}
              <div className="px-3.5 py-2.5 bg-[#0d152b] border-t border-white/10 flex items-center justify-between text-xs text-gray-300 shrink-0 gap-2">
                {/* Post Counter & Position */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-gray-300">
                    #{activeItem.order}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-[10.5px] text-gray-400">
                    {currentModalIndex >= 0
                      ? `${currentModalIndex + 1} of ${filteredItems.length}`
                      : ""}
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

                {/* Direct Action Link to Original Video */}
                <a
                  href={activeItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C95745] hover:bg-[#a84434] text-white text-[10.5px] font-semibold rounded-[2px] transition-colors shrink-0 shadow-sm"
                  title={`Open original on ${activeItem.platform}`}
                >
                  {activeItem.platform === "YouTube" ? (
                    <>
                      <YouTubeIcon className="w-3 h-3" />
                      <span className="hidden sm:inline">Watch on YouTube</span>
                      <span className="sm:hidden">YouTube</span>
                    </>
                  ) : (
                    <>
                      <InstagramIcon className="w-3 h-3" />
                      <span className="hidden sm:inline">Open on Instagram</span>
                      <span className="sm:hidden">Instagram</span>
                    </>
                  )}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Desktop Next Video Arrow (Flanking Right) */}
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
    </div>
  );
}
