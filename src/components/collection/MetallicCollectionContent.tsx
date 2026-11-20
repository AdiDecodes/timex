"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface MetallicCollectionContentProps {
  faqs?: FaqItem[];
}

export const METALLIC_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-met-1",
    question: "1. What are metallic finish tiles?",
    answer: "Metallic finish tiles are tiles designed with a metal-inspired appearance, reflective effect, or metallic visual detail. Depending on the product, the design may feature copper-like tones, rusty-metal effects, or other contemporary colour and surface treatments.",
  },
  {
    id: "faq-met-2",
    question: "2. Where can I find metallic finish tiles in India?",
    answer: "You can explore the metallic tile collection on the Timex Ceramic website and contact the team for product details and guidance on selecting suitable options for your project.",
  },
  {
    id: "faq-met-3",
    question: "3. Are metallic-look tiles suitable for living rooms?",
    answer: "Selected metallic-look tiles can be used on living room feature walls and other suitable surfaces. Consider the room's lighting, furniture, colour palette, and the finish of the specific tile.",
  },
  {
    id: "faq-met-4",
    question: "4. Can metallic tiles be used in kitchens?",
    answer: "Suitable metallic-look tiles can be considered for kitchen walls and backsplash areas. Check the product's intended application and cleaning requirements, particularly for surfaces exposed to oil and food splashes.",
  },
  {
    id: "faq-met-5",
    question: "5. Are metallic tiles suitable for bathrooms?",
    answer: "Selected metallic-look tiles may be suitable for bathroom walls and other applications specified by the manufacturer. For floors and wet areas, verify moisture suitability, slip resistance, and maintenance requirements.",
  },
  {
    id: "faq-met-6",
    question: "6. What is the difference between glossy and matt metallic-look tiles?",
    answer: "Glossy finishes generally reflect more light and can create a brighter visual effect. Matt finishes tend to have a more restrained appearance. The exact effect depends on the product's surface and lighting conditions.",
  },
  {
    id: "faq-met-7",
    question: "7. Are metallic-look tiles available in copper colours?",
    answer: "The Timex Ceramic series information includes copper colour options in selected collections, including Alloy Series 1200, Argos, and Rusty Metal. Check the individual product listing for current details and available options.",
  },
  {
    id: "faq-met-8",
    question: "8. Can metallic-look tiles be used in commercial interiors?",
    answer: "Suitable products can be considered for selected commercial spaces, including restaurants, cafés, offices, reception areas, and hospitality interiors. Confirm the product's specifications and suitability for the intended application.",
  },
  {
    id: "faq-met-9",
    question: "9. Are metallic finish tiles suitable for floors?",
    answer: "Some series in the supplied collection are listed for wall and floor use, while others are listed for walls. Confirm the specific product's intended application and technical specifications before using it as flooring.",
  },
  {
    id: "faq-met-10",
    question: "10. How do I maintain metallic-look tiles?",
    answer: "Maintenance depends on the material and finish. Follow the manufacturer's care instructions and use cleaning products suitable for the selected tile. Avoid abrasive methods unless the manufacturer confirms they are appropriate.",
  },
  {
    id: "faq-met-11",
    question: "11. What should architects and interior designers consider when specifying metallic tiles?",
    answer: "Consider colour, finish, dimensions, lighting, layout, installation requirements, maintenance, and the intended application. For larger projects, confirm product specifications and availability before finalising the material schedule.",
  },
  {
    id: "faq-met-12",
    question: "12. How can I enquire about metallic tiles at Timex Ceramic?",
    answer: "Visit the Timex Ceramic metallic tile category and contact the team for information about the collection, individual series, product specifications, and options for your residential or commercial project.",
  },
];

export function MetallicCollectionContent({ faqs }: MetallicCollectionContentProps) {
  const activeFaqs = faqs && faqs.length >= 12 ? faqs : METALLIC_DEFAULT_FAQS;
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
          Metallic Finish Tiles in India – Designer Metallic Tiles in Mumbai
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Some surfaces blend quietly into a room. Others catch the light, create contrast, and give the entire space a distinctive personality. Metallic finish tiles bring that extra dimension to interior design through reflective effects, metal-inspired colours, and contemporary surface details.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore a curated collection of metallic-look tiles for modern homes, luxury apartments, boutique hotels, restaurants, offices, and design-led commercial spaces. From copper-inspired tones and cool greys to elegant beige, blue, green, and white options, the collection offers a range of visual directions for distinctive interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          If you are searching for metallic finish tiles in India, discover design possibilities for living rooms, bathrooms, kitchens, dining areas, and selected hospitality spaces. Depending on the series, the collection includes ceramic and porcelain tiles, glossy and matt finishes, and different formats for a range of design requirements.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For homeowners, architects, interior designers, developers, and contractors, metallic tiles offer a creative way to introduce contrast, highlight selected surfaces, and bring a contemporary finish to a project.
        </p>

        {/* Section 1: Explore Metallic Tiles in Mumbai for Contemporary Spaces */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Metallic Tiles in Mumbai for Contemporary Spaces
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Metal-inspired surfaces can make an interior feel modern, artistic, or industrial-inspired without relying on decorative accessories alone. Depending on the pattern and finish, metallic-look tiles can create a subtle accent or become the focal point of a room.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore metallic tiles in Mumbai for feature walls, decorative panels, kitchen accents, bathroom walls, living room backdrops, and other suitable applications.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          The Timex Ceramic collection includes a variety of design directions, from copper-toned and rusty-metal looks to cooler colours and understated neutral finishes. Choose a design that complements your overall material palette and the mood you want to create.
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Copper-inspired metallic tiles:</strong> Bring warmth and visual character to selected feature areas.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Rusty-metal-look tiles:</strong> Complement industrial, urban, and contemporary design schemes.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Glossy metallic-look tiles:</strong> Add reflective interest and help create a more luminous surface effect.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Matt metallic-look tiles:</strong> Offer a more restrained visual effect for selected interiors.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Neutral metallic tiles:</strong> Beige and grey-inspired tones can coordinate with a broad range of materials.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>Colour-led metallic tiles:</strong> Blue and green options can introduce a distinctive accent into a contemporary space.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The right choice depends on the intended application, the lighting, and how the surface will work alongside flooring, furniture, fittings, and other finishes.
        </p>

        {/* Section 2: Metallic Wall Tiles for Statement-Making Interiors */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Metallic Wall Tiles for Statement-Making Interiors
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Walls are one of the most effective places to introduce a distinctive tile finish. Metallic-look wall tiles can create a focal point, highlight an architectural feature, or add visual interest to a space with a restrained colour palette.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-3">
          Explore metallic wall tile designs for:
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Living room TV backdrops and feature walls</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Dining room accent walls</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Kitchen walls and selected backsplash areas</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Bathroom vanity walls and decorative niches</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Bedroom feature walls</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Hotel reception areas and restaurant interiors</span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>Office reception spaces and boutique retail interiors</span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For a sophisticated look, pair metallic-look tiles with neutral paint, simple cabinetry, stone-inspired surfaces, or warm wood finishes. If the tile has a strong reflective effect or a pronounced pattern, keep nearby materials relatively understated to let the surface stand out.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Before selecting a tile for a particular wall, confirm the product's intended application, dimensions, finish, and installation requirements.
        </p>

        {/* Section 3: Metallic Finish Tiles for Living Rooms and Dining Areas */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Metallic Finish Tiles for Living Rooms and Dining Areas
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Living rooms and dining areas offer opportunities to use metallic-look tiles as decorative architectural features. A carefully chosen surface can complement modern furniture, statement lighting, and a coordinated interior palette.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Consider metallic-look tiles for a TV wall, a selected living room feature, or an accent wall near a dining area. Copper-inspired tones can introduce warmth, while grey, beige, blue, or green options can create different visual effects depending on the surrounding materials.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For smaller living spaces, a focused feature wall can introduce metallic detail without making the room feel overly busy. In larger interiors, the tile can help establish a stronger design statement or distinguish one area from another.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Lighting is especially important when selecting metallic-look surfaces. Review samples under lighting similar to the finished room, as the appearance of reflective finishes can change depending on the direction and intensity of light.
        </p>

        {/* Section 4: Metallic Tiles for Kitchen in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Metallic Tiles for Kitchen in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The kitchen is an ideal place to balance practical surfaces with expressive design. Metallic-look tiles can add a contemporary accent behind a countertop or on a selected wall that complements cabinetry and hardware.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore suitable metallic-look designs for kitchen walls and backsplash areas, considering the colour of the cabinets, countertop, and surrounding flooring.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For example, copper-inspired tones can complement warm neutrals, while cooler metallic effects can pair well with modern cabinetry and clean-lined fittings. A more restrained finish can help maintain a balanced appearance in an open-plan kitchen.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Kitchen surfaces may be exposed to grease, food splashes, and frequent cleaning, so consider maintenance as well as appearance. Confirm that the selected product is appropriate for the intended installation and follow the manufacturer's cleaning guidance.
        </p>

        {/* Section 5: Metallic Tiles for Bathroom in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Metallic Tiles for Bathroom in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Metallic-look tiles can introduce a distinctive contemporary character to bathroom interiors. Used selectively, they can create an accent behind a vanity, highlight a decorative niche, or complement modern fittings and mirrors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          When choosing metallic tiles for bathroom applications, consider the overall colour scheme and the amount of reflective detail you want in the room. A feature wall can provide visual interest while simpler surrounding surfaces help maintain a calm, coordinated look.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For bathrooms, always check the specific product's intended application and suitability for moisture exposure. Wall tiles and floor tiles can have different requirements. For floors and wet zones, verify slip resistance, maintenance needs, and the manufacturer's installation guidance before selecting a product.
        </p>

        {/* Section 6: Copper and Rusty Metal-Look Tiles for Industrial-Inspired Design */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Copper and Rusty Metal-Look Tiles for Industrial-Inspired Design
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Metal-inspired surfaces can work particularly well in interiors that combine strong materials, clean lines, and contemporary details.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Copper-inspired and rusty-metal-look tiles can complement concrete-inspired finishes, dark fittings, timber details, and understated furniture. They can be used to create an urban aesthetic in selected residential spaces, restaurants, cafés, and other design-led interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Within the Timex Ceramic collection, the Alloy Series 1200 and Rusty Metal series are listed with copper colour options, while the Argos series includes copper among its listed colour choices. These series may be worth exploring when the design brief calls for a metal-inspired appearance.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Always review the individual product details to confirm its finish, format, intended application, and suitability for your project.
        </p>

        {/* Section 7: Designer Metallic Tiles for Residential and Commercial Projects */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Designer Metallic Tiles for Residential and Commercial Projects
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Metallic-look tiles can help establish a distinctive design language across a variety of spaces. The right product depends on the project's visual goals as well as practical requirements.
        </p>

        <ul className="space-y-3 my-5 pl-2">
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For architects and interior designers:</strong> Explore metallic colours and surface effects that complement the lighting plan, material palette, and architectural concept.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For builders and developers:</strong> Consider suitable metallic-look tiles for selected apartment interiors, show flats, lobbies, and shared spaces where a distinctive feature can enhance the design.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For hospitality projects:</strong> Explore metal-inspired surfaces for reception areas, restaurants, cafés, lounges, and other selected interiors.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm md:text-base text-[#333333]/90 leading-relaxed">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C95745] mt-2 shrink-0" />
            <span>
              <strong>For contractors and project teams:</strong> Verify dimensions, product specifications, finish, installation requirements, quantity, and maintenance guidance before finalising a tile schedule.
            </span>
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          For larger projects, review samples and confirm availability and technical information before making a final specification.
        </p>

        {/* Section 8: How to Choose the Right Metallic Finish Tile */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          How to Choose the Right Metallic Finish Tile
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Selecting metallic-look tiles is about more than choosing a colour. Consider how the surface will look, where it will be installed, and how it will perform in everyday use.
        </p>

        <div className="space-y-5 my-6">
          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              1. Decide on the application
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Identify whether you need tiles for a wall, floor, kitchen, bathroom, or commercial interior. Not every metallic-look tile is suitable for every surface.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              2. Choose the right colour
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Copper and rusty-metal tones can introduce warmth and character. Beige and grey options can work with understated palettes, while blue and green can provide a more distinctive accent.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              3. Compare glossy and matt finishes
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Glossy finishes may reflect more light, while matt finishes can create a more restrained appearance. Confirm the finish of the specific series before ordering.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              4. Consider the scale and format
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              The collection includes different formats, including rectangular and square options. Choose a format that suits the wall or floor dimensions, pattern layout, and overall design.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              5. Plan the lighting
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Reflective surfaces can appear different under natural and artificial light. Check a sample in the intended space, especially when using metallic-look tiles as a focal point.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              6. Coordinate surrounding materials
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Pair metallic-look tiles with complementary flooring, paint, cabinetry, fixtures, and furniture. Keeping the surrounding palette balanced can help the metallic detail feel intentional.
            </p>
          </div>

          <div className="bg-[#FCFBF8] border border-[#DED9D0] p-5 md:p-6 rounded-xl shadow-xs">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-2">
              7. Verify technical specifications
            </h3>
            <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed">
              Check the material, dimensions, intended application, installation instructions, and maintenance guidance. For floor and wet-area use, confirm the relevant product specifications rather than relying on appearance alone.
            </p>
          </div>
        </div>

        {/* Section 9: Discover Metallic Finish Tiles at Timex Ceramic */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Discover Metallic Finish Tiles at Timex Ceramic
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Metallic-look tiles offer an expressive way to introduce surface detail, contrast, and contemporary character into a space. From copper-inspired accents and rusty-metal effects to glossy and matt finishes in a range of colours, the Timex Ceramic collection offers ideas for distinctive residential and commercial interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Explore metallic finish tiles in India and discover metallic-look designs for living rooms, kitchens, bathrooms, dining areas, and selected project applications.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Whether you are creating a feature wall in a modern home, developing a design concept for a hospitality space, or selecting finishes for a commercial interior, Timex Ceramic can help you explore options that align with your vision.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-12">
          Browse the{" "}
          <Link
            href="/product-category/metallic/"
            className="text-[#C95745] hover:underline font-medium"
          >
            metallic tile collection
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
            Frequently Asked Questions About Metallic Finish Tiles
          </h2>

          <div className="space-y-4">
            {activeFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.includes(index);

              // Interactive links for FAQ 2 and FAQ 12
              const renderAnswer = (ans: string) => {
                if (
                  faq.question.includes("Where can I find metallic finish tiles in India?") ||
                  index === 1
                ) {
                  return (
                    <>
                      You can explore the{" "}
                      <Link
                        href="/product-category/metallic/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        metallic tile collection on the Timex Ceramic website
                      </Link>{" "}
                      and contact the team for product details and guidance on selecting suitable options for your project.
                    </>
                  );
                }
                if (
                  faq.question.includes("How can I enquire about metallic tiles at Timex Ceramic?") ||
                  index === 11
                ) {
                  return (
                    <>
                      Visit the Timex Ceramic{" "}
                      <Link
                        href="/product-category/metallic/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        metallic tile category
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/contact"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        contact the team
                      </Link>{" "}
                      for information about the collection, individual series, product specifications, and options for your residential or commercial project.
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-met-${index + 1}`}
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

