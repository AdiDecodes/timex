"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface WoodenCollectionContentProps {
  faqs?: FaqItem[];
}

export const WOODEN_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-wood-1",
    question: "1. What are wood-look tiles?",
    answer: "Wood-look tiles are ceramic, porcelain or other tile products designed to reproduce the appearance of natural timber. Their visual design may include wood-grain patterns, knots, tonal variation and plank-inspired formats. The exact material and finish depend on the individual product.",
  },
  {
    id: "faq-wood-2",
    question: "2. Where can I find wooden tiles in Mumbai?",
    answer: "You can explore the wooden tile category on the Timex Ceramic website at https://www.timexceramic.com/product-category/wooden/. Contact Timex Ceramic for current product details, dimensions, availability and options for your project.",
  },
  {
    id: "faq-wood-3",
    question: "3. What are the benefits of wood-look tiles?",
    answer: "Wood-look tiles combine a timber-inspired appearance with the characteristics of the tile material used to manufacture them. Depending on the product, they may offer an option for spaces where a wood-inspired design is desired. Compare maintenance requirements, durability specifications and suitability with those of your other shortlisted materials.",
  },
  {
    id: "faq-wood-4",
    question: "4. Are wooden floor tiles suitable for living rooms?",
    answer: "Wood-look tiles can be a design option for living room floors when the selected product is approved for flooring. Consider the colour, dimensions, finish, expected foot traffic and how the tile will coordinate with furniture and wall finishes.",
  },
  {
    id: "faq-wood-5",
    question: "5. Are wooden tiles suitable for kitchens?",
    answer: "Wood-look tiles can be considered for suitable kitchen floors or walls. Check the individual product's intended application, cleaning guidance and technical specifications before selecting it for a cooking area.",
  },
  {
    id: "faq-wood-6",
    question: "6. Can wooden tiles be used in bathrooms?",
    answer: "Some wood-look tiles are suitable for bathroom applications. For bathroom floors and wet areas, verify the product's suitability and slip-resistance rating. Confirm that wall and floor products are appropriate for their respective uses.",
  },
  {
    id: "faq-wood-7",
    question: "7. What is the difference between wooden tiles and real wood flooring?",
    answer: "Wooden tiles are tile products designed to resemble timber, whereas real wood flooring is made from natural wood or engineered wood materials. Their installation methods, maintenance requirements, surface characteristics and performance differ. Compare the specifications of the particular products before choosing between them.",
  },
  {
    id: "faq-wood-8",
    question: "8. Are wood-effect tiles available in different colours?",
    answer: "Wood-inspired tile designs may be available in a range of tones, depending on the collection. These can include lighter, warmer or darker timber-inspired appearances. Check the current Timex Ceramic product listings for the colours and finishes available.",
  },
  {
    id: "faq-wood-9",
    question: "9. Are wooden wall tiles available in Mumbai?",
    answer: "You can explore wood-inspired tile designs through Timex Ceramic's wooden tile category. Check individual product listings to identify tiles intended for wall applications and confirm their dimensions and installation requirements.",
  },
  {
    id: "faq-wood-10",
    question: "10. Which wooden tiles are best for bedrooms?",
    answer: "The best option depends on the bedroom's lighting, furniture, wall colours and preferred style. Lighter tones can complement a bright, understated interior, while warmer or darker wood-inspired designs can create a more intimate look. Choose a product suitable for flooring.",
  },
  {
    id: "faq-wood-11",
    question: "11. What wood-look tiles are suitable for modern interiors?",
    answer: "Modern interiors can work well with understated wood-grain patterns, coordinated colours and clean installation layouts. The right option depends on the room's overall palette, the tile format and the desired visual effect.",
  },
  {
    id: "faq-wood-12",
    question: "12. Are wooden-look tiles suitable for commercial spaces?",
    answer: "Wood-look tiles can be considered for suitable commercial applications, including selected retail, hospitality and office interiors. Confirm that the chosen product meets the project's requirements for traffic, maintenance, flooring use and other technical specifications.",
  },
  {
    id: "faq-wood-13",
    question: "13. How do I choose the right wooden tile size?",
    answer: "Consider the size of the room, the layout, the number of cuts and the visual effect you want to create. Plank-style formats can evoke timber flooring, while other dimensions produce a different pattern. Check the exact dimensions of each product before planning the installation.",
  },
  {
    id: "faq-wood-14",
    question: "14. How should wooden tiles be cleaned?",
    answer: "Cleaning depends on the tile material, surface finish and grout. Follow the manufacturer's maintenance instructions and use suitable cleaning products. Check product guidance before using abrasive tools or strong chemicals.",
  },
  {
    id: "faq-wood-15",
    question: "15. Are premium wooden tiles suitable for large projects?",
    answer: "They may be suitable for larger residential, hospitality or commercial projects when the selected product meets the design and technical requirements. Confirm quantities, current availability, lead times and batch consistency with the supplier before procurement.",
  },
  {
    id: "faq-wood-16",
    question: "16. How can I enquire about wooden tiles in Mumbai?",
    answer: "Visit the Timex Ceramic wooden look tile category page to explore the collection. Contact Timex Ceramic with your preferred design, intended application and approximate project quantity to discuss product specifications and availability.",
  },
];

export function WoodenCollectionContent({ faqs }: WoodenCollectionContentProps) {
  const displayFaqs = faqs && faqs.length >= 16 ? faqs : WOODEN_DEFAULT_FAQS;
  const [openFaqIndices, setOpenFaqIndices] = useState<Set<number>>(new Set([0]));

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <section className="w-full mt-16 md:mt-24 border-t border-[#DED9D0] bg-[#EDEAE4] py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-10 text-[#333333]">
        {/* H1 Heading */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#101B38] leading-tight tracking-tight mb-6">
          Wood Look Tiles in India – Designer Wooden Floor &amp; Wall Tiles in Mumbai
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Create warm, inviting interiors with wood look tiles in India from Timex Ceramic. Inspired by the natural grains, textures and tones of timber, wooden-look tiles bring the character of wood into contemporary spaces through the versatility of tile design. Whether you are planning a cosy bedroom, an elegant living room, a modern kitchen or a distinctive commercial interior, wood-effect tiles offer a versatile way to build a cohesive design.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore our collection of wooden tiles in Mumbai to discover design inspiration for residential and commercial projects. From subtle wood-inspired finishes to statement flooring and decorative wall applications, the right tile can complement a range of interiors, from minimalist and contemporary to rustic and nature-inspired.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          If you are searching for wooden floor tiles in Mumbai, designer wooden tiles, wooden wall tiles or premium wood effect tiles, explore the Timex Ceramic collection to find styles that suit your space, material palette and design vision.
        </p>

        {/* Section 1: Explore Wooden Floor Tiles in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Wooden Floor Tiles in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Flooring establishes the foundation of an interior. Wood-inspired tiles bring visual warmth and a natural aesthetic to a room while offering the practical characteristics of their underlying tile material.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Our wooden floor tiles in Mumbai category is a starting point for exploring wood-inspired flooring ideas for homes, hospitality interiors and selected commercial spaces.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Where can you use wooden floor tiles?
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Living rooms:</strong>{" "}Create a warm foundation that complements contemporary furniture, neutral walls and layered textures.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Bedrooms:</strong>{" "}Build a calm, welcoming atmosphere with wood-inspired tones and coordinated furnishings.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Dining areas:</strong>{" "}Bring a natural visual element to dining spaces, whether your style is modern or rustic.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Kitchens:</strong>{" "}Explore wood-look flooring that complements cabinetry, countertops and other finishes, subject to the product&apos;s suitability for kitchen floors.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Retail and hospitality interiors:</strong>{" "}Consider wood-effect tiles for selected spaces where the design calls for a warm, natural appearance.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Passages and entrance areas:</strong>{" "}Use coordinated tile finishes to create a consistent visual flow between connected spaces.
          </li>
        </ul>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Wooden floor tile designs for different styles
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Light wood-look tiles:</strong>{" "}Suitable for interiors where you want a bright, understated and contemporary appearance.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Warm wood-effect finishes:</strong>{" "}Complement earthy colour palettes, natural materials and inviting residential spaces.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Dark wood-inspired tiles:</strong>{" "}Create a more dramatic look when paired with contrasting walls, lighter furniture or metallic details.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Rustic wood-look designs:</strong>{" "}Introduce a relaxed, textured aesthetic inspired by natural timber.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contemporary plank-style layouts:</strong>{" "}Use elongated tile formats, where available, to create a visual effect inspired by timber flooring.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When choosing wooden floor tiles, consider the room&apos;s lighting, the desired colour palette, expected foot traffic and the tile&apos;s finish. For bathrooms, balconies and other potentially wet areas, confirm the product&apos;s suitability and slip-resistance rating before installation.
        </p>

        {/* Section 2: Wooden Tiles in Mumbai for Modern Homes */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Wooden Tiles in Mumbai for Modern Homes
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The appeal of wood lies in its ability to make interiors feel connected, comfortable and welcoming. Wood-inspired tiles can complement a variety of architectural styles without restricting you to a single decorating theme.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          At Timex Ceramic, explore wooden tiles in Mumbai for design concepts that suit apartments, villas, renovated homes and contemporary residential projects.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Ideas for incorporating wood-look tiles
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Create a cohesive living space.</strong>{" "}Coordinate wood-look flooring with neutral walls, upholstered furniture and carefully selected accents.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Bring warmth to minimalist interiors.</strong>{" "}Combine a wood-inspired surface with clean lines, simple furniture and restrained colours.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Complement natural materials.</strong>{" "}Pair wooden-look tiles with stone-inspired surfaces, subtle textures and greenery to create a layered material palette.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Define individual zones.</strong>{" "}Use complementary tile finishes to distinguish a dining area, living space or other defined section within an open-plan interior.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Balance light and dark tones.</strong>{" "}Consider the amount of natural light in the room when choosing between lighter and deeper wood-inspired finishes.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For the best result, compare actual product samples or images under your intended lighting conditions and check the dimensions, finish and installation recommendations for the chosen tile.
        </p>

        {/* Section 3: Wooden Wall Tiles in Mumbai for Feature Walls */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Wooden Wall Tiles in Mumbai for Feature Walls
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Wood-inspired design is not limited to flooring. Wooden wall tiles in Mumbai can help create a striking focal point, add visual depth and connect the walls with the overall interior palette.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Depending on the product&apos;s specifications, wood-look wall tiles can be considered for:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Living room feature walls</li>
          <li className="pl-1">Bedroom accent walls and headboard backdrops</li>
          <li className="pl-1">Selected dining-area walls</li>
          <li className="pl-1">Decorative sections in reception areas</li>
          <li className="pl-1">Hospitality and retail interiors</li>
          <li className="pl-1">Other interior wall applications suited to the chosen product</li>
        </ul>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Wooden wall tile design ideas
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Bedroom feature walls:</strong>{" "}Introduce a warm wood-inspired backdrop behind the bed to complement soft furnishings and subtle lighting.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Living room accents:</strong>{" "}Use a wood-look wall surface to add contrast behind a media unit or within a defined feature area.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contemporary vertical layouts:</strong>{" "}Consider the direction and arrangement of the tile pattern to influence the visual proportions of the wall.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Material combinations:</strong>{" "}Pair wood-inspired tiles with stone-look, plain-coloured or textured surfaces for a more layered design.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Commercial interiors:</strong>{" "}Explore wood-effect wall finishes for selected reception areas, cafés, boutique retail spaces and hospitality interiors.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Before installation, confirm that the selected tile is approved for wall use and that the substrate, adhesive and fixing method meet the manufacturer&apos;s requirements.
        </p>

        {/* Section 4: Wood Effect Tiles in Mumbai: The Look of Timber, Your Way */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Wood Effect Tiles in Mumbai: The Look of Timber, Your Way
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Wood effect tiles in Mumbai offer design flexibility for people who appreciate the appearance of timber and want to explore alternative surface materials. Depending on the product, the printed or textured design may evoke natural wood grain, knots, tonal variation or a plank-like arrangement.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          The final appearance depends on the tile&apos;s colour, pattern, dimensions, surface finish and installation layout.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Choosing a wood-effect tile design
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">For contemporary interiors:</strong>{" "}Explore clean, understated wood-inspired patterns that complement simple furniture and modern fittings.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">For rustic interiors:</strong>{" "}Consider designs with more pronounced grain patterns and warmer tones, if available.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">For Scandinavian-inspired spaces:</strong>{" "}Pair lighter wood-effect tiles with neutral colours, natural fabrics and uncluttered furnishings.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">For industrial interiors:</strong>{" "}Combine wood-inspired surfaces with cement-look finishes, darker accents or metal details.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">For premium residential projects:</strong>{" "}Coordinate the tile with the furniture, lighting, wall finishes and architectural details to create a considered, cohesive interior.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When comparing products, look beyond the colour shown in a photograph. Check the actual dimensions, surface finish, material, recommended application and maintenance instructions.
        </p>

        {/* Section 5: Wooden Tiles for Kitchen, Bathroom and Other Spaces */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Wooden Tiles for Kitchen, Bathroom and Other Spaces
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Wood-inspired tiles can be incorporated into several parts of a project, but each application requires the right product specification.
        </p>

        <div className="space-y-6 mb-6">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              Wooden tiles for kitchens
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              A wood-inspired finish can complement kitchen cabinetry, countertops and other surfaces. Consider the overall colour balance, cleaning needs and the intended application before choosing a floor or wall tile.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              Wooden tiles for bathrooms
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Wood-look designs can introduce a natural visual element into bathroom interiors. For wet areas, confirm the tile&apos;s suitability, water-related specifications and appropriate slip resistance for the intended surface. Wall tiles and floor tiles are not automatically interchangeable.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              Wooden tiles for bedrooms
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Wood-inspired flooring can complement soft lighting, neutral bedding and understated furniture. Choose a colour and pattern that supports the atmosphere you want to create.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              Wooden tiles for living rooms
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Explore wood-effect flooring for a warm, cohesive look that can work with contemporary, classic and transitional furniture styles.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              Wooden tiles for hospitality and commercial projects
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              For hotels, cafés, restaurants, retail spaces and other commercial interiors, select tiles according to the design concept, anticipated use, maintenance requirements and project specifications.
            </p>
          </div>
        </div>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          {/* Transition */}
        </p>

        {/* Section 6: Premium Wooden Tiles in Mumbai for Design-Led Projects */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Premium Wooden Tiles in Mumbai for Design-Led Projects
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a refined interior, the difference often lies in how the materials work together. Premium wooden tiles in Mumbai can be considered for projects where the wood-inspired finish needs to complement a carefully planned palette of furniture, lighting, wall surfaces and architectural details.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Timex Ceramic&apos;s tile collections offer a starting point for exploring design-led surfaces for a variety of interiors.
        </p>

        <div className="space-y-6 mb-6">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For architects and interior designers
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Compare wood-inspired colours, grain patterns, formats and finishes against your material schedule. Consider tile direction, transitions between rooms, skirting details and how the selected design will appear across the complete installation.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For builders and developers
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Explore wooden-look tiles for suitable residential and common-area applications. Before finalising procurement, confirm technical specifications, quantities, availability, batch consistency and project timelines.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For hospitality and commercial buyers
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Consider wood-effect tile designs for selected areas where a natural, welcoming aesthetic supports the brand and interior concept. Review product suitability in relation to expected use, cleaning and maintenance.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For homeowners and renovators
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Start with the mood you want to create. Light and warm tones can produce different visual effects from deep, dark wood-inspired finishes. Compare the shortlisted options with your existing furniture and wall colours before making a final selection.
            </p>
          </div>
        </div>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For project-specific assistance, contact Timex Ceramic to discuss the collection and the requirements of your space.
        </p>

        {/* Section 7: Why Explore Wooden Tiles at Timex Ceramic? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Why Explore Wooden Tiles at Timex Ceramic?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore wood-inspired tile designs that can help bring warmth and character to your interiors. Whether you are planning a residential renovation, a new home, a hospitality project or a commercial space, the wooden tile category provides a starting point for discovering different design possibilities.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Wood-inspired aesthetics:</strong>{" "}Explore tile designs that draw inspiration from the grains, tones and patterns of timber.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Versatile interior styling:</strong>{" "}Consider wood-effect surfaces for a range of contemporary, classic and rustic design concepts.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Floor and wall design inspiration:</strong>{" "}Explore application ideas while confirming each product&apos;s intended use.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Residential and commercial relevance:</strong>{" "}Consider design options for homes, hospitality interiors, retail spaces and other projects.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Project-focused enquiries:</strong>{" "}Contact Timex Ceramic to discuss product specifications, availability and selection requirements.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Discover a wood-inspired finish that complements your design vision and the practical needs of your project.
        </p>

        {/* Section 8: Discover Wooden Floor Tiles in Mumbai at Timex Ceramic */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Wooden Floor Tiles in Mumbai at Timex Ceramic
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Looking for wooden floor tiles, wood-look wall tiles or designer wood-effect surfaces? Explore the Timex Ceramic wooden tile collection for ideas that bring natural warmth into contemporary interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Review individual product listings for dimensions, materials, finishes and recommended applications. For current availability or larger project requirements, contact Timex Ceramic before finalising your selection.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-12">
          Explore the collection:{" "}
          <Link
            href="/product-category/wooden/"
            className="text-[#C95745] hover:underline font-medium break-all"
          >
            https://www.timexceramic.com/product-category/wooden/
          </Link>
        </p>

        {/* Divider */}
        <hr className="border-t border-[#DED9D0] my-12 md:my-16" />

        {/* FAQs Section */}
        <div className="space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] leading-tight tracking-tight">
            Frequently Asked Questions About Wooden Tiles
          </h2>

          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.has(index);

              // Render answer with interactive internal links where supplied
              const renderAnswer = (ans: string) => {
                if (ans.includes("https://www.timexceramic.com/product-category/wooden/")) {
                  const parts = ans.split("https://www.timexceramic.com/product-category/wooden/");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/wooden/"
                        className="text-[#C95745] hover:underline font-medium break-all"
                      >
                        https://www.timexceramic.com/product-category/wooden/
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                if (ans.includes("Timex Ceramic wooden look tile category page")) {
                  const parts = ans.split("Timex Ceramic wooden look tile category page");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/wooden/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic wooden look tile category page
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-wood-${index + 1}`}
                  className="bg-[#FCFBF8] border border-[#DED9D0] rounded-xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/60 transition-colors"
                  >
                    <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-[#101B38] leading-snug">
                      {faq.question}
                    </h3>
                    <span
                      className={`p-1.5 rounded-full bg-[#EDEAE4] text-[#101B38] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-[#C95745]" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 md:px-6 md:pb-6 text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed border-t border-[#DED9D0]/50 pt-4">
                      <p>{renderAnswer(faq.answer)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

