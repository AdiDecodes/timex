"use client";

import React, { useState, useEffect } from "react";
import {
  FileCode,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";

const DEFAULT_ROBOTS_TXT = `# Timex Ceramic Robots.txt Exclusion Standard
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /customer-dashboard
Disallow: /_next/

Sitemap: https://www.timexceramic.com/sitemap.xml
`;

export function RobotsTab() {
  const [content, setContent] = useState(DEFAULT_ROBOTS_TXT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/seo/settings?_t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.robots_txt_content) {
          setContent(data.settings.robots_txt_content);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleValidateContent = (text: string) => {
    const lines = text.split("\n");
    for (const l of lines) {
      const clean = l.trim().toLowerCase();
      if (clean === "disallow: /" || clean === "disallow: /products") {
        return "Safety Warning: 'Disallow: /' or 'Disallow: /products' will block search engines from crawling your primary surfaces!";
      }
    }
    return null;
  };

  const handleSave = async () => {
    const warn = handleValidateContent(content);
    if (warn) {
      setWarningMsg(warn);
      return;
    }
    setWarningMsg(null);
    setSaving(true);

    try {
      const res = await fetch("/api/v1/seo/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ robots_txt_content: content }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Robots.txt rules updated successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error("Save robots.txt error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset robots.txt to the Timex Ceramic recommended default configuration?")) {
      setContent(DEFAULT_ROBOTS_TXT);
      setWarningMsg(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Robots.txt Exclusion Editor</h2>
          <p className="text-xs text-gray-400">
            Configure crawler indexing boundaries for Googlebot, Bingbot, and AI agent search spiders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#c5a880] hover:text-white transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Test /robots.txt
          </a>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Default
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c5a880]/20 hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Robots.txt"}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {warningMsg && (
        <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {warningMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-2 p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-3 flex flex-col h-[460px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#c5a880]" />
              /robots.txt Directives
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Standard Robots Exclusion Format</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setWarningMsg(null);
            }}
            className="flex-1 w-full bg-[#090d16] border border-white/10 rounded-xl p-4 font-mono text-xs text-gray-200 focus:outline-none focus:border-[#c5a880] resize-none"
            spellCheck={false}
          />
        </div>

        {/* Safety Guidelines */}
        <div className="space-y-4">
          <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Safety Protections Active
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Timex Ceramic protects public pages from accidental de-indexing:
            </p>
            <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
              <li>
                <strong className="text-white">Admin Console Protected:</strong> <span className="font-mono text-[#c5a880]">/admin</span> is automatically blocked from public search results.
              </li>
              <li>
                <strong className="text-white">Public Slabs Accessible:</strong> Public surfaces (<span className="font-mono text-[#c5a880]">/products</span>, <span className="font-mono text-[#c5a880]">/collections</span>) are allowed.
              </li>
              <li>
                <strong className="text-white">Sitemap Pointer:</strong> Search spiders automatically discover the XML sitemap.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
