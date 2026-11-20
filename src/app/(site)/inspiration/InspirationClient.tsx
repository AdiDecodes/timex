"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Layers,
  Palette,
  Sparkles,
  CheckCircle2,
  Phone,
  Grid,
} from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { InspirationHeroGallery } from "@/components/inspiration/InspirationHeroGallery";

interface SpaceCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  link: string;
}

interface TileStyleCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  link: string;
}

const SPACE_CARDS: SpaceCardData[] = [
  {
    id: "bathroom",
    title: "Bathroom Tile Inspiration",
    description:
      "Create a relaxing personal retreat with elegant bathroom tile designs. Explore marble-inspired surfaces, subtle textures, decorative mosaics, geometric patterns and sophisticated colour combinations to create bathrooms that feel contemporary, refreshing and timeless.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    alt: "Luxury spa bathroom with elegant wall and floor tile surfaces",
    link: "/bathroom-tiles",
  },
  {
    id: "kitchen",
    title: "Kitchen Tile Inspiration",
    description:
      "Give your kitchen a distinctive personality with creative wall tiles and backsplash designs. From classic subway patterns and brick tiles to colourful ceramics, Moroccan motifs and modern geometric designs, find inspiration for functional yet visually appealing kitchen spaces.",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    alt: "Modern kitchen featuring artisanal tiled backsplash and countertop finishes",
    link: "/kitchen-tiles",
  },
  {
    id: "living-room",
    title: "Living Room Tile Inspiration",
    description:
      "Make your living room a reflection of your design personality. Explore elegant marble looks, natural stone-inspired finishes, decorative patterns, large-format surfaces and statement feature walls that bring sophistication and character to your interiors.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    alt: "Spacious luxury living room with large-format vitrified floor slabs",
    link: "/living-dining-room-tiles",
  },
  {
    id: "bedroom",
    title: "Bedroom Tile Inspiration",
    description:
      "Create a comfortable and inviting bedroom with thoughtfully selected tile designs. Wooden textures, soft colour palettes, fabric-inspired patterns and understated decorative finishes can help establish a warm and balanced atmosphere.",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    alt: "Serene bedroom sanctuary with warm wooden look porcelain tiles",
    link: "/bedroom-tiles",
  },
  {
    id: "balcony-outdoor",
    title: "Balcony & Outdoor Tile Inspiration",
    description:
      "Extend your design vision beyond indoor spaces. Explore outdoor tile ideas featuring natural stone-inspired finishes, earthy colours, decorative patterns and practical surfaces suitable for balconies, terraces and outdoor settings.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    alt: "Open-air balcony and terrace patio with weather-resistant stone look tiles",
    link: "/balcony-terrace-tiles",
  },
  {
    id: "feature-wall",
    title: "Feature Wall Tile Inspiration",
    description:
      "Turn an ordinary wall into an architectural highlight. Textured tiles, metallic finishes, 3D patterns, mosaics, Moroccan designs and colourful decorative tiles can introduce depth, contrast and visual interest to any interior.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    alt: "Architectural feature wall displaying rich 3D textures and decorative cladding",
    link: "/elevation-exterior-tiles",
  },
];

const TILE_STYLES: TileStyleCardData[] = [
  {
    id: "marble",
    title: "Marble-Inspired Elegance",
    description:
      "Bring timeless sophistication to your interiors with marble-inspired tile designs. Explore refined veining, elegant shades and polished or matt aesthetics for contemporary and classic spaces.",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
    alt: "Polished Italian marble look vitrified surface with refined grey veining",
    link: "/collections/marble",
  },
  {
    id: "geometric",
    title: "Geometric & Patterned Designs",
    description:
      "Introduce visual rhythm through geometric shapes, repeating patterns and creative layouts. Hexagon, octagonal, modular and patterned tiles can turn walls and floors into expressive design elements.",
    image:
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=900&q=80",
    alt: "Geometric hexagon and modular patterned tiles creating architectural rhythm",
    link: "/collections/hexagon",
  },
  {
    id: "moroccan",
    title: "Moroccan & Decorative Tiles",
    description:
      "Add artistic character with Moroccan-inspired tiles featuring decorative motifs, intricate patterns and expressive colour combinations. These designs can create distinctive feature walls, kitchen backsplashes and statement flooring.",
    image:
      "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=900&q=80",
    alt: "Artistic Moroccan decorative tile patterns with ornate handcrafted motifs",
    link: "/collections/moroccan",
  },
  {
    id: "mosaic",
    title: "Mosaic & Small Format Tiles",
    description:
      "Discover the creative possibilities of small-format and mosaic tiles. Their detailed patterns, varied shapes and colour combinations can add personality to bathrooms, kitchens, niches and decorative surfaces.",
    image:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80",
    alt: "Small format mosaic tile installation with detailed color accents",
    link: "/collections/mosaic",
  },
  {
    id: "wooden-stone",
    title: "Wooden & Natural Stone Looks",
    description:
      "Bring natural warmth and texture into modern interiors with wood-look and stone-inspired tiles. These designs offer versatile styling possibilities for residential and commercial spaces.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    alt: "Warm wood grain and organic cleft stone surface textures",
    link: "/collections/wooden",
  },
  {
    id: "textured-3d",
    title: "Textured & 3D Surface Designs",
    description:
      "Add another dimension to your interiors with textured and three-dimensional wall tile designs. Subtle relief, sculptural patterns and tactile finishes create interesting interactions between light and surface.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    alt: "Three-dimensional sculptural relief wall tiles with dynamic shadow play",
    link: "/collections/texture",
  },
  {
    id: "metallic",
    title: "Metallic & Contemporary Finishes",
    description:
      "Explore the modern appeal of metallic finishes, distinctive surface treatments and decorative designs. These styles can complement contemporary homes, hospitality interiors and design-led commercial spaces.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    alt: "Contemporary metallic finish tiles offering modern sheen and industrial luxury",
    link: "/collections/metallic",
  },
  {
    id: "colourful",
    title: "Colourful & Artistic Tiles",
    description:
      "Express your creativity through colourful ceramic tiles and artistic patterns. From vibrant accents to carefully coordinated palettes, these designs can bring personality and individuality to your interiors.",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80",
    alt: "Vibrant and colourful artistic ceramic tile layout with creative glaze finishes",
    link: "/collections/colourful",
  },
  {
    id: "brick-subway",
    title: "Brick & Subway Tile Designs",
    description:
      "Create timeless yet contemporary interiors with brick and subway tile patterns. Their versatile shapes and layouts work beautifully in kitchen backsplashes, bathroom walls, cafés and selected feature areas.",
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80",
    alt: "Classic subway brick wall tile layout with crisp beveled edges",
    link: "/collections/brick",
  },
];

const CURATED_COLLECTION_PILLS = [
  { name: "Brick", href: "/collections/brick" },
  { name: "Hexagon", href: "/collections/hexagon" },
  { name: "Marble", href: "/collections/marble" },
  { name: "Modular", href: "/collections/modular" },
  { name: "Stone", href: "/collections/stone" },
  { name: "Subway", href: "/collections/subway" },
  { name: "Moroccan", href: "/collections/moroccan" },
  { name: "Octagonal", href: "/collections/octagonal" },
  { name: "Wooden", href: "/collections/wooden" },
  { name: "Texture", href: "/collections/texture" },
  { name: "Colourful", href: "/collections/colourful" },
  { name: "Fabric", href: "/collections/fabric" },
  { name: "Tropical", href: "/collections/tropical" },
  { name: "Metallic", href: "/collections/metallic" },
  { name: "Highlighter", href: "/collections/highlighter" },
  { name: "Mosaic", href: "/collections/mosaic" },
  { name: "Boutique", href: "/collections/boutique" },
  { name: "French Frames", href: "/collections/french-frames" },
];

export function InspirationClient() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#333333] selection:bg-[#C95745] selection:text-white">
      {/* =========================================================================
          FULL-WIDTH HERO IMAGE GALLERY (INSPIRATION CAROUSEL & THUMBNAIL STRIP)
          ========================================================================= */}
      <InspirationHeroGallery />

      {/* =========================================================================
          HERO & INTRODUCTION SECTION
          H1: Tile Inspiration – Ideas to Transform Your Spaces
          H2: Find Inspiration. Discover Design. Create Beautiful Spaces.
          ========================================================================= */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 bg-[#101B38] text-[#FCFBF8] overflow-hidden border-b border-[#202B48]">
        {/* Background Architectural Ambient Glow & Gridlines */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80"
            alt="Timex Ceramic luxury architectural surfaces background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#101B38]/90 via-[#101B38]/95 to-[#101B38]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
          {/* Eyebrow / Breadcrumb Tag */}
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] bg-white/5 border border-white/15 backdrop-blur-xs text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#C95745] uppercase">
              <Compass className="w-3.5 h-3.5 text-[#C95745]" />
              <span>Timex Ceramic Architectural Inspiration</span>
            </div>
          </Reveal>

          {/* Exact H1 Title */}
          <Reveal direction="up" delay={0.1}>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#FCFBF8] leading-[1.15]">
              Tile Inspiration – Ideas to Transform Your Spaces
            </h1>
          </Reveal>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="w-12 h-[1px] bg-[#C95745]" />
            <Sparkles className="w-4 h-4 text-[#C95745]" />
            <div className="w-12 h-[1px] bg-[#C95745]" />
          </div>

          {/* Exact H2 Title */}
          <Reveal direction="up" delay={0.15}>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#FCFBF8]/95 leading-snug">
              Find Inspiration. Discover Design. Create Beautiful Spaces.
            </h2>
          </Reveal>

          {/* Exact Introductory Paragraphs */}
          <Reveal direction="up" delay={0.2}>
            <div className="space-y-4 max-w-3xl mx-auto font-sans text-sm sm:text-base text-[#EDEAE4]/90 font-light leading-relaxed pt-2 text-justify sm:text-center">
              <p>
                Every beautiful space begins with an idea. Sometimes it is a distinctive pattern, an interesting colour combination, a striking texture or a surface that brings an entire room together. At Timex Ceramic, we believe tiles are more than functional surfaces – they are an essential element of interior architecture and personal expression.
              </p>
              <p>
                Explore a world of <strong>designer tile inspiration</strong>, featuring creative wall and floor tile ideas, contemporary patterns, sophisticated finishes and distinctive surface designs. From elegant marble-inspired interiors and warm wooden textures to decorative Moroccan patterns, geometric designs, intricate mosaics and modern metallic finishes, discover possibilities that transform ordinary spaces into memorable experiences.
              </p>
              <p>
                Whether you are designing a new home, renovating an existing space or planning a commercial interior, let our curated tile collections inspire your next design decision.
              </p>
            </div>
          </Reveal>

          {/* Exact Bold Callout Tagline */}
          <Reveal direction="up" delay={0.25}>
            <div className="pt-4">
              <div className="inline-block p-4 sm:px-8 sm:py-3.5 bg-black/40 border border-[#C95745]/40 rounded-[2px] backdrop-blur-sm shadow-sm">
                <p className="font-serif text-base sm:text-lg text-[#FCFBF8] font-normal tracking-wide">
                  <strong>Explore. Imagine. Create. Let your spaces tell your story.</strong>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SPACES
          H2: Explore Tile Inspiration for Every Space
          H3s: Bathroom, Kitchen, Living Room, Bedroom, Balcony & Outdoor, Feature Wall
          ========================================================================= */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 md:mb-16">
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-[#C95745]" />
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C95745] font-semibold uppercase">
              Curated Spatial Concepts
            </span>
            <span className="w-8 h-[1px] bg-[#C95745]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#101B38] leading-[1.2]">
            Explore Tile Inspiration for Every Space
          </h2>

          <p className="font-sans text-xs sm:text-sm md:text-base text-[#333333]/85 font-normal leading-relaxed">
            The right tile can transform the character of an entire room. Discover creative tile design ideas for different spaces and explore how colours, patterns, textures and finishes can work together to create beautiful interiors.
          </p>
        </div>

        {/* 6 Responsive Space Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9">
          {SPACE_CARDS.map((card, idx) => (
            <Reveal key={card.id} direction="up" delay={idx * 0.05}>
              <div className="group bg-[#FCFBF8] rounded-[2px] overflow-hidden border border-[#EDEAE4] hover:border-[#C95745]/50 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                {/* Visual Image Container with 16:11 Aspect Ratio */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#101B38]">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300" />
                  
                  {/* Subtle Space Pill on top left */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-[2px]">
                      Space Concept
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Exact H3 Title */}
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#101B38] group-hover:text-[#C95745] transition-colors duration-300 leading-snug">
                      {card.title}
                    </h3>

                    {/* Exact Content Paragraph */}
                    <p className="font-sans text-xs sm:text-sm text-[#333333]/85 font-light leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Internal Link to Space Route */}
                  <div className="pt-4 border-t border-[#EDEAE4]">
                    <Link
                      href={card.link}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#101B38] hover:text-[#C95745] uppercase tracking-wider transition-colors duration-300 group/link"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TILE DESIGNS / STYLES
          H2: Discover Tile Designs That Inspire
          H3s: 9 Tile Styles (Marble, Geometric, Moroccan, Mosaic, Wooden/Stone,
               Textured 3D, Metallic, Colourful, Brick/Subway)
          ========================================================================= */}
      <section className="py-20 md:py-28 bg-[#EDEAE4] border-t border-b border-[#DED9D0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 md:mb-16">
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-[#C95745]" />
              <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C95745] font-semibold uppercase">
                Artistry &amp; Surface Finishes
              </span>
              <span className="w-8 h-[1px] bg-[#C95745]" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#101B38] leading-[1.2]">
              Discover Tile Designs That Inspire
            </h2>

            <p className="font-sans text-xs sm:text-sm md:text-base text-[#333333]/85 font-normal leading-relaxed">
              Great interiors are often defined by the details. Explore different tile styles and discover how distinctive shapes, patterns, textures and finishes can influence the overall look of a space.
            </p>
          </div>

          {/* 9 Tile Style Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TILE_STYLES.map((style, idx) => (
              <Reveal key={style.id} direction="up" delay={idx * 0.04}>
                <div className="group bg-[#FCFBF8] rounded-[2px] overflow-hidden border border-[#DED9D0] hover:border-[#C95745]/60 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                  {/* Style Thumbnail Image with 16:10 Aspect Ratio */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#101B38]">
                    <Image
                      src={style.image}
                      alt={style.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-3 left-4 z-10">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#FCFBF8] bg-black/60 px-2 py-0.5 rounded-[2px] backdrop-blur-xs">
                        Style Portfolio
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      {/* Exact H3 Title */}
                      <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#101B38] group-hover:text-[#C95745] transition-colors duration-300 leading-snug">
                        {style.title}
                      </h3>

                      {/* Exact Content Paragraph */}
                      <p className="font-sans text-xs sm:text-sm text-[#333333]/85 font-light leading-relaxed">
                        {style.description}
                      </p>
                    </div>

                    {/* Internal Link to Relevant Collection */}
                    <div className="pt-3.5 border-t border-[#EDEAE4]">
                      <Link
                        href={style.link}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#101B38] hover:text-[#C95745] uppercase tracking-wider transition-colors duration-300 group/link"
                      >
                        <span>View Tile Style</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: COLOURS, PATTERNS & TEXTURES
          H2: The Art of Combining Colours, Patterns & Textures
          Intro + 6 Exact Bullet Points + Concluding Paragraph
          ========================================================================= */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-[#C95745]" />
              <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C95745] font-semibold uppercase">
                Harmonious Design Principles
              </span>
              <span className="w-8 h-[1px] bg-[#C95745]" />
            </div>

            {/* Exact H2 Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#101B38] leading-[1.2]">
              The Art of Combining Colours, Patterns &amp; Textures
            </h2>

            {/* Exact Paragraph */}
            <p className="font-sans text-sm sm:text-base text-[#333333]/85 font-normal leading-relaxed max-w-2xl mx-auto">
              Successful interior design is about creating harmony between different elements. Tiles can act as a subtle background, a complementary design feature or the centrepiece of an entire space.
            </p>
          </div>

          {/* 6 Exact Bullet Points in an elegant 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Bullet 1 */}
            <Reveal direction="up" delay={0.05}>
              <div className="p-5 sm:p-6 bg-[#FCFBF8] rounded-[2px] border border-[#EDEAE4] hover:border-[#C95745]/40 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-8 h-8 rounded-[2px] bg-[#101B38] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Palette className="w-4 h-4 text-[#C95745]" />
                </div>
                <div className="font-sans text-xs sm:text-sm text-[#333333] leading-relaxed">
                  <span className="block text-[#101B38] font-bold text-sm sm:text-[15px] mb-1">
                    <strong>Create contrast:</strong>
                  </span>
                  Combine complementary and contrasting tones to introduce depth and definition.
                </div>
              </div>
            </Reveal>

            {/* Bullet 2 */}
            <Reveal direction="up" delay={0.1}>
              <div className="p-5 sm:p-6 bg-[#FCFBF8] rounded-[2px] border border-[#EDEAE4] hover:border-[#C95745]/40 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-8 h-8 rounded-[2px] bg-[#101B38] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Grid className="w-4 h-4 text-[#C95745]" />
                </div>
                <div className="font-sans text-xs sm:text-sm text-[#333333] leading-relaxed">
                  <span className="block text-[#101B38] font-bold text-sm sm:text-[15px] mb-1">
                    <strong>Play with patterns:</strong>
                  </span>
                  Use geometric, decorative and modular designs to create visual interest.
                </div>
              </div>
            </Reveal>

            {/* Bullet 3 */}
            <Reveal direction="up" delay={0.15}>
              <div className="p-5 sm:p-6 bg-[#FCFBF8] rounded-[2px] border border-[#EDEAE4] hover:border-[#C95745]/40 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-8 h-8 rounded-[2px] bg-[#101B38] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-4 h-4 text-[#C95745]" />
                </div>
                <div className="font-sans text-xs sm:text-sm text-[#333333] leading-relaxed">
                  <span className="block text-[#101B38] font-bold text-sm sm:text-[15px] mb-1">
                    <strong>Layer textures:</strong>
                  </span>
                  Combine smooth surfaces with textured finishes for a more engaging interior.
                </div>
              </div>
            </Reveal>

            {/* Bullet 4 */}
            <Reveal direction="up" delay={0.2}>
              <div className="p-5 sm:p-6 bg-[#FCFBF8] rounded-[2px] border border-[#EDEAE4] hover:border-[#C95745]/40 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-8 h-8 rounded-[2px] bg-[#101B38] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C95745]" />
                </div>
                <div className="font-sans text-xs sm:text-sm text-[#333333] leading-relaxed">
                  <span className="block text-[#101B38] font-bold text-sm sm:text-[15px] mb-1">
                    <strong>Choose complementary colours:</strong>
                  </span>
                  Coordinate tiles with furniture, lighting, wall colours and other interior elements.
                </div>
              </div>
            </Reveal>

            {/* Bullet 5 */}
            <Reveal direction="up" delay={0.25}>
              <div className="p-5 sm:p-6 bg-[#FCFBF8] rounded-[2px] border border-[#EDEAE4] hover:border-[#C95745]/40 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-8 h-8 rounded-[2px] bg-[#101B38] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#C95745]" />
                </div>
                <div className="font-sans text-xs sm:text-sm text-[#333333] leading-relaxed">
                  <span className="block text-[#101B38] font-bold text-sm sm:text-[15px] mb-1">
                    <strong>Create focal points:</strong>
                  </span>
                  Use statement tiles selectively on feature walls, backsplashes and accent areas.
                </div>
              </div>
            </Reveal>

            {/* Bullet 6 */}
            <Reveal direction="up" delay={0.3}>
              <div className="p-5 sm:p-6 bg-[#FCFBF8] rounded-[2px] border border-[#EDEAE4] hover:border-[#C95745]/40 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-8 h-8 rounded-[2px] bg-[#101B38] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-4 h-4 text-[#C95745]" />
                </div>
                <div className="font-sans text-xs sm:text-sm text-[#333333] leading-relaxed">
                  <span className="block text-[#101B38] font-bold text-sm sm:text-[15px] mb-1">
                    <strong>Consider tile formats:</strong>
                  </span>
                  Explore different shapes and sizes to create layouts that complement the proportions of your space.
                </div>
              </div>
            </Reveal>
          </div>

          {/* Exact Concluding Paragraph */}
          <Reveal direction="up" delay={0.35}>
            <div className="p-5 text-center bg-[#EDEAE4] border border-[#DED9D0] rounded-[2px]">
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#101B38] font-medium leading-relaxed">
                The key is to create a balance between design expression and the practical requirements of each space.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: DESIGNER TILE COLLECTIONS AT TIMEX CERAMIC
          H2: Discover Designer Tile Collections at Timex Ceramic
          Exact 3 Paragraphs with Interactive Collection Pills
          ========================================================================= */}
      <section className="py-20 md:py-28 bg-[#101B38] text-[#FCFBF8] border-t border-[#202B48] overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 space-y-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-[#C95745]" />
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C95745] font-semibold uppercase">
              Exclusive Product Portfolio
            </span>
            <span className="w-8 h-[1px] bg-[#C95745]" />
          </div>

          {/* Exact H2 Title */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#FCFBF8] leading-[1.2]">
            Discover Designer Tile Collections at Timex Ceramic
          </h2>

          {/* Exact Paragraph 1 */}
          <p className="font-sans text-xs sm:text-sm md:text-base text-[#EDEAE4]/90 font-light leading-relaxed max-w-3xl mx-auto">
            At Timex Ceramic, we bring together an extensive selection of designer ceramic and porcelain tile collections inspired by international design influences. From understated contemporary aesthetics to expressive decorative patterns, our collections offer ideas for a wide range of interior styles.
          </p>

          {/* Exact Paragraph 2 */}
          <div className="space-y-4 pt-2">
            <p className="font-sans text-xs sm:text-sm md:text-base text-[#FCFBF8] font-normal leading-relaxed max-w-3xl mx-auto">
              Explore distinctive designs across Brick, Hexagon, Marble, Modular, Stone, Subway, Moroccan, Octagonal, Wooden, Texture, Colourful, Fabric, Tropical, Metallic, Highlighter, Mosaic, Boutique and French Frames collections.
            </p>

            {/* Interactive Collection Pills Linking to Each Collection */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-3xl mx-auto pt-2">
              {CURATED_COLLECTION_PILLS.map((pill) => (
                <Link
                  key={pill.name}
                  href={pill.href}
                  className="px-3.5 py-1.5 rounded-[2px] bg-white/10 hover:bg-[#C95745] text-xs font-medium text-[#FCFBF8] border border-white/15 hover:border-[#C95745] transition-all duration-300"
                >
                  {pill.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Exact Paragraph 3 */}
          <p className="font-sans text-xs sm:text-sm md:text-base text-[#EDEAE4]/90 font-light leading-relaxed max-w-3xl mx-auto pt-2">
            Whether you are looking for designer wall tiles, decorative floor tiles, imported tile designs or unique surfaces for a statement interior, discover collections that help bring your creative vision to life.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FINAL CALL TO ACTION
          H2: Get Inspired. Create Something Extraordinary.
          Exact Paragraphs, Bold Taglines, and Exact Two Buttons
          ========================================================================= */}
      <section className="py-20 md:py-28 bg-[#F7F5F0] border-t border-[#EDEAE4]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-[#C95745]" />
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C95745] font-semibold uppercase">
              Begin Your Design Journey
            </span>
            <span className="w-8 h-[1px] bg-[#C95745]" />
          </div>

          {/* Exact H2 Title */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#101B38] leading-[1.2]">
            Get Inspired. Create Something Extraordinary.
          </h2>

          {/* Exact Paragraphs */}
          <div className="space-y-4 max-w-3xl mx-auto font-sans text-xs sm:text-sm md:text-base text-[#333333]/85 font-light leading-relaxed">
            <p>
              Your space should reflect your imagination, personality and way of living. From a beautifully designed bathroom to an expressive living room, an elegant kitchen or a distinctive commercial interior, the right tile selection can make every detail count.
            </p>
            <p>
              Explore the world of Timex Ceramic and discover designer tile ideas that inspire new possibilities for your spaces.
            </p>
          </div>

          {/* Exact Bold Taglines */}
          <div className="space-y-2 pt-2">
            <p className="font-serif text-base sm:text-lg text-[#101B38] font-normal">
              <strong>Let your imagination lead the way. Let your spaces tell your story.</strong>
            </p>
            <p className="font-serif text-base sm:text-lg text-[#C95745] font-normal">
              <strong>Explore Timex Ceramic. Find inspiration for your next design.</strong>
            </p>
          </div>

          {/* Exact Two Buttons (Explore Our World of Tiles & Contact Our Team) */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-6">
            <Link
              href="/world-of-tiles"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#101B38] hover:bg-[#C95745] text-white text-xs sm:text-sm font-semibold uppercase tracking-widest rounded-[2px] shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span>Explore Our World of Tiles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent hover:bg-[#101B38] text-[#101B38] hover:text-[#FCFBF8] border border-[#101B38] text-xs sm:text-sm font-semibold uppercase tracking-widest rounded-[2px] transition-all duration-300"
            >
              <Phone className="w-4 h-4 text-[#C95745]" />
              <span>Contact Our Team</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
