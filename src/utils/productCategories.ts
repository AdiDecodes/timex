/**
 * Utility functions for robust product category matching, aggregation, and filtering.
 * Ensures products assigned to both Primary Category and Additional Categories (multi-select)
 * appear seamlessly in all corresponding category collections, grids, and filters.
 */

/**
 * Standardize and clean a category token (name, slug, or ID) for resilient matching.
 */
export function normalizeCategoryToken(token: any): string {
  if (!token) return "";
  let clean = String(token).toLowerCase().trim();

  // Strip common prefixes
  clean = clean.replace(/^(cat|coll)-/i, "");

  // Strip common noise suffixes for matching
  clean = clean.replace(/\s+(look|finish|tiles|collection|series|pattern)$/i, "").trim();

  // Handle UK/US spelling variants
  if (clean === "colourful") clean = "colorful";

  return clean;
}

/**
 * Returns true if a product is assigned to a target category through:
 * 1. Primary Category (ID, name, slug)
 * 2. Primary Collection (ID, name, slug)
 * 3. Additional Categories / Secondary Categories (IDs, names, slugs)
 * 4. Subcategories (names, slugs)
 */
export function matchesProductCategory(product: any, targetCategoryOrSlugOrId: string): boolean {
  if (!product || !targetCategoryOrSlugOrId) return false;

  const rawTarget = String(targetCategoryOrSlugOrId).toLowerCase().trim();
  const cleanTarget = normalizeCategoryToken(rawTarget);
  if (!cleanTarget) return false;

  // 1. Check Primary Category
  const pCatId = String(product.categoryId || product.category_id || "").toLowerCase().trim();
  const pCatName = String(product.category || product.category_name || "").toLowerCase().trim();
  const cleanCatId = normalizeCategoryToken(pCatId);
  const cleanCatName = normalizeCategoryToken(pCatName);

  if (
    pCatId === rawTarget ||
    cleanCatId === cleanTarget ||
    pCatName === rawTarget ||
    cleanCatName === cleanTarget ||
    cleanCatName.includes(cleanTarget) ||
    cleanTarget.includes(cleanCatName)
  ) {
    return true;
  }

  // 2. Check Collection
  const pColId = String(product.collectionId || product.collection_id || "").toLowerCase().trim();
  const pColName = String(product.collection || product.collection_name || "").toLowerCase().trim();
  const cleanColId = normalizeCategoryToken(pColId);
  const cleanColName = normalizeCategoryToken(pColName);

  if (
    pColId === rawTarget ||
    cleanColId === cleanTarget ||
    pColName === rawTarget ||
    cleanColName === cleanTarget ||
    cleanColName.includes(cleanTarget) ||
    cleanTarget.includes(cleanColName)
  ) {
    return true;
  }

  // 3. Check Additional / Secondary Categories
  let secList: any[] = [];
  if (Array.isArray(product.secondaryCategories)) {
    secList.push(...product.secondaryCategories);
  }
  if (Array.isArray(product.secondary_categories)) {
    secList.push(...product.secondary_categories);
  }
  if (typeof product.secondary_categories_json === "string" && product.secondary_categories_json.trim()) {
    try {
      const parsed = JSON.parse(product.secondary_categories_json);
      if (Array.isArray(parsed)) secList.push(...parsed);
    } catch (_) {}
  }

  for (const item of secList) {
    const rawItem = String(item || "").toLowerCase().trim();
    const cleanItem = normalizeCategoryToken(rawItem);
    if (!cleanItem) continue;

    if (
      rawItem === rawTarget ||
      cleanItem === cleanTarget ||
      rawItem === cleanTarget ||
      cleanItem === rawTarget ||
      cleanItem.includes(cleanTarget) ||
      cleanTarget.includes(cleanItem)
    ) {
      return true;
    }
  }

  // 4. Check Subcategories
  let subList: any[] = [];
  if (Array.isArray(product.subcategories)) {
    subList.push(...product.subcategories);
  }
  if (typeof product.subcategories_json === "string" && product.subcategories_json.trim()) {
    try {
      const parsed = JSON.parse(product.subcategories_json);
      if (Array.isArray(parsed)) subList.push(...parsed);
    } catch (_) {}
  }

  for (const sub of subList) {
    const rawSub = String(typeof sub === "string" ? sub : (sub?.name || sub?.slug || "")).toLowerCase().trim();
    const cleanSub = normalizeCategoryToken(rawSub);
    if (!cleanSub) continue;

    if (
      rawSub === rawTarget ||
      cleanSub === cleanTarget ||
      cleanSub.includes(cleanTarget) ||
      cleanTarget.includes(cleanSub)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Filter an array of products for a category, ensuring no duplicate products.
 */
export function filterProductsByCategory(products: any[], targetCategoryOrSlugOrId: string): any[] {
  if (!Array.isArray(products) || !targetCategoryOrSlugOrId) return [];

  const seen = new Set<string>();
  return products.filter((p) => {
    if (!p) return false;
    if (
      p.is_trashed ||
      p.isTrashed ||
      p.isActive === false ||
      p.is_active === false ||
      p.status === "Inactive" ||
      p.status === "Draft"
    ) {
      return false;
    }

    if (!matchesProductCategory(p, targetCategoryOrSlugOrId)) {
      return false;
    }

    const key = String(p.id || p.slug || "").trim();
    if (key) {
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  });
}
