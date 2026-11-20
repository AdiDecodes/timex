import { TrashItem, TrashStats, TrashEntityType } from "@/types/trash";

const API_BASE = "/api/v1";

export async function getTrashItems(type?: string): Promise<{
  items: TrashItem[];
  stats: TrashStats;
}> {
  try {
    const query = new URLSearchParams();
    if (type && type !== "all") query.set("type", type);
    query.set("_t", String(Date.now()));

    const res = await fetch(`${API_BASE}/trash?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch trash items");
    const data = await res.json();
    return {
      items: data.items || [],
      stats: data.stats || { total: 0, products: 0, blogs: 0, media: 0, pages: 0 },
    };
  } catch (err) {
    console.error("Error in getTrashItems:", err);
    return {
      items: [],
      stats: { total: 0, products: 0, blogs: 0, media: 0, pages: 0 },
    };
  }
}

export async function restoreTrashItem(
  type: TrashEntityType,
  id: string
): Promise<{ success: boolean; message?: string; restoredItem?: any; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/trash/restore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function permanentDeleteTrashItem(
  type: TrashEntityType,
  id: string,
  force = false
): Promise<{ success: boolean; message?: string; error?: string; usedBy?: any[] }> {
  try {
    const res = await fetch(`${API_BASE}/trash/permanent`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, force }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function emptyTrash(
  type?: string
): Promise<{ success: boolean; message?: string; count?: number; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/trash/empty`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
