/**
 * Resolves an efficient, lightweight thumbnail URL for the admin panel.
 * For images hosted in /uploads/ or internal paths, uses the backend thumbnail endpoint
 * to request a sharp-generated WebP thumbnail (e.g. 120px, 240px, or 300px) instead of downloading
 * full 4000px+ camera/showroom originals into the browser DOM.
 */
export function getAdminThumbnailUrl(url?: string | null, width = 300): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // If already a thumbnail endpoint URL, return as is
  if (trimmed.includes("/api/v1/media/thumbnail/") || trimmed.includes("/api/media/thumbnail/")) {
    return trimmed;
  }

  // Handle uploaded files under /uploads/
  if (
    trimmed.startsWith("/uploads/") ||
    trimmed.includes("/uploads/products/") ||
    trimmed.includes("/uploads/catalogues/")
  ) {
    const filename = trimmed.split("?")[0].split("/").pop();
    if (
      filename &&
      !filename.toLowerCase().endsWith(".pdf") &&
      !filename.toLowerCase().endsWith(".svg") &&
      !filename.toLowerCase().endsWith(".mp4") &&
      !filename.toLowerCase().endsWith(".webm")
    ) {
      return `/api/v1/media/thumbnail/${encodeURIComponent(filename)}?w=${width}`;
    }
  }

  // Handle /images/ collections or spaces
  if (trimmed.startsWith("/images/collections/") || trimmed.startsWith("/images/spaces/")) {
    const filename = trimmed.split("?")[0].split("/").pop();
    if (filename) {
      return `/api/v1/media/thumbnail/${encodeURIComponent(filename)}?w=${width}`;
    }
  }

  return trimmed;
}

