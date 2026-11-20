import { ColorItem } from "@/types/colors";
import defaultColors from "../../server/data/defaultColors.json";

function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000";
}

/**
 * Server-safe retrieval of colors from store.json or defaultColors.json.
 * Used during Next.js server component rendering and static params generation.
 */
export function getStoredColors(options: { activeOnly?: boolean } = {}): ColorItem[] {
  let list: ColorItem[] = [];

  if (typeof window === "undefined") {
    try {
      const fs = eval("require")("fs");
      const path = eval("require")("path");
      const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
      const storePath = isServerless && fs.existsSync("/tmp/data/store.json")
        ? "/tmp/data/store.json"
        : path.resolve(process.cwd(), "server/data/store.json");

      if (fs.existsSync(storePath)) {
        const content = fs.readFileSync(storePath, "utf8");
        const data = JSON.parse(content);
        if (Array.isArray(data.colors) && data.colors.length > 0) {
          list = data.colors;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (!list || list.length === 0) {
    list = (defaultColors as ColorItem[]) || [];
  }

  if (options.activeOnly) {
    list = list.filter((c) => c.isActive !== false);
  }

  return [...list].sort((a, b) => Number(a.displayOrder ?? 999) - Number(b.displayOrder ?? 999));
}

export function getColorBySlug(slug: string): ColorItem | null {
  const colors = getStoredColors();
  const normalized = slug.toLowerCase().trim().replace(/-color$/, "");
  return (
    colors.find(
      (c) =>
        c.slug.toLowerCase() === normalized ||
        c.name.toLowerCase() === normalized ||
        c.id.toLowerCase() === normalized
    ) || null
  );
}

/**
 * Client-side fetch of active or all colors from backend API.
 */
export async function fetchColors(options: { activeOnly?: boolean; search?: string } = {}): Promise<ColorItem[]> {
  const params = new URLSearchParams();
  if (options.activeOnly) params.set("activeOnly", "true");
  if (options.search) params.set("search", options.search);

  try {
    const res = await fetch(`/api/v1/colors?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.colors)) {
      return data.colors;
    }
  } catch (err) {
    console.warn("fetchColors failed, falling back to static list:", err);
  }

  return getStoredColors(options);
}

export async function createColor(data: Partial<ColorItem>): Promise<{ success: boolean; color?: ColorItem; error?: string }> {
  try {
    const res = await fetch("/api/v1/colors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create color" };
  }
}

export async function updateColor(id: string, data: Partial<ColorItem>): Promise<{ success: boolean; color?: ColorItem; error?: string }> {
  try {
    const res = await fetch(`/api/v1/colors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update color" };
  }
}

export async function deleteColor(id: string, force = false): Promise<{ success: boolean; error?: string; productCount?: number }> {
  try {
    const res = await fetch(`/api/v1/colors/${id}?force=${force ? "true" : "false"}`, {
      method: "DELETE",
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete color" };
  }
}
