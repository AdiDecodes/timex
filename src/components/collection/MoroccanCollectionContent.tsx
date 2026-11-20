"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface MoroccanCollectionContentProps {
  faqs?: FaqItem[];
}

export const MOROCCAN_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-mor-1",
    question: "1. What are Moroccan tiles?",
    answer: "Moroccan tiles are decorative tiles inspired by Moroccan and broader Moorish design traditions. They are often associated with geometric motifs, repeating patterns, rich colours and ornamental details. Depending on the product, they may be made from ceramic, porcelain or other materials.",
  },
  {
    id: "faq-mor-2",
    question: "2. Where can I find Moroccan tiles in Mumbai?",
    answer: "You can explore Moroccan tile designs through Timex Ceramic's online category at https://www.timexceramic.com/product-category/moroccan/. Contact Timex Ceramic to enquire about current product availability, specifications and options for your project.",
  },
  {
    id: "faq-mor-3",
    question: "3. What makes Moroccan tile designs distinctive?",
    answer: "Moroccan tile designs are known for their geometric patterns, decorative compositions and distinctive colour combinations. Their visual appeal comes from the way repeating motifs create rhythm, contrast and character across a wall or floor.",
  },
  {
    id: "faq-mor-4",
    question: "4. Are Moroccan tiles suitable for kitchen walls?",
    answer: "Moroccan tiles can be a decorative option for kitchen backsplashes and selected wall areas when the chosen product is suitable for that application. Consider cleaning requirements, heat exposure, grout and the manufacturer's installation recommendations.",
  },
  {
    id: "faq-mor-5",
    question: "5. Which Moroccan tiles are suitable for a kitchen backsplash?",
    answer: "The best choice depends on your kitchen's colour palette, cabinetry, countertop and cooking-area requirements. Patterned designs can create a focal point, while more restrained colours may suit minimalist interiors. Verify the tile's suitability for the intended location before purchase.",
  },
  {
    id: "faq-mor-6",
    question: "6. Can Moroccan tiles be used in bathrooms?",
    answer: "Yes, suitable Moroccan-style tiles can be used on bathroom walls and selected other surfaces. Check the product specifications for wet-area suitability, maintenance and installation. Floor tiles must be specifically suitable for flooring and have appropriate slip resistance for the application.",
  },
  {
    id: "faq-mor-7",
    question: "7. Are Moroccan floor tiles available in Mumbai?",
    answer: "Timex Ceramic lists a Moroccan tile collection that includes products in different formats. Check individual product listings to confirm which designs are approved for flooring, along with their dimensions, finish and availability.",
  },
  {
    id: "faq-mor-8",
    question: "8. What are Zellige tiles?",
    answer: "Zellige traditionally refers to Moroccan glazed tiles associated with artisanal production and distinctive surface variation. Modern Zellige-inspired tiles recreate aspects of this look but may use different manufacturing methods. Confirm whether a product is authentic handmade Zellige or a contemporary interpretation.",
  },
  {
    id: "faq-mor-9",
    question: "9. Are Zellige tiles available in India?",
    answer: "Zellige-style and Moroccan-inspired tiles can be found in the Indian market. For authentic handmade Zellige, ask the supplier to confirm the product's origin, material and manufacturing method. Contact Timex Ceramic to enquire about the designs currently available in its collection.",
  },
  {
    id: "faq-mor-10",
    question: "10. What colours work well with Moroccan tiles?",
    answer: "Blue, green, terracotta-inspired, black, white and neutral tones are common choices for Moroccan-inspired interiors. The most suitable palette depends on the pattern, natural and artificial lighting, surrounding materials and the mood you want to create.",
  },
  {
    id: "faq-mor-11",
    question: "11. Are Moroccan tiles suitable for modern interiors?",
    answer: "Yes. Moroccan patterns can complement contemporary interiors when used selectively and coordinated with simpler surfaces. A decorative backsplash, vanity wall or entrance feature can add character without overwhelming a minimalist design.",
  },
  {
    id: "faq-mor-12",
    question: "12. How do I choose the right Moroccan tile size?",
    answer: "Consider the area being tiled, the complexity of the pattern, grout joints and the desired visual effect. Smaller formats may create a detailed pattern, while larger formats can change the scale and rhythm of the design. Always check the exact dimensions of the selected product.",
  },
  {
    id: "faq-mor-13",
    question: "13. Are Moroccan tiles suitable for commercial projects?",
    answer: "They can be considered for suitable applications in cafés, restaurants, retail interiors, hotels and other commercial spaces. The final selection should meet the project's requirements for intended use, maintenance, durability, slip resistance where relevant and installation.",
  },
  {
    id: "faq-mor-14",
    question: "14. How should Moroccan tiles be cleaned?",
    answer: "Cleaning requirements depend on the tile material, glaze and finish. Follow the manufacturer's care instructions and use compatible cleaning products. Avoid assuming that every decorative tile can tolerate the same chemicals or cleaning methods.",
  },
  {
    id: "faq-mor-15",
    question: "15. How can I enquire about imported Moroccan tiles in Mumbai?",
    answer: "Visit the Timex Ceramic Moroccan tile category page and contact the team with your preferred design, application and approximate project quantity. Confirm specifications, availability and delivery details before placing an order.",
  },
];

export function MoroccanCollectionContent({ faqs }: MoroccanCollectionContentProps) {
  const displayFaqs = faqs && faqs.length >= 15 ? faqs : MOROCCAN_DEFAULT_FAQS;
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
          Moroccan Tiles in Mumbai – Designer Moroccan Wall &amp; Floor Tiles
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Bring colour, character and artistic detail to your interiors with Moroccan tiles in Mumbai from Timex Ceramic. Inspired by traditional North African and Moorish design, Moroccan tiles are known for their distinctive geometric patterns, decorative motifs, expressive colours and artisanal appeal. They offer a beautiful way to turn ordinary walls and floors into standout design features.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Whether you are planning a statement kitchen backsplash, an elegant bathroom, a boutique café, a luxury residence or a distinctive hospitality space, the right Moroccan tile design can add depth and individuality to your interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore a curated collection of designer Moroccan tiles in Mumbai, featuring decorative patterns, Zellige-inspired surfaces and designs suited to a variety of contemporary and traditional interior concepts. From subtle, sophisticated palettes to bold patterned finishes, discover ideas for creating spaces that feel personal, inviting and visually memorable.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          If you are searching for imported Moroccan tiles in Mumbai, Moroccan wall tiles, Moroccan floor tiles or Zellige tiles in India, explore the Timex Ceramic collection to find inspiration for your next project.
        </p>

        {/* Section 1: Explore Moroccan Wall Tiles in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Moroccan Wall Tiles in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Moroccan wall tiles bring decorative interest to interiors through intricate patterns, distinctive colours and carefully composed layouts. They can be used as a focal point or combined with simpler surfaces to create a balanced, layered design.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Our Moroccan wall tiles in Mumbai can inspire a range of applications, including:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Kitchen backsplashes and cooking-area walls</li>
          <li className="pl-1">Bathroom walls and vanity backdrops</li>
          <li className="pl-1">Decorative niches and feature walls</li>
          <li className="pl-1">Living room and dining area accents</li>
          <li className="pl-1">Café, restaurant and boutique retail interiors</li>
          <li className="pl-1">Selected hospitality and commercial spaces</li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a harmonious finish, pair patterned Moroccan tiles with understated stone, wood-inspired or plain-coloured surfaces. This allows the decorative pattern to stand out without making the entire space feel visually busy.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Before selecting a product, check its dimensions, finish, intended application and installation recommendations to ensure it is appropriate for your project.
        </p>

        {/* Section 2: Moroccan Floor Tiles in Mumbai: Make Every Surface a Statement */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Moroccan Floor Tiles in Mumbai: Make Every Surface a Statement
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Flooring can become a central design feature when it incorporates a distinctive pattern. Moroccan floor tiles in Mumbai offer a way to introduce decorative rhythm, colour and visual character to selected interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Depending on the specific tile&apos;s technical specifications, Moroccan-inspired patterns may be considered for:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Living and dining areas</li>
          <li className="pl-1">Entrance foyers and passages</li>
          <li className="pl-1">Selected kitchen floors</li>
          <li className="pl-1">Bathroom floors using products suitable for wet areas</li>
          <li className="pl-1">Boutique cafés, retail interiors and hospitality spaces</li>
          <li className="pl-1">Feature zones within larger residential or commercial projects</li>
        </ul>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Ideas for Moroccan floor tile designs
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Geometric patterns:</strong>{" "}Create a structured visual effect through repeating shapes and symmetrical arrangements.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Monochrome designs:</strong>{" "}Combine black, white, grey or other restrained tones for a graphic, contemporary appearance.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Colourful decorative floors:</strong>{" "}Introduce blue, green, terracotta-inspired or other colour combinations where available in the collection.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Statement zones:</strong>{" "}Use patterned tiles in a defined area, such as an entrance or selected floor section, to create a focal point.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When selecting Moroccan tiles for flooring, prioritise products approved for floor installation. For bathrooms and other wet areas, verify slip-resistance ratings, water suitability and maintenance requirements rather than choosing a tile on appearance alone.
        </p>

        {/* Section 3: Moroccan Tiles for Kitchen in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Moroccan Tiles for Kitchen in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The kitchen is an ideal space to introduce Moroccan-inspired design. A decorative backsplash can add personality to a neutral kitchen, complement colourful cabinetry or create contrast against a simple countertop.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Explore Moroccan tiles for kitchen in Mumbai to find inspiration for kitchens that balance everyday functionality with individual style.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Moroccan kitchen tile ideas
        </h3>

        <div className="space-y-4 my-4 text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#101B38] mb-1">
              1. Decorative backsplash
            </h4>
            <p>
              Use patterned Moroccan tiles behind a suitable kitchen worktop to create a focal point. A restrained cabinet and countertop palette can help the pattern remain the hero.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#101B38] mb-1">
              2. Blue and white combinations
            </h4>
            <p>
              Blue-and-white decorative patterns can create a fresh, Mediterranean-inspired atmosphere when they complement the surrounding materials.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#101B38] mb-1">
              3. Earthy and warm palettes
            </h4>
            <p>
              Terracotta-inspired shades, earthy greens and warm neutrals can complement wood finishes and natural-looking surfaces, depending on the available designs.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#101B38] mb-1">
              4. Contemporary monochrome
            </h4>
            <p>
              Black-and-white or muted geometric patterns can add definition to modern kitchens without relying on a large range of colours.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#101B38] mb-1">
              5. Pattern and plain-tile combinations
            </h4>
            <p>
              Pair a decorative backsplash with simple surrounding wall tiles or understated surfaces for a considered, cohesive look.
            </p>
          </div>
        </div>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When choosing Moroccan kitchen tiles in Mumbai, consider the location of the cooking area, cleaning requirements, grout selection and compatibility with nearby surfaces. Confirm that the chosen tile is suitable for the intended application.
        </p>

        {/* Section 4: Moroccan Tiles for Bathroom in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Moroccan Tiles for Bathroom in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Create a bathroom with a distinctive personality through carefully selected Moroccan tile designs. Decorative patterns can transform a vanity wall, add interest to a selected shower-area wall or bring a boutique-hotel feel to a thoughtfully planned bathroom interior.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Our Moroccan tiles for bathroom in Mumbai can inspire a variety of design directions.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Bathroom design ideas using Moroccan tiles
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Patterned vanity walls:</strong>{" "}Make the area around a washbasin a visual focal point.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Decorative niches:</strong>{" "}Introduce pattern into selected niches or recessed areas.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contrasting feature walls:</strong>{" "}Combine a decorative tile with simpler wall surfaces to balance the design.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Soft, coordinated palettes:</strong>{" "}Match patterned tiles with complementary neutral colours for a more understated look.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Bold geometric styling:</strong>{" "}Use a distinctive pattern to bring energy and visual interest to a contemporary bathroom.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For bathroom walls and shower areas, confirm that the selected product is suitable for the specific wet-area installation. For bathroom floors, choose only tiles approved for floor use with appropriate slip resistance. Follow the manufacturer&apos;s recommendations for installation, grout, waterproofing and cleaning.
        </p>

        {/* Section 5: Zellige Tiles in India: An Artisanal Look with Distinctive Character */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Zellige Tiles in India: An Artisanal Look with Distinctive Character
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Zellige is traditionally associated with Moroccan tile craftsmanship and individually made, glazed tiles. Their characteristic surface variations, subtle irregularities and interplay of light give them a distinctive artisanal appearance.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For customers searching for Zellige tiles in India, it is important to distinguish authentic handmade Zellige from modern tiles that offer a Zellige-inspired look. Both can create visually interesting interiors, but their manufacturing methods, surface characteristics and care requirements may differ.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Zellige-inspired tiles can complement a range of interior styles, including:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Contemporary kitchens with decorative backsplashes</li>
          <li className="pl-1">Bathrooms with expressive feature walls</li>
          <li className="pl-1">Boutique cafés and hospitality interiors</li>
          <li className="pl-1">Modern homes that combine traditional and contemporary details</li>
          <li className="pl-1">Selected accent areas where surface variation adds visual depth</li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          When comparing Zellige-style designs, consider the glaze, colour variation, edges, dimensions and intended application. If you require authentic handmade Zellige, ask specifically about manufacturing origin and product construction before ordering.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Explore the Timex Ceramic Moroccan tile collection to discover available designs inspired by this distinctive decorative tradition.
        </p>

        {/* Section 6: Designer Moroccan Tiles in Mumbai for Distinctive Interiors */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Designer Moroccan Tiles in Mumbai for Distinctive Interiors
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Moroccan tiles are not limited to traditional interiors. Their patterns can work beautifully in contemporary spaces when selected in a way that complements the overall design.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Timex Ceramic&apos;s Moroccan collection offers inspiration for architects, interior designers, homeowners and project professionals seeking decorative surfaces with character.
        </p>

        <div className="space-y-6 mb-6">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For architects and interior designers
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Explore Moroccan tile patterns as part of a coordinated material palette. Consider colour relationships, repeat patterns, grout joints, tile dimensions and how the design will appear across the complete installation.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For homeowners and renovators
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Use decorative tiles to personalise a kitchen backsplash, bathroom feature wall, entrance or selected living space. A single patterned area can add character without requiring every surface to be decorative.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For builders and developers
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Consider Moroccan-inspired tiles for selected feature areas in residential developments and premium interior projects. Check product availability, technical specifications, quantities and batch consistency before confirming procurement.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mb-2">
              For hospitality and commercial projects
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Patterned tiles can help create a memorable visual identity in cafés, restaurants, boutique hotels, retail spaces and reception areas. Select products according to the intended application, maintenance needs and project specifications.
            </p>
          </div>
        </div>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For project-specific enquiries, contact Timex Ceramic to discuss your design requirements and the available Moroccan tile options.
        </p>

        {/* Section 7: Imported Moroccan Tiles in Mumbai: Choosing the Right Design */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Imported Moroccan Tiles in Mumbai: Choosing the Right Design
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          If you are exploring imported Moroccan tiles in Mumbai, start by identifying the aesthetic and technical requirements of your project. A tile&apos;s pattern may attract attention, but its format, finish, installation requirements and compatibility with the intended surface are equally important.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Use these considerations when comparing products:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Pattern and colour:</strong>{" "}Decide whether your space needs a subtle decorative detail, a repeating geometric motif or a more expressive colour combination.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Tile dimensions:</strong>{" "}Smaller formats can create a detailed visual rhythm, while larger patterned tiles may produce a different overall effect. Always confirm the actual dimensions listed for the selected product.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Material and finish:</strong>{" "}Review whether the product is ceramic, porcelain or another material, and understand the implications for installation and maintenance.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Intended application:</strong>{" "}A wall tile is not automatically suitable for flooring. Confirm the manufacturer&apos;s application guidance.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Installation planning:</strong>{" "}Discuss layout, grout joints, cutting, pattern alignment and wastage with your installer before placing the final order.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Availability and project quantities:</strong>{" "}For larger residential, hospitality or commercial projects, confirm current stock, lead times and batch availability with the supplier.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          The right Moroccan tile is one that brings together the look you want and the requirements of the space where it will be installed.
        </p>

        {/* Section 8: Why Explore Moroccan Tiles at Timex Ceramic? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Why Explore Moroccan Tiles at Timex Ceramic?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore Moroccan-inspired designs that can help you create interiors with a distinctive visual identity. Whether your brief is a decorative kitchen backsplash, a patterned bathroom feature wall or an expressive commercial interior, the collection offers a starting point for exploring colour, pattern and surface design.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Distinctive decorative styles:</strong>{" "}Explore Moroccan-inspired patterns and expressive surface designs.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Multiple design directions:</strong>{" "}Consider options for contemporary, classic and eclectic interiors.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Kitchen and bathroom inspiration:</strong>{" "}Discover ideas for decorative walls and selected suitable floor applications.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Residential and commercial possibilities:</strong>{" "}Explore design ideas for homes, cafés, hospitality spaces and retail projects.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Mumbai-based enquiries:</strong>{" "}Contact Timex Ceramic to discuss product selection and project requirements.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Explore the collection to find Moroccan tile designs that complement your space, material palette and creative vision.
        </p>

        {/* Section 9: Discover Moroccan Tiles in Mumbai at Timex Ceramic */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Moroccan Tiles in Mumbai at Timex Ceramic
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Looking for Moroccan wall tiles, decorative kitchen tiles, bathroom feature tiles or patterned flooring? Explore the Timex Ceramic Moroccan collection to view available designs and identify options that suit your project.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-12">
          For product dimensions, material details, finish, installation suitability and current availability, refer to the individual product listing or contact Timex Ceramic before finalising your selection.
        </p>

        {/* Divider */}
        <hr className="border-t border-[#DED9D0] my-12 md:my-16" />

        {/* FAQs Section */}
        <div className="space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] leading-tight tracking-tight">
            Frequently Asked Questions About Moroccan Tiles
          </h2>

          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.has(index);

              // Render answer with interactive internal links where supplied
              const renderAnswer = (ans: string) => {
                if (ans.includes("https://www.timexceramic.com/product-category/moroccan/")) {
                  const parts = ans.split("https://www.timexceramic.com/product-category/moroccan/");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/moroccan/"
                        className="text-[#C95745] hover:underline font-medium break-all"
                      >
                        https://www.timexceramic.com/product-category/moroccan/
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                if (ans.includes("Timex Ceramic Moroccan tile category page")) {
                  const parts = ans.split("Timex Ceramic Moroccan tile category page");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/moroccan/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic Moroccan tile category page
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-mor-${index + 1}`}
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

