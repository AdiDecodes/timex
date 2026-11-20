import { getCategoryBanner, getCategoryThumbnail, getCategoryDummyImages } from "@/utils/productImages";

export interface Collection {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  shortDesc: string;
  description: string;
  banner: string;
  thumbnail: string;
  icon: string;
  featured: boolean;
  isNew?: boolean;
  seriesName?: string;
  specs?: {
    size?: string;
    kgPerBox?: string | number;
    pcsPerBox?: string | number;
  };
  productCount: number;
  previewImages: string[];
  link: string;
  column: number;
}

export const COLLECTIONS: Collection[] = [
  // ===========================================================================
  // COLUMN 1: Brick, Stone, Wooden, Tropical, Mosaic
  // ===========================================================================
  {
    id: "brick",
    slug: "brick",
    name: "Brick",
    subtitle: "Rustic Charm Meets Modern Design",
    shortDesc: "Timex Ceramic brings you an exclusive collection of brick wall tiles that blend timeless aesthetics with cutting-edge craftsmanship.",
    description: "Whether you’re looking to revamp your kitchen, bathroom, or exterior wall, our brick tiles offer unmatched versatility and durability.",
    banner: "/uploads/products/timex-ceramic-ascot-series-brown-mix-til.webp",
    thumbnail: "/uploads/products/timex-ceramic-ascot-series-brown-mix-til.webp",
    icon: "/images/collections/brick.svg",
    featured: true,
    productCount: 2,
    previewImages: ["/uploads/products/timex-ceramic-ascot-series-brown-mix-til.webp", "/images/products/ascot-brick.jpg"],
    link: "/product-category/brick",
    column: 1,
  },
  {
    id: "stone",
    slug: "stone",
    name: "Stone",
    subtitle: "Earthy Cleft & Natural Stone Textures",
    shortDesc: "Natural mineral veining and tactile quarry stone surfaces engineered for architectural grandeur.",
    description: "Replicating rare Italian Statuario, Calacatta gold, and natural cleft quarry stones, our Stone collection brings organic elegance to expansive residential floors and commercial facades.",
    banner: "/uploads/products/AMB_NAZCA-BEIGE-1.webp",
    thumbnail: "/uploads/products/AMB_NAZCA-BEIGE-1.webp",
    icon: "/images/collections/stone.svg",
    featured: true,
    productCount: 24,
    previewImages: ["/uploads/products/AMB_NAZCA-BEIGE-1.webp"],
    link: "/product-category/stone",
    column: 1,
  },
  {
    id: "wooden",
    slug: "wooden",
    name: "Wooden",
    subtitle: "Royal Oak & Timber Plank Porcelain Slabs",
    shortDesc: "Warm organic wood grain textures with zero maintenance and high stain resistance.",
    description: "Experience the comforting warmth of natural oak, aged walnut, and teak planks without warping or fading. Engineered for moisture-prone areas like spa bathrooms.",
    banner: "/uploads/products/6001-3.webp",
    thumbnail: "/uploads/products/6001-3.webp",
    icon: "/images/collections/wooden.svg",
    featured: true,
    productCount: 22,
    previewImages: ["/uploads/products/6001-3.webp"],
    link: "/product-category/wooden",
    column: 1,
  },
  {
    id: "tropical",
    slug: "tropical",
    name: "Tropical",
    subtitle: "Botanical Prints & Lush Leaf Deco Slabs",
    shortDesc: "Lush botanical murals and palm leaf motifs printed on large format ceramic boards.",
    description: "Transform plain walls into vibrant indoor gardens with seamlessly continuous tropical palm, monstera, and floral artwork.",
    banner: "/uploads/products/1004-AMB-3.webp",
    thumbnail: "/uploads/products/1004-AMB-3.webp",
    icon: "/images/collections/tropical.svg",
    featured: false,
    productCount: 15,
    previewImages: ["/uploads/products/1004-AMB-3.webp"],
    link: "/product-category/tropical",
    column: 1,
  },
  {
    id: "mosaic",
    slug: "mosaic",
    name: "Mosaic",
    subtitle: "Glass, Marble & Penny Round Mesh Sheets",
    shortDesc: "Flexible mesh-mounted micro-mosaic sheets for curved walls, shower floors, and pools.",
    description: "Precision mesh-backed mosaics featuring herringbone, penny round, lantern, and chevron chips in natural marble and iridescent glass.",
    banner: "/uploads/products/amb_GM-91_result.webp",
    thumbnail: "/uploads/products/amb_GM-91_result.webp",
    icon: "/images/collections/mosaic.svg",
    featured: false,
    productCount: 25,
    previewImages: ["/uploads/products/amb_GM-91_result.webp"],
    link: "/product-category/mosaic",
    column: 1,
  },

  // ===========================================================================
  // COLUMN 2: Marble, Subway, Texture, Metallic, Boutique
  // ===========================================================================
  {
    id: "marble",
    slug: "marble",
    name: "Marble",
    subtitle: "Italian Statuario & Calacatta Luxury Slabs",
    shortDesc: "Majestic Statuario, Calacatta, and Nero Marquina marble veining for high-end interiors.",
    description: "Capture the opulent splendour of rare quarry marbles with high-definition mirror-polished glazed porcelain slabs.",
    banner: "/uploads/products/204-Conept-AMB_1.webp",
    thumbnail: "/uploads/products/204-Conept-AMB_1.webp",
    icon: "/images/collections/stone.svg",
    featured: true,
    productCount: 26,
    previewImages: ["/uploads/products/204-Conept-AMB_1.webp"],
    link: "/product-category/marble",
    column: 2,
  },
  {
    id: "subway",
    slug: "subway",
    name: "Subway",
    subtitle: "Beveled & Flat Metro Wall Tile Series",
    shortDesc: "Classic rectangular metro shapes with high-gloss glazed finishes for kitchens and bathrooms.",
    description: "A timeless architectural staple featuring crisp beveled edges, deep handmade luster glaze, and versatile brick-lay patterns suited for feature backsplashes and accent walls.",
    banner: "/uploads/products/Amb-Makalu-Beige-5x50_hq.webp",
    thumbnail: "/uploads/products/Amb-Makalu-Beige-5x50_hq.webp",
    icon: "/images/collections/subway.svg",
    featured: true,
    productCount: 32,
    previewImages: ["/uploads/products/Amb-Makalu-Beige-5x50_hq.webp"],
    link: "/product-category/subway",
    column: 2,
  },
  {
    id: "texture",
    slug: "texture",
    name: "Texture",
    subtitle: "Sculpted Linear Walls & Fluted Surfaces",
    shortDesc: "Tactile relief walls creating dynamic shadows and dimensional architectural interest.",
    description: "Add depth to feature walls with 3D sculpted flutes, wave reliefs, and micro-grooved textures designed to interact dramatically with lighting.",
    banner: "/uploads/products/Amb-Teguise-cotto-15x30-Lagoon-green-15x15.webp",
    thumbnail: "/uploads/products/Amb-Teguise-cotto-15x30-Lagoon-green-15x15.webp",
    icon: "/images/collections/texture.svg",
    featured: false,
    isNew: true,
    productCount: 20,
    previewImages: ["/uploads/products/Amb-Teguise-cotto-15x30-Lagoon-green-15x15.webp"],
    link: "/product-category/texture",
    column: 2,
  },
  {
    id: "metallic",
    slug: "metallic",
    name: "Metallic",
    subtitle: "Oxidized Steel & Aged Copper Luster",
    shortDesc: "Industrial metallic sheen showing iridescent oxide glazes and dark titanium undertones.",
    description: "Engineered for high-impact commercial lobbies and modern urban lofts, capturing subtle light reflections from oxidized metal patinas.",
    banner: "/uploads/products/202-Light-232-Light_AMB.webp",
    thumbnail: "/uploads/products/202-Light-232-Light_AMB.webp",
    icon: "/images/collections/metallic.svg",
    featured: true,
    productCount: 16,
    previewImages: ["/uploads/products/202-Light-232-Light_AMB.webp"],
    link: "/product-category/metallic",
    column: 2,
  },
  {
    id: "boutique",
    slug: "boutique",
    name: "Boutique",
    subtitle: "Hand-Crafted Artisanal & Limited Edition Surfaces",
    shortDesc: "Exclusive low-volume designer editions with custom edge treatments and reactive glazes.",
    description: "Curated for ultra-luxury residences and flagship retail boutiques seeking one-of-a-kind surface character.",
    banner: "/uploads/products/Raku-Sand-Line-Sand-10-x-10-cm.webp",
    thumbnail: "/uploads/products/Raku-Sand-Line-Sand-10-x-10-cm.webp",
    icon: "/images/collections/boutique.svg",
    featured: false,
    productCount: 10,
    previewImages: ["/uploads/products/Raku-Sand-Line-Sand-10-x-10-cm.webp"],
    link: "/product-category/boutique",
    column: 2,
  },

  // ===========================================================================
  // COLUMN 3: Hexagon, Moroccan, Colorful, Highlighter, French Frames
  // ===========================================================================
  {
    id: "hexagon",
    slug: "hexagon",
    name: "Hexagon",
    subtitle: "Six-Sided Geometric Honeycomb Mesh",
    shortDesc: "Symmetrical six-sided geometric honeycombs for dynamic floor and wall transitions.",
    description: "Versatile hexagonal formats ideal for creating fading ombre transitions from tile into timber floors.",
    banner: "/uploads/products/AMB_LANCASTER-GREY_BANO_result.webp",
    thumbnail: "/uploads/products/AMB_LANCASTER-GREY_BANO_result.webp",
    icon: "/images/collections/hexagon.svg",
    featured: false,
    productCount: 21,
    previewImages: ["/uploads/products/AMB_LANCASTER-GREY_BANO_result.webp"],
    link: "/product-category/hexagon",
    column: 3,
  },
  {
    id: "moroccan",
    slug: "moroccan",
    name: "Moroccan",
    subtitle: "Exotic Mediterranean Zellige & Geometric Art",
    shortDesc: "Handcrafted aesthetic patterns capturing vibrant Mediterranean colors and artisanal heritage.",
    description: "Inspired by centuries of North African tile artistry, our Moroccan collection features intricate star motifs, arabesque geometries, and rich glazed patinas.",
    banner: "/uploads/products/1004-AMB-3.webp",
    thumbnail: "/uploads/products/1004-AMB-3.webp",
    icon: "/images/collections/moroccan.svg",
    featured: true,
    productCount: 28,
    previewImages: ["/uploads/products/1004-AMB-3.webp"],
    link: "/product-category/moroccan",
    column: 3,
  },
  {
    id: "colorful",
    slug: "colorful",
    name: "Colorful",
    subtitle: "Vibrant Pigmented & Satin Glazed Hues",
    shortDesc: "Bold monochrome pastels and jewel-toned glazes for creative interior expressions.",
    description: "Curated color palettes ranging from deep emerald green and Mediterranean azure to soft terracotta and blush pink.",
    banner: "/uploads/products/Blinds-Ambience-3.webp",
    thumbnail: "/uploads/products/Blinds-Ambience-3.webp",
    icon: "/images/collections/colorful.svg",
    featured: false,
    productCount: 26,
    previewImages: ["/uploads/products/Blinds-Ambience-3.webp"],
    link: "/product-category/colorful",
    column: 3,
  },
  {
    id: "highlighter",
    slug: "highlighter",
    name: "Highlighter",
    subtitle: "Luxury Gold Foil & Metallic Feature Boards",
    shortDesc: "Statement accent pieces infused with platinum, gold leafing, and metallic mirror highlights.",
    description: "Designed to serve as focal points in master baths, vanity mirrors, and luxury hotel suites.",
    banner: "/uploads/products/208-Concept-AMB_2.webp",
    thumbnail: "/uploads/products/208-Concept-AMB_2.webp",
    icon: "/images/collections/highlighter.svg",
    featured: false,
    productCount: 12,
    previewImages: ["/uploads/products/208-Concept-AMB_2.webp"],
    link: "/product-category/highlighter",
    column: 3,
  },
  {
    id: "french-frames",
    slug: "french-frames",
    name: "French Frames",
    subtitle: "Neoclassical Molded Panels & Boiserie Tiles",
    shortDesc: "Elegant picture-frame moldings and neoclassical relief panels for regal wall dressing.",
    description: "Embodying Parisian elegance with ceramic boiserie panel moldings, dado rails, and framed relief borders.",
    banner: "/uploads/products/Fables-Plinth-Blue-Mate-Fables-Dama-Night-300-x-900.webp",
    thumbnail: "/uploads/products/Fables-Plinth-Blue-Mate-Fables-Dama-Night-300-x-900.webp",
    icon: "/images/collections/french-frames.svg",
    featured: false,
    productCount: 11,
    previewImages: ["/uploads/products/Fables-Plinth-Blue-Mate-Fables-Dama-Night-300-x-900.webp"],
    link: "/product-category/french-frames",
    column: 3,
  },

  // ===========================================================================
  // COLUMN 4: Modular, Octagonal, Terrazzo, White, Fabric
  // ===========================================================================
  {
    id: "modular",
    slug: "modular",
    name: "Modular",
    subtitle: "Versailles & Multi-Size Interlocking Grids",
    shortDesc: "Architectural multi-size modular formats for seamless French pattern floor layouts.",
    description: "Engineered multi-size stone and terracotta modular kits designed for rustic courtyards and grand European entryways.",
    banner: "/uploads/products/amb-02-albany_teka_pag.53.webp",
    thumbnail: "/uploads/products/amb-02-albany_teka_pag.53.webp",
    icon: "/images/collections/geometric.svg",
    featured: false,
    productCount: 18,
    previewImages: ["/uploads/products/amb-02-albany_teka_pag.53.webp"],
    link: "/product-category/modular",
    column: 4,
  },
  {
    id: "octagonal",
    slug: "octagonal",
    name: "Octagonal",
    subtitle: "Victorian Geometric Key Dot Patterns",
    shortDesc: "Heritage octagonal geometry with contrasting insert dots for classic interior charm.",
    description: "A vintage favorite refined with contemporary porcelain precision. Ideal for heritage restoration projects and chic boutique restrooms.",
    banner: "/uploads/products/Ambiente-Betera-Blanco-58x58_result.webp",
    thumbnail: "/uploads/products/Ambiente-Betera-Blanco-58x58_result.webp",
    icon: "/images/collections/octagonal.svg",
    featured: false,
    productCount: 14,
    previewImages: ["/uploads/products/Ambiente-Betera-Blanco-58x58_result.webp"],
    link: "/product-category/octagonal",
    column: 4,
  },
  {
    id: "terrazzo",
    slug: "terrazzo",
    name: "Terrazzo",
    subtitle: "Aggregate Mineral & Speckled Marble Formations",
    shortDesc: "Mid-century modern aggregate surfaces with scattered marble and quartz visuals.",
    description: "Playful yet sophisticated, our Terrazzo collection incorporates high-definition composite aggregate speckles set into neutral porcelain grounds.",
    banner: "/uploads/products/12001-1200X1200-MM.webp",
    thumbnail: "/uploads/products/12001-1200X1200-MM.webp",
    icon: "/images/collections/terrazzo.svg",
    featured: true,
    productCount: 18,
    previewImages: ["/uploads/products/12001-1200X1200-MM.webp"],
    link: "/product-category/terrazzo",
    column: 4,
  },
  {
    id: "white",
    slug: "white",
    name: "White",
    subtitle: "Pristine Snow & Satin Pure Monoliths",
    shortDesc: "Ultra-pure white porcelain body with pristine light reflection and seamless edges.",
    description: "Minimalist perfection in glossy alabaster and satin chalk finishes, providing an expansive canvas for high-end modern design.",
    banner: "https://www.timexceramic.com/wp-content/uploads/2022/05/564-amb.jpg",
    thumbnail: "https://www.timexceramic.com/wp-content/uploads/2022/05/564-amb.jpg",
    icon: "/images/collections/white.svg",
    featured: false,
    productCount: 30,
    previewImages: ["https://www.timexceramic.com/wp-content/uploads/2022/05/564-amb.jpg"],
    link: "/product-category/white",
    column: 4,
  },
  {
    id: "geometric",
    slug: "geometric",
    name: "Geometric",
    subtitle: "Bold Shapes & Interlocking Motifs",
    shortDesc: "Shapes that speak style.",
    description: "Graphic 3D patterns, chevron arrays, and interlocking geometric forms for contemporary feature walls.",
    banner: "/uploads/products/AMB_LANCASTER-GREY_BANO_result.webp",
    thumbnail: "/uploads/products/AMB_LANCASTER-GREY_BANO_result.webp",
    icon: "/images/collections/geometric.svg",
    featured: false,
    productCount: 16,
    previewImages: ["/uploads/products/AMB_LANCASTER-GREY_BANO_result.webp"],
    link: "/product-category/geometric",
    column: 0,
  },
  {
    id: "fabric",
    slug: "fabric",
    name: "Fabric",
    subtitle: "Woven Linen & Soft Textile Porcelain",
    shortDesc: "Soft tactile linen, canvas, and tweed fabric weaves captured in durable porcelain.",
    description: "Combines the warm acoustic cozy feel of wallpaper and woven textiles with water-resistant ceramic durability.",
    banner: "/uploads/products/9005-AMB-6.webp",
    thumbnail: "/uploads/products/9005-AMB-6.webp",
    icon: "/images/collections/fabric.svg",
    featured: false,
    productCount: 14,
    previewImages: ["/uploads/products/9005-AMB-6.webp"],
    link: "/product-category/fabric",
    column: 4,
  },
  {
    id: "vestige",
    slug: "vestige",
    name: "Vestige Series",
    subtitle: "Rich Textures & Timeless Tones in Harmony",
    shortDesc: "Rich textures and timeless tones in harmony.",
    description: "Rich textures and timeless tones in harmony for premium architectural surfaces.",
    banner: "https://www.timexceramic.com/wp-content/uploads/2026/06/amb2_cmyk.webp",
    thumbnail: "https://www.timexceramic.com/wp-content/uploads/2026/06/amb2_cmyk.webp",
    icon: "/images/collections/stone.svg",
    featured: true,
    productCount: 18,
    previewImages: ["https://www.timexceramic.com/wp-content/uploads/2026/06/amb2_cmyk.webp"],
    link: "/product-category/vestige",
    column: 1,
  },
  {
    id: "combo",
    slug: "combo",
    name: "Combo Series",
    subtitle: "Striking Patterns Tailored for Modern Spaces",
    shortDesc: "Striking patterns tailored for modern spaces.",
    description: "Striking patterns tailored for modern spaces and contemporary interiors.",
    banner: "https://www.timexceramic.com/wp-content/uploads/2026/03/Combo-Burdeos-240x740-AMB.webp",
    thumbnail: "https://www.timexceramic.com/wp-content/uploads/2026/03/Combo-Burdeos-240x740-AMB.webp",
    icon: "/images/collections/brick.svg",
    featured: true,
    productCount: 20,
    previewImages: ["https://www.timexceramic.com/wp-content/uploads/2026/03/Combo-Burdeos-240x740-AMB.webp"],
    link: "/product-category/combo",
    column: 1,
  },
  {
    id: "lumina",
    slug: "lumina",
    name: "Lumina Series",
    subtitle: "Subtle Elegance That Brightens Every Corner",
    shortDesc: "Subtle elegance that brightens every corner.",
    description: "Subtle elegance that brightens every corner with luminous glazes.",
    banner: "https://www.timexceramic.com/wp-content/uploads/2026/06/Lumina-Oyster-1.webp",
    thumbnail: "https://www.timexceramic.com/wp-content/uploads/2026/06/Lumina-Oyster-1.webp",
    icon: "/images/collections/moroccan.svg",
    featured: true,
    productCount: 22,
    previewImages: ["https://www.timexceramic.com/wp-content/uploads/2026/06/Lumina-Oyster-1.webp"],
    link: "/product-category/lumina",
    column: 1,
  },
  {
    id: "delormo-series",
    slug: "delormo-series",
    name: "Delormo Series",
    subtitle: "Organic Patterns & Warm Earth Tones",
    shortDesc: "Organic patterns and warm tones that bring nature indoors.",
    description: "Organic patterns and warm tones crafted to bring nature indoors with sophisticated terracotta and stone textures.",
    banner: "https://www.timexceramic.com/wp-content/uploads/2026/06/AMBIENTE-DELORMO-Adrien-1.webp",
    thumbnail: "https://www.timexceramic.com/wp-content/uploads/2026/06/AMBIENTE-DELORMO-Adrien-1.webp",
    icon: "/images/collections/brick.svg",
    featured: true,
    isNew: true,
    productCount: 16,
    previewImages: ["https://www.timexceramic.com/wp-content/uploads/2026/06/AMBIENTE-DELORMO-Adrien-1.webp"],
    link: "/product-category/delormo-series",
    column: 1,
  },
  {
    id: "nazca-series",
    slug: "nazca-series",
    name: "Nazca Series",
    subtitle: "Architectural Stone Pavers & Earth Patinas",
    shortDesc: "Architectural stone pavers with natural earth patinas.",
    description: "Architectural stone pavers with natural earth patinas designed for high-traffic grandeur.",
    banner: "https://www.timexceramic.com/wp-content/uploads/2026/06/AMB_NAZCA-BEIGE.webp",
    thumbnail: "https://www.timexceramic.com/wp-content/uploads/2026/06/AMB_NAZCA-BEIGE.webp",
    icon: "/images/collections/stone.svg",
    featured: true,
    isNew: true,
    productCount: 18,
    previewImages: ["https://www.timexceramic.com/wp-content/uploads/2026/06/AMB_NAZCA-BEIGE.webp"],
    link: "/product-category/nazca-series",
    column: 1,
  },
  {
    id: "pigmenta-series",
    slug: "pigmenta-series",
    name: "Pigmenta Series",
    subtitle: "Subtle Hues & Artisanal Finishes",
    shortDesc: "Subtle hues and artisanal finishes for contemporary spaces.",
    description: "Subtle hues and artisanal finishes for contemporary spaces, featuring satin glazes and pigmented tones.",
    banner: "https://www.timexceramic.com/wp-content/uploads/2026/06/AM_T48_PIGMENTA_AZUL_40X120_DET_HD.webp",
    thumbnail: "https://www.timexceramic.com/wp-content/uploads/2026/06/AM_T48_PIGMENTA_AZUL_40X120_DET_HD.webp",
    icon: "/images/collections/colorful.svg",
    featured: true,
    isNew: true,
    productCount: 20,
    previewImages: ["https://www.timexceramic.com/wp-content/uploads/2026/06/AM_T48_PIGMENTA_AZUL_40X120_DET_HD.webp"],
    link: "/product-category/pigmenta-series",
    column: 3,
  },
  {
    id: "boutique-series",
    slug: "boutique-series",
    name: "Boutique Series",
    subtitle: "Limited Edition Luxury Surface Boards",
    shortDesc: "Limited edition luxury surface boards with custom edge treatments.",
    description: "Limited edition luxury surface boards with custom edge treatments.",
    banner: "https://www.timexceramic.com/wp-content/uploads/2024/11/kyoto-snow-palace.jpg",
    thumbnail: "https://www.timexceramic.com/wp-content/uploads/2024/11/kyoto-snow-palace.jpg",
    icon: "/images/collections/boutique.svg",
    featured: true,
    isNew: true,
    productCount: 12,
    previewImages: ["https://www.timexceramic.com/wp-content/uploads/2024/11/kyoto-snow-palace.jpg"],
    link: "/product-category/boutique-series",
    column: 2,
  },
  {
    id: "french-frames-series",
    slug: "french-frames-series",
    name: "French Frames Series",
    subtitle: "Neoclassical Molded Panels & Boiserie Tiles",
    shortDesc: "Neoclassical molded boiserie panels and picture-frame moldings.",
    description: "Neoclassical molded boiserie panels and picture-frame moldings.",
    banner: "https://www.timexceramic.com/wp-content/uploads/2025/08/timex-ceramic-marly-series-green-black-tiles-matt-finish-tiles-ambience.jpg",
    thumbnail: "https://www.timexceramic.com/wp-content/uploads/2025/08/timex-ceramic-marly-series-green-black-tiles-matt-finish-tiles-ambience.jpg",
    icon: "/images/collections/french-frames.svg",
    featured: true,
    isNew: true,
    productCount: 14,
    previewImages: ["https://www.timexceramic.com/wp-content/uploads/2025/08/timex-ceramic-marly-series-green-black-tiles-matt-finish-tiles-ambience.jpg"],
    link: "/product-category/french-frames-series",
    column: 3,
  },
  {
    id: "terrazzo-series",
    slug: "terrazzo-series",
    name: "Terrazzo Series",
    subtitle: "Mid-Century Aggregate Mineral Formations",
    shortDesc: "Mid-century aggregate mineral formations and speckled marble visuals.",
    description: "Mid-century aggregate mineral formations and speckled marble visuals.",
    banner: "https://www.timexceramic.com/wp-content/uploads/2024/11/12001-amb.jpg",
    thumbnail: "https://www.timexceramic.com/wp-content/uploads/2024/11/12001-amb.jpg",
    icon: "/images/collections/terrazzo.svg",
    featured: true,
    isNew: true,
    productCount: 15,
    previewImages: ["https://www.timexceramic.com/wp-content/uploads/2024/11/12001-amb.jpg"],
    link: "/product-category/terrazzo-series",
    column: 4,
  },
];

// Populate high-resolution category photography for all collections
COLLECTIONS.forEach((c) => {
  if (!c.banner.startsWith("http")) c.banner = getCategoryBanner(c.id);
  if (!c.thumbnail.startsWith("http")) c.thumbnail = getCategoryThumbnail(c.id);
  if (!c.previewImages[0]?.startsWith("http")) c.previewImages = getCategoryDummyImages(c.id).slice(0, 3);
});

function getMergedCollections(): Collection[] {
  if (typeof window === "undefined") {
    try {
      const fs = eval("require")("fs");
      const path = eval("require")("path");
      const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
      const storePath =
        isServerless && fs.existsSync("/tmp/data/store.json")
          ? "/tmp/data/store.json"
          : path.resolve(process.cwd(), "server/data/store.json");

      if (fs.existsSync(storePath)) {
        const content = fs.readFileSync(storePath, "utf8");
        const data = JSON.parse(content);
        const customCats = Array.isArray(data.custom_categories) ? data.custom_categories : [];
        const deletedIds = new Set(
          Array.isArray(data.deleted_category_ids)
            ? data.deleted_category_ids.map((s: string) => String(s).toLowerCase().trim())
            : []
        );

        let merged = COLLECTIONS.filter(
          (c) => !deletedIds.has(c.slug.toLowerCase()) && !deletedIds.has(c.id.toLowerCase())
        );

        // Apply custom updates to existing collections
        merged = merged.map((col) => {
          const colSlug = col.slug.toLowerCase();
          const match = customCats.find(
            (c: any) => {
              const cSlug = (c.slug || "").toLowerCase();
              const cAlias = cSlug === "colourful" ? "colorful" : cSlug === "colorful" ? "colourful" : cSlug;
              return cSlug === colSlug || cAlias === colSlug || (c.id && c.id.toLowerCase() === col.id.toLowerCase());
            }
          );
          if (match) {
            const resolvedBanner = match.banner || col.banner;
            return {
              ...col,
              name: match.name || col.name,
              banner: resolvedBanner,
              thumbnail: resolvedBanner,
              previewImages: [resolvedBanner],
              shortDesc: match.metaDescription || match.description || col.shortDesc,
              description: match.description || col.description,
              productCount: match.productCount !== undefined ? match.productCount : col.productCount,
            };
          }
          return col;
        });

        // Add brand new custom categories
        const existingSlugs = new Set(merged.map((c) => c.slug.toLowerCase()));
        for (const cat of customCats) {
          const slug = (cat.slug || "").toLowerCase();
          if (slug && !existingSlugs.has(slug) && !deletedIds.has(slug) && cat.status !== "draft") {
            existingSlugs.add(slug);
            merged.push({
              id: cat.id || `cat-${slug}`,
              slug: cat.slug,
              name: cat.name,
              subtitle: cat.seoTitle || `${cat.name} Luxury Slabs & Tiles`,
              shortDesc: cat.metaDescription || cat.description || "",
              description: cat.description || `Explore ${cat.name} curated collection from Timex Ceramic.`,
              banner: cat.banner || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
              thumbnail: cat.banner || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
              icon: `/images/collections/${slug}.svg`,
              featured: false,
              productCount: cat.productCount || 0,
              previewImages: [cat.banner || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"],
              link: `/product-category/${cat.slug}`,
              column: 1,
            });
          }
        }
        return merged;
      }
    } catch (e) {
      // fallback
    }
  }
  return COLLECTIONS;
}

export function getAllCollections(): Collection[] {
  return getMergedCollections();
}

export function getFeaturedCollections(): Collection[] {
  return getAllCollections().filter((c) => c.featured);
}

export function getNewCollections(): Collection[] {
  const all = getAllCollections();
  const newItems = all.filter((c) => c.isNew);
  if (newItems.length > 0) return newItems;
  return all.filter((c) => ["brick", "stone", "colorful", "boutique", "french-frames", "terrazzo", "moroccan"].includes(c.id));
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  const cleanSlug = slug.toLowerCase();
  const aliasSlug = cleanSlug === "colourful" ? "colorful" : cleanSlug === "colorful" ? "colourful" : cleanSlug;
  const all = getMergedCollections();
  return all.find(
    (c) =>
      c.slug.toLowerCase() === cleanSlug ||
      c.id.toLowerCase() === cleanSlug ||
      c.slug.toLowerCase() === aliasSlug ||
      c.id.toLowerCase() === aliasSlug ||
      cleanSlug.replace("-series", "") === c.slug.toLowerCase() ||
      cleanSlug.replace("-series", "") === c.id.toLowerCase()
  );
}

export function getCollectionsByColumn(): Collection[][] {
  return [
    COLLECTIONS.filter((c) => c.column === 1),
    COLLECTIONS.filter((c) => c.column === 2),
    COLLECTIONS.filter((c) => c.column === 3),
    COLLECTIONS.filter((c) => c.column === 4),
  ];
}
