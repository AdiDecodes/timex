"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { BLOG_POSTS, BlogPost } from "@/data/blogs";

const CATEGORIES = [
  "ALL ARTICLES",
  "TILE TRENDS",
  "DESIGN TIPS",
  "SPACES",
  "TILE MATERIALS",
  "PROJECTS",
] as const;

export function BlogJournalSection() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL ARTICLES");
  const [startIndex, setStartIndex] = useState<number>(0);
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);

  // Dynamic fetch from API if available to reflect CMS updates
  useEffect(() => {
    let isMounted = true;
    async function loadBlogs() {
      try {
        let res = await fetch(`/api/v1/blogs?_t=${Date.now()}`);
        if (!res.ok) {
          res = await fetch(`/api/blogs?_t=${Date.now()}`);
        }
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data.blogs) ? data.blogs : Array.isArray(data) ? data : null;
          if (items && items.length > 0 && isMounted) {
            setPosts(items);
          }
        }
      } catch {
        // Fall back gracefully to BLOG_POSTS already loaded
      }
    }
    loadBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter blog posts dynamically based on selected category & published status
  const filteredPosts = (() => {
    const published = posts.filter((p) => {
      if (p.status && p.status !== "Published") return false;
      if ((p as any).is_trashed || (p as any).isTrashed) return false;
      return true;
    });

    if (activeCategory === "ALL ARTICLES") {
      return published;
    }

    const matches = published.filter((p) => {
      const cat = (p.category || "").toUpperCase();
      const tags = Array.isArray(p.tags) ? p.tags.map((t) => t.toUpperCase()) : [];

      if (activeCategory === "TILE TRENDS") {
        return cat.includes("TREND") || tags.some((t) => t.includes("TREND"));
      }
      if (activeCategory === "DESIGN TIPS") {
        return cat.includes("DESIGN") || cat.includes("TIP") || tags.some((t) => t.includes("DESIGN") || t.includes("TIP"));
      }
      if (activeCategory === "SPACES") {
        return cat.includes("SPACE") || tags.some((t) => t.includes("SPACE") || t.includes("LIVING") || t.includes("BATHROOM") || t.includes("KITCHEN"));
      }
      if (activeCategory === "TILE MATERIALS") {
        return cat.includes("MATERIAL") || tags.some((t) => t.includes("MATERIAL") || t.includes("TILE") || t.includes("SLAB") || t.includes("PORCELAIN"));
      }
      if (activeCategory === "PROJECTS") {
        return cat.includes("PROJECT") || tags.some((t) => t.includes("PROJECT") || t.includes("ITALIAN"));
      }
      return cat.includes(activeCategory) || tags.some((t) => t.includes(activeCategory));
    });

    return matches.length > 0 ? matches : published;
  })();

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setStartIndex(0);
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => {
      if (prev + 4 < filteredPosts.length) {
        return prev + 1;
      }
      return prev;
    });
  };

  // Slice visible posts for the 4-card desktop display
  const visiblePosts = filteredPosts.slice(startIndex, startIndex + 4);

  // Top featured architectural post (matching reference screenshot)
  const featuredPost = posts.find((p) => p.slug === "2026-tile-design-trends") || posts[3] || posts[0];

  // Secondary teaser post for bottom CTA area
  const secondaryPost = posts.find((p) => p.slug === "how-to-choose-bathroom-tiles") || posts[4] || posts[1];

  return (
    <section className="py-20 md:py-24 lg:py-28 relative z-10 bg-[#F7F5F0] border-b border-[#EDEAE4] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        {/* ==================================================
            TOP TWO-COLUMN EDITORIAL HEADER
            ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 md:mb-16">
          
          {/* Left Column: Eyebrow, Heading, Description & Category Navigation */}
          <div className="lg:col-span-7 space-y-5">
            <Reveal direction="up">
              {/* Eyebrow with small horizontal divider */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C95745] font-sans">
                  DESIGN JOURNAL
                </span>
                <div className="h-[1px] w-12 sm:w-16 bg-[#333333]/25" />
              </div>

              {/* Editorial Heading */}
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-normal tracking-tight text-[#101B38] leading-[1.12]">
                Tile Trends. Design Ideas.<br className="hidden sm:inline" />
                Timeless Inspiration.
              </h2>
            </Reveal>

            {/* Description */}
            <Reveal direction="up" delay={0.1}>
              <p className="font-sans text-xs sm:text-sm text-[#333333]/75 font-normal leading-relaxed max-w-2xl">
                Stay inspired with the latest tile trends, interior design ideas and expert insights from Timex Ceramic. Explore premium imported ceramic and porcelain tiles, designer wall and floor tiles, large-format surfaces, mosaics, textures, colours and patterns for homes, commercial spaces and hospitality projects.
              </p>
            </Reveal>

            {/* Category Navigation Tabs */}
            <Reveal direction="up" delay={0.15}>
              <div className="pt-2">
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
                  {CATEGORIES.map((cat, idx) => {
                    const isActive = activeCategory === cat;
                    return (
                      <div key={cat} className="flex items-center shrink-0">
                        <button
                          onClick={() => handleCategoryChange(cat)}
                          className={`text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            isActive
                              ? "bg-[#101B38] text-[#FCFBF8] px-5 py-2 rounded-full shadow-xs"
                              : "text-[#666666] hover:text-[#101B38] px-2.5 py-1.5 rounded-[2px]"
                          }`}
                        >
                          {cat}
                        </button>
                        {/* Subtle divider between items */}
                        {idx < CATEGORIES.length - 1 && (
                          <span className="text-[#D0CBC4] select-none text-xs mx-1">|</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Large Featured Architectural Blog Card */}
          <div className="lg:col-span-5">
            <Reveal direction="up" delay={0.2}>
              <Link
                href={`/blogs/${featuredPost.slug}`}
                className="group block relative aspect-[16/11] sm:aspect-[4/3] lg:aspect-[16/11] w-full rounded-[2px] overflow-hidden border border-[#DED9D0] shadow-xs"
              >
                <Image
                  src="/uploads/products/ASCOT_BLANCO_20x60_AMAZONIA_GRIS_20x120_AMB-1.webp"
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Frosted Glass Badge in Bottom-Right Corner */}
                <div className="absolute bottom-4 right-4 z-10 bg-white/85 backdrop-blur-md px-5 py-4 rounded-[2px] border border-white/60 shadow-md text-right">
                  <div className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase text-[#333333] space-y-0.5 mb-2 leading-tight">
                    <div>IDEAS</div>
                    <div>TRENDS</div>
                    <div>SPACES</div>
                    <div>PEOPLE</div>
                  </div>
                  <div className="w-8 h-[1px] bg-[#333333]/30 ml-auto mb-2" />
                  <div className="text-[9px] sm:text-[10px] font-semibold tracking-[0.16em] uppercase text-[#333333]/85 leading-tight">
                    A MORE BEAUTIFUL<br />TOMORROW
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>

        {/* ==================================================
            BLOG ARTICLE GRID & RIGHT EDITORIAL PANEL
            ================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch mb-12 md:mb-16">
          
          {/* 4 Article Cards */}
          {visiblePosts.map((post, idx) => (
            <Reveal key={post.slug} direction="up" delay={idx * 0.06} className="h-full">
              <Link href={`/blogs/${post.slug}`} className="block group h-full">
                <div className="bg-white rounded-[2px] overflow-hidden border border-[#DED9D0] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
                  {/* Article Thumbnail */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge at bottom-left */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="bg-white text-[#101B38] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-[2px] shadow-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div className="space-y-2.5">
                      <h3 className="font-serif text-lg sm:text-[19px] font-normal text-[#101B38] leading-[1.25] group-hover:text-[#C95745] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="font-sans text-xs text-[#555555] font-normal leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* READ MORE CTA */}
                    <div className="pt-4 mt-4 border-t border-[#EDEAE4]/60">
                      <span className="text-xs font-semibold text-[#101B38] group-hover:text-[#C95745] tracking-wider uppercase inline-flex items-center gap-1.5 transition-colors font-sans pb-1.5 border-b border-[#EDEAE4] group-hover:border-[#C95745]">
                        <span>READ MORE</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}

          {/* Right-Side Editorial Quote & Navigation Panel */}
          <Reveal direction="up" delay={0.24} className="h-full sm:col-span-2 lg:col-span-1">
            <div className="bg-transparent border border-[#DED9D0] lg:border-0 lg:border-l lg:border-[#DED9D0] p-6 lg:pl-6 lg:pr-2 flex flex-col justify-between h-full rounded-[2px] lg:rounded-none">
              
              {/* Previous / Next Arrow Controls */}
              <div className="flex items-center justify-end space-x-2 mb-6">
                <button
                  onClick={handlePrev}
                  disabled={startIndex === 0}
                  aria-label="Previous articles"
                  className={`w-8 h-8 rounded-full border border-[#DED9D0] flex items-center justify-center transition-all ${
                    startIndex === 0
                      ? "opacity-40 cursor-not-allowed text-gray-400"
                      : "hover:border-[#101B38] hover:bg-[#101B38] hover:text-white text-[#101B38] cursor-pointer"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={startIndex + 4 >= filteredPosts.length}
                  aria-label="Next articles"
                  className={`w-8 h-8 rounded-full border border-[#DED9D0] flex items-center justify-center transition-all ${
                    startIndex + 4 >= filteredPosts.length
                      ? "opacity-40 cursor-not-allowed text-gray-400"
                      : "hover:border-[#101B38] hover:bg-[#101B38] hover:text-white text-[#101B38] cursor-pointer"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Middle: Editorial Quote */}
              <div className="my-auto py-2">
                <div className="w-8 h-[1px] bg-[#333333]/30 mb-4" />
                <blockquote className="font-serif italic text-base sm:text-[17px] text-[#333333] leading-relaxed mb-4">
                  “Great spaces begin with inspiring ideas.”
                </blockquote>
                <div className="text-[10px] font-bold tracking-[0.2em] text-[#C95745] uppercase font-sans mb-4">
                  TIMEX CERAMIC
                </div>
                <div className="w-full h-[1px] bg-[#333333]/15" />
              </div>

              {/* Bottom: Subtle Editorial Brand Stamp */}
              <div className="hidden lg:block pt-4">
                <div className="text-[9px] uppercase tracking-[0.2em] text-[#333333]/40">
                  JOURNAL ED. {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ==================================================
            BOTTOM EDITORIAL CTA AREA
            ================================================== */}
        <Reveal direction="up" delay={0.3}>
          <div className="border-t border-[#DED9D0] pt-8 sm:pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Tagline */}
            <div className="text-center md:text-left">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#C95745]">
                LATEST STORIES.
              </div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#C95745]">
                BIGGER POSSIBILITIES.
              </div>
            </div>

            {/* Center: EXPLORE ALL ARTICLES CTA Button */}
            <div className="text-center">
              <Link
                href="/blogs"
                className="group text-xs font-semibold text-[#101B38] hover:text-[#C95745] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors font-sans pb-2 border-b border-[#D8D3C8] hover:border-[#C95745]"
              >
                <span>EXPLORE ALL ARTICLES</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Right: Secondary Teaser Card */}
            <div className="text-center md:text-right">
              <Link
                href={`/blogs/${secondaryPost.slug}`}
                className="group inline-flex items-center space-x-3.5 bg-white border border-[#DED9D0] p-2.5 sm:p-3 rounded-[2px] hover:border-[#101B38]/50 transition-all shadow-xs text-left"
              >
                <div className="relative w-12 h-12 rounded-[2px] overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={secondaryPost.coverImage}
                    alt={secondaryPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="pr-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#101B38]">
                    TILES INSPIRE
                  </div>
                  <div className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#666666]">
                    BETTER LIVING
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
