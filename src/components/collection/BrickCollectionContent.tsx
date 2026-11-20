"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface BrickCollectionContentProps {
  faqs?: FaqItem[];
}

export const BRICK_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-brick-1",
    question: "1. Where can I find brick wall tiles in Mumbai?",
    answer: "You can explore brick wall tiles in Mumbai through Timex Ceramic's online brick tile collection. Review the available designs and contact the team to confirm product specifications, availability and suitability for your project.",
  },
  {
    id: "faq-brick-2",
    question: "2. What are brick tiles?",
    answer: "Brick tiles are tiles designed to reproduce the appearance of traditional brickwork. They may be crafted from ceramic, porcelain or other materials. Used to create brick-inspired finishes on suitable walls and, where approved, floors.",
  },
  {
    id: "faq-brick-3",
    question: "3. What are the benefits of brick wall tiles?",
    answer: "Brick wall tiles can introduce texture, visual warmth and architectural character without requiring a conventional exposed-brick wall. Their maintenance, durability and weather performance depend on the selected material, finish and installation quality.",
  },
  {
    id: "faq-brick-4",
    question: "4. Are brick tiles suitable for exterior walls in Mumbai?",
    answer: "Yes, certain brick-look tiles are suitable for exterior walls in Mumbai. Choose products rated for outdoor exposure and consider rainfall, moisture, temperature changes, substrate conditions and the recommended installation system.",
  },
  {
    id: "faq-brick-5",
    question: "5. Which brick tiles are best for exterior building elevations?",
    answer: "The best option is a tile specifically approved for exterior elevation use, with appropriate durability, water absorption characteristics and fixing compatibility. The selection should also account for the building's design, exposure conditions and maintenance requirements.",
  },
  {
    id: "faq-brick-6",
    question: "6. Are brick cladding tiles suitable for residential buildings?",
    answer: "Brick cladding tiles can be suitable for residential buildings when the chosen product and installation system are appropriate for the application. They can be used on selected façades, entrance walls, columns and other architectural features.",
  },
  {
    id: "faq-brick-7",
    question: "7. What is the difference between brick tiles and traditional bricks?",
    answer: "Traditional bricks are masonry units used in construction, while brick tiles are generally thinner decorative or finishing products designed to create a brick-like appearance. Their structural role, weight and installation method differ, so they should not be treated as interchangeable.",
  },
  {
    id: "faq-brick-8",
    question: "8. Are brick tiles available in modern designs?",
    answer: "Yes, brick-look tiles are available in styles ranging from rustic and vintage to minimalist and contemporary. Depending on the collection, design options may include muted neutrals, textured surfaces, dark colours and clean rectangular formats.",
  },
  {
    id: "faq-brick-9",
    question: "9. Are black brick tiles suitable for modern interiors?",
    answer: "Black brick tiles can create a striking feature wall in modern living rooms, cafés, retail spaces and industrial-inspired interiors. Pair them with lighter walls, warm wood or contrasting metal details to balance the visual effect.",
  },
  {
    id: "faq-brick-10",
    question: "10. Can brick tiles be used in restaurants and cafés?",
    answer: "Yes, suitable brick-look tiles can be used for restaurant feature walls, café interiors, reception areas and selected exterior surfaces. Choose materials and finishes that meet the project's cleaning, durability, fire-safety and application requirements.",
  },
  {
    id: "faq-brick-11",
    question: "11. Are brick tiles suitable for kitchen backsplashes?",
    answer: "Brick-look wall tiles can be suitable for kitchen backsplashes when the specific product is approved for the application. Consider resistance to stains, grease, moisture and cleaning products, along with appropriate grout and installation details.",
  },
  {
    id: "faq-brick-12",
    question: "12. Can brick tiles be installed in bathrooms?",
    answer: "Certain brick-look tiles are suitable for bathroom walls and selected wet-area applications. Check the manufacturer's recommendations for moisture exposure, cleaning, waterproofing and installation before selecting a product.",
  },
  {
    id: "faq-brick-13",
    question: "13. Can brick tiles be used for flooring?",
    answer: "Some brick-look tiles are designed for floor use, but not every brick tile is suitable for flooring. Confirm the product's floor-use rating, load requirements, wear resistance and slip performance before installation.",
  },
  {
    id: "faq-brick-14",
    question: "14. Are porcelain brick tiles suitable for outdoor projects?",
    answer: "Porcelain brick-look tiles can be suitable for some outdoor projects when their technical specifications and installation system meet the exposure conditions. For outdoor floors, also evaluate slip resistance, drainage and the intended traffic level.",
  },
  {
    id: "faq-brick-15",
    question: "15. What finishes are available in brick tiles?",
    answer: "Brick-look tiles may be available in matte, textured, rustic or glazed finishes, depending on the collection. Check the individual product details to confirm the actual finish and its recommended uses.",
  },
  {
    id: "faq-brick-16",
    question: "16. Are small-format brick tiles suitable for feature walls?",
    answer: "Yes, small-format brick tiles can create detailed patterns and emphasise the traditional appearance of brickwork. They can work well on accent walls, counters and selected architectural details.",
  },
  {
    id: "faq-brick-17",
    question: "17. How do I choose brick tile designs in Mumbai?",
    answer: "Start by identifying the application, design style, preferred colour, tile dimensions and budget. For Mumbai projects, also consider local weather exposure for exterior installations and the technical suitability of the selected product.",
  },
  {
    id: "faq-brick-18",
    question: "18. Are imported brick tiles available in Mumbai?",
    answer: "Imported brick tiles may be available depending on the current collection and stock. Contact Timex Ceramic to confirm the availability, origin and specifications of the particular design you are considering.",
  },
  {
    id: "faq-brick-19",
    question: "19. What should architects consider when specifying brick cladding tiles?",
    answer: "Architects should evaluate dimensions, weight, material properties, exterior suitability, fixing methods, substrate compatibility, movement joints, water management and maintenance requirements. For façades, the installation system must meet the applicable project and safety requirements.",
  },
  {
    id: "faq-brick-20",
    question: "20. How can I enquire about brick tiles at Timex Ceramic?",
    answer: "Visit the Timex Ceramic brick tile category page to explore the available collection. Contact the team with your preferred design, application, approximate quantity and project location to discuss suitable products and current availability.",
  },
];

export function BrickCollectionContent({ faqs }: BrickCollectionContentProps) {
  const displayFaqs = faqs && faqs.length > 0 ? faqs : BRICK_DEFAULT_FAQS;
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
          Brick Wall Tiles in Mumbai – Premium Designer Brick Tiles for Modern Spaces
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Give your walls a distinctive character with the thoughtfully curated brick tile collection at Timex Ceramic. Whether you are designing a contemporary residence, renovating a commercial interior or creating an impressive building façade, our brick wall tiles bring together the timeless appeal of exposed brickwork and the versatility of modern tile design.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          From warm, rustic textures to refined contemporary finishes, brick tiles offer an elegant way to introduce depth, warmth and visual interest into any space. If you are looking for brick wall tiles in Mumbai, explore designs that complement different architectural styles, interior concepts and project requirements.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          At Timex Ceramic, we help homeowners, architects, interior designers, builders and developers discover brick tile designs for feature walls, kitchen backsplashes, balconies, exterior elevations and selected commercial applications.
        </p>

        {/* Section: Explore Brick Tile Designs in Mumbai for Every Architectural Style */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Brick Tile Designs in Mumbai for Every Architectural Style
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The right wall finish can transform an ordinary surface into a defining design feature. Our brick tile collection offers inspiration for spaces that call for an industrial aesthetic, rustic warmth or contemporary sophistication.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Whether you prefer the familiar charm of exposed brick or a more understated brick-effect finish, explore brick tile designs that complement your vision.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Rustic brick tiles:</strong> Bring warmth, earthy tones and a timeless character to feature walls and hospitality interiors.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contemporary brick tiles:</strong> Create a clean, modern look for apartments, offices, retail spaces and contemporary homes.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Textured brick wall tiles:</strong> Add dimension and visual depth to otherwise plain walls.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Decorative brick tiles:</strong> Create distinctive backdrops for living rooms, restaurants, cafes and boutique commercial spaces.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Designer brick tiles:</strong> Complement carefully planned interiors with finishes that balance colour, texture and architectural detail.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mt-4 mb-8 md:mb-10">
          Discover brick tile designs right here in Mumbai that help turn creative concepts into visually cohesive spaces.
        </p>

        {/* Section: Premium Brick Tiles in Mumbai for Residential and Commercial Projects */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Premium Brick Tiles in Mumbai for Residential and Commercial Projects
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Brick tiles are a versatile choice for projects where material, colour and texture contribute to the overall design experience. They can introduce a relaxed, natural character into residential interiors while adding an inviting, distinctive finish to commercial environments.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          At Timex Ceramic, our brick tile collection is suited to design exploration across a variety of applications, subject to the specifications of each product.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Brick Wall Tiles for Living Rooms and Feature Walls
        </h3>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Create a striking focal point with brick wall tiles behind a television unit, sofa or decorative display. Warm brick tones pair beautifully with wood, neutral furnishings, metal accents and layered lighting.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For modern apartments, a brick feature wall can add character without overwhelming the rest of the interior.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Brick Tiles for Kitchens and Cafes
        </h3>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Introduce an urban, contemporary aesthetic with brick tiles for kitchen backsplashes, breakfast counters and selected decorative walls. Terracotta-inspired shades bring warmth, while grey, white and muted tones suit minimalist and industrial-inspired interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For kitchens and food-service environments, choose a finish that meets the cleaning, moisture and maintenance requirements of the application.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Brick Tiles for Exterior Walls and Building Elevations
        </h3>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The exterior of a building establishes its visual identity. Brick-effect wall tiles can create a distinctive finish for entrance walls, selected facade sections, balconies, boundary walls and architectural features.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          When selecting brick tiles for exterior walls in Mumbai, consider exposure to monsoon rain, sunlight, humidity and pollution. Confirm that the chosen product is suitable for outdoor use and that the substrate, fixing system, and installation method meet the project requirements.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Brick Cladding Tiles for Architectural Projects
        </h3>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Brick cladding tiles offer a way to introduce the appearance of brickwork to selected surfaces without constructing an entire wall from conventional bricks. Depending on the product, they can be considered for feature walls, columns, entrance areas and exterior elevations.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Architects and designers can use brick cladding tiles to create material contrast, highlight architectural forms and establish a consistent visual language across a project.
        </p>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#101B38] leading-snug mt-6 mb-2">
          Brick Tiles for Hotels, Restaurants and Retail Spaces
        </h3>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Sophisticated textures can make commercial spaces feel more distinctive and memorable. Brick tile finishes can complement cafe interiors, restaurant walls, boutique stores, hotel lounges, reception areas and selected hospitality spaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For project applications, consider durability, cleaning requirements, expected usage, installation details and the overall design scheme before finalising the material.
        </p>

        {/* Section: Imported Brick Tiles in Mumbai – Design That Makes a Statement */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Imported Brick Tiles in Mumbai – Design That Makes a Statement
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For projects that demand a distinctive finish, imported brick tiles can offer additional design possibilities through variations in colour, texture, format and surface appearance.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Timex Ceramic presents a curated tile collection for customers exploring premium and designer finishes for residential and commercial interiors. Our brick tile range can be considered for projects where the visual character of the material is as important as the surrounding furniture, lighting and architectural detailing.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          When comparing imported brick tiles in Mumbai, evaluate the individual product's country of origin, finish, dimensions, technical specifications, availability and suitability for the intended application.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          The result is a more considered material selection that aligns with your design intent and project requirements.
        </p>

        {/* Section: Exterior Brick Wall Tiles in Mumbai: What Should You Consider? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Exterior Brick Wall Tiles in Mumbai: What Should You Consider?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Mumbai's coastal climate makes material selection particularly important for exterior applications. The appearance of a tile is only one part of the decision; its technical suitability and installation are equally important.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Before choosing exterior brick wall tiles in Mumbai, consider the following:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Weather suitability:</strong> Confirm that the tile is rated for exterior installation and the exposure conditions of the site.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Moisture management:</strong> Assess water absorption, substrate preparation, drainage and waterproofing requirements.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Surface finish:</strong> Choose a texture and colour that complement the building's architecture and surrounding materials.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Fixing system:</strong> Ensure the adhesive, grout and installation method are appropriate for the tile, substrate and height of installation.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Maintenance:</strong> Consider how dust, rain and urban pollution may affect the finished surface.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Sample approval:</strong> Review a physical sample under the project's actual lighting conditions before finalising the specification.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mt-4 mb-8 md:mb-10">
          The right combination of product selection and professional installation helps create an exterior finish that is visually appealing and appropriate for the local environment.
        </p>

        {/* Section: Why Choose Timex Ceramic for Brick Tiles in Mumbai? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Why Choose Timex Ceramic for Brick Tiles in Mumbai?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Selecting tiles is an important part of bringing an architectural concept to life. Timex Ceramic offers a curated destination for exploring distinctive wall and floor tile collections in Mumbai.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Our approach is centred on helping customers find designs that complement their spaces and project objectives.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Curated design collections:</strong> Explore brick tile styles for different architectural and interior design concepts.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Residential and commercial inspiration:</strong> Consider design options for homes, offices, hospitality interiors, retail environments and selected exterior applications.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Material selection support:</strong> Compare available designs, finishes and specifications to identify suitable options for your project.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Design-led approach:</strong> Coordinate brick-effect surfaces with wood, stone, concrete-inspired finishes and other complementary materials.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Mumbai showroom access:</strong> Connect with our team to discuss available collections and explore suitable options for your requirements.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mt-4 mb-8 md:mb-10">
          Whether you are an architect specifying materials, an interior designer developing a concept, a contractor coordinating finishes or a homeowner planning a renovation, Timex Ceramic can help you explore brick tile options aligned with your design brief.
        </p>

        {/* Section: Find the Right Brick Tiles for Your Next Project */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Find the Right Brick Tiles for Your Next Project
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          From a warm, rustic feature wall to a contemporary commercial interior or a carefully designed exterior elevation, brick tiles offer creative possibilities across a wide range of spaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore the Timex Ceramic Brick Tile Collection to discover available designs and identify options suited to your project.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          For enquiries about brick wall tiles in Mumbai, premium brick tiles, imported designs or exterior brick cladding, contact Timex Ceramic to discuss product availability, specifications and project requirements.
        </p>

        <p className="text-sm md:text-base font-semibold text-[#101B38] italic pt-2 mb-8 md:mb-12">
          Timex Ceramic Tiles – Distinctive Styles for Thoughtful Spaces.
        </p>

        {/* Horizontal Divider */}
        <hr className="border-[#DED9D0] my-10 md:my-14" />

        {/* FAQ Section */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mb-8">
          Frequently Asked Questions About Brick Tiles
        </h2>

        <div className="space-y-3">
          {displayFaqs.map((faq, idx) => {
            const isOpen = openFaqIndices.has(idx);
            return (
              <div
                key={faq.id || `faq-brick-${idx + 1}`}
                className="bg-[#FCFBF8] border border-[#DED9D0] rounded-[2px] overflow-hidden transition-all duration-300 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <h3 className="font-serif text-base font-bold text-[#101B38]">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-[#101B38] transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-2 text-xs md:text-sm text-[#333333]/80 font-light leading-relaxed border-t border-[#EDEAE4] bg-[#F7F5F0]">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

