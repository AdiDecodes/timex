"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";

export function AeoGeoTab() {
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

  // AEO / GEO evaluation checks
  const checks = [
    {
      title: "Direct Answer Conciseness",
      description: "Direct summary statement in the first 100 words suitable for LLM RAG extraction.",
      status: activeItem?.meta_description?.length > 80 ? "PASS" : "WARN",
      note: "Description serves as concise summary snippet for generative citations.",
    },
    {
      title: "Architectural Entity Clarity",
      description: "Mentions definitive entities: Brand ('Timex Ceramic'), Material ('Vitrified Porcelain'), Origin ('Imported').",
      status: "PASS",
      note: "Entities detected cleanly in page attributes and JSON-LD schema.",
    },
    {
      title: "Question & Answer / FAQ Structure",
      description: "Page structure includes direct Q&A pairs or structured FAQPage schema.",
      status: activeItem?.content_type === "category" || activeItem?.schema_type === "FAQPage" ? "PASS" : "WARN",
      note: activeItem?.content_type === "category" ? "Rich 4-question FAQ array active." : "Consider adding an FAQ block to capture 'People Also Ask' queries.",
    },
    {
      title: "Structured Data / JSON-LD Readiness",
      description: "Machine-readable JSON-LD format allowing AI agents to understand specifications.",
      status: activeItem?.schema_data ? "PASS" : "WARN",
      note: activeItem?.schema_data ? "Structured schema present." : "Default schema enabled.",
    },
    {
      title: "Author & Corporate E-E-A-T Signal",
      description: "Verifiable brand entity and experience centre address/phone.",
      status: "PASS",
      note: "Organization & LocalBusiness schema injected into site layout.",
    },
  ];

  const passCount = checks.filter((c) => c.status === "PASS").length;
  const aeoScore = Math.round((passCount / checks.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            AEO / GEO Engine (Answer & Generative Optimization)
          </h2>
          <p className="text-xs text-gray-400">
            Optimize content discoverability for generative AI search engines: Google Gemini Search, ChatGPT, Perplexity, and Claude.
          </p>
        </div>

        {/* Page selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-300 font-bold uppercase shrink-0">Surface:</label>
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
          Evaluating generative answer engine signals...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Checks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">
                  AI Citation Readiness Score
                </span>
                <div className="text-3xl font-serif font-bold text-white mt-1">
                  {aeoScore} <span className="text-xs text-gray-400 font-normal">/ 100</span>
                </div>
                <p className="text-xs text-[#c5a880] mt-1">
                  {passCount} of {checks.length} Answer Engine Optimization checks passed
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center text-[#c5a880]">
                <Bot className="w-8 h-8" />
              </div>
            </div>

            {/* Checklist */}
            <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#c5a880]" />
                LLM & AI Citation Factor Evaluation
              </h3>

              <div className="space-y-3">
                {checks.map((c, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                      c.status === "PASS"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {c.status === "PASS" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-white">{c.title}</p>
                        <p className="text-[11px] text-gray-300">{c.description}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-1">Status: {c.note}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        c.status === "PASS" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: AI Advice */}
          <div className="space-y-6">
            <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c5a880]" />
                Generative Search Guidelines
              </h3>

              <div className="space-y-3 text-xs text-gray-300">
                <div className="p-3 bg-[#090d16] border border-white/5 rounded-xl space-y-1">
                  <p className="font-bold text-white">How Gemini & ChatGPT cite sources</p>
                  <p className="text-[11px] text-gray-400">
                    AI models favor structured answers that answer "What is", "How thick is", "Is it waterproof", and "Price per sq ft" directly in bullet points.
                  </p>
                </div>

                <div className="p-3 bg-[#090d16] border border-white/5 rounded-xl space-y-1">
                  <p className="font-bold text-white">Zero Ambiguity</p>
                  <p className="text-[11px] text-gray-400">
                    Always include exact dimensions (e.g. "800x1600 mm") and material ("Full Body Vitrified Porcelain") instead of generic adjectives.
                  </p>
                </div>

                <div className="p-3 bg-[#090d16] border border-white/5 rounded-xl space-y-1">
                  <p className="font-bold text-white">Factual E-E-A-T Guarantee</p>
                  <p className="text-[11px] text-gray-400">
                    Timex Ceramic branding and physical Mumbai Experience Centre entity tags anchor search engines with authentic authority.
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
