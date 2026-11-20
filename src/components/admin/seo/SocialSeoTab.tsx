"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  Save,
  Check,
  Eye,
  Globe,
  Image as ImageIcon,
} from "lucide-react";

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SocialSeoTab() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("/");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [ogTitle, setOgTitle] = useState("");
  const [ogDesc, setOgDesc] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [twitterTitle, setTwitterTitle] = useState("");
  const [twitterDesc, setTwitterDesc] = useState("");
  const [twitterImage, setTwitterImage] = useState("");
  const [twitterCard, setTwitterCard] = useState<"summary" | "summary_large_image">("summary_large_image");

  useEffect(() => {
    fetch("/api/v1/seo?_t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.seo)) {
          setItems(data.seo);
          if (data.seo.length > 0) {
            loadItem(data.seo[0]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const loadItem = (item: any) => {
    setSelectedPath(item.page_path);
    setOgTitle(item.og_title || item.seo_title || item.title || "");
    setOgDesc(item.og_description || item.meta_description || "");
    setOgImage(item.og_image || "https://www.timexceramic.com/images/og-image.jpg");
    setTwitterTitle(item.twitter_title || item.og_title || item.seo_title || "");
    setTwitterDesc(item.twitter_description || item.og_description || item.meta_description || "");
    setTwitterImage(item.twitter_image || item.og_image || "https://www.timexceramic.com/images/og-image.jpg");
    setTwitterCard(item.twitter_card || "summary_large_image");
  };

  const handleSelectPath = (path: string) => {
    const itm = items.find((i) => i.page_path === path);
    if (itm) loadItem(itm);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const activeItem = items.find((i) => i.page_path === selectedPath);

    try {
      const res = await fetch("/api/v1/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...activeItem,
          page_path: selectedPath,
          og_title: ogTitle,
          og_description: ogDesc,
          og_image: ogImage,
          twitter_title: twitterTitle,
          twitter_description: twitterDesc,
          twitter_image: twitterImage,
          twitter_card: twitterCard,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Social Open Graph and Twitter tags saved!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error("Save social SEO error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Social Sharing SEO (OG & Twitter)</h2>
          <p className="text-xs text-gray-400">
            Control Open Graph tags for Facebook, LinkedIn, Pinterest, and Twitter/X card cards with live rich snippet previews.
          </p>
        </div>

        {/* Page Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-300 font-bold uppercase shrink-0">Surface:</label>
          <select
            value={selectedPath}
            onChange={(e) => handleSelectPath(e.target.value)}
            className="bg-[#111827] border border-white/10 rounded-xl px-4 py-2 text-xs text-white max-w-xs truncate focus:outline-none focus:border-[#c5a880]"
          >
            {items.map((i) => (
              <option key={i.id} value={i.page_path}>
                [{i.content_type.toUpperCase()}] {i.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading social meta...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Facebook / Open Graph */}
            <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  Facebook / Open Graph
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">property="og:*"</span>
              </div>

              {/* Live Preview Card */}
              <div className="p-3 bg-[#090d16] border border-white/10 rounded-xl space-y-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Live Preview Card</span>
                <div className="border border-gray-700 rounded-lg overflow-hidden bg-white text-black font-sans shadow-md">
                  <div className="w-full h-40 bg-gray-200 overflow-hidden relative">
                    <img
                      src={ogImage || "https://www.timexceramic.com/images/og-image.jpg"}
                      alt="OG Preview"
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80";
                      }}
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">TIMEXCERAMIC.COM</span>
                    <h4 className="font-bold text-xs line-clamp-1 leading-snug">{ogTitle || "Timex Ceramic Luxury Surfaces"}</h4>
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">{ogDesc || "Experience luxury surfaces with Timex Ceramic."}</p>
                  </div>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">OG Title</label>
                  <input
                    type="text"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">OG Description</label>
                  <textarea
                    rows={2}
                    value={ogDesc}
                    onChange={(e) => setOgDesc(e.target.value)}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">OG Image URL (1200x630)</label>
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>

            {/* Right: Twitter / X */}
            <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TwitterIcon className="w-4 h-4 text-sky-400" />
                  Twitter / X Card
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">name="twitter:*"</span>
              </div>

              {/* Twitter Live Preview Card */}
              <div className="p-3 bg-[#090d16] border border-white/10 rounded-xl space-y-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Live Tweet Card Preview</span>
                <div className="border border-gray-800 rounded-2xl overflow-hidden bg-black text-white font-sans shadow-md">
                  <div className="w-full h-40 bg-gray-900 overflow-hidden relative">
                    <img
                      src={twitterImage || ogImage || "https://www.timexceramic.com/images/og-image.jpg"}
                      alt="Twitter Preview"
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80";
                      }}
                    />
                  </div>
                  <div className="p-3 space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-mono">timexceramic.com</span>
                    <h4 className="font-bold text-xs line-clamp-1">{twitterTitle || ogTitle}</h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2">{twitterDesc || ogDesc}</p>
                  </div>
                </div>
              </div>

              {/* Twitter Inputs */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300">Twitter Card Type</label>
                    <select
                      value={twitterCard}
                      onChange={(e: any) => setTwitterCard(e.target.value)}
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="summary_large_image">Summary Large Image</option>
                      <option value="summary">Small Summary Card</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300">Twitter Title</label>
                    <input
                      type="text"
                      value={twitterTitle}
                      onChange={(e) => setTwitterTitle(e.target.value)}
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Twitter Description</label>
                  <textarea
                    rows={2}
                    value={twitterDesc}
                    onChange={(e) => setTwitterDesc(e.target.value)}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Twitter Image URL</label>
                  <input
                    type="text"
                    value={twitterImage}
                    onChange={(e) => setTwitterImage(e.target.value)}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c5a880]/20 hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Social Meta Tags"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
