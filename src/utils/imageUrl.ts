/**
 * Utility for normalizing image URLs in Timex Ceramic.
 * Ensures local uploaded images are saved and referenced as clean relative paths (e.g. /uploads/products/...)
 * across both localhost and Cloudflare Tunnel origins, while preserving valid external image URLs (e.g. Unsplash, CDNs).
 */

export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "";
  let trimmed = url.trim();
  if (!trimmed) return "";

  // If user pasted without protocol like localhost:3000/uploads/...
  if (/^(localhost|127\.0\.0\.1)(:\d+)?\//i.test(trimmed)) {
    trimmed = "http://" + trimmed;
  }

  // Check if it's an absolute HTTP/HTTPS URL
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const host = parsed.hostname.toLowerCase();

      // Check current browser origin if in client
      if (typeof window !== "undefined" && window.location) {
        try {
          if (
            parsed.host.toLowerCase() === window.location.host.toLowerCase() ||
            parsed.origin.toLowerCase() === window.location.origin.toLowerCase()
          ) {
            return parsed.pathname + parsed.search;
          }
        } catch {}
      }

      // Check known local dev or tunnel host patterns
      const isLocalOrTunnel =
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "0.0.0.0" ||
        /^192\.168\./.test(host) ||
        /^10\./.test(host) ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
        host.endsWith(".trycloudflare.com") ||
        host.endsWith(".loca.lt") ||
        host.endsWith(".ngrok-free.app") ||
        host.endsWith(".ngrok.io");

      if (isLocalOrTunnel) {
        return parsed.pathname + parsed.search;
      }

      // If URL explicitly points to /uploads/, it's a project uploaded asset
      if (parsed.pathname.startsWith("/uploads/")) {
        return parsed.pathname + parsed.search;
      }

      // Otherwise, preserve external URLs (e.g. Unsplash, Cloudinary, CDNs)
      return trimmed;
    } catch {
      return trimmed;
    }
  }

  // If path begins with uploads/ or images/ without leading slash, add it
  if (trimmed.startsWith("uploads/") || trimmed.startsWith("images/")) {
    return "/" + trimmed;
  }

  return trimmed;
}

/**
 * Resolves an image URL for display.
 * If given a relative URL (starts with /), returns it directly so the current origin serves it.
 * If given an absolute URL, preserves it.
 */
export function resolveImageUrl(url: string | null | undefined, fallback: string = ""): string {
  const normalized = normalizeImageUrl(url);
  if (!normalized) return fallback;
  return normalized;
}

