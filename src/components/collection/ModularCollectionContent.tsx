"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface ModularCollectionContentProps {
  faqs?: FaqItem[];
}

export const MODULAR_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-mod-1",
    question: "1. Where can I find modular tiles in Mumbai?",
    answer: "You can explore the Timex Ceramic Modular Tile Collection to view available designs. Contact the team to confirm product specifications, availability and suitability for your residential or commercial project.",
  },
  {
    id: "faq-mod-2",
    question: "2. What are modular floor tiles?",
    answer: "Modular floor tiles are tiles designed to work within coordinated dimensions or formats, allowing them to be arranged in planned patterns. Depending on the collection, different tile sizes can be combined to create repeating layouts for suitable interior or exterior surfaces.",
  },
  {
    id: "faq-mod-3",
    question: "3. What are modular exterior floor tiles used for?",
    answer: "Modular exterior floor tiles can be considered for suitable patios, verandas, entrances, pathways, terraces and other outdoor areas. The specific product must be rated for the intended location and environmental conditions.",
  },
  {
    id: "faq-mod-4",
    question: "4. Are modular tiles suitable for outdoor use in Mumbai?",
    answer: "Some modular tiles are designed for exterior applications. In Mumbai, check the product's outdoor suitability, slip performance, moisture-related specifications and installation recommendations, taking monsoon rain and humidity into account.",
  },
  {
    id: "faq-mod-5",
    question: "5. What is the difference between modular tiles and regular floor tiles?",
    answer: "The term modular refers to how tile formats and dimensions work together in a planned layout. Regular floor tiles can also be installed in patterns, but a modular collection may offer coordinated sizes specifically intended to create a repeating arrangement.",
  },
  {
    id: "faq-mod-6",
    question: "6. Which modular outdoor tiles are suitable for balconies?",
    answer: "Choose a product explicitly suitable for outdoor flooring and the expected exposure conditions. Also consider the balcony's structural loading limits, drainage, waterproofing and slip performance before installation.",
  },
  {
    id: "faq-mod-7",
    question: "7. Can modular tiles be used for patios and verandas?",
    answer: "Yes, modular tiles designed for exterior flooring can be considered for patios and verandas. Confirm the product's intended application, surface performance, installation requirements and suitability for the site's exposure to rain and sunlight.",
  },
  {
    id: "faq-mod-8",
    question: "8. Are modular tiles suitable for commercial exterior projects?",
    answer: "Suitable exterior modular tiles can be considered for selected hospitality areas, entrances, outdoor seating spaces and commercial developments. Confirm durability, slip performance, maintenance requirements and other specifications based on the expected use.",
  },
  {
    id: "faq-mod-9",
    question: "9. How do I choose modular tile designs for my property?",
    answer: "Consider the architectural style, size of the area, surrounding materials, preferred colour palette and available tile dimensions. Review samples and the proposed laying pattern to ensure that the final arrangement complements the property.",
  },
  {
    id: "faq-mod-10",
    question: "10. What are geometric modular tiles?",
    answer: "Geometric modular tiles use coordinated shapes, dimensions or repeating arrangements to create a structured visual pattern. They can be used in suitable flooring applications to add visual interest and complement contemporary architecture.",
  },
  {
    id: "faq-mod-11",
    question: "11. Are matte modular tiles suitable for exterior flooring?",
    answer: "A matte finish may be appropriate for certain outdoor applications, but the finish alone does not establish slip resistance or weather suitability. Check the specific product's technical specifications before using it on an exterior floor.",
  },
  {
    id: "faq-mod-12",
    question: "12. What should architects check before specifying modular exterior tiles?",
    answer: "Architects should review tile dimensions, finish, intended application, slip performance, moisture-related specifications, installation details, drainage, quantities, availability and maintenance requirements. Samples and layout drawings can help validate the design before procurement.",
  },
  {
    id: "faq-mod-13",
    question: "13. How are modular floor tiles installed?",
    answer: "Installation depends on the tile format, substrate and intended application. The installer should follow the manufacturer's recommendations for substrate preparation, setting materials, joint spacing, layout, drainage and curing.",
  },
  {
    id: "faq-mod-14",
    question: "14. Are modular exterior tiles suitable for elevated terraces?",
    answer: "They may be suitable if the specific product and complete installation system meet the terrace's requirements. Structural loading, waterproofing, drainage, exposure and slip performance should be assessed by qualified professionals.",
  },
  {
    id: "faq-mod-15",
    question: "15. Where can I enquire about modular tiles for projects in Mumbai?",
    answer: "Visit the Timex Ceramic Modular category page and contact the team to discuss available designs, technical specifications and your project requirements.",
  },
];

export function ModularCollectionContent({ faqs }: ModularCollectionContentProps) {
  const displayFaqs = faqs && faqs.length >= 15 ? faqs : MODULAR_DEFAULT_FAQS;
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
          Modular Tiles in Mumbai – Designer Exterior Floor Tiles for Distinctive Spaces
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Transform ordinary outdoor surfaces into thoughtfully designed spaces with the modular tile collection at Timex Ceramic. Combining coordinated tile sizes, creative layouts and contemporary textures, modular floor tiles offer an attractive way to bring character and visual harmony to exterior environments.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Whether you are designing a welcoming veranda, refreshing a patio, planning an outdoor seating area or selecting finishes for a residential or commercial project, modular tiles can help create flooring that feels considered, balanced and distinctive.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          If you are searching for modular tiles in Mumbai, explore designs that complement modern architecture, natural surroundings and a variety of exterior design concepts. From earthy, stone-inspired finishes to contemporary geometric arrangements, the right modular tile design can create a seamless connection between architecture and outdoor living.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          At Timex Ceramic, discover exterior tile options for homeowners, architects, interior designers, landscape designers, builders, developers and contractors seeking creative flooring solutions for their projects.
        </p>

        {/* Section 1: Explore Modular Tile Designs in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Modular Tile Designs in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Modular flooring brings together coordinated tile formats to create patterns that add rhythm and visual interest to a surface. Instead of relying on a single repetitive layout, combinations of different tile sizes can introduce a distinctive character to patios, verandas, terraces and other suitable spaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore modular tile designs in Mumbai for a variety of architectural styles and outdoor settings.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contemporary modular tiles:</strong>{" "}Complement modern architecture with balanced patterns and understated finishes.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Geometric modular tiles:</strong>{" "}Create visual movement through coordinated shapes, proportions and repeating layouts.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Stone-inspired modular tiles:</strong>{" "}Bring an earthy, natural character to outdoor areas and landscaped surroundings.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Neutral modular floor tiles:</strong>{" "}Coordinate beige, cream and grey tones with exterior walls, garden features and outdoor furniture.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Designer modular tiles:</strong>{" "}Add a distinctive finish to residential exteriors, hospitality environments and selected commercial spaces.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          The beauty of modular flooring lies in the relationship between pattern, proportion and surrounding materials. With the right selection, even a simple outdoor area can become a visually engaging part of the overall architectural design.
        </p>

        {/* Section 2: Modular Floor Tiles in Mumbai for Stylish Outdoor Spaces */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Modular Floor Tiles in Mumbai for Stylish Outdoor Spaces
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Outdoor flooring plays an important role in how a property looks and functions. The right tile can connect an entrance to a garden, complement an exterior facade or create a comfortable setting for outdoor gatherings.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Modular floor tiles in Mumbai offer design possibilities for several types of residential and commercial spaces, provided the selected product is suitable for the intended application.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Modular Tiles for Verandas and Patios
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Create a welcoming outdoor setting with modular tiles that complement the surrounding architecture. Coordinated tile sizes can introduce subtle pattern variations, while earthy shades and textured appearances can work beautifully with greenery, wood and natural stone.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Modular Tiles for Balconies and Terraces
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Give a balcony or terrace a more considered appearance with a well-planned tile layout. When selecting tiles for these areas, account for drainage, waterproofing, structural loading and exposure to rain and sunlight.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Modular Tiles for Entrances and Pathways
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          An entrance sets the tone for the entire property. Modular tile arrangements can help define an entryway, complement landscaping and create a transition between indoor and outdoor areas.
        </p>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For pathways, choose a product specifically suitable for outdoor flooring and the expected pedestrian traffic.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Modular Flooring for Commercial Projects
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For hospitality properties, cafes, landscaped seating areas and selected commercial developments, modular flooring can contribute to a consistent architectural identity.
        </p>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Consider the expected foot traffic, cleaning frequency, installation requirements and environmental exposure when specifying tiles for commercial use.
        </p>

        {/* Section 3: Modular Exterior Floor Tiles in Mumbai – Designed for Outdoor Living */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Modular Exterior Floor Tiles in Mumbai – Designed for Outdoor Living
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Exterior flooring must balance visual appeal with practical performance. In Mumbai, outdoor surfaces can experience monsoon rain, humidity, direct sunlight, dust and frequent changes in moisture conditions.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          When exploring modular exterior floor tiles in Mumbai, look beyond colour and pattern to ensure that the chosen product is suitable for its intended location.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Choose a Finish Suited to the Environment
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Matte and textured finishes can offer a more understated appearance for outdoor spaces. However, the actual slip performance of a tile depends on its specifications and surface characteristics, so verify its suitability for wet exterior flooring.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Consider Coordinated Tile Sizes
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Some modular collections combine different tile dimensions to create repeating patterns. These arrangements can add visual interest to patios, verandas and other suitable exterior areas.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Plan for Drainage and Installation
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Outdoor flooring requires appropriate substrate preparation, drainage gradients, waterproofing where applicable and installation materials suited to the site conditions.
        </p>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For elevated terraces and balconies, consult qualified professionals to ensure the tile system is compatible with the waterproofing and structural requirements.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Coordinate with the Architecture
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Choose exterior floor tiles that complement the building facade, entrance features, landscape design and outdoor furniture. Neutral colours can create a restrained, timeless appearance, while more distinctive patterns can establish a focal point.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          With careful product selection and professional installation, modular exterior floor tiles can help create outdoor spaces that are both visually appealing and appropriate for their intended use.
        </p>

        {/* Section 4: Modular Outdoor Tiles in Mumbai for Residential and Commercial Spaces */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Modular Outdoor Tiles in Mumbai for Residential and Commercial Spaces
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Outdoor areas are increasingly treated as extensions of the interior. A well-designed patio, veranda or terrace can become a place to relax, entertain guests or enjoy a landscaped setting.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Modular outdoor tiles in Mumbai offer a way to define these spaces through coordinated formats, colours and surface finishes.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          For Independent Homes and Villas
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Use modular tile layouts to complement entrance areas, covered verandas, patios and selected outdoor seating zones. Coordinate the flooring with the exterior facade and landscaping to create a cohesive design.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          For Apartment Balconies and Terraces
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Select an appropriate outdoor-rated tile to give the space a more finished appearance. Before installation, confirm structural loading limits, drainage provisions and waterproofing requirements, particularly for elevated areas.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          For Hotels, Cafes and Hospitality Spaces
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Modular floor patterns can help establish an inviting atmosphere in selected outdoor seating areas, covered walkways and hospitality environments. Product selection should account for expected foot traffic, cleaning requirements and local exposure conditions.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          For Architects, Developers and Contractors
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Modular flooring can be considered during material planning for residential developments, hospitality projects and selected commercial properties. Review samples, dimensions, installation drawings, product availability and technical documentation before finalising the specification.
        </p>

        {/* Section 5: Designer Modular Tiles in Mumbai – Where Pattern Meets Architecture */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Designer Modular Tiles in Mumbai – Where Pattern Meets Architecture
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          A distinctive floor does not always need an elaborate design. Sometimes, the most effective result comes from combining simple shapes in a thoughtful arrangement.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Designer modular tiles allow architects and interior designers to explore proportion, repetition and contrast while maintaining a cohesive material palette.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Use modular layouts to:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Define an entrance or transition area.</li>
          <li className="pl-1">Create visual interest across a veranda or patio.</li>
          <li className="pl-1">Coordinate exterior flooring with stone-inspired or concrete-inspired surfaces.</li>
          <li className="pl-1">Establish a consistent design language across selected outdoor areas.</li>
          <li className="pl-1">Complement contemporary homes, villas and carefully planned commercial environments.</li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          When selecting designer modular tiles in Mumbai, consider the relationship between the tile pattern and the overall space. The size of the area, grout lines, furniture placement, lighting and surrounding materials all influence the final appearance.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For larger projects, review physical samples and a proposed layout before ordering the required quantity.
        </p>

        {/* Section 6: Geometric Modular Tiles in Mumbai – Create Distinctive Floor Patterns */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Geometric Modular Tiles in Mumbai – Create Distinctive Floor Patterns
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Geometry can bring structure and visual rhythm to an architectural surface. Geometric modular tiles use the relationship between shapes, dimensions and repetition to create patterns that feel deliberate rather than ordinary.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Depending on the collection and available formats, coordinated rectangular and square tiles can be arranged into repeating modular patterns that add depth to outdoor flooring.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Minimalist Geometric Layouts
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Choose complementary neutral shades and balanced proportions for a contemporary, understated appearance. This approach can work well with modern facades, simple landscaping and uncluttered outdoor furniture.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Textured, Natural-Looking Patterns
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Stone-inspired surfaces can complement garden surroundings, exterior walls and natural materials. Select finishes according to the design concept and the technical requirements of the installation.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Pattern-Led Outdoor Spaces
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          A carefully planned geometric layout can distinguish a patio, entrance or covered veranda without requiring additional decorative elements.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For geometric modular tiles in Mumbai, confirm the available tile dimensions and recommended laying pattern for the specific product before developing the final design.
        </p>

        {/* Section 7: How to Choose the Right Modular Tiles for Exterior Flooring */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          How to Choose the Right Modular Tiles for Exterior Flooring
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The right exterior tile should complement the architecture while meeting the demands of the installation environment.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Before selecting modular tiles for an outdoor project, consider the following factors.
        </p>

        <ol className="space-y-3.5 my-4 pl-5 list-decimal text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Intended application:</strong>{" "}Determine whether the tile will be used on a balcony, patio, terrace, pathway, veranda or commercial outdoor surface. Not every exterior tile is suitable for every application.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Surface finish and slip performance:</strong>{" "}Assess the manufacturer&apos;s technical information for the intended wet or dry conditions. For exposed outdoor floors, prioritise products with suitable slip performance.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Water absorption and weather exposure:</strong>{" "}Check the tile&apos;s technical specifications and suitability for repeated moisture exposure, sunlight and the conditions expected at the site.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Tile sizes and layout:</strong>{" "}Confirm the available dimensions and understand how the modular arrangement will affect the overall pattern, grout lines and cutting requirements.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Drainage and substrate preparation:</strong>{" "}Outdoor floors need appropriate falls, drainage and a correctly prepared substrate. Where waterproofing is required, ensure that the full installation system is designed accordingly.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Maintenance requirements:</strong>{" "}Review cleaning recommendations and consider how dust, rain marks and outdoor debris may affect the selected finish.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Project quantities and availability:</strong>{" "}For larger residential and commercial projects, confirm quantities, product availability, batch consistency, lead times and installation requirements before finalising the order.
          </li>
        </ol>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Taking these factors into account helps ensure that the selected modular floor tiles meet both the design brief and the practical needs of the space.
        </p>

        {/* Section 8: Why Explore Modular Tiles at Timex Ceramic? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Why Explore Modular Tiles at Timex Ceramic?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Choosing exterior flooring is an important part of developing a cohesive architectural design. Timex Ceramic offers a curated destination for exploring distinctive tile collections in Mumbai, with options for customers planning residential and commercial spaces.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Curated tile designs:</strong>{" "}Explore modular patterns and coordinated formats for different architectural concepts.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Exterior design inspiration:</strong>{" "}Consider flooring ideas for verandas, patios, entrances and other suitable outdoor areas.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Residential and commercial applications:</strong>{" "}Explore options for homes, villas, hospitality spaces and selected commercial projects.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Design-focused selection:</strong>{" "}Compare colours, textures and tile dimensions to complement the overall material palette.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Project enquiries:</strong>{" "}Connect with the team to confirm product availability, specifications and suitability for your requirements.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Whether you are an architect specifying materials, a landscape designer developing an outdoor concept, a developer planning a property or a homeowner improving an exterior space, Timex Ceramic can help you explore modular tile options aligned with your design brief.
        </p>

        {/* Section 9: Discover Modular Exterior Floor Tiles at Timex Ceramic */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Modular Exterior Floor Tiles at Timex Ceramic
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          From a welcoming veranda to a contemporary patio or a thoughtfully planned outdoor entrance, modular floor tiles can bring structure, character and visual continuity to exterior spaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore the Timex Ceramic Modular Tile Collection to discover available designs and identify options suited to your project.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For enquiries about modular tiles in Mumbai, modular outdoor tiles, geometric floor patterns or exterior flooring designs, contact Timex Ceramic to discuss current availability, product specifications and project requirements.
        </p>

        <p className="text-base sm:text-lg font-serif font-bold text-[#101B38] mb-10 md:mb-14">
          Timex Ceramic – Distinctive Tile Designs for Thoughtfully Designed Spaces.
        </p>

        {/* Divider */}
        <div className="border-t border-[#DED9D0] my-8" />

        {/* FAQ Section */}
        <div className="pt-4">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] tracking-tight mb-8">
            Frequently Asked Questions About Modular Tiles
          </h2>

          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.has(index);

              // Render answer with interactive internal links where supplied
              const renderAnswer = (ans: string) => {
                if (ans.includes("Timex Ceramic Modular Tile Collection")) {
                  const parts = ans.split("Timex Ceramic Modular Tile Collection");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/modular/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic Modular Tile Collection
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                if (ans.includes("Timex Ceramic Modular category page")) {
                  const parts = ans.split("Timex Ceramic Modular category page");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/modular/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic Modular category page
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-mod-${index + 1}`}
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

