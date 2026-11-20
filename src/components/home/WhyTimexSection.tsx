"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  ArrowLeft,
  Quote,
  Plus,
  Globe,
  ShieldCheck,
  Palette,
  Maximize2,
  Handshake,
  Headphones,
  Star,
  ExternalLink
} from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";

interface FeatureCard {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FEATURES: FeatureCard[] = [
  {
    id: "curated-global",
    number: "01",
    category: "CURATED GLOBAL COLLECTIONS",
    title: "Premium Imported Tiles",
    description: "Explore a carefully selected range of imported ceramic and porcelain tiles from Spain, Italy, China and Turkey, bringing global design trends and distinctive aesthetics to Indian spaces.",
    icon: Globe,
  },
  {
    id: "premium-quality",
    number: "02",
    category: "PREMIUM QUALITY",
    title: "Quality You Can Rely On",
    description: "Choose premium wall and floor tiles designed to combine refined aesthetics, dependable performance and lasting appeal for demanding residential and commercial applications.",
    icon: ShieldCheck,
  },
  {
    id: "unmatched-variety",
    number: "03",
    category: "UNMATCHED VARIETY",
    title: "Endless Tile Designs",
    description: "Discover a diverse selection of designer tile collections, patterns, textures, colours, finishes and formats to suit contemporary, classic and statement-making interiors.",
    icon: Palette,
  },
  {
    id: "large-format",
    number: "04",
    category: "LARGE FORMAT SPECIALISTS",
    title: "Seamless Architectural Surfaces",
    description: "Create sophisticated interiors with large format porcelain tiles and large format wall and floor tiles, ideal for expansive residential, commercial and hospitality spaces.",
    icon: Maximize2,
  },
  {
    id: "reliable-partnership",
    number: "05",
    category: "RELIABLE PARTNERSHIP",
    title: "A Trusted Tile Partner",
    description: "From product selection to project requirements, Timex Ceramic provides reliable tile solutions, consistent availability and dedicated support for architects, designers, builders and project professionals.",
    icon: Handshake,
  },
  {
    id: "designer-support",
    number: "06",
    category: "DESIGNER SUPPORT",
    title: "Expert Guidance for Every Project",
    description: "Get expert assistance with tile selection, design requirements and project specifications, helping you find the right surfaces for residential, commercial and hospitality projects.",
    icon: Headphones,
  },
];

const GOOGLE_REVIEWS_URL = 
  "https://www.google.com/search?q=timexceramic&oq=t&gs_lcrp=EgZjaHJvbWUqBggBEEUYOzIGCAAQRRg8MgYIARBFGDsyBggCEEUYOTIGCAMQRRg8MgYIBBBFGDwyBggFEEUYPTIGCAYQRRg8MgYIBxBFGDzSAQgxMzI4ajBqN6gCALACAA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x3be7c9b3e533a15f:0x187d9dba2b1a4f6b,1,,,,";

const TESTIMONIALS = [
  {
    quote: "I recently came across Timex Ceramics, and I must say, they’ve exceeded my expectations in every way. Their ceramic tiles are not only visually stunning but also incredibly durable. The finish is smooth, the designs are elegant, and the quality speaks for itself. What stands out most is their attention to detail and innovation — every product feels thoughtfully made to suit both modern and classic interiors. The customer service is equally impressive — professional, responsive, and genuinely helpful throughout the entire process.",
    author: "TNT Gamerz",
    role: "Google Review · 3 reviews",
    date: "11 months ago",
    rating: 5,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    showroomLabel: "Timex Experience Centre, Mumbai",
  },
  {
    quote: "Excellent collection of Indians as well as imported tiles. A variety of beautiful designs and patterns. Recommended for the highend projects.",
    author: "Rahul Sakpal",
    role: "Google Review · Local Guide (106 reviews)",
    date: "7 months ago",
    rating: 5,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    showroomLabel: "Timex Flagship Studio",
  },
  {
    quote: "Id visited Timex for an upcoming site! Their new collection every year never fail to amaze me! This year was phenomenal! The quality and the colours! The vibe is another level altogether! Must visit!",
    author: "Gaurav Gupta",
    role: "Google Review · 5 reviews",
    date: "11 months ago",
    rating: 5,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    showroomLabel: "Timex Design Gallery",
  },
  {
    quote: "Excellent collection, helpful staff, value for money, Timex is trend setter in Indian ceramic ind. You will always get best quality and luxurious premium range of IMP tiles, Well done Team Timex.",
    author: "ANIL YADAV",
    role: "Google Review · 4 reviews",
    date: "2 years ago",
    rating: 5,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    showroomLabel: "Timex Experience Centre, Mumbai",
  },
  {
    quote: "Visiting the Timex Tile showroom was a delightful experience. The showroom is well-organized, with a wide selection of tiles displayed in various styles and designs. I highly recommend the Timex Tile showroom for anyone in need of high-quality tiles and excellent customer service.",
    author: "Bava Mangadan",
    role: "Google Review · 3 reviews",
    date: "2 years ago",
    rating: 5,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    showroomLabel: "Timex Flagship Studio",
  },
  {
    quote: "Loved the variety of various tiles. Their irazu and flagstone series are the ones you could choose blindly for elevation. Must visit once!!",
    author: "Yash Mahindrakar",
    role: "Google Review · 7 reviews",
    date: "11 months ago",
    rating: 5,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    showroomLabel: "Timex Design Gallery",
  },
];

export function WhyTimexSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMainExpanded, setIsMainExpanded] = useState(false);

  // 6 Points Carousel Slider State
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isFeaturePaused, setIsFeaturePaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Dynamically calculate visible cards for desktop (3), tablet (2), and mobile (1)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxFeatureIndex = Math.max(0, FEATURES.length - visibleCount);

  // Keep index within bounds on resize
  useEffect(() => {
    if (currentFeatureIndex > maxFeatureIndex) {
      setCurrentFeatureIndex(maxFeatureIndex);
    }
  }, [visibleCount, maxFeatureIndex, currentFeatureIndex]);

  const nextFeature = () => {
    setCurrentFeatureIndex((prev) => (prev >= maxFeatureIndex ? 0 : prev + 1));
  };

  const prevFeature = () => {
    setCurrentFeatureIndex((prev) => (prev <= 0 ? maxFeatureIndex : prev - 1));
  };

  // Autoplay with pause on hover/interaction
  useEffect(() => {
    if (isFeaturePaused) return;
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev >= maxFeatureIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isFeaturePaused, maxFeatureIndex]);

  // Mobile Touch / Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsFeaturePaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 45) {
        nextFeature();
      } else if (diff < -45) {
        prevFeature();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsFeaturePaused(false);
  };

  // Extended reviews array with clones for seamless infinite looping
  const extendedReviews = [
    TESTIMONIALS[TESTIMONIALS.length - 1],
    ...TESTIMONIALS,
    TESTIMONIALS[0],
  ];

  const [slideIndex, setSlideIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isReviewPaused, setIsReviewPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const reviewTouchStartX = useRef<number | null>(null);
  const reviewTouchEndX = useRef<number | null>(null);

  // Calculate real 0-indexed review index for counter & right photo block
  const realActiveIndex = 
    slideIndex === 0 
      ? TESTIMONIALS.length - 1 
      : slideIndex === extendedReviews.length - 1 
        ? 0 
        : slideIndex - 1;

  const currentTestimonial = TESTIMONIALS[realActiveIndex] || TESTIMONIALS[0];

  // Listen for prefers-reduced-motion accessibility preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const nextSlide = () => {
    setIsTransitioning(true);
    setSlideIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setSlideIndex((prev) => prev - 1);
  };

  const handleSlideTransitionEnd = () => {
    if (slideIndex >= extendedReviews.length - 1) {
      setIsTransitioning(false);
      setSlideIndex(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    } else if (slideIndex <= 0) {
      setIsTransitioning(false);
      setSlideIndex(TESTIMONIALS.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  // Automatic scrolling interval: 5 seconds, pauses on hover/touch or reduced motion
  useEffect(() => {
    if (isReviewPaused || prefersReducedMotion) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isReviewPaused, prefersReducedMotion, slideIndex]);

  // Touch Swipe Handlers for Reviews Carousel
  const handleReviewTouchStart = (e: React.TouchEvent) => {
    setIsReviewPaused(true);
    reviewTouchStartX.current = e.targetTouches[0].clientX;
    reviewTouchEndX.current = null;
  };

  const handleReviewTouchMove = (e: React.TouchEvent) => {
    reviewTouchEndX.current = e.targetTouches[0].clientX;
  };

  const handleReviewTouchEnd = () => {
    if (reviewTouchStartX.current !== null && reviewTouchEndX.current !== null) {
      const diff = reviewTouchStartX.current - reviewTouchEndX.current;
      if (diff > 45) {
        nextSlide();
      } else if (diff < -45) {
        prevSlide();
      }
    }
    reviewTouchStartX.current = null;
    reviewTouchEndX.current = null;
    setIsReviewPaused(false);
  };

  return (
    <section className="py-20 md:py-28 relative z-10 bg-[#EDEAE4] border-b border-[#DED9D0] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* 1. Wide Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-3xl">
            {/* Eyebrow with subtle horizontal divider line */}
            <Reveal direction="up">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C95745] font-sans">
                  WHY DESIGNERS CHOOSE TIMEX CERAMIC
                </span>
                <div className="h-[1px] w-12 sm:w-16 bg-[#333333]/25" />
              </div>
            </Reveal>

            {/* Heading */}
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#101B38] leading-[1.15] mb-5 sm:mb-6">
                Designed for Possibilities. Trusted for <br className="hidden sm:inline" />
                Performance.
              </h2>
            </Reveal>

            {/* Existing Introduction Paragraph */}
            <Reveal direction="up" delay={0.15}>
              <p className="font-sans text-xs sm:text-sm text-[#333333]/75 font-normal leading-relaxed max-w-3xl">
                For over 22 years, Timex Ceramic has been a trusted name in premium imported tiles in India, offering a carefully curated range of ceramic and porcelain wall and floor tiles for residential, commercial and hospitality spaces. From globally inspired designs to dependable quality and expert support, we help architects, interior designers, builders and developers bring exceptional spaces to life.
              </p>
            </Reveal>
          </div>

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-2.5 pb-1 flex-shrink-0">
            <button
              onClick={prevFeature}
              aria-label="Previous point"
              className="w-10 h-10 rounded-[2px] bg-[#FCFBF8] border border-[#DED9D0] text-[#101B38] shadow-xs flex items-center justify-center hover:bg-[#C95745] hover:text-[#FCFBF8] hover:border-[#C95745] transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextFeature}
              aria-label="Next point"
              className="w-10 h-10 rounded-[2px] bg-[#FCFBF8] border border-[#DED9D0] text-[#101B38] shadow-xs flex items-center justify-center hover:bg-[#C95745] hover:text-[#FCFBF8] hover:border-[#C95745] transition-all duration-300 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. 6 Feature Cards: Responsive Horizontal Slider */}
        <div
          className="relative"
          onMouseEnter={() => setIsFeaturePaused(true)}
          onMouseLeave={() => setIsFeaturePaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slider Viewport */}
          <div className="overflow-hidden -mx-3 px-3 py-2">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentFeatureIndex * (100 / visibleCount)}%)`,
              }}
            >
              {FEATURES.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3 flex flex-col"
                  >
                    <div className="bg-[#FCFBF8] border border-[#DED9D0] rounded-[2px] p-6 sm:p-7 md:p-8 flex flex-col justify-between h-full min-h-[340px] sm:min-h-[360px] md:min-h-[380px] shadow-xs hover:shadow-md hover:border-[#101B38]/30 transition-all duration-300 group">
                      <div>
                        {/* Top Row: Category on left, number on right */}
                        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
                          <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#101B38]">
                            {feature.category}
                          </span>
                          <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-[#333333]/50">
                            {feature.number}
                          </span>
                        </div>

                        {/* Subtle horizontal divider */}
                        <div className="h-[1px] w-full bg-[#EDEAE4] mb-5 sm:mb-6" />

                        {/* Icon neatly positioned above Title */}
                        <div className="w-10 h-10 rounded-[2px] bg-[#EDEAE4]/70 border border-[#DED9D0]/80 flex items-center justify-center text-[#C95745] mb-4 sm:mb-5 group-hover:bg-[#C95745] group-hover:text-[#FCFBF8] group-hover:border-[#C95745] transition-all duration-300">
                          <IconComponent className="w-5 h-5 stroke-[1.75]" />
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#101B38] mb-3 leading-snug group-hover:text-[#C95745] transition-colors">
                          {feature.title}
                        </h3>

                        {/* Description */}
                        <p className="font-sans text-xs sm:text-[13px] text-[#333333]/70 font-light leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Slider Navigation Controls (Accessible on Mobile & Desktop) */}
          <div className="mt-8 flex items-center justify-center gap-4 relative">
            {/* Prev Arrow */}
            <button
              onClick={prevFeature}
              aria-label="Previous point"
              className="w-10 h-10 rounded-[2px] bg-[#FCFBF8] border border-[#DED9D0] text-[#101B38] shadow-xs flex items-center justify-center hover:bg-[#C95745] hover:text-[#FCFBF8] hover:border-[#C95745] transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Pagination Indicator Dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: maxFeatureIndex + 1 }).map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentFeatureIndex(dotIdx)}
                  aria-label={`Go to point ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentFeatureIndex === dotIdx
                      ? "w-7 bg-[#C95745]"
                      : "w-2 bg-[#101B38]/20 hover:bg-[#101B38]/40"
                  }`}
                />
              ))}
            </div>

            {/* Next Arrow */}
            <button
              onClick={nextFeature}
              aria-label="Next point"
              className="w-10 h-10 rounded-[2px] bg-[#FCFBF8] border border-[#DED9D0] text-[#101B38] shadow-xs flex items-center justify-center hover:bg-[#C95745] hover:text-[#FCFBF8] hover:border-[#C95745] transition-all duration-300 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. Bottom Horizontal Testimonial & Showroom Block */}
        <Reveal direction="up" delay={0.2} className="mt-14 md:mt-20">
          <div 
            className="grid grid-cols-1 lg:grid-cols-12 rounded-[2px] overflow-hidden shadow-xl border border-[#DED9D0] bg-[#FCFBF8]"
            onMouseEnter={() => setIsReviewPaused(true)}
            onMouseLeave={() => setIsReviewPaused(false)}
            onTouchStart={handleReviewTouchStart}
            onTouchMove={handleReviewTouchMove}
            onTouchEnd={handleReviewTouchEnd}
          >
            {/* Left Block: Midnight Navy Accent Card */}
            <div className="lg:col-span-4 bg-[#101B38] text-[#FCFBF8] p-8 md:p-10 flex flex-col justify-between space-y-8 relative">
              <div className="space-y-4 relative z-10">
                <div className="w-8 h-[2px] bg-[#C95745]"></div>
                <h3 className="font-serif text-2xl md:text-3xl font-normal tracking-tight leading-tight text-[#FCFBF8]">
                  Built on Trust. <br />
                  <span className="italic text-[#EDEAE4]">Inspired by Design.</span>
                </h3>
                <p className="text-xs md:text-sm text-[#EDEAE4]/90 font-light leading-relaxed">
                  From concept to completion, Timex Ceramic supports architects, interior designers, builders and project teams with distinctive tile collections, dependable quality and expert guidance.
                </p>

                {/* Genuine Google Reviews Summary Badge */}
                <div className="pt-2 flex items-center gap-2.5">
                  <div className="flex items-center gap-0.5 text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#FCFBF8]">5.0</span>
                  <span className="text-xs text-[#EDEAE4]/70">· 200+ Google Reviews</span>
                </div>
              </div>

              <div className="relative z-10 pt-4 flex flex-col gap-3">
                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-xs font-semibold text-[#FCFBF8] hover:text-[#C95745] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors font-sans pb-2 border-b border-[#EDEAE4]/35 hover:border-[#C95745] w-fit"
                >
                  <span>READ ALL GOOGLE REVIEWS</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </a>
                <Link
                  href="/contact"
                  className="group text-[11px] font-medium text-[#EDEAE4]/80 hover:text-[#FCFBF8] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors font-sans"
                >
                  <span>CONNECT WITH OUR TEAM</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* Middle Block: Testimonial & Genuine Google Review Horizontal Carousel */}
            <div className="lg:col-span-4 bg-[#FCFBF8] border-t lg:border-t-0 lg:border-l border-[#DED9D0] relative overflow-hidden flex flex-col min-h-[340px] sm:min-h-[300px] lg:min-h-full">
              <div 
                className="flex h-full w-full"
                style={{
                  transform: `translateX(-${slideIndex * 100}%)`,
                  transition: isTransitioning 
                    ? (prefersReducedMotion ? "none" : "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)") 
                    : "none"
                }}
                onTransitionEnd={handleSlideTransitionEnd}
              >
                {extendedReviews.map((review, idx) => (
                  <div 
                    key={idx}
                    className="min-w-full w-full p-8 md:p-10 flex flex-col justify-between shrink-0 select-none"
                    aria-hidden={idx !== slideIndex}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Quote className="w-8 h-8 text-[#C95745] rotate-180 opacity-90" />
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                          ))}
                          <span className="text-[11px] font-semibold text-[#101B38] ml-1">5.0</span>
                        </div>
                      </div>
                      <p className="font-serif italic text-sm md:text-base text-[#333333] leading-relaxed min-h-[90px]">
                        &ldquo;{review.quote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#DED9D0] flex items-end justify-between gap-2">
                      <div>
                        <h4 className="font-sans text-xs font-bold text-[#101B38] tracking-wider uppercase">
                          {review.author}
                        </h4>
                        <p className="text-[11px] text-[#555555] font-normal mt-0.5">
                          {review.role}
                        </p>
                      </div>
                      {review.date && (
                        <span className="text-[10px] text-[#777777] font-sans flex-shrink-0">
                          {review.date}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Block: Showroom Photography & Slider Controls */}
            <div className="lg:col-span-4 relative min-h-[300px] lg:min-h-full overflow-hidden bg-[#101B38]">
              <Image
                src={currentTestimonial.image}
                alt={currentTestimonial.showroomLabel}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-opacity duration-700 opacity-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Showroom Label Overlay */}
              <div className="absolute top-6 left-6 z-10">
                <span className="text-[10px] uppercase font-semibold tracking-widest text-[#FCFBF8] bg-[#101B38]/90 backdrop-blur-md px-3.5 py-1.5 rounded-[2px] border border-[#C95745]/40 shadow-sm">
                  {currentTestimonial.showroomLabel}
                </span>
              </div>

              {/* Slide Counter Indicator */}
              <div className="absolute bottom-6 left-6 z-10 text-[11px] font-sans text-[#FCFBF8]/80 font-medium tracking-wider">
                0{realActiveIndex + 1} / 0{TESTIMONIALS.length}
              </div>

              {/* Slider Arrows */}
              <div className="absolute bottom-6 right-6 z-10 flex items-center space-x-2">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-[2px] bg-[#FCFBF8] text-[#101B38] shadow-md flex items-center justify-center hover:bg-[#C95745] hover:text-[#FCFBF8] transition-colors duration-300 cursor-pointer"
                  aria-label="Previous testimonial slide"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-[2px] bg-[#FCFBF8] text-[#101B38] shadow-md flex items-center justify-center hover:bg-[#C95745] hover:text-[#FCFBF8] transition-colors duration-300 cursor-pointer"
                  aria-label="Next testimonial slide"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 4. TIMEX CERAMIC INSIGHTS Section - Direct Expandable SEO Content Grid */}
        <Reveal direction="up" delay={0.3} className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-[#DED9D0]">
          <div className="max-w-6xl mx-auto">
            {/* Main Section Expandable Header */}
            <button
              onClick={() => setIsMainExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between bg-[#FCFBF8] rounded-[2px] p-6 sm:p-8 md:p-10 border border-[#DED9D0] shadow-sm hover:shadow-md hover:border-[#101B38]/40 transition-all duration-300 group cursor-pointer text-left"
              aria-expanded={isMainExpanded}
            >
              <div className="space-y-2 pr-4">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-[1px] bg-[#C95745]"></span>
                  <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C95745] font-semibold uppercase">
                    TIMEX CERAMIC INSIGHTS
                  </span>
                </div>

                <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight text-[#101B38] leading-tight group-hover:text-[#C95745] transition-colors duration-300">
                  Why Choose Timex Ceramic for Premium Imported Tiles?
                </h2>

                <p className="text-xs sm:text-sm text-[#555555] font-normal pt-1">
                  {isMainExpanded
                    ? "Click to collapse insights"
                    : "Click to expand & explore our design & architectural insights"}
                </p>
              </div>

              <div className="w-12 h-12 md:w-14 md:h-14 rounded-[2px] border border-[#101B38] text-[#FCFBF8] bg-[#101B38] group-hover:bg-[#C95745] group-hover:border-[#C95745] flex items-center justify-center transition-all duration-300 flex-shrink-0 shadow-sm">
                <Plus className={`w-6 h-6 transform transition-transform duration-300 ${isMainExpanded ? "rotate-45" : "rotate-0"}`} />
              </div>
            </button>

            {/* Expanded Content Area: Normal Continuous Webpage Content Section */}
            {isMainExpanded && (
              <div className="mt-8 sm:mt-10 md:mt-12 space-y-8 sm:space-y-10 animate-fadeIn text-left max-w-5xl">
                {/* 1. Discover Designer Tiles That Transform Every Space */}
                <div className="space-y-3">
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                    Discover Designer Tiles That Transform Every Space
                  </h3>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    Timex Ceramic brings together style, sophistication, and contemporary design through an exclusive selection of <strong className="font-semibold text-[#101B38]"><em>premium wall and floor tiles</em></strong>. As a destination for <strong className="font-semibold text-[#101B38]"><em>designer imported tiles in Mumbai</em></strong>, we help homeowners, architects, interior designers, developers, and commercial buyers discover distinctive tile solutions that complement modern lifestyles and exceptional architecture.
                  </p>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    Our curated collections feature elegant finishes, captivating textures, and versatile designs inspired by international trends. Whether you are designing a luxury residence, a boutique hotel, a premium retail space, or a contemporary commercial project, explore <strong className="font-semibold text-[#101B38]"><em>imported tiles in Mumbai</em></strong> that bring your creative vision to life.
                  </p>
                </div>

                {/* 2. A Premium Imported Tile Showroom in Mumbai */}
                <div className="space-y-3">
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                    A Premium Imported Tile Showroom in Mumbai
                  </h3>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    At Timex Ceramic, we believe that every surface contributes to the character of a space. Our tile collections are selected to offer design flexibility, visual appeal, and inspiration for a wide range of interiors and architectural applications.
                  </p>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    As an <strong className="font-semibold text-[#101B38]">imported tile showroom in Mumbai</strong>, we provide access to distinctive tile designs for living rooms, kitchens, bathrooms, bedrooms, feature walls, and commercial environments. From understated contemporary aesthetics to bold statement surfaces, our collection helps you find the right balance of elegance, functionality, and design.
                  </p>
                </div>

                {/* 3. Luxury and Premium Imported Tiles for Every Vision */}
                <div className="space-y-3">
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                    Luxury and Premium Imported Tiles for Every Vision
                  </h3>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    Explore <strong className="font-semibold text-[#101B38]"><em>luxury imported tiles in India</em></strong> and <strong className="font-semibold text-[#101B38]"><em>premium imported tiles in India</em></strong> through collections that bring international design inspiration to residential and commercial spaces. From sophisticated stone and marble looks to textured, geometric, metallic, mosaic, and decorative designs, Timex Ceramic offers options for projects that demand a distinctive finish.
                  </p>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    Our collection of <strong className="font-semibold text-[#101B38]"><em>designer ceramic tiles in India</em></strong> caters to diverse design preferences, helping architects and interior designers create cohesive interiors, striking accent walls, elegant bathrooms, and visually appealing commercial spaces.
                  </p>
                </div>

                {/* 4. Discover European, Italian and Spanish Tile Designs */}
                <div className="space-y-3">
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                    Discover European, Italian and Spanish Tile Designs
                  </h3>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    International design influences continue to shape contemporary architecture and interior design. At Timex Ceramic, discover collections inspired by refined European aesthetics, modern surface finishes, and distinctive decorative styles.
                  </p>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    Explore <strong className="font-semibold text-[#101B38]"><em>European tiles in India</em></strong>, including Italian-inspired and Spanish-inspired designs, to complement a variety of architectural concepts. If you are looking for Italian or Spanish tiles in India or specifically in, say, Mumbai, our curated collections offer inspiration for creating sophisticated and design-led spaces.
                  </p>
                </div>

                {/* 5. Your Destination for Premium Ceramic Tiles in Mumbai */}
                <div className="space-y-3">
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                    Your Destination for Premium Ceramic Tiles in Mumbai
                  </h3>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    Choosing the right tiles involves more than selecting a colour or pattern. It means finding surfaces that complement your design concept, intended application, and project requirements.
                  </p>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    Timex Ceramic offers a diverse selection of premium ceramic tiles in Mumbai, including contemporary, decorative, textured, and statement designs for walls and floors. Whether you are renovating a home, designing a hospitality project, or specifying finishes for a commercial development, our collections help you explore possibilities for creating distinctive spaces.
                  </p>
                </div>

                {/* 6. Tile Solutions for Architects, Interior Designers and Projects */}
                <div className="space-y-3">
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                    Tile Solutions for Architects, Interior Designers and Projects
                  </h3>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    Timex Ceramic supports design exploration for residential interiors, hospitality environments, retail spaces, offices, and other architectural projects. Our varied collections make it easier to compare design directions, coordinate finishes, and identify tiles suited to your project&apos;s aesthetic requirements.
                  </p>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    For architects, interior designers, builders, and developers seeking imported tile suppliers in India, Timex Ceramic offers a design-focused destination to explore premium tile collections for projects of different styles and scales.
                  </p>
                </div>

                {/* 7. Experience the Timex Ceramic Difference */}
                <div className="space-y-3">
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                    Experience the Timex Ceramic Difference
                  </h3>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    From selecting statement tiles to coordinating finishes across an entire project, Timex Ceramic makes discovering distinctive tile designs an inspiring experience. Explore our collections to find surfaces that reflect your vision, enhance your interiors, and bring lasting character to your spaces.
                  </p>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                    Visit Timex Ceramic to discover designer imported tiles in Mumbai and explore premium tile designs for projects across India.
                  </p>
                </div>

                {/* Closing Tagline */}
                <div className="pt-2">
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#101B38] font-bold tracking-wide">
                    Timex Ceramic — Discover Exceptional Tiles. Create Extraordinary Spaces.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
