import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";
import { getWorldOfTilesCategories, resolveCategoryImage } from "@/services/categories";
import { WorldOfTilesClient } from "@/components/products/WorldOfTilesClient";

export const dynamic = "auto";
export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/world-of-tiles");
  return buildPageMetadata(seo);
}

export default async function WorldOfTilesPage() {
  const categories = getWorldOfTilesCategories();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "World of Tiles | Timex Ceramic",
    description: `Explore the World of Tiles by Timex Ceramic. Browse designer imported wall and floor tiles across ${categories.length} curated collections.`,
    url: "https://www.timexceramic.com/world-of-tiles",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categories.length,
      itemListElement: categories.map((cat, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: cat.name,
        url: `https://www.timexceramic.com${cat.url || `/product-category/${cat.slug}`}`,
        image: resolveCategoryImage(cat),
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.timexceramic.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "World of Tiles",
        item: "https://www.timexceramic.com/world-of-tiles",
      },
    ],
  };

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 1. Page Header & Breadcrumb */}
      <section className="py-10 md:py-14 bg-[#EDEAE4] border-b border-[#DED9D0]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#101B38] tracking-tight">
            World of Tiles
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center space-x-2 text-xs text-[#333333]/70"
          >
            <Link
              href="/"
              className="hover:text-[#C95745] transition-colors"
            >
              Home
            </Link>
            <span className="text-[#333333]/40">/</span>
            <span className="text-[#101B38] font-medium">World of Tiles</span>
          </nav>
        </div>
      </section>

      {/* ==================================================
          2. PART A: BEFORE EXISTING TILE CATEGORIES
          ================================================== */}
      <section className="max-w-4xl mx-auto px-6 pt-12 md:pt-16 pb-10 md:pb-12 text-center space-y-4 md:space-y-5">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-[34px] font-bold text-[#101B38] leading-tight tracking-tight">
          Discover a World of Designer Wall and Floor Tiles
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed max-w-3xl mx-auto">
          Explore an inspiring collection of designer ceramic and porcelain tiles at Timex Ceramic, where distinctive patterns, sophisticated finishes and international design influences come together. From timeless marble and natural stone aesthetics to contemporary geometric patterns, decorative mosaics, metallic finishes and vibrant Moroccan designs, our world of tiles offers possibilities for creating spaces with character and style.
        </p>

        <p className="text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed max-w-3xl mx-auto">
          Whether you are designing a modern home, renovating a bathroom, creating an elegant kitchen backsplash or planning a statement-making commercial interior, discover tile designs that complement your vision. Explore a versatile selection of wall and floor tiles in different colours, formats, textures and finishes to find the right look for your space.
        </p>

        <p className="text-xs sm:text-sm md:text-base text-[#101B38] font-bold leading-relaxed max-w-3xl mx-auto pt-1">
          Discover distinctive tile designs. Find inspiration for every space. Create interiors that reflect your style.
        </p>
      </section>

      {/* ==================================================
          3. EXISTING TILE CATEGORIES GRID
          ================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <Suspense
          fallback={
            <div className="py-24 text-center text-xs uppercase tracking-widest text-[#C95745] font-semibold animate-pulse">
              Loading World of Tiles...
            </div>
          }
        >
          <WorldOfTilesClient initialCategories={categories} />
        </Suspense>
      </section>

      {/* ==================================================
          4. PART B: AFTER EXISTING TILE CATEGORIES – TEXT ONLY
          ================================================== */}
      <section className="max-w-5xl mx-auto px-6 pt-10 md:pt-14 pb-20 md:pb-28 border-t border-[#EDEAE4]">
        <div className="space-y-12 md:space-y-16 text-left">
          
          {/* Section 1: Explore Our Designer Tile Collections */}
          <div className="space-y-8 md:space-y-10">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#101B38] tracking-tight leading-snug">
                Explore Our Designer Tile Collections
              </h2>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Every space has its own character, and the right tiles can bring that character to life. At Timex Ceramic, our curated collections feature diverse design styles, from understated elegance to bold decorative statements. Explore different tile categories to discover patterns, textures and finishes suited to your interior design preferences.
              </p>
            </div>

            {/* 18 Tile Categories */}
            <div className="space-y-6 md:space-y-7">
              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Brick Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Bring an urban, rustic or contemporary character to your walls with brick tiles. Their elongated formats and distinctive finishes work beautifully for kitchen backsplashes, feature walls, cafés, retail interiors and selected exterior applications.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Hexagon Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Create visually striking surfaces with hexagon tiles. Their geometric shape adds rhythm and personality to bathroom walls, kitchen accents, decorative niches and contemporary interiors.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Marble Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Introduce the timeless appeal of marble-inspired surfaces into your interiors. With elegant veining and refined colour palettes, marble tiles complement sophisticated living rooms, bathrooms, bedrooms and statement walls.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Modular Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Explore modular tile designs that offer flexibility in patterns, layouts and visual compositions. Ideal for design-led interiors, these collections help create coordinated surfaces with a distinctive architectural character.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Stone Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Bring the understated beauty of natural stone-inspired textures into your space. Stone tiles complement contemporary, rustic and minimalist interiors, creating a balanced aesthetic for selected wall and floor applications.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Subway Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Achieve a clean, classic look with subway tiles. Their versatile rectangular formats work well in kitchens, bathrooms, cafés and modern interiors, whether arranged in traditional patterns or contemporary layouts.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Moroccan Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Add colour, pattern and artistic detail with Moroccan-inspired tiles. Geometric motifs and decorative designs make them an expressive choice for feature walls, kitchen backsplashes, niches and distinctive interior accents.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Octagonal Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Introduce a classic geometric aesthetic with octagonal tiles. Their distinctive shape lends itself to decorative flooring, patterned layouts and interiors inspired by traditional and contemporary design.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Wooden Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Enjoy the visual warmth of wood-inspired surfaces with wooden tiles. Their natural-looking tones and grain patterns offer a versatile design option for bedrooms, living areas and other spaces where you want a warm, inviting aesthetic.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Texture Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Add depth and dimension with textured tiles. From subtle surface detailing to bold three-dimensional patterns, these designs can create statement walls and visually engaging interiors.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Colourful Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Bring energy and individuality to your space with colourful tiles. Explore expressive shades and decorative combinations for accent walls, creative kitchens, lively bathrooms and design-focused commercial interiors.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Fabric Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Discover fabric-inspired tile designs that introduce softness and visual detail to hard surfaces. Their distinctive patterns and textures can complement refined residential interiors and contemporary feature walls.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Tropical Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Bring a nature-inspired aesthetic indoors with tropical tiles. Botanical motifs and expressive patterns can transform feature walls, hospitality spaces, relaxation areas and selected decorative installations.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Metallic Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Introduce a sophisticated accent with metallic tiles. Reflective finishes and metallic-inspired patterns can add depth and visual interest to feature walls, backsplashes and contemporary interiors.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Highlighter Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Make selected areas stand out with highlighter tiles. Their decorative designs and contrasting details can complement base tiles, helping create focal points in bathrooms, kitchens and other interior spaces.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Mosaic Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Explore intricate patterns and distinctive surface compositions with mosaic tiles. Available in a variety of decorative styles, mosaics can enhance feature walls, backsplashes, niches and other carefully selected applications.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  Boutique Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Discover distinctive boutique tile designs for interiors that call for something individual. Decorative details, expressive patterns and unusual finishes can help create memorable focal points.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                  French Frames Tiles
                </h3>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                  Add decorative structure and refined detailing with French Frames tiles. Their framed patterns offer a distinctive approach to feature walls, decorative compositions and interiors inspired by classic European aesthetics.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Find the Right Tiles for Your Space */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#101B38] tracking-tight leading-snug">
              Find the Right Tiles for Your Space
            </h2>
            
            <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
              The right tile choice balances appearance, application and practical requirements. Consider the atmosphere you want to create, the size of the area, the desired finish and the conditions in which the tiles will be installed.
            </p>

            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-[#555555] font-sans text-xs sm:text-sm md:text-base leading-relaxed">
              <li>
                <strong className="font-semibold text-[#101B38]">Living rooms:</strong> Explore marble, stone, terrazzo, wooden and textured designs for elegant feature walls and coordinated interiors.
              </li>
              <li>
                <strong className="font-semibold text-[#101B38]">Kitchens:</strong> Consider subway, brick, mosaic, colourful and metallic designs for backsplashes and decorative accents.
              </li>
              <li>
                <strong className="font-semibold text-[#101B38]">Bathrooms:</strong> Discover marble, stone, mosaic, white and textured tiles suited to your preferred aesthetic. Select appropriate slip-resistant products for wet floor areas.
              </li>
              <li>
                <strong className="font-semibold text-[#101B38]">Bedrooms:</strong> Create a warm and restful setting with wooden, fabric-inspired, marble and subtle textured designs.
              </li>
              <li>
                <strong className="font-semibold text-[#101B38]">Commercial interiors:</strong> Explore distinctive patterns and finishes for offices, boutiques, cafés, hospitality spaces and retail environments, choosing products suited to the intended application.
              </li>
            </ul>

            <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed pt-1">
              Always check the individual product specifications, recommended application, slip resistance and installation requirements before selecting tiles for a particular surface.
            </p>
          </div>

          {/* Section 3: Why Explore Tiles at Timex Ceramic? */}
          <div className="space-y-6 md:space-y-7">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#101B38] tracking-tight leading-snug">
              Why Explore Tiles at Timex Ceramic?
            </h2>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                A Diverse Range of Designs
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Discover a broad selection of tile categories, patterns, colours, formats and finishes in one place, making it easier to compare styles and find inspiration for your project.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                Design Inspiration for Every Aesthetic
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                From understated contemporary interiors to bold decorative spaces, our collections offer design possibilities for different tastes and architectural concepts.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                Ceramic and Porcelain Tile Options
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Explore ceramic and porcelain collections across selected designs, with product specifications to help you evaluate suitability for your intended application.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                Inspiration for Residential and Commercial Projects
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Whether you are a homeowner, architect, interior designer or project professional, explore tile styles that can support a wide range of design concepts.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                A Mumbai-Based Tile Destination
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Visit Timex Ceramic in Vile Parle East, Mumbai, to explore our designer tile collections and discuss options for your project.
              </p>
            </div>
          </div>

          {/* Section 4: Explore Our World of Tiles */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#101B38] tracking-tight leading-snug">
              Explore Our World of Tiles
            </h2>

            <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
              The right tiles do more than finish a surface. They help establish the mood, character and visual identity of a space. From timeless marble-inspired designs and warm wooden finishes to geometric patterns, decorative mosaics and contemporary metallic accents, Timex Ceramic brings a world of tile inspiration together.
            </p>

            <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
              Browse our collections, compare designs and discover surfaces that complement your vision.
            </p>

            <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
              <strong className="font-semibold text-[#101B38]">Ready to find your ideal tiles?</strong> Explore the Timex Ceramic collection or contact our team for assistance with your selection.
            </p>

            {/* Normal text links for the two supplied link labels */}
            <div className="flex flex-wrap items-center gap-4 pt-2 font-sans text-xs sm:text-sm md:text-base font-semibold">
              <Link
                href="/collections"
                className="text-[#101B38] hover:text-[#C95745] underline underline-offset-4 decoration-[#C95745] transition-colors"
              >
                Explore Tile Collections
              </Link>
              <span className="text-[#D0CBC4]">|</span>
              <Link
                href="/contact"
                className="text-[#101B38] hover:text-[#C95745] underline underline-offset-4 decoration-[#C95745] transition-colors"
              >
                Contact Timex Ceramic
              </Link>
            </div>
          </div>

          {/* Section 5: Frequently Asked Questions About Designer Tiles */}
          <div className="space-y-6 md:space-y-7">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#101B38] tracking-tight leading-snug">
              Frequently Asked Questions About Designer Tiles
            </h2>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                What types of tiles are available at Timex Ceramic?
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Timex Ceramic features a range of tile categories, including Brick, Hexagon, Marble, Modular, Stone, Subway, Moroccan, Octagonal, Wooden, Texture, Colourful, Fabric, Terrazzo, Tropical, Metallic, Highlighter, White, Mosaic, Boutique and French Frames.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                How do I choose the right tiles for my home?
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Consider the room, intended application, design style, colour scheme, finish, maintenance needs and budget. For floors and wet areas, check product-specific durability and slip-resistance requirements before making your selection.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                What is the difference between ceramic and porcelain tiles?
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Both are ceramic-based materials, but they differ in composition and manufacturing characteristics. Porcelain tiles generally have lower water absorption than conventional ceramic tiles. Suitability depends on the individual product and its intended application.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                Which tiles are suitable for kitchen walls?
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Subway, brick, mosaic, metallic and other decorative ceramic tiles can be suitable for kitchen walls and backsplashes. Confirm that the chosen product is recommended for the installation area and follow the manufacturer&apos;s cleaning and installation guidance.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                Which tiles are suitable for bathrooms?
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Marble, stone, mosaic, white and textured designs can help create different bathroom aesthetics. For floors, especially in wet areas, select products with suitable slip-resistance characteristics and confirm their application specifications.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                Are designer tiles suitable for commercial projects?
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Yes, selected designer tiles can be used in offices, retail stores, restaurants, hotels and other commercial interiors. Choose products according to expected foot traffic, cleaning requirements, durability and the specific installation environment.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                Where can I explore Timex Ceramic tiles in Mumbai?
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                You can explore Timex Ceramic&apos;s collections online or contact the team to arrange a visit to its Mumbai location in Vile Parle East. Confirm showroom timings and product availability before visiting.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#101B38] tracking-tight leading-snug">
                How can I select tiles for a feature wall?
              </h3>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-normal leading-relaxed">
                Start with the overall interior palette and choose a design that creates the desired contrast, texture or focal point. Moroccan, mosaic, metallic, highlighter, brick and textured tiles are options worth exploring, depending on the space and design concept.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
