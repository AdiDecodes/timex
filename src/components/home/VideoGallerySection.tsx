"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";

interface VideoItem {
  id: string;
  title: string;
  speaker: string;
  subtitle: string;
  category: "TILE TALK" | "EXPERT INSIGHTS" | "DESIGNER STORIES" | "PRODUCT SPOTLIGHT";
  duration: string;
  quote?: string;
  thumbnail: string;
  videoUrl: string;
  objectPosition?: string;
}

const VIDEOS: VideoItem[] = [
  {
    id: "vid-1",
    title: "Riddhi Gandhi on Timeless Tile Design & Interior Trends",
    speaker: "Riddhi Gandhi",
    subtitle: "Interior Designer | Tile Talk",
    category: "TILE TALK",
    duration: "05:32",
    quote: "Good design always stays relevant.",
    thumbnail: "https://img.youtube.com/vi/xToE8sfQeIo/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/xToE8sfQeIo?autoplay=1",
    objectPosition: "center",
  },
  {
    id: "vid-2",
    title: "Purvi Shah on Choosing Tiles for Beautiful Interiors",
    speaker: "Purvi Shah",
    subtitle: "Interior Designer | Tile Talk",
    category: "TILE TALK",
    duration: "04:58",
    quote: "Tiles can completely transform a space.",
    thumbnail: "https://img.youtube.com/vi/REYspAHpm1w/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/REYspAHpm1w?autoplay=1",
    objectPosition: "center",
  },
  {
    id: "vid-3",
    title: "Shimona Bhansali on Bold Tile Patterns & Personal Style",
    speaker: "Shimona Bhansali",
    subtitle: "Interior Designer | Designer Stories",
    category: "DESIGNER STORIES",
    duration: "07:12",
    quote: "Bold patterns reflect personality.",
    thumbnail: "https://img.youtube.com/vi/c75EapCPXI8/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/c75EapCPXI8?autoplay=1",
    objectPosition: "center",
  },
  {
    id: "vid-4",
    title: "Ketan & Manisha Sheth on Tile Selection for Project Excellence",
    speaker: "Ketan & Manisha Sheth",
    subtitle: "Project Consultants | Expert Insights",
    category: "EXPERT INSIGHTS",
    duration: "07:12",
    quote: "The right tiles make projects stand out.",
    thumbnail: "https://img.youtube.com/vi/Nk-otcOwx0w/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/Nk-otcOwx0w?autoplay=1",
    objectPosition: "center",
  },
  {
    id: "vid-5",
    title: "Italian Marble Slabs & Contemporary Surface Trends",
    speaker: "Surface Specialist",
    subtitle: "Surface Specialist | Tile Trends",
    category: "EXPERT INSIGHTS",
    duration: "04:20",
    quote: "Luxury lies in texture and precision.",
    thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    objectPosition: "center center",
  },
  {
    id: "vid-6",
    title: "Mastering 2mm Precision Grout Lines & Seamless Leveling",
    speaker: "Master Installer",
    subtitle: "Master Installer | How To Guide",
    category: "EXPERT INSIGHTS",
    duration: "06:15",
    quote: "Flawless alignment defines true craft.",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    objectPosition: "center center",
  },
  {
    id: "vid-7",
    title: "Behind The Scenes: Sourcing Global Tiles in Italy & Spain",
    speaker: "Curator Reel",
    subtitle: "Curator Reel | Timex Global",
    category: "TILE TALK",
    duration: "05:40",
    quote: "Curating excellence across oceans.",
    thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    objectPosition: "center center",
  },
  {
    id: "vid-8",
    title: "Minimalist Master Bath Sanctuary & Spa Living",
    speaker: "Architectural Tour",
    subtitle: "Architectural Tour | Real Spaces",
    category: "DESIGNER STORIES",
    duration: "03:50",
    quote: "Serene surfaces for modern living.",
    thumbnail: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/YAXjBdbq6YE?autoplay=1",
    objectPosition: "center center",
  },
];

export function VideoGallerySection() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <section className="py-20 md:py-24 lg:py-28 relative z-10 bg-[#F7F5F0] border-b border-[#EDEAE4] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* 1. Header Layout: Left Editorial + Right Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-12 sm:mb-16">
          {/* Left Side: Eyebrow, Heading, Description */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
            {/* Eyebrow with separator */}
            <Reveal direction="up">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C95745] font-sans">
                  TILE TALK
                </span>
                <div className="h-[1px] w-8 sm:w-10 bg-[#C95745]/30" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#C95745] font-sans">
                  DESIGN &amp; EXPERT INSIGHTS
                </span>
              </div>
            </Reveal>

            {/* Heading */}
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#101B38] leading-[1.15] mb-5 sm:mb-6">
                Ideas. Insights. Inspiration.
              </h2>
            </Reveal>

            {/* Description */}
            <Reveal direction="up" delay={0.15}>
              <p className="font-sans text-xs sm:text-sm text-[#333333]/75 font-normal leading-relaxed max-w-xl">
                Discover expert insights, tile design ideas, latest tile trends and
                conversations with architects and interior designers. Explore practical
                guidance on choosing premium imported tiles, designer wall tiles, floor
                tiles, textures, colours and finishes for residential, commercial and
                hospitality spaces.
              </p>
            </Reveal>
          </div>

          {/* Right Side: Editorial Feature Panel */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
            <Reveal direction="up" delay={0.2} className="h-full">
              <div className="bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-6 sm:p-8 flex flex-col justify-center h-full shadow-xs">
                <h3 className="font-serif text-2xl sm:text-[26px] font-normal text-[#101B38] mb-3 leading-snug">
                  Design Conversations That Matter.
                </h3>
                <p className="font-sans text-xs sm:text-[13px] text-[#333333]/70 font-light leading-relaxed">
                  From emerging tile trends and material inspiration to expert advice on
                  selecting the right surfaces, discover videos created for architects,
                  interior designers, builders and design enthusiasts.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 2. Video Card Grid (2 Columns × 2 Rows on Desktop & Tablet) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {VIDEOS.slice(0, 4).map((video, idx) => (
            <Reveal
              key={video.id}
              direction="up"
              delay={idx * 0.05}
              className="h-full"
            >
              <div
                onClick={() => setActiveVideo(video)}
                className="bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] overflow-hidden flex flex-col h-full shadow-xs hover:shadow-lg hover:border-[#101B38]/30 transition-all duration-300 group cursor-pointer"
              >
                {/* Large Video Thumbnail Area */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#FCFBF8]">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: video.objectPosition || "center",
                    }}
                    className="w-full h-full scale-[1.02] transition-transform duration-700 ease-out group-hover:scale-108"
                    priority={idx < 4}
                  />

                  {/* Centered Circular Play Button */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#101B38] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#C95745] group-hover:text-white transition-all duration-300">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Light Content Area */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <h4 className="font-serif text-sm sm:text-[15px] font-normal text-[#101B38] group-hover:text-[#C95745] transition-colors leading-snug line-clamp-2 mb-2">
                      {video.title}
                    </h4>
                    <p className="font-sans text-[11px] text-[#333333]/65 font-light line-clamp-1">
                      {video.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 3. Bottom Brand & Pagination Row */}
        <div className="mt-12 sm:mt-14 pt-6 border-t border-[#EDEAE4] flex items-center justify-between">
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-[#333333]/50">
            TIMEX CERAMIC
          </span>
          <div className="flex items-center gap-4">
            <span className="font-sans text-xs text-[#333333]/70 tracking-wider">
              01 / 04
            </span>
            <div className="flex items-center gap-1.5">
              <button
                className="w-8 h-8 rounded-full border border-[#EDEAE4] flex items-center justify-center text-[#101B38] hover:border-[#101B38] hover:bg-[#101B38] hover:text-white transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="w-8 h-8 rounded-full border border-[#EDEAE4] flex items-center justify-center text-[#101B38] hover:border-[#101B38] hover:bg-[#101B38] hover:text-white transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Player Portal */}
      {mounted && activeVideo && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/90 backdrop-blur-md animate-fade-in"
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
            className="relative w-full max-w-4xl bg-[#101B38] rounded-[2px] overflow-hidden shadow-2xl border border-white/20 z-[99999]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 bg-[#101B38] text-[#FCFBF8] border-b border-white/10">
              <div className="pr-8">
                <span className="text-[10px] text-[#C95745] font-semibold uppercase tracking-wider block">
                  {videoSubtitleClean(activeVideo.subtitle)}
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

            {/* Video iFrame / Embed */}
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

function videoSubtitleClean(subtitle: string): string {
  return subtitle || "TILE TALK";
}
