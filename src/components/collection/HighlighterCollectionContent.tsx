"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface HighlighterCollectionContentProps {
  faqs?: FaqItem[];
}

export const HIGHLIGHTER_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-high-1",
    question: "1. What are highlighter tiles?",
    answer: "Highlighter tiles are decorative tiles used to create a focal point on selected walls. They may feature distinctive colours, patterns, textures or finishes that contrast with the main tiles and add visual interest to a space.",
  },
  {
    id: "faq-high-2",
    question: "2. Where can I find highlighter tiles in Mumbai?",
    answer: "You can explore highlighter tiles through Timex Ceramic's online highlighter tile collection. Review the available designs and contact the team to confirm product specifications, availability and suitability for your project.",
  },
  {
    id: "faq-high-3",
    question: "3. What are the different types of highlighter wall tiles?",
    answer: "Highlighter wall tiles can include patterned, textured, glossy, matte, colourful and metallic-look designs. The available options depend on the product collection, material and finish.",
  },
  {
    id: "faq-high-4",
    question: "4. Which highlighter tiles are suitable for bathrooms in Mumbai?",
    answer: "Choose highlighter tiles approved for bathroom wall applications, considering moisture exposure, cleaning requirements and the intended installation area. For shower walls and other wet areas, confirm product suitability and use the appropriate waterproofing system.",
  },
  {
    id: "faq-high-5",
    question: "5. Can highlighter tiles be used in kitchens?",
    answer: "Yes, suitable highlighter tiles can be used on kitchen walls and backsplashes. Select products that meet the area's cleaning and maintenance requirements, especially where the wall is exposed to grease, food splashes or heat.",
  },
  {
    id: "faq-high-6",
    question: "6. Which highlighter tiles are best for kitchen backsplashes?",
    answer: "The best option depends on your kitchen design and maintenance needs. Glossy, matte and patterned tiles can all work for suitable backsplash applications, provided the selected product is compatible with the exposure conditions and recommended cleaning methods.",
  },
  {
    id: "faq-high-7",
    question: "7. Are highlighter tiles suitable for living rooms?",
    answer: "Yes, decorative highlighter tiles can create feature walls behind television units, around niches or along selected living-room walls. Coordinate the design with flooring, furniture, lighting and the main wall colour.",
  },
  {
    id: "faq-high-8",
    question: "8. How do I choose highlighter tile designs in Mumbai?",
    answer: "Consider the room, wall dimensions, preferred colour palette, lighting, tile format and surrounding finishes. Compare patterns and finishes before choosing a design that complements the space without making it visually crowded.",
  },
  {
    id: "faq-high-9",
    question: "9. Are designer highlighter tiles available in different colours?",
    answer: "Highlighter tiles may be available in colours such as white, beige, blue and green, depending on the collection. Check the current catalogue for the colours and designs available.",
  },
  {
    id: "faq-high-10",
    question: "10. What is the difference between highlighter tiles and regular wall tiles?",
    answer: "Regular wall tiles often provide the primary surface finish, while highlighter tiles are generally selected for their decorative impact. They can be used together to create contrast, highlight specific areas and establish a focal point.",
  },
  {
    id: "faq-high-11",
    question: "11. Are glossy highlighter tiles suitable for small rooms?",
    answer: "Glossy highlighter tiles can help reflect available light and create a brighter visual effect. Their impact depends on the room's lighting, tile colour, pattern and placement, so sample viewing can help with selection.",
  },
  {
    id: "faq-high-12",
    question: "12. Should I choose matte or glossy highlighter tiles?",
    answer: "Choose glossy tiles for a more reflective appearance and matte tiles for a softer visual effect. Consider the room's lighting, desired design style, cleaning requirements and the finish of the surrounding tiles.",
  },
  {
    id: "faq-high-13",
    question: "13. Are metallic highlighter tiles suitable for modern interiors?",
    answer: "Metallic-look highlighter tiles can complement contemporary interiors, especially when coordinated with suitable lighting, furniture and fittings. Use them as selected accents to maintain a balanced design.",
  },
  {
    id: "faq-high-14",
    question: "14. Can highlighter tiles be paired with plain tiles?",
    answer: "Yes, pairing decorative highlighter tiles with plain tiles is a common way to create contrast. Choose complementary colours, finishes and proportions so the decorative pattern enhances the main surface rather than competing with it.",
  },
  {
    id: "faq-high-15",
    question: "15. Are imported highlighter tiles available in Mumbai?",
    answer: "Availability depends on the current collection and stock. Contact Timex Ceramic to confirm which imported highlighter tile designs are available and request their specifications and country-of-origin details.",
  },
  {
    id: "faq-high-16",
    question: "16. Are ceramic highlighter tiles suitable for wall decoration?",
    answer: "Ceramic highlighter tiles can be suitable for wall decoration when the particular product is approved for the intended application. Follow the manufacturer's recommendations for installation, substrate preparation and maintenance.",
  },
  {
    id: "faq-high-17",
    question: "17. Can porcelain highlighter tiles be used in living rooms?",
    answer: "Porcelain highlighter tiles can be suitable for selected living-room wall applications when the product specifications and installation requirements are appropriate. Confirm whether the selected product is intended for walls and follow the recommended fixing system.",
  },
  {
    id: "faq-high-18",
    question: "18. How do I maintain decorative highlighter tiles?",
    answer: "Maintenance depends on the tile material, surface finish and grout. In general, use cleaning products recommended for the specific tile and avoid abrasive cleaners unless the manufacturer confirms they are suitable.",
  },
  {
    id: "faq-high-19",
    question: "19. How many highlighter tiles do I need for a feature wall?",
    answer: "Calculate the total area to be covered and divide it by the coverage per tile or per box. Account for the layout, cuts, pattern alignment and an appropriate allowance for wastage. Confirm coverage using the actual product dimensions.",
  },
  {
    id: "faq-high-20",
    question: "20. How can I enquire about highlighter tiles at Timex Ceramic?",
    answer: "Visit the Timex Ceramic highlighter tile category page to browse the collection. Contact the team with your preferred design, intended application and approximate quantity to discuss product details and availability.",
  },
];

export function HighlighterCollectionContent({ faqs }: HighlighterCollectionContentProps) {
  const activeFaqs = faqs && faqs.length >= 20 ? faqs : HIGHLIGHTER_DEFAULT_FAQS;
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="w-full mt-16 md:mt-24 border-t border-[#DED9D0] bg-[#EDEAE4] py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-10 text-[#333333]">
        {/* H1 Heading */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#101B38] leading-tight tracking-tight mb-6">
          Highlighter Tiles in Mumbai for Stylish, Statement Walls
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Sometimes, a single wall is all it takes to transform a space. Highlighter tiles from Timex Ceramic, Mumbai, bring colour, pattern, texture and visual character to interiors, helping turn everyday walls into distinctive design features. Whether you are refreshing a bathroom, planning a kitchen backsplash, styling a living room or designing a hospitality project, decorative highlighter wall tiles can introduce personality without overwhelming the overall design.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Explore designer highlighter tiles in Mumbai for contemporary homes, apartments, hotels, restaurants and commercial interiors. With selected imported ceramic and porcelain options in glossy, matt and metallic finishes, the Timex Ceramic collection offers design possibilities for different styles and spaces. The right choice depends on your preferred aesthetic, intended application and the specifications of the individual tile.
        </p>

        {/* Section 1: Explore Designer Highlighter Wall Tiles in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Designer Highlighter Wall Tiles in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Highlighter tiles are decorative tiles used to draw attention to selected areas of a wall through colour, pattern, finish or texture. They can complement plain tiles, create contrast against neutral surfaces or establish a focal point within a room.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore highlighter tile designs for interiors that call for an extra layer of detail. Depending on the available design, a decorative tile can bring a subtle accent to a minimalist space or add a stronger visual statement to an expressive interior.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          Consider highlighter tiles for:
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Feature walls that create a focal point in a room.</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Bathroom walls and selected vanity or shower-area surfaces.</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Kitchen backsplashes and decorative wall sections.</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Living room walls and TV-unit backdrops.</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Bedroom feature walls and selected decorative panels.</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Dining areas, restaurants and hospitality interiors.</span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For the best visual result, coordinate the tile pattern and finish with your base tiles, lighting, cabinetry, fixtures and other materials.
        </p>

        {/* Section 2: Highlighter Tiles for Bathrooms in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Highlighter Tiles for Bathrooms in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          A bathroom can feel more considered and individual with a carefully chosen decorative wall. Highlighter tiles for bathrooms in Mumbai offer a way to introduce contrast, pattern or colour while keeping the rest of the space visually balanced.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Use a highlighter design to define the wall behind a vanity, create a decorative panel or add interest to a selected shower-area wall. White and beige tones can complement understated interiors, while blue and green accents can create a fresh, contemporary mood. Metallic details may suit bathrooms designed around coordinated fittings and sophisticated finishes.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For compact bathrooms, a focused accent area can create visual interest without making every wall feel busy. In larger bathrooms, a decorative panel can help establish zones and complement the wider material palette.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Before choosing a product for a wet area, verify that it is approved for the intended wall application and confirm the recommended adhesive, grout and maintenance requirements.
        </p>

        {/* Section 3: Highlighter Tiles for Kitchen Walls and Backsplashes */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Highlighter Tiles for Kitchen Walls and Backsplashes
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The kitchen is both a functional workspace and an important part of the home's visual identity. Highlighter tiles for kitchens in Mumbai can bring a distinctive finish to the wall behind a countertop, between cabinets or within a selected cooking or preparation area.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          A decorative backsplash can complement plain wall tiles, contrast with cabinet colours or connect different elements of the kitchen design. Consider white or beige designs for a subtle look, blue or green accents for added character, or selected metallic finishes for a more contemporary scheme.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          When choosing highlighter tiles for a kitchen backsplash, consider:
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Colour coordination:</strong> Match or contrast the tiles with cabinetry, countertops and fittings.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Pattern scale:</strong> Select a pattern that suits the available wall area.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Finish:</strong> Consider how glossy, matt or metallic surfaces look under your kitchen lighting.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Cleaning requirements:</strong> Check the product's maintenance guidance, particularly in areas exposed to cooking splashes and grease.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Installation:</strong> Confirm the suitability of the tile, adhesive and grout for the intended backsplash location.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The goal is to create a decorative surface that looks intentional and remains practical for everyday use.
        </p>

        {/* Section 4: Highlighter Tiles for Living Rooms and Feature Walls */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Highlighter Tiles for Living Rooms and Feature Walls
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Living rooms offer an opportunity to use decorative tiles beyond traditional kitchen and bathroom applications. Highlighter tiles for living rooms in Mumbai can help define a TV wall, a decorative niche or a selected feature behind a seating area.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a calm contemporary interior, consider a restrained pattern with neutral base colours. If the room has simple furniture and minimal decoration, a more expressive tile design can provide contrast and a clear focal point. Metallic accents may complement modern interiors when coordinated with lighting, furniture details and other finishes.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For architects and interior designers, highlighter tiles can also help connect the living room's material palette with adjoining dining areas, foyers or other open-plan spaces. Select the design in relation to the full interior scheme rather than viewing the tile in isolation.
        </p>

        {/* Section 5: Discover Imported Highlighter Tiles in Different Finishes */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Imported Highlighter Tiles in Different Finishes
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          The finish of a tile influences how it looks under natural and artificial lighting. Timex Ceramic's supplied product information includes imported ceramic and porcelain wall tiles in glossy and matt finishes, along with selected porcelain options listed as metallic.
        </p>

        <div className="space-y-6 my-6">
          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
              Glossy Highlighter Tiles
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Glossy surfaces can add sheen and reflect light, making them worth considering for decorative wall panels and selected kitchen or bathroom applications. Review the specific product and lighting conditions to determine how its surface will appear in your space.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
              Matt Highlighter Tiles
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Matt finishes offer a more understated appearance and can complement contemporary, neutral or natural-inspired interiors. They can be considered when you want a decorative pattern without a strongly reflective surface.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
              Metallic Highlighter Tiles
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Selected metallic-finish tiles can introduce a distinctive accent to modern interiors. Coordinate them with cabinet handles, light fittings, taps or other design details for a cohesive look. Confirm the actual finish of the individual product before specifying it.
            </p>
          </div>
        </div>

        {/* Section 6: Highlighter Tile Colours for Different Interior Styles */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Highlighter Tile Colours for Different Interior Styles
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Colour helps establish the mood of a room and determines how the decorative surface relates to the surrounding finishes.
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>White highlighter tiles:</strong> A versatile option for light, understated interior schemes.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Beige highlighter tiles:</strong> Suitable for warm, neutral palettes and interiors featuring wood-look or stone-inspired materials.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Blue highlighter tiles:</strong> Can introduce a cooler accent to selected bathroom or kitchen walls.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Green highlighter tiles:</strong> Bring a fresh colour element to contemporary decorative schemes.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Metallic accents:</strong> Can create a more pronounced visual detail when used with complementary materials.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The supplied Timex Ceramic product data includes white and beige options in selected ceramic and porcelain wall tiles, as well as beige, blue and green options in a listed matt and metallic porcelain range. Actual colours and finishes vary by product, so check the individual tile listing before making a final selection.
        </p>

        {/* Section 7: Highlighter Tiles for Residential and Commercial Projects */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Highlighter Tiles for Residential and Commercial Projects
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Decorative wall tiles can help establish a consistent visual identity across a range of projects when selected according to the space and its intended use.
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For residential projects:</strong> Explore highlighter designs for bathrooms, kitchen backsplashes, living room feature walls and selected bedroom or dining areas.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For hospitality projects:</strong> Consider decorative wall sections in hotel interiors, restaurants and other guest-facing spaces, subject to the product's suitability and maintenance requirements.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For retail and commercial interiors:</strong> Use selected highlighter designs to introduce a visual focal point that complements the brand's colours and interior concept.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For architects and interior designers:</strong> Evaluate the design, format, finish and product specifications together so that the selected tile supports the intended aesthetic and installation requirements.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For developers and contractors:</strong> Confirm dimensions, quantity, availability, installation details and project requirements before finalising the tile schedule.
            </span>
          </li>
        </ul>

        {/* Section 8: Why Explore Highlighter Tiles at Timex Ceramic? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Why Explore Highlighter Tiles at Timex Ceramic?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Choosing decorative tiles is about finding the right balance between visual appeal, practical requirements and the overall design vision. Timex Ceramic offers a curated tile-shopping destination for those exploring distinctive surfaces for residential and commercial interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Whether you are an architect specifying materials, an interior designer developing a concept, a contractor coordinating finishes or a homeowner planning a renovation, the highlighter tile collection provides a starting point for exploring decorative wall options in Mumbai and across India.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Review the available product designs and confirm each tile's material, dimensions, finish, intended application and current availability with the Timex Ceramic team. This helps ensure that your final selection meets both the design brief and the practical needs of your project.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-12">
          Explore{" "}
          <Link
            href="/product-category/highlighter/"
            className="text-[#C95745] hover:underline font-medium"
          >
            Highlighter Tiles at Timex Ceramic
          </Link>{" "}
          to find decorative wall tile options for your next bathroom, kitchen, living room or commercial interior project.
        </p>

        {/* FAQs Section */}
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-[#DED9D0]">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] leading-tight tracking-tight mb-8">
            Frequently Asked Questions About Highlighter Tiles
          </h2>

          <div className="space-y-4">
            {activeFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.includes(index);

              // Interactive links for FAQ 2 and FAQ 20
              const renderAnswer = (ans: string) => {
                if (
                  faq.question.includes("Where can I find highlighter tiles in Mumbai?") ||
                  index === 1
                ) {
                  return (
                    <>
                      You can explore highlighter tiles through Timex Ceramic's{" "}
                      <Link
                        href="/product-category/highlighter/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        online highlighter tile collection
                      </Link>
                      . Review the available designs and contact the team to confirm product specifications, availability and suitability for your project.
                    </>
                  );
                }
                if (
                  faq.question.includes("How can I enquire about highlighter tiles at Timex Ceramic?") ||
                  index === 19
                ) {
                  return (
                    <>
                      Visit the Timex Ceramic{" "}
                      <Link
                        href="/product-category/highlighter/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        highlighter tile category page
                      </Link>{" "}
                      to browse the collection.{" "}
                      <Link
                        href="/contact"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Contact the team
                      </Link>{" "}
                      with your preferred design, intended application and approximate quantity to discuss product details and availability.
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-high-${index + 1}`}
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

