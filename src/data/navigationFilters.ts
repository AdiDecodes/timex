/**
 * Canonical Navigation and Filter Configuration
 * Single source of truth powering:
 * 1. Footer "EXPLORE TILES BY"
 * 2. Header "WORLD OF TILES" Mega Menu
 * 3. Product filter options
 * 4. Landing / filter URLs and dynamic ordering
 */

import { matchesProductCategory } from "@/utils/productCategories";

export interface FilterItem {
  name: string;
  href: string;
  slug: string;
  filterKey: string;
  filterValue: string;
}

export interface NavigationFilterGroup {
  id: string;
  title: string;
  footerTitle: string;
  viewAllHref: string;
  filterKey: string;
  items: FilterItem[];
}

export function sizeToSlug(s: string): string {
  let cleaned = s.toLowerCase().trim();
  if (cleaned.includes("format")) {
    return cleaned.replace(/\s+tiles$/, "").replace(/\s+/g, "-") + "-size-tiles";
  }
  cleaned = cleaned.replace(/\s*x\s*/gi, "x");
  cleaned = cleaned.replace(/mm/gi, "");
  return `${cleaned}mm-size-tiles`;
}

// 1. Bylook
export const BYLOOK_ITEMS: FilterItem[] = [
  { name: "Brick", href: "/product-category/brick", slug: "brick", filterKey: "category", filterValue: "brick" },
  { name: "Marble", href: "/product-category/marble", slug: "marble", filterKey: "category", filterValue: "marble" },
  { name: "Hexagon", href: "/product-category/hexagon", slug: "hexagon", filterKey: "category", filterValue: "hexagon" },
  { name: "Modular", href: "/product-category/modular", slug: "modular", filterKey: "category", filterValue: "modular" },
  { name: "Stone", href: "/product-category/stone", slug: "stone", filterKey: "category", filterValue: "stone" },
  { name: "Subway", href: "/product-category/subway", slug: "subway", filterKey: "category", filterValue: "subway" },
  { name: "Moroccan", href: "/product-category/moroccan", slug: "moroccan", filterKey: "category", filterValue: "moroccan" },
  { name: "Octagonal", href: "/product-category/octagonal", slug: "octagonal", filterKey: "category", filterValue: "octagonal" },
  { name: "Wooden", href: "/product-category/wooden", slug: "wooden", filterKey: "category", filterValue: "wooden" },
  { name: "Texture", href: "/product-category/texture", slug: "texture", filterKey: "category", filterValue: "texture" },
  { name: "Colorful", href: "/product-category/colorful", slug: "colorful", filterKey: "category", filterValue: "colorful" },
  { name: "Terrazzo", href: "/product-category/terrazzo", slug: "terrazzo", filterKey: "category", filterValue: "terrazzo" },
  { name: "Tropical", href: "/product-category/tropical", slug: "tropical", filterKey: "category", filterValue: "tropical" },
  { name: "Metallic", href: "/product-category/metallic", slug: "metallic", filterKey: "category", filterValue: "metallic" },
  { name: "Highlighter", href: "/product-category/highlighter", slug: "highlighter", filterKey: "category", filterValue: "highlighter" },
  { name: "Mosaic", href: "/product-category/mosaic", slug: "mosaic", filterKey: "category", filterValue: "mosaic" },
  { name: "Boutique", href: "/product-category/boutique", slug: "boutique", filterKey: "category", filterValue: "boutique" },
  { name: "French frames", href: "/product-category/french-frames", slug: "french-frames", filterKey: "category", filterValue: "french-frames" },
  { name: "Fabric", href: "/product-category/fabric", slug: "fabric", filterKey: "category", filterValue: "fabric" },
];

// 2. Tiles From
export const TILES_FROM_ITEMS: FilterItem[] = [
  { name: "Imported Tiles", href: "/imported-tiles", slug: "imported-tiles", filterKey: "origin", filterValue: "Imported Tiles" },
  { name: "Italian Tiles", href: "/italian-tiles", slug: "italian-tiles", filterKey: "origin", filterValue: "Italian Tiles" },
  { name: "Spanish Tiles", href: "/spanish-tiles", slug: "spanish-tiles", filterKey: "origin", filterValue: "Spanish Tiles" },
  { name: "European Tiles", href: "/european-tiles", slug: "european-tiles", filterKey: "origin", filterValue: "European Tiles" },
];

// 3. Tiles by Uses / Application
export const APPLICATION_ITEMS: FilterItem[] = [
  { name: "Wall", href: "/wall-tiles", slug: "wall-tiles", filterKey: "application", filterValue: "Wall" },
  { name: "Floor", href: "/floor-tiles", slug: "floor-tiles", filterKey: "application", filterValue: "Floor" },
  { name: "Wall & Floor", href: "/wall-floor-tiles", slug: "wall-floor-tiles", filterKey: "application", filterValue: "Wall & Floor" },
  { name: "Exterior", href: "/exterior-tiles", slug: "exterior-tiles", filterKey: "application", filterValue: "Exterior" },
];

// 4. Tile by Types / Material
export const MATERIAL_ITEMS: FilterItem[] = [
  { name: "Ceramic Tiles", href: "/ceramic-tiles", slug: "ceramic-tiles", filterKey: "material", filterValue: "Ceramic Tiles" },
  { name: "Porcelain Tiles", href: "/porcelain-tiles", slug: "porcelain-tiles", filterKey: "material", filterValue: "Porcelain Tiles" },
  { name: "Designer Tiles", href: "/designer-tiles", slug: "designer-tiles", filterKey: "material", filterValue: "Designer Tiles" },
  { name: "Anti Skid Tiles", href: "/anti-skid-tiles", slug: "anti-skid-tiles", filterKey: "material", filterValue: "Anti Skid Tiles" },
];

// 5. Tiles by Space / Area
export const SPACE_ITEMS: FilterItem[] = [
  { name: "Bathroom Tiles", href: "/bathroom-tiles", slug: "bathroom-tiles", filterKey: "space", filterValue: "Bathroom Tiles" },
  { name: "Kitchen Tiles", href: "/kitchen-tiles", slug: "kitchen-tiles", filterKey: "space", filterValue: "Kitchen Tiles" },
  { name: "Living & Dining Room Tiles", href: "/living-dining-room-tiles", slug: "living-dining-room-tiles", filterKey: "space", filterValue: "Living & Dining Room Tiles" },
  { name: "Bedroom Tiles", href: "/bedroom-tiles", slug: "bedroom-tiles", filterKey: "space", filterValue: "Bedroom Tiles" },
  { name: "Balcony & Terrace Tiles", href: "/balcony-terrace-tiles", slug: "balcony-terrace-tiles", filterKey: "space", filterValue: "Balcony & Terrace Tiles" },
  { name: "Elevation & Exterior Tiles", href: "/elevation-exterior-tiles", slug: "elevation-exterior-tiles", filterKey: "space", filterValue: "Elevation & Exterior Tiles" },
  { name: "Hotel & Hospitality Tiles", href: "/hotel-hospitality-tiles", slug: "hotel-hospitality-tiles", filterKey: "space", filterValue: "Hotel & Hospitality Tiles" },
  { name: "Café & Restaurant Tiles", href: "/cafe-restaurant-tiles", slug: "cafe-restaurant-tiles", filterKey: "space", filterValue: "Café & Restaurant Tiles" },
  { name: "Commercial & Office Tiles", href: "/commercial-office-tiles", slug: "commercial-office-tiles", filterKey: "space", filterValue: "Commercial & Office Tiles" },
  { name: "Spa & Wellness Tiles", href: "/spa-wellness-tiles", slug: "spa-wellness-tiles", filterKey: "space", filterValue: "Spa & Wellness Tiles" },
  { name: "Swimming Pool Tiles", href: "/swimming-pool-tiles", slug: "swimming-pool-tiles", filterKey: "space", filterValue: "Swimming Pool Tiles" },
  { name: "Outdoor & Landscape Tiles", href: "/outdoor-landscape-tiles", slug: "outdoor-landscape-tiles", filterKey: "space", filterValue: "Outdoor & Landscape Tiles" },
];

// 6. Tiles by Finish
export const FINISH_ITEMS: FilterItem[] = [
  { name: "Matt", href: "/matt-finish", slug: "matt-finish", filterKey: "finish", filterValue: "Matt" },
  { name: "Glossy", href: "/glossy-finish", slug: "glossy-finish", filterKey: "finish", filterValue: "Glossy" },
  { name: "Rustic", href: "/rustic-finish", slug: "rustic-finish", filterKey: "finish", filterValue: "Rustic" },
  { name: "Textured", href: "/textured-finish", slug: "textured-finish", filterKey: "finish", filterValue: "Textured" },
  { name: "3D", href: "/3d-finish", slug: "3d-finish", filterKey: "finish", filterValue: "3D" },
  { name: "Metallic", href: "/metallic-finish", slug: "metallic-finish", filterKey: "finish", filterValue: "Metallic" },
  { name: "Hand-Made", href: "/hand-made-finish", slug: "hand-made-finish", filterKey: "finish", filterValue: "Hand-Made" },
  { name: "Modern", href: "/modern-finish", slug: "modern-finish", filterKey: "finish", filterValue: "Modern" },
  { name: "Contemporary", href: "/contemporary-finish", slug: "contemporary-finish", filterKey: "finish", filterValue: "Contemporary" },
  { name: "Vintage", href: "/vintage-finish", slug: "vintage-finish", filterKey: "finish", filterValue: "Vintage" },
];

// 7. Tiles by Shape
export const SHAPE_ITEMS: FilterItem[] = [
  { name: "Rectangle", href: "/rectangle-shape", slug: "rectangle-shape", filterKey: "shape", filterValue: "Rectangle" },
  { name: "Square", href: "/square-shape", slug: "square-shape", filterKey: "shape", filterValue: "Square" },
  { name: "Hexagon", href: "/hexagon-shape", slug: "hexagon-shape", filterKey: "shape", filterValue: "Hexagon" },
  { name: "Octagon", href: "/octagon-shape", slug: "octagon-shape", filterKey: "shape", filterValue: "Octagon" },
  { name: "Brick", href: "/brick-shape", slug: "brick-shape", filterKey: "shape", filterValue: "Brick" },
  { name: "Modular", href: "/modular-shape", slug: "modular-shape", filterKey: "shape", filterValue: "Modular" },
  { name: "Diamond", href: "/diamond-shape", slug: "diamond-shape", filterKey: "shape", filterValue: "Diamond" },
  { name: "Fishscal", href: "/fishscal-shape", slug: "fishscal-shape", filterKey: "shape", filterValue: "Fishscal" },
  { name: "Kite", href: "/kite-shape", slug: "kite-shape", filterKey: "shape", filterValue: "Kite" },
  { name: "Petal", href: "/petal-shape", slug: "petal-shape", filterKey: "shape", filterValue: "Petal" },
  { name: "Chevron", href: "/chevron-shape", slug: "chevron-shape", filterKey: "shape", filterValue: "Chevron" },
  { name: "Geometric", href: "/geometric-shape", slug: "geometric-shape", filterKey: "shape", filterValue: "Geometric" },
  { name: "Gesigner", href: "/gesigner-shape", slug: "gesigner-shape", filterKey: "shape", filterValue: "Gesigner" },
  { name: "Decorative", href: "/decorative-shape", slug: "decorative-shape", filterKey: "shape", filterValue: "Decorative" },
];

// 8. Tiles By Design
export const DESIGN_ITEMS: FilterItem[] = [
  { name: "Subway Tiles", href: "/subway-design", slug: "subway-design", filterKey: "design", filterValue: "Subway Tiles" },
  { name: "Brick Tiles", href: "/brick-design", slug: "brick-design", filterKey: "design", filterValue: "Brick Tiles" },
  { name: "Hexagon Tiles", href: "/hexagon-design", slug: "hexagon-design", filterKey: "design", filterValue: "Hexagon Tiles" },
  { name: "Moroccan Tiles", href: "/moroccan-design", slug: "moroccan-design", filterKey: "design", filterValue: "Moroccan Tiles" },
  { name: "Mosaic Tiles", href: "/mosaic-design", slug: "mosaic-design", filterKey: "design", filterValue: "Mosaic Tiles" },
  { name: "Geometric Tiles", href: "/geometric-design", slug: "geometric-design", filterKey: "design", filterValue: "Geometric Tiles" },
  { name: "Octagonal Tiles", href: "/octagonal-design", slug: "octagonal-design", filterKey: "design", filterValue: "Octagonal Tiles" },
  { name: "Modular Tiles", href: "/modular-design", slug: "modular-design", filterKey: "design", filterValue: "Modular Tiles" },
];

// 9. Tiles By Color
export const COLOR_ITEMS: FilterItem[] = [
  { name: "Beige", href: "/beige-color", slug: "beige-color", filterKey: "color", filterValue: "Beige" },
  { name: "Black", href: "/black-color", slug: "black-color", filterKey: "color", filterValue: "Black" },
  { name: "Blue", href: "/blue-color", slug: "blue-color", filterKey: "color", filterValue: "Blue" },
  { name: "Brown", href: "/brown-color", slug: "brown-color", filterKey: "color", filterValue: "Brown" },
  { name: "Colourful", href: "/colourful-color", slug: "colourful-color", filterKey: "color", filterValue: "Colourful" },
  { name: "Copper", href: "/copper-color", slug: "copper-color", filterKey: "color", filterValue: "Copper" },
  { name: "Cotto", href: "/cotto-color", slug: "cotto-color", filterKey: "color", filterValue: "Cotto" },
  { name: "Dark Wenge", href: "/dark-wenge-color", slug: "dark-wenge-color", filterKey: "color", filterValue: "Dark Wenge" },
  { name: "Gold", href: "/gold-color", slug: "gold-color", filterKey: "color", filterValue: "Gold" },
  { name: "Green", href: "/green-color", slug: "green-color", filterKey: "color", filterValue: "Green" },
  { name: "Grey", href: "/grey-color", slug: "grey-color", filterKey: "color", filterValue: "Grey" },
  { name: "Pink", href: "/pink-color", slug: "pink-color", filterKey: "color", filterValue: "Pink" },
  { name: "Red", href: "/red-color", slug: "red-color", filterKey: "color", filterValue: "Red" },
  { name: "Silver", href: "/silver-color", slug: "silver-color", filterKey: "color", filterValue: "Silver" },
  { name: "White", href: "/white-color", slug: "white-color", filterKey: "color", filterValue: "White" },
  { name: "Yellow", href: "/yellow-color", slug: "yellow-color", filterKey: "color", filterValue: "Yellow" },
];

// 10. Raw Size Names supplied in reference
export const RAW_SIZE_NAMES: string[] = [
  "Small Format Tiles",
  "Medium Format Tiles",
  "Large Format Tiles",
  "600mm X 1200mm",
  "150mm X 150mm",
  "150mm x 300mm",
  "198mm x 228mm",
  "200mm x 200mm",
  "200mm X 400mm",
  "210mm x 630mm",
  "125mm X 250mm",
  "250mm x 250mm",
  "250mm x 500mm",
  "285mm x 330mm",
  "300mm x 600mm",
  "300mm x 900mm",
  "333mm X 333mm",
  "400mm x 1200mm",
  "500mm x 500mm",
  "600mm x 1200mm",
  "200mm x 600mm",
  "300mm X 600mm",
  "600mm X 600mm",
  "60mm x 246mm",
  "65mm X 200mm",
  "442mm x 664mm",
  "75mm X 300mm",
  "300mm X 900mm",
  "110mm x 110mm",
  "1200mm X 1200mm",
  "150mm X 450mm",
  "161mm X 300mm",
  "165mm x 165mm",
  "232mm x 267mm",
  "240mm x 740mm",
  "320mm x 272mm",
  "276mm X 302mm",
  "280mm X 300mm",
  "284mm X 296mm",
  "295mm X 298mm",
  "300mm X 303mm",
  "292mm x 302mm",
  "301mm x 303mm",
  "305mm X 305mm",
  "249mm x 312mm",
  "330mm X 330mm",
  "350mm x 350mm",
  "300mm x 382mm",
  "400mm X 400mm",
  "400mm x 600mm",
  "400mm X 620mm",
  "440mm X 660mm",
  "48mm x 450mm",
  "50mm x 150mm",
  "50mm X 400mm",
  "50mmX500mm",
  "55mm x 220mm",
  "580mm x 580mm",
  "60mm X 240mm",
  "620mm X 1200mm",
  "62mm X 125mm",
  "62mm x 250mm",
  "65mm X 265mm",
  "800mm X 1800mm",
  "80mm x 200mm",
  "325mm x 330mm",
  "52mm x 160mm",
  "60mm x 260mm",
  "100mm x 100mm",
  "50mm x 300mm",
  "150mm x 900mm",
];

// Build SIZE_ITEMS with consistent slug generation
export const SIZE_ITEMS: FilterItem[] = RAW_SIZE_NAMES.map((name) => {
  const slug = sizeToSlug(name);
  return {
    name,
    href: `/${slug}`,
    slug,
    filterKey: "size",
    filterValue: name,
  };
});

// Canonical 10 Groups in Order
export const NAVIGATION_FILTER_GROUPS: NavigationFilterGroup[] = [
  {
    id: "bylook",
    title: "Bylook",
    footerTitle: "→ Bylook",
    viewAllHref: "/collections",
    filterKey: "category",
    items: BYLOOK_ITEMS,
  },
  {
    id: "tiles-from",
    title: "Tiles From",
    footerTitle: "→ Tiles From",
    viewAllHref: "/imported-tiles",
    filterKey: "origin",
    items: TILES_FROM_ITEMS,
  },
  {
    id: "application",
    title: "Tiles by Uses/Application",
    footerTitle: "→ Tiles by Uses/Application",
    viewAllHref: "/wall-tiles",
    filterKey: "application",
    items: APPLICATION_ITEMS,
  },
  {
    id: "material",
    title: "Tile by Types/Material",
    footerTitle: "→ Tile by Types/Material",
    viewAllHref: "/ceramic-tiles",
    filterKey: "material",
    items: MATERIAL_ITEMS,
  },
  {
    id: "space",
    title: "Tiles by Space/Area",
    footerTitle: "→ Tiles by Space/Area",
    viewAllHref: "/spaces",
    filterKey: "space",
    items: SPACE_ITEMS,
  },
  {
    id: "finish",
    title: "Tiles by Finish",
    footerTitle: "→ Tiles by Finish",
    viewAllHref: "/matt-finish",
    filterKey: "finish",
    items: FINISH_ITEMS,
  },
  {
    id: "shape",
    title: "Tiles by Shape",
    footerTitle: "→ Tiles by Shape",
    viewAllHref: "/rectangle-shape",
    filterKey: "shape",
    items: SHAPE_ITEMS,
  },
  {
    id: "design",
    title: "Tiles By Design",
    footerTitle: "→ Tiles By Design",
    viewAllHref: "/subway-design",
    filterKey: "design",
    items: DESIGN_ITEMS,
  },
  {
    id: "color",
    title: "Tiles By Color",
    footerTitle: "→ Tiles By Color",
    viewAllHref: "/beige-color",
    filterKey: "color",
    items: COLOR_ITEMS,
  },
  {
    id: "size",
    title: "Tiles By Size",
    footerTitle: "→ Tiles By Size",
    viewAllHref: "/600x1200mm-size-tiles",
    filterKey: "size",
    items: SIZE_ITEMS,
  },
];

export function buildDynamicFilterGroups(customCategories?: FilterItem[], customSpaces?: FilterItem[]): NavigationFilterGroup[] {
  return NAVIGATION_FILTER_GROUPS.map((group) => {
    if (group.id === "bylook" && customCategories && customCategories.length > 0) {
      return { ...group, items: customCategories };
    }
    if (group.id === "space" && customSpaces && customSpaces.length > 0) {
      return { ...group, items: customSpaces };
    }
    return group;
  });
}

// Helper: Fast Lookup by Slug
const SLUG_TO_INFO_MAP = new Map<string, { group: NavigationFilterGroup; item: FilterItem }>();

NAVIGATION_FILTER_GROUPS.forEach((group) => {
  group.items.forEach((item) => {
    // Map item slug (e.g. "wall-tiles", "ceramic-tiles", "matt-finish")
    const cleanSlug = item.slug.toLowerCase().trim();
    if (!SLUG_TO_INFO_MAP.has(cleanSlug)) {
      SLUG_TO_INFO_MAP.set(cleanSlug, { group, item });
    }
  });
});

export interface FilterRouteMatch {
  group: NavigationFilterGroup;
  item: FilterItem;
  pageTitle: string;
  pageDescription: string;
  pageEyebrow: string;
  canonicalUrl: string;
}

export function getFilterRouteInfo(slug: string): FilterRouteMatch | null {
  const norm = slug.toLowerCase().trim();
  const match = SLUG_TO_INFO_MAP.get(norm);
  if (!match) {
    if (norm.endsWith("-color")) {
      const rawColorSlug = norm.replace(/-color$/, "");
      const formattedName = rawColorSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      const colorGroup: NavigationFilterGroup = NAVIGATION_FILTER_GROUPS.find((g) => g.id === "color") || {
        id: "color",
        title: "By Color",
        filterKey: "color",
        items: [],
        footerTitle: "Explore All Colors",
        viewAllHref: "/products",
      };

      const dynamicItem: FilterItem = {
        name: formattedName,
        href: `/${norm}`,
        slug: norm,
        filterKey: "color",
        filterValue: formattedName,
      };

      return {
        group: colorGroup,
        item: dynamicItem,
        pageTitle: `${formattedName} Color Tiles`,
        pageDescription: `Discover Timex Ceramic's exclusive ${formattedName} collection. Engineered with high-durability porcelain and imported ceramic craftsmanship for luxury spaces.`,
        pageEyebrow: "TILES BY COLOR",
        canonicalUrl: `https://www.timexceramic.com/${norm}`,
      };
    }
    return null;
  }

  const { group, item } = match;
  let pageTitle = `${item.name} | Luxury Tiles`;
  let pageEyebrow = group.title.toUpperCase();

  if (group.id === "application") {
    pageTitle = `${item.name} Tiles`;
    pageEyebrow = "TILES BY APPLICATION";
  } else if (group.id === "material") {
    pageTitle = item.name;
    pageEyebrow = "TILES BY MATERIAL";
  } else if (group.id === "finish") {
    pageTitle = `${item.name} Finish Tiles`;
    pageEyebrow = "TILES BY FINISH";
  } else if (group.id === "shape") {
    pageTitle = `${item.name} Shape Tiles`;
    pageEyebrow = "TILES BY SHAPE";
  } else if (group.id === "design") {
    pageTitle = item.name.endsWith("Tiles") ? item.name : `${item.name} Tiles`;
    pageEyebrow = "TILES BY DESIGN";
  } else if (group.id === "color") {
    pageTitle = `${item.name} Color Tiles`;
    pageEyebrow = "TILES BY COLOR";
  } else if (group.id === "size") {
    pageTitle = `${item.name} Size Tiles`;
    pageEyebrow = "TILES BY SIZE";
  } else if (group.id === "tiles-from") {
    pageTitle = item.name;
    pageEyebrow = "TILES FROM";
  }

  const pageDescription = `Discover Timex Ceramic's exclusive ${item.name} collection. Engineered with high-durability porcelain and imported ceramic craftsmanship for luxury spaces.`;
  const canonicalUrl = `https://www.timexceramic.com/${item.slug}`;

  return {
    group,
    item,
    pageTitle,
    pageDescription,
    pageEyebrow,
    canonicalUrl,
  };
}

/**
 * Returns dynamic order of filter keys according to Requirement 15.
 * The entry filter group MUST appear FIRST.
 */
export function getOrderedFilterKeys(primaryGroup?: string): string[] {
  const standardOrder = [
    "category",
    "application",
    "material",
    "space",
    "finish",
    "shape",
    "design",
    "color",
    "size",
    "origin",
  ];

  if (!primaryGroup) return standardOrder;

  const p = primaryGroup.toLowerCase().trim();

  // Define tailored sequence for each entry group as specified in Requirement 15
  switch (p) {
    case "application":
      return ["application", "category", "material", "space", "finish", "shape", "design", "color", "size", "origin"];
    case "material":
      return ["material", "category", "application", "space", "finish", "shape", "design", "color", "size", "origin"];
    case "space":
    case "spacearea":
      return ["space", "category", "application", "material", "finish", "shape", "design", "color", "size", "origin"];
    case "finish":
      return ["finish", "category", "application", "material", "space", "shape", "design", "color", "size", "origin"];
    case "shape":
      return ["shape", "category", "application", "material", "space", "finish", "design", "color", "size", "origin"];
    case "design":
      return ["design", "category", "application", "material", "space", "finish", "shape", "color", "size", "origin"];
    case "color":
      return ["color", "category", "application", "material", "space", "finish", "shape", "design", "size", "origin"];
    case "size":
      return ["size", "category", "application", "material", "space", "finish", "shape", "design", "color", "origin"];
    case "origin":
    case "tiles-from":
      return ["origin", "category", "application", "material", "space", "finish", "shape", "design", "color", "size"];
    default:
      return standardOrder;
  }
}

/**
 * Robust matcher checking if a product satisfies a given filter criterion.
 */
export function matchProductWithFilter(product: any, filterKey: string, filterValue: string): boolean {
  if (!product || !filterValue) return true;
  const val = filterValue.toLowerCase().trim();

  switch (filterKey) {
    case "application": {
      const app = (product.application || product.usage || "").toLowerCase();
      if (!app) return false;
      if (val === "wall") {
        return app.includes("wall");
      }
      if (val === "floor") {
        return app.includes("floor");
      }
      if (val.includes("wall & floor") || val === "wall-floor") {
        return (app.includes("wall") && app.includes("floor")) || app.includes("wall & floor");
      }
      if (val === "exterior") {
        return app.includes("exterior") || app.includes("outdoor") || app.includes("facade");
      }
      return app.includes(val);
    }

    case "material": {
      const mat = (product.material || product.type || product.category || "").toLowerCase();
      if (val.includes("ceramic")) return mat.includes("ceramic");
      if (val.includes("porcelain")) return mat.includes("porcelain") || mat.includes("vitrified");
      if (val.includes("designer")) return mat.includes("designer") || product.isBestseller || product.isNewArrival;
      if (val.includes("anti skid")) {
        const fin = (product.finish || "").toLowerCase();
        return mat.includes("anti skid") || fin.includes("rustic") || fin.includes("textured");
      }
      return mat.includes(val);
    }

    case "space": {
      const rawSpace = product.tilesBySpace || product.tiles_by_space || product.spaceArea || product.spaces || product.space || "";
      const spaceList = Array.isArray(rawSpace)
        ? rawSpace
        : String(rawSpace).split(",").map((s) => s.trim());

      const targetBase = val.replace(/\s+tiles$/, "").replace(/-tiles$/, "");

      return spaceList.some((entry) => {
        const pSpace = String(entry || "").toLowerCase().trim();
        if (!pSpace || pSpace === "not specified") return false;
        const pBase = pSpace.replace(/\s+tiles$/, "").replace(/-tiles$/, "");
        return (
          pSpace === val ||
          pBase === targetBase ||
          pSpace.includes(targetBase) ||
          (targetBase.includes("living") && targetBase.includes("dining") && (pSpace.includes("living") || pSpace.includes("dining"))) ||
          (targetBase.includes("cafe") && (pSpace.includes("cafe") || pSpace.includes("restaurant"))) ||
          (targetBase.includes("restaurant") && (pSpace.includes("cafe") || pSpace.includes("restaurant"))) ||
          (targetBase.includes("commercial") && (pSpace.includes("commercial") || pSpace.includes("office"))) ||
          (targetBase.includes("office") && (pSpace.includes("commercial") || pSpace.includes("office"))) ||
          (targetBase.includes("elevation") && (pSpace.includes("elevation") || pSpace.includes("exterior") || pSpace.includes("wall"))) ||
          (targetBase.includes("exterior") && (pSpace.includes("elevation") || pSpace.includes("exterior"))) ||
          (targetBase.includes("hotel") && (pSpace.includes("hotel") || pSpace.includes("hospitality"))) ||
          (targetBase.includes("outdoor") && (pSpace.includes("outdoor") || pSpace.includes("landscape") || pSpace.includes("parking"))) ||
          (targetBase.includes("spa") && pBase.includes("spa")) ||
          (targetBase.includes("balcony") && (pBase.includes("balcony") || pBase.includes("terrace"))) ||
          (targetBase.includes("terrace") && (pBase.includes("balcony") || pBase.includes("terrace")))
        );
      });
    }

    case "finish": {
      const pFin = (product.finish || "").toLowerCase().trim();
      if (!pFin) return false;
      if (val === "matt" || val === "matte") {
        return pFin === "matt" || pFin === "matte" || pFin.includes("matt");
      }
      if (val === "glossy") {
        return pFin.includes("gloss") || pFin.includes("shiny") || pFin.includes("polish");
      }
      if (val === "rustic") return pFin.includes("rustic");
      if (val === "textured") return pFin.includes("texture") || pFin.includes("carving") || pFin.includes("fluted");
      if (val === "3d") return pFin.includes("3d") || pFin.includes("texture");
      if (val === "metallic") return pFin.includes("metallic");
      if (val.includes("hand-made") || val.includes("handmade")) return pFin.includes("hand") || pFin.includes("cotto");
      return pFin.includes(val);
    }

    case "shape": {
      const pShape = (
        product.shape ||
        product.tilesByShape ||
        product.tiles_by_shape ||
        product.customShape ||
        product.look ||
        ""
      ).toLowerCase();
      if (!pShape) return false;
      const targetShape = val.replace(/-shape$/, "").replace(/\s+shape$/, "");
      return pShape.includes(targetShape);
    }

    case "design": {
      const pLook = (product.look || product.pattern || product.tilePattern || product.category || "").toLowerCase();
      const targetDesign = val.replace(/\s+tiles$/, "").replace(/-design$/, "");
      return pLook.includes(targetDesign);
    }

    case "color": {
      const target = val.replace(/-color$/, "").toLowerCase().trim();
      const pColor = (product.color || "").toLowerCase().trim();
      const availColors: string[] = Array.isArray(product.availableColors)
        ? (product.availableColors as unknown[]).map((c) => String(c).toLowerCase().trim())
        : [];

      const matchesTarget = (colorStr: string): boolean => {
        if (!colorStr) return false;
        if (target === "colourful" || target === "colorful") {
          return colorStr.includes("colour") || colorStr.includes("color");
        }
        if (target === "grey" || target === "gray") {
          return colorStr.includes("grey") || colorStr.includes("gray");
        }
        const cleanStr = colorStr.replace(/-/g, " ");
        const cleanTarget = target.replace(/-/g, " ");
        return cleanStr === cleanTarget || cleanStr.includes(cleanTarget) || cleanTarget.includes(cleanStr);
      };

      if (matchesTarget(pColor)) return true;
      if (availColors.some((c: string) => matchesTarget(c))) return true;
      return false;
    }

    case "size": {
      const pSize = (product.size || "").toLowerCase().replace(/\s*x\s*/g, "x").replace(/mm/g, "").trim();
      const targetSize = val.toLowerCase().trim();

      if (targetSize.includes("small format")) {
        // dimensions <= 300mm or small
        const matches = pSize.match(/(\d+)/g);
        if (matches) {
          const maxDim = Math.max(...matches.map(Number));
          return maxDim <= 300;
        }
        return false;
      }
      if (targetSize.includes("medium format")) {
        const matches = pSize.match(/(\d+)/g);
        if (matches) {
          const maxDim = Math.max(...matches.map(Number));
          return maxDim > 300 && maxDim <= 600;
        }
        return false;
      }
      if (targetSize.includes("large format")) {
        const matches = pSize.match(/(\d+)/g);
        if (matches) {
          const maxDim = Math.max(...matches.map(Number));
          return maxDim > 600;
        }
        return false;
      }

      // specific dimension comparison
      const cleanTarget = targetSize.replace(/\s*x\s*/g, "x").replace(/mm/g, "").trim();
      return pSize.includes(cleanTarget) || cleanTarget.includes(pSize);
    }

    case "origin": {
      const pOrig = (product.origin || product.collection || product.description || "").toLowerCase();
      if (val.includes("imported")) return pOrig.includes("imported") || true; // Timex Ceramic features imported collections
      if (val.includes("italian")) return pOrig.includes("italian") || pOrig.includes("italy");
      if (val.includes("spanish")) return pOrig.includes("spanish") || pOrig.includes("spain");
      if (val.includes("european")) return pOrig.includes("european") || pOrig.includes("italian") || pOrig.includes("spanish");
      return pOrig.includes(val);
    }

    case "category": {
      return matchesProductCategory(product, val);
    }

    default:
      return true;
  }
}
