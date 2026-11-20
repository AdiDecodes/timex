import { MOCK_PRODUCTS } from "@/data/products";
import { BLOG_POSTS } from "@/data/blogs";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getStoreFilePath(): string {
  const fs = require("fs");
  const path = require("path");
  const isServerless = Boolean(
    process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL ||
    process.env.LAMBDA_TASK_ROOT
  );
  if (isServerless) {
    const tmpDir = "/tmp/data";
    const tmpPath = path.join(tmpDir, "store.json");
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      if (!fs.existsSync(tmpPath)) {
        const bundled = path.resolve(process.cwd(), "server/data/store.json");
        if (fs.existsSync(bundled)) {
          fs.copyFileSync(bundled, tmpPath);
        }
      }
    } catch {}
    return fs.existsSync(tmpPath) ? tmpPath : path.resolve(process.cwd(), "server/data/store.json");
  }
  return path.resolve(process.cwd(), "server/data/store.json");
}

function writeStoreFileSafe(store: any): boolean {
  try {
    const fs = require("fs");
    const storePath = getStoreFilePath();
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("writeStoreFileSafe error:", err);
    return false;
  }
}

export function getStoredProducts(): any[] {
  try {
    const fs = require("fs");
    const storePath = getStoreFilePath();
    if (fs.existsSync(storePath)) {
      const content = fs.readFileSync(storePath, "utf8");
      const data = JSON.parse(content);
      if (Array.isArray(data.products) && data.products.length > 0) {
        return data.products;
      }
    }
  } catch (e) {
    console.warn("Could not read store.json in getStoredProducts:", e);
  }
  return MOCK_PRODUCTS;
}

export function getStoredBlogs(): any[] {
  try {
    const fs = require("fs");
    const storePath = getStoreFilePath();
    if (fs.existsSync(storePath)) {
      const content = fs.readFileSync(storePath, "utf8");
      const data = JSON.parse(content);
      if (Array.isArray(data.blogs) && data.blogs.length > 0) {
        return data.blogs;
      }
    }
  } catch (e) {
    console.warn("Could not read store.json in getStoredBlogs:", e);
  }
  return BLOG_POSTS;
}

export async function saveProduct(input: any): Promise<{ success: boolean; product?: any; error?: string }> {
  try {
    const fs = require("fs");
    const storePath = getStoreFilePath();

    let store = { products: MOCK_PRODUCTS, blogs: BLOG_POSTS };
    if (fs.existsSync(storePath)) {
      store = JSON.parse(fs.readFileSync(storePath, "utf8"));
    }
    if (!Array.isArray(store.products)) {
      store.products = [...MOCK_PRODUCTS];
    }

    const existingProducts = store.products;
    const isEdit = Boolean(input.id || input.slug);
    const existingIndex = existingProducts.findIndex(
      (p: any) => (input.id && p.id === input.id) || (input.slug && p.slug === input.slug) || (input.code && p.code === input.code)
    );

    const name = input.name ? input.name.trim() : "Untitled Surface";
    const code = input.code ? input.code.trim() : `TMX-${Math.floor(100 + Math.random() * 900)}`;
    const categoryId = input.categoryId || input.category_id || "stone";
    const categoryName = input.category || input.category_name || "Stone Look";
    const collectionId = input.collectionId || input.collection_id || categoryId;
    const collectionName = input.collection || input.collection_name || categoryName;

    const rawSlug = input.slug ? slugify(input.slug) : slugify(name);
    let candidateSlug = rawSlug;
    let counter = 1;
    const currentId = isEdit && existingIndex !== -1 ? existingProducts[existingIndex].id : null;
    while (existingProducts.some((p: any) => p.slug === candidateSlug && p.id !== currentId)) {
      candidateSlug = `${rawSlug}-${counter}`;
      counter++;
    }

    const prodId = input.id || `prod-${Date.now()}`;
    const size = input.size !== undefined ? input.size : "";
    const availableSizes = Array.isArray(input.availableSizes)
      ? input.availableSizes.map((s: any) => String(s).trim()).filter(Boolean)
      : (typeof input.availableSizes === "string" ? (input.availableSizes as string).split(",").map((s: string) => s.trim()).filter(Boolean) : []);

    const availableColors = Array.isArray(input.availableColors)
      ? input.availableColors.map((c: any) => String(c).trim()).filter(Boolean)
      : (typeof input.availableColors === "string" ? (input.availableColors as string).split(",").map((c: string) => c.trim()).filter(Boolean) : []);

    const rawColorImages = input.colorImages !== undefined ? input.colorImages : {};
    const colorImages: Record<string, string> = {};
    if (rawColorImages && typeof rawColorImages === "object") {
      availableColors.forEach((c: string) => {
        if (rawColorImages[c]) colorImages[c] = rawColorImages[c];
      });
    }

    const rawColorHexes = input.colorHexes !== undefined ? input.colorHexes : (input.color_hexes !== undefined ? input.color_hexes : {});
    const colorHexes: Record<string, string> = {};
    if (rawColorHexes && typeof rawColorHexes === "object") {
      availableColors.forEach((c: string) => {
        if (rawColorHexes[c]) colorHexes[c] = rawColorHexes[c];
      });
    }

    const rawSizeImages = input.sizeImages !== undefined ? input.sizeImages : {};
    const sizeImages: Record<string, string> = {};
    if (rawSizeImages && typeof rawSizeImages === "object") {
      availableSizes.forEach((s: string) => {
        if (rawSizeImages[s]) sizeImages[s] = rawSizeImages[s];
      });
    }

    const isActive = input.status === "Inactive" || input.status === "Inactive (Draft)"
      ? false
      : input.isActive !== undefined
      ? Boolean(input.isActive)
      : input.is_active !== undefined
      ? Boolean(input.is_active)
      : true;
    const status = isActive ? "Active" : "Inactive";

    const updatedProduct = {
      ...(existingIndex !== -1 ? existingProducts[existingIndex] : {}),
      ...input,
      id: prodId,
      slug: candidateSlug,
      name,
      code,
      sku: input.sku || `TMX-SKU-${code}`,
      description: input.description || "",
      categoryId,
      category_id: categoryId,
      category: categoryName,
      category_name: categoryName,
      collectionId,
      collection_id: collectionId,
      collection: collectionName,
      collection_name: collectionName,
      size,
      availableSizes,
      thickness: input.thickness || "9 mm",
      finish: input.finish?.toLowerCase() === "matte" ? "Matt" : (input.finish || "Shiny"),
      look: input.look || categoryName,
      material: input.material || "Porcelain",
      origin: input.origin || "Imported",
      availableColors,
      sizeImages,
      colorImages,
      colorHexes,
      color_hexes: colorHexes,
      combinationImages: input.combinationImages || {},
      combinationProductMappings: Array.isArray(input.combinationProductMappings)
        ? input.combinationProductMappings
        : (Array.isArray(input.combination_product_mappings) ? input.combination_product_mappings : []),
      combination_product_mappings: Array.isArray(input.combinationProductMappings)
        ? input.combinationProductMappings
        : (Array.isArray(input.combination_product_mappings) ? input.combination_product_mappings : []),
      usage: input.usage || input.application || "Wall & Floor",
      application: input.application || input.usage || "Wall & Floor",
      pattern: input.pattern || input.tilePattern || "Straight",
      tilePattern: input.tilePattern || input.pattern || "Straight",
      kgPerBox: input.kgPerBox || input.weight || "21",
      pcsPerBox: input.pcsPerBox || input.packingDetails || "16",
      weight: input.weight || input.kgPerBox || "21",
      packingDetails: input.packingDetails || input.pcsPerBox || "16",
      sftPerBox: input.sftPerBox || input.sft_per_box || input.sqftPerBox || "",
      sft_per_box: input.sft_per_box || input.sftPerBox || input.sqftPerBox || "",
      shape: input.shape || input.tilesByShape || (Array.isArray(input.shapes) ? input.shapes.join(", ") : ""),
      shapes: Array.isArray(input.shapes) ? input.shapes : (input.shape ? [input.shape] : []),
      tilesByShape: input.tilesByShape || input.shape || "",
      tiles_by_shape: input.tiles_by_shape || input.shape || "",
      customShape: input.customShape || input.custom_shape || "",
      tilesBySize: input.tilesBySize || input.tiles_by_size || (Array.isArray(input.tilesBySizeList) ? input.tilesBySizeList.join(", ") : ""),
      tiles_by_size: input.tiles_by_size || input.tilesBySize || "",
      tilesBySizeList: Array.isArray(input.tilesBySizeList)
        ? input.tilesBySizeList
        : (input.tilesBySize ? input.tilesBySize.split(",").map((s: string) => s.trim()).filter(Boolean) : []),
      customTilesBySize: input.customTilesBySize || input.custom_tiles_by_size || "",
      custom_tiles_by_size: input.custom_tiles_by_size || input.customTilesBySize || "",
      images: Array.isArray(input.images) ? input.images : [
        "https://www.timexceramic.com/wp-content/uploads/2025/08/timex-ceramic-harlem-series-blue-wall-and-floor-tiles-shiny-finish-tiles-ambience.jpg"
      ],
      isActive,
      is_active: isActive,
      isNewArrival: input.isNewArrival !== undefined ? Boolean(input.isNewArrival) : Boolean(input.is_new_arrival),
      is_new_arrival: input.isNewArrival !== undefined ? Boolean(input.isNewArrival) : Boolean(input.is_new_arrival),
      showTileOfSpainBadge: input.showTileOfSpainBadge !== undefined ? Boolean(input.showTileOfSpainBadge) : Boolean(input.show_tile_of_spain_badge),
      show_tile_of_spain_badge: input.showTileOfSpainBadge !== undefined ? Boolean(input.showTileOfSpainBadge) : Boolean(input.show_tile_of_spain_badge),
      status,
      metaTitle: input.metaTitle || input.meta_title || `${name} | Timex Ceramic`,
      meta_title: input.metaTitle || input.meta_title || `${name} | Timex Ceramic`,
      metaDescription: input.metaDescription || input.meta_description || input.description || "",
      meta_description: input.metaDescription || input.meta_description || input.description || "",
      keywords: input.keywords || `${name}, ${categoryName}, tiles, timex ceramic`,
      updated_at: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      existingProducts[existingIndex] = updatedProduct;
    } else {
      existingProducts.unshift(updatedProduct);
    }

    store.products = existingProducts;
    writeStoreFileSafe(store);

    return { success: true, product: updatedProduct };
  } catch (err: any) {
    console.error("saveProduct error:", err);
    return { success: false, error: err.message || "Failed to save product." };
  }
}

export async function deleteProduct(idOrSlug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const fs = require("fs");
    const storePath = getStoreFilePath();

    if (!fs.existsSync(storePath)) {
      return { success: false, error: "Store file not found." };
    }

    const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
    if (!Array.isArray(store.products)) {
      return { success: false, error: "No products found." };
    }

    const norm = idOrSlug.toLowerCase().trim();
    const initialLen = store.products.length;
    store.products = store.products.filter(
      (p: any) =>
        p.id?.toLowerCase().trim() !== norm &&
        p.slug?.toLowerCase().trim() !== norm &&
        p.code?.toLowerCase().trim() !== norm
    );

    if (store.products.length === initialLen) {
      return { success: false, error: "Product not found." };
    }

    writeStoreFileSafe(store);
    return { success: true };
  } catch (err: any) {
    console.error("deleteProduct error:", err);
    return { success: false, error: err.message || "Failed to delete product." };
  }
}

export async function saveBlog(input: any): Promise<{ success: boolean; blog?: any; error?: string }> {
  try {
    const fs = require("fs");
    const storePath = getStoreFilePath();

    let store = { blogs: BLOG_POSTS, products: MOCK_PRODUCTS };
    if (fs.existsSync(storePath)) {
      store = JSON.parse(fs.readFileSync(storePath, "utf8"));
    }
    if (!Array.isArray(store.blogs)) {
      store.blogs = [...BLOG_POSTS];
    }

    const existingBlogs = store.blogs;
    const isEdit = Boolean(input.id || input.slug);
    const existingIndex = existingBlogs.findIndex(
      (b: any) => (input.id && b.id === input.id) || (input.slug && b.slug === input.slug)
    );

    const baseTitle = input.title || "Untitled Article";
    const targetSlug = input.slug ? slugify(input.slug) : slugify(baseTitle);

    let candidateSlug = targetSlug;
    let counter = 1;
    const currentId = isEdit && existingIndex !== -1 ? existingBlogs[existingIndex].id : null;
    while (existingBlogs.some((b: any) => b.slug === candidateSlug && b.id !== currentId)) {
      candidateSlug = `${targetSlug}-${counter}`;
      counter++;
    }

    const blogId = input.id || `blog-${Date.now()}`;
    const author = input.author && typeof input.author === "object" ? input.author : {
      name: input.authorName || "Timex Design Editorial",
      role: input.authorRole || "Senior Tile Architect",
      avatar: input.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    };

    const updatedBlog = {
      ...input,
      id: blogId,
      slug: candidateSlug,
      title: baseTitle,
      subtitle: input.subtitle || "",
      category: input.category || "DESIGN TIPS",
      date: input.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: input.readTime || "5 Min Read",
      author,
      coverImage: input.coverImage || "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
      excerpt: input.excerpt || "",
      content: input.content || {
        intro: input.excerpt || "",
        sections: [{ heading: "1. Overview", body: [input.excerpt || ""] }],
        keyTakeaways: ["High quality ceramic tiles", "Expert design insights"],
      },
      tags: Array.isArray(input.tags) ? input.tags : (input.tags ? input.tags.split(",").map((t: string) => t.trim()) : [input.category || "TILES"]),
      status: input.status || "Published",
      metaTitle: input.metaTitle || `${baseTitle} | Timex Ceramic Blog`,
      metaDescription: input.metaDescription || input.excerpt || "",
      keywords: input.keywords || `${baseTitle}, ${input.category}, tiles, timex ceramic`,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      existingBlogs[existingIndex] = { ...existingBlogs[existingIndex], ...updatedBlog };
    } else {
      existingBlogs.unshift(updatedBlog);
    }

    store.blogs = existingBlogs;
    writeStoreFileSafe(store);

    return { success: true, blog: updatedBlog };
  } catch (err: any) {
    console.error("saveBlog error:", err);
    return { success: false, error: err.message || "Failed to save blog post." };
  }
}

export async function deleteBlog(idOrSlug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const fs = require("fs");
    const storePath = getStoreFilePath();

    if (!fs.existsSync(storePath)) {
      return { success: false, error: "Store file not found." };
    }

    const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
    if (!Array.isArray(store.blogs)) {
      return { success: false, error: "No blogs found." };
    }

    const norm = idOrSlug.toLowerCase().trim();
    const initialLen = store.blogs.length;
    store.blogs = store.blogs.filter(
      (b: any) => b.id?.toLowerCase().trim() !== norm && b.slug?.toLowerCase().trim() !== norm
    );

    if (store.blogs.length === initialLen) {
      return { success: false, error: "Blog post not found." };
    }

    writeStoreFileSafe(store);
    return { success: true };
  } catch (err: any) {
    console.error("deleteBlog error:", err);
    return { success: false, error: err.message || "Failed to delete blog post." };
  }
}
