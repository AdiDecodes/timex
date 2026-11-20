"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface StoneCollectionContentProps {
  faqs?: FaqItem[];
}

export const STONE_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-stone-1",
    question: "1. Where can I find stone tiles in Mumbai?",
    answer: "You can explore the Timex Ceramic Stone Tiles collection to discover available designs. Contact the team for information about product specifications, availability and suitability for your project.",
  },
  {
    id: "faq-stone-2",
    question: "2. What are stone tiles used for?",
    answer: "Stone tiles and stone-look tiles can be used for suitable interior walls, floors, feature surfaces and selected exterior applications. Their suitability depends on the material, technical specifications and intended installation.",
  },
  {
    id: "faq-stone-3",
    question: "3. What is the difference between natural stone and stone-look tiles?",
    answer: "Natural stone is quarried from geological formations and can feature natural variations in colour and texture. Stone-look tiles are manufactured products designed to reproduce the appearance of stone. Their composition, performance and maintenance requirements depend on the specific product.",
  },
  {
    id: "faq-stone-4",
    question: "4. Where can stone wall tiles be used?",
    answer: "Stone wall tiles can be considered for living rooms, bedrooms, entrance areas, decorative niches, reception areas and other suitable interior surfaces. Exterior use requires a product specifically approved for the intended outdoor application.",
  },
  {
    id: "faq-stone-5",
    question: "5. What are elevation tiles in Mumbai?",
    answer: "Elevation tiles are tiles used to finish selected exterior wall and facade surfaces. They can introduce colour, texture and architectural detail to residential and commercial buildings. The chosen product must be suitable for the building's exposure and fixing requirements.",
  },
  {
    id: "faq-stone-6",
    question: "6. Are stone elevation tiles suitable for Mumbai's climate?",
    answer: "Products rated for the intended exterior application may be suitable, provided their specifications and installation system address the site's conditions. In Mumbai, consider monsoon rain, humidity, sunlight, substrate preparation and facade fixing requirements.",
  },
  {
    id: "faq-stone-7",
    question: "7. Can stone tiles be used for both walls and floors?",
    answer: "Some stone tile products are suitable for both walls and floors, while others are intended for specific applications. Check the manufacturer's specifications before using a product on a different surface from its stated intended use.",
  },
  {
    id: "faq-stone-8",
    question: "8. Are exterior stone tiles suitable for building facades?",
    answer: "Exterior-rated stone tiles or stone-look tiles can be considered for suitable facade applications. The product, substrate, fixing system, installation height and environmental exposure must be evaluated before installation.",
  },
  {
    id: "faq-stone-9",
    question: "9. What are stone cladding tiles?",
    answer: "Stone cladding tiles are products used as a surface covering to create a stone or stone-inspired finish. They may differ in material composition, thickness, weight and fixing requirements, so check the product details before specification.",
  },
  {
    id: "faq-stone-10",
    question: "10. How do I choose stone tiles for a living room?",
    answer: "Consider the room's size, natural lighting, furniture, preferred colour palette and desired texture. Compare samples with the surrounding materials and select a product appropriate for the intended wall or floor application.",
  },
  {
    id: "faq-stone-11",
    question: "11. Are stone-look tiles suitable for commercial projects?",
    answer: "Suitable stone-look tiles can be considered for selected hotel interiors, offices, retail spaces, reception areas and commercial developments. Evaluate durability, cleaning requirements, traffic levels and other relevant technical specifications.",
  },
  {
    id: "faq-stone-12",
    question: "12. What should I check before purchasing exterior stone tiles in Mumbai?",
    answer: "Confirm exterior suitability, water absorption, weather exposure recommendations, surface characteristics, fixing requirements, substrate preparation and maintenance guidance. For elevated facades, use a properly designed installation system and qualified professionals.",
  },
  {
    id: "faq-stone-13",
    question: "13. Are stone wall tiles available in different colours and textures?",
    answer: "Stone-inspired tile collections may include different colours, patterns and surface textures. Available options depend on the current collection, so review the product listings and contact Timex Ceramic for confirmation.",
  },
  {
    id: "faq-stone-14",
    question: "14. How should architects specify stone tiles for a project?",
    answer: "Architects should review the material, dimensions, finish, intended application, technical data, installation method, maintenance requirements, quantities and availability. For exterior elevations, additional attention should be given to fixing systems and facade safety.",
  },
  {
    id: "faq-stone-15",
    question: "15. Where can I explore designer stone tiles for projects across India?",
    answer: "Start with the Timex Ceramic Stone Tiles category page and contact the team to discuss available designs, specifications and project requirements for locations across India.",
  },
];

export function StoneCollectionContent({ faqs }: StoneCollectionContentProps) {
  const displayFaqs = faqs && faqs.length >= 15 ? faqs : STONE_DEFAULT_FAQS;
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
          Stone Tiles in Mumbai – Designer Wall, Floor &amp; Elevation Tiles
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Bring the timeless appeal of natural textures into your spaces with the stone tile collection at Timex Ceramic. Inspired by the beauty of stone, these designs introduce depth, character and architectural interest to contemporary interiors and exterior surfaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Whether you are designing a modern home, upgrading a living room, creating an elegant feature wall or planning a distinctive building elevation, stone tiles offer versatile design possibilities for residential and commercial projects.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          If you are searching for stone tiles in Mumbai, explore designs that complement a variety of architectural styles, from understated contemporary spaces to richly textured, nature-inspired environments. Use stone-look finishes to create statement walls, coordinate wall and floor surfaces or enhance selected exterior areas with a distinctive architectural character.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          At Timex Ceramic, we help homeowners, architects, interior designers, developers, builders and contractors explore tile designs that complement their creative vision and project requirements.
        </p>

        {/* Section 1: Explore Stone Tile Designs in Mumbai for Modern Architecture */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Stone Tile Designs in Mumbai for Modern Architecture
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Stone-inspired surfaces bring a natural visual quality to architecture. Their textures, tonal variations and earthy colours can make a space feel grounded, sophisticated and connected to its surroundings.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          From subtle stone patterns to bold, textured finishes, stone tile designs can complement a wide range of interior and exterior concepts.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore stone tile designs in Mumbai for:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contemporary homes:</strong>{" "}Create understated, elegant interiors with stone-inspired surfaces and coordinated materials.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Luxury apartments and villas:</strong>{" "}Add depth and texture to feature walls, entrances and selected flooring areas.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Architectural elevations:</strong>{" "}Complement the building facade with stone-look finishes designed for exterior applications.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Hospitality interiors:</strong>{" "}Create distinctive visual features for hotels, restaurants, reception areas and boutique spaces.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Commercial developments:</strong>{" "}Explore coordinated tile designs for suitable wall, floor and architectural applications.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          The right stone tile design can complement wood, metal, glass, concrete-inspired finishes and landscaping, helping create a cohesive visual identity throughout the property.
        </p>

        {/* Section 2: Stone Wall Tiles in Mumbai – Add Depth and Character to Your Walls */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Stone Wall Tiles in Mumbai – Add Depth and Character to Your Walls
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Walls can do more than define a room. With the right material and finish, they become an integral part of the architectural design.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Stone wall tiles introduce visual depth and texture without requiring the entire space to be decorated with elaborate patterns or accessories. Depending on the design, they can create anything from a subtle natural backdrop to a striking feature surface.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Stone Wall Tiles for Living Rooms
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Create a distinctive focal point behind a television unit, fireplace-style feature, display niche or seating area. Stone-inspired textures can complement neutral furnishings, wooden elements, contemporary lighting and minimalist interiors.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Stone Wall Tiles for Bedrooms
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Introduce a refined finish behind the bed or on a selected accent wall. Choose a texture and colour that complements the furniture, soft furnishings and lighting scheme.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Stone Wall Tiles for Entrances and Lobbies
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          An entrance establishes the first impression of a property. Stone wall tiles can create a welcoming backdrop in residential foyers, reception areas and selected commercial spaces.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Stone Wall Tiles for Commercial Interiors
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For hotels, restaurants, offices and retail environments, stone-inspired wall finishes can reinforce the overall design concept while adding visual interest to selected surfaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When selecting stone wall tiles in Mumbai, consider the room&apos;s lighting, surface area, tile dimensions, texture, cleaning requirements and suitability for the intended application.
        </p>

        {/* Section 3: Stone Tiles for Wall and Floor – Create a Cohesive Design */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Stone Tiles for Wall and Floor – Create a Cohesive Design
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Coordinating wall and floor finishes can help bring visual continuity to an interior. Stone-inspired tiles provide a versatile foundation for designs that feel balanced, sophisticated and connected to the surrounding architecture.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Stone tiles for wall and floor applications can be considered for living rooms, bedrooms, entrance areas, bathrooms, kitchens and selected commercial spaces, provided the chosen product is suitable for each specific use.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Coordinated Living Room Designs
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Combine complementary stone-inspired wall and floor finishes to establish a unified design. Contrasting textures can help define a feature wall while allowing the rest of the room to remain understated.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Elegant Bathroom Interiors
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Use suitable stone-look wall tiles to create a calm, spa-inspired atmosphere. If coordinating them with floor tiles, confirm that the flooring product meets the wet-area requirements, including appropriate slip performance.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Contemporary Commercial Spaces
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          In reception areas, offices and hospitality interiors, coordinated stone-inspired surfaces can help establish a consistent material palette. Product selection should account for traffic, cleaning needs and the technical requirements of each surface.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          <strong className="font-semibold text-[#101B38]">Important:</strong>{" "}A tile suitable for walls is not automatically suitable for floors. Always verify the manufacturer&apos;s application recommendations and technical specifications before combining products.
        </p>

        {/* Section 4: Elevation Tiles in Mumbai – Give Your Building a Distinctive Identity */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Elevation Tiles in Mumbai – Give Your Building a Distinctive Identity
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          A building&apos;s elevation plays an important role in its overall appearance. The choice of exterior finish can influence how the architecture relates to its surroundings, landscaping and neighbouring structures.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Elevation tiles offer a design-led approach to enhancing selected exterior surfaces. Stone-inspired elevation finishes can add texture, visual contrast and a contemporary architectural character to residential and commercial properties.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Stone Elevation Tiles for Modern Homes
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Create a distinctive exterior by incorporating stone-inspired finishes around entrance features, selected facade sections, balconies and architectural projections. Coordinating the tile with paint, glass, metal and other facade materials can produce a balanced result.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Elevation Tiles for Villas and Residential Developments
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Stone-look finishes can complement contemporary villas, premium residences and selected multi-unit developments. Consider how the colour and texture will appear under different daylight conditions before finalising the design.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Elevation Tiles for Commercial Buildings
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For offices, hospitality properties and commercial developments, exterior tile finishes can help create a recognisable architectural identity. Select products specifically intended for the proposed exterior application.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When choosing elevation tiles in Mumbai, consider monsoon exposure, sunlight, humidity, substrate conditions, installation height and the fixing system required for the project.
        </p>

        {/* Section 5: Stone Elevation Tiles in Mumbai – Where Design Meets Exterior Performance */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Stone Elevation Tiles in Mumbai – Where Design Meets Exterior Performance
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Exterior materials must do more than look attractive. They also need to be appropriate for the environmental conditions and installation method.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Stone elevation tiles in Mumbai can be considered for suitable facade applications where the selected product&apos;s technical specifications support the intended use.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Before specifying a product, evaluate the following:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Exterior suitability:</strong>{" "}Confirm that the tile is designed and approved for the intended outdoor application.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Moisture exposure:</strong>{" "}Consider rainfall, water management and the substrate&apos;s condition.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Fixing system:</strong>{" "}Ensure that the adhesive or mechanical fixing method is appropriate for the product, substrate and installation height.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Surface finish:</strong>{" "}Select a texture and colour that complement the architecture and surrounding materials.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Thermal and weather exposure:</strong>{" "}Check the manufacturer&apos;s recommendations for the expected outdoor conditions.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Maintenance requirements:</strong>{" "}Understand how the finish may respond to dust, pollution, rain marks and routine cleaning.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Professional installation:</strong>{" "}Use qualified professionals and an appropriate installation design, especially for elevated facades.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For larger residential or commercial projects, review product documentation and samples before approving the final material specification.
        </p>

        {/* Section 6: Exterior Stone Tiles in Mumbai for Outdoor Spaces */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Exterior Stone Tiles in Mumbai for Outdoor Spaces
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Exterior spaces deserve the same attention to material selection as interior rooms. Stone-inspired tiles can help connect a building with its landscape while introducing texture and visual continuity across selected outdoor surfaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Depending on the product&apos;s approved applications, exterior stone tiles may be considered for:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Building facade features</li>
          <li className="pl-1">Entrance walls and selected architectural details</li>
          <li className="pl-1">Covered verandas and outdoor seating areas</li>
          <li className="pl-1">Balconies and terraces</li>
          <li className="pl-1">Boundary walls and selected landscape features</li>
          <li className="pl-1">Suitable exterior floor surfaces</li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Each application has different performance requirements. For example, exterior wall tiles and exterior floor tiles should not be treated as interchangeable.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For outdoor flooring, check slip performance, water absorption, durability and suitability for the anticipated exposure. For facade installations, verify the complete fixing system, substrate requirements and relevant safety considerations.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Choosing the right product helps align the visual appeal of stone-inspired surfaces with the practical needs of the space.
        </p>

        {/* Section 7: Stone Cladding Tiles in Mumbai – Create Architectural Impact */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Stone Cladding Tiles in Mumbai – Create Architectural Impact
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Stone cladding tiles provide a way to introduce a stone-inspired or stone-like finish to selected architectural surfaces. They can help define an entrance, highlight a wall or create contrast between different facade materials.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For projects exploring stone cladding tiles in Mumbai, the right selection depends on the desired appearance, product composition, dimensions, installation requirements and intended application.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Cladding for Feature Walls
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Use stone-inspired cladding to add character to selected living room walls, entrance features, reception areas and other suitable surfaces.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Cladding for Exterior Elevations
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For exterior applications, choose products specifically designed for facade use and ensure that the fixing system meets the installation&apos;s requirements.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Cladding for Hospitality and Commercial Spaces
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Stone-inspired cladding can create distinctive visual features in hotel lobbies, restaurants, offices and retail environments. Coordinate the finish with lighting, furniture and complementary materials for a cohesive design.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Before selecting a cladding product, confirm whether it is natural stone, a manufactured stone product or a stone-look tile. These materials can differ in weight, composition, maintenance and installation requirements.
        </p>

        {/* Section 8: Designer Stone Tiles in Mumbai for Premium Interiors */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Designer Stone Tiles in Mumbai for Premium Interiors
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The appeal of a well-designed space often lies in the way materials work together. Designer stone tiles offer opportunities to combine texture, colour and pattern with the surrounding architecture.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For architects and interior designers, stone-inspired surfaces can complement wood, marble-look tiles, metallic finishes, glass and neutral colour palettes. For developers and contractors, the selection also needs to meet the practical requirements of the project.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore designer stone tiles in Mumbai for:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Contemporary apartments and luxury residences</li>
          <li className="pl-1">Villas and thoughtfully designed homes</li>
          <li className="pl-1">Living room feature walls and entrance areas</li>
          <li className="pl-1">Selected bathroom and kitchen applications</li>
          <li className="pl-1">Hospitality and retail interiors</li>
          <li className="pl-1">Commercial projects requiring coordinated material finishes</li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Consider the scale of the surface, the visual intensity of the texture, the available tile dimensions and the relationship between wall and floor materials.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For large projects, sample approval, product availability, batch consistency and installation planning should be part of the selection process.
        </p>

        {/* Section 9: Stone Wall Tiles in India – Design Possibilities Beyond Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Stone Wall Tiles in India – Design Possibilities Beyond Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Stone-inspired tile designs are relevant to residential and commercial projects across India, where architectural preferences and environmental conditions vary by region.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          From contemporary urban apartments to villas, hospitality developments and commercial interiors, stone wall tiles can introduce a natural visual character that complements a wide range of design concepts.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For projects outside Mumbai, consider the local climate, intended application, transportation and availability, installation requirements and the product&apos;s technical suitability.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Timex Ceramic&apos;s stone tile collection provides a starting point for exploring design possibilities. Contact the team to confirm product availability and relevant specifications for your location and project.
        </p>

        {/* Section 10: How to Choose the Right Stone Tiles for Your Project */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          How to Choose the Right Stone Tiles for Your Project
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Selecting the right tile requires balancing aesthetics, performance and installation requirements.
        </p>

        <ol className="space-y-3.5 my-4 pl-5 list-decimal text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Define the application:</strong>{" "}Determine whether the tile is intended for an interior wall, interior floor, exterior wall, facade or outdoor floor. Verify the product&apos;s suitability for that use.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Choose the right texture and colour:</strong>{" "}Stone-inspired finishes range from subtle and understated to bold and highly textured. Consider the scale of the space, lighting and surrounding materials.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Review tile dimensions:</strong>{" "}Tile size and layout influence the finished appearance. Plan the pattern and joints in relation to the dimensions of the wall or floor.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Check technical specifications:</strong>{" "}Review relevant information on water absorption, surface finish, slip performance, durability and installation requirements, as applicable to the intended use.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Consider the local environment:</strong>{" "}For Mumbai projects, assess rainfall, humidity, sunlight and pollution exposure for exterior applications.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Plan installation and maintenance:</strong>{" "}Confirm substrate preparation, fixing materials, grout selection, waterproofing where required and ongoing care recommendations.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Verify project availability:</strong>{" "}For residential developments and commercial projects, confirm the quantity required, product availability, lead times and batch consistency before procurement.
          </li>
        </ol>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          A well-planned selection process helps ensure that the finished surface complements the design concept while meeting the demands of the intended application.
        </p>

        {/* Section 11: Why Explore Stone Tiles at Timex Ceramic? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Why Explore Stone Tiles at Timex Ceramic?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Choosing the right tile is an important part of creating a cohesive interior or exterior design. Timex Ceramic offers a curated destination for discovering distinctive tile collections in Mumbai.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Curated design collections:</strong>{" "}Explore stone-inspired tile designs for a variety of architectural and interior concepts.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Wall and floor design inspiration:</strong>{" "}Compare finishes for suitable residential and commercial applications.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Exterior design possibilities:</strong>{" "}Explore options for elevation features and other exterior surfaces where product specifications permit.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Project-focused selection:</strong>{" "}Discuss your design brief and confirm relevant product details with the team.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Mumbai showroom access:</strong>{" "}Connect with Timex Ceramic to enquire about available collections and suitable options for your project.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Whether you are a homeowner renovating a property, an architect planning a facade, an interior designer developing a material palette or a contractor coordinating a project, Timex Ceramic can help you explore stone tile designs that align with your requirements.
        </p>

        {/* Section 12: Discover Stone Tile Designs at Timex Ceramic */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Stone Tile Designs at Timex Ceramic
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          From elegant stone wall tiles to distinctive elevation finishes and coordinated wall and floor designs, stone-inspired surfaces offer a versatile way to bring texture and architectural character to a space.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore the Timex Ceramic Stone Tile Collection to discover available designs for your next residential or commercial project.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For enquiries about stone tiles in Mumbai, stone wall tiles, elevation tiles, exterior stone tiles or stone cladding options, contact Timex Ceramic to discuss product availability, specifications and project requirements.
        </p>

        <p className="text-base sm:text-lg font-serif font-bold text-[#101B38] mb-10 md:mb-14">
          Timex Ceramic – Distinctive Tile Designs for Thoughtfully Designed Spaces.
        </p>

        {/* Divider */}
        <div className="border-t border-[#DED9D0] my-8" />

        {/* FAQ Section */}
        <div className="pt-4">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] tracking-tight mb-8">
            Frequently Asked Questions About Stone Tiles
          </h2>

          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.has(index);

              // Render answer with interactive internal links where supplied
              const renderAnswer = (ans: string) => {
                if (ans.includes("Timex Ceramic Stone Tiles collection")) {
                  const parts = ans.split("Timex Ceramic Stone Tiles collection");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/stone/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic Stone Tiles collection
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                if (ans.includes("Timex Ceramic Stone Tiles category page")) {
                  const parts = ans.split("Timex Ceramic Stone Tiles category page");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/stone/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic Stone Tiles category page
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-stone-${index + 1}`}
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

