"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface OctagonalCollectionContentProps {
  faqs?: FaqItem[];
}

export const OCTAGONAL_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-oct-1",
    question: "1. What are octagonal tiles?",
    answer: "Octagonal tiles are tiles with eight sides. Their distinctive geometry creates a repeating pattern that can add visual interest to floors and walls. Depending on the design, they can suit both classic and contemporary interiors.",
  },
  {
    id: "faq-oct-2",
    question: "2. Where can I find octagonal tiles in Mumbai?",
    answer: "You can explore octagonal tile designs through the Timex Ceramic category page at https://www.timexceramic.com/product-category/octagonal/. Contact Timex Ceramic for information about current designs, product specifications and availability.",
  },
  {
    id: "faq-oct-3",
    question: "3. What are octagonal tiles used for?",
    answer: "Octagonal tiles can be used for suitable floor and wall applications, including selected bathrooms, kitchens, entrance areas and feature walls. The correct application depends on the specifications and installation guidance of the individual product.",
  },
  {
    id: "faq-oct-4",
    question: "4. Are octagonal floor tiles suitable for bathrooms?",
    answer: "Some octagonal tiles are suitable for bathroom flooring, provided the product meets the requirements of the intended wet area. Check the tile's floor-use approval, slip-resistance rating and manufacturer's installation recommendations before selecting it.",
  },
  {
    id: "faq-oct-5",
    question: "5. Can octagonal tiles be used on kitchen walls?",
    answer: "Yes, octagonal tiles can be considered for kitchen backsplashes and other wall areas when the selected product is suitable for wall installation. Check cleaning guidance and suitability for the intended cooking-area exposure.",
  },
  {
    id: "faq-oct-6",
    question: "6. What is the difference between octagonal tiles and octagon floor tiles?",
    answer: "The terms generally refer to the same eight-sided tile shape. “Octagon floor tiles” specifically describes octagonal tiles intended for flooring, while “octagonal tiles” may refer to products designed for floors, walls or other approved applications.",
  },
  {
    id: "faq-oct-7",
    question: "7. What octagonal tile designs are suitable for modern homes?",
    answer: "Neutral geometric patterns, coordinated colour schemes and simple layouts can complement contemporary homes. Contrasting combinations and decorative patterns can also work well when balanced with the surrounding materials.",
  },
  {
    id: "faq-oct-8",
    question: "8. Can octagonal tiles be used for both floors and walls?",
    answer: "Some products are suitable for both applications, while others are intended for only one. Always check the individual product's specifications and manufacturer recommendations before installation.",
  },
  {
    id: "faq-oct-9",
    question: "9. Do octagonal tiles work in small bathrooms?",
    answer: "They can work in compact bathrooms when the tile dimensions, pattern and grout are selected carefully. Consider the size of the space, the layout and the relationship between the tiles and other bathroom finishes.",
  },
  {
    id: "faq-oct-10",
    question: "10. What colours work well with octagonal tiles?",
    answer: "Neutral colours can create an understated appearance, while contrasting shades can highlight the geometry. The best combination depends on the tile design, lighting and surrounding materials.",
  },
  {
    id: "faq-oct-11",
    question: "11. Can octagonal tiles be combined with smaller dot tiles?",
    answer: "Yes, octagonal tiles are sometimes paired with small square inserts, commonly called dot tiles, to create a classic decorative pattern. Confirm that the selected tiles are designed to work together and that their dimensions and thicknesses are compatible.",
  },
  {
    id: "faq-oct-12",
    question: "12. How do I choose the right octagonal tile size?",
    answer: "Consider the room dimensions, the intended layout, the number of cuts and the visual effect you want to create. Check the exact dimensions of the selected product and discuss the layout with your installer before ordering.",
  },
  {
    id: "faq-oct-13",
    question: "13. Are imported octagonal tiles available in Mumbai?",
    answer: "Availability depends on the supplier and current collection. If imported origin is important to your project, ask Timex Ceramic to confirm the origin and current availability of the specific product you are considering.",
  },
  {
    id: "faq-oct-14",
    question: "14. Are octagonal tiles suitable for commercial interiors?",
    answer: "They can be considered for suitable commercial applications, including selected retail, hospitality and reception areas. Confirm the product's suitability for the expected foot traffic, maintenance needs and other project specifications.",
  },
  {
    id: "faq-oct-15",
    question: "15. How do I maintain octagonal tiles?",
    answer: "Maintenance depends on the tile material, finish and grout. Follow the manufacturer's cleaning guidance, use compatible cleaning products and maintain grout joints as recommended.",
  },
  {
    id: "faq-oct-16",
    question: "16. How can I enquire about designer octagonal tiles in Mumbai?",
    answer: "Visit the Timex Ceramic octagonal tile category page to explore the collection. Contact Timex Ceramic with your preferred design, intended application and approximate project quantity to discuss product details and availability.",
  },
];

export function OctagonalCollectionContent({ faqs }: OctagonalCollectionContentProps) {
  const displayFaqs = faqs && faqs.length >= 16 ? faqs : OCTAGONAL_DEFAULT_FAQS;
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
          Octagonal Tiles in Mumbai – Designer Octagon Floor &amp; Wall Tiles
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Add a distinctive geometric touch to your interiors with octagonal tiles in Mumbai from Timex Ceramic. Recognised for their eight-sided shape, octagonal tiles bring a refreshing alternative to conventional square and rectangular formats. Their balanced geometry creates visual rhythm, making them an appealing choice for interiors that combine timeless character with contemporary design.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Whether you are planning an elegant bathroom, a distinctive kitchen, a welcoming entrance or a statement floor for a commercial space, octagonal tiles can help transform an ordinary surface into a design feature.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore our octagonal tile collection for design inspiration across residential and commercial interiors. From understated geometric layouts to classic patterns and contrasting combinations, discover ideas for creating surfaces that reflect your style and architectural vision.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          If you are searching for octagonal tiles in Mumbai, octagonal floor tiles, octagonal wall tiles or designer octagonal tiles for your next project, explore the Timex Ceramic collection to find a suitable design direction.
        </p>

        {/* Section 1: Explore Octagonal Floor Tiles in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Octagonal Floor Tiles in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Flooring plays an important role in defining the character of an interior. With their distinctive shape and repeating geometry, octagonal floor tiles in Mumbai can introduce pattern and personality while complementing a wide range of interior styles.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Depending on the selected product&apos;s specifications, octagonal tiles can be considered for:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Entrance foyers and hallways</li>
          <li className="pl-1">Living and dining areas</li>
          <li className="pl-1">Selected kitchen floors</li>
          <li className="pl-1">Bathroom floors using tiles suitable for wet areas</li>
          <li className="pl-1">Stair landings and other defined areas</li>
          <li className="pl-1">Boutique retail, hospitality and commercial interiors</li>
        </ul>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Octagon floor tile design ideas
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Classic geometric flooring:</strong>{" "}Use the eight-sided shape to create a structured, repeating pattern that adds interest without relying on elaborate decoration.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contrasting tile combinations:</strong>{" "}Pair complementary or contrasting colours to emphasise the geometry of the layout, where suitable products are available.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Neutral contemporary flooring:</strong>{" "}Choose a coordinated neutral palette for a more understated look that complements modern furniture and architectural details.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Decorative entrance flooring:</strong>{" "}Use octagonal tiles to establish a visual focal point in an entrance or foyer.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Bordered layouts:</strong>{" "}Combine the main tiled area with a complementary border to define a space, subject to compatible tile dimensions and installation requirements.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When choosing octagonal floor tiles, consider the room size, expected foot traffic, surface finish and maintenance needs. For bathrooms and other wet areas, check the product&apos;s slip-resistance rating and suitability for the intended application.
        </p>

        {/* Section 2: Octagonal Wall Tiles in Mumbai for Statement Interiors */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Octagonal Wall Tiles in Mumbai for Statement Interiors
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Walls offer an opportunity to introduce geometry, texture and detail without changing the entire material palette of a room. Octagonal wall tiles in Mumbai can create a distinctive backdrop for selected interior areas, bringing a sense of order and visual interest to otherwise simple surfaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Consider octagonal tiles for:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Kitchen backsplashes and decorative wall sections</li>
          <li className="pl-1">Bathroom vanity backdrops</li>
          <li className="pl-1">Selected bathroom feature walls</li>
          <li className="pl-1">Decorative niches and accent areas</li>
          <li className="pl-1">Living and dining room features</li>
          <li className="pl-1">Boutique cafés, restaurants and retail interiors</li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a balanced design, pair a patterned octagonal surface with simpler wall finishes, coordinated cabinetry or understated fittings. This helps the tile geometry remain a focal point without overwhelming the room.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Before selecting a tile for a wall, confirm its intended application, weight, installation requirements and compatibility with the substrate.
        </p>

        {/* Section 3: Octagonal Tiles for Bathroom in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Octagonal Tiles for Bathroom in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Bathrooms are ideal spaces for exploring distinctive tile shapes. Whether you prefer a classic look or a contemporary interior with subtle geometric detailing, octagonal tiles for bathroom in Mumbai can help create a more considered design.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Bathroom design ideas with octagonal tiles
        </h3>

        <div className="space-y-4 my-4 text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#101B38] mb-1">
              1. Geometric bathroom flooring
            </h4>
            <p>
              Create a repeating pattern that adds character to the bathroom floor. Choose a product specifically suitable for flooring and the conditions of the intended wet area.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#101B38] mb-1">
              2. Understated contemporary surfaces
            </h4>
            <p>
              Explore neutral shades and simple combinations for a calm, coordinated bathroom aesthetic.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#101B38] mb-1">
              3. Contrasting patterns
            </h4>
            <p>
              Use complementary colours to highlight the octagonal shape and create a more decorative visual effect.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#101B38] mb-1">
              4. Vanity feature walls
            </h4>
            <p>
              Consider octagonal wall tiles behind a vanity or basin to introduce a distinctive geometric detail.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#101B38] mb-1">
              5. Coordinated wall and floor schemes
            </h4>
            <p>
              Combine octagonal tiles with complementary surfaces to create a cohesive design. The wall and floor products should each be suitable for their intended application.
            </p>
          </div>
        </div>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When choosing octagonal bathroom tiles in Mumbai, review the finish, cleaning guidance, grout requirements and wet-area suitability. For bathroom floors, slip resistance is particularly important; a decorative appearance alone does not establish that a tile is safe for wet flooring.
        </p>

        {/* Section 4: Octagonal Tiles for Kitchen in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Octagonal Tiles for Kitchen in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Kitchen design is all about balancing visual appeal with everyday functionality. Octagonal tiles can introduce a geometric accent that complements cabinetry, countertops and fittings, whether used on a selected wall or a suitable floor.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Explore octagonal tiles for kitchen in Mumbai to create a kitchen that feels individual, well planned and visually cohesive.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Kitchen octagonal tile ideas
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Geometric kitchen backsplash:</strong>{" "}Use octagonal wall tiles to add a distinctive pattern behind the countertop.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contemporary neutral kitchen:</strong>{" "}Coordinate neutral tile colours with wood-inspired cabinetry, stone-look surfaces or simple fittings.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contrasting design details:</strong>{" "}Introduce a colour contrast to make the tiled area stand out against the surrounding finishes.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Pattern-led kitchen flooring:</strong>{" "}Consider octagonal floor tiles suitable for kitchen use to create a decorative foundation for the space.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Minimalist combinations:</strong>{" "}Let the geometry of the tile provide the detail while the remaining finishes stay simple.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When choosing octagonal kitchen tiles, consider cleaning requirements, cooking-area exposure, grout selection and the product&apos;s recommended use. Confirm whether the selected tile is suitable for a backsplash, wall or floor before ordering.
        </p>

        {/* Section 5: Designer Octagonal Tiles in Mumbai for Residential and Commercial Projects */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Designer Octagonal Tiles in Mumbai for Residential and Commercial Projects
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The right tile shape can make a meaningful difference to the overall look of a project. Octagonal tiles offer a distinctive alternative to standard formats and can be incorporated into a range of design concepts, from heritage-inspired interiors to contemporary commercial spaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Timex Ceramic&apos;s octagonal tile collection provides a starting point for homeowners, architects, interior designers, builders and developers exploring geometric tile designs.
        </p>

        <div className="space-y-6 mb-6">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For architects and interior designers
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Consider octagonal tiles when developing material palettes for bathrooms, kitchens, foyers and selected feature areas. Plan the tile layout, grout lines, borders and transitions alongside the rest of the interior scheme.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For homeowners and renovators
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Explore octagonal tiles to introduce a design detail that feels different from conventional tile formats. A well-chosen floor or feature wall can add character without requiring an elaborate overall design.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For builders and developers
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Consider octagonal tiles for selected areas where a distinctive geometric finish supports the project&apos;s interior concept. Confirm dimensions, quantities, availability and technical specifications before procurement.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For hospitality and commercial interiors
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Octagonal tiles can help establish a memorable visual identity in boutique cafés, restaurants, reception areas and retail environments. Select products based on the design intent, intended application and project maintenance requirements.
            </p>
          </div>
        </div>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For project enquiries, contact Timex Ceramic to discuss your design brief and the available octagonal tile options.
        </p>

        {/* Section 6: Imported Octagonal Tiles in Mumbai: What to Consider */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Imported Octagonal Tiles in Mumbai: What to Consider
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          If you are searching for imported octagonal tiles in Mumbai, evaluate both the visual design and the product details before finalising your selection. A distinctive shape can create the desired effect, but dimensions, finish, installation and suitability are equally important.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Keep the following factors in mind:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Shape and layout:</strong>{" "}Consider how the octagonal format will repeat across the available floor or wall area.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Colour combination:</strong>{" "}Decide whether you want a subtle, coordinated look or a stronger geometric contrast.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Tile dimensions:</strong>{" "}Confirm the exact product size and calculate how the layout will fit around edges, corners and fittings.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Surface finish:</strong>{" "}Review the finish and care recommendations for the intended application.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Installation requirements:</strong>{" "}Discuss alignment, grout joints, cutting, borders and wastage with your installer before ordering.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Product origin:</strong>{" "}If imported origin is a requirement, verify the product&apos;s country of origin with the supplier rather than assuming every designer tile is imported.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Project quantities and availability:</strong>{" "}For larger residential, hospitality or commercial projects, confirm current stock, lead times and batch consistency before committing to procurement.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          The best octagonal tile is one that meets your design objectives and the practical requirements of the space.
        </p>

        {/* Section 7: How to Choose the Right Octagonal Tile Design */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          How to Choose the Right Octagonal Tile Design
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Choosing an octagonal tile is about more than its shape. Use these steps to make a more informed selection.
        </p>

        <ol className="space-y-3.5 my-4 pl-5 list-decimal text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Identify the application.</strong>{" "}Decide whether the tile is intended for flooring, a kitchen wall, a bathroom wall or another surface.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Consider the room&apos;s proportions.</strong>{" "}The tile size and repeat pattern influence how the finished surface looks. Review dimensions and plan the layout before purchasing.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Select a suitable colour palette.</strong>{" "}Coordinate the tile with cabinetry, furniture, countertops, wall finishes and fittings.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Review the finish.</strong>{" "}Check whether the selected finish suits the lighting, maintenance needs and intended application.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Plan grout and borders.</strong>{" "}Grout colour and border details can emphasise or soften the geometric pattern. Confirm compatible products and installation requirements.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Verify technical suitability.</strong>{" "}Review the manufacturer&apos;s guidance for floor or wall use, wet areas, slip resistance where relevant, and cleaning.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Confirm quantities before ordering.</strong>{" "}Allow for cutting and wastage based on the actual layout, and confirm product availability for the complete project.
          </li>
        </ol>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          {/* Transition */}
        </p>

        {/* Section 8: Why Explore Octagonal Tiles at Timex Ceramic? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Why Explore Octagonal Tiles at Timex Ceramic?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore octagonal tile designs that can help bring a distinctive geometric element to your interiors. Whether your project calls for a decorative bathroom, a considered kitchen scheme or a statement entrance, the collection offers inspiration for exploring shape and layout.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Distinctive geometric styling:</strong>{" "}Explore the visual character of eight-sided tiles.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Versatile design inspiration:</strong>{" "}Consider ideas for contemporary, classic and transitional interiors.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Kitchen and bathroom applications:</strong>{" "}Explore options while checking product suitability for each surface.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Residential and commercial projects:</strong>{" "}Find inspiration for homes, hospitality interiors, retail spaces and other projects.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Project-focused enquiries:</strong>{" "}Discuss design preferences, product details and quantities with Timex Ceramic.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Discover the collection and explore octagonal tile designs that complement your space and architectural vision.
        </p>

        {/* Section 9: Discover Octagonal Tiles in Mumbai at Timex Ceramic */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Octagonal Tiles in Mumbai at Timex Ceramic
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Looking for octagonal floor tiles, octagonal wall tiles or a distinctive geometric finish for your next interior project? Explore the Timex Ceramic octagonal category to review available designs and identify options that fit your requirements.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For product dimensions, finish details, material specifications, installation suitability and current availability, check the individual product listing or contact Timex Ceramic before placing your order.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-12">
          Explore the collection:{" "}
          <Link
            href="/product-category/octagonal/"
            className="text-[#C95745] hover:underline font-medium break-all"
          >
            https://www.timexceramic.com/product-category/octagonal/
          </Link>
        </p>

        {/* Divider */}
        <hr className="border-t border-[#DED9D0] my-12 md:my-16" />

        {/* FAQs Section */}
        <div className="space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] leading-tight tracking-tight">
            Frequently Asked Questions About Octagonal Tiles
          </h2>

          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.has(index);

              // Render answer with interactive internal links where supplied
              const renderAnswer = (ans: string) => {
                if (ans.includes("https://www.timexceramic.com/product-category/octagonal/")) {
                  const parts = ans.split("https://www.timexceramic.com/product-category/octagonal/");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/octagonal/"
                        className="text-[#C95745] hover:underline font-medium break-all"
                      >
                        https://www.timexceramic.com/product-category/octagonal/
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                if (ans.includes("Timex Ceramic octagonal tile category page")) {
                  const parts = ans.split("Timex Ceramic octagonal tile category page");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/octagonal/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic octagonal tile category page
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-oct-${index + 1}`}
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

