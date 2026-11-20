"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface HexagonCollectionContentProps {
  faqs?: FaqItem[];
}

export const HEXAGON_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-hex-1",
    question: "1. Where can I find hexagon tiles in Mumbai?",
    answer: "You can explore the Timex Ceramic Hexagon Tiles collection to discover available designs. Contact the team for information about product specifications, availability and suitability for your project.",
  },
  {
    id: "faq-hex-2",
    question: "2. What are hexagon tiles?",
    answer: "Hexagon tiles are tiles with six sides that create a repeating geometric pattern when installed. They are available in different materials, sizes, colours and finishes for applications such as decorative walls, kitchen backsplashes and suitable floors.",
  },
  {
    id: "faq-hex-3",
    question: "3. Where can hexagon wall tiles be used?",
    answer: "Hexagon wall tiles can be used on selected living room feature walls, kitchen backsplashes, bathroom walls, vanity backdrops, decorative niches and suitable commercial surfaces. Always check the product's intended application before installation.",
  },
  {
    id: "faq-hex-4",
    question: "4. Are hexagon tiles suitable for kitchen backsplashes?",
    answer: "Yes, hexagon tiles designed for wall installation can be suitable for kitchen backsplashes. Consider cleaning requirements, resistance to expected exposure and compatibility with the substrate and installation materials.",
  },
  {
    id: "faq-hex-5",
    question: "5. Can hexagon tiles be used for bathroom floors?",
    answer: "Some hexagon tiles are suitable for bathroom flooring, but not all are designed for wet floors. Check slip performance, surface finish, water absorption and the manufacturer's application recommendations before choosing a product.",
  },
  {
    id: "faq-hex-6",
    question: "6. How do I choose hexagon floor tiles?",
    answer: "Consider the room's purpose, expected foot traffic, moisture exposure, tile size, surface finish and maintenance needs. Select a floor-rated product that meets the performance requirements of the intended space.",
  },
  {
    id: "faq-hex-7",
    question: "7. Are hexagon ceramic tiles suitable for modern homes?",
    answer: "Yes. Hexagon ceramic tiles can complement contemporary homes through their geometric pattern and range of design possibilities. They can be used on suitable walls and other surfaces according to the product specifications.",
  },
  {
    id: "faq-hex-8",
    question: "8. Are imported hexagon tiles available in Mumbai?",
    answer: "Timex Ceramic showcases curated tile collections for customers seeking distinctive designs. Contact the team to confirm whether particular imported hexagon tiles are currently available, along with their country of origin and specifications.",
  },
  {
    id: "faq-hex-9",
    question: "9. Do hexagon tiles make a room look smaller?",
    answer: "The effect depends on the tile size, colour, grout contrast, lighting and overall layout. Lighter colours and a coordinated palette can create a more open visual impression, while strong contrasts can make the geometric pattern more prominent.",
  },
  {
    id: "faq-hex-10",
    question: "10. Which grout colour works best with hexagon tiles?",
    answer: "Matching grout creates a more continuous appearance, while contrasting grout highlights the six-sided shape of each tile. The best choice depends on the design concept, tile colour, maintenance preferences and installation requirements.",
  },
  {
    id: "faq-hex-11",
    question: "11. Are hexagon tiles suitable for commercial projects?",
    answer: "Suitable hexagon tiles can be considered for cafes, restaurants, boutique stores, hotels, offices and other commercial spaces. Confirm the product's durability, slip performance, maintenance requirements and suitability for the intended use.",
  },
  {
    id: "faq-hex-12",
    question: "12. Are hexagon tiles difficult to install?",
    answer: "Hexagon tiles require careful alignment, spacing and cutting to maintain a consistent pattern. Professional installation is recommended, particularly for large surfaces, intricate layouts and areas where waterproofing is important.",
  },
  {
    id: "faq-hex-13",
    question: "13. How do architects select hexagon tiles for a project?",
    answer: "Architects should evaluate the design concept, tile dimensions, material, finish, technical specifications, installation details, maintenance requirements, quantities and availability. Samples and layout drawings can help verify the intended result before installation.",
  },
  {
    id: "faq-hex-14",
    question: "14. Can hexagon tiles be combined with other tile shapes?",
    answer: "Yes. Hexagon tiles can be paired with rectangular, square or other geometric tiles to create contrast or define separate areas. Plan the transitions carefully to achieve a coordinated design and technically appropriate installation.",
  },
  {
    id: "faq-hex-15",
    question: "15. Where can I explore designer hexagon tiles for a project in Mumbai?",
    answer: "Visit the Timex Ceramic Hexagon Tiles category page and contact the team to discuss available designs and options for your residential or commercial project.",
  },
];

export function HexagonCollectionContent({ faqs }: HexagonCollectionContentProps) {
  const displayFaqs = faqs && faqs.length >= 15 ? faqs : HEXAGON_DEFAULT_FAQS;
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
          Hexagon Tiles in Mumbai – Designer Wall &amp; Floor Tiles for Modern Spaces
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Add a distinctive geometric touch to your interiors with the hexagon tile collection at Timex Ceramic. Defined by their six-sided shape, hexagon tiles bring together creativity, visual rhythm and contemporary elegance, making them an eye-catching choice for walls, floors and decorative features.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Whether you are designing a modern apartment, upgrading a kitchen, creating a statement bathroom or planning a boutique commercial space, hexagon tiles offer a versatile way to introduce pattern and personality into your design.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          If you are searching for hexagon tiles in Mumbai, explore designs that complement a variety of interior styles, from understated contemporary spaces to bold, design-led environments. Use them to create a striking backsplash, a geometric feature wall, a stylish bathroom finish or an accent floor that stands apart from conventional tile layouts.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          At Timex Ceramic, discover tile designs for homeowners, architects, interior designers, builders, developers and commercial project professionals looking to create distinctive spaces.
        </p>

        {/* Section 1: Explore Hexagon Tile Designs in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Hexagon Tile Designs in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The beauty of hexagon tiles lies in their ability to transform a simple surface into a design feature. Their geometric shape creates natural visual movement, while different colours, textures, finishes and layouts offer opportunities to personalise an interior.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore hexagon tile designs in Mumbai for projects that call for a creative yet considered finish.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contemporary hexagon tiles:</strong>{" "}Bring a clean, geometric aesthetic to modern apartments, kitchens and bathrooms.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Decorative hexagon tiles:</strong>{" "}Create attractive focal points on selected walls, backsplashes and accent surfaces.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Textured hexagon tiles:</strong>{" "}Introduce surface variation and depth where the product&apos;s finish suits the intended application.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Monochrome hexagon tiles:</strong>{" "}Combine black, white and neutral tones for a balanced, contemporary look.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Colourful hexagon tiles:</strong>{" "}Add personality to selected interior features, boutique spaces and creative design schemes.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Designer hexagon tiles:</strong>{" "}Explore distinctive shapes, colours and finishes that complement a carefully planned interior.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          From subtle geometric details to bold patterned surfaces, hexagon tiles provide a creative foundation for distinctive architectural and interior design.
        </p>

        {/* Section 2: Hexagon Wall Tiles in Mumbai – Make Your Walls Stand Out */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Hexagon Wall Tiles in Mumbai – Make Your Walls Stand Out
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Walls provide an opportunity to introduce shape, texture and contrast without changing the entire design scheme. Hexagon wall tiles can turn an ordinary surface into a focal point through their distinctive geometry and creative layouts.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Hexagon Tiles for Living Room Feature Walls
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Create a statement behind a television unit, decorative shelving or a display area. Neutral hexagon tiles can complement contemporary furniture, while contrasting shades can establish a more expressive visual feature.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Hexagon Tiles for Kitchen Backsplashes
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Use hexagon wall tiles to introduce a geometric detail behind a countertop or cooking area. Choose colours that coordinate with your cabinetry, countertop material and fittings for a cohesive kitchen design.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Hexagon Tiles for Commercial Interiors
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          In cafes, restaurants, boutique retail stores and office reception areas, hexagon tiles can reinforce a distinctive design concept. Consider using them on selected walls, counters or decorative surfaces to create a memorable interior.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When choosing hexagon wall tiles in Mumbai, consider the scale of the surface, grout colour, pattern alignment, lighting and maintenance requirements.
        </p>

        {/* Section 3: Hexagon Tiles for Kitchens in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Hexagon Tiles for Kitchens in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          A kitchen can be both functional and expressive. Hexagon tiles bring a contemporary geometric pattern to kitchen walls and backsplashes, complementing everything from minimalist cabinetry to more characterful interiors.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Create a Distinctive Kitchen Backsplash
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          A hexagon backsplash can become the visual highlight of your kitchen. White and neutral tiles suit understated interiors, while darker or more colourful designs can create contrast against lighter cabinetry.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Coordinate Colours and Materials
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Pair hexagon tiles with wood, stone-inspired countertops, metallic fittings or simple cabinetry. A restrained palette can create a sophisticated look, while contrasting tones add personality.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Choose a Practical Finish
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Kitchen surfaces can be exposed to oil, food splashes, water and frequent cleaning. Select tiles suitable for the intended location and follow the manufacturer&apos;s recommendations for cleaning, grout selection and maintenance.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For homeowners and designers exploring hexagon tiles for kitchens in Mumbai, the right combination of colour, shape and finish can bring individuality to an everyday space.
        </p>

        {/* Section 4: Hexagon Tiles for Bathrooms in Mumbai – Geometric Style Meets Elegance */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Hexagon Tiles for Bathrooms in Mumbai – Geometric Style Meets Elegance
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Bathrooms are ideal spaces for creative tile layouts. Hexagon tiles can introduce a sense of order and visual interest, whether used across a selected wall, around a vanity or on a suitable bathroom floor.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Hexagon Bathroom Wall Tiles
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Create a feature behind the mirror, vanity or shower area with a carefully selected hexagon design. Light tones can support a calm, spa-inspired aesthetic, while darker shades introduce contrast and definition.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Hexagon Bathroom Floor Tiles
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For bathroom flooring, choose a product specifically suitable for wet-area floors. Its slip performance, surface texture, water absorption and maintenance requirements should be assessed for the intended conditions.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Design a Cohesive Bathroom
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Coordinate hexagon tiles with simple sanitaryware, suitable lighting, neutral paint colours and complementary materials. You can also combine them with other tile shapes to establish a clear distinction between different areas.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When selecting hexagon tiles for bathrooms in Mumbai, account for moisture exposure, ventilation, waterproofing, grout maintenance and the technical suitability of the chosen product.
        </p>

        {/* Section 5: Hexagon Floor Tiles in Mumbai – A Creative Foundation for Your Interiors */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Hexagon Floor Tiles in Mumbai – A Creative Foundation for Your Interiors
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Flooring influences how a room looks, feels and functions. Hexagon floor tiles offer an alternative to conventional rectangular formats, creating geometric layouts that can complement modern and traditional design concepts.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Hexagon Tiles for Living Rooms and Entrance Areas
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Use suitable hexagon floor tiles to define an entrance, highlight a selected area or complement a contemporary interior. The overall effect depends on the tile size, colour palette, grout lines and layout.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Hexagon Tiles for Boutique Commercial Spaces
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          In selected retail, hospitality and office interiors, geometric flooring can contribute to a distinctive brand environment. Choose products according to expected foot traffic, cleaning frequency and durability requirements.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          Plan Your Tile Layout Carefully
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Hexagon tiles create a repeating pattern, so alignment and grout colour play an important role in the finished appearance. For larger projects, review samples and layout plans before installation.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Before choosing any hexagon floor tiles, confirm that the tile is rated for flooring and suitable for the anticipated traffic, moisture exposure, and slip-risk conditions.
        </p>

        {/* Section 6: Designer Hexagon Tiles in Mumbai for Premium Interiors */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Designer Hexagon Tiles in Mumbai for Premium Interiors
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Good design often comes down to the details.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Hexagon tiles offer a distinctive alternative to standard tile shapes, allowing architects and interior designers to introduce geometric character while maintaining a cohesive material palette.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          They can complement minimalist apartments, luxury residences, contemporary villas, boutique hotels, restaurants, cafes and selected commercial spaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For residential projects, designer hexagon tiles can add personality to kitchen backsplashes, bathroom walls, decorative niches and selected flooring areas.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For commercial developments, they can help define reception areas, feature walls, display zones and other carefully planned surfaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When specifying designer hexagon tiles in Mumbai, consider the design intent alongside tile dimensions, finish, installation complexity, availability and maintenance requirements.
        </p>

        {/* Section 7: Imported Hexagon Tiles in Mumbai – Explore Distinctive Design Possibilities */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Imported Hexagon Tiles in Mumbai – Explore Distinctive Design Possibilities
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For projects that call for a particular aesthetic, imported hexagon tiles may offer additional choices in colours, textures, finishes and design details, depending on the available collection.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore curated tile designs for contemporary interiors and architectural projects. If you are considering imported hexagon tiles in Mumbai, compare the visual finish, dimensions, material composition, country of origin and technical documentation of the individual product.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For architects, designers and project buyers, it is also important to confirm stock availability, quantities, lead times and batch consistency before finalising a specification.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Choose a design that supports your creative vision while meeting the practical requirements of the space.
        </p>

        {/* Section 8: Hexagon Ceramic Tiles in Mumbai – Choosing the Right Option */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Hexagon Ceramic Tiles in Mumbai – Choosing the Right Option
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Hexagon ceramic tiles are already popular for decorative walls and other applications suited to the particular product. Their geometric format adds details to the interior without relying on elaborate ornamentation.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Before selecting hexagon ceramic tiles, consider the following:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Application:</strong>{" "}Confirm whether the tile is designed for walls, floors or both.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Colour and finish:</strong>{" "}Choose a design that complements your furniture, fittings and overall colour palette.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Tile dimensions:</strong>{" "}Consider the scale of the space and the visual effect of the selected hexagon size.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Grout selection:</strong>{" "}The grout colour can either emphasise each individual shape or create a more unified appearance.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Maintenance:</strong>{" "}Review the cleaning instructions and care requirements for the tile and grout.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Installation:</strong>{" "}Hexagonal shapes require careful alignment and cutting. Use a qualified installer familiar with the selected tile format.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          The right selection can help create a geometric surface that feels intentional, balanced and suited to the project&apos;s design requirements.
        </p>

        {/* Section 9: Why Choose Timex Ceramic for Hexagon Tiles in Mumbai? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Why Choose Timex Ceramic for Hexagon Tiles in Mumbai?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Finding the right tile involves more than selecting a colour or shape. It requires an understanding of how the material will work within the overall design and the practical demands of the space.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Timex Ceramic offers a curated destination for exploring distinctive tile collections in Mumbai.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Curated design options:</strong>{" "}Explore hexagon tile designs for a variety of interior concepts and applications.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Residential and commercial inspiration:</strong>{" "}Consider options for homes, offices, hospitality interiors, retail environments and selected project requirements.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Design-led selection:</strong>{" "}Compare shapes, colours and finishes to develop a cohesive interior palette.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Project-focused enquiries:</strong>{" "}Discuss your design requirements and confirm relevant product specifications with the team.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Mumbai showroom access:</strong>{" "}Connect with Timex Ceramic to enquire about available collections and suitable options for your project.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Whether you are a homeowner planning a renovation, an architect developing a material palette, an interior designer creating a feature surface or a contractor coordinating a project, Timex Ceramic can help you explore tile designs aligned with your brief.
        </p>

        {/* Section 10: Discover Hexagon Tile Designs at Timex Ceramic */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Hexagon Tile Designs at Timex Ceramic
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          From geometric kitchen backsplashes to distinctive bathroom walls and carefully planned feature floors, hexagon tiles offer an expressive way to bring character to your interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore the Timex Ceramic Hexagon Tile Collection to discover available designs and find inspiration for your next residential or commercial project.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For enquiries about hexagon wall tiles in Mumbai, hexagon floor tiles, imported hexagon designs or ceramic hexagon tiles, contact Timex Ceramic to discuss product availability, specifications and project requirements.
        </p>

        <p className="text-base sm:text-lg font-serif font-bold text-[#101B38] mb-10 md:mb-14">
          Timex Ceramic – Distinctive Tile Designs for Thoughtfully Designed Spaces.
        </p>

        {/* Divider */}
        <div className="border-t border-[#DED9D0] my-8" />

        {/* FAQ Section */}
        <div className="pt-4">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] tracking-tight mb-8">
            Frequently Asked Questions About Hexagon Tiles
          </h2>

          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.has(index);

              // Render answer with interactive internal links where supplied
              const renderAnswer = (ans: string) => {
                if (ans.includes("Timex Ceramic Hexagon Tiles collection")) {
                  const parts = ans.split("Timex Ceramic Hexagon Tiles collection");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/hexagon/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic Hexagon Tiles collection
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                if (ans.includes("Timex Ceramic Hexagon Tiles category page")) {
                  const parts = ans.split("Timex Ceramic Hexagon Tiles category page");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/hexagon/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic Hexagon Tiles category page
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-hex-${index + 1}`}
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
