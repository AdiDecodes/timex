import { MediaItem, MediaStats } from "@/types/media";

const API_BASE = "/api/v1";

export interface MediaQueryParams {
  search?: string;
  type?: string;
  sort?: "newest" | "oldest" | "name" | "size";
  page?: number;
  limit?: number;
}

export async function getMediaList(params?: MediaQueryParams): Promise<{
  media: MediaItem[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.type && params.type !== "all") query.set("type", params.type);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  query.set("_t", String(Date.now()));

  try {
    const res = await fetch(`${API_BASE}/media?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch media: ${res.statusText}`);
    }
    const data = await res.json();
    return {
      media: data.media || [],
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
    };
  } catch (err) {
    console.error("Error in getMediaList:", err);
    return { media: [], total: 0, page: 1, totalPages: 1 };
  }
}

export async function getMediaStats(): Promise<MediaStats> {
  try {
    const res = await fetch(`${API_BASE}/media/stats?_t=${Date.now()}`);
    if (!res.ok) throw new Error("Failed to fetch media stats");
    const data = await res.json();
    return data.stats;
  } catch (err) {
    console.error("Error fetching media stats:", err);
    return {
      totalMedia: 0,
      totalImages: 0,
      totalSvgs: 0,
      totalVideos: 0,
      totalDocuments: 0,
      totalSize: 0,
      trashedCount: 0,
      recentlyUploadedCount: 0,
    };
  }
}

export async function uploadMedia(
  file: File,
  metadata?: { altText?: string; caption?: string }
): Promise<{ success: boolean; media?: MediaItem; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata?.altText) formData.append("altText", metadata.altText);
    if (metadata?.caption) formData.append("caption", metadata.caption);

    const res = await fetch(`${API_BASE}/media/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Upload failed" };
    }
    return { success: true, media: data.media };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error while uploading" };
  }
}

export async function updateMedia(
  id: string,
  data: { altText?: string; caption?: string; filename?: string }
): Promise<{ success: boolean; media?: MediaItem; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/media/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    return resData;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function softDeleteMedia(
  id: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/media/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function restoreMedia(
  id: string
): Promise<{ success: boolean; message?: string; media?: MediaItem; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/media/${encodeURIComponent(id)}/restore`, {
      method: "POST",
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function permanentDeleteMedia(
  id: string,
  force = false
): Promise<{ success: boolean; message?: string; error?: string; usedBy?: any[] }> {
  try {
    const res = await fetch(
      `${API_BASE}/media/${encodeURIComponent(id)}/permanent?force=${force ? "true" : "false"}`,
      {
        method: "DELETE",
      }
    );
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
