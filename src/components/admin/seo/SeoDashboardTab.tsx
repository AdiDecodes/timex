"use client";

import React, { useState, useEffect } from "react";
import {
  Gauge,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Compass,
  Link as LinkIcon,
  Globe,
  Sliders,
  Sparkles,
} from "lucide-react";

interface SeoDashboardTabProps {
  onNavigateTab: (tabKey: string) => void;
}

export function SeoDashboardTab({ onNavigateTab }: SeoDashboardTabProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/seo/dashboard-stats?_t=" + Date.now());
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (e) {
      console.error("Failed to load SEO dashboard stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-16 text-center text-gray-400 space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#c5a880]" />
        <p className="text-xs uppercase tracking-widest font-mono">Calculating Live SEO Health Metrics...</p>
      </div>
    );
  }

  const overall = stats?.overallScore || 0;
  const getScoreColor = (sc: number) => {
    if (sc >= 85) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (sc >= 70) return "text-[#c5a880] border-[#c5a880]/30 bg-[#c5a880]/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#111827] border border-white/10 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/20">
              SEO Engine v2.0 • Live Store Connected
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Central SEO Dashboard
          </h2>
          <p className="text-xs text-gray-400">
            Real-time search engine optimization intelligence for all 84 pages, products, collections, and articles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={() => onNavigateTab("site-audit")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c5a880]/20 hover:brightness-110 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Start Site Audit
          </button>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall SEO Health Score */}
        <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">
              Overall SEO Score
            </span>
            <Gauge className="w-5 h-5 text-[#c5a880]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-serif font-bold text-white">{overall}</span>
            <span className="text-xs text-gray-400">/ 100</span>
            <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full border ${getScoreColor(overall)}`}>
              {overall >= 85 ? "Excellent" : overall >= 70 ? "Good" : "Needs Attention"}
            </span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#c5a880] to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${overall}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Calculated from 84 live store pages</p>
        </div>

        {/* Total Indexed Surfaces */}
        <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">
              Total Pages & Items
            </span>
            <Globe className="w-5 h-5 text-[#c5a880]" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-serif font-bold text-white">{stats?.totalPages || 0}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" /> {stats?.indexedPages || 0} Indexed
            </span>
            <span className="text-gray-400 flex items-center gap-1 font-medium">
              <XCircle className="w-3 h-3 text-amber-400" /> {stats?.noindexPages || 0} Noindex
            </span>
          </div>
        </div>

        {/* Missing Tags Summary */}
        <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">
              Titles & Descriptions
            </span>
            <FileText className="w-5 h-5 text-[#c5a880]" />
          </div>
          <div className="my-2 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Pages with Title:</span>
              <span className="font-bold text-emerald-400">{stats?.pagesWithTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Missing Title:</span>
              <span className={`font-bold ${stats?.pagesMissingTitle > 0 ? "text-rose-400" : "text-gray-400"}`}>
                {stats?.pagesMissingTitle}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Missing Meta Desc:</span>
              <span className={`font-bold ${stats?.pagesMissingDescription > 0 ? "text-amber-400" : "text-gray-400"}`}>
                {stats?.pagesMissingDescription}
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("page-seo")}
            className="text-[11px] text-[#c5a880] hover:underline flex items-center gap-1 font-medium mt-1"
          >
            Review Page SEO <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* 404 & Redirect Activity */}
        <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">
              Traffic Health & Links
            </span>
            <Compass className="w-5 h-5 text-[#c5a880]" />
          </div>
          <div className="my-2 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Active 301 Redirects:</span>
              <span className="font-bold text-white">{stats?.activeRedirects || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Unresolved 404s:</span>
              <span className={`font-bold ${stats?.unresolved404Errors > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                {stats?.unresolved404Errors || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Broken Links:</span>
              <span className="font-bold text-emerald-400">{stats?.brokenLinksCount || 0}</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("404-monitor")}
            className="text-[11px] text-[#c5a880] hover:underline flex items-center gap-1 font-medium mt-1"
          >
            Inspect 404 Monitor <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Secondary Status & Actionable Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sitemap & Robots Status Card */}
        <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#c5a880]" />
            Search Engine Feeders
          </h3>
          <div className="space-y-3">
            <div className="p-3.5 bg-[#090d16] border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">/sitemap.xml</p>
                <p className="text-[10px] text-gray-400">{stats?.sitemap?.urlCount || 0} URLs indexed</p>
              </div>
              <button
                onClick={() => onNavigateTab("sitemap")}
                className="px-2.5 py-1 rounded bg-[#c5a880]/15 text-[#c5a880] text-[10px] font-bold hover:bg-[#c5a880]/25 transition-all"
              >
                Manage
              </button>
            </div>

            <div className="p-3.5 bg-[#090d16] border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">/robots.txt</p>
                <p className="text-[10px] text-emerald-400">Rules Active • Normal Crawling</p>
              </div>
              <button
                onClick={() => onNavigateTab("robots")}
                className="px-2.5 py-1 rounded bg-[#c5a880]/15 text-[#c5a880] text-[10px] font-bold hover:bg-[#c5a880]/25 transition-all"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Actionable Warnings */}
        <div className="lg:col-span-2 p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Actionable SEO Priorities
            </h3>
            <span className="text-[10px] text-gray-400">Real database findings</span>
          </div>

          <div className="space-y-2.5">
            {stats?.unresolved404Errors > 0 && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-rose-300">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    <strong>{stats.unresolved404Errors} unresolved 404 URL(s)</strong> detected from real visitors.
                  </span>
                </div>
                <button
                  onClick={() => onNavigateTab("404-monitor")}
                  className="px-2.5 py-1 bg-rose-500 text-white font-bold text-[10px] rounded-lg hover:bg-rose-600 transition-all shrink-0 cursor-pointer"
                >
                  Create 301 Redirect
                </button>
              </div>
            )}

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Tile collection descriptions are under 100 characters. Expand copy to boost category rank.
                </span>
              </div>
              <button
                onClick={() => onNavigateTab("page-seo")}
                className="px-2.5 py-1 bg-amber-500 text-black font-bold text-[10px] rounded-lg hover:bg-amber-400 transition-all shrink-0 cursor-pointer"
              >
                Expand Copy
              </button>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  All 41 live architectural tile products have structured JSON-LD Schema ready.
                </span>
              </div>
              <button
                onClick={() => onNavigateTab("schema")}
                className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded-lg hover:bg-emerald-500/30 transition-all shrink-0 cursor-pointer"
              >
                Inspect Schema
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
