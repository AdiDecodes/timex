"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Save,
  RotateCcw,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Power,
  ShieldAlert,
  History,
  Copy,
  Check,
  Info,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface BackupItem {
  id: string;
  timestamp: string;
  note: string;
  custom_code?: any;
}

interface SafetyIssue {
  location: string;
  type: string;
  severity: "danger" | "warning";
  message: string;
}

export function CustomCodeTab() {
  const [enabled, setEnabled] = useState(true);
  const [headCode, setHeadCode] = useState("");
  const [bodyStartCode, setBodyStartCode] = useState("");
  const [bodyEndCode, setBodyEndCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [safetyIssues, setSafetyIssues] = useState<SafetyIssue[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchCustomCode = () => {
    setLoading(true);
    fetch("/api/v1/seo/custom-code?_t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.custom_code) {
          setEnabled(data.custom_code.enabled !== false);
          setHeadCode(data.custom_code.head_code || "");
          setBodyStartCode(data.custom_code.body_start_code || "");
          setBodyEndCode(data.custom_code.body_end_code || "");
          setBackups(data.backups || []);
          setSafetyIssues(data.safety || []);
        }
      })
      .catch((err) => setErrorMsg("Failed to load custom code: " + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomCode();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/v1/seo/custom-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled,
          head_code: headCode,
          body_start_code: bodyStartCode,
          body_end_code: bodyEndCode,
          note: `Manual edit via Admin at ${new Date().toLocaleTimeString()}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Custom code saved successfully. Automatic version backup created.");
        setSafetyIssues(data.safety || []);
        fetchCustomCode();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || "Failed to save custom code.");
      }
    } catch (err: any) {
      setErrorMsg("Network error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (backupId?: string, resetDefault = false) => {
    if (!confirm(resetDefault ? "Reset all custom code slots to defaults?" : "Restore selected custom code backup?")) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/v1/seo/custom-code/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backup_id: backupId,
          reset_to_default: resetDefault,
        }),
      });
      const data = await res.json();
      if (data.success && data.custom_code) {
        setEnabled(data.custom_code.enabled !== false);
        setHeadCode(data.custom_code.head_code || "");
        setBodyStartCode(data.custom_code.body_start_code || "");
        setBodyEndCode(data.custom_code.body_end_code || "");
        setSuccessMsg(data.message || "Restored successfully.");
        fetchCustomCode();
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

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a880]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-xl">
                <Code2 className="w-5 h-5 text-[#c5a880]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Insert Custom Head & Body Code</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Inject verified analytics, tracking pixels, meta tags, and third-party scripts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl">
              <span className="text-xs font-semibold text-gray-300">Status:</span>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enabled ? "bg-emerald-500" : "bg-gray-600"
                }`}
                title="Enable or disable all custom code without deleting snippets"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-[11px] font-bold ${enabled ? "text-emerald-400" : "text-gray-500"}`}>
                {enabled ? "ACTIVE" : "DISABLED"}
              </span>
            </div>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold transition-all border border-white/5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-300">
              Safety & Security Isolation:
            </p>
            <p className="text-gray-300">
              Custom scripts are securely executed on the public website and are <strong className="text-white">completely isolated from the /admin portal</strong> to protect admin stability and security. Ensure all <code className="text-[#c5a880] font-mono">&lt;script&gt;</code> and <code className="text-[#c5a880] font-mono">&lt;style&gt;</code> tags are properly closed to prevent layout disruptions.
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

      {/* Safety Analysis Alert (if issues exist) */}
      {safetyIssues.length > 0 && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>Syntax Warning Analyzer Detected {safetyIssues.length} Potential Issues:</span>
          </div>
          <div className="space-y-1.5 pl-6">
            {safetyIssues.map((issue, idx) => (
              <div key={idx} className="text-xs text-rose-200/90 leading-relaxed">
                <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 mr-1.5">
                  {issue.location}
                </span>
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Code Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* 1. HEAD CODE */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 bg-black/40 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
                  <span>HEAD CODE (&lt;head&gt;)</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Appended to &lt;head&gt;. Ideal for Google Tag Manager, Google Analytics, verification meta tags, and custom CSS &lt;style&gt;.
                </p>
              </div>

              <button
                onClick={() => handleCopy(headCode, "head")}
                className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Copy Head Code"
              >
                {copiedKey === "head" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="relative font-mono text-xs">
              <textarea
                value={headCode}
                onChange={(e) => setHeadCode(e.target.value)}
                disabled={loading}
                rows={9}
                className="w-full bg-[#0b0f19] text-gray-200 p-4 focus:outline-none focus:ring-1 focus:ring-[#c5a880]/50 font-mono leading-relaxed resize-y selection:bg-[#c5a880]/30"
                spellCheck={false}
                placeholder="<!-- Paste your Google Analytics, GTM, or verification meta tags here -->"
              />
            </div>
          </div>

          {/* 2. BODY START CODE */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 bg-black/40 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>BODY START CODE (After opening &lt;body&gt;)</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Injected immediately after the opening &lt;body&gt; tag. Required for Google Tag Manager &lt;noscript&gt; fallback iframes.
                </p>
              </div>

              <button
                onClick={() => handleCopy(bodyStartCode, "body-start")}
                className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Copy Body Start Code"
              >
                {copiedKey === "body-start" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="relative font-mono text-xs">
              <textarea
                value={bodyStartCode}
                onChange={(e) => setBodyStartCode(e.target.value)}
                disabled={loading}
                rows={7}
                className="w-full bg-[#0b0f19] text-gray-200 p-4 focus:outline-none focus:ring-1 focus:ring-[#c5a880]/50 font-mono leading-relaxed resize-y selection:bg-[#c5a880]/30"
                spellCheck={false}
                placeholder="<!-- Paste GTM <noscript> or body start fallback code here -->"
              />
            </div>
          </div>

          {/* 3. BODY END CODE */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 bg-black/40 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>BODY END CODE (Before closing &lt;/body&gt;)</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Injected immediately before &lt;/body&gt;. Ideal for live chat widgets (Tawk.to, Intercom), Facebook Pixel, and tracking conversion tags.
                </p>
              </div>

              <button
                onClick={() => handleCopy(bodyEndCode, "body-end")}
                className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Copy Body End Code"
              >
                {copiedKey === "body-end" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="relative font-mono text-xs">
              <textarea
                value={bodyEndCode}
                onChange={(e) => setBodyEndCode(e.target.value)}
                disabled={loading}
                rows={9}
                className="w-full bg-[#0b0f19] text-gray-200 p-4 focus:outline-none focus:ring-1 focus:ring-[#c5a880]/50 font-mono leading-relaxed resize-y selection:bg-[#c5a880]/30"
                spellCheck={false}
                placeholder="<!-- Paste chat widgets, conversion tracking pixels, or footer scripts here -->"
              />
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="p-4 bg-[#111827] border border-white/5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <button
                onClick={() => handleRestore(undefined, true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Preview Configuration
              </button>

              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#c5a880] text-black rounded-xl text-xs font-bold hover:bg-[#d8be96] transition-all shadow-md shadow-[#c5a880]/20 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Backups & Guidelines */}
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
              <p className="text-xs text-gray-500 italic">No previous backups yet. Automatic snapshots are created every time you click Save Changes.</p>
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

          {/* Quick Guide Card */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 shadow-xl space-y-3 text-xs text-gray-400">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#c5a880]">
              Recommended Practices:
            </h4>
            <ul className="space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>GTM / Analytics:</strong> Wrap in &lt;script&gt; tags. Avoid adding raw text outside of tags.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Custom CSS:</strong> Always wrap CSS rules in &lt;style&gt; ... &lt;/style&gt; tags inside HEAD CODE.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>No Secrets:</strong> Never paste server API secrets, database credentials, or private tokens here.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Safe Toggle:</strong> If troubleshooting a site issue, use the <em>Status: Active/Disabled</em> switch to test without losing your snippets.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#c5a880]" />
                <h3 className="text-base font-bold text-white">Custom Code Slots Preview</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700 text-gray-300"}`}>
                {enabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#c5a880] uppercase">HEAD CODE ({headCode.length} chars)</span>
                <pre className="p-3 bg-black/50 border border-white/5 rounded-xl font-mono text-[11px] text-gray-300 overflow-x-auto max-h-36">
                  {headCode || "<empty>"}
                </pre>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase">BODY START CODE ({bodyStartCode.length} chars)</span>
                <pre className="p-3 bg-black/50 border border-white/5 rounded-xl font-mono text-[11px] text-gray-300 overflow-x-auto max-h-36">
                  {bodyStartCode || "<empty>"}
                </pre>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-purple-400 uppercase">BODY END CODE ({bodyEndCode.length} chars)</span>
                <pre className="p-3 bg-black/50 border border-white/5 rounded-xl font-mono text-[11px] text-gray-300 overflow-x-auto max-h-36">
                  {bodyEndCode || "<empty>"}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-white/10">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 bg-[#c5a880] text-black font-bold text-xs rounded-xl hover:bg-[#d8be96] cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
