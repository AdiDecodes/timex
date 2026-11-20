/**
 * Utility functions for YouTube URL parsing, validation, and embed generation.
 */

/**
 * Extracts the 11-character YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - Direct 11-character video ID
 */
export function extractYouTubeVideoId(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // 1. Try URL parser if it has http:// or https:// or looks like a URL
  try {
    const fullUrl = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(fullUrl);
    const host = parsed.hostname.toLowerCase();

    // Check YouTube hostnames
    if (host === "youtu.be" || host === "www.youtu.be") {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return id;
      }
    }

    if (
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com" ||
      host === "www.youtube-nocookie.com"
    ) {
      // 1. /watch?v=ID
      const searchParam = parsed.searchParams.get("v");
      if (searchParam && /^[a-zA-Z0-9_-]{11}$/.test(searchParam)) {
        return searchParam;
      }

      // 2. /embed/ID, /shorts/ID, /v/ID
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments.length >= 2 && ["embed", "shorts", "v"].includes(segments[0].toLowerCase())) {
        if (/^[a-zA-Z0-9_-]{11}$/.test(segments[1])) {
          return segments[1];
        }
      }
    }
  } catch {
    // Not a parseable URL
  }

  // 2. Fallback: regex for partial/raw YouTube links (e.g. youtube.com/watch?v=...)
  const regex = /(?:^|[/:?&=])(?:(?:www\.|m\.)?youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&/#]|$)/i;
  const match = trimmed.match(regex);
  if (match && match[1]) {
    return match[1];
  }

  // 3. Fallback: plain 11-char video ID (must not contain slashes, dots, spaces, or query markers)
  if (!/[/.:?&#\s]/.test(trimmed) && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Checks if a string is a valid YouTube URL or video ID.
 */
export function isValidYouTubeUrl(url?: string | null): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * Returns a high-quality thumbnail URL for the given YouTube video ID.
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  if (!videoId) return "";
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Returns a privacy-enhanced YouTube embed URL (youtube-nocookie.com) with playback controls.
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay: boolean = true): string {
  if (!videoId) return "";
  const autoParam = autoplay ? "1" : "0";
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoParam}&rel=0&modestbranding=1&playsinline=1`;
}
