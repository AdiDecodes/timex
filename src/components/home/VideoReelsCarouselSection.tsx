"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, X, Film, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";

interface ReelItem {
  id: string;
  title: string;
  tagline: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  badgeStyle: string;
}

const CATEGORIES = [
  "ALL VIDEOS",
  "PRODUCT HIGHLIGHTS",
  "DESIGN TIPS",
  "TRENDS",
  "REAL SPACES",
  "HOW TO",
  "BEHIND THE SCENES",
] as const;

const REELS: ReelItem[] = [
  {
    id: "reel-1",
    title: "Who says subway tiles are just for walls?",
    tagline: "Creative ways to use subway tiles beyond the ordinary.",
    thumbnail: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=480&q=70",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    duration: "01:28",
    category: "DESIGN TIPS",
    badgeStyle: "bg-[#E3EFE9] text-[#2D5A43]",
  },
  {
    id: "reel-2",
    title: "Is it really a tile?",
    tagline: "Watch to uncover the truth about high-durability vitrified slabs.",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=480&q=70",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    duration: "01:52",
    category: "PRODUCT HIGHLIGHTS",
    badgeStyle: "bg-[#FCEEE5] text-[#914D28]",
  },
  {
    id: "reel-3",
    title: "How we bring designs to life at Timex Ceramic",
    tagline: "A peek behind the process, Italian artistry, and passionate craftsmen.",
    thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=480&q=70",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    duration: "01:05",
    category: "BEHIND THE SCENES",
    badgeStyle: "bg-[#ECE8F5] text-[#553E8A]",
  },
  {
    id: "reel-4",
    title: "Modern kitchens with timeless tiles",
    tagline: "Explore looks that combine functionality with lasting architectural beauty.",
    thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=480&q=70",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    duration: "01:37",
    category: "REAL SPACES",
    badgeStyle: "bg-[#F8F2DE] text-[#7A6016]",
  },
  {
    id: "reel-5",
    title: "Top tile trends to watch in 2026",
    tagline: "Stay ahead with the latest large-format styles shaping luxury spaces.",
    thumbnail: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=480&q=70",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    duration: "01:18",
    category: "TRENDS",
    badgeStyle: "bg-[#E5EFF8] text-[#27537E]",
  },
  {
    id: "reel-6",
    title: "Seamless 2mm grout spacing & alignment",
    tagline: "Master craftsmen guide to perfect slab leveling and zero-lip installation.",
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=480&q=70",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    duration: "01:45",
    category: "HOW TO",
    badgeStyle: "bg-[#F5EAE6] text-[#863D2F]",
  },
  {
    id: "reel-7",
    title: "Extreme Durability & Flame Test",
    tagline: "Watch scratch, stain, and heat resistance on polished porcelain.",
    thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=480&q=70",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    duration: "00:58",
    category: "PRODUCT HIGHLIGHTS",
    badgeStyle: "bg-[#FCEEE5] text-[#914D28]",
  },
  {
    id: "reel-8",
    title: "Minimalist Master Bath Sanctuary",
    tagline: "Transforming residential bathroom layouts into serene spa retreats.",
    thumbnail: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=480&q=70",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    duration: "01:24",
    category: "REAL SPACES",
    badgeStyle: "bg-[#F8F2DE] text-[#7A6016]",
  },
  {
    id: "reel-9",
    title: "Warm Earth Tones & Fluted Accents",
    tagline: "Balancing neutral porcelain floor slabs with tactile accent walls.",
    thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=480&q=70",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    duration: "01:15",
    category: "DESIGN TIPS",
    badgeStyle: "bg-[#E3EFE9] text-[#2D5A43]",
  },
];

export function VideoReelsCarouselSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL VIDEOS");
  const [activeVideo, setActiveVideo] = useState<ReelItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter reels based on selected category tab
  const filteredReels =
    selectedCategory === "ALL VIDEOS"
      ? REELS
      : REELS.filter((r) => r.category.toUpperCase() === selectedCategory.toUpperCase());

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    if (activeVideo) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 sm:py-28 relative z-10 bg-[#EDEAE4] overflow-hidden border-t border-b border-[#DED9D0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-12">
          {/* Eyebrow Label with subtle horizontal accent lines */}
          <Reveal direction="up">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 sm:w-12 h-[1px] bg-[#C95745]" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#C95745] uppercase">
                TILE INSPIRATION | DESIGN IDEAS &amp; TRENDS
              </span>
              <div className="w-8 sm:w-12 h-[1px] bg-[#C95745]" />
            </div>
          </Reveal>

          {/* Large Title */}
          <Reveal direction="up" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#101B38] tracking-tight font-serif">
              Tile Design Ideas, Trends &amp; Inspiration<span className="text-[#C95745]">.</span>
            </h2>
          </Reveal>

          {/* Subtitle */}
          <Reveal direction="up" delay={0.2}>
            <p className="text-xs sm:text-sm text-[#333333] max-w-2xl mx-auto font-normal leading-relaxed">
              Get inspired by premium imported tiles, designer wall and floor tiles, ceramic and porcelain tiles through expert videos, product highlights and real-space ideas. Discover practical tile selection tips, interior design trends, textures, patterns, colours and finishes for homes, commercial spaces and hospitality projects.
            </p>
          </Reveal>
        </div>

        {/* 2. Category Filter Tabs */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-start md:justify-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 px-2 max-w-5xl mx-auto">
            {CATEGORIES.map((category, idx) => {
              const isActive = selectedCategory === category;
              return (
                <div key={category} className="flex items-center shrink-0">
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 sm:px-5 py-2 rounded-[2px] text-[11px] sm:text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#101B38] text-[#FCFBF8] shadow-sm"
                        : "text-[#333333] hover:text-[#C95745] bg-transparent"
                    }`}
                  >
                    {category}
                  </button>
                  {idx < CATEGORIES.length - 1 && (
                    <span className="text-[#DED9D0] mx-1 sm:mx-2 select-none text-xs">|</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Horizontal Carousel with Left & Right Navigation Arrows */}
        <div className="relative py-2">
          {/* Left Arrow Button */}
          <button
            onClick={handleScrollLeft}
            className="absolute -left-2 sm:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-[2px] bg-[#FCFBF8] backdrop-blur shadow-md border border-[#DED9D0] flex items-center justify-center text-[#101B38] hover:text-[#FCFBF8] hover:bg-[#C95745] hover:border-[#C95745] transition-all duration-300 cursor-pointer focus:outline-none"
            aria-label="Previous videos"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-4 px-2 snap-x snap-mandatory"
          >
            {filteredReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => setActiveVideo(reel)}
                className="w-[230px] sm:w-[250px] lg:w-[255px] h-[430px] sm:h-[460px] shrink-0 rounded-[2px] overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 bg-[#101B38] select-none snap-start flex flex-col justify-between"
              >
                {/* Background Image Thumbnail */}
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle Gradient Overlays for contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />

                {/* Top Category Tag Badge */}
                <div className="relative z-20 p-4">
                  <span
                    className={`text-[9.5px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-[2px] shadow-sm ${reel.badgeStyle}`}
                  >
                    {reel.category}
                  </span>
                </div>

                {/* Center Circular Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/95 text-[#101B38] flex items-center justify-center shadow-xl transform transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-5 h-5 fill-[#101B38] translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Information (Duration, Title, Description, Progress Line) */}
                <div className="relative z-20 p-4 space-y-2 text-[#FCFBF8]">
                  {/* Duration Badge */}
                  <div className="w-fit">
                    <span className="text-[10px] font-medium text-white/95 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-[2px]">
                      {reel.duration}
                    </span>
                  </div>

                  {/* Reel Title */}
                  <h3 className="font-serif font-normal text-sm sm:text-[15px] text-[#FCFBF8] leading-snug line-clamp-2 drop-shadow-sm group-hover:text-[#EDEAE4] transition-colors">
                    {reel.title}
                  </h3>

                  {/* Reel Tagline / Short Description */}
                  <p className="text-[11px] text-[#EDEAE4]/80 font-light line-clamp-2 leading-relaxed">
                    {reel.tagline}
                  </p>

                  {/* Subtle Reel Progress Accent Line */}
                  <div className="pt-2">
                    <div className="w-10 h-0.5 bg-[#C95745] rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleScrollRight}
            className="absolute -right-2 sm:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-[2px] bg-[#FCFBF8] backdrop-blur shadow-md border border-[#DED9D0] flex items-center justify-center text-[#101B38] hover:text-[#FCFBF8] hover:bg-[#C95745] hover:border-[#C95745] transition-all duration-300 cursor-pointer focus:outline-none"
            aria-label="Next videos"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 4. Bottom CTA Area */}
        <div className="max-w-6xl mx-auto mt-12 sm:mt-14">
          <div className="bg-[#FCFBF8] rounded-[2px] border border-[#DED9D0] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative">
            {/* Left side: Clapperboard Icon + Copy */}
            <div className="flex items-center gap-4 sm:gap-6 z-10 text-center md:text-left flex-col sm:flex-row">
              <div className="w-14 h-14 rounded-[2px] border border-[#C95745] bg-[#F7F5F0] flex items-center justify-center text-[#C95745] shrink-0 shadow-sm">
                <Film className="w-6 h-6 text-[#C95745]" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#101B38] tracking-tight">
                  More videos. More inspiration.
                </h3>
                <p className="text-xs sm:text-sm text-[#333333] mt-1 max-w-md font-light">
                  Explore our collection of short videos and find ideas that inspire your next project.
                </p>
              </div>
            </div>

            {/* Right side: View All Videos Button & Ceramic Styling Accent */}
            <div className="flex items-center gap-6 z-10 w-full md:w-auto justify-center md:justify-end">
              <Link href="/inspiration" className="w-full sm:w-auto text-center">
                <button className="w-full sm:w-auto bg-[#101B38] text-[#FCFBF8] hover:bg-[#C95745] transition-all duration-300 px-7 py-3 rounded-[2px] text-xs font-medium uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                  <span>View All Videos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              {/* Decorative ceramic decor thumbnail */}
              <div className="hidden lg:block relative w-28 h-18 shrink-0 overflow-hidden rounded-[2px] border border-[#DED9D0] shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=300&q=80"
                  alt="Ceramic Styling Inspiration"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Video Modal Lightbox Overlay Portal */}
      {mounted && activeVideo && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          {/* Always Visible Fixed Floating Close (×) Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveVideo(null);
            }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[100000] w-11 h-11 sm:w-12 sm:h-12 rounded-[2px] bg-[#101B38]/95 text-[#FCFBF8] hover:bg-[#C95745] hover:text-[#FCFBF8] border border-white/30 hover:border-[#C95745] shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C95745]"
            aria-label="Close video"
            title="Close video (Esc)"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div
            className="relative w-full max-w-3xl bg-[#101B38] rounded-[2px] overflow-hidden shadow-2xl border border-white/20 z-[99999]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 bg-[#101B38] text-white border-b border-white/10">
              <div className="pr-8">
                <span className="text-[10px] text-[#C95745] font-semibold uppercase tracking-wider block">
                  {activeVideo.category}
                </span>
                <h4 className="font-sans text-xs sm:text-sm font-medium text-[#FCFBF8] line-clamp-1">
                  {activeVideo.title}
                </h4>
              </div>

              <button
                onClick={() => setActiveVideo(null)}
                className="flex-shrink-0 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Iframe */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
