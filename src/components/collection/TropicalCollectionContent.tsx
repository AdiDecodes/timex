"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface TropicalCollectionContentProps {
  faqs?: FaqItem[];
}

export const TROPICAL_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-trop-1",
    question: "1. What are tropical pattern tiles?",
    answer: "Tropical pattern tiles feature designs inspired by nature, including leafy motifs, palm-inspired patterns, botanical illustrations, floral prints, and organic shapes. They are often used to create decorative accents and feature walls.",
  },
  {
    id: "faq-trop-2",
    question: "2. Where can I find tropical tiles in Mumbai?",
    answer: "You can explore the tropical tile collection on the Timex Ceramic website and contact the team for product information and assistance with selecting designs for your residential or commercial project.",
  },
  {
    id: "faq-trop-3",
    question: "3. Where can tropical wall tiles be used?",
    answer: "Tropical wall tiles can be used on living room feature walls, bedroom backdrops, selected kitchen walls, bathroom vanity areas, entrance features, and suitable hospitality interiors. Check the product's intended application before installation.",
  },
  {
    id: "faq-trop-4",
    question: "4. Are tropical ceramic tiles suitable for Indian homes?",
    answer: "Yes, suitable tropical ceramic tiles can complement many Indian home styles, including contemporary apartments, villas, and eclectic interiors. The right design depends on the room, colour palette, lighting, and intended application.",
  },
  {
    id: "faq-trop-5",
    question: "5. Are tropical tiles suitable for bathrooms?",
    answer: "Selected tropical tiles can be used on bathroom walls and other suitable surfaces. For shower areas and bathroom floors, check the product's wet-area suitability, slip resistance, finish, and maintenance requirements.",
  },
  {
    id: "faq-trop-6",
    question: "6. What are botanical tiles?",
    answer: "Botanical tiles feature motifs inspired by leaves, plants, foliage, and other natural forms. They can create a calming, decorative, or expressive look depending on their pattern and colour palette.",
  },
  {
    id: "faq-trop-7",
    question: "7. What are leaf pattern tiles used for?",
    answer: "Leaf pattern tiles are often used for feature walls, bathroom accents, kitchen walls, bedroom backdrops, and selected commercial interiors. They can introduce natural detail without requiring real plant material on the surface.",
  },
  {
    id: "faq-trop-8",
    question: "8. Can tropical tiles be used in kitchens?",
    answer: "Yes, suitable tropical tiles can be used on kitchen walls and selected backsplash areas. Consider cleaning requirements and verify that the tile is appropriate for the intended installation.",
  },
  {
    id: "faq-trop-9",
    question: "9. How do I choose tropical bathroom wall tile designs?",
    answer: "Consider the size of the bathroom, lighting, colour palette, fittings, and the amount of pattern you want. A single botanical feature wall can create impact while keeping the remaining surfaces visually balanced.",
  },
  {
    id: "faq-trop-10",
    question: "10. Are tropical tiles suitable for hotels, restaurants, and spas?",
    answer: "Selected tropical tile designs can be considered for hospitality interiors such as hotels, restaurants, cafés, and spas. Confirm the product's intended use, maintenance requirements, and performance specifications for the proposed application.",
  },
  {
    id: "faq-trop-11",
    question: "11. What should architects and interior designers consider when specifying tropical tiles?",
    answer: "Consider the design concept, pattern scale, colour palette, dimensions, layout, grout selection, lighting, maintenance, and intended application. For larger projects, confirm product specifications and availability before finalising the material schedule.",
  },
  {
    id: "faq-trop-12",
    question: "12. How do I maintain tropical tiles?",
    answer: "Maintenance depends on the tile material and finish. Follow the manufacturer's care instructions and use cleaning products suitable for the specific tile and grout.",
  },
  {
    id: "faq-trop-13",
    question: "13. How can I enquire about designer tropical tiles at Timex Ceramic?",
    answer: "Visit the Timex Ceramic tropical tile category and contact the team for details about the collection, product specifications, and options for your residential or commercial project.",
  },
];

export function TropicalCollectionContent({ faqs }: TropicalCollectionContentProps) {
  const activeFaqs = faqs && faqs.length >= 13 ? faqs : TROPICAL_DEFAULT_FAQS;
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
          Tropical Pattern Tiles in India – Designer Tropical Tiles in Mumbai
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Imagine the calming greens of tropical leaves, the delicate beauty of botanical prints, and the vibrant character of nature-inspired patterns all brought into your interior through thoughtfully chosen tiles.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, our tropical tile collection offers design inspiration for spaces that deserve a fresh, distinctive look. From leafy motifs and floral patterns to contemporary nature-inspired designs, tropical tiles can introduce colour, movement, and personality into modern interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore tropical pattern tiles in India for homes, apartments, boutique hotels, restaurants, cafés, spas, and commercial spaces. Whether you prefer subtle botanical details or bold tropical prints, these designs can help create interiors that feel welcoming, expressive, and connected to nature.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          If you are searching for tropical tiles in Mumbai, discover options for feature walls, bathrooms, kitchen accents, living areas, and other selected applications. At Timex Ceramic, homeowners, architects, interior designers, developers, and contractors can explore tropical tile designs to complement a range of creative concepts.
        </p>

        {/* Section 1: Explore Tropical Tiles in Mumbai for Nature-Inspired Interiors */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Tropical Tiles in Mumbai for Nature-Inspired Interiors
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Tropical design is inspired by the colours, shapes, and patterns found in lush landscapes. Think oversized leaves, delicate foliage, botanical illustrations, exotic florals, and organic patterns that create a sense of movement across a surface.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Tropical tiles in Mumbai can be used to create a dramatic feature or add a subtle natural accent, depending on the pattern, colour palette, and area covered.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          Explore different design directions for your space:
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Leaf-pattern tiles:</strong> Bring a leafy, botanical feel to feature walls and decorative areas.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Floral wall tiles:</strong> Introduce floral details for interiors that feel expressive and inviting.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Botanical tiles:</strong> Explore nature-inspired motifs that complement contemporary and eclectic interiors.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Tropical statement tiles:</strong> Use larger, more prominent patterns to create a focal point.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Subtle tropical designs:</strong> Choose restrained colours and delicate motifs for a calmer, more understated look.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Colour-led tropical patterns:</strong> Combine greens, blues, earthy tones, and other complementary shades to establish a distinctive palette.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The key is to select a pattern that suits the mood of the room. A bold tropical wall can become the centrepiece of an otherwise minimal interior, while a more delicate design can add detail without competing with furniture and accessories.
        </p>

        {/* Section 2: Tropical Wall Tiles in Mumbai for Statement-Making Spaces */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Tropical Wall Tiles in Mumbai for Statement-Making Spaces
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          A feature wall can change the character of a room without requiring an extensive redesign. Tropical wall tiles offer a creative way to introduce natural motifs, distinctive colours, and visual depth into a carefully chosen area.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore tropical wall tiles in Mumbai for living room backdrops, bedroom feature walls, entrance foyers, decorative niches, and selected commercial interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a contemporary look, pair tropical patterns with simple furniture, clean lines, and neutral surrounding surfaces. If you prefer a more expressive style, coordinate the tiles with natural wood finishes, indoor plants, textured materials, and complementary colours.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Tropical wall tiles can also help define individual zones in open-plan spaces. A patterned wall behind a seating area or dining space can establish a focal point without relying on additional partitions.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          When choosing a design, consider the size of the pattern, the dimensions of the wall, and the lighting. Larger motifs can create a bold visual statement, while smaller or more restrained patterns may be easier to coordinate across compact spaces.
        </p>

        {/* Section 3: Tropical Ceramic Tiles in India for Contemporary Homes */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Tropical Ceramic Tiles in India for Contemporary Homes
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Nature-inspired design can feel at home in many different interiors. Tropical motifs are not limited to holiday homes or resort-style spaces; they can also complement urban apartments, contemporary villas, and modern residential projects.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore tropical ceramic tiles in India to bring botanical character into selected areas of your home.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a calm, contemporary aesthetic, consider leafy designs in muted shades paired with neutral walls and natural-looking finishes. For a more vibrant interior, choose expressive patterns that introduce contrast and become a defining feature of the room.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Tropical ceramic tiles can be considered for suitable wall applications in living rooms, bedrooms, kitchens, and bathrooms. The specific product should always be selected according to the intended use, finish, and installation conditions.
        </p>

        {/* Section 4: Tropical Bathroom Wall Tile Designs for a Relaxing Retreat */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Tropical Bathroom Wall Tile Designs for a Relaxing Retreat
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Bathrooms offer a natural setting for tropical design. Leafy motifs, botanical patterns, and nature-inspired colours can help create a refreshing atmosphere that feels distinct from the rest of the home.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore tropical bathroom wall tile designs for vanity backdrops, selected shower walls, decorative niches, and other suitable wall applications.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          Here are a few ideas to inspire your bathroom design:
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Botanical feature wall:</strong> Use a leafy design behind the vanity or in another carefully selected area.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Soft tropical palette:</strong> Pair muted greens, creams, or earthy shades with understated fittings for a relaxed look.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Bold tropical statement:</strong> Choose a more expressive pattern for one wall while keeping the remaining surfaces simple.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Coordinated natural finishes:</strong> Combine tropical wall tiles with complementary mirrors, lighting, cabinetry, and accessories.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a small bathroom, a focused feature wall can introduce pattern without making the entire room feel busy. In a larger bathroom, a more expansive design may help establish a cohesive visual theme.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For floors and wet zones, verify that the selected tile is specifically suitable for the intended application. Check slip resistance, maintenance requirements, and installation guidance before making a final decision.
        </p>

        {/* Section 5: Floral Wall Tiles in Mumbai for Elegant Decorative Accents */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Floral Wall Tiles in Mumbai for Elegant Decorative Accents
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Floral patterns can bring softness, detail, and personality to an interior. Depending on the design and colour palette, floral wall tiles can feel classic, contemporary, artistic, or playful.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Floral wall tiles in Mumbai can be considered for decorative kitchen walls, bathroom features, living room accents, entrance areas, and selected hospitality interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a refined look, choose floral designs that complement the room's existing colours and finishes. A restrained botanical pattern can work well with neutral furniture, while a more vibrant floral motif can become the central design feature.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          When using floral tiles alongside other patterns, keep the overall palette coordinated. Repeating one or two colours from the tile design in accessories or furnishings can help create a more cohesive interior.
        </p>

        {/* Section 6: Botanical Tiles and Leaf Pattern Tiles in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Botanical Tiles and Leaf Pattern Tiles in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Botanical design draws inspiration from the forms and details of the natural world. From delicate foliage to bold tropical leaves, these patterns can introduce movement and visual interest while maintaining a connection to nature.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore botanical tiles in Mumbai for interiors that call for a natural, artistic, or contemporary look.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Leaf pattern tiles in Mumbai are especially useful when you want to create a distinctive feature without relying entirely on bright colours. Green foliage designs can complement wood-inspired finishes, stone-look surfaces, neutral paint, and simple furnishings.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          Consider leaf-pattern tiles for:
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Living room feature walls</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Bedroom headboard backdrops</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Kitchen accent walls</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Bathroom vanity areas</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Decorative niches and entrance features</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Selected café, restaurant, spa, and hotel interiors</span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          To keep the design balanced, choose one primary focal point and allow other surfaces to support it. This approach can make even an expressive botanical pattern feel considered rather than overwhelming.
        </p>

        {/* Section 7: Tropical Tile Designs for Kitchens and Living Spaces */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Tropical Tile Designs for Kitchens and Living Spaces
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Tropical tiles can bring a creative touch to spaces where people gather, cook, relax, and entertain.
        </p>

        <div className="space-y-6 my-6">
          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
              Tropical tiles for kitchens
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
              Use a suitable tropical wall tile design to introduce botanical detail behind a countertop or on a selected kitchen wall. Pair expressive prints with simpler cabinetry and countertops to maintain a balanced look.
            </p>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              For areas exposed to cooking splashes and frequent cleaning, consider the surface finish and maintenance requirements before choosing the product.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
              Tropical tiles for living rooms
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              A tropical feature wall can bring colour and character to a living room, particularly when paired with restrained furniture and complementary finishes. Consider using the design behind a TV unit, near a seating area, or in another carefully chosen location.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
              Tropical tiles for bedrooms
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Botanical motifs can create an inviting backdrop behind a bed or on a selected bedroom wall. Choose a pattern that works with the room's lighting, textiles, and overall colour palette.
            </p>
          </div>
        </div>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For each application, confirm that the specific tile is intended for the surface where it will be installed.
        </p>

        {/* Section 8: Designer Tropical Wall and Floor Tiles in Mumbai for Projects */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Designer Tropical Wall and Floor Tiles in Mumbai for Projects
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Tropical tile designs can support a wide range of architectural and interior concepts, from understated residential features to bold hospitality spaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Timex Ceramic's tropical category can help professionals explore nature-inspired patterns for suitable wall and floor applications.
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For architects and interior designers:</strong> Explore botanical motifs, colour combinations, and decorative patterns that support your design concept and material palette.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For builders and developers:</strong> Consider tropical tiles for selected apartment interiors, show flats, amenity spaces, and other suitable areas where a distinctive design can add character.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For hospitality projects:</strong> Explore nature-inspired designs for cafés, restaurants, spas, boutique hotels, lounges, and reception areas.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For contractors and project teams:</strong> Confirm the intended application, dimensions, finish, installation requirements, maintenance guidance, and quantity requirements before finalising a specification.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          When planning larger projects, review tile samples alongside lighting, paint, furniture, and other materials. This helps ensure that the pattern and colour work well within the finished space.
        </p>

        {/* Section 9: How to Choose the Right Tropical Tile Design */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          How to Choose the Right Tropical Tile Design
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          The best tropical tile design should complement both the look of your space and the practical requirements of the installation.
        </p>

        <div className="space-y-5 my-6">
          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              1. Choose your design direction
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Decide whether you prefer leafy patterns, floral motifs, botanical illustrations, or more abstract nature-inspired designs. This helps narrow the options to a style that suits your vision.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              2. Select a colour palette
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Greens and earthy tones can create a natural feel, while blues, lighter shades, and more vibrant combinations can produce a different mood. Coordinate the tile colours with existing finishes.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              3. Consider the size of the space
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Large, expressive patterns can create a strong focal point, while smaller motifs or restrained colours may suit compact spaces. Think about the area the pattern will cover before choosing.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              4. Plan the placement
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              A feature wall, backsplash, or decorative niche can introduce tropical design without covering every surface. Decide where the pattern will have the greatest impact.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              5. Review the lighting
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Natural and artificial lighting can change how colours and patterns appear. Where possible, review a tile sample in the intended room before making your final selection.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              6. Check the intended application
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Wall and floor tiles can have different technical requirements. Confirm the selected product's suitability for bathrooms, wet areas, flooring, or exterior use as relevant.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              7. Coordinate surrounding materials
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Pair expressive tropical tiles with complementary paint, furniture, cabinetry, and flooring. Simpler surrounding surfaces can help a detailed pattern stand out.
            </p>
          </div>
        </div>

        {/* Section 10: Discover Tropical Tiles at Timex Ceramic, Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Tropical Tiles at Timex Ceramic, Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Bring a fresh perspective to your interiors with designs inspired by leaves, flowers, foliage, and the beauty of nature. Whether you are planning a botanical feature wall, a tropical bathroom, or a distinctive hospitality interior, tropical tiles can help turn an ordinary surface into a memorable design feature.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore tropical pattern tiles in India, tropical tiles in Mumbai, floral wall tiles, botanical tiles, and leaf-pattern designs at Timex Ceramic.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-12">
          From contemporary homes to design-led commercial spaces, discover nature-inspired tile possibilities that complement your vision. Browse the{" "}
          <Link
            href="/product-category/tropical/"
            className="text-[#C95745] hover:underline font-medium"
          >
            tropical tile collection
          </Link>{" "}
          and{" "}
          <Link
            href="/contact"
            className="text-[#C95745] hover:underline font-medium"
          >
            contact Timex Ceramic
          </Link>{" "}
          for product information and assistance with your next project.
        </p>

        {/* FAQs Section */}
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-[#DED9D0]">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] leading-tight tracking-tight mb-8">
            Frequently Asked Questions About Tropical Tiles
          </h2>

          <div className="space-y-4">
            {activeFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.includes(index);

              // Interactive links for FAQ 2 and FAQ 13
              const renderAnswer = (ans: string) => {
                if (
                  faq.question.includes("Where can I find tropical tiles in Mumbai?") ||
                  index === 1
                ) {
                  return (
                    <>
                      You can explore the{" "}
                      <Link
                        href="/product-category/tropical/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        tropical tile collection on the Timex Ceramic website
                      </Link>{" "}
                      and contact the team for product information and assistance with selecting designs for your residential or commercial project.
                    </>
                  );
                }
                if (
                  faq.question.includes("How can I enquire about designer tropical tiles at Timex Ceramic?") ||
                  index === 12
                ) {
                  return (
                    <>
                      Visit the Timex Ceramic{" "}
                      <Link
                        href="/product-category/tropical/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        tropical tile category
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/contact"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        contact the team
                      </Link>{" "}
                      for details about the collection, product specifications, and options for your residential or commercial project.
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-trop-${index + 1}`}
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

