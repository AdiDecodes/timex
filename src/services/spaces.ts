import { SpaceItem, PREDEFINED_SPACES_MAP } from "@/types/spaces";
import defaultSpaces from "../../server/data/defaultSpaces.json";
import { normalizeImageUrl } from "@/utils/imageUrl";

let _cachedSpaces: SpaceItem[] | null = null;
let _cachedSpacesMtime = 0;
let _lastSpacesCheck = 0;

export function invalidateSpacesCache(): void {
  _cachedSpaces = null;
  _cachedSpacesMtime = 0;
  _lastSpacesCheck = 0;
}

export function getStoredSpaces(options: { includeDrafts?: boolean } = {}): SpaceItem[] {
  let list: SpaceItem[] = [];
  if (typeof window === "undefined") {
    try {
      const now = Date.now();
      if (_cachedSpaces && now - _lastSpacesCheck < 3000) {
        list = _cachedSpaces;
      } else {
        const fs = eval("require")("fs");
        const path = eval("require")("path");
        const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
        const storePath = isServerless && fs.existsSync("/tmp/data/store.json")
          ? "/tmp/data/store.json"
          : path.resolve(process.cwd(), "server/data/store.json");

        if (fs.existsSync(storePath)) {
          const stat = fs.statSync(storePath);
          if (_cachedSpaces && stat.mtimeMs === _cachedSpacesMtime) {
            _lastSpacesCheck = now;
            list = _cachedSpaces;
          } else {
            const content = fs.readFileSync(storePath, "utf8");
            const data = JSON.parse(content);
            if (Array.isArray(data.tiles_by_space) && data.tiles_by_space.length > 0) {
              list = data.tiles_by_space;
              _cachedSpaces = list;
              _cachedSpacesMtime = stat.mtimeMs;
              _lastSpacesCheck = now;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Could not read store.json in getStoredSpaces:", e);
    }
  }
  if (!list || list.length === 0) {
    list = (defaultSpaces as SpaceItem[]) || [];
  }

  list = list.map((s) => ({
    ...s,
    image: normalizeImageUrl(s.image),
    ogImage: normalizeImageUrl(s.ogImage || s.image),
  }));

  if (!options.includeDrafts) {
    list = list.filter((s) => s.status !== "draft");
  }

  return [...list].sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999));
}

export async function getSpaces(options: { includeDrafts?: boolean } = {}): Promise<SpaceItem[]> {
  const spaces = getStoredSpaces(options);
  return spaces;
}

export async function getSpaceBySlug(slug: string): Promise<SpaceItem | null> {
  const spaces = getStoredSpaces();
  const normalized = slug.toLowerCase().trim();
  const found = spaces.find((s) => s.slug.toLowerCase() === normalized || s.id === normalized);
  if (found) return found;

  // Fallback to default spaces mapping
  const def = (defaultSpaces as SpaceItem[]).find(
    (s) => s.slug.toLowerCase() === normalized || s.id === normalized
  );
  return def || null;
}

export function matchesProductSpace(product: any, spaceNameOrSlug: string): boolean {
  const rawSpace = product.tilesBySpace || product.tiles_by_space || product.spaceArea || product.spaces || "";
  const target = spaceNameOrSlug.toLowerCase().trim();
  const targetBase = target.replace(/\s+tiles$/, "").replace(/-tiles$/, "");

  const spaceList = Array.isArray(rawSpace)
    ? rawSpace
    : String(rawSpace).split(",").map((s) => s.trim());

  return spaceList.some((entry) => {
    const pSpace = String(entry || "").toLowerCase().trim();
    if (!pSpace || pSpace === "not specified" || pSpace === "default / not specified") {
      return false;
    }
    const pBase = pSpace.replace(/\s+tiles$/, "").replace(/-tiles$/, "");

    return (
      pSpace === target ||
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

export async function getProductsForSpace(space: SpaceItem): Promise<any[]> {
  const { getProducts } = await import("@/services/product");
  const allProducts = await getProducts();
  return allProducts.filter(
    (p) => !p.is_trashed && p.isActive !== false && p.is_active !== false && matchesProductSpace(p, space.name)
  );
}

export async function generateSpaceMetadata(slug: string) {
  const { getSeoMetadata, buildPageMetadata } = await import("@/services/seo");
  const seo = await getSeoMetadata(`/${slug}`);
  return buildPageMetadata(seo);
}
