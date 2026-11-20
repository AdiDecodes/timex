"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, CheckCircle2 } from "lucide-react";
import { FaqItem } from "@/data/collectionSeoData";

interface FabricCollectionContentProps {
  faqs?: FaqItem[];
}

export const FABRIC_DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-fab-1",
    question: "1. What are fabric texture tiles?",
    answer:
      "Fabric texture tiles are tiles designed to resemble the visual appearance of woven fabric, linen or textile surfaces. They bring subtle pattern and depth to a tiled wall or floor, depending on the specific product and its approved application.",
  },
  {
    id: "faq-fab-2",
    question: "2. Where can I find fabric texture tiles in Mumbai?",
    answer:
      "You can explore the Fabric category on the Timex Ceramic website: https://www.timexceramic.com/product-category/fabric/. Contact Timex Ceramic to confirm current designs, dimensions, availability and technical specifications.",
  },
  {
    id: "faq-fab-3",
    question: "3. What are linen-look tiles?",
    answer:
      "Linen-look tiles are tiles designed to evoke the fine, understated appearance of linen fabric. They can complement interiors that favour subtle texture, neutral colours and a refined, contemporary aesthetic.",
  },
  {
    id: "faq-fab-4",
    question: "4. What is the difference between fabric-look tiles and linen-look tiles?",
    answer:
      "Fabric-look tiles broadly draw inspiration from textile surfaces, while linen-look tiles focus on the visual character of linen. The distinction depends on the design and pattern of each individual tile.",
  },
  {
    id: "faq-fab-5",
    question: "5. Are fabric texture tiles suitable for living rooms?",
    answer:
      "They can be considered for suitable living room walls and, where the product is approved for floor use, living room flooring. Choose the design based on the room's colour scheme, lighting and intended use.",
  },
  {
    id: "faq-fab-6",
    question: "6. Can fabric texture tiles be used in bedrooms?",
    answer:
      "Yes, suitable fabric-look tiles can be considered for bedroom feature walls and other approved applications. Coordinate the design with the bed, furniture, lighting and adjoining finishes.",
  },
  {
    id: "faq-fab-7",
    question: "7. Are fabric texture tiles suitable for bathrooms?",
    answer:
      "Some products may be suitable for bathroom walls or floors, depending on their technical specifications. Confirm wet-area suitability, slip resistance where relevant and maintenance requirements before installation.",
  },
  {
    id: "faq-fab-8",
    question: "8. Can fabric-look tiles be used in kitchens?",
    answer:
      "They may be suitable for selected kitchen walls or floors if the specific product is approved for that use. Check cleaning guidance and application specifications, particularly for areas exposed to grease, water and frequent cleaning.",
  },
  {
    id: "faq-fab-9",
    question: "9. Are fabric texture tiles available in a matte finish?",
    answer:
      "Yes, matte-finish options are included in the supplied details for Timex Ceramic's Fabric category. Confirm the finish of the particular design before ordering.",
  },
  {
    id: "faq-fab-10",
    question: "10. What colours are available in fabric texture tiles?",
    answer:
      "The supplied category details include white, beige, green and pink options. Exact shades and current availability may vary by product.",
  },
  {
    id: "faq-fab-11",
    question: "11. Are fabric texture tiles available in rectangular formats?",
    answer:
      "The supplied collection details list rectangular, medium-format porcelain tile options. Contact Timex Ceramic or check individual product information for exact dimensions.",
  },
  {
    id: "faq-fab-12",
    question: "12. Are fabric texture tiles made from porcelain?",
    answer:
      "The supplied Fabric category information includes imported porcelain tiles. Check the individual product listing to confirm the material of a specific design.",
  },
  {
    id: "faq-fab-13",
    question: "13. Are fabric texture tiles suitable for flooring?",
    answer:
      "Some options in the supplied category are listed for wall and floor applications. However, confirm that the specific tile is approved for flooring and meets the slip-resistance and wear requirements of the intended space.",
  },
  {
    id: "faq-fab-14",
    question: "14. Can fabric-look tiles be used in hotels and restaurants?",
    answer:
      "They may be considered for suitable wall and floor applications in hospitality environments. Verify the product's technical performance, maintenance requirements and suitability for the expected level of use.",
  },
  {
    id: "faq-fab-15",
    question: "15. Are fabric texture tiles suitable for offices?",
    answer:
      "Fabric-look tiles can be considered for selected office walls and approved floor applications. The right choice depends on the design brief, traffic levels, cleaning requirements and product specifications.",
  },
  {
    id: "faq-fab-16",
    question: "16. How do I choose between beige, white, green and pink fabric-look tiles?",
    answer:
      "Choose based on the mood you want to create and how the tile will coordinate with furniture, lighting and other finishes. White and beige can complement neutral schemes, while green and pink can introduce more distinctive colour accents.",
  },
  {
    id: "faq-fab-17",
    question: "17. Are fabric texture tiles easy to maintain?",
    answer:
      "Maintenance depends on the tile's surface and manufacturer guidance. Follow the recommended cleaning method, use appropriate cleaning products and confirm any special care requirements before purchase.",
  },
  {
    id: "faq-fab-18",
    question: "18. How do I calculate the quantity of fabric texture tiles required?",
    answer:
      "Measure the installation area and check the exact dimensions and coverage per box for your selected product. Include an allowance for cuts and wastage based on the layout, and have the quantity checked by your installer.",
  },
  {
    id: "faq-fab-19",
    question: "19. What should architects and interior designers check before specifying fabric texture tiles?",
    answer:
      "Review the product dimensions, finish, material, colour, application suitability, technical performance, cleaning requirements, stock availability and delivery timeline. For project orders, confirm quantities and batch consistency before finalising the specification.",
  },
  {
    id: "faq-fab-20",
    question: "20. How can I enquire about fabric texture tiles from Timex Ceramic?",
    answer:
      "Visit the Timex Ceramic fabric tile category page to explore the category. Contact Timex Ceramic to enquire about current designs, available sizes, specifications, quantities and suitability for your project.",
  },
];

export function FabricCollectionContent({ faqs }: FabricCollectionContentProps) {
  const activeFaqs = faqs && faqs.length >= 20 ? faqs : FABRIC_DEFAULT_FAQS;
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
            Textile-Inspired Luxury
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#101B38] leading-tight tracking-tight">
            Fabric Texture Tiles in Mumbai for Elegant, Textile-Inspired Spaces
          </h1>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed">
            <p>
              Bring the softness of textile-inspired design into your interiors with fabric texture tiles in Mumbai from Timex Ceramic. Inspired by the delicate appearance of woven fabrics and linen surfaces, these tiles introduce subtle texture, visual depth and understated sophistication to walls and floors.
            </p>
            <p>
              A fabric-inspired finish can transform an ordinary surface into a design feature without relying on bold patterns or overly decorative details. Whether you are creating a calm living room, a contemporary bedroom, a refined hotel interior or a welcoming café, fabric-look tiles offer a distinctive way to balance texture with a clean, coordinated aesthetic.
            </p>
            <p>
              At Timex Ceramic, explore imported porcelain tiles with matte finishes, rectangular shapes and medium-format options in colours such as beige, pink, green and white. These versatile shades can complement a wide range of interior palettes, from warm neutral schemes to fresh, nature-inspired spaces.
            </p>
            <p>
              If you are searching for fabric texture tiles in Mumbai, linen-look tiles for a residential project or designer textured wall tiles for a commercial interior, discover surfaces that bring a considered, tactile character to your design.
            </p>
          </div>
        </div>

        {/* Section 1: What Are Fabric Texture Tiles? */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            What Are Fabric Texture Tiles?
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Fabric texture tiles are tiles designed to evoke the appearance of woven textiles, linen, cloth fibres or other fabric-inspired surfaces. Rather than reproducing the look of natural stone or wood, they bring a softer, textile-like visual quality to the built environment.
            </p>
            <p>
              Depending on the design, a fabric-look tile may feature subtle linear details, woven-inspired patterns or a fine, understated texture. This makes it an interesting choice for interiors where the aim is to introduce dimension without overwhelming the space.
            </p>
            <p>
              Linen-look tiles are a related design option that draws inspiration from the delicate, natural appearance of linen fabric. Their understated character can work particularly well with minimalist interiors, contemporary furniture, warm neutrals and natural-looking materials.
            </p>
            <p>
              Fabric-inspired tiles are made for a different purpose than actual textiles: they provide a tiled surface with a textile-inspired appearance. The precise texture, pattern and performance depend on the individual product.
            </p>
          </div>
        </div>

        {/* Section 2: Explore Fabric Texture Wall Tiles in Mumbai */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Explore Fabric Texture Wall Tiles in Mumbai
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Walls play an important role in shaping the atmosphere of a room. While plain finishes can create a simple backdrop, textured wall tiles introduce an additional layer of visual interest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {[
              {
                title: "1. Linen-Look Tiles for Calm, Contemporary Interiors",
                paragraphs: [
                  "Linen-look tiles can create a relaxed and refined appearance inspired by natural woven materials. Their subtle visual character makes them suitable for design schemes that favour simplicity, balanced proportions and soft colour transitions.",
                  "Pair linen-inspired surfaces with neutral furnishings, warm lighting, timber accents or understated decorative elements for a cohesive interior.",
                ],
              },
              {
                title: "2. Fabric-Look Tiles for Modern Feature Walls",
                paragraphs: [
                  "Fabric-look tiles can help create a feature wall that feels distinctive without relying on dramatic colours or high-contrast patterns. Consider them for selected living room walls, bedroom accents or carefully planned decorative areas.",
                  "For a balanced result, coordinate the tile with the surrounding wall finishes, furniture, lighting and flooring.",
                ],
              },
              {
                title: "3. Matte Fabric Texture Tiles for Understated Style",
                paragraphs: [
                  "The matte-finish options listed in the Fabric category offer a more restrained visual appearance than highly reflective surfaces. Depending on the selected design, matte fabric-look tiles can complement contemporary, minimalist and softly layered interiors.",
                  "Always distinguish between a matte visual finish and slip resistance. If the tile is intended for flooring, check the manufacturer's technical specifications for the required performance.",
                ],
              },
              {
                title: "4. Rectangular Fabric Texture Tiles for Structured Layouts",
                paragraphs: [
                  "Rectangular tiles provide flexibility when planning a wall or floor layout. The arrangement, grout colour and orientation can influence the overall appearance, whether the aim is to emphasise horizontal lines, vertical proportions or a more uniform surface.",
                  "Discuss the intended layout with your installer before finalising the quantity and installation plan.",
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
        </div>

        {/* Section 3: Linen Texture Wall Tiles in Mumbai for Refined Interiors */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Linen Texture Wall Tiles in Mumbai for Refined Interiors
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Linen-inspired surfaces bring a sense of quiet detail to spaces where visual comfort and material coordination are important. They can complement interiors built around soft colours, simple furniture and a restrained decorative approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[
              {
                title: "Living Room Fabric Texture Tiles",
                content:
                  "Use fabric texture tiles to introduce depth to a selected living room wall or create a coordinated surface within a contemporary interior. Beige and white tones can complement neutral furniture, while green or pink may add a subtle colour accent. The best result comes from treating the tile as part of the complete design scheme rather than as an isolated finish.",
              },
              {
                title: "Bedroom Linen-Look Tiles",
                content:
                  "Bedrooms often benefit from materials and colours that create a calm, cohesive atmosphere. Linen-look tiles can be considered for suitable wall applications where a soft, textile-inspired aesthetic is desired. Coordinate the selected shade with the bed, headboard, lighting, curtains and adjoining surfaces. Before specifying a tiled feature behind a bed, consider the intended visual effect and practical requirements of the space.",
              },
              {
                title: "Dining Room and Living-Dining Areas",
                content:
                  "Fabric-look tiles can offer an alternative to conventional decorative wall finishes in dining areas. Their subtle appearance can work alongside dining furniture, pendant lighting and coordinated flooring without competing with the main furnishings. For open-plan spaces, repeat complementary colours or materials to create continuity between the living and dining zones.",
              },
              {
                title: "Bathroom Fabric Texture Wall Tiles",
                content:
                  "Fabric-inspired porcelain tiles may be considered for suitable bathroom wall applications, depending on the individual product's technical specifications. Their visual texture can add detail to an otherwise simple bathroom scheme. Confirm suitability for wet areas, cleaning requirements and installation methods before purchase. A textured appearance alone does not establish that a tile is waterproof, slip-resistant or suitable for every bathroom application.",
              },
              {
                title: "Kitchen Fabric-Look Tiles",
                content:
                  "Fabric-look tiles can be considered for selected kitchen walls where the intended design calls for a subtle, contemporary surface. Coordinate the tile with cabinetry, countertops and other finishes to create a unified look. For splash zones and areas exposed to grease or frequent cleaning, check the manufacturer's maintenance guidance and the suitability of the selected tile.",
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

        {/* Section 4: Fabric Texture Floor Tiles for Coordinated Interiors */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Fabric Texture Floor Tiles for Coordinated Interiors
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Fabric texture tiles can also be explored for flooring where the specific product is approved for floor use. A coordinated wall-and-floor scheme can create visual continuity, particularly in contemporary interiors with a restrained material palette.
            </p>
            <p>
              For flooring projects, evaluate the product's technical specifications rather than relying on appearance alone. Important considerations include slip resistance, wear performance, expected foot traffic, cleaning requirements and suitability for the intended environment.
            </p>
            <p>
              For homes, hotels, offices, restaurants and wellness spaces, the appropriate specification will depend on how the space is used and maintained.
            </p>
          </div>
        </div>

        {/* Section 5: Imported Fabric Texture Tiles in Mumbai */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Imported Fabric Texture Tiles in Mumbai
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              If you are looking for imported fabric texture tiles in Mumbai, material quality, design consistency and technical suitability are important parts of the selection process.
            </p>
            <p>
              The Fabric category at Timex Ceramic includes imported porcelain tile options with matte finishes, rectangular shapes and medium-format designs. Available colour options represented in the supplied collection details include beige, pink, green and white.
            </p>
            <p>
              These design characteristics can be considered for a variety of interior concepts, from understated residential spaces to carefully coordinated hospitality and commercial interiors.
            </p>
            <p>
              Before specifying a tile, confirm its country of origin, exact dimensions, finish, current availability and intended application. These details should be checked against the individual product information rather than assumed across the entire category.
            </p>
          </div>
        </div>

        {/* Section 6: Fabric Texture Tiles for Hotels, Cafés and Commercial Interiors */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Fabric Texture Tiles for Hotels, Cafés and Commercial Interiors
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Texture can help create a distinctive atmosphere in hospitality and commercial environments. Fabric-look tiles offer an option for designers who want a textile-inspired visual effect while specifying a tiled surface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {[
              {
                title: "Hotel Interiors",
                content:
                  "For hotels, fabric-inspired tile designs may complement reception areas, guest-room interiors and selected decorative walls, subject to the product's suitability for the application.",
              },
              {
                title: "Cafés and Restaurants",
                content:
                  "In cafés and restaurants, subtle texture can contribute to a warm, considered interior. Coordinate the tiles with lighting, furniture, signage and the broader brand identity.",
              },
              {
                title: "Offices and Workspaces",
                content:
                  "Fabric-look tiles may suit selected office interiors where a refined, understated wall or floor finish is desired. Consider how the surface will work with the lighting, furniture, acoustic requirements and maintenance plan.",
              },
              {
                title: "Spa and Wellness Spaces",
                content:
                  "Soft colours and understated textures can complement wellness-inspired design concepts. For these spaces, verify the tile's suitability for wet areas, floor use and the cleaning regime required by the facility.",
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
            For commercial projects, confirm technical specifications, quantity availability, delivery timelines and maintenance requirements before placing an order.
          </p>
        </div>

        {/* Section 7: Choose the Right Colour for Your Fabric Texture Tiles */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Choose the Right Colour for Your Fabric Texture Tiles
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Colour influences how a textile-inspired surface interacts with light, furniture and surrounding materials. The Fabric category includes options represented in beige, pink, green and white.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {[
              {
                title: "White Fabric Texture Tiles",
                content:
                  "White fabric-look tiles can create a fresh, uncluttered appearance. They may complement minimalist spaces, light-coloured furniture and interiors where visual simplicity is a priority.",
              },
              {
                title: "Beige Linen-Look Tiles",
                content:
                  "Beige is a versatile option for warm, neutral interiors. It can coordinate with wood tones, cream finishes, earthy accents and a range of contemporary furniture styles.",
              },
              {
                title: "Green Fabric Texture Tiles",
                content:
                  "Green fabric-inspired tiles can bring a nature-led colour accent to an interior. Pair them with neutral surroundings for a balanced effect, or coordinate them with complementary materials for a more expressive scheme.",
              },
              {
                title: "Pink Fabric Texture Tiles",
                content:
                  "Pink fabric-look tiles can introduce a softer colour statement into a design. Depending on the shade and surrounding finishes, they may complement contemporary residential interiors, boutique spaces or carefully styled hospitality projects.",
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
            Always review a physical sample when possible. Screen colours can differ from the actual product, and the appearance of a tile may change under different lighting conditions.
          </p>
        </div>

        {/* Section 8: Why Choose Fabric Texture Tiles from Timex Ceramic? */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Why Choose Fabric Texture Tiles from Timex Ceramic?
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Selecting a tile is about finding the right balance between appearance, application and the needs of the project. Fabric texture tiles can be a useful option when you want to introduce subtle detail without a heavily patterned finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              {
                title: "Textile-inspired design",
                description: "Create a woven- or linen-inspired visual effect through a tiled surface.",
              },
              {
                title: "Understated matte finishes",
                description: "Explore matte options for a restrained, contemporary appearance.",
              },
              {
                title: "Versatile colour choices",
                description:
                  "Consider white, beige, green and pink to complement different interior palettes.",
              },
              {
                title: "Rectangular formats",
                description:
                  "Plan structured wall or floor layouts around the proportions of the selected tile.",
              },
              {
                title: "Porcelain options",
                description:
                  "Explore porcelain tiles listed in the category, with suitability determined by the individual product specification.",
              },
              {
                title: "Residential and commercial design possibilities",
                description:
                  "Consider fabric-inspired tiles for suitable living, bedroom, dining, hospitality and workspace applications.",
              },
              {
                title: "Project-led selection",
                description:
                  "Architects, interior designers and project buyers can evaluate design, dimensions, technical performance and quantity requirements before specifying a product.",
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

        {/* Section 9: How to Select Fabric Texture Tiles for Your Project */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            How to Select Fabric Texture Tiles for Your Project
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Before choosing fabric-look tiles, consider these practical factors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[
              {
                title: "1. Decide Where the Tiles Will Be Installed",
                content:
                  "Identify whether the tiles are intended for walls, floors, a feature wall, a kitchen area or a bathroom. Confirm that the chosen product is rated for the intended application.",
              },
              {
                title: "2. Select the Right Texture and Colour",
                content:
                  "Consider how pronounced the textile-inspired pattern should be. Subtle linen-look designs may complement a restrained interior, while more visible textures can create a stronger focal point.",
              },
              {
                title: "3. Review Tile Dimensions and Layout",
                content:
                  "The category includes medium-format rectangular options. Confirm exact dimensions and calculate the required quantity after accounting for the planned layout, cuts and wastage.",
              },
              {
                title: "4. Coordinate the Surrounding Materials",
                content:
                  "Compare the tiles with furniture, cabinetry, countertops, lighting and other surfaces. A physical sample can help you assess the colour and finish under the actual lighting conditions of the project.",
              },
              {
                title: "5. Check Technical Specifications",
                content:
                  "For floor applications, verify slip resistance and wear suitability. For wet areas, confirm the intended use and cleaning requirements. For commercial projects, consider expected traffic, maintenance and long-term operating needs.",
              },
              {
                title: "6. Confirm Availability Before Ordering",
                content:
                  "For larger residential or commercial projects, check the current stock, batch consistency, quantity requirements and delivery timeline with Timex Ceramic before confirming the specification.",
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

        {/* Section 10: Discover Fabric Texture Tiles in Mumbai at Timex Ceramic */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B38] leading-tight tracking-tight">
            Discover Fabric Texture Tiles in Mumbai at Timex Ceramic
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#333333]/90 font-normal leading-relaxed max-w-5xl">
            <p>
              Great interiors are often defined by the details that feel natural rather than overstated. Fabric texture tiles bring a textile-inspired quality to tiled surfaces, allowing walls and suitable floors to become part of a carefully balanced design.
            </p>
            <p>
              Explore fabric texture tiles in Mumbai at Timex Ceramic to discover imported porcelain options in understated matte finishes and versatile colours. Whether you are designing a contemporary home, a boutique hotel, a restaurant or a commercial interior, choose a fabric-look tile that complements your space, design intent and technical requirements.
            </p>
            <p>
              Visit the{" "}
              <Link
                href="/product-category/fabric/"
                className="text-[#C95745] hover:underline font-medium"
              >
                Fabric Tiles collection
              </Link>{" "}
              to explore the available designs and{" "}
              <Link href="/contact" className="text-[#C95745] hover:underline font-medium">
                contact Timex Ceramic
              </Link>{" "}
              for current product information, specifications and project enquiries.
            </p>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-8 pt-6 border-t border-[#DED9D0]">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#101B38] leading-tight tracking-tight mb-8">
            Frequently Asked Questions About Fabric Texture Tiles
          </h2>

          <div className="space-y-4">
            {activeFaqs.map((faq, index) => {
              const isOpen = openFaqIndices.includes(index);

              // Interactive links for FAQ 2 and FAQ 20
              const renderAnswer = (ans: string) => {
                if (
                  faq.question.includes("Where can I find fabric texture tiles in Mumbai?") ||
                  index === 1
                ) {
                  return (
                    <>
                      You can explore the Fabric category on the Timex Ceramic website:{" "}
                      <Link
                        href="/product-category/fabric/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        https://www.timexceramic.com/product-category/fabric/
                      </Link>
                      .{" "}
                      <Link
                        href="/contact"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Contact Timex Ceramic
                      </Link>{" "}
                      to confirm current designs, dimensions, availability and technical specifications.
                    </>
                  );
                }
                if (
                  faq.question.includes("How can I enquire about fabric texture tiles from Timex Ceramic?") ||
                  index === 19
                ) {
                  return (
                    <>
                      Visit the Timex Ceramic{" "}
                      <Link
                        href="/product-category/fabric/"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        fabric tile category page
                      </Link>{" "}
                      to explore the category.{" "}
                      <Link
                        href="/contact"
                        className="text-[#C95745] hover:underline font-medium"
                      >
                        Contact Timex Ceramic
                      </Link>{" "}
                      to enquire about current designs, available sizes, specifications, quantities and suitability for your project.
                    </>
                  );
                }
                return ans;
              };

              return (
                <div
                  key={faq.id || `faq-fab-${index + 1}`}
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

