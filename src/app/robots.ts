import { MetadataRoute } from "next";
import { getGlobalSeoSettings } from "@/services/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const settings = getGlobalSeoSettings();
  const rawContent = settings.robots_txt_content || "";
  const sitemapUrl = `${settings.site_url || "https://www.timexceramic.com"}/sitemap.xml`;

  const disallows: string[] = [];
  const allows: string[] = [];

  const lines = rawContent.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith("disallow:")) {
      const val = trimmed.slice("disallow:".length).trim();
      if (val) disallows.push(val);
    } else if (trimmed.toLowerCase().startsWith("allow:")) {
      const val = trimmed.slice("allow:".length).trim();
      if (val) allows.push(val);
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: allows.length > 0 ? (allows.length === 1 ? allows[0] : allows) : "/",
      disallow: disallows.length > 0 ? disallows : ["/admin", "/api/", "/customer-dashboard", "/_next/"],
    },
    sitemap: sitemapUrl,
  };
}
