"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface MosaicCollectionContentProps {
  faqs?: FaqItem[];
}

export const MOSAIC_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-mos-1",
    question: "1. What are mosaic tiles?",
    answer: "Mosaic tiles are small-format tiles arranged in patterns, grids or decorative compositions to create a finished surface. They may be made from ceramic, porcelain, glass, stone or other materials, depending on the product.",
  },
  {
    id: "faq-mos-2",
    question: "2. Where can I find mosaic tiles in Mumbai?",
    answer: "You can explore mosaic tile designs through Timex Ceramic's online mosaic category. Review the available collection and contact the team to confirm product details, availability and suitability for your project.",
  },
  {
    id: "faq-mos-3",
    question: "3. What are the benefits of mosaic tiles?",
    answer: "Mosaic tiles offer design flexibility through their variety of colours, shapes, patterns and formats. They can create decorative accents, detailed feature walls and distinctive surfaces. Their practical performance depends on the material, finish and installation.",
  },
  {
    id: "faq-mos-4",
    question: "4. What types of mosaic tiles are available?",
    answer: "Mosaic tiles can include square, rectangular, diamond and hexagonal designs, as well as geometric, colourful and metallic-look patterns. Available options depend on the collection and the material used.",
  },
  {
    id: "faq-mos-5",
    question: "5. Which mosaic tiles are suitable for bathrooms in Mumbai?",
    answer: "Choose mosaic tiles approved for the intended bathroom application. Wall designs may be suitable for vanity backdrops and selected shower walls, while bathroom floors require products with appropriate floor-use and slip-resistance characteristics.",
  },
  {
    id: "faq-mos-6",
    question: "6. Are mosaic tiles suitable for kitchen backsplashes?",
    answer: "Yes, suitable mosaic tiles can be used for kitchen backsplashes. Consider resistance to stains, grease, moisture and cleaning products, along with the compatibility of the grout and installation system.",
  },
  {
    id: "faq-mos-7",
    question: "7. Can mosaic tiles be used in living rooms?",
    answer: "Yes, mosaic tiles can create decorative living-room feature walls, television backdrops and architectural accents. Coordinate the design with the room's lighting, furniture, flooring and other wall finishes.",
  },
  {
    id: "faq-mos-8",
    question: "8. Are mosaic tiles suitable for swimming pools?",
    answer: "Some mosaic tiles are designed for swimming pool applications. Choose products approved for permanent immersion and ensure that the adhesive, grout, substrate and waterproofing system are suitable for pool installation.",
  },
  {
    id: "faq-mos-9",
    question: "9. Which mosaic tile colours are popular for swimming pools?",
    answer: "Blue and green mosaics are common design choices for pools because they complement water-inspired colour schemes. White and other colours can also be considered depending on the pool design, lighting and surrounding materials.",
  },
  {
    id: "faq-mos-10",
    question: "10. Are porcelain mosaic tiles suitable for floors?",
    answer: "Certain porcelain mosaic tiles are suitable for flooring, provided they meet the required performance and slip-resistance specifications. Check the product's floor-use rating before installation.",
  },
  {
    id: "faq-mos-11",
    question: "11. What is the difference between ceramic and porcelain mosaic tiles?",
    answer: "Both ceramic and porcelain tiles can be used in mosaic designs, but their composition and technical properties can differ. Choose according to the intended application and verify the product's water absorption, durability and installation requirements.",
  },
  {
    id: "faq-mos-12",
    question: "12. Are imported mosaic tiles available in Mumbai?",
    answer: "Availability depends on the current collection and stock. Contact Timex Ceramic to confirm the imported mosaic designs available and request information about their origin, material and specifications.",
  },
  {
    id: "faq-mos-13",
    question: "13. What are luxury mosaic tiles used for?",
    answer: "Luxury mosaic tiles can be used for decorative bathroom walls, premium kitchen backsplashes, hotel interiors, reception areas, feature walls and other suitable applications. Metallic-look finishes and distinctive patterns can help create a sophisticated design statement.",
  },
  {
    id: "faq-mos-14",
    question: "14. Are glossy mosaic tiles suitable for small bathrooms?",
    answer: "Glossy mosaic wall tiles can reflect available light and create a brighter visual effect. The result depends on the colour, pattern, lighting and placement. For bathroom floors, prioritise appropriate slip resistance rather than appearance alone.",
  },
  {
    id: "faq-mos-15",
    question: "15. Can mosaic tiles be combined with large-format tiles?",
    answer: "Yes, mosaic tiles can be paired with larger-format wall or floor tiles to create contrast and highlight selected areas. A coordinated colour palette and well-planned transitions help maintain visual balance.",
  },
  {
    id: "faq-mos-16",
    question: "16. Are mosaic tiles easy to maintain?",
    answer: "Maintenance depends on the material, surface finish and grout. Small-format layouts generally have more grout joints, so select appropriate grout and follow the manufacturer's cleaning recommendations.",
  },
  {
    id: "faq-mos-17",
    question: "17. What shapes are available in mosaic tiles?",
    answer: "Mosaic designs may include square, rectangular, diamond, hexagonal and other geometric shapes. Check the individual product listing for actual shape, dimensions and sheet configuration.",
  },
  {
    id: "faq-mos-18",
    question: "18. Are mosaic tiles suitable for hotels and restaurants?",
    answer: "Yes, suitable mosaic tiles can be used in hotel bathrooms, restaurant feature walls, café interiors, reception areas and other commercial spaces. Select products according to traffic, cleaning requirements and the intended application.",
  },
  {
    id: "faq-mos-19",
    question: "19. How do I calculate the quantity of mosaic tiles required?",
    answer: "Measure the surface area and calculate the quantity using the coverage stated on the product packaging or listing. Account for sheet dimensions, pattern alignment, cuts and an appropriate wastage allowance. For complex patterns, consult the installer before ordering.",
  },
  {
    id: "faq-mos-20",
    question: "20. How can I choose the right mosaic tiles for my project?",
    answer: "Start with the intended application, design style, colour palette and budget. Compare material, shape, finish, dimensions and technical specifications, then confirm the product's suitability and availability before finalising your selection.",
  },
];

export function MosaicCollectionContent({ faqs }: MosaicCollectionContentProps) {
  const activeFaqs = faqs && faqs.length >= 20 ? faqs : MOSAIC_DEFAULT_FAQS;
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
          Designer Mosaic Tiles in Mumbai for Distinctive Interiors
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Small details can make a remarkable difference to a space. Designer mosaic tiles in Mumbai from Timex Ceramic bring colour, pattern, texture and visual depth to walls and selected floor applications. From elegant bathroom accents and eye-catching kitchen backsplashes to contemporary living spaces, restaurants and hospitality interiors, mosaic tiles offer a creative way to personalise an interior.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore mosaic tiles in Mumbai for projects that call for something beyond a plain surface. The Timex Ceramic mosaic collection features imported designer tile options in small formats, with a variety of colours, shapes and finishes. Depending on the individual product, designs may include square, diamond, rectangular and hexagonal patterns, glossy surfaces, matt finishes and metallic accents.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Whether you are a homeowner updating a bathroom, an interior designer planning a feature wall, an architect specifying materials or a developer working on a hospitality project, discover mosaic tile designs that complement your space and design vision.
        </p>

        {/* Section 1: Explore Mosaic Tiles in Mumbai at Timex Ceramic */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Mosaic Tiles in Mumbai at Timex Ceramic
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Mosaic tiles are valued for their ability to create intricate patterns and distinctive surface details. Their smaller formats make them particularly interesting for decorative compositions, contrasting accents and carefully planned feature areas.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The right mosaic design can bring a subtle decorative touch to a neutral interior or become a focal point through bold colour, geometric arrangements or reflective finishes. Depending on the collection, mosaic tiles can complement modern, vintage-inspired, minimalist and more expressive design styles.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore mosaic wall tiles in a range of colour and design directions, including blue, green, grey, red, white, pink, black, copper, silver and selected gold-toned options. Availability varies by product, so review the individual tile details before finalising your selection.
        </p>

        {/* Section 2: Mosaic Wall Tiles for Statement Interiors */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Mosaic Wall Tiles for Statement Interiors
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Mosaic wall tiles can turn an ordinary wall into a considered design feature. Their patterns and smaller formats create opportunities for detail that can be difficult to achieve with larger, plain tiles.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          Consider mosaic designs for:
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Living room feature walls:</strong> Introduce pattern or colour to a selected decorative area.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Bathroom walls:</strong> Add visual interest around a vanity or another suitable wall section.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Kitchen backsplashes:</strong> Create a distinctive backdrop between the countertop and upper cabinets.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Bedroom accents:</strong> Use a carefully selected design to complement the room's colour palette.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Dining areas:</strong> Add decorative detail that connects the furniture, lighting and surrounding finishes.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Restaurants, cafés and hotels:</strong> Develop a memorable interior feature that complements the overall design concept.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a balanced finish, coordinate the mosaic pattern with the surrounding wall tiles, flooring, cabinetry, fixtures and lighting. A decorative surface usually works best when its colours and scale relate to the rest of the room.
        </p>

        {/* Section 3: Mosaic Bathroom Tiles in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Mosaic Bathroom Tiles in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Bathrooms offer an ideal opportunity to introduce texture, colour and detail through carefully selected decorative tiles. Mosaic bathroom tiles in Mumbai can help define a vanity wall, create an accent panel or add a distinctive design element to a contemporary bathroom.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a light, understated look, consider white or grey mosaics alongside neutral surfaces. Blue and green designs can introduce a refreshing colour accent, while selected metallic or copper-toned mosaics can complement a more dramatic interior scheme.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Mosaic tiles can also help establish visual zones in a bathroom without requiring a different material throughout the space. For example, a decorative panel can contrast with simpler surrounding tiles and create a focal point.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          When selecting mosaic tiles for bathrooms, confirm that the product is approved for the intended wall or floor application. Wet-area performance depends on the specific tile, installation system, grout, substrate and maintenance. For floors, check slip-resistance suitability rather than relying on appearance alone.
        </p>

        {/* Section 4: Mosaic Kitchen Tiles and Decorative Backsplashes */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Mosaic Kitchen Tiles and Decorative Backsplashes
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          A kitchen backsplash is both a practical surface and an opportunity to introduce design personality. Mosaic kitchen tiles in Mumbai can add colour and pattern to the wall behind a countertop, complement cabinetry or create contrast within an otherwise minimal kitchen.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          Consider these design approaches:
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Neutral and contemporary:</strong> Use white, grey or understated metallic accents with simple cabinetry.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Colour-led kitchens:</strong> Explore blue, green, red or pink mosaic designs to introduce a distinctive focal point.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Warm, sophisticated interiors:</strong> Selected copper or gold-toned details can work alongside complementary fixtures and finishes.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Geometric design schemes:</strong> Square, diamond and other geometric arrangements can reinforce a structured, contemporary look.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Before choosing a kitchen mosaic, assess the pattern scale, grout layout, cleaning requirements and compatibility with the intended backsplash area. Follow the manufacturer's care recommendations, especially where the surface may be exposed to grease, food splashes or frequent cleaning.
        </p>

        {/* Section 5: Mosaic Pool Tiles for Swimming Pools and Outdoor Spaces */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Mosaic Pool Tiles for Swimming Pools and Outdoor Spaces
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Swimming pool finishes need to be chosen for both appearance and technical performance. Mosaic pool tiles in Mumbai can create striking waterline details, decorative pool surfaces and coordinated outdoor design schemes when the selected product is specifically suitable for the intended installation.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Timex Ceramic's supplied product information includes selected European porcelain options identified for floor applications, bathrooms, outdoor areas and swimming pools. These include blue and green colour options with textured finishes and anti-skid classification in the provided catalogue data.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For swimming pool projects, verify the individual product's suitability for continuous water immersion, pool chemicals, installation conditions and the specific surface being tiled. Also confirm slip-resistance requirements for surrounding walkways and other areas where people may walk barefoot on wet surfaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          A tile listed for a swimming pool or outdoor area should not automatically be assumed suitable for every pool application. Ask for the technical documentation and installation guidance before specifying the product.
        </p>

        {/* Section 6: Discover Imported Mosaic Tiles in Different Shapes */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Imported Mosaic Tiles in Different Shapes
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Tile shape influences the visual rhythm of a mosaic surface. Timex Ceramic's supplied collection details include several small-format shapes, giving designers different ways to create contrast and pattern.
        </p>

        <div className="space-y-6 my-6">
          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
              Square Mosaic Tiles
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Square mosaics offer a structured, balanced appearance. Depending on colour and layout, they can suit contemporary bathroom walls, kitchen accents and selected decorative surfaces.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
              Diamond Mosaic Tiles
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Diamond-shaped designs can introduce a more dynamic geometric pattern. They can be used to add movement to a feature wall or complement an interior with strong lines and contrasting materials.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
              Rectangular Mosaic Tiles
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Rectangular mosaics create a directional pattern that can help reinforce a horizontal or vertical design scheme. Consider the overall wall dimensions and layout when choosing their orientation.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
              Hexagonal Mosaic Tiles
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Hexagonal mosaics offer a geometric alternative to traditional square arrangements. They can complement modern interiors and provide a distinctive accent when paired with simpler surrounding surfaces.
            </p>
          </div>
        </div>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The exact shapes available depend on the individual product. Confirm dimensions, layout and installation requirements before specifying a design.
        </p>

        {/* Section 7: Glossy, Matt and Metallic Mosaic Tile Designs */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Glossy, Matt and Metallic Mosaic Tile Designs
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          A tile's finish can change the way a room feels and how its decorative details interact with light.
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Glossy mosaic tiles:</strong> Glossy surfaces reflect light and can emphasise colour and pattern. They are worth considering for selected decorative wall applications where a brighter, more reflective look is desired.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Matt mosaic tiles:</strong> Matt finishes offer a more understated appearance and can complement contemporary or natural-inspired interiors. Check the product's maintenance and intended-use guidance before selecting it for a specific area.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Metallic mosaic tiles:</strong> Selected metallic and copper-toned options can introduce a decorative highlight. These finishes can work well with coordinated lighting, hardware and other metallic details.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Vintage-inspired and modern designs:</strong> Depending on the individual collection, mosaic patterns can support either a classic decorative atmosphere or a more contemporary aesthetic.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Finish is only one part of the selection process. Confirm the tile's material, application rating, cleaning recommendations and technical suitability for the intended location.
        </p>

        {/* Section 8: Luxury Mosaic Tiles in India for Residential and Commercial Projects */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Luxury Mosaic Tiles in India for Residential and Commercial Projects
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Luxury is often expressed through the quality of the design, the coordination of materials and the attention given to detail. Luxury mosaic tiles in India can help create distinctive interiors when their colour, format and finish are selected to suit the architecture.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For residential projects, mosaics can add a personalised touch to bathrooms, kitchens, living rooms and bedrooms. In hotels, restaurants and cafés, selected decorative surfaces can contribute to a recognisable interior identity. For retail and commercial spaces, a carefully placed mosaic feature can reinforce the wider design concept.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Architects and interior designers should evaluate the tile in the context of the entire material palette, including base tiles, grout, flooring, lighting and fixtures. Developers and contractors should also confirm quantities, dimensions, product availability and installation requirements before preparing the final specification.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Timex Ceramic's mosaic collection offers a starting point for exploring imported designer tile options for projects in Mumbai and across India. Contact the team to verify current product details and identify designs appropriate to your project.
        </p>

        {/* Section 9: Why Explore Mosaic Tiles at Timex Ceramic? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Why Explore Mosaic Tiles at Timex Ceramic?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Choosing mosaic tiles is an opportunity to bring individuality to a space through colour, geometry and finish. The right design can complement a larger tile scheme, create a decorative focal point or help establish a consistent visual language across an interior project.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore mosaic designs for residential interiors, hospitality spaces and selected commercial applications. Whether you are renovating a home, developing a design concept or sourcing finishes for a larger project, consider the intended use, desired appearance and technical requirements together.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Review the available product information and confirm the material, dimensions, finish, application suitability and current availability with the Timex Ceramic team before ordering.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-12">
          Explore the{" "}
          <Link
            href="/product-category/mosaic/"
            className="text-[#C95745] hover:underline font-medium"
          >
            Mosaic Tiles Collection
          </Link>{" "}
          at Timex Ceramic to discover decorative tile possibilities for your next project in Mumbai or elsewhere in India.
        </p>

        {/* FAQs Section */}
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-[#DED9D0]">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] leading-tight tracking-tight mb-8">
            Frequently Asked Questions About Mosaic Tiles
          </h2>

          <div className="space-y-4">
            {activeFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.includes(index);

              // Interactive links for FAQ 2
              const renderAnswer = (ans: string) => {
                if (
                  faq.question.includes("Where can I find mosaic tiles in Mumbai?") ||
                  index === 1
                ) {
                  return (
                    <>
                      You can explore mosaic tile designs through Timex Ceramic's{" "}
                      <Link
                        href="/product-category/mosaic/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        online mosaic category
                      </Link>
                      . Review the available collection and{" "}
                      <Link
                        href="/contact"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        contact the team
                      </Link>{" "}
                      to confirm product details, availability and suitability for your project.
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-mos-${index + 1}`}
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

