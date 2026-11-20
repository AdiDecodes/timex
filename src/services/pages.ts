import { PageItem } from "@/types/admin";

const API_BASE = "/api/v1";

export async function getPagesList(): Promise<PageItem[]> {
  try {
    const res = await fetch(`${API_BASE}/pages?_t=${Date.now()}`);
    if (!res.ok) throw new Error("Failed to load pages");
    const data = await res.json();
    return data.pages || [];
  } catch (err) {
    console.error("Error in getPagesList:", err);
    return [];
  }
}

export async function softDeletePage(
  id: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/pages/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function restorePage(
  id: string
): Promise<{ success: boolean; message?: string; page?: PageItem; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/pages/${encodeURIComponent(id)}/restore`, {
      method: "POST",
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
