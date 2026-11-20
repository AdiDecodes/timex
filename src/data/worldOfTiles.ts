export interface WorldOfTilesCategory {
  name: string;
  slug: string;
  link: string;
  referenceImage: string;
  fallbackImage?: string;
  liveImage?: string;
}

export interface TileRowConfig {
  id: string;
  columns: 2 | 3;
  categories: WorldOfTilesCategory[];
}

export const WORLD_OF_TILES_ROWS: TileRowConfig[] = [
  // Row 1: 2 columns: BRICK, HEXAGON
  {
    id: "row-1",
    columns: 2,
    categories: [
      {
        name: "BRICK",
        slug: "brick",
        link: "/product-category/brick/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/02/Harlem-home-img.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2025/08/timex-ceramic-harlem-series-blue-wall-and-floor-tiles-shiny-finish-tiles-ambience.jpg",
      },
      {
        name: "HEXAGON",
        slug: "hexagon",
        link: "/product-category/hexagon/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/Lancaster-home-thumb.jpg",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2025/05/Lancaster-amb1.jpg",
      },
    ],
  },
  // Row 2: 2 columns: MARBLE, MODULAR
  {
    id: "row-2",
    columns: 2,
    categories: [
      {
        name: "MARBLE",
        slug: "marble",
        link: "/product-category/marble/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/06/Amb07_CMYK.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2022/10/204-Conept-Ambiance1.jpg",
      },
      {
        name: "MODULAR",
        slug: "modular",
        link: "/product-category/modular/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/09/Modula-Cambridge-Bone-AMB-2-scaled.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2024/02/clinker-amb1.jpg",
      },
    ],
  },
  // Row 3: 3 columns: STONE, SUBWAY, MOROCCAN
  {
    id: "row-3",
    columns: 3,
    categories: [
      {
        name: "STONE",
        slug: "stone",
        link: "/product-category/stone/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/09/COUNTRY-GRAFITO-200X600-AMB-scaled.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2026/06/AMB_NAZCA-BEIGE.webp",
      },
      {
        name: "SUBWAY",
        slug: "subway",
        link: "/product-category/subway/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/09/Picket-Modern-Obsidian-AMB-2-scaled.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2025/02/Makalu-amb.jpg",
      },
      {
        name: "MOROCCAN",
        slug: "moroccan",
        link: "/product-category/moroccan/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/09/Elegance-Deco-Blu-Green-AMB-scaled.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/1004-01.webp",
      },
    ],
  },
  // Row 4: 2 columns: OCTAGONAL, WOODEN
  {
    id: "row-4",
    columns: 2,
    categories: [
      {
        name: "OCTAGONAL",
        slug: "octagonal",
        link: "/product-category/octagonal/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/Aspdin-Cotto-Star-Amb1-n.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2024/05/Ambiente-Betera-Blanco-amb.jpg",
      },
      {
        name: "WOODEN",
        slug: "wooden",
        link: "/product-category/wooden/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/06/AMBIENTE-DELORMO-Pira-mocha.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2024/07/Couvet-Roble-amb.jpg",
      },
    ],
  },
  // Row 5: 3 columns: TEXTURE, COLORFUL, FABRIC
  {
    id: "row-5",
    columns: 3,
    categories: [
      {
        name: "TEXTURE",
        slug: "texture",
        link: "/product-category/texture/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/06/Pigmenta-Materia-Beige-Pigmenta-Verde.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2024/11/8002-amb.jpg",
      },
      {
        name: "COLORFUL",
        slug: "colorful",
        link: "/product-category/colorful/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/06/Lumina-Acorn-1.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2025/12/Blinds-Ambience1.jpg",
      },
      {
        name: "FABRIC",
        slug: "fabric",
        link: "/product-category/fabric/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/9005-06-home.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2023/11/Fabric-Crema-Tropical-Amb.jpg",
      },
    ],
  },
  // Row 6: 3 columns: TERRAZZO, TROPICAL, METALLIC
  {
    id: "row-6",
    columns: 3,
    categories: [
      {
        name: "TERRAZZO",
        slug: "terrazzo",
        link: "/product-category/terrazzo/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/12001-amb.jpg",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2024/11/12001-amb.jpg",
      },
      {
        name: "TROPICAL",
        slug: "tropical",
        link: "/product-category/tropical/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/1004-series-home.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/1004-01-650x650.webp",
      },
      {
        name: "METALLIC",
        slug: "metallic",
        link: "/product-category/metallic/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/09/Argos-Steel-AMB-scaled.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2022/05/202-light-amb-newly.jpg",
      },
    ],
  },
  // Row 7: 2 columns: HIGHLIGHTER, WHITE
  {
    id: "row-7",
    columns: 2,
    categories: [
      {
        name: "HIGHLIGHTER",
        slug: "highlighter",
        link: "/product-category/highlighter/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/timex-ceramic-highlighter-wall-tiles-5024-white-gold-tiles-ambience.webp",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2022/05/5136-amb-n.jpg",
      },
      {
        name: "WHITE",
        slug: "white",
        link: "/product-category/white/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/507-amb.jpg",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2022/05/564-amb.jpg",
      },
    ],
  },
  // Row 8: 3 columns: MOSAIC, BOUTIQUE, FRENCH FRAMES
  {
    id: "row-8",
    columns: 3,
    categories: [
      {
        name: "MOSAIC",
        slug: "mosaic",
        link: "/product-category/mosaic/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/timex-ceramic-gm-series-white-wall-tiles-shiny-finish-tiles-ambience.jpg",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2023/11/GM-02-Blue-Amb.jpg",
      },
      {
        name: "BOUTIQUE",
        slug: "boutique",
        link: "/product-category/boutique/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/Colonial-amb1.jpg",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2024/11/kyoto-snow-palace.jpg",
      },
      {
        name: "FRENCH FRAMES",
        slug: "french-frames",
        link: "/product-category/french-frames/",
        referenceImage: "https://www.timexceramic.com/wp-content/uploads/2026/03/Fables-Amb1.jpg",
        fallbackImage: "https://www.timexceramic.com/wp-content/uploads/2025/12/Fables-Amb1.jpg",
      },
    ],
  },
];

