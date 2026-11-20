"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  Edit3,
  History,
  FileText,
  Link as LinkIcon,
  Building2,
  Package,
} from "lucide-react";

interface BackupItem {
  id: string;
  timestamp: string;
  note: string;
  size_bytes?: number;
}

export function LlmsTxtTab() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<"edit" | "preview">("edit");
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [stats, setStats] = useState<any>({});
  const [copied, setCopied] = useState(false);

  const fetchLlmsTxt = () => {
    setLoading(true);
    fetch("/api/v1/seo/llms-txt?_t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setContent(data.content || "");
          setBackups(data.backups || []);
          setStats(data.stats || {});
        }
      })
      .catch((err) => setErrorMsg("Failed to load llms.txt: " + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLlmsTxt();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/v1/seo/llms-txt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          note: `Manual edit via Admin at ${new Date().toLocaleTimeString()}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("llms.txt saved successfully and published to /llms.txt!");
        fetchLlmsTxt();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || "Failed to save llms.txt");
      }
    } catch (err: any) {
      setErrorMsg("Network error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/v1/seo/llms-txt/generate", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.generated_content) {
        setContent(data.generated_content);
        setSuccessMsg("Generated fresh llms.txt index from live products and collections! Review and click Save Changes.");
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setErrorMsg(data.error || "Failed to auto-generate llms.txt.");
      }
    } catch (err: any) {
      setErrorMsg("Generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleRestore = async (backupId?: string, resetDefault = false) => {
    if (!confirm(resetDefault ? "Reset llms.txt to the original template?" : "Restore this backup version?")) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/v1/seo/llms-txt/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backup_id: backupId,
          reset_to_default: resetDefault,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setContent(data.content);
        setSuccessMsg(data.message);
        fetchLlmsTxt();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || "Failed to restore.");
      }
    } catch (err: any) {
      setErrorMsg("Restore failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Simple Markdown to HTML renderer for preview mode
  const renderMarkdownPreview = (text: string) => {
    const lines = text.split("\n");
    return (
      <div className="space-y-3 font-sans text-xs text-gray-300 leading-relaxed">
        {lines.map((l, i) => {
          if (l.startsWith("# ")) {
            return <h1 key={i} className="text-xl font-bold text-white border-b border-white/10 pb-2 mt-4">{l.replace("# ", "")}</h1>;
          }
          if (l.startsWith("## ")) {
            return <h2 key={i} className="text-base font-bold text-[#c5a880] mt-4 mb-2">{l.replace("## ", "")}</h2>;
          }
          if (l.startsWith("> ")) {
            return (
              <blockquote key={i} className="p-3 bg-white/5 border-l-4 border-[#c5a880] rounded-r-lg italic text-gray-300 my-2">
                {l.replace("> ", "")}
              </blockquote>
            );
          }
          if (l.startsWith("- ")) {
            const raw = l.replace("- ", "");
            const linkMatch = raw.match(/\[(.*?)\]\((.*?)\):?(.*)/);
            if (linkMatch) {
              return (
                <div key={i} className="flex items-start gap-2 pl-2">
                  <span className="text-[#c5a880] font-bold">•</span>
                  <span>
                    <a href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-[#c5a880] font-semibold underline hover:text-white">
                      {linkMatch[1]}
                    </a>
                    {linkMatch[3] ? `:${linkMatch[3]}` : ""}
                  </span>
                </div>
              );
            }
            return (
              <div key={i} className="flex items-start gap-2 pl-2">
                <span className="text-gray-500">•</span>
                <span>{raw}</span>
              </div>
            );
          }
          if (l.trim() === "") return <div key={i} className="h-1" />;
          return <p key={i} className="text-gray-300">{l}</p>;
        })}
      </div>
    );
  };

  const lines = content.split("\n");

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a880]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-xl">
                <Bot className="w-5 h-5 text-[#c5a880]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">llms.txt Manager</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  AI & Large Language Model Search Engine Discovery Standard (/llms.txt)
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold transition-all border border-white/5"
            >
              <span>View Public /llms.txt</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#c5a880]" />
            </a>

            <button
              onClick={handleGenerate}
              disabled={generating || loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c5a880]/15 border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#c5a880]/25 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              title="Automatically extract live products, collections, and contact info from the database"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{generating ? "Generating..." : "Generate from Catalog"}</span>
            </button>
          </div>
        </div>

        {/* Explainers banner */}
        <div className="mt-5 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200/90 leading-relaxed flex items-start gap-3">
          <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-blue-300">
              What is llms.txt?
            </p>
            <p className="text-gray-300">
              <strong className="text-white">llms.txt</strong> is an open specification providing a curated, markdown-formatted directory of your website for AI engines (Perplexity, ChatGPT, Claude, Google Gemini). It indexes company background, high-priority products, specs, and architectural portals directly to enhance generative search citations.
            </p>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Editor & Preview Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            {/* Toolbar */}
            <div className="px-5 py-3.5 bg-black/40 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white/5 p-0.5 rounded-lg border border-white/5">
                  <button
                    onClick={() => setActiveMode("edit")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      activeMode === "edit"
                        ? "bg-[#c5a880] text-black shadow-sm"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editor</span>
                  </button>
                  <button
                    onClick={() => setActiveMode("preview")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      activeMode === "preview"
                        ? "bg-[#c5a880] text-black shadow-sm"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>

                <span className="text-gray-600">|</span>
                <span className="text-xs font-mono text-gray-400">
                  {lines.length} lines ({content.length} chars)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer"
                  title="Copy full text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleRestore(undefined, true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            {activeMode === "edit" ? (
              <div className="relative font-mono text-xs">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading}
                  rows={26}
                  className="w-full bg-[#0b0f19] text-gray-200 p-5 focus:outline-none focus:ring-1 focus:ring-[#c5a880]/50 font-mono leading-relaxed resize-y selection:bg-[#c5a880]/30"
                  spellCheck={false}
                  placeholder="# Timex Ceramic&#10;&#10;> Luxury Architectural Surfaces..."
                />
              </div>
            ) : (
              <div className="p-6 bg-[#0b0f19] min-h-[480px] max-h-[640px] overflow-y-auto scrollbar-thin">
                {renderMarkdownPreview(content)}
              </div>
            )}

            {/* Footer Toolbar */}
            <div className="px-5 py-3.5 bg-black/30 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-gray-400 flex items-center gap-2">
                <span className="text-[#c5a880] font-semibold">Public Route:</span>
                <span className="font-mono text-gray-300">/llms.txt</span>
                <span>(automatically synchronized)</span>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 px-5 py-2 bg-[#c5a880] text-black rounded-xl text-xs font-bold hover:bg-[#d8be96] transition-all shadow-md shadow-[#c5a880]/20 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Key Metrics & Backups */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick Metrics */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              AI Index Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Package className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Products</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {stats.products_indexed || (content.match(/\/product\//g) || []).length}
                </div>
              </div>

              <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Building2 className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Collections</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {stats.collections_indexed || (content.match(/\/collections\//g) || []).length}
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-gray-400 space-y-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span>Direct Product Links:</span>
                <span className="font-mono text-white font-semibold">Included ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Official Contact Specs:</span>
                <span className="font-mono text-white font-semibold">Included ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Interactive Tools:</span>
                <span className="font-mono text-white font-semibold">Visualiser, Calculator</span>
              </div>
            </div>
          </div>

          {/* Version Backups Card */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <History className="w-4 h-4 text-[#c5a880]" />
                <span>Version Backups</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-400">
                {backups.length} archived
              </span>
            </div>

            {backups.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No backups recorded yet. Automatic snapshots are saved each time you modify llms.txt.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {backups.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-all flex items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="text-[11px] font-semibold text-gray-200 truncate">
                        {b.note || "Snapshot"}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        {new Date(b.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRestore(b.id, false)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-[#c5a880] hover:text-black text-[10px] font-bold text-gray-300 rounded-lg transition-all cursor-pointer shrink-0"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
