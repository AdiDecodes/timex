"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, CheckCircle2 } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface FrenchFramesCollectionContentProps {
  faqs?: FaqItem[];
}

export const FRENCH_FRAMES_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-ff-1",
    question: "1. What are French frame tiles?",
    answer:
      "French frame tiles are decorative tiles inspired by the framed panels and structured detailing associated with French-style interiors. They can help create a panel-inspired appearance on selected walls.",
  },
  {
    id: "faq-ff-2",
    question: "2. Where can I find French frame tiles in Mumbai?",
    answer:
      "You can explore the French Frames category on the Timex Ceramic website at https://www.timexceramic.com/product-category/french-frames/. Contact Timex Ceramic to confirm current designs, availability and product specifications.",
  },
  {
    id: "faq-ff-3",
    question: "3. What are French frame wall tiles used for?",
    answer:
      "French frame wall tiles are generally selected for decorative wall applications, such as living rooms, bedrooms, dining areas and suitable bathroom walls. Confirm the intended use of the specific product before installation.",
  },
  {
    id: "faq-ff-4",
    question: "4. Are French frame tiles available in India?",
    answer:
      "Timex Ceramic has a French Frames category on its website for customers exploring these designs in India. For current stock, delivery coverage and product availability, contact the company directly.",
  },
  {
    id: "faq-ff-5",
    question: "5. What are French wainscoting tiles?",
    answer:
      "French wainscoting tiles are tiles used to achieve a wall design inspired by traditional French wainscoting or decorative wall panelling. The exact effect depends on the tile pattern, layout and installation details.",
  },
  {
    id: "faq-ff-6",
    question: "6. Can French frame tiles be used as French wall panel tiles?",
    answer:
      "Yes, French frame-inspired tiles can be considered for panel-style decorative wall designs. The finished look depends on the product design, placement, grout and overall wall layout.",
  },
  {
    id: "faq-ff-7",
    question: "7. Are French frame tiles suitable for living rooms?",
    answer:
      "They can be considered for living room feature walls and decorative wall areas. Choose the colour and layout to complement the furniture, lighting and other finishes in the room.",
  },
  {
    id: "faq-ff-8",
    question: "8. Can French frame tiles be used in bedrooms?",
    answer:
      "Yes, suitable French frame wall tiles can be considered for bedroom accent walls. Plan the design around the bed, headboard, lighting and overall colour palette.",
  },
  {
    id: "faq-ff-9",
    question: "9. Are French frame tiles suitable for bathrooms?",
    answer:
      "Some ceramic wall tiles may be suitable for bathroom walls, depending on the product specifications. Confirm wet-area suitability and installation requirements before purchasing.",
  },
  {
    id: "faq-ff-10",
    question: "10. What colours are available in French frame tiles?",
    answer:
      "The listed French Frames collection includes colour options such as white, beige, green, blue and red. Exact shades and availability may vary by product.",
  },
  {
    id: "faq-ff-11",
    question: "11. Do French frame tiles come in a matte finish?",
    answer:
      "The supplied French Frames collection details include matte-finish options. Confirm the finish of the individual design you intend to purchase.",
  },
  {
    id: "faq-ff-12",
    question: "12. What shapes and sizes are available?",
    answer:
      "The supplied collection details identify rectangular, medium-format ceramic wall tiles. Check individual product listings or contact Timex Ceramic to confirm exact dimensions and available variations.",
  },
  {
    id: "faq-ff-13",
    question: "13. Are French frame tiles suitable for modern interiors?",
    answer:
      "Yes, they can complement modern interiors when used thoughtfully. Pair frame-inspired detailing with simple furniture, balanced colours and restrained decorative elements for a contemporary interpretation.",
  },
  {
    id: "faq-ff-14",
    question: "14. Can French frame tiles be used in hotels or restaurants?",
    answer:
      "They may be considered for suitable decorative wall applications in hospitality projects. Project buyers should confirm the product's technical specifications, maintenance requirements, availability and suitability for the intended commercial environment.",
  },
  {
    id: "faq-ff-15",
    question: "15. Are French frame tiles the same as traditional wall panelling?",
    answer:
      "No. Traditional wall panelling is often created using materials and profiles such as wood, mouldings or other architectural components. French frame tiles offer a tiled alternative with a panel-inspired visual effect, but the final appearance will differ.",
  },
  {
    id: "faq-ff-16",
    question: "16. How do I choose the right colour for French frame wall tiles?",
    answer:
      "Choose a colour based on the room's lighting, dimensions, furniture and surrounding materials. White and beige can create a softer look, while green, blue and red can provide stronger accents. Viewing a physical sample is recommended.",
  },
  {
    id: "faq-ff-17",
    question: "17. How should French frame tiles be maintained?",
    answer:
      "Follow the manufacturer's cleaning and maintenance instructions for the specific product. Use suitable cleaning products and avoid abrasive methods unless the manufacturer confirms they are appropriate.",
  },
  {
    id: "faq-ff-18",
    question: "18. Are French frame tiles suitable for floors?",
    answer:
      "The supplied French Frames collection is listed for wall use. Do not assume it is suitable for flooring; check the product's technical specifications for confirmation.",
  },
  {
    id: "faq-ff-19",
    question: "19. How can architects and interior designers specify French frame tiles for projects?",
    answer:
      "Review the design, dimensions, colour, finish, installation method, quantities, lead time and application suitability. Request current product information from Timex Ceramic before finalising project specifications.",
  },
  {
    id: "faq-ff-20",
    question: "20. How can I enquire about French frame tiles at Timex Ceramic?",
    answer:
      "Visit the Timex Ceramic french frame tile category page to explore the collection, then contact Timex Ceramic to ask about current designs, specifications, availability and project requirements.",
  },
];

export function FrenchFramesCollectionContent({ faqs }: FrenchFramesCollectionContentProps) {
  const activeFaqs = faqs && faqs.length >= 20 ? faqs : FRENCH_FRAMES_DEFAULT_FAQS;
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
            Classic European Elegance
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#101B38] leading-tight tracking-tight">
            French Frame Tiles in Mumbai for Timeless European Elegance
          </h1>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed">
            <p>
              Bring the charm of classic European interiors into your space with French frame tiles in Mumbai from Timex Ceramic. Inspired by the refined proportions and decorative detailing of traditional French wall panels, these tiles offer a distinctive way to create elegant, structured interiors with a contemporary touch.
            </p>
            <p>
              French frame wall tiles are an excellent choice for spaces where the walls deserve more than a simple finish. Their framed, panel-inspired appearance can introduce visual depth, balanced proportions and a sophisticated design language to living rooms, bedrooms, bathrooms and dining areas. Whether you are planning a luxurious home, a boutique hospitality space or a thoughtfully designed apartment, French-inspired wall detailing can help create an interior that feels polished and individual.
            </p>
            <p>
              Timex Ceramic brings together European-inspired tile designs in versatile shades such as white, beige, green, blue and red. With a matte finish, rectangular shapes and medium-format options represented in the collection, these tiles offer creative possibilities for designers and homeowners looking to build a distinctive interior scheme.
            </p>
            <p>
              If you are searching for French frame tiles in Mumbai or exploring designer European wall tiles in India, discover styles that complement both classic aesthetics and modern architectural concepts.
            </p>
          </div>
        </div>

        {/* Section 1: What Are French Frame Tiles? */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            What Are French Frame Tiles?
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              French frame tiles are decorative wall tiles inspired by the framed panels and balanced detailing often seen in traditional French interiors. Their visual appeal lies in the way they introduce structure and rhythm to a wall, creating a panelled look that feels considered rather than plain.
            </p>
            <p>
              Often associated with French-inspired interiors, these designs can work beautifully in spaces that call for understated luxury, architectural character or a decorative focal point. Depending on the selected pattern and installation layout, French frame wall tiles can complement classic, transitional, contemporary and boutique-inspired interiors.
            </p>
            <p>
              Unlike ordinary plain wall finishes, a frame-inspired tile design can help define a feature wall or create a coordinated backdrop for furniture, lighting and decorative accessories.
            </p>
          </div>
        </div>

        {/* Section 2: Explore French Frame Wall Tiles in Mumbai */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Explore French Frame Wall Tiles in Mumbai
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Choosing the right wall tile involves more than selecting a colour. The pattern, proportions, finish and surrounding materials all contribute to the overall atmosphere of a room.
            </p>
            <p>
              At Timex Ceramic, explore French frame tile designs that can be considered for different interior styles:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {[
              {
                title: "1. White French Frame Tiles for Refined Interiors",
                paragraphs: [
                  "White French frame tiles offer a clean, timeless look that pairs naturally with neutral colour schemes, decorative lighting and understated furnishings. They can help create a bright, balanced backdrop in living rooms, bedrooms and dining spaces.",
                  "Consider white designs for interiors where you want decorative detail without making the wall feel visually heavy.",
                ],
              },
              {
                title: "2. Beige French Frame Tiles for Warm, Elegant Spaces",
                paragraphs: [
                  "Beige French frame wall tiles bring warmth and subtle sophistication to an interior. They work well with natural wood tones, cream upholstery, warm metals and earthy accessories.",
                  "For homeowners and designers creating welcoming residential interiors, beige can be a versatile starting point for a coordinated material palette.",
                ],
              },
              {
                title: "3. Green French Frame Tiles for Character and Depth",
                paragraphs: [
                  "Green French frame tiles can introduce colour while maintaining a composed, design-led appearance. Depending on the shade and surrounding finishes, green may complement contemporary interiors, nature-inspired spaces or traditional European-inspired schemes.",
                  "Use green as a feature-wall colour or coordinate it with neutral surfaces for a balanced result.",
                ],
              },
              {
                title: "4. Blue French Frame Tiles for Distinctive Feature Walls",
                paragraphs: [
                  "Blue French frame wall tiles can create a memorable visual accent in carefully planned interiors. They can be paired with white, beige, stone-look surfaces or complementary decorative elements to create contrast without overwhelming the space.",
                  "The final effect will depend on the selected shade, tile layout, lighting and room proportions.",
                ],
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
                  <div className="space-y-3 text-sm md:text-base text-[#333333]/90 leading-relaxed font-normal">
                    {card.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 5th Card Full Width */}
          <div className="bg-[#FCFBF8] border border-[#DED9D0] rounded-xl p-6 shadow-sm">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] mb-3">
              5. Red French Frame Tiles for Bold Design Statements
            </h3>
            <div className="space-y-3 text-sm md:text-base text-[#333333]/90 leading-relaxed font-normal max-w-5xl">
              <p>
                Red French frame tiles offer an expressive option for interiors that benefit from a stronger accent. Used thoughtfully, they can add personality to a feature wall or a selected decorative area.
              </p>
              <p>
                Balance red with simpler surrounding finishes and restrained accessories to keep the overall design cohesive.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: French Wainscoting Tiles in Mumbai: A Decorative Alternative to Plain Walls */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            French Wainscoting Tiles in Mumbai: A Decorative Alternative to Plain Walls
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              French wainscoting is traditionally associated with decorative wall panelling that divides a wall into structured sections. French-inspired frame tiles can help create a similar panel-led visual effect through a tiled wall design.
            </p>
            <p>
              For projects exploring French wainscoting tiles in Mumbai, frame-inspired tiles may be worth considering where a decorative, coordinated wall finish is desired.
            </p>
            <p className="font-semibold text-[#101B38] pt-2">
              They can be incorporated into a design concept for:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              "Living room feature walls.",
              "Bedroom accent walls.",
              "Dining room decorative backdrops.",
              "Selected bathroom walls.",
              "Interior spaces inspired by classic European architecture.",
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
            The final appearance depends on the tile design, layout, grout colour, installation details and surrounding materials. If you are seeking a precise traditional wainscoting profile, discuss the intended look with your architect or interior designer before finalising the tile selection.
          </p>
        </div>

        {/* Section 4: French Wall Panel Tiles in Mumbai for Feature Walls */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            French Wall Panel Tiles in Mumbai for Feature Walls
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              A well-designed feature wall can define the character of an interior without requiring decoration on every surface. French wall panel tiles offer an option for introducing pattern, symmetry and decorative interest through the wall finish itself.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {[
              {
                title: "Living Room Feature Walls",
                content:
                  "Use French frame-inspired tiles to develop a distinctive backdrop behind selected furniture arrangements or within a carefully planned decorative wall. Coordinate the tile colour with the sofa, lighting, flooring and artwork for a unified result.",
              },
              {
                title: "Bedroom Walls",
                content:
                  "In a bedroom, a frame-inspired tiled wall can contribute to a composed, hotel-inspired aesthetic. Consider the colour palette and wall placement carefully so that the design complements rather than competes with the bed, headboard and lighting.",
              },
              {
                title: "Dining Room Walls",
                content:
                  "French frame wall tiles can add visual structure to a dining area and complement decorative furniture, pendant lighting and a coordinated dining setting. Neutral shades can create a subtle backdrop, while deeper colours may offer a more expressive design statement.",
              },
              {
                title: "Bathroom Walls",
                content:
                  "French frame ceramic wall tiles may be considered for selected bathroom wall applications, subject to the specific product's suitability and installation requirements. Their decorative appearance can complement coordinated sanitaryware, mirrors, fittings and other wall finishes. Always confirm whether the selected tile is suitable for the intended wet-area application and follow the manufacturer's installation and maintenance guidance.",
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

        {/* Section 5: European Wall Tiles in Mumbai for Design-Led Interiors */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            European Wall Tiles in Mumbai for Design-Led Interiors
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              European-inspired interiors often balance decorative detail with proportion, colour and material harmony. French frame tiles can contribute to this aesthetic by giving walls a more considered, panel-inspired appearance.
            </p>
            <p>
              When exploring European wall tiles in Mumbai, consider how the design will work with the wider interior scheme. White and beige may suit softer, understated palettes, while blue, green and red can introduce a more distinctive accent.
            </p>
            <p className="font-semibold text-[#101B38] pt-2">
              French frame tiles can be considered for a range of design concepts, including:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              "Classic European-inspired residences.",
              "Contemporary homes with decorative detailing.",
              "Boutique hotels and hospitality interiors.",
              "Designer apartments and premium residential projects.",
              "Dining areas and selected commercial interiors.",
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
            The suitability of each product depends on its specifications and the requirements of the project. Confirm the available designs, colours, dimensions and application guidance with Timex Ceramic before placing an order.
          </p>
        </div>

        {/* Section 6: Why Choose French Frame Tiles for Your Interior? */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Why Choose French Frame Tiles for Your Interior?
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              French frame tiles combine decorative character with the practical considerations of a tiled wall finish. They can be a strong choice when you want the wall itself to contribute to the overall interior design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              {
                title: "Architectural character",
                description: "Frame-inspired detailing can create a sense of structure and proportion.",
              },
              {
                title: "Versatile colour options",
                description:
                  "White, beige, green, blue and red offer different ways to shape the mood of a space.",
              },
              {
                title: "European-inspired aesthetics",
                description:
                  "These designs can complement interiors influenced by traditional French and wider European styles.",
              },
              {
                title: "Design flexibility",
                description:
                  "Use them as a focal point or coordinate them with simpler surrounding materials, depending on the layout and selected design.",
              },
              {
                title: "Options for residential and hospitality concepts",
                description:
                  "Their decorative character can suit carefully planned living, bedroom, dining and selected bathroom interiors.",
              },
              {
                title: "Ceramic wall tile format",
                description:
                  "The listed collection includes ceramic wall tile options in rectangular shapes and medium formats. Confirm the exact dimensions and specifications of individual products before selection.",
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
        </div>

        {/* Section 7: How to Select the Right French Frame Tiles */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            How to Select the Right French Frame Tiles
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Before choosing French frame wall tiles for your Mumbai project, consider the following factors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[
              {
                title: "1. Define the Interior Style",
                content:
                  "Decide whether you want a classic French-inspired look, a contemporary interpretation or a more restrained decorative feature. This will help guide the choice of colour and pattern.",
              },
              {
                title: "2. Select a Coordinated Colour Palette",
                content:
                  "White and beige can complement subtle, neutral interiors. Green and blue can add colour with a composed feel, while red can make a more prominent statement. View the actual tile sample alongside your planned finishes whenever possible.",
              },
              {
                title: "3. Consider Wall Dimensions and Tile Proportions",
                content:
                  "Rectangular, medium-format tiles should be planned in relation to the dimensions of the wall and the intended pattern. Ask your installer to review the layout, edge details and cuts before work begins.",
              },
              {
                title: "4. Plan Grout and Installation Details",
                content:
                  "Grout colour and joint consistency can influence how clearly the frame-inspired pattern appears. Confirm the recommended grout, adhesive, surface preparation and installation method for the selected tile.",
              },
              {
                title: "5. Verify Application Suitability",
                content:
                  "The French Frames category is presented as a wall tile collection. Do not assume that a product is suitable for flooring or every wet-area application. Check the individual product specifications and intended use before finalising your selection.",
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

        {/* Section 8: French Frame Tiles in Mumbai for Architects and Interior Designers */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            French Frame Tiles in Mumbai for Architects and Interior Designers
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              For architects, interior designers, developers and project buyers, selecting a decorative wall finish is an important part of creating a consistent design concept.
            </p>
            <p>
              French frame tiles can support projects that require a refined, European-inspired visual language across selected interior spaces. When specifying tiles, evaluate colour consistency, available quantity, dimensions, installation details, lead times and the suitability of the chosen product for the intended application.
            </p>
            <p>
              For hospitality and commercial projects, coordinate the tile selection with lighting, furniture, adjoining finishes and maintenance expectations. For residential projects, consider how the wall design will work with the home's overall palette and long-term design direction.
            </p>
            <p>
              Timex Ceramic's French Frames category is a starting point for exploring suitable designs. Contact the team to confirm current product availability and obtain the technical information required for your project.
            </p>
          </div>
        </div>

        {/* Section 9: Discover French Frame Tiles at Timex Ceramic, Mumbai */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Discover French Frame Tiles at Timex Ceramic, Mumbai
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              The right wall finish can make a room feel more considered, balanced and distinctive. With their European-inspired character and range of colour possibilities, French frame tiles offer a decorative option for interiors that call for something beyond a plain wall.
            </p>
            <p>
              Explore French frame tiles in Mumbai at Timex Ceramic to find a design that complements your project's architecture, palette and intended atmosphere. Whether you are planning a living room feature wall, an elegant bedroom or a coordinated dining space, choose your tiles with the full interior scheme in mind.
            </p>
            <p>
              Browse the{" "}
              <Link
                href="/product-category/french-frames/"
                className="text-[#C95745] hover:underline font-medium"
              >
                French Frames collection
              </Link>{" "}
              and{" "}
              <Link href="/contact" className="text-[#C95745] hover:underline font-medium">
                contact Timex Ceramic
              </Link>{" "}
              to enquire about available designs, specifications and suitability for your project.
            </p>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-8 pt-6 border-t border-[#DED9D0]">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] leading-tight tracking-tight mb-8">
            Frequently Asked Questions About French Frame Tiles
          </h2>

          <div className="space-y-4">
            {activeFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.includes(index);

              // Interactive links for FAQ 2 and FAQ 20
              const renderAnswer = (ans: string) => {
                if (
                  faq.question.includes("Where can I find French frame tiles in Mumbai?") ||
                  index === 1
                ) {
                  return (
                    <>
                      You can explore the French Frames category on the Timex Ceramic website at{" "}
                      <Link
                        href="/product-category/french-frames/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        https://www.timexceramic.com/product-category/french-frames/
                      </Link>
                      .{" "}
                      <Link
                        href="/contact"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Contact Timex Ceramic
                      </Link>{" "}
                      to confirm current designs, availability and product specifications.
                    </>
                  );
                }
                if (
                  faq.question.includes("How can I enquire about French frame tiles at Timex Ceramic?") ||
                  index === 19
                ) {
                  return (
                    <>
                      Visit the Timex Ceramic{" "}
                      <Link
                        href="/product-category/french-frames/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        french frame tile category page
                      </Link>{" "}
                      to explore the collection, then{" "}
                      <Link
                        href="/contact"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        contact Timex Ceramic
                      </Link>{" "}
                      to ask about current designs, specifications, availability and project requirements.
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-ff-${index + 1}`}
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

