"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Package,
  FileText,
  Image as ImageIcon,
  Globe,
  RefreshCw,
  Search,
  Filter,
  Layers,
  ShieldAlert,
  X,
  ExternalLink,
} from "lucide-react";
import { TrashItem, TrashEntityType, TrashStats } from "@/types/trash";
import {
  getTrashItems,
  restoreTrashItem,
  permanentDeleteTrashItem,
  emptyTrash,
} from "@/services/trash";

interface RecycleBinClientProps {
  onItemRestored?: () => void;
}

export function RecycleBinClient({ onItemRestored }: RecycleBinClientProps) {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [stats, setStats] = useState<TrashStats>({
    total: 0,
    products: 0,
    blogs: 0,
    media: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Permanent Delete Modal
  const [itemToDelete, setItemToDelete] = useState<TrashItem | null>(null);
  const [forceDelete, setForceDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Empty Trash Modal
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadTrash = async () => {
    setLoading(true);
    try {
      const data = await getTrashItems(activeTab !== "all" ? activeTab : undefined);
      setItems(data.items);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to load trash:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, [activeTab]);

  // Restore Handler
  const handleRestore = async (item: TrashItem) => {
    setActionLoading(true);
    try {
      const res = await restoreTrashItem(item.type, item.id);
      if (res.success) {
        showToast(`Restored "${item.name}" back to ${item.type}s.`);
        setItems((prev) => prev.filter((i) => !(i.type === item.type && i.id === item.id)));
        loadTrash();
        if (onItemRestored) onItemRestored();
      } else {
        alert(res.error || "Failed to restore item.");
      }
    } catch (err: any) {
      alert(`Error restoring item: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Permanent Delete Handler
  const confirmPermanentDelete = async () => {
    if (!itemToDelete) return;
    setActionLoading(true);
    try {
      const res = await permanentDeleteTrashItem(
        itemToDelete.type,
        itemToDelete.id,
        forceDelete
      );
      if (res.success) {
        showToast(`Permanently deleted "${itemToDelete.name}".`);
        setItems((prev) =>
          prev.filter((i) => !(i.type === itemToDelete.type && i.id === itemToDelete.id))
        );
        setItemToDelete(null);
        setForceDelete(false);
        loadTrash();
      } else {
        alert(res.error || "Failed to permanently delete item.");
      }
    } catch (err: any) {
      alert(`Error deleting item: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Empty Trash Handler
  const confirmEmptyTrash = async () => {
    setActionLoading(true);
    try {
      const typeParam = activeTab !== "all" ? activeTab : undefined;
      const res = await emptyTrash(typeParam);
      if (res.success) {
        showToast(res.message || "Recycle Bin emptied successfully.");
        setEmptyTrashModalOpen(false);
        loadTrash();
      } else {
        alert(res.error || "Failed to empty Recycle Bin.");
      }
    } catch (err: any) {
      alert(`Error emptying trash: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Filter items by search
  const filteredItems = items.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.slug?.toLowerCase().includes(q) ||
      item.code?.toLowerCase().includes(q) ||
      item.originalCategory?.toLowerCase().includes(q)
    );
  });

  const getTypeIcon = (type: TrashEntityType) => {
    switch (type) {
      case "Product":
        return <Package className="w-4 h-4 text-[#c5a880]" />;
      case "Blog":
        return <FileText className="w-4 h-4 text-sky-400" />;
      case "Media":
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case "Page":
        return <Globe className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#c5a880] text-black text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Recycle Bin</h2>
          <p className="text-xs text-gray-400">
            Restore deleted products, articles, media assets, and pages, or permanently remove them from storage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadTrash}
            title="Reload trash"
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors cursor-pointer border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#c5a880]" : ""}`} />
          </button>

          {stats.total > 0 && (
            <button
              onClick={() => setEmptyTrashModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Empty Trash ({stats.total})</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#111827] border border-white/10 rounded-2xl overflow-x-auto scrollbar-none">
        {[
          { key: "all", label: "All Items", count: stats.total },
          { key: "products", label: "Products", count: stats.products },
          { key: "blogs", label: "Blog Posts", count: stats.blogs },
          { key: "media", label: "Media Assets", count: stats.media },
          { key: "pages", label: "Pages", count: stats.pages },
        ].map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#c5a880] text-black font-extrabold shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  isSelected ? "bg-black/20 text-black font-bold" : "bg-white/10 text-gray-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter deleted items by title, code, or original category..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Trash Items List */}
      {loading ? (
        <div className="p-16 text-center text-gray-400 space-y-3 bg-[#111827] border border-white/10 rounded-2xl">
          <div className="w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Scanning Recycle Bin records...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 text-center text-gray-400 space-y-3 bg-[#111827] border border-dashed border-white/10 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-white">Recycle Bin is Empty</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {search
                ? "No deleted items match your search filter."
                : "No deleted items found in this section. Everything is currently active and healthy."}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090d16] text-gray-400 border-b border-white/10 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Original Category / Path</th>
                  <th className="px-4 py-3">Deleted At</th>
                  <th className="px-4 py-3">Usage Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map((item) => {
                  const hasActiveRefs = (item.usedByCount || 0) > 0;
                  return (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0 flex items-center justify-center">
                            {item.previewUrl ? (
                              <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              getTypeIcon(item.type)
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">{item.name}</p>
                            {item.code && (
                              <span className="text-[10px] text-gray-400 font-mono">Code: {item.code}</span>
                            )}
                            {item.slug && !item.code && (
                              <span className="text-[10px] text-gray-500 font-mono">/{item.slug}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-gray-200">
                          {getTypeIcon(item.type)}
                          <span>{item.type}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-gray-400">
                        {item.originalCategory || "—"}
                      </td>

                      <td className="px-4 py-3.5 text-gray-400 text-[11px] whitespace-nowrap">
                        <div>{new Date(item.deleted_at).toLocaleDateString()}</div>
                        <div className="text-[10px] text-gray-500">{new Date(item.deleted_at).toLocaleTimeString()}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        {hasActiveRefs ? (
                          <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Referenced ({item.usedByCount})</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Safe to Delete</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRestore(item)}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/15 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>

                          <button
                            onClick={() => setItemToDelete(item)}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/15 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERMANENT DELETE CONFIRMATION MODAL                                       */}
      {/* ========================================================================= */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-white">Permanent Deletion Warning</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to permanently delete <strong>"{itemToDelete.name}"</strong>?
              This action <span className="text-red-400 font-bold">cannot be undone</span>.
              The record will be completely erased from the database.
            </p>

            {(itemToDelete.usedByCount || 0) > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Active Dependencies Detected!</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  This item is referenced by {itemToDelete.usedByCount} active resource(s):{" "}
                  <strong>{itemToDelete.usedByNames?.join(", ")}</strong>.
                </p>
                <label className="flex items-center gap-2 pt-1 text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={forceDelete}
                    onChange={(e) => setForceDelete(e.target.checked)}
                    className="rounded bg-black/50 border-white/20"
                  />
                  <span className="text-[11px] font-bold">I understand, force permanent deletion anyway</span>
                </label>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setItemToDelete(null);
                  setForceDelete(false);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmPermanentDelete}
                disabled={actionLoading || ((itemToDelete.usedByCount || 0) > 0 && !forceDelete)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg disabled:opacity-40"
              >
                {actionLoading ? "Deleting..." : "Permanently Erase"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EMPTY TRASH CONFIRMATION MODAL                                            */}
      {/* ========================================================================= */}
      {emptyTrashModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-white">Empty Recycle Bin</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to permanently delete all items in the Recycle Bin?
              Any attached exclusive media will be permanently purged.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setEmptyTrashModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmEmptyTrash}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg"
              >
                {actionLoading ? "Purging..." : "Confirm & Empty Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
