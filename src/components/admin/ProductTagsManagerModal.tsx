"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Search,
  Check,
  Tag,
  Sparkles,
  Layers,
  Filter,
  CheckSquare,
  Square,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { ProductItem } from "@/types/admin";
import { resolveProductImage } from "@/utils/productImages";

export type TagType = "NEW_ARRIVAL" | "TILE_OF_SPAIN";

interface ProductTagsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTag?: TagType;
  products: ProductItem[];
  onSaved: () => Promise<void> | void;
}

const CATEGORIES = [
  { id: "ALL", name: "All Categories" },
  { id: "brick", name: "Brick Look" },
  { id: "stone", name: "Stone Look" },
  { id: "wooden", name: "Wooden Look" },
  { id: "tropical", name: "Tropical / Floral" },
  { id: "mosaic", name: "Mosaic Tiles" },
  { id: "marble", name: "Marble Look" },
  { id: "subway", name: "Subway Tiles" },
  { id: "texture", name: "Texture / 3D" },
  { id: "metallic", name: "Metallic Finish" },
  { id: "boutique", name: "Boutique Tiles" },
  { id: "hexagon", name: "Hexagon Tiles" },
  { id: "moroccan", name: "Moroccan Tiles" },
  { id: "colorful", name: "Colorful Tiles" },
  { id: "highlighter", name: "Highlighter Tiles" },
  { id: "french-frames", name: "French Frames" },
  { id: "modular", name: "Modular Tiles" },
  { id: "octagonal", name: "Octagonal Tiles" },
  { id: "terrazzo", name: "Terrazzo Pattern" },
  { id: "white", name: "White / Plain" },
  { id: "fabric", name: "Fabric Texture" },
  { id: "geometric", name: "Geometric Pattern" },
];

function isProductTagged(p: ProductItem, tag: TagType): boolean {
  if (tag === "NEW_ARRIVAL") {
    return Boolean(p.isNewArrival || p.is_new_arrival);
  }
  if (tag === "TILE_OF_SPAIN") {
    return Boolean(p.showTileOfSpainBadge || p.show_tile_of_spain_badge);
  }
  return false;
}

export function ProductTagsManagerModal({
  isOpen,
  onClose,
  initialTag = "NEW_ARRIVAL",
  products,
  onSaved,
}: ProductTagsManagerModalProps) {
  const [activeTag, setActiveTag] = useState<TagType>(initialTag);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [initialIds, setInitialIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ASSIGNED" | "UNASSIGNED">("ALL");
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync initial tag when opened or initialTag prop changes
  useEffect(() => {
    if (isOpen) {
      setActiveTag(initialTag);
    }
  }, [isOpen, initialTag]);

  // When activeTag or products change, load initial assigned product IDs
  useEffect(() => {
    if (!isOpen) return;
    const currentTagged = new Set<string>();
    products.forEach((p) => {
      if (isProductTagged(p, activeTag)) {
        currentTagged.add(p.id);
      }
    });
    setSelectedIds(new Set(currentTagged));
    setInitialIds(new Set(currentTagged));
    setSearchQuery("");
    setStatusFilter("ALL");
    setSaveFeedback(null);
  }, [activeTag, isOpen, products]);

  // Filtered products list for display
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      // 1. Search Query
      if (q) {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const codeMatch = p.code?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
        const catMatch = (p.category || p.category_name || "").toLowerCase().includes(q);
        if (!nameMatch && !codeMatch && !catMatch) return false;
      }

      // 2. Category Filter
      if (categoryFilter !== "ALL") {
        const pCat = (p.categoryId || p.category_id || p.category || "").toLowerCase();
        if (pCat !== categoryFilter.toLowerCase()) return false;
      }

      // 3. Status Filter (Assigned vs Unassigned)
      const isSelected = selectedIds.has(p.id);
      if (statusFilter === "ASSIGNED" && !isSelected) return false;
      if (statusFilter === "UNASSIGNED" && isSelected) return false;

      return true;
    });
  }, [products, searchQuery, categoryFilter, statusFilter, selectedIds]);

  if (!isOpen) return null;

  // Toggle individual product selection
  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Bulk select all filtered products
  const handleSelectAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredProducts.forEach((p) => next.add(p.id));
      return next;
    });
  };

  // Bulk deselect all filtered products
  const handleDeselectAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredProducts.forEach((p) => next.delete(p.id));
      return next;
    });
  };

  // Calculate changes
  let addedCount = 0;
  let removedCount = 0;
  selectedIds.forEach((id) => {
    if (!initialIds.has(id)) addedCount++;
  });
  initialIds.forEach((id) => {
    if (!selectedIds.has(id)) removedCount++;
  });

  const isDirty = addedCount > 0 || removedCount > 0;

  // Save Changes Handler
  const handleSave = async () => {
    setSaving(true);
    setSaveFeedback(null);

    try {
      const res = await fetch("/api/v1/products/bulk-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tag: activeTag,
          productIds: Array.from(selectedIds),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update product tags.");
      }

      setInitialIds(new Set(selectedIds));
      setSaveFeedback({
        type: "success",
        text: `Successfully updated ${activeTag === "TILE_OF_SPAIN" ? "Tile of Spain" : "New Arrival"} tag for ${selectedIds.size} product(s)!`,
      });

      // Dispatch global update event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("product-updated", { detail: { bulkTag: activeTag } }));
        try {
          localStorage.setItem("timex_products_updated", Date.now().toString());
        } catch (_) {}
      }

      // Re-fetch in parent component
      await onSaved();

      setTimeout(() => {
        setSaveFeedback(null);
      }, 3500);
    } catch (err: any) {
      setSaveFeedback({
        type: "error",
        text: err.message || "Failed to save product tag changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="bg-[#0b101d] border border-white/10 rounded-2xl sm:rounded-3xl max-w-5xl w-full h-[92vh] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Top Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0e1628]/95 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a880]/20 to-[#c5a880]/5 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] shadow-xs">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Product Tags & Badges Manager
                </h3>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                  Centralized Control
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Bulk assign or remove marketing tags and showcase badges across multiple products simultaneously.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close Tag Manager"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tag Selector Navigation Bar */}
        <div className="shrink-0 bg-[#090d16] border-b border-white/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 mr-1 hidden sm:inline">Select Tag:</span>
            <button
              type="button"
              onClick={() => setActiveTag("NEW_ARRIVAL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTag === "NEW_ARRIVAL"
                  ? "bg-[#C95745] text-white shadow-md shadow-[#C95745]/20 font-extrabold"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ New Arrival</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTag === "NEW_ARRIVAL" ? "bg-white/20 text-white" : "bg-black/30 text-gray-400"
              }`}>
                {products.filter((p) => Boolean(p.isNewArrival || p.is_new_arrival)).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTag("TILE_OF_SPAIN")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTag === "TILE_OF_SPAIN"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/25 font-extrabold"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <span className="text-sm">🇪🇸</span>
              <span>Show Tile of Spain Badge</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTag === "TILE_OF_SPAIN" ? "bg-white/20 text-white" : "bg-black/30 text-gray-400"
              }`}>
                {products.filter((p) => Boolean(p.showTileOfSpainBadge || p.show_tile_of_spain_badge)).length}
              </span>
            </button>
          </div>

          {/* Active Tag Description */}
          <div className="text-[11px] text-gray-400 flex items-center gap-2">
            {activeTag === "NEW_ARRIVAL" ? (
              <span className="bg-[#C95745]/15 text-[#C95745] px-2.5 py-1 rounded-lg border border-[#C95745]/30">
                Displays <strong>NEW</strong> badge on product cards and features in Homepage Latest Collections.
              </span>
            ) : (
              <span className="bg-red-950/30 text-red-400 px-2.5 py-1 rounded-lg border border-red-500/30 flex items-center gap-2">
                <img src="/images/tile-of-spain.png" alt="Badge" className="w-8 h-auto aspect-[2/1] object-contain inline-block" />
                <span>Displays the official logo at the bottom-left corner of product images.</span>
              </span>
            )}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-white/5 bg-[#0b101d] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, code, SKU, or collection..."
                className="w-full bg-[#111827] border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown Filter */}
            <div className="sm:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Status View Tabs */}
            <div className="sm:col-span-3 flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
                  statusFilter === "ALL" ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                All ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("ASSIGNED")}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
                  statusFilter === "ASSIGNED"
                    ? activeTag === "TILE_OF_SPAIN"
                      ? "bg-red-600 text-white"
                      : "bg-[#C95745] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Tagged ({selectedIds.size})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("UNASSIGNED")}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
                  statusFilter === "UNASSIGNED" ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Untagged ({products.length - selectedIds.size})
              </button>
            </div>
          </div>

          {/* Quick Bulk Action Buttons & Selection Counter */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Select All Filtered ({filteredProducts.length})</span>
              </button>

              <button
                type="button"
                onClick={handleDeselectAllFiltered}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 text-gray-400" />
                <span>Deselect All Filtered</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 text-gray-400 hover:text-red-400 text-[11px] font-medium transition-colors cursor-pointer"
              >
                <span>Clear All Tags</span>
              </button>
            </div>

            {/* Selection Counter & Diff Badge */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-[11px]">Selected for tag:</span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase shadow-2xs ${
                activeTag === "TILE_OF_SPAIN"
                  ? "bg-red-600/20 text-red-400 border border-red-500/30"
                  : "bg-[#C95745]/20 text-[#C95745] border border-[#C95745]/30"
              }`}>
                {selectedIds.size} Products
              </span>

              {isDirty && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {addedCount > 0 && `+${addedCount} added `}
                  {removedCount > 0 && `-${removedCount} removed`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Message Banner (if any) */}
        {saveFeedback && (
          <div
            className={`shrink-0 px-4 py-2.5 flex items-center gap-2 text-xs font-semibold ${
              saveFeedback.type === "success"
                ? "bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400"
                : "bg-red-500/15 border-b border-red-500/30 text-red-400"
            }`}
          >
            {saveFeedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{saveFeedback.text}</span>
          </div>
        )}

        {/* Main Products Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <Filter className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-sm font-semibold text-gray-300">No products match your filter criteria.</p>
              <p className="text-xs text-gray-500 mt-1">Try clearing your search query or selecting &quot;All Categories&quot;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredProducts.map((p) => {
                const isSelected = selectedIds.has(p.id);
                const rawImg = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "";
                const thumbUrl = resolveProductImage(rawImg, p.categoryId || p.category_id, 0);

                return (
                  <div
                    key={p.id}
                    onClick={() => handleToggle(p.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                      isSelected
                        ? activeTag === "TILE_OF_SPAIN"
                          ? "bg-red-950/25 border-red-500/50 shadow-md shadow-red-950/30"
                          : "bg-[#C95745]/15 border-[#C95745]/50 shadow-md shadow-[#C95745]/20"
                        : "bg-[#111827]/70 border-white/5 hover:border-white/20 hover:bg-[#111827]"
                    }`}
                  >
                    {/* Left: Checkbox + Thumbnail + Product Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox indicator */}
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? activeTag === "TILE_OF_SPAIN"
                              ? "bg-red-600 text-white"
                              : "bg-[#C95745] text-white"
                            : "border border-white/20 bg-black/40 text-transparent"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      {/* Thumbnail with overlay badge preview */}
                      <div className="relative w-12 h-12 rounded-lg bg-[#090d16] border border-white/10 overflow-hidden shrink-0">
                        <img
                          src={thumbUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Live Badge Preview on thumbnail */}
                        {isSelected && activeTag === "TILE_OF_SPAIN" && (
                          <div className="absolute bottom-0.5 left-0.5 z-10 w-6 h-auto aspect-[2/1] pointer-events-none drop-shadow">
                            <img
                              src="/images/tile-of-spain.png"
                              alt="Spain Badge"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        {isSelected && activeTag === "NEW_ARRIVAL" && (
                          <div className="absolute top-0.5 left-0.5 z-10 px-1 py-0.2 rounded-[1px] bg-[#C95745] text-white text-[7px] font-extrabold uppercase">
                            NEW
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-[260px]">
                            {p.name}
                          </h4>
                          <span className="text-[10px] font-mono text-[#c5a880] shrink-0">
                            {p.code || p.sku || "TMX"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                          <span className="truncate">{p.category || p.category_name || "Tile"}</span>
                          <span>•</span>
                          <span>{p.size || "Standard"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Toggle Button / Status Pill */}
                    <div className="shrink-0 flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                          isSelected
                            ? activeTag === "TILE_OF_SPAIN"
                              ? "bg-red-600 text-white font-extrabold"
                              : "bg-[#C95745] text-white font-extrabold"
                            : "bg-white/5 text-gray-500 border border-white/5"
                        }`}
                      >
                        {isSelected ? "Assigned" : "Off"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Footer */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-white/10 bg-[#0e1628] flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-20">
          <div className="text-xs text-gray-300">
            <span>
              Tagging <strong>{selectedIds.size}</strong> of {products.length} products with{" "}
              <strong className={activeTag === "TILE_OF_SPAIN" ? "text-red-400" : "text-[#C95745]"}>
                {activeTag === "TILE_OF_SPAIN" ? "Tile of Spain" : "New Arrival"}
              </strong>.
            </span>
            {isDirty && (
              <span className="text-amber-400 ml-2 text-[11px] font-medium">
                (Unsaved changes will be applied to all selected products)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !isDirty}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                isDirty
                  ? activeTag === "TILE_OF_SPAIN"
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 font-extrabold"
                    : "bg-[#c5a880] hover:bg-[#d4b993] text-black shadow-[#c5a880]/20 font-extrabold"
                  : "bg-white/10 text-gray-500 cursor-not-allowed border border-white/5"
              }`}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Tag Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {isDirty
                      ? `Save Changes (${selectedIds.size} Products)`
                      : "Saved (No Changes)"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

