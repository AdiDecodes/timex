"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Client-side route-level SEO cache to prevent repeated API calls
const seoCache = new Map<string, any>();

function applySeoMetadata(s: any) {
  if (!s) return;

  // 1. Update HTML Title
  if (s.seo_title || s.meta_title) {
    document.title = s.seo_title || s.meta_title;
  }

  // 2. Update Meta Description
  if (s.meta_description) {
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", s.meta_description);
  }

  // 3. Update Meta Keywords
  const kwList = Array.isArray(s.secondary_keywords)
    ? [s.focus_keyword, ...s.secondary_keywords].filter(Boolean).join(", ")
    : (s.secondary_keywords || s.focus_keyword || "");
  if (kwList) {
    let kw = document.querySelector('meta[name="keywords"]');
    if (!kw) {
      kw = document.createElement("meta");
      kw.setAttribute("name", "keywords");
      document.head.appendChild(kw);
    }
    kw.setAttribute("content", kwList);
  }

  // 4. Update Canonical Link
  if (s.canonical_url) {
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.setAttribute("rel", "canonical");
      document.head.appendChild(canon);
    }
    canon.setAttribute("href", s.canonical_url);
  }

  // 5. Update Open Graph Tags
  if (s.og_title || s.seo_title || s.meta_title) {
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", s.og_title || s.seo_title || s.meta_title);
  }

  if (s.og_description || s.meta_description) {
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", s.og_description || s.meta_description);
  }

  // 6. Update JSON-LD Schema
  if (s.schema_data) {
    let schemaScript = document.getElementById("live-seo-schema-script");
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "live-seo-schema-script";
      schemaScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = s.schema_data;
  }
}

export function LiveSeoUpdater() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const cleanPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

    // Use in-memory cache if path was already fetched
    if (seoCache.has(cleanPath)) {
      applySeoMetadata(seoCache.get(cleanPath));
      return;
    }

    // Fetch live SEO metadata from API/database
    fetch(`/api/v1/seo/by-path?path=${encodeURIComponent(cleanPath)}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.seo) {
          seoCache.set(cleanPath, data.seo);
          applySeoMetadata(data.seo);
        }
      })
      .catch(() => {});
  }, [pathname]);

  return null;
}
