"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  Eye,
  Trash2,
  RefreshCw,
  ExternalLink,
  Edit,
  CheckCircle2,
  AlertCircle,
  X,
  FileCode,
} from "lucide-react";
import { PageItem } from "@/types/admin";
import { getPagesList, softDeletePage } from "@/services/pages";

interface PagesManagerClientProps {
  onNavigateToSeo?: (path: string) => void;
}

export function PagesManagerClient({ onNavigateToSeo }: PagesManagerClientProps) {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageToDelete, setPageToDelete] = useState<PageItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await getPagesList();
      setPages(data);
    } catch (err) {
      console.error("Failed to load pages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const confirmDelete = async () => {
    if (!pageToDelete) return;
    setDeleting(true);
    try {
      const res = await softDeletePage(pageToDelete.id);
      if (res.success) {
        showToast(`Page "${pageToDelete.title}" moved to Recycle Bin.`);
        setPages((prev) => prev.filter((p) => p.id !== pageToDelete.id));
      } else {
        alert(res.error || "Failed to delete page.");
      }
    } catch (err: any) {
      alert(`Error deleting page: ${err.message}`);
    } finally {
      setDeleting(false);
      setPageToDelete(null);
    }
  };

  const filteredPages = pages.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.path.toLowerCase().includes(q)
    );
  });

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
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Website Pages</h2>
          <p className="text-xs text-gray-400">
            Overview of core routes, landing pages, dynamic modules, and their SEO alignment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadPages}
            title="Reload pages"
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors cursor-pointer border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#c5a880]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter pages by title or route path..."
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

      {/* Pages Table */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-gray-400 space-y-3">
            <div className="w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Loading website pages...</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="p-16 text-center text-gray-400 space-y-2">
            <Globe className="w-10 h-10 mx-auto text-gray-600" />
            <p className="text-xs">No pages match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090d16] text-gray-400 border-b border-white/10 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Page Name</th>
                  <th className="px-4 py-3">Route Path</th>
                  <th className="px-4 py-3">Template / Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a880]">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{page.title}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{page.path}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px] text-[#c5a880]">
                      {page.path}
                    </td>

                    <td className="px-4 py-3.5 text-gray-400">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-gray-300">
                        {page.template || "Standard"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {page.status || "Published"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-gray-400 text-[11px]">
                      {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "Live"}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={page.path}
                          target="_blank"
                          title="View Live Page"
                          className="p-1.5 text-gray-400 hover:text-[#c5a880] hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        {onNavigateToSeo && (
                          <button
                            onClick={() => onNavigateToSeo(page.path)}
                            title="Manage SEO Metadata"
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {page.path !== "/" && (
                          <button
                            onClick={() => setPageToDelete(page)}
                            title="Move Page to Recycle Bin"
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Page Modal */}
      {pageToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/10 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-white">Move Page to Trash</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to move <strong>"{pageToDelete.title}"</strong> ({pageToDelete.path}) to the Recycle Bin?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPageToDelete(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg"
              >
                {deleting ? "Moving..." : "Move to Recycle Bin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
