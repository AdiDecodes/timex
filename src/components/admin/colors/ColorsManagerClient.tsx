"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Palette,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  Check,
  AlertCircle,
  X,
  Sliders,
  CheckCircle2,
  Copy,
  Layers,
} from "lucide-react";
import { ColorItem } from "@/types/colors";
import { fetchColors, createColor, updateColor, deleteColor } from "@/services/colors";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ColorsManagerClient() {
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<ColorItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formHex, setFormHex] = useState("#808080");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(100);
  const [saving, setSaving] = useState(false);

  // Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState<ColorItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const items = await fetchColors();
      setColors(items);
    } catch (err: any) {
      showNotification("error", "Failed to load colors: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingColor(null);
    setFormName("");
    setFormSlug("");
    setFormHex("#808080");
    setFormIsActive(true);
    const maxOrder = colors.reduce((max, c) => Math.max(max, c.displayOrder || 0), 0);
    setFormDisplayOrder(maxOrder + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (color: ColorItem) => {
    setEditingColor(color);
    setFormName(color.name);
    setFormSlug(color.slug);
    setFormHex(color.hex && color.hex.startsWith("#") ? color.hex : "#808080");
    setFormIsActive(color.isActive !== false);
    setFormDisplayOrder(color.displayOrder || 1);
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormName(val);
    if (!editingColor) {
      setFormSlug(slugify(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showNotification("error", "Color name cannot be empty.");
      return;
    }
    const slug = slugify(formSlug || formName);
    if (!slug) {
      showNotification("error", "Valid slug is required.");
      return;
    }

    setSaving(true);
    try {
      if (editingColor) {
        const res = await updateColor(editingColor.id, {
          name: formName.trim(),
          slug,
          hex: formHex,
          isActive: formIsActive,
          displayOrder: formDisplayOrder,
        });
        if (res.success) {
          showNotification("success", `Color "${formName.trim()}" updated successfully.`);
          setIsModalOpen(false);
          await loadData();
        } else {
          showNotification("error", res.error || "Failed to update color.");
        }
      } else {
        const res = await createColor({
          name: formName.trim(),
          slug,
          hex: formHex,
          isActive: formIsActive,
          displayOrder: formDisplayOrder,
        });
        if (res.success) {
          showNotification("success", `Color "${formName.trim()}" created successfully.`);
          setIsModalOpen(false);
          await loadData();
        } else {
          showNotification("error", res.error || "Failed to create color.");
        }
      }
    } catch (err: any) {
      showNotification("error", err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (color: ColorItem) => {
    const newStatus = !color.isActive;
    // Optimistic UI update
    setColors((prev) =>
      prev.map((c) => (c.id === color.id ? { ...c, isActive: newStatus } : c))
    );

    try {
      const res = await updateColor(color.id, { isActive: newStatus });
      if (!res.success) {
        // Revert on failure
        setColors((prev) =>
          prev.map((c) => (c.id === color.id ? { ...c, isActive: color.isActive } : c))
        );
        showNotification("error", res.error || "Failed to update color status.");
      } else {
        showNotification(
          "success",
          `Color "${color.name}" is now ${newStatus ? "Active" : "Inactive"}.`
        );
      }
    } catch (err: any) {
      setColors((prev) =>
        prev.map((c) => (c.id === color.id ? { ...c, isActive: color.isActive } : c))
      );
      showNotification("error", err.message || "Failed to update color status.");
    }
  };

  const handleDelete = async (force = false) => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteColor(deleteTarget.id, force);
      if (res.success) {
        showNotification("success", `Color "${deleteTarget.name}" deleted successfully.`);
        setDeleteTarget(null);
        await loadData();
      } else {
        showNotification("error", res.error || "Failed to delete color.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete color.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredColors = useMemo(() => {
    let result = [...colors];
    if (statusFilter === "active") {
      result = result.filter((c) => c.isActive !== false);
    } else if (statusFilter === "inactive") {
      result = result.filter((c) => c.isActive === false);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          c.hex.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => Number(a.displayOrder ?? 999) - Number(b.displayOrder ?? 999));
  }, [colors, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = colors.length;
    const active = colors.filter((c) => c.isActive !== false).length;
    const inactive = colors.filter((c) => c.isActive === false).length;
    const totalAssigned = colors.reduce((acc, c) => acc + (c.productCount || 0), 0);
    return { total, active, inactive, totalAssigned };
  }, [colors]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            notification.type === "success"
              ? "bg-[#0b1b14] border-emerald-500/40 text-emerald-200"
              : "bg-[#200d0d] border-red-500/40 text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Color Management
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/30 font-semibold font-mono">
                  {stats.total} Colors
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                Manage tile colors dynamically for product specifications and the website header BY COLOR mega menu.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl border border-white/10 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-[#c5a880] hover:bg-[#b09166] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#c5a880]/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add New Color</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Colors</span>
            <Palette className="w-4 h-4 text-[#c5a880]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1.5 font-mono">{stats.total}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Database records</div>
        </div>

        <div className="bg-[#0d1424] border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Active in Header</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 mt-1.5 font-mono">{stats.active}</div>
          <div className="text-[11px] text-emerald-500/80 mt-0.5">Visible on frontend menu</div>
        </div>

        <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Inactive</span>
            <Sliders className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-extrabold text-gray-300 mt-1.5 font-mono">{stats.inactive}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Hidden from header menu</div>
        </div>

        <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Product Links</span>
            <Layers className="w-4 h-4 text-[#c5a880]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1.5 font-mono">{stats.totalAssigned}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Assigned product items</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0d1424] border border-white/10 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colors by name, slug or hex code..."
            className="w-full bg-[#111827] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-[#111827] border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#c5a880] text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            All ({colors.length})
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "active"
                ? "bg-emerald-500 text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setStatusFilter("inactive")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "inactive"
                ? "bg-white/20 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Inactive ({stats.inactive})
          </button>
        </div>
      </div>

      {/* Colors List Table */}
      <div className="bg-[#0d1424] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#c5a880]" />
            <p className="text-xs">Loading colors from database...</p>
          </div>
        ) : filteredColors.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Palette className="w-8 h-8 text-gray-600" />
            <p className="text-sm font-semibold text-gray-300">No colors found</p>
            <p className="text-xs text-gray-500">
              {searchQuery ? "Try clearing your search query." : "Click '+ Add New Color' to add your first color."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-white/[0.02]">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Color</th>
                  <th className="py-3 px-4">Slug / Frontend Route</th>
                  <th className="py-3 px-4">Hex Code</th>
                  <th className="py-3 px-4">Assigned Products</th>
                  <th className="py-3 px-4">Header Menu Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredColors.map((color, idx) => {
                  const hexCode = color.hex && color.hex.startsWith("#") ? color.hex : "#808080";
                  return (
                    <tr
                      key={color.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Order */}
                      <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                        #{color.displayOrder || idx + 1}
                      </td>

                      {/* Swatch & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-lg border border-white/20 shadow-inner shrink-0"
                            style={{ backgroundColor: hexCode }}
                            title={`${color.name} (${hexCode})`}
                          />
                          <div>
                            <span className="font-bold text-white block text-sm">{color.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono">ID: {color.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Slug / Route */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-gray-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            /{color.slug}-color
                          </span>
                          <Link
                            href={`/${color.slug}-color`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#c5a880] transition-colors p-1"
                            title="Open frontend color page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>

                      {/* Hex */}
                      <td className="py-3 px-4 font-mono text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <span className="uppercase font-semibold">{hexCode}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(hexCode);
                              showNotification("success", `Copied ${hexCode} to clipboard!`);
                            }}
                            className="text-gray-500 hover:text-white p-1 rounded"
                            title="Copy HEX"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Products Count */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                            (color.productCount || 0) > 0
                              ? "bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/30"
                              : "bg-white/5 text-gray-400 border border-white/10"
                          }`}
                        >
                          {color.productCount || 0} Products
                        </span>
                      </td>

                      {/* Active Toggle Switch */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(color)}
                          className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                            color.isActive !== false
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                              : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                          }`}
                          title={color.isActive !== false ? "Click to deactivate" : "Click to activate"}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              color.isActive !== false ? "bg-emerald-400" : "bg-gray-500"
                            }`}
                          />
                          <span>{color.isActive !== false ? "Active (Shown)" : "Inactive (Hidden)"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(color)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit color"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(color)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete color"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Color Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0d1424] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#c5a880]" />
                {editingColor ? `Edit Color: ${editingColor.name}` : "Add New Color"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Color Name */}
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1">
                  Color Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={handleNameChange}
                  placeholder="e.g. Ivory or Terracotta"
                  required
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1">
                  URL Slug <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center">
                  <span className="bg-[#111827] border border-r-0 border-white/10 rounded-l-xl px-3 py-2.5 text-xs text-gray-500 font-mono">
                    /
                  </span>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(slugify(e.target.value))}
                    placeholder="ivory"
                    required
                    className="flex-1 bg-[#111827] border border-x-0 border-white/10 px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#c5a880]"
                  />
                  <span className="bg-[#111827] border border-l-0 border-white/10 rounded-r-xl px-3 py-2.5 text-xs text-gray-500 font-mono">
                    -color
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Frontend collection URL will be: <code className="text-[#c5a880]">/{formSlug || "slug"}-color</code> and <code className="text-[#c5a880]">/color/{formSlug || "slug"}</code>
                </p>
              </div>

              {/* Color Hex & Swatch Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1">
                  HEX Swatch Code
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={formHex.startsWith("#") ? formHex : "#808080"}
                      onChange={(e) => setFormHex(e.target.value.toUpperCase())}
                      className="w-10 h-10 rounded-xl border border-white/20 bg-transparent cursor-pointer p-0.5"
                    />
                  </div>
                  <input
                    type="text"
                    value={formHex}
                    onChange={(e) => setFormHex(e.target.value)}
                    placeholder="#FFFFF0"
                    className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#c5a880]"
                  />
                  <div
                    className="w-10 h-10 rounded-xl border border-white/20 shadow-inner shrink-0"
                    style={{ backgroundColor: formHex }}
                  />
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1">
                  Display Order Priority
                </label>
                <input
                  type="number"
                  value={formDisplayOrder}
                  onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                  min={1}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c5a880]"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Controls the sort order in the frontend BY COLOR mega menu (lower numbers appear first).
                </p>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-white block">Active in Website Header</span>
                  <span className="text-[11px] text-gray-400">
                    If active, this color appears immediately in the BY COLOR dropdown.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormIsActive(!formIsActive)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    formIsActive ? "bg-emerald-500 justify-end" : "bg-white/10 justify-start"
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#c5a880] hover:bg-[#b09166] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#c5a880]/20"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingColor ? "Save Changes" : "Create Color"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0d1424] border border-red-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Color: {deleteTarget.name}?</h3>
                <p className="text-xs text-gray-400 mt-1">
                  This action will permanently remove the color record from the database and frontend menu.
                </p>
              </div>
            </div>

            {/* Product Dependency Check */}
            {(deleteTarget.productCount || 0) > 0 && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Assigned Products Warning</span>
                </div>
                <p className="text-[11px] text-amber-300">
                  This color is currently assigned to <strong>{deleteTarget.productCount}</strong> product(s). If deleted, this color tag will no longer link to them.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(true)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-red-600/20"
              >
                {deleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
