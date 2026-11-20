"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface TextureCollectionContentProps {
  faqs?: FaqItem[];
}

export const TEXTURE_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-tex-1",
    question: "1. What are texture tiles?",
    answer: "Texture tiles are tiles with tactile surfaces or visual patterns that add depth and character to walls or floors. Depending on the design, they may feature linear grooves, stone-inspired surfaces, geometric patterns, or 3D effects.",
  },
  {
    id: "faq-tex-2",
    question: "2. Where can textured wall tiles be used?",
    answer: "Textured wall tiles can be used on living room feature walls, TV backdrops, bedroom headboards, selected kitchen walls, bathroom vanity walls, entrance areas, and commercial reception spaces. The correct product should be selected for each application.",
  },
  {
    id: "faq-tex-3",
    question: "3. Where can I find texture tiles in Mumbai?",
    answer: "You can explore the texture tile collection at Timex Ceramic's website and contact the team for product information and assistance with choosing suitable designs for your home or project in Mumbai.",
  },
  {
    id: "faq-tex-4",
    question: "4. What are 3D textured wall tiles?",
    answer: "3D textured wall tiles are designed to create a dimensional effect through raised-looking patterns, sculptural surfaces, grooves, or visual detailing. They can make feature walls more prominent by creating variation in light and shadow.",
  },
  {
    id: "faq-tex-5",
    question: "5. Are textured tiles suitable for bathrooms?",
    answer: "Yes, selected textured tiles are suitable for bathroom applications. Choose wall or floor products according to their intended use, and check slip resistance, water exposure suitability, cleaning requirements, and installation guidance before purchasing.",
  },
  {
    id: "faq-tex-6",
    question: "6. Can texture tiles be used in kitchens?",
    answer: "Yes, suitable texture tiles can be used on kitchen walls and selected backsplash areas. For surfaces exposed to oil and food splashes, consider how easily the finish can be cleaned, particularly if it has deep grooves or pronounced relief.",
  },
  {
    id: "faq-tex-7",
    question: "7. Are texture tiles suitable for flooring?",
    answer: "Some textured tiles are suitable for floors, but not every wall texture is designed for foot traffic. Check the product specifications, intended application, surface grip, and maintenance requirements before selecting a floor tile.",
  },
  {
    id: "faq-tex-8",
    question: "8. Are textured tiles difficult to maintain?",
    answer: "Maintenance depends on the tile material, finish, and depth of its texture. Many surfaces can be maintained with routine cleaning, while deeply grooved or irregular patterns may need additional attention. Follow the manufacturer's cleaning instructions.",
  },
  {
    id: "faq-tex-9",
    question: "9. How do I choose the right texture tile design for a small room?",
    answer: "Consider lighter colours, subtle patterns, and selective placement to avoid overwhelming a compact room. A single feature wall can introduce texture without making every surface visually busy.",
  },
  {
    id: "faq-tex-10",
    question: "10. Are texture tiles suitable for commercial projects?",
    answer: "Suitable texture tiles can be specified for selected areas in hotels, restaurants, offices, retail spaces, and other commercial interiors. Project teams should confirm performance specifications, maintenance needs, traffic suitability, and installation requirements for each application.",
  },
  {
    id: "faq-tex-11",
    question: "11. What should architects and interior designers consider when specifying texture tiles?",
    answer: "Consider the design intent, tile dimensions, finish, lighting, installation layout, grout selection, maintenance, and suitability for the intended surface. For larger projects, confirm product availability and technical details before finalising the specification.",
  },
  {
    id: "faq-tex-12",
    question: "12. How can I enquire about designer texture tiles at Timex Ceramic?",
    answer: "Visit the Timex Ceramic texture tile collection and contact the team to enquire about designs, product details, and options suitable for your residential or commercial project.",
  },
];

export function TextureCollectionContent({ faqs }: TextureCollectionContentProps) {
  const displayFaqs = faqs && faqs.length >= 12 ? faqs : TEXTURE_DEFAULT_FAQS;
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
          Textured Tiles in Mumbai, India – Designer Textured Wall &amp; Floor Tiles
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          A beautiful space is about more than colour. It is about the details, the surfaces, and the way light brings a design to life. At Timex Ceramic, our texture tile collection helps transform ordinary walls and floors into distinctive design features, adding depth, character, and visual interest to residential and commercial interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore textured wall tiles in India for contemporary homes, premium apartments, hotels, restaurants, offices, retail spaces, and architectural projects. From subtle surface patterns to expressive 3D designs, texture tiles can complement minimalist interiors, modern luxury spaces, and bold statement-making concepts.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          If you are searching for texture tiles in Mumbai, Timex Ceramic offers a design-led collection to help homeowners, architects, interior designers, developers, and project professionals find surfaces that suit their creative vision.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Whether you are planning an elegant living room, a stylish kitchen, a relaxing bathroom, or a striking commercial feature wall, discover texture tile designs that bring your ideas to life.
        </p>

        {/* Section 1: Explore Textured Wall Tiles in India for Every Interior Style */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Textured Wall Tiles in India for Every Interior Style
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Textured tiles introduce an extra dimension to interior design. Depending on the pattern, finish, colour, and lighting, they can create a soft, understated backdrop or become the centrepiece of a room.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Our texture tile collection features design possibilities inspired by contemporary architecture and natural surfaces. Explore options that complement different aesthetics, from understated elegance to bold, modern interiors.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">3D textured wall tiles:</strong>{" "}Create depth and dimension with raised-looking patterns, sculptural effects, and visually striking surfaces.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Modern texture tiles:</strong>{" "}Complement contemporary spaces with clean lines, geometric details, and refined patterns.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Stone-inspired texture tiles:</strong>{" "}Bring the visual character of natural stone into selected interior and architectural applications.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Linear and fluted-look tiles:</strong>{" "}Introduce rhythm and structure to feature walls, reception areas, and decorative panels.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Concrete-inspired textures:</strong>{" "}Suit industrial, minimalist, and contemporary design schemes.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Decorative ceramic texture tiles:</strong>{" "}Add a distinctive finishing touch to selected walls and interior features.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Choose a design that complements the surrounding flooring, furniture, lighting, and colour palette. For a balanced look, textured surfaces often work particularly well when paired with simpler finishes.
        </p>

        {/* Section 2: 3D Textured Wall Tiles in India for Statement-Making Spaces */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          3D Textured Wall Tiles in India for Statement-Making Spaces
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Plain walls can provide a clean backdrop, but a textured surface can make a room feel more considered and visually engaging. 3D textured wall tiles in India are a popular design choice for creating feature walls, decorative backdrops, and architectural focal points.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Depending on the design, the interplay of light and shadow can make a surface appear more sculptural throughout the day. This makes 3D-effect and dimensional-look tiles particularly useful in spaces where the wall is intended to stand out.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Consider 3D textured wall tiles for:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Living room TV backdrops and feature walls</li>
          <li className="pl-1">Bedroom headboard walls</li>
          <li className="pl-1">Entrance foyers and passage features</li>
          <li className="pl-1">Hotel lobbies and reception areas</li>
          <li className="pl-1">Restaurant interiors and café feature walls</li>
          <li className="pl-1">Office reception areas and meeting spaces</li>
          <li className="pl-1">Selected bathroom vanity walls and decorative niches</li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For the best result, consider the scale of the pattern, the size of the wall, and the direction of the lighting. A bold texture may work beautifully on one feature wall, while a more subtle pattern can help maintain a calm, cohesive look across a larger area.
        </p>

        {/* Section 3: Texture Tiles in Mumbai for Living Rooms and Bedrooms */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Texture Tiles in Mumbai for Living Rooms and Bedrooms
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Living rooms and bedrooms offer an opportunity to use texture to express your personal style. Instead of relying entirely on paint, wallpaper, or decorative accessories, textured tiles can create a more permanent architectural feature.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Use texture wall tiles in Mumbai homes to enhance a TV unit backdrop, highlight a dining area, or bring interest to a wall behind the sofa. In bedrooms, carefully selected textures can frame the headboard and complement upholstered furniture, timber finishes, or soft neutral colours.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For compact apartments, consider lighter shades and restrained patterns to avoid making a room feel visually crowded. In larger living spaces, more pronounced textures can help define separate zones and create a distinctive focal point.
        </p>

        {/* Section 4: Textured Tiles for Bathroom in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Textured Tiles for Bathroom in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Bathrooms benefit from materials that balance design with practical requirements. Textured tiles can introduce visual depth to a vanity wall, shower backdrop, or selected decorative section while helping establish a coordinated bathroom aesthetic.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          When choosing textured tiles for bathroom interiors, consider where the tile will be installed. Wall tiles and floor tiles serve different purposes, particularly in areas exposed to water.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For bathroom floors and wet areas, check the product&apos;s slip-resistance rating, intended application, and maintenance requirements before selecting a tile. Deep grooves and pronounced surface patterns may also require additional attention during cleaning.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For bathroom walls, explore subtle stone-inspired finishes, linear patterns, or contemporary 3D-effect designs that complement fittings, mirrors, lighting, and sanitaryware.
        </p>

        {/* Section 5: Textured Tiles for Kitchen in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Textured Tiles for Kitchen in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The kitchen is both a working space and an important part of the home&apos;s visual design. Texture tiles can introduce character behind a countertop, around a designated backsplash area, or on a wall that connects the kitchen with the rest of the interior.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Choose textured tiles for kitchen walls that complement cabinet colours, countertop materials, and hardware finishes. Neutral textures can create a refined backdrop, while more distinctive patterns can add personality to contemporary kitchens.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For areas exposed to cooking splashes, oil, and food residue, prioritise a finish that is practical to clean. Deeply textured surfaces may need more attention than smoother finishes, so consider everyday maintenance alongside appearance.
        </p>

        {/* Section 6: Texture Tiles for Floors and Architectural Applications */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Texture Tiles for Floors and Architectural Applications
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Texture is not limited to walls. Selected textured floor tiles can help define entryways, living areas, circulation spaces, and other suitable applications.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          If you are exploring texture tiles for floor in Mumbai, choose products specifically rated for the intended flooring application. Consider foot traffic, moisture exposure, surface grip, cleaning requirements, and the overall look of the space.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For architects, interior designers, developers, and contractors, texture tiles can help create visual transitions between different zones without relying entirely on changes in colour or furniture. In hospitality and commercial projects, they can be used to reinforce a design concept across reception areas, lounges, selected corridors, and other appropriate spaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Always confirm the individual product&apos;s technical specifications and suitability for indoor, outdoor, wet-area, or high-traffic use before finalising a project specification.
        </p>

        {/* Section 7: Designer Texture Tiles for Residential and Commercial Projects */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Designer Texture Tiles for Residential and Commercial Projects
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The right tile can support the design language of an entire project. Timex Ceramic&apos;s texture tile category is relevant to professionals seeking distinctive surface treatments for residential interiors and selected commercial environments.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">For architects and interior designers:</strong>{" "}Explore texture, pattern, and finish options that support your material palette, lighting plan, and design concept.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">For builders and developers:</strong>{" "}Consider textured surfaces for selected apartment interiors, show flats, entrance areas, and shared spaces where visual differentiation matters.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">For hospitality projects:</strong>{" "}Use suitable texture tile designs to create memorable feature walls in hotels, restaurants, cafés, lounges, and reception areas.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">For contractors and project teams:</strong>{" "}Confirm product dimensions, installation requirements, finish suitability, quantities, and maintenance guidance before placing orders or preparing specifications.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For project enquiries, contact Timex Ceramic to discuss your design requirements and identify suitable options from the collection.
        </p>

        {/* Section 8: How to Choose the Right Texture Tile Design */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          How to Choose the Right Texture Tile Design
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Selecting a texture tile is easier when you consider the space as a whole rather than choosing a pattern in isolation.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Decide where the tile will be used.</strong>{" "}Identify whether the application is a wall, floor, backsplash, feature wall, or exterior surface.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Choose the visual effect.</strong>{" "}Consider subtle stone-inspired textures, linear patterns, geometric designs, or more pronounced 3D effects.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Match the scale to the space.</strong>{" "}Large, expressive patterns can make a statement, while restrained textures can be easier to coordinate across smaller rooms.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Think about lighting.</strong>{" "}Directional lighting can emphasise raised patterns and surface variation. Review samples under lighting similar to the finished space where possible.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Consider cleaning and maintenance.</strong>{" "}Deep grooves and irregular surfaces may require different cleaning methods from smoother finishes.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Check technical suitability.</strong>{" "}Confirm the recommended application, finish, slip resistance where relevant, and installation instructions for the specific tile.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Coordinate the full palette.</strong>{" "}Pair textured tiles with complementary paint, cabinetry, flooring, fittings, and furnishings.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          {/* Transition */}
        </p>

        {/* Section 9: Discover Texture Tiles at Timex Ceramic, Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Texture Tiles at Timex Ceramic, Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The right texture can change how a space looks and feels. From understated decorative surfaces to bold feature-wall designs, textured tiles offer a versatile way to introduce depth and individuality into contemporary interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore the Timex Ceramic collection for textured wall tiles in India, 3D textured wall tiles in India, and designer texture tiles in Mumbai. Whether you are refreshing a home, planning a luxury interior, or specifying finishes for a commercial project, discover tile designs that bring your architectural vision closer to reality.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-12">
          Looking for texture tiles for your next project?{" "}
          <Link
            href="/product-category/texture/"
            className="text-[#C95745] hover:underline font-medium"
          >
            Explore the collection
          </Link>{" "}
          and contact Timex Ceramic for product details and assistance with your selection.
        </p>

        {/* Divider */}
        <hr className="border-t border-[#DED9D0] my-12 md:my-16" />

        {/* FAQs Section */}
        <div className="space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] leading-tight tracking-tight">
            Frequently Asked Questions About Texture Tiles
          </h2>

          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.has(index);

              // Render answer with interactive internal links where supplied
              const renderAnswer = (ans: string) => {
                if (ans.includes("Timex Ceramic's website")) {
                  const parts = ans.split("Timex Ceramic's website");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/texture/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic&apos;s website
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                if (ans.includes("Timex Ceramic texture tile collection")) {
                  const parts = ans.split("Timex Ceramic texture tile collection");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/texture/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic texture tile collection
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-tex-${index + 1}`}
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

