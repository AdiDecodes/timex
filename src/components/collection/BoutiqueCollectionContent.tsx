"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, CheckCircle2 } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface BoutiqueCollectionContentProps {
  faqs?: FaqItem[];
}

export const BOUTIQUE_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-btq-1",
    question: "1. What are boutique tiles?",
    answer:
      "Boutique tiles are decorative tiles selected for their distinctive colours, patterns, shapes, textures or finishes. They are often used to add individuality to kitchens, bathrooms, living rooms, hospitality interiors and other design-led spaces.",
  },
  {
    id: "faq-btq-2",
    question: "2. Where can I find boutique tiles in Mumbai?",
    answer:
      "You can explore boutique tile designs through Timex Ceramic's online boutique tile collection. Review the available products and contact the team to confirm specifications, current availability and suitability for your project.",
  },
  {
    id: "faq-btq-3",
    question: "3. What makes boutique tiles different from regular tiles?",
    answer:
      "Boutique tiles typically emphasise distinctive design features such as unusual shapes, decorative patterns, expressive colours or vintage-inspired finishes. They can serve as a focal point or complement simpler background tiles.",
  },
  {
    id: "faq-btq-4",
    question: "4. What types of boutique tile designs are available?",
    answer:
      "Boutique tile designs can include vintage, rustic, contemporary, geometric and decorative styles, depending on the collection. Shapes may include rectangles, squares and more distinctive decorative formats.",
  },
  {
    id: "faq-btq-5",
    question: "5. Which boutique tiles are suitable for kitchens in Mumbai?",
    answer:
      "Choose tiles specifically approved for the intended kitchen application. Decorative wall tiles can work well for backsplashes and selected feature walls, while kitchen floors require products rated for floor use and the expected traffic.",
  },
  {
    id: "faq-btq-6",
    question: "6. Can boutique tiles be used for kitchen backsplashes?",
    answer:
      "Yes, suitable boutique wall tiles can create a distinctive kitchen backsplash. Consider cleaning requirements, grease exposure, grout maintenance and the tile's compatibility with the installation location.",
  },
  {
    id: "faq-btq-7",
    question: "7. Which boutique tiles are suitable for bathrooms in Mumbai?",
    answer:
      "Boutique ceramic and porcelain tiles may be suitable for selected bathroom wall applications, depending on their specifications. For shower walls and other wet areas, verify moisture suitability and use an appropriate waterproofing system.",
  },
  {
    id: "faq-btq-8",
    question: "8. Are boutique tiles suitable for bathroom floors?",
    answer:
      "Some boutique tiles are designed for flooring, but not all decorative wall tiles are suitable for floors. Check the product's floor-use rating, durability and slip resistance before installation.",
  },
  {
    id: "faq-btq-9",
    question: "9. Are imported boutique tiles available in Mumbai?",
    answer:
      "Availability depends on the current collection and stock. Contact Timex Ceramic to confirm the imported designs available and request the relevant product specifications and country-of-origin details.",
  },
  {
    id: "faq-btq-10",
    question: "10. What are European boutique tiles?",
    answer:
      "European boutique tiles are tiles originating from European manufacturers or collections, often associated with particular design traditions and aesthetics. Confirm the actual origin of an individual product rather than assuming that every European-inspired design is European-made.",
  },
  {
    id: "faq-btq-11",
    question: "11. Are boutique tiles suitable for cafés and restaurants?",
    answer:
      "Yes, suitable boutique tiles can be used for café feature walls, restaurant interiors, decorative counters and selected hospitality surfaces. Select products according to traffic, cleaning requirements and the intended application.",
  },
  {
    id: "faq-btq-12",
    question: "12. Can boutique tiles be used in hotels and spa interiors?",
    answer:
      "Suitable boutique tiles can be specified for hotel bathrooms, reception areas, decorative walls and selected spa or wellness spaces. Verify wet-area suitability, cleaning requirements and the appropriate installation system for each location.",
  },
  {
    id: "faq-btq-13",
    question: "13. What colours are available in boutique tiles?",
    answer:
      "Depending on the collection, boutique tiles may feature beige, white, blue, green, red, orange, cotto-inspired, copper, olive and gold tones. Check the current catalogue for the colours available in individual designs.",
  },
  {
    id: "faq-btq-14",
    question: "14. Are glossy boutique tiles better than matte tiles?",
    answer:
      "Neither finish is universally better. Glossy tiles provide a more reflective appearance, while matte finishes offer a softer visual effect. Choose according to the intended application, lighting, maintenance requirements and design style.",
  },
  {
    id: "faq-btq-15",
    question: "15. What are rustic boutique tiles used for?",
    answer:
      "Rustic boutique tiles can introduce earthy character and a natural-inspired aesthetic to suitable residential and commercial interiors. They may be considered for feature walls, selected floors and hospitality spaces, depending on the product's technical specifications.",
  },
  {
    id: "faq-btq-16",
    question: "16. Are small-format boutique tiles suitable for modern interiors?",
    answer:
      "Yes, small-format boutique tiles can create detailed patterns and distinctive decorative surfaces. They work well when their colour, shape and layout are coordinated with the surrounding finishes.",
  },
  {
    id: "faq-btq-17",
    question: "17. Can boutique tiles be used outdoors?",
    answer:
      "Some boutique tiles are approved for exterior applications, including selected balcony, terrace and outdoor wall installations. Confirm exterior suitability, slip resistance where relevant and the recommended fixing system before installation.",
  },
  {
    id: "faq-btq-18",
    question: "18. How do I choose boutique tiles for a luxury interior?",
    answer:
      "Start with the interior concept, colour palette and intended application. Compare shapes, patterns, finishes and materials, and select a design that complements the architecture without competing with other visual elements.",
  },
  {
    id: "faq-btq-19",
    question: "19. Are boutique tiles easy to maintain?",
    answer:
      "Maintenance depends on the material, finish and grout. Follow the manufacturer's cleaning recommendations and select products suited to the expected use and exposure conditions.",
  },
  {
    id: "faq-btq-20",
    question: "20. How can I enquire about boutique tiles at Timex Ceramic?",
    answer:
      "Visit the Timex Ceramic boutique tile category page to explore the collection. Contact the team with your preferred design, intended application, project location and approximate quantity to discuss suitable products and availability.",
  },
];

export function BoutiqueCollectionContent({ faqs }: BoutiqueCollectionContentProps) {
  const activeFaqs = faqs && faqs.length >= 20 ? faqs : BOUTIQUE_DEFAULT_FAQS;
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="w-full mt-20 border-t border-[#DED9D0] bg-[#EDEAE4] py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-16 relative z-10 text-[#101B38]">
        {/* Main Header & Intro */}
        <div className="space-y-6 text-center md:text-left max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101B38]/5 border border-[#101B38]/10 text-xs font-medium tracking-wide uppercase text-[#101B38]">
            <Sparkles className="w-3.5 h-3.5 text-[#C95745]" />
            Exclusive Designer Series
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#101B38] leading-tight tracking-tight">
            Boutique Tiles in Mumbai for Distinctive Designer Interiors
          </h1>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed">
            <p>
              Some interiors stand out not because they follow trends, but because every detail feels thoughtfully chosen. Boutique tiles bring that sense of individuality to a space through distinctive shapes, expressive colours, decorative patterns and carefully considered finishes.
            </p>
            <p>
              At Timex Ceramic, explore boutique tiles in Mumbai for interiors that deserve more than an ordinary wall or floor finish. From European-inspired designs and vintage aesthetics to contemporary glossy surfaces and rustic textures, boutique tiles offer creative possibilities for homes, cafés, restaurants, hotels and other design-led spaces.
            </p>
            <p>
              Whether you are planning a statement kitchen backsplash, a distinctive bathroom, a welcoming café interior or an elegant living-room feature, the right tile can establish the mood of the entire space.
            </p>
            <p>
              Discover designer boutique tiles in Mumbai that complement your architectural vision, from subtle beige and white palettes to expressive blues, greens, reds, copper tones and decorative geometric shapes.
            </p>
          </div>
        </div>

        {/* Section 1: Explore Designer Boutique Tile Designs in Mumbai */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Explore Designer Boutique Tile Designs in Mumbai
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Boutique tiles are chosen for their distinctive design character. Unlike conventional background tiles, they can introduce an individual touch through unusual shapes, decorative details, colour combinations and finishes that make a surface memorable.
            </p>
            <p>
              For architects and interior designers, they provide an opportunity to introduce personality without relying entirely on furniture or accessories. For homeowners, they offer a way to create a space that feels personal, considered and visually engaging.
            </p>
            <p className="font-semibold text-[#101B38] pt-2">
              Explore boutique tile designs in Mumbai across a range of styles:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              {
                title: "Vintage boutique tiles",
                description:
                  "Bring nostalgic character and timeless appeal to kitchens, bathrooms, cafés and hospitality interiors.",
              },
              {
                title: "Rustic boutique tiles",
                description:
                  "Introduce earthy textures and relaxed, natural-inspired aesthetics.",
              },
              {
                title: "Contemporary boutique tiles",
                description:
                  "Complement modern interiors with distinctive colours, shapes and clean design details.",
              },
              {
                title: "Decorative boutique tiles",
                description:
                  "Create visual interest on selected walls, backsplashes, niches and feature areas.",
              },
              {
                title: "Glossy boutique tiles",
                description:
                  "Add a polished appearance and reflect available light on suitable interior surfaces.",
              },
              {
                title: "Matte boutique tiles",
                description:
                  "Offer a softer, understated finish for contemporary and rustic-inspired spaces.",
              },
              {
                title: "Handmade-look boutique tiles",
                description:
                  "Explore available designs with artisanal-inspired character and surface variation.",
              },
              {
                title: "European boutique tiles",
                description:
                  "Discover European-inspired design aesthetics for distinctive residential and commercial interiors.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FCFBF8] border border-[#DED9D0] rounded-xl p-5 shadow-sm hover:border-[#101B38]/30 transition-all flex flex-col justify-start"
              >
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C95745] mt-2 shrink-0" />
                  <p className="text-base text-[#333333]/90 leading-relaxed">
                    <strong className="text-[#101B38] font-semibold">{item.title}:</strong>{" "}
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed pt-2 max-w-5xl">
            From understated elegance to bold decorative statements, boutique tiles allow you to create interiors that feel unique to the people and purpose behind them.
          </p>
        </div>

        {/* Section 2: European Boutique Tiles for Timeless Interiors */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            European Boutique Tiles for Timeless Interiors
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              European-inspired tile design often draws its appeal from a balance of craftsmanship-inspired detail, colour, texture and architectural character. These qualities can complement both traditional and contemporary interiors.
            </p>
            <p>
              Timex Ceramic's boutique tile category includes European tile options across a variety of design directions, materials and finishes, according to the supplied collection attributes.
            </p>
            <p className="font-semibold text-[#101B38] pt-2">
              Consider European-inspired boutique tiles for:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              "Elegant kitchen backsplashes and dining areas.",
              "Characterful bathroom walls and decorative niches.",
              "Boutique cafés, restaurants and hospitality interiors.",
              "Living-room accent walls and selected floor applications.",
              "Decorative entrance areas and architectural features.",
              "Selected balconies and outdoor spaces using suitable products.",
            ].map((text, idx) => (
              <div
                key={idx}
                className="bg-[#FCFBF8] border border-[#DED9D0] rounded-xl p-4 shadow-sm flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#C95745] shrink-0 mt-0.5" />
                <p className="text-sm md:text-base text-[#333333]/90 leading-relaxed font-normal">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed pt-2 max-w-5xl">
            <p>
              Beige, white and earthy cotto-inspired colours can create a warm, understated atmosphere. Blue and green shades introduce freshness, while copper, gold and other expressive tones can add a distinctive decorative accent.
            </p>
            <p>
              When selecting imported boutique tiles in Mumbai, confirm the country of origin, product specifications and current availability of the individual design.
            </p>
          </div>
        </div>

        {/* Section 3: Boutique Tiles for Kitchens in Mumbai */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Boutique Tiles for Kitchens in Mumbai
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              The kitchen is one of the most rewarding spaces for decorative tile design. A carefully selected backsplash or feature wall can bring together cabinetry, countertops, lighting and hardware while giving the room its own personality.
            </p>
            <p>
              Boutique tiles for kitchens in Mumbai offer options for interiors ranging from minimalist urban apartments to warm, eclectic homes and premium residences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {[
              {
                title: "Kitchen Backsplashes with Character",
                content:
                  "Create a visual focal point behind the countertop with decorative rectangular tiles, vintage-inspired designs or expressive colour combinations. Glossy surfaces can complement contemporary kitchens, while rustic finishes may suit natural wood and earthy materials.",
              },
              {
                title: "Colourful Kitchen Tile Designs",
                content:
                  "Blue and green boutique tiles bring a fresh, inviting feel to kitchen walls. Red, orange or gold-toned tiles can create warmth and visual energy, particularly when paired with neutral cabinetry.",
              },
              {
                title: "Breakfast Counters and Dining Areas",
                content:
                  "Extend the design narrative to kitchen islands, breakfast bar fronts or dining-room feature walls using complementary boutique tile patterns.",
              },
              {
                title: "Choosing Tiles for Everyday Kitchen Use",
                content:
                  "Select tiles that are practical for daily kitchen life. Wall tiles are generally appropriate for backsplashes, but confirm heat resistance near cooktops, ease of cleaning and appropriate grout specification.",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-[#FCFBF8] border border-[#DED9D0] rounded-xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm md:text-base text-[#333333]/90 leading-relaxed font-normal">
                    {card.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Boutique Bathroom Tiles in Mumbai for a Distinctive Finish */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Boutique Bathroom Tiles in Mumbai for a Distinctive Finish
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Bathrooms offer a natural setting for boutique tile designs. Their smaller surfaces, architectural niches and defined zones make it possible to introduce decorative details without overwhelming the room.
            </p>
            <p>
              If you are exploring boutique tiles for bathrooms in Mumbai, consider how the tile pattern, colour and finish will work with the vanity, mirror, fittings, lighting and main wall tiles.
            </p>
            <p className="font-semibold text-[#101B38] pt-2">
              Ideas for boutique bathroom tiles include:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              {
                title: "Vanity backdrops",
                description: "Add character to the wall behind the washbasin or mirror.",
              },
              {
                title: "Decorative niches",
                description: "Use a distinctive pattern to highlight recessed shelves and storage areas.",
              },
              {
                title: "Shower-area walls",
                description:
                  "Introduce a contrasting design using tiles approved for the intended wet-area application.",
              },
              {
                title: "Vintage-inspired bathrooms",
                description:
                  "Pair decorative tiles with warm metals, soft lighting and complementary finishes.",
              },
              {
                title: "Contemporary bathroom interiors",
                description:
                  "Combine modern boutique tiles with restrained colours and streamlined fittings.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FCFBF8] border border-[#DED9D0] rounded-xl p-5 shadow-sm flex items-start gap-3"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#C95745] mt-2 shrink-0" />
                <p className="text-base text-[#333333]/90 leading-relaxed">
                  <strong className="text-[#101B38] font-semibold">{item.title}:</strong>{" "}
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed pt-2 max-w-5xl">
            <p>
              For a calm and timeless bathroom, consider beige, white or muted green tones. For a more expressive interior, blue, red or decorative geometric designs can create a focal point.
            </p>
            <p>
              Always verify the tile's suitability for the intended wet area. Bathroom flooring and shower floors require products with appropriate floor-use and slip-resistance characteristics, along with a properly specified waterproofing and installation system.
            </p>
          </div>
        </div>

        {/* Section 5: Decorative Boutique Tiles for Living Rooms and Dining Areas */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Decorative Boutique Tiles for Living Rooms and Dining Areas
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              A distinctive tile can transform a selected wall or floor into a defining feature of the interior. In living rooms and dining spaces, boutique tiles can introduce colour, texture and pattern while complementing the wider design scheme.
            </p>
            <p className="font-semibold text-[#101B38] pt-2">
              Consider decorative boutique tiles for:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              "Living-room feature walls and architectural niches.",
              "Selected dining-area walls.",
              "Decorative entrance spaces.",
              "Feature areas around built-in furniture.",
              "Suitable living-room or dining-room floor applications.",
              "Transitional spaces connecting the kitchen and living areas.",
            ].map((text, idx) => (
              <div
                key={idx}
                className="bg-[#FCFBF8] border border-[#DED9D0] rounded-xl p-4 shadow-sm flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#C95745] shrink-0 mt-0.5" />
                <p className="text-sm md:text-base text-[#333333]/90 leading-relaxed font-normal">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed pt-2 max-w-5xl">
            <p>
              For a sophisticated interior, pair decorative tiles with natural wood, neutral upholstery and carefully planned lighting. If the design itself is colourful or intricate, keep surrounding finishes relatively restrained to let the tile become the focal point.
            </p>
            <p>
              Before specifying boutique tiles for floors, confirm that the individual product is designed for floor use and meets the expected traffic and maintenance requirements.
            </p>
          </div>
        </div>

        {/* Section 6: Boutique Tiles for Cafés, Restaurants and Hotels */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Boutique Tiles for Cafés, Restaurants and Hotels
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              In hospitality and commercial interiors, the details contribute to the overall guest experience. Boutique tiles can help establish a distinctive atmosphere, reinforce an interior concept and create memorable spaces that feel different from conventional commercial environments.
            </p>
            <p className="font-semibold text-[#101B38] pt-2">
              For architects, designers, developers and hospitality project teams, boutique tile designs can be considered for:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              "Café counters and selected feature walls.",
              "Restaurant dining areas and decorative backdrops.",
              "Hotel reception areas and boutique hospitality interiors.",
              "Hotel bathrooms and vanity walls.",
              "Bar fronts and selected service areas.",
              "Spa and wellness interiors using suitable products.",
              "Selected commercial floors and outdoor areas where approved.",
            ].map((text, idx) => (
              <div
                key={idx}
                className="bg-[#FCFBF8] border border-[#DED9D0] rounded-xl p-4 shadow-sm flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#C95745] shrink-0 mt-0.5" />
                <p className="text-sm md:text-base text-[#333333]/90 leading-relaxed font-normal">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed pt-2 max-w-5xl">
            <p>
              Vintage-inspired tiles can complement relaxed cafés, while glossy decorative designs can work well in contemporary hospitality spaces. Rustic finishes and earthy colours may suit nature-inspired restaurants and boutique hotels.
            </p>
            <p>
              Because hospitality spaces experience higher foot traffic and more frequent cleaning, evaluate every tile's technical suitability, slip resistance, abrasion resistance and maintenance requirements before making a final selection.
            </p>
          </div>
        </div>

        {/* Section 7: Discover Boutique Tile Colours, Shapes and Finishes */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Discover Boutique Tile Colours, Shapes and Finishes
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Boutique tile design is characterised by variety. A thoughtful combination of colour, format and finish can define the character of an entire room.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[
              {
                title: "Beige, White and Cotto-Inspired Boutique Tiles",
                content:
                  "These colours offer warmth and versatility. They can complement natural wood, stone-inspired finishes, neutral furniture and interiors that favour understated elegance.",
              },
              {
                title: "Blue and Green Boutique Tiles",
                content:
                  "Blue and green tiles can introduce freshness and visual depth to kitchens, bathrooms, cafés and selected feature walls. They work particularly well when coordinated with complementary fittings and a considered colour palette.",
              },
              {
                title: "Red, Orange and Gold Decorative Tiles",
                content:
                  "Expressive colours can create a memorable accent in hospitality interiors, decorative niches and selected residential walls. Use them strategically to balance visual impact with the rest of the space.",
              },
              {
                title: "Copper and Olive Finishes",
                content:
                  "Copper-inspired tones and olive shades can add depth to contemporary, vintage-inspired and nature-led interiors. Coordinate them with surrounding materials to achieve a cohesive finish.",
              },
              {
                title: "Glossy, Matte, Vintage and Rustic Finishes",
                content:
                  "Glossy tiles offer a polished appearance, while matte surfaces create a more subdued effect. Vintage and rustic finishes can introduce a sense of character and visual variation. Confirm the actual surface finish and care requirements for each product.",
              },
              {
                title: "Rectangle, Square, Petal and Kite Shapes",
                content:
                  "Rectangular and square tiles offer versatile layout possibilities. More distinctive petal, kite and decorative shapes can create expressive patterns and architectural details. The final appearance depends on the selected format, grout colour and installation layout.",
              },
              {
                title: "Small-Format Boutique Tiles",
                content:
                  "Small-format tiles are useful for intricate designs, decorative borders and carefully composed feature areas. They can also create distinctive surfaces across larger areas when the pattern and layout are planned appropriately.",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-[#FCFBF8] border border-[#DED9D0] rounded-xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm md:text-base text-[#333333]/90 leading-relaxed font-normal">
                    {card.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed pt-2 max-w-5xl">
            Always verify the actual dimensions, recommended layout and installation requirements of the chosen tile.
          </p>
        </div>

        {/* Section 8: Boutique Tiles for Balconies and Outdoor Spaces */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Boutique Tiles for Balconies and Outdoor Spaces
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Boutique tile designs can extend beyond indoor interiors to selected balconies, terraces and outdoor architectural features. Rustic textures, earthy colours and geometric patterns can help create a visual connection between indoor and outdoor spaces.
            </p>
            <p>
              For outdoor applications, choose products specifically approved for the intended exposure and installation location.
            </p>
            <p className="font-semibold text-[#101B38] pt-2">
              Before selecting boutique tiles for balconies or terraces, evaluate:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              "Resistance to the expected weather and moisture exposure.",
              "Suitability for exterior wall or floor installation.",
              "Slip resistance for walkable surfaces.",
              "Drainage, substrate preparation and waterproofing requirements.",
              "Compatibility with the specified adhesive, grout and fixing system.",
            ].map((text, idx) => (
              <div
                key={idx}
                className="bg-[#FCFBF8] border border-[#DED9D0] rounded-xl p-4 shadow-sm flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#C95745] shrink-0 mt-0.5" />
                <p className="text-sm md:text-base text-[#333333]/90 leading-relaxed font-normal">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <p className="text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed pt-2 max-w-5xl">
            A tile that works beautifully on an indoor wall is not automatically suitable for an exposed balcony floor or exterior façade. Product-specific technical guidance should determine the final choice.
          </p>
        </div>

        {/* Section 9: Why Explore Boutique Tiles at Timex Ceramic? */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Why Explore Boutique Tiles at Timex Ceramic?
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Choosing boutique tiles is about finding a design that reflects the character of your project. The right selection should work with the architecture, surrounding materials and intended use of the space.
            </p>
            <p>
              At Timex Ceramic, explore boutique tile designs for distinctive residential interiors, hospitality settings and selected commercial applications.
            </p>
            <p className="font-semibold text-[#101B38] pt-2">
              Whether you are a homeowner planning a renovation, an architect developing a material palette, an interior designer sourcing decorative finishes or a contractor coordinating a project, consider the following when making your selection:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              "Identify the intended space and application.",
              "Compare colours, shapes, patterns and surface finishes.",
              "Coordinate the tile with flooring, furniture, lighting and fittings.",
              "Confirm material specifications and technical suitability.",
              "Review dimensions, installation requirements and quantity calculations.",
              "Verify product origin and current availability where relevant.",
            ].map((text, idx) => (
              <div
                key={idx}
                className="bg-[#FCFBF8] border border-[#DED9D0] rounded-xl p-4 shadow-sm flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#C95745] shrink-0 mt-0.5" />
                <p className="text-sm md:text-base text-[#333333]/90 leading-relaxed font-normal">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <p className="text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed pt-2 max-w-5xl">
            For project-specific enquiries,{" "}
            <Link href="/contact" className="text-[#C95745] hover:underline font-medium">
              contact Timex Ceramic
            </Link>{" "}
            to discuss your requirements and explore suitable designs from the available{" "}
            <Link
              href="/product-category/boutique/"
              className="text-[#C95745] hover:underline font-medium"
            >
              boutique tile collection
            </Link>
            .
          </p>
        </div>

        {/* Section 10: Discover Luxury Boutique Tiles in Mumbai at Timex Ceramic */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Discover Luxury Boutique Tiles in Mumbai at Timex Ceramic
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p className="font-semibold text-[#101B38]">
              Looking for luxury boutique tiles in Mumbai to create interiors with a distinctive design identity?
            </p>
            <p>
              Explore European-inspired decorative tiles for kitchens, bathrooms, living rooms, cafés, restaurants, hotels and selected outdoor spaces. From vintage-inspired surfaces and rustic textures to contemporary colours and distinctive geometric shapes, boutique tiles offer creative ways to make every detail count.
            </p>
            <p>
              Discover the Timex Ceramic{" "}
              <Link
                href="/product-category/boutique/"
                className="text-[#C95745] hover:underline font-medium"
              >
                boutique tile collection
              </Link>{" "}
              and{" "}
              <Link href="/contact" className="text-[#C95745] hover:underline font-medium">
                enquire
              </Link>{" "}
              about product specifications, availability and suitable options for your next residential or commercial project.
            </p>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-8 pt-6 border-t border-[#DED9D0]">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] leading-tight tracking-tight mb-8">
            Frequently Asked Questions About Boutique Tiles
          </h2>

          <div className="space-y-4">
            {activeFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.includes(index);

              // Interactive links for FAQ 2 and FAQ 20
              const renderAnswer = (ans: string) => {
                if (
                  faq.question.includes("Where can I find boutique tiles in Mumbai?") ||
                  index === 1
                ) {
                  return (
                    <>
                      You can explore boutique tile designs through Timex Ceramic's{" "}
                      <Link
                        href="/product-category/boutique/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        online boutique tile collection
                      </Link>
                      . Review the available products and{" "}
                      <Link
                        href="/contact"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        contact the team
                      </Link>{" "}
                      to confirm specifications, current availability and suitability for your project.
                    </>
                  );
                }
                if (
                  faq.question.includes("How can I enquire about boutique tiles at Timex Ceramic?") ||
                  index === 19
                ) {
                  return (
                    <>
                      Visit the Timex Ceramic{" "}
                      <Link
                        href="/product-category/boutique/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        boutique tile category page
                      </Link>{" "}
                      to explore the collection.{" "}
                      <Link
                        href="/contact"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Contact the team
                      </Link>{" "}
                      with your preferred design, intended application, project location and approximate quantity to discuss suitable products and availability.
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-btq-${index + 1}`}
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

