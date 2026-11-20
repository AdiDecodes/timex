"use client";

import React, { useState, useEffect } from "react";
import {
  Server,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  History,
  Info,
  ShieldAlert,
  ArrowRight,
  Code2,
  Globe,
} from "lucide-react";

interface BackupItem {
  id: string;
  timestamp: string;
  note: string;
  size_bytes?: number;
}

interface SafetyIssue {
  severity: "danger" | "warning";
  line?: number;
  rule?: string;
  message: string;
}

interface NetlifyEquivalent {
  summary: string;
  netlify_toml_snippet: string;
  redirects_file_snippet: string;
  differences: { feature: string; apache: string; netlify: string }[];
}

export function HtaccessTab() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [safetyIssues, setSafetyIssues] = useState<SafetyIssue[]>([]);
  const [activeView, setActiveView] = useState<"htaccess" | "netlify">("htaccess");
  const [netlifyEquivalent, setNetlifyEquivalent] = useState<NetlifyEquivalent | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showBackupList, setShowBackupList] = useState(false);

  const fetchHtaccess = () => {
    setLoading(true);
    fetch("/api/v1/seo/htaccess?_t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setContent(data.content || "");
          setBackups(data.backups || []);
          setSafetyIssues(data.safety || []);
          setNetlifyEquivalent(data.netlify_equivalent || null);
        }
      })
      .catch((err) => setErrorMsg("Failed to load .htaccess: " + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHtaccess();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSave = async (force = false) => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/v1/seo/htaccess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          note: `Manual edit via Admin at ${new Date().toLocaleTimeString()}`,
          force,
        }),
      });

      const data = await res.json();

      if (res.status === 422 && data.warning && !force) {
        setSafetyIssues(data.issues || []);
        setShowConfirmModal(true);
        setSaving(false);
        return;
      }

      if (data.success) {
        setSuccessMsg(data.message || "Saved .htaccess and created backup.");
        setShowConfirmModal(false);
        fetchHtaccess();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || "Failed to save .htaccess");
      }
    } catch (err: any) {
      setErrorMsg("Network error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (backupId?: string, resetDefault = false) => {
    if (!confirm(resetDefault ? "Reset .htaccess to recommended default configuration?" : "Restore selected backup? Current settings will be backed up.")) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/v1/seo/htaccess/restore", {
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
        setShowBackupList(false);
        fetchHtaccess();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || "Failed to restore backup.");
      }
    } catch (err: any) {
      setErrorMsg("Restore failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const lines = content.split("\n");

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a880]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-xl">
                <Server className="w-5 h-5 text-[#c5a880]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">.htaccess Manager</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Apache & LiteSpeed Web Server Configuration & Netlify Equivalents
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView("htaccess")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeView === "htaccess"
                  ? "bg-[#c5a880] text-black shadow-md"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              .htaccess Editor
            </button>
            <button
              onClick={() => setActiveView("netlify")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === "netlify"
                  ? "bg-[#c5a880] text-black shadow-md"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Netlify Equivalent</span>
            </button>
          </div>
        </div>

        {/* IMPORTANT NETLIFY DEPLOYMENT NOTICE BANNER */}
        <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-300">
              Netlify Architecture Notice:
            </p>
            <p className="text-gray-300 leading-relaxed">
              Timex Ceramic is deployed on <strong className="text-white">Netlify (Edge Serverless / Static CDN)</strong>. Netlify does <em>not</em> run Apache, so <code className="text-[#c5a880] font-mono">.htaccess</code> rules do not apply on Netlify. This file is maintained for Apache 2.4+, LiteSpeed, and cPanel environments. On Netlify, rewrite and redirect rules are handled by <code className="text-[#c5a880] font-mono">netlify.toml</code> and <code className="text-[#c5a880] font-mono">dist/_redirects</code>.
            </p>
          </div>
        </div>

        {/* Success & Error alerts */}
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

      {activeView === "htaccess" ? (
        /* HTACCESS EDITOR VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-3.5 bg-black/40 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>public/.htaccess</span>
                  <span className="text-gray-600">|</span>
                  <span>{lines.length} lines</span>
                  <span>({content.length} chars)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(content, "htaccess")}
                    className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer"
                    title="Copy full .htaccess"
                  >
                    {copiedKey === "htaccess" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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

              {/* Code Editor */}
              <div className="relative font-mono text-xs">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading}
                  rows={26}
                  className="w-full bg-[#0b0f19] text-gray-200 p-5 focus:outline-none focus:ring-1 focus:ring-[#c5a880]/50 font-mono leading-relaxed resize-y selection:bg-[#c5a880]/30"
                  spellCheck={false}
                />
              </div>

              {/* Footer toolbar */}
              <div className="px-5 py-3.5 bg-black/30 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-gray-400 flex items-center gap-2">
                  <span className="text-[#c5a880] font-semibold">Automatic Backups:</span>
                  <span>Pre-save snapshot archived before each change.</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSave(false)}
                    disabled={saving || loading}
                    className="flex items-center gap-2 px-5 py-2 bg-[#c5a880] text-black rounded-xl text-xs font-bold hover:bg-[#d8be96] transition-all shadow-md shadow-[#c5a880]/20 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Safety Assessment Box */}
            {safetyIssues.length > 0 && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Rule Safety Analyzer Found {safetyIssues.length} Potential Issues:</span>
                </div>
                <div className="space-y-1.5 pl-6">
                  {safetyIssues.map((issue, idx) => (
                    <div key={idx} className="text-xs text-rose-200/90 leading-relaxed">
                      <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 mr-1.5">
                        {issue.severity}
                      </span>
                      {issue.line && <span className="font-mono text-gray-400 mr-1">Line {issue.line}:</span>}
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Backups & Instructions */}
          <div className="lg:col-span-4 space-y-5">
            {/* Backups Card */}
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
                <p className="text-xs text-gray-500 italic">No previous backups yet. Backups are automatically generated each time you save.</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
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

            {/* Apache Rules Guide Card */}
            <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 shadow-xl space-y-3 text-xs text-gray-400">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#c5a880]">
                Standard Modules Included:
              </h4>
              <ul className="space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>mod_rewrite:</strong> Forces HTTPS encryption and canonical URLs without trailing slashes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>mod_expires:</strong> Configures optimal browser caching for WebP, CSS, JS, and font files.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>mod_deflate:</strong> High-compression Gzip for HTML, JSON, and SVG assets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>mod_headers:</strong> X-Frame-Options and X-Content-Type-Options security headers.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* NETLIFY EQUIVALENT VIEW */
        <div className="space-y-6">
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Netlify Native Routing & Security Equivalent</h3>
              <p className="text-xs text-gray-400 mt-1">
                Since Timex Ceramic runs on Netlify, the serverless build pipeline uses these native files instead of .htaccess:
              </p>
            </div>

            {/* Direct Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-black/40 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">Feature</th>
                    <th className="py-3 px-4">Apache .htaccess</th>
                    <th className="py-3 px-4 text-[#c5a880]">Netlify Equivalent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  {netlifyEquivalent?.differences?.map((d, i) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="py-3 px-4 font-sans font-semibold text-white">{d.feature}</td>
                      <td className="py-3 px-4 text-gray-400">{d.apache}</td>
                      <td className="py-3 px-4 text-[#c5a880] font-semibold">{d.netlify}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* netlify.toml snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">netlify.toml</span>
                <button
                  onClick={() => handleCopy(netlifyEquivalent?.netlify_toml_snippet || "", "toml")}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded text-xs cursor-pointer"
                >
                  {copiedKey === "toml" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy netlify.toml</span>
                </button>
              </div>
              <pre className="p-4 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-mono text-gray-300 overflow-x-auto">
                {netlifyEquivalent?.netlify_toml_snippet}
              </pre>
            </div>

            {/* dist/_redirects snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">dist/_redirects</span>
                <button
                  onClick={() => handleCopy(netlifyEquivalent?.redirects_file_snippet || "", "redir")}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded text-xs cursor-pointer"
                >
                  {copiedKey === "redir" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy _redirects</span>
                </button>
              </div>
              <pre className="p-4 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-mono text-gray-300 overflow-x-auto">
                {netlifyEquivalent?.redirects_file_snippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Dangerous Rule Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-rose-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">Potentially Hazardous Server Rule Detected</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Our safety analyzer detected directives that may block all web traffic or cause redirect loops if deployed to an Apache server:
            </p>

            <div className="space-y-2 p-3 bg-black/50 border border-rose-500/20 rounded-xl text-xs">
              {safetyIssues.filter(i => i.severity === "danger").map((issue, idx) => (
                <div key={idx} className="text-rose-300">
                  • {issue.message}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-gray-400">
              Are you certain you wish to override this safety check and save this .htaccess file? A safety backup of your existing file will be created.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel & Review
              </button>
              <button
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer"
              >
                I Understand, Force Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
