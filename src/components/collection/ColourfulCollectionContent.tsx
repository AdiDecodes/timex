"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface ColourfulCollectionContentProps {
  faqs?: FaqItem[];
}

export const COLOURFUL_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-col-1",
    question: "1. What are colourful ceramic tiles?",
    answer: "Colourful ceramic tiles are tiles available in a range of shades, colour combinations, and decorative designs. They can be used to add contrast, create a focal point, or complement an interior's overall colour palette.",
  },
  {
    id: "faq-col-2",
    question: "2. Where can I find colourful tiles in Mumbai?",
    answer: "You can explore the colourful tile collection on the Timex Ceramic website and contact the team for product information and help identifying options for your residential or commercial project.",
  },
  {
    id: "faq-col-3",
    question: "3. Where can colourful wall tiles be used?",
    answer: "Colourful wall tiles can be used in suitable kitchen backsplash areas, bathroom walls, living room features, decorative niches, entrance areas, and selected commercial interiors. Always check the product's intended application.",
  },
  {
    id: "faq-col-4",
    question: "4. Are colourful tiles suitable for kitchen walls?",
    answer: "Yes, suitable colourful tiles can be used on kitchen walls and backsplashes. Consider how easily the surface can be cleaned and whether the finish suits areas exposed to oil, food splashes, and frequent use.",
  },
  {
    id: "faq-col-5",
    question: "5. Can colourful tiles be used in bathrooms?",
    answer: "Yes, colourful tiles can add character to bathroom walls, vanity backdrops, and other suitable surfaces. For wet areas and bathroom floors, verify the product's suitability and relevant slip-resistance specifications.",
  },
  {
    id: "faq-col-6",
    question: "6. Are colourful floor tiles suitable for living rooms?",
    answer: "Selected colourful floor tiles can be used in living rooms when the product is rated for flooring and meets the space's performance requirements. Consider the overall colour scheme, foot traffic, maintenance, and surface finish.",
  },
  {
    id: "faq-col-7",
    question: "7. What are multicolour tiles?",
    answer: "Multicolour tiles feature two or more colours within a design, pattern, or coordinated collection. They can create a playful, decorative, artistic, or contemporary effect depending on the shades and layout.",
  },
  {
    id: "faq-col-8",
    question: "8. How do I choose colourful tiles for a small room?",
    answer: "Consider using a limited colour palette, a restrained pattern, or a single accent area. Review the tile alongside the room's lighting and other finishes to ensure that the overall design feels balanced.",
  },
  {
    id: "faq-col-9",
    question: "9. How can I coordinate colourful tiles with furniture and cabinets?",
    answer: "Choose one or two colours that complement the existing materials, then use neutral finishes or supporting shades to maintain balance. Reviewing physical samples alongside cabinetry, countertops, flooring, and furniture can help.",
  },
  {
    id: "faq-col-10",
    question: "10. Are colourful tiles suitable for hotels, cafés, and commercial projects?",
    answer: "Suitable colourful tiles can be specified for selected hospitality, retail, restaurant, and office interiors. Project teams should verify the intended application, maintenance needs, and performance specifications for the proposed installation.",
  },
  {
    id: "faq-col-11",
    question: "11. What should architects and interior designers consider before specifying colourful tiles?",
    answer: "Consider the design concept, colour palette, dimensions, layout, grout selection, lighting, installation requirements, maintenance, and intended application. For larger projects, confirm product details and availability before finalising specifications.",
  },
  {
    id: "faq-col-12",
    question: "12. How do I maintain colourful ceramic tiles?",
    answer: "Maintenance depends on the tile material and finish. Use cleaning products and methods recommended for the specific tile, clean spills promptly where appropriate, and avoid harsh chemicals unless the manufacturer confirms they are suitable.",
  },
  {
    id: "faq-col-13",
    question: "13. How can I enquire about designer colourful tiles at Timex Ceramic?",
    answer: "Visit the Timex Ceramic colourful tile category and contact the team to enquire about available designs, product specifications, and options for your project.",
  },
];

export function ColourfulCollectionContent({ faqs }: ColourfulCollectionContentProps) {
  const activeFaqs = faqs && faqs.length >= 13 ? faqs : COLOURFUL_DEFAULT_FAQS;
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
          Colourful Ceramic Tiles in India – Designer Colourful Tiles in Mumbai
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Colour has the power to transform a space, express your personality, and turn everyday interiors into something memorable. At Timex Ceramic, our colourful tile collection brings together expressive colours, decorative designs, and contemporary styling possibilities to help you create interiors with character.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore colourful ceramic tiles in India for homes, apartments, boutique hotels, restaurants, cafés, offices, and distinctive commercial spaces. From elegant single-colour tiles to eye-catching multicolour patterns, colourful tiles offer creative ways to bring warmth, contrast, and individuality to your interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          If you are searching for colorful tiles in Mumbai, discover design possibilities for kitchen backsplashes, bathroom walls, living room features, decorative niches, and other selected applications. Whether your preference is a soft pastel palette, rich jewel tones, vibrant colours, or a playful mix of shades, the right tile can help establish the mood of your space.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          At Timex Ceramic, we help homeowners, architects, interior designers, developers, and project professionals explore tile designs that complement different styles, from modern minimalism to eclectic and contemporary interiors.
        </p>

        {/* Section 1: Explore Colourful Wall Tiles in Mumbai for Distinctive Interiors */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Colourful Wall Tiles in Mumbai for Distinctive Interiors
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Walls offer a natural canvas for colour. The right tile can create a focal point, complement furniture and fittings, or bring an otherwise understated interior to life.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Our collection of colorful wall tiles in Mumbai offers inspiration for spaces where colour plays an important role in the overall design. Consider vibrant wall surfaces for a kitchen backsplash, decorative bathroom wall, living room feature, entrance area, or selected commercial interior.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          Explore different colour directions to suit your design vision:
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Bold and vibrant colours:</strong> Make a statement with expressive shades that draw attention to a selected wall or decorative area.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Soft pastel tiles:</strong> Create a light, relaxed atmosphere that pairs well with neutral furniture and understated finishes.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Rich and deep tones:</strong> Introduce visual depth and contrast into contemporary interiors.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Multicolour tile designs:</strong> Combine shades and patterns to create a more artistic, playful, or eclectic look.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Classic colour combinations:</strong> Coordinate complementary or contrasting shades for a balanced, timeless aesthetic.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Decorative ceramic tiles:</strong> Use colour and pattern to highlight specific areas without overwhelming the entire room.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          When selecting colourful wall tiles, consider the natural light, room size, surrounding materials, and amount of visual detail already present. A colourful feature wall can make an impact while allowing the remaining surfaces to stay simple and cohesive.
        </p>

        {/* Section 2: Colourful Floor Tiles in Mumbai to Make a Lasting Impression */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Colourful Floor Tiles in Mumbai to Make a Lasting Impression
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Flooring is more than a practical surface. It can influence the character of a room, define different areas, and introduce colour into an interior in an unexpected way.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Colorful floor tiles in Mumbai can be considered for suitable residential and commercial applications where the flooring design is intended to become part of the overall visual identity. Depending on the selected tile, colour can be introduced through a patterned floor, a contrasting border, a decorative zone, or a combination of complementary shades.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a coordinated interior, pair colourful flooring with simpler wall finishes and furnishings. If you prefer a more expressive style, consider how the floor pattern interacts with cabinetry, furniture, lighting, and other decorative elements.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Before choosing a tile for flooring, check that the specific product is rated for floor use. Also consider slip resistance, expected foot traffic, cleaning requirements, and the conditions of the intended installation.
        </p>

        {/* Section 3: Colourful Tiles for Kitchen in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Colourful Tiles for Kitchen in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The kitchen is a practical workspace, but it can also be one of the most expressive areas of a home. Colourful tiles introduce personality to the space while helping connect the backsplash, cabinetry, countertop, and surrounding interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          Explore colorful tiles for kitchen designs for:
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Kitchen backsplashes that add contrast behind the countertop</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Decorative wall sections that complement cabinetry</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Contemporary kitchens with bold or contrasting colour palettes</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Compact kitchens where a carefully chosen colour can create a focal point</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Open-plan kitchens that need a visual connection with dining and living areas</span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a clean, modern look, pair colourful tiles with neutral cabinets and understated countertops. For a more playful interior, consider complementary shades or a multicolour design that works with the existing palette.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Kitchen tiles should also suit everyday use. In areas exposed to oil, food splashes, and frequent cleaning, consider the surface finish and how easily it can be maintained. Confirm that the chosen product is suitable for the intended kitchen application.
        </p>

        {/* Section 4: Colourful Tiles for Bathroom in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Colourful Tiles for Bathroom in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Bathrooms offer an opportunity to experiment with colour in a contained space. From refreshing tones to rich, dramatic shades, colourful tiles can help create a bathroom that feels distinctive and thoughtfully designed.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Use colorful tiles for bathroom interiors to highlight a vanity wall, create a decorative shower backdrop, bring interest to a niche, or introduce contrast around selected fixtures.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          Consider these design approaches:
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Light and calming:</strong> Pair soft colours with simple fittings and restrained decorative details.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Bold and contemporary:</strong> Use a stronger colour on a selected wall, balanced with neutral surfaces.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Playful and eclectic:</strong> Explore combinations of colours and patterns for a more individual look.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Elegant and coordinated:</strong> Match the tile palette with mirrors, metal finishes, cabinetry, and lighting.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For bathroom walls and floors, select products according to the intended application. Floor tiles in wet areas need particular attention to slip resistance and suitability for those conditions. Also consider cleaning requirements, especially for tiles with pronounced patterns or textured surfaces.
        </p>

        {/* Section 5: Colourful Tiles for Living Room in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Colourful Tiles for Living Room in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The living room sets the tone for the home. Colourful tiles can help create a focal point, complement a carefully selected furniture palette, or add personality to a contemporary interior.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore colorful tiles for living room designs for TV backdrops, decorative wall panels, selected feature walls, and other suitable applications. A carefully chosen colour can bring warmth to a neutral scheme or create a striking contrast against understated finishes.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a sophisticated look, introduce colour through a single feature and coordinate the surrounding surfaces. For a more expressive interior, combine complementary colours, decorative patterns, and carefully chosen furnishings.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          When planning a living room, consider how the tiles will look in both daylight and artificial lighting. Reviewing a sample alongside your flooring, paint, furniture, and lighting can help you make a more confident design decision.
        </p>

        {/* Section 6: Multicolor Tiles for Creative and Contemporary Spaces */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Multicolor Tiles for Creative and Contemporary Spaces
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Why choose just one shade when several colours can work together to create a distinctive design?
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Multicolor tiles in Mumbai are worth exploring for interiors that call for a more expressive visual style. Depending on the pattern and colour arrangement, multicolour designs can feel playful, artistic, vintage-inspired, or contemporary.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          They can be considered for kitchen backsplashes, selected bathroom walls, decorative niches, café interiors, boutique retail spaces, and other areas where a strong design statement is welcome.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          To create a balanced result, choose one dominant colour and use the remaining shades as supporting accents. Coordinate the tile design with simpler surrounding materials so that the pattern has room to stand out.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For larger projects, architects and interior designers can use colour strategically to establish a visual identity, distinguish selected zones, or connect decorative elements across different spaces.
        </p>

        {/* Section 7: Designer Colourful Tiles for Homes, Hotels and Commercial Projects */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Designer Colourful Tiles for Homes, Hotels and Commercial Projects
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Colour can play an important role in how people experience a space. In residential interiors, it can reflect personal taste and create a welcoming atmosphere. In commercial settings, it can support a distinctive brand identity and help make a space memorable.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Timex Ceramic's colourful tile collection is relevant to professionals exploring design-led surfaces for a range of projects.
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For homeowners:</strong> Find colourful tile ideas for kitchens, bathrooms, living rooms, and decorative areas that reflect your preferred style.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For architects and interior designers:</strong> Explore colour combinations, patterns, and surface options that complement your concept, material palette, and lighting plan.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For builders and developers:</strong> Consider colourful tiles for selected apartment interiors, show flats, and shared spaces where visual differentiation is important.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For hospitality and retail projects:</strong> Explore colour-led designs for cafés, restaurants, boutique hotels, reception areas, and selected customer-facing interiors.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For contractors and project teams:</strong> Confirm the product's intended application, dimensions, finish, installation requirements, and maintenance guidance before finalising specifications.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For project-related enquiries, contact Timex Ceramic to discuss your requirements and explore suitable options from the collection.
        </p>

        {/* Section 8: How to Choose the Right Colourful Tile Design */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          How to Choose the Right Colourful Tile Design
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          The best colourful tile is one that looks appealing and works with the practical needs of the space. Use these considerations to narrow your choices.
        </p>

        <div className="space-y-5 my-6">
          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              1. Start with the room and application
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Decide whether you need wall tiles, floor tiles, a backsplash, or a decorative feature. The intended use determines which product specifications you should check.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              2. Choose a colour palette
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Consider whether you prefer pastels, bold colours, deep shades, complementary tones, or a multicolour pattern. Use existing furniture, cabinetry, countertops, and fittings as a starting point.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              3. Consider the size of the space
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              In compact rooms, a focused splash of colour can create impact without making the space feel too busy. Larger areas may offer more flexibility for bold patterns or combinations of shades.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              4. Balance colour and pattern
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              If your tile has a strong pattern or several colours, consider simpler surrounding finishes. If the tile is a solid, expressive colour, decorative details elsewhere can be introduced more selectively.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              5. Think about lighting
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Colours may appear different under daylight, warm lighting, and cool lighting. Review tile samples in the intended space where possible before making a final decision.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              6. Consider cleaning and maintenance
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Choose a finish that suits the room's everyday demands. Kitchen and bathroom surfaces may require more frequent cleaning, so consider how the tile's texture, finish, and pattern affect maintenance.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              7. Verify the product specifications
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Confirm dimensions, intended application, surface finish, and any relevant performance requirements for the specific product. For larger installations, plan the tile layout, grout colour, and quantity before ordering.
            </p>
          </div>
        </div>

        {/* Section 9: Discover Colourful Ceramic Tiles at Timex Ceramic */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Colourful Ceramic Tiles at Timex Ceramic
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Colour brings energy, character, and individuality to interior design. Whether you prefer a subtle accent, a striking statement wall, or a creative mix of shades, the right tile can help bring your vision to life.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore colourful ceramic tiles in India and discover colorful tiles in Mumbai for kitchens, bathrooms, living rooms, and selected commercial interiors. From contemporary colour palettes to expressive multicolour designs, Timex Ceramic offers inspiration for spaces that deserve more than an ordinary finish.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-12">
          Explore the{" "}
          <Link
            href="/product-category/colourful/"
            className="text-[#C95745] hover:underline font-medium"
          >
            colourful tile collection
          </Link>{" "}
          and{" "}
          <Link
            href="/contact"
            className="text-[#C95745] hover:underline font-medium"
          >
            contact Timex Ceramic
          </Link>{" "}
          for product details and assistance with selecting tiles for your next residential or commercial project.
        </p>

        {/* FAQs Section */}
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-[#DED9D0]">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] leading-tight tracking-tight mb-8">
            Frequently Asked Questions About Colourful Tiles
          </h2>

          <div className="space-y-4">
            {activeFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.includes(index);

              // Interactive links for FAQ 2 and FAQ 13
              const renderAnswer = (ans: string) => {
                if (
                  faq.question.includes("Where can I find colourful tiles in Mumbai?") ||
                  index === 1
                ) {
                  return (
                    <>
                      You can explore the{" "}
                      <Link
                        href="/product-category/colourful/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        colourful tile collection
                      </Link>{" "}
                      on the Timex Ceramic website and contact the team for product information and help identifying options for your residential or commercial project.
                    </>
                  );
                }
                if (
                  faq.question.includes("How can I enquire about designer colourful tiles at Timex Ceramic?") ||
                  index === 12
                ) {
                  return (
                    <>
                      Visit the Timex Ceramic{" "}
                      <Link
                        href="/product-category/colourful/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        colourful tile category
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/contact"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        contact the team
                      </Link>{" "}
                      to enquire about available designs, product specifications, and options for your project.
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-col-${index + 1}`}
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
