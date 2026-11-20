/**
 * src/utils/productCollection.ts
 * Single source of truth for dynamically resolving clean, normalized
 * Collection Name and Collection URL for any product.
 *
 * Avoids duplicate/dirty titles like "Timex Premium Brick Collection Collection"
 * or "Timex Premium Collection Collection".
 */

export interface ProductCollectionInfo {
  name: string;
  url: string;
  slug: string;
}

// Known collections catalog matching src/data/collections.ts
const KNOWN_COLLECTIONS: Array<{ id: string; slug: string; name: string; link: string }> = [
  { id: "brick", slug: "brick", name: "Brick", link: "/product-category/brick" },
  { id: "stone", slug: "stone", name: "Stone", link: "/product-category/stone" },
  { id: "wooden", slug: "wooden", name: "Wooden", link: "/product-category/wooden" },
  { id: "tropical", slug: "tropical", name: "Tropical", link: "/product-category/tropical" },
  { id: "mosaic", slug: "mosaic", name: "Mosaic", link: "/product-category/mosaic" },
  { id: "marble", slug: "marble", name: "Marble", link: "/product-category/marble" },
  { id: "subway", slug: "subway", name: "Subway", link: "/product-category/subway" },
  { id: "texture", slug: "texture", name: "Texture", link: "/product-category/texture" },
  { id: "metallic", slug: "metallic", name: "Metallic", link: "/product-category/metallic" },
  { id: "boutique", slug: "boutique", name: "Boutique", link: "/product-category/boutique" },
  { id: "hexagon", slug: "hexagon", name: "Hexagon", link: "/product-category/hexagon" },
  { id: "moroccan", slug: "moroccan", name: "Moroccan", link: "/product-category/moroccan" },
  { id: "colorful", slug: "colorful", name: "Colorful", link: "/product-category/colorful" },
  { id: "highlighter", slug: "highlighter", name: "Highlighter", link: "/product-category/highlighter" },
  { id: "french-frames", slug: "french-frames", name: "French Frames", link: "/product-category/french-frames" },
  { id: "modular", slug: "modular", name: "Modular", link: "/product-category/modular" },
  { id: "octagonal", slug: "octagonal", name: "Octagonal", link: "/product-category/octagonal" },
  { id: "terrazzo", slug: "terrazzo", name: "Terrazzo", link: "/product-category/terrazzo" },
  { id: "white", slug: "white", name: "White", link: "/product-category/white" },
  { id: "fabric", slug: "fabric", name: "Fabric", link: "/product-category/fabric" },
  { id: "french-frames-series", slug: "french-frames-series", name: "French Frames", link: "/product-category/french-frames" },
  { id: "terrazzo-series", slug: "terrazzo-series", name: "Terrazzo", link: "/product-category/terrazzo" },
];

/**
 * Resolves the dynamic collection name and link for any product object.
 */
export function resolveProductCollection(product: any): ProductCollectionInfo {
  if (!product) {
    return { name: "Porcelain Collection", url: "/collections", slug: "porcelain" };
  }

  const catId = String(product.categoryId || product.category_id || "").toLowerCase().trim();
  const collId = String(product.collectionId || product.collection_id || "")
    .toLowerCase()
    .trim()
    .replace(/^coll-/, "");
  const rawCollName = String(product.collection || product.collection_name || "").trim();
  const rawCatName = String(product.category || product.category_name || "").trim();
  const prodId = String(product.id || "").toLowerCase();
  const prodSlug = String(product.slug || "").toLowerCase();

  // 1. Direct match on collection ID / category ID
  let matched = KNOWN_COLLECTIONS.find(
    (c) => c.id === collId || c.slug === collId || c.id === catId || c.slug === catId
  );

  // 2. Substring match on IDs
  if (!matched) {
    matched = KNOWN_COLLECTIONS.find(
      (c) =>
        prodId.includes(`prod-${c.id}-`) ||
        prodId.includes(`prod-${c.slug}-`) ||
        collId.includes(c.id) ||
        catId.includes(c.id)
    );
  }

  // 3. Name or slug matching
  if (!matched) {
    matched = KNOWN_COLLECTIONS.find(
      (c) =>
        (rawCollName && rawCollName.toLowerCase().includes(c.name.toLowerCase())) ||
        (rawCatName && rawCatName.toLowerCase().includes(c.name.toLowerCase())) ||
        (prodSlug && prodSlug.includes(c.slug))
    );
  }

  if (matched) {
    const baseName = matched.name.replace(/\s+Collection$/i, "").replace(/\s+Series$/i, "").trim();
    return {
      name: `${baseName} Collection`,
      url: matched.link || `/product-category/${matched.slug}`,
      slug: matched.slug,
    };
  }

  // 4. Custom Collection from product.collection (stripping any Timex / Premium / Royal prefixes)
  if (rawCollName) {
    const cleaned = cleanCollectionTitle(rawCollName, rawCatName);
    if (cleaned && !/^(porcelain|signature)\s+collection$/i.test(cleaned)) {
      const slug = cleaned.toLowerCase().replace(/\s+collection$/i, "").replace(/[^a-z0-9]+/g, "-");
      return {
        name: cleaned,
        url: `/product-category/${slug}`,
        slug,
      };
    }
  }

  // 5. Fallback from category name (e.g. "Brick Look" -> "Brick Collection")
  if (rawCatName) {
    const cleaned = cleanCollectionTitle(rawCatName);
    const slug = cleaned.toLowerCase().replace(/\s+collection$/i, "").replace(/[^a-z0-9]+/g, "-");
    return {
      name: cleaned,
      url: `/product-category/${slug}`,
      slug,
    };
  }

  return {
    name: "Stone Collection",
    url: "/product-category/stone",
    slug: "stone",
  };
}

/**
 * Universal cleaner that strips all prefixes like "Timex Premium ", "Timex Royal ", "Timex "
 * and ensures a clean collection title like "Stone Collection", "Brick Collection".
 */
export function cleanCollectionTitle(raw: string, catName?: string): string {
  if (!raw || typeof raw !== "string") {
    if (catName) {
      const cleanCat = catName.replace(/\s+Look$/i, "").replace(/\s+Tiles$/i, "").trim();
      return `${cleanCat} Collection`;
    }
    return "Porcelain Collection";
  }

  let clean = raw.trim();
  clean = clean.replace(/^(timex\s+)+(premium\s+|royal\s+)?/i, "");
  clean = clean.replace(/^(premium\s+|royal\s+)/i, "");

  if (/^collection$/i.test(clean) || clean === "") {
    if (catName) {
      const cleanCat = catName.replace(/\s+Look$/i, "").replace(/\s+Tiles$/i, "").trim();
      return `${cleanCat} Collection`;
    }
    return "Porcelain Collection";
  }

  clean = clean.replace(/\s+(look|series|collection)$/i, "");
  clean = clean.replace(/\s+(look|series|collection)$/i, "");
  clean = clean.trim();
  if (!clean) return "Porcelain Collection";

  // Capitalize properly
  clean = clean.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return `${clean} Collection`;
}

/**
 * Returns just the cleaned collection display name string.
 */
export function getCleanCollectionName(product: any): string {
  return resolveProductCollection(product).name;
}
