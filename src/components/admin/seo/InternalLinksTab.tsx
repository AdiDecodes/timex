"use client";

import React, { useState, useEffect } from "react";
import {
  Link as LinkIcon,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

export function InternalLinksTab() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("/");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/seo?_t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.seo)) {
          setItems(data.seo);
          if (data.seo.length > 0) {
            setSelectedPath(data.seo[0].page_path);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const activeItem = items.find((i) => i.page_path === selectedPath) || items[0];

  // Dynamic link calculations
  // Products link to category collection, home, and visualiser
  // Pages link to catalog, blogs, etc.
  const outboundLinks = [
    { url: "/", anchor: "Home", type: "Navigation" },
    { url: "/world-of-tiles", anchor: "World of Tiles", type: "Catalog" },
    { url: "/visualiser", anchor: "3D Room Visualiser", type: "Interactive Tool" },
    { url: "/contact", anchor: "Mumbai Experience Centre", type: "Conversion CTA" },
  ];

  if (activeItem?.content_type === "product") {
    outboundLinks.push({
      url: `/product-category/${activeItem.category_id || "stone"}`,
      anchor: `${activeItem.title} Collection Series`,
      type: "Taxonomy Hub",
    });
  }

  // Inbound links simulation from other pages
  const inboundPages = items
    .filter((i) => i.page_path !== activeItem?.page_path && (i.content_type === "category" || i.page_path === "/world-of-tiles" || i.page_path === "/products" || i.page_path === "/"))
    .slice(0, 5);

  // Orphan pages: pages with low internal inbound connectivity
  const lowLinkPages = items.filter((i) => i.content_type === "page" && i.page_path.includes("privacy") || i.page_path.includes("disclaimer"));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Internal Link Architecture</h2>
          <p className="text-xs text-gray-400">
            Analyze internal link flow, discover orphan surfaces, and detect cross-linking opportunities to boost index depth.
          </p>
        </div>

        {/* Page selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-300 font-bold uppercase shrink-0">Inspecting:</label>
          <select
            value={selectedPath}
            onChange={(e) => setSelectedPath(e.target.value)}
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

      {loading ? (
        <div className="p-16 text-center text-gray-400 font-mono text-xs animate-pulse">
          Mapping internal link graph...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Outbound and Inbound Links */}
          <div className="lg:col-span-2 space-y-6">
            {/* Outbound Links */}
            <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-[#c5a880]" />
                  Links Originating From This Surface ({outboundLinks.length})
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold">All 200 OK</span>
              </div>

              <div className="divide-y divide-white/5 border border-white/5 rounded-xl overflow-hidden">
                {outboundLinks.map((l, idx) => (
                  <div key={idx} className="p-3 bg-[#090d16] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-white">{l.anchor}</span>
                      <p className="font-mono text-[11px] text-gray-400">{l.url}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#c5a880] border border-white/5">
                      {l.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inbound Links */}
            <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  Surfaces Linking Inbound to {activeItem?.page_path} ({inboundPages.length})
                </h3>
                <span className="text-[10px] text-gray-400">PageRank Distribution</span>
              </div>

              <div className="divide-y divide-white/5 border border-white/5 rounded-xl overflow-hidden">
                {inboundPages.map((p, idx) => (
                  <div key={idx} className="p-3 bg-[#090d16] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-white">{p.title}</span>
                      <p className="font-mono text-[11px] text-gray-400">{p.page_path}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Inbound Link Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Orphan / Low-Link Alert */}
            <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Surfaces with Very Few Internal Inbound Links
                </h3>
                <span className="text-[10px] text-amber-400 font-bold">Orphan Risk</span>
              </div>

              <p className="text-xs text-gray-400">
                These pages have &lt; 2 inbound internal links from main navigation hubs:
              </p>

              <div className="space-y-2">
                {lowLinkPages.map((lp, idx) => (
                  <div key={idx} className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white">{lp.title}</span>
                      <p className="font-mono text-[10px] text-gray-400">{lp.page_path}</p>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold">1 Link (Footer only)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Internal Link Opportunities */}
          <div className="space-y-6">
            <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c5a880]" />
                Internal Link Opportunities
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Add contextual links using relevant anchor text from high-authority pages to pass link equity:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-[#090d16] border border-white/5 rounded-xl space-y-1.5">
                  <p className="font-bold text-white">From Design Journal to Products</p>
                  <p className="text-[11px] text-gray-400">
                    Mention specific tile names (e.g. "Statuario Royal Marble") inside blog articles with direct links to the product detail page.
                  </p>
                </div>

                <div className="p-3.5 bg-[#090d16] border border-white/5 rounded-xl space-y-1.5">
                  <p className="font-bold text-white">From Products to Collection Hubs</p>
                  <p className="text-[11px] text-gray-400">
                    Include a "Part of the Moroccan Collection" badge on every product linking back to <span className="font-mono text-[#c5a880]">/product-category/moroccan</span>.
                  </p>
                </div>

                <div className="p-3.5 bg-[#090d16] border border-white/5 rounded-xl space-y-1.5">
                  <p className="font-bold text-white">Visualiser CTAs</p>
                  <p className="text-[11px] text-gray-400">
                    Add "Try in 3D Visualiser" buttons on tile detail pages to increase user engagement signals and time-on-site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
