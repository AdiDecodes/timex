"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Check,
} from "lucide-react";

export function RedirectsTab() {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form
  const [sourceUrl, setSourceUrl] = useState("");
  const [destUrl, setDestUrl] = useState("");
  const [redirType, setRedirType] = useState<number>(301);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRedirects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/seo/redirects?_t=" + Date.now());
      const data = await res.json();
      if (data.success && Array.isArray(data.redirects)) {
        setRedirects(data.redirects);
      }
    } catch (err) {
      console.error("Failed to load redirects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const openNewModal = () => {
    setEditingItem(null);
    setSourceUrl("");
    setDestUrl("");
    setRedirType(301);
    setIsActive(true);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setSourceUrl(item.source_url);
    setDestUrl(item.destination_url);
    setRedirType(item.redirect_type || 301);
    setIsActive(item.is_active !== undefined ? item.is_active : true);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);

    try {
      const res = await fetch("/api/v1/seo/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem?.id,
          source_url: sourceUrl.trim(),
          destination_url: destUrl.trim(),
          redirect_type: redirType,
          is_active: isActive,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || "Failed to save redirect.");
      } else {
        setSuccessMsg(editingItem ? "Redirect updated successfully." : "Redirect created successfully.");
        setIsModalOpen(false);
        fetchRedirects();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, src: string) => {
    if (!confirm(`Delete redirect for "${src}"?`)) return;
    try {
      const res = await fetch(`/api/v1/seo/redirects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchRedirects();
      }
    } catch (err) {
      console.error("Delete redirect error:", err);
    }
  };

  const filtered = redirects.filter(
    (r) =>
      !search ||
      r.source_url?.toLowerCase().includes(search.toLowerCase()) ||
      r.destination_url?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">301 / 302 Redirect Manager</h2>
          <p className="text-xs text-gray-400">
            Enforce permanent (301) and temporary (302) HTTP redirects executed instantly in Next.js edge middleware.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c5a880]/20 hover:brightness-110 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" /> Add Redirect
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Search and count */}
      <div className="p-4 bg-[#111827] border border-white/10 rounded-2xl flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-gray-300">
          Active Redirect Rules ({redirects.filter((r) => r.is_active).length} of {redirects.length})
        </span>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search source or destination URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#090d16] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
          />
        </div>
      </div>

      {/* Redirects Table */}
      {loading ? (
        <div className="p-16 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading redirects...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-[#111827] border border-white/10 rounded-2xl">
          No redirects configured yet. Click "Add Redirect" above.
        </div>
      ) : (
        <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-wider text-gray-400">
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Source URL</th>
                <th className="py-3.5 px-4">Destination Target</th>
                <th className="py-3.5 px-4 text-center">Hits</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-200">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.redirect_type === 301
                          ? "bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/30"
                          : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {r.redirect_type} {r.redirect_type === 301 ? "Permanent" : "Temporary"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    {r.source_url}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-gray-300 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#c5a880]" />
                    {r.destination_url}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-gray-400">
                    {r.hit_count || 0}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {r.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(r)}
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id, r.source_url)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-all"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-serif font-bold text-white">
                {editingItem ? "Edit Redirect Rule" : "Create Redirect Rule"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-200">Source Path (URL to intercept)</label>
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="e.g. /old-statuario or /catalogue.pdf"
                  className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#c5a880]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-200">Destination URL (Target)</label>
                <input
                  type="text"
                  value={destUrl}
                  onChange={(e) => setDestUrl(e.target.value)}
                  placeholder="e.g. /product/ascot or /products"
                  className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#c5a880]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-200">Redirect Type</label>
                  <select
                    value={redirType}
                    onChange={(e) => setRedirType(parseInt(e.target.value, 10))}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value={301}>301 (Permanent Redirect)</option>
                    <option value={302}>302 (Temporary Redirect)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="accent-[#c5a880] w-4 h-4 rounded"
                    />
                    <span>Active in Middleware</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-bold text-xs uppercase tracking-wider"
                >
                  {saving ? "Saving..." : "Save Redirect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
