"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  ArrowRight,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  ExternalLink,
  Check,
  Compass,
} from "lucide-react";

export function FourZeroFourTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [creatingForUrl, setCreatingForUrl] = useState<string | null>(null);
  const [targetRedirect, setTargetRedirect] = useState("/products");
  const [savingRedirect, setSavingRedirect] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/seo/404-logs?_t=" + Date.now());
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to load 404 logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCreateRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingForUrl) return;
    setSavingRedirect(true);

    try {
      const res = await fetch("/api/v1/seo/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_url: creatingForUrl,
          destination_url: targetRedirect.trim(),
          redirect_type: 301,
          is_active: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Created 301 redirect from ${creatingForUrl} -> ${targetRedirect}`);
        setCreatingForUrl(null);
        fetchLogs();
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      console.error("Create redirect error:", err);
    } finally {
      setSavingRedirect(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/seo/404-logs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchLogs();
      }
    } catch (err) {
      console.error("Delete 404 log error:", err);
    }
  };

  const filtered = logs.filter(
    (l) => !search || l.url?.toLowerCase().includes(search.toLowerCase()) || l.referrer?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">404 Error Monitor</h2>
          <p className="text-xs text-gray-400">
            Real visitor 404 detections captured dynamically from the live site. Convert broken traffic into 301 redirects in one click.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white cursor-pointer w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh 404 Feed
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Search */}
      <div className="p-4 bg-[#111827] border border-white/10 rounded-2xl flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-gray-300">
          Detected 404 Incidents ({filtered.length})
        </span>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search 404 URL or referrer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#090d16] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-16 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading 404 error log...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-[#111827] border border-white/10 rounded-2xl">
          No 404 errors recorded yet.
        </div>
      ) : (
        <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-wider text-gray-400">
                <th className="py-3.5 px-4">Requested URL</th>
                <th className="py-3.5 px-4 text-center">Hit Count</th>
                <th className="py-3.5 px-4">Referrer Source</th>
                <th className="py-3.5 px-4">Last Detected</th>
                <th className="py-3.5 px-4 text-right">Fix with 301</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-200">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-300">
                    {l.url}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {l.hit_count} hits
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-gray-400 truncate max-w-xs text-[11px]">
                    {l.referrer}
                  </td>

                  <td className="py-3.5 px-4 text-gray-400 text-[11px]">
                    {new Date(l.last_detected).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setCreatingForUrl(l.url);
                          setTargetRedirect("/products");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#c5a880] text-black font-bold text-xs hover:bg-[#d8bc93] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" /> 301 Redirect
                      </button>
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-white/5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Redirect Modal */}
      {creatingForUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-white">Create 301 Redirect for 404</h3>
            <p className="text-xs text-gray-400">
              Recover link equity and preserve visitor traffic for <span className="font-mono text-rose-300 font-bold">{creatingForUrl}</span>.
            </p>

            <form onSubmit={handleCreateRedirect} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-200">Destination URL</label>
                <input
                  type="text"
                  value={targetRedirect}
                  onChange={(e) => setTargetRedirect(e.target.value)}
                  placeholder="e.g. /products or /contact"
                  className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#c5a880]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreatingForUrl(null)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRedirect}
                  className="px-4 py-2 rounded-xl bg-[#c5a880] text-black font-bold text-xs uppercase"
                >
                  {savingRedirect ? "Creating..." : "Create 301 Redirect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
