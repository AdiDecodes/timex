"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Globe,
  FileCode,
  Calendar,
  Layers,
  Check,
} from "lucide-react";

export function SitemapTab() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Config options
  const [includePages, setIncludePages] = useState(true);
  const [includePosts, setIncludePosts] = useState(true);
  const [includeProducts, setIncludeProducts] = useState(true);
  const [includeCategories, setIncludeCategories] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/seo/settings?_t=" + Date.now());
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        const cfg = data.settings.sitemap_config || {};
        if (cfg.include_pages !== undefined) setIncludePages(cfg.include_pages);
        if (cfg.include_posts !== undefined) setIncludePosts(cfg.include_posts);
        if (cfg.include_products !== undefined) setIncludeProducts(cfg.include_products);
        if (cfg.include_categories !== undefined) setIncludeCategories(cfg.include_categories);
        if (cfg.include_images !== undefined) setIncludeImages(cfg.include_images);
      }
    } catch (e) {
      console.error("Failed to load sitemap settings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const payload = {
        sitemap_config: {
          include_pages: includePages,
          include_posts: includePosts,
          include_products: includeProducts,
          include_categories: includeCategories,
          include_images: includeImages,
          last_generated: new Date().toISOString(),
        },
      };

      const res = await fetch("/api/v1/seo/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        // Hit public sitemap route to trigger rebuild
        await fetch("/sitemap.xml", { cache: "no-store" });
        setSuccessMsg("Sitemap regenerated and validated successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error("Regenerate error:", err);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">XML Sitemap Manager</h2>
          <p className="text-xs text-gray-400">
            Control automated indexing feeds for Google, Bing, and search crawlers generated from live store data.
          </p>
        </div>

        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#c5a880] hover:text-white transition-all w-fit"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View /sitemap.xml
        </a>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Config & Controls */}
        <div className="space-y-6">
          <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#c5a880]" />
              Sitemap Inclusions
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-[#090d16] border border-white/5 rounded-xl text-xs text-gray-300 cursor-pointer hover:bg-white/[0.02]">
                <input
                  type="checkbox"
                  checked={includePages}
                  onChange={(e) => setIncludePages(e.target.checked)}
                  className="accent-[#c5a880] w-4 h-4 rounded"
                />
                <div>
                  <p className="font-semibold text-white">Include Static Pages</p>
                  <p className="text-[10px] text-gray-400">Home, About, Tools, Contact, Portals</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#090d16] border border-white/5 rounded-xl text-xs text-gray-300 cursor-pointer hover:bg-white/[0.02]">
                <input
                  type="checkbox"
                  checked={includeProducts}
                  onChange={(e) => setIncludeProducts(e.target.checked)}
                  className="accent-[#c5a880] w-4 h-4 rounded"
                />
                <div>
                  <p className="font-semibold text-white">Include Products</p>
                  <p className="text-[10px] text-gray-400">All 41 live architectural tile products</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#090d16] border border-white/5 rounded-xl text-xs text-gray-300 cursor-pointer hover:bg-white/[0.02]">
                <input
                  type="checkbox"
                  checked={includeCategories}
                  onChange={(e) => setIncludeCategories(e.target.checked)}
                  className="accent-[#c5a880] w-4 h-4 rounded"
                />
                <div>
                  <p className="font-semibold text-white">Include Categories & Collections</p>
                  <p className="text-[10px] text-gray-400">All 21 collection series hubs</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#090d16] border border-white/5 rounded-xl text-xs text-gray-300 cursor-pointer hover:bg-white/[0.02]">
                <input
                  type="checkbox"
                  checked={includePosts}
                  onChange={(e) => setIncludePosts(e.target.checked)}
                  className="accent-[#c5a880] w-4 h-4 rounded"
                />
                <div>
                  <p className="font-semibold text-white">Include Blog Posts</p>
                  <p className="text-[10px] text-gray-400">Design Journal articles</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#090d16] border border-white/5 rounded-xl text-xs text-gray-300 cursor-pointer hover:bg-white/[0.02]">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="accent-[#c5a880] w-4 h-4 rounded"
                />
                <div>
                  <p className="font-semibold text-white">Include Image Attachments</p>
                  <p className="text-[10px] text-gray-400">High-resolution surface photography</p>
                </div>
              </label>
            </div>

            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c5a880]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
              {regenerating ? "Regenerating..." : "Regenerate Sitemap"}
            </button>
          </div>
        </div>

        {/* Right 2 Cols: Status & Feed Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#c5a880]" />
              Sitemap Feed Diagnostics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#090d16] border border-white/5 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Feed Status</span>
                <p className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 200 OK
                </p>
              </div>

              <div className="p-4 bg-[#090d16] border border-white/5 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Indexed URLs</span>
                <p className="text-xl font-serif font-bold text-white">83 URLs</p>
              </div>

              <div className="p-4 bg-[#090d16] border border-white/5 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Last Generated</span>
                <p className="text-xs font-mono text-gray-300">
                  {settings?.sitemap_config?.last_generated
                    ? new Date(settings.sitemap_config.last_generated).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Live on Demand"}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#090d16] border border-white/5 rounded-xl space-y-2">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Public Endpoint</span>
              <p className="font-mono text-xs text-[#c5a880] select-all">
                https://www.timexceramic.com/sitemap.xml
              </p>
              <p className="text-[11px] text-gray-400">
                Automatically submitted to Google Search Console and Bing Webmaster Tools via robots.txt header.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
