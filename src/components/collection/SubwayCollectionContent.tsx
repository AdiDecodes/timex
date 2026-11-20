"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface SubwayCollectionContentProps {
  faqs?: FaqItem[];
}

export const SUBWAY_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-sub-1",
    question: "1. What are subway tiles?",
    answer: "Subway tiles are typically rectangular tiles known for their clean geometry and classic appearance. Originally associated with early subway station interiors, they are now widely used in kitchen backsplashes, bathroom walls, accent areas and commercial interiors.",
  },
  {
    id: "faq-sub-2",
    question: "2. Where can I find subway tiles in Mumbai?",
    answer: "You can explore the subway tile collection on the Timex Ceramic website. Visit the Timex Ceramic subway tile category page to view listed designs and contact Timex Ceramic for current product details and availability.",
  },
  {
    id: "faq-sub-3",
    question: "3. Are subway tiles suitable for kitchen walls?",
    answer: "Subway tiles are a popular choice for kitchen walls and backsplashes because their rectangular format works with many interior styles. Always check the selected tile's cleaning guidance and suitability for the intended cooking-area application.",
  },
  {
    id: "faq-sub-4",
    question: "4. Which subway tiles are best for a kitchen in Mumbai?",
    answer: "The best choice depends on your kitchen's lighting, cabinetry, countertop, cooking habits and preferred style. Light-coloured tiles can create a bright look, while contrasting colours, textured designs or distinctive layouts can create a focal point.",
  },
  {
    id: "faq-sub-5",
    question: "5. Can subway tiles be used in bathrooms?",
    answer: "Yes, subway tiles can be suitable for bathroom walls when the selected product is approved for the intended application. For shower walls and other wet areas, confirm the manufacturer's installation and maintenance recommendations.",
  },
  {
    id: "faq-sub-6",
    question: "6. What are the latest subway tile design ideas?",
    answer: "Popular design approaches include classic offset layouts, horizontal or vertical stacking, herringbone arrangements, contrasting grout and colour-led feature walls. The right option depends on the tile dimensions and the look you want to achieve.",
  },
  {
    id: "faq-sub-7",
    question: "7. Are decorative subway tiles available in India?",
    answer: "Decorative subway tiles are available in the Indian market in a range of styles and formats, depending on the supplier and collection. Contact Timex Ceramic to enquire about the current designs listed in its subway tile collection.",
  },
  {
    id: "faq-sub-8",
    question: "8. What is the difference between subway tiles and regular rectangular tiles?",
    answer: "Subway tiles are a style of rectangular tile associated with a classic, elongated format and distinctive laying patterns. Regular rectangular tiles cover a broader range of dimensions, proportions and design styles, so not every rectangular tile is considered a subway tile.",
  },
  {
    id: "faq-sub-9",
    question: "9. Which colours work well for subway kitchen tiles?",
    answer: "White and other light colours offer a classic look, while green, blue, grey, black and other colour options can create a more distinctive interior. Choose a colour that complements the cabinetry, countertop, lighting and overall kitchen palette.",
  },
  {
    id: "faq-sub-10",
    question: "10. Which subway tiles are suitable for bathroom walls?",
    answer: "Choose tiles specifically recommended for bathroom wall applications and check the manufacturer's guidance for wet areas. Consider the finish, maintenance requirements, grout selection and the visual relationship with bathroom fittings.",
  },
  {
    id: "faq-sub-11",
    question: "11. What subway tile sizes should I consider?",
    answer: "Subway tiles come in different dimensions, from compact rectangular formats to longer designs. The most suitable size depends on the installation area, desired pattern, number of cuts and overall design. Check the exact dimensions on each product listing rather than assuming all subway tiles are the same size.",
  },
  {
    id: "faq-sub-12",
    question: "12. What is the best layout for subway wall tiles?",
    answer: "Traditional offset or brick-bond layouts provide a familiar subway look. Horizontal and vertical stack layouts create a more structured appearance, while herringbone arrangements introduce movement. The choice should suit the tile format and the design of the space.",
  },
  {
    id: "faq-sub-13",
    question: "13. Do subway tiles suit small kitchens and bathrooms?",
    answer: "They can work well in compact interiors when the tile size, colour, layout and grout are selected carefully. Light colours may help create a brighter visual effect, while a consistent layout can make the overall design feel more cohesive.",
  },
  {
    id: "faq-sub-14",
    question: "14. Are subway tiles suitable for commercial projects?",
    answer: "Subway tiles can be considered for selected commercial wall applications, including cafés, restaurants, retail interiors and hospitality spaces. Confirm that the specific product meets the project's cleaning, maintenance, durability and installation requirements.",
  },
  {
    id: "faq-sub-15",
    question: "15. How can I enquire about designer subway tiles in Mumbai?",
    answer: "Visit the Timex Ceramic subway tile category page and contact the team with your preferred design, application area and project requirements. Ask for current product specifications and availability before finalising your selection.",
  },
];

export function SubwayCollectionContent({ faqs }: SubwayCollectionContentProps) {
  const displayFaqs = faqs && faqs.length >= 15 ? faqs : SUBWAY_DEFAULT_FAQS;
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
          Subway Tiles in Mumbai – Decorative Subway Wall Tiles for Kitchens &amp; Bathrooms
        </h1>

        {/* Introductory Paragraphs */}
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Give your interiors a timeless look with subway tiles in Mumbai from Timex Ceramic. Known for their distinctive rectangular shape, clean lines and versatile appeal, subway tiles bring together classic charm and contemporary design. Whether you are creating a modern kitchen backsplash, an elegant bathroom, a stylish café or a statement wall in a commercial space, the right subway tile can transform an ordinary surface into a design feature.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore a curated collection of designer subway tiles in Mumbai, featuring distinctive shapes, contemporary formats and versatile styles for different interior concepts. From understated, minimal designs to decorative wall finishes, our subway tile collection offers inspiration for homeowners, architects, interior designers, builders and hospitality professionals looking to create memorable spaces.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          If you are searching for decorative subway tiles in India, subway wall tiles in Mumbai or subway tiles for kitchen and bathroom projects, discover designs that complement modern, classic, industrial and contemporary interiors.
        </p>

        {/* Section 1: Explore Subway Wall Tiles in Mumbai for Every Interior */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Subway Wall Tiles in Mumbai for Every Interior
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Subway tiles are celebrated for their simple geometry and remarkable design flexibility. Their rectangular form can create a traditional brick-style pattern, a clean contemporary grid or an eye-catching decorative surface, depending on the layout, colour and grout selection.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Our collection of subway wall tiles in Mumbai can inspire a variety of applications, including:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Kitchen backsplashes and cooking-area walls</li>
          <li className="pl-1">Bathroom walls and vanity backdrops</li>
          <li className="pl-1">Shower-area walls, subject to product suitability</li>
          <li className="pl-1">Decorative walls in living and dining spaces</li>
          <li className="pl-1">Café, restaurant and boutique retail interiors</li>
          <li className="pl-1">Feature walls for hospitality and commercial projects</li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          The appeal of subway tiles lies in their adaptability. Pair them with wood-inspired surfaces for warmth, stone finishes for a natural aesthetic, or metal accents for a contemporary industrial look.
        </p>

        {/* Section 2: Subway Tiles for Kitchen in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Subway Tiles for Kitchen in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The kitchen is one of the most versatile spaces for subway tile design. A carefully selected backsplash can complement cabinetry, countertops and fittings while adding character without overwhelming the overall interior.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Our subway tiles for kitchen in Mumbai can help you explore a variety of design directions, from bright and understated kitchens to bold, contemporary cooking spaces.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Kitchen subway tile design ideas
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Classic white subway tiles:</strong>{" "}Create a fresh, timeless backdrop that pairs beautifully with light or dark cabinetry.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contrasting grout lines:</strong>{" "}Highlight the rectangular tile pattern with a carefully selected grout colour for a more graphic appearance.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Vertical subway tile layouts:</strong>{" "}Introduce a contemporary look and draw the eye upward.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Herringbone patterns:</strong>{" "}Add movement and visual interest to a backsplash or selected feature area.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Colourful decorative subway tiles:</strong>{" "}Bring personality to modern kitchens with colour-led design choices, subject to available collection options.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When choosing subway kitchen tiles in Mumbai, consider the amount of cooking activity, cleaning requirements, lighting, cabinetry colour and the finish of nearby surfaces. Confirm the suitability of the selected tile for the intended installation area before purchase.
        </p>

        {/* Section 3: Subway Tiles for Bathroom in Mumbai */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Subway Tiles for Bathroom in Mumbai
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Create a bathroom that feels considered, cohesive and visually inviting with thoughtfully selected subway wall tiles. Their distinctive proportions work well with a variety of bathroom styles, from minimal and contemporary to vintage-inspired and boutique-hotel interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Subway tiles for bathroom in Mumbai can be used to create a coordinated look around vanity areas, selected feature walls and shower enclosures, provided the chosen product is suitable for the specific wet-area application.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-4">
          Ideas for subway bathroom tiles
        </h3>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Bright and minimal:</strong>{" "}Use light-coloured subway tiles to create a clean, understated visual effect.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Contemporary contrast:</strong>{" "}Pair darker tiles with lighter surfaces and complementary fittings.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Feature-wall styling:</strong>{" "}Use a distinctive subway tile design behind a vanity or in another focal area.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Vertical layouts:</strong>{" "}Create a streamlined appearance with vertically aligned rectangular tiles.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Decorative combinations:</strong>{" "}Combine subway tiles with complementary textures or patterns to introduce contrast.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          When selecting subway bathroom tiles in Mumbai, check the manufacturer&apos;s recommendations for water exposure, maintenance, installation and suitability for the intended surface. For bathroom floors, choose only products specifically rated for floor use and appropriate slip resistance.
        </p>

        {/* Section 4: Decorative Subway Tiles in India: Where Classic Meets Contemporary */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Decorative Subway Tiles in India: Where Classic Meets Contemporary
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Decorative subway tiles offer more than a traditional rectangular pattern. The visual effect can change significantly with the tile&apos;s colour, surface finish, edge profile, texture, proportions and installation layout.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, explore subway tile designs that can help bring individuality to residential and commercial interiors. Depending on the selected product, a subway-inspired surface can complement:
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">Modern minimalist interiors</li>
          <li className="pl-1">Vintage and retro-inspired spaces</li>
          <li className="pl-1">Industrial-style cafés and restaurants</li>
          <li className="pl-1">Contemporary apartments and villas</li>
          <li className="pl-1">Boutique retail and hospitality environments</li>
          <li className="pl-1">Accent walls and carefully designed focal points</li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For architects and interior designers sourcing decorative subway tiles in India, the key is to select a tile that supports the overall design concept while meeting the practical requirements of the space.
        </p>

        {/* Section 5: Designer Subway Tiles in Mumbai for Residential and Commercial Projects */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Designer Subway Tiles in Mumbai for Residential and Commercial Projects
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          The right tile contributes to the character of an interior. For residential projects, subway tiles can create a cohesive design language across kitchens, bathrooms and selected accent walls. For commercial spaces, they can support a distinctive visual identity in cafés, restaurants, boutique stores and hospitality interiors.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Timex Ceramic&apos;s subway tile collection is worth exploring for projects where designers want to balance a recognisable tile format with a more individual design approach.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          For architects and interior designers
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Explore subway tile proportions, colours, finishes and laying patterns that align with your material palette, design drawings and project specifications.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          For builders and developers
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Consider subway tiles for selected kitchen and bathroom wall schemes where a consistent design approach is required across residential units or project areas. Confirm product specifications and quantities before finalising procurement.
        </p>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#101B38] mt-6 mb-2">
          For hospitality and commercial projects
        </h3>
        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-6">
          Use subway tile designs to help establish a welcoming atmosphere in cafés, restaurants, boutique accommodation and retail environments. Select products based on the installation area, maintenance requirements and project performance specifications.
        </p>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          For project enquiries, contact Timex Ceramic to discuss the collection and identify options suitable for your design brief.
        </p>

        {/* Section 6: How to Choose the Right Subway Tile Design */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          How to Choose the Right Subway Tile Design
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          Selecting the right subway tile involves more than choosing a colour. Consider these factors before making your decision.
        </p>

        <ol className="space-y-3.5 my-4 pl-5 list-decimal text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">1. Understand the application.</strong>{" "}Decide whether the tile is intended for a kitchen backsplash, bathroom wall, feature wall or another surface. Confirm the product&apos;s approved applications.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">2. Choose the right proportions.</strong>{" "}Shorter rectangular formats can create a classic look, while elongated tiles can produce a more contemporary appearance. Check the actual dimensions of each product in the collection.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">3. Consider the finish.</strong>{" "}Glossy surfaces can reflect light and create a brighter appearance, while matte or textured finishes can offer a more understated visual effect. Availability varies by product.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">4. Plan the layout.</strong>{" "}Traditional offset, horizontal stack, vertical stack and herringbone arrangements create different visual results. Discuss the layout and cutting requirements with your installer.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">5. Select complementary grout.</strong>{" "}A matching grout colour creates a more continuous appearance, while contrasting grout emphasises the tile pattern. The grout joint should follow the tile manufacturer&apos;s installation recommendations.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">6. Check maintenance and technical specifications.</strong>{" "}Review cleaning instructions, moisture suitability, edge details and other relevant product information before ordering.
          </li>
        </ol>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Taking these factors into account helps ensure that the selected subway tiles meet both the design brief and the practical needs of the space.
        </p>

        {/* Section 7: Why Explore Subway Tiles at Timex Ceramic? */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Why Explore Subway Tiles at Timex Ceramic?
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-4">
          At Timex Ceramic, subway tiles are an opportunity to create interiors with lasting visual appeal. Whether your brief calls for a classic kitchen backsplash, a contemporary bathroom wall or a decorative feature in a commercial interior, the collection offers a starting point for exploring different tile styles and formats.
        </p>

        <ul className="space-y-2.5 my-4 pl-5 list-disc text-sm md:text-base text-[#333333]/90 leading-relaxed">
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Design-led selection:</strong>{" "}Explore subway tile designs for a range of interior concepts.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Versatile styling:</strong>{" "}Consider different layouts and combinations to suit your space.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Residential and commercial inspiration:</strong>{" "}Explore ideas for homes, cafés, hospitality spaces and retail interiors.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Mumbai-focused assistance:</strong>{" "}Connect with Timex Ceramic for guidance on selecting suitable options for your project.
          </li>
          <li className="pl-1">
            <strong className="font-semibold text-[#101B38]">Project-oriented selection:</strong>{" "}Discuss your application, design preferences and product requirements before finalising your choice.
          </li>
        </ul>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Discover the Timex Ceramic subway tile collection and find a design direction that complements your next interior project.
        </p>

        {/* Section 8: Explore Subway Tiles in Mumbai with Timex Ceramic */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-snug tracking-tight mt-10 md:mt-14 mb-4 border-b border-[#DED9D0] pb-3">
          Explore Subway Tiles in Mumbai with Timex Ceramic
        </h2>

        <p className="text-sm md:text-base text-[#333333]/90 font-normal leading-relaxed mb-8 md:mb-10">
          Looking for subway tiles for a kitchen, bathroom, feature wall or commercial interior? Explore the collection to compare available designs and formats. For product-specific details, dimensions, finish information and suitability for your project, contact Timex Ceramic before placing your order.
        </p>

        {/* Divider */}
        <div className="border-t border-[#DED9D0] my-8" />

        {/* FAQ Section */}
        <div className="pt-4">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] tracking-tight mb-8">
            Frequently Asked Questions About Subway Tiles
          </h2>

          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.has(index);

              // Render answer with interactive internal links where supplied
              const renderAnswer = (ans: string) => {
                if (ans.includes("Timex Ceramic subway tile category page")) {
                  const parts = ans.split("Timex Ceramic subway tile category page");
                  return (
                    <>
                      {parts[0]}
                      <Link
                        href="/product-category/subway/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Timex Ceramic subway tile category page
                      </Link>
                      {parts[1]}
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-sub-${index + 1}`}
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

