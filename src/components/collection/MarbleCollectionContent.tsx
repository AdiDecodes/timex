"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface MarbleCollectionContentProps {
  faqs?: FaqItem[];
}

export const MARBLE_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-marble-1",
    question: "1. Where can I find marble wall tiles in Mumbai?",
    answer: "You can explore the marble tile collection at Timex Ceramic's Marble Tiles category page. Review the available designs and contact the team for information about product specifications, availability and suitability for your project.",
  },
  {
    id: "faq-marble-2",
    question: "2. What are marble tiles used for?",
    answer: "Marble tiles and marble-look tiles can be used for suitable wall and floor applications, including living rooms, bedrooms, kitchen backsplashes, bathroom walls, selected bathroom floors, entrance areas and commercial interiors. The appropriate use depends on the product's technical specifications.",
  },
  {
    id: "faq-marble-3",
    question: "3. What is the difference between natural marble and marble-look tiles?",
    answer: "Natural marble is a stone formed through geological processes and typically features natural variations in colour and veining. Marble-look tiles are manufactured products designed to reproduce the appearance of marble. Their composition, maintenance requirements and performance depend on the specific material.",
  },
  {
    id: "faq-marble-4",
    question: "4. Are marble-look tiles suitable for modern homes?",
    answer: "Yes! Marble-look tiles can complement contemporary homes, minimalist interiors, luxury apartments and traditional design schemes. They are available in different visual styles and can be coordinated with wood, metal, glass and other interior finishes.",
  },
  {
    id: "faq-marble-5",
    question: "5. Which marble tiles are suitable for kitchen walls in Mumbai?",
    answer: "For backsplashes near cooking and washing zones, consider resistance-to-staining under intended use and follow the manufacturer's cleaning instructions.",
  },
  {
    id: "faq-marble-6",
    question: "6. Are marble bathroom tiles suitable for wet areas?",
    answer: "Marble-inspired tiles can be suitable for bathroom walls and, where specifically rated, bathroom floors and other wet areas. Verify water absorption, surface suitability, slip performance and installation requirements before selecting a product.",
  },
  {
    id: "faq-marble-7",
    question: "7. Which marble floor tiles are best for living rooms?",
    answer: "The best choice depends on room size, lighting, interior style, foot traffic and maintenance preferences. Consider the tile's surface finish, dimensions, durability specifications and compatibility with the overall design scheme.",
  },
  {
    id: "faq-marble-8",
    question: "8. Are marble-look tiles easy to maintain?",
    answer: "Maintenance depends on the tile material, surface finish, grout and installation. Follow the manufacturer's care instructions and use suitable cleaning products. Avoid assuming that every marble-look tile has identical stain resistance or maintenance requirements.",
  },
  {
    id: "faq-marble-9",
    question: "9. How do I choose marble tile designs in Mumbai for a small room?",
    answer: "Lighter colours, restrained veining and a coordinated palette can help create a more open visual impression. Consider tile dimensions, grout colour, natural lighting and the relationship between the wall and floor finishes before finalising the design.",
  },
  {
    id: "faq-marble-10",
    question: "10. Are designer marble tiles suitable for hotels and commercial projects?",
    answer: "Yes, marble-inspired tiles can be considered for selected hotel interiors, reception areas, offices, retail stores and other commercial spaces. Confirm the product's suitability for the expected traffic, cleaning frequency, durability requirements and intended installation.",
  },
  {
    id: "faq-marble-11",
    question: "11. What should architects and interior designers check before specifying marble tiles?",
    answer: "Review the tile dimensions, finish, colour variation, technical data, intended application, installation method, maintenance requirements, quantity and availability. For larger projects, also coordinate samples, batch consistency, lead times and relevant compliance requirements.",
  },
  {
    id: "faq-marble-12",
    question: "12. How do I select premium marble tiles for a residential project?",
    answer: "Start with the design concept, budget, intended application and preferred colour palette. Compare samples under the actual lighting conditions, check technical specifications and coordinate the tiles with the project's furniture, fittings and other surface materials.",
  },
  {
    id: "faq-marble-13",
    question: "13. Can marble-look tiles be used for both walls and floors?",
    answer: "Some marble-look tiles are suitable for both applications, while others are designed for a specific use. Always verify the manufacturer's product specifications rather than assuming that a wall tile is suitable for flooring.",
  },
  {
    id: "faq-marble-14",
    question: "14. Are marble tiles suitable for exterior applications?",
    answer: "Only products specifically rated for the intended exterior application should be considered. Assess weather exposure, water absorption, substrate conditions, fixing systems and the manufacturer's installation guidance before specification.",
  },
  {
    id: "faq-marble-15",
    question: "15. Where can I enquire about marble tiles for projects in Mumbai?",
    answer: "Visit the Timex Ceramic Marble Tiles page and contact the team to discuss available designs, product specifications and your residential or commercial project requirements.",
  },
];

export function MarbleCollectionContent({ faqs }: MarbleCollectionContentProps) {
  const displayFaqs = faqs && faqs.length > 0 ? faqs : MARBLE_DEFAULT_FAQS;
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
          Marble Wall Tiles in Mumbai – Elegant Marble Tile Designs for Every Space
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Bring timeless elegance to your interiors with the marble tile collection at Timex Ceramic. Inspired by the natural beauty of marble, these tile designs offer a sophisticated way to introduce luxurious patterns, refined finishes and striking visual details into residential and commercial spaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Whether you are designing a contemporary apartment, renovating a luxury bathroom, creating an elegant kitchen or planning a premium commercial interior, the right marble tiles can transform the look and feel of your space.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          If you are searching for <strong className="font-semibold text-[#101B38]">marble wall tiles in Mumbai</strong>, explore a curated selection of designs that complement different architectural styles, interior palettes and project requirements. From understated marble-inspired patterns to dramatic veining and statement finishes, discover possibilities for walls, floors and decorative surfaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          At Timex Ceramic, we help homeowners, architects, interior designers, developers and project professionals explore tile designs that bring their creative vision to life.
        </p>

        {/* Section 1: Explore Marble Tile Designs in Mumbai for Timeless Interiors */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Marble Tile Designs in Mumbai for Timeless Interiors
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Marble has long been associated with elegance, sophistication and architectural beauty. Today, marble-inspired tiles offer versatile design possibilities for interiors ranging from minimal and contemporary to classic and luxurious.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The right design can make a room feel brighter, create a sense of visual continuity or establish an eye-catching focal point.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore marble tile designs in Mumbai for:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contemporary homes:</strong> Create clean, sophisticated interiors with subtle marble patterns and coordinated finishes.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Luxury apartments and villas:</strong> Introduce statement surfaces that complement premium furniture, lighting and architectural detailing.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Hotels and hospitality spaces:</strong> Explore elegant finishes for selected guest areas, reception spaces and interior feature walls.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Retail stores and offices:</strong> Create polished, cohesive environments that reflect the character of your brand.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Residential and commercial developments:</strong> Select coordinated wall and floor finishes suited to the project&apos;s design brief and technical requirements.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mt-4 mb-8 md:mb-10">
          Whether your preference is understated elegance or bold visual drama, marble-look tiles provide opportunities to create distinctive spaces with a considered design approach.
        </p>

        {/* Section 2: Marble Wall Tiles in Mumbai for Sophisticated Interiors */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Marble Wall Tiles in Mumbai for Sophisticated Interiors
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Walls play an important role in defining the atmosphere of a room. Marble wall tiles can introduce depth, pattern and refined character without relying on additional decorative elements.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Use marble-inspired wall finishes to create a feature wall in a living room, an elegant backdrop behind a bed, a sophisticated bathroom setting or a statement surface in an entrance or reception area.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Light marble designs can complement neutral colour palettes, natural wood and minimalist furniture. Designs with stronger veining can create visual contrast and become a focal point within the interior.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When selecting marble wall tiles in Mumbai, consider the scale of the room, the direction of natural light, the pattern of the tile and how the finish coordinates with other materials.
        </p>

        {/* Section 3: Marble Kitchen Tiles in Mumbai – A Refined Culinary Space */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Marble Kitchen Tiles in Mumbai – A Refined Culinary Space
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          A well-designed kitchen balances everyday practicality with visual appeal. Marble-inspired tiles bring a refined aesthetic to kitchen walls, backsplashes and other suitable surfaces, complementing contemporary cabinetry and a variety of countertop materials.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Marble Kitchen Wall Tiles
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Create an elegant backdrop with marble kitchen wall tiles in shades that coordinate with your cabinetry, countertops and fittings. White and light-toned marble patterns can complement bright, contemporary kitchens, while darker designs can introduce contrast and a more dramatic appeal.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Marble Backsplash Designs
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          A marble-look backsplash can become a defining feature behind a hob, sink or preparation counter. Consider the pattern, grout lines, cleaning requirements and suitability of the chosen tile for the intended installation.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Choosing the Right Kitchen Finish
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For kitchen applications, prioritise surfaces that are suitable for the location and practical to maintain. Areas exposed to grease, water and frequent cleaning require particular attention to the manufacturer&apos;s care instructions.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          With the right selection, marble kitchen tiles in Mumbai can help create a kitchen that feels cohesive, sophisticated and designed around your lifestyle.
        </p>

        {/* Section 4: Marble Bathroom Tiles in Mumbai – Create Your Personal Retreat */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Marble Bathroom Tiles in Mumbai – Create Your Personal Retreat
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Transform an everyday bathroom into a calming, spa-inspired space with marble bathroom tiles. The natural-looking patterns and elegant tones of marble-inspired surfaces can bring a sense of openness, continuity and understated luxury to bathroom interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Consider these design possibilities:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Marble shower walls:</strong> Create a coordinated, elegant backdrop using tiles suitable for wet-area installation.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Bathroom feature walls:</strong> Highlight the vanity, mirror or bathing area with a distinctive marble pattern.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Light marble designs:</strong> Complement compact bathrooms with bright colours, reflective lighting and simple fittings.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Dark marble finishes:</strong> Introduce contrast and visual depth in contemporary bathroom schemes.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Coordinated wall and floor designs:</strong> Create a cohesive appearance while selecting a floor tile with appropriate wet-area slip performance.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When choosing marble bathroom tiles in Mumbai, confirm water absorption, cleaning requirements and suitability for wet areas. For bathroom floors, select a product specifically appropriate for the expected moisture and slip-risk conditions.
        </p>

        {/* Section 5: Marble Floor Tiles in Mumbai for Beautiful, Cohesive Spaces */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Marble Floor Tiles in Mumbai for Beautiful, Cohesive Spaces
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Flooring establishes the foundation of an interior design scheme. Marble-look floor tiles offer the visual appeal of marble-inspired veining and tonal variation, making them suitable for a variety of design concepts.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Explore marble floor tiles in Mumbai for your living rooms, bedrooms, entrance areas and selected commercial interiors, subject to the technical suitability of the chosen product.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Marble Floor Tiles for Living Rooms
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Create an elegant foundation for your furniture and décor with marble-inspired flooring. Large-format designs, where available, can help establish a more continuous visual effect, while coordinated wall finishes can enhance the overall design.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Marble Floor Tiles for Bedrooms
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Use subtle marble patterns and complementary colours to create a calm, sophisticated bedroom. Coordinate the floor with wardrobes, soft furnishings, lighting and wall finishes for a balanced result.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Marble Flooring for Commercial Spaces
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Marble-look tiles can be considered for selected hotel interiors, offices, retail environments and reception areas. For commercial projects, assess expected foot traffic, abrasion resistance, cleaning needs and the product&apos;s intended-use specifications.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Before finalising marble floor tiles, confirm the tile&apos;s slip performance, surface finish, durability requirements and suitability for the intended application.
        </p>

        {/* Section 6: Marble Look Tiles in Mumbai – Inspired by Natural Marble */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Marble Look Tiles in Mumbai – Inspired by Natural Marble
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          If you love the appearance of natural marble, marble-look tiles offer another way to achieve an elegant, marble-inspired interior.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          These tiles are designed to reproduce visual characteristics associated with marble, such as veining, tonal variation and stone-texture inspired patterns. Depending on the product, they may offer a different balance of maintenance requirements, consistency and design flexibility compared with natural stone.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Why Consider Marble-Look Tiles?
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Design versatility:</strong> Explore different marble-inspired colours, patterns and finishes.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Coordinated interiors:</strong> Create a consistent visual theme across suitable wall and floor applications.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contemporary aesthetics:</strong> Complement modern furniture, minimalist architecture and refined decorative elements.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Flexible design planning:</strong> Compare available formats, patterns and finishes to suit the scale of your project.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Product-specific maintenance:</strong> Review the manufacturer&apos;s care guidance to understand cleaning and upkeep requirements.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Marble-look tiles are not all identical in composition or performance. Check the specifications of each product before deciding where to install it.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For homeowners and professionals searching for marble-look tiles in Mumbai, Timex Ceramic offers a destination to explore distinctive tile designs for a range of interior concepts.
        </p>

        {/* Section 7: Designer Marble Tiles in Mumbai for Premium Projects */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Designer Marble Tiles in Mumbai for Premium Projects
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Great interiors are created through thoughtful material selection. Designer marble tiles can help establish the visual identity of a space, whether the goal is subtle sophistication, a contemporary statement or a luxurious atmosphere.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For architects and interior designers, marble-inspired finishes can complement a wide range of materials, including wood, metal, glass, textured surfaces and neutral wall colours.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For developers and contractors, tile selection involves more than appearance. Project planning should also include dimensions, installation requirements, product availability, quantities, maintenance and technical documentation.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore designer marble tiles in Mumbai for residential interiors, premium apartments, villas, hospitality spaces, retail environments and selected commercial projects.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Choose designs that support the overall architectural concept while meeting the practical requirements of the intended space.
        </p>

        {/* Section 8: Premium Marble Tiles in Mumbai – Choose the Right Design for Your Space */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Premium Marble Tiles in Mumbai – Choose the Right Design for Your Space
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Finding the right marble tile involves balancing aesthetics, functionality and project needs. A pattern that works beautifully in a spacious living room may have a very different effect in a compact bathroom or a small kitchen.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Consider these before making your selection…
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <p className="font-semibold text-[#101B38] text-sm md:text-base mb-1">
              1. Colour and veining
            </p>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Choose subtle patterns for understated interiors or pronounced veining for a more dramatic design statement.
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#101B38] text-sm md:text-base mb-1">
              2. Tile size and layout
            </p>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Consider the room dimensions, grout lines and pattern alignment. Review the available formats and plan the layout before ordering.
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#101B38] text-sm md:text-base mb-1">
              3. Surface finish
            </p>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Compare available finishes based on the desired appearance, lighting conditions, cleaning needs and intended application.
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#101B38] text-sm md:text-base mb-1">
              4. Application suitability
            </p>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Wall tiles and floor tiles are not automatically interchangeable. Verify that the selected product is approved for the intended use.
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#101B38] text-sm md:text-base mb-1">
              5. Maintenance requirements
            </p>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Understand the cleaning recommendations and care instructions for the specific tile, particularly in kitchens, bathrooms and high-use commercial areas.
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#101B38] text-sm md:text-base mb-1">
              6. Project requirements
            </p>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              For large residential or commercial projects, confirm quantities, availability, batch consistency, delivery schedules and installation requirements before finalising the specification.
            </p>
          </div>
        </div>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          By considering these factors, you can choose premium marble tiles that complement your design vision and practical requirements.
        </p>

        {/* Section 9: Why Explore Marble Tiles at Timex Ceramic? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Why Explore Marble Tiles at Timex Ceramic?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Choosing tiles is an important part of shaping a space. Timex Ceramic provides a curated destination for discovering distinctive tile designs in Mumbai, helping customers explore finishes for a variety of residential and commercial applications.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Curated tile collections:</strong> Discover designs that complement different architectural styles and interior concepts.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Design-led selection:</strong> Compare marble-inspired patterns and finishes for walls, floors and suitable decorative applications.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Residential and commercial applications:</strong> Explore ideas for homes, offices, hospitality environments, retail spaces and development projects.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Project-focused guidance:</strong> Discuss your design requirements and confirm relevant product specifications with the team.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Mumbai showroom access:</strong> Connect with Timex Ceramic to enquire about available designs and explore suitable options for your project.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Whether you are an architect developing a material palette, an interior designer creating a luxury concept, a developer planning a residential project or a homeowner upgrading your interiors, you ought to explore these marble tile designs that bring your ideas together.
        </p>

        {/* Section 10: Discover Marble Tile Designs at Timex Ceramic */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Marble Tile Designs at Timex Ceramic
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          From elegant marble wall tiles to sophisticated kitchen finishes and carefully selected marble-look flooring, the right tile can help create a space that feels considered, cohesive and timeless.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore the Timex Ceramic Marble Tile Collection to view available designs and find inspiration for your next project.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For enquiries about marble wall tiles in Mumbai, marble floor tiles, kitchen and bathroom applications, or designer marble tiles, contact Timex Ceramic to discuss current product availability and project requirements.
        </p>

        <p className="text-base sm:text-lg font-serif font-bold text-[#101B38] mb-10 md:mb-14">
          Timex Ceramic – Distinctive Tile Designs for Thoughtfully Designed Spaces.
        </p>

        {/* FAQ Section */}
        <div className="pt-8 border-t border-[#DED9D0]">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] tracking-tight mb-8">
            Frequently Asked Questions About Marble Tiles
          </h2>

          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.has(index);

              // Render answer with interactive internal links where supplied
              const renderAnswer = (ans: string) => {
                if (ans.includes("Marble Tiles category page")) {
                  const parts = ans.split("Marble Tiles category page");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/marble"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Marble Tiles category page
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                if (ans.includes("Timex Ceramic Marble Tiles page")) {
                  const parts = ans.split("Timex Ceramic Marble Tiles page");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/marble"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic Marble Tiles page
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-marble-${index + 1}`}
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

