"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  X,
  Upload,
  RefreshCw,
  FileText,
  Sliders,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { MediaManagerClient } from "../media/MediaManagerClient";

export interface CategoryFaqItem {
  id?: string;
  categoryId?: string;
  category_id?: string;
  question: string;
  answer: string;
  displayOrder?: number;
  order?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  banner?: string;
  image?: string;
  parentId?: string | null;
  parentName?: string | null;
  url?: string;
  status?: "published" | "draft" | string;
  order?: number;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  schemaType?: string;
  schemaJson?: string;
  showInNav?: boolean;
  showInExplore?: boolean;
  showInWorldOfTiles?: boolean;
  customCode?: string;
  redirectUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
  productCount?: number;
  isBase?: boolean;
  faqs?: CategoryFaqItem[];
  subcategories?: string[];
  assignedProductIds?: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductCategoriesManagerClient() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Notification feedback
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [currentCat, setCurrentCat] = useState<CategoryData | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "media" | "seo">("general");

  // Media picker modal
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/taxonomies/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      showNotification("error", "Failed to load categories: " + (err.message || "Network error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        (cat.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.slug || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description || "").toLowerCase().includes(searchQuery.toLowerCase());

      const catStatus = cat.status || "published";
      const matchesStatus = statusFilter === "all" || catStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  const handleCreateNew = () => {
    const newCat: CategoryData = {
      id: "",
      name: "",
      slug: "",
      description: "",
      banner: "",
      image: "",
      status: "published",
      order: categories.length + 1,
      seoTitle: "",
      metaDescription: "",
      showInNav: true,
      showInWorldOfTiles: true,
    };
    setCurrentCat(newCat);
    setIsNewCategory(true);
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleEdit = (cat: CategoryData) => {
    setCurrentCat({ ...cat });
    setIsNewCategory(false);
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleDelete = async (cat: CategoryData) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/taxonomies/category/${cat.id || cat.slug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showNotification("success", `Category "${cat.name}" deleted.`);
        fetchCategories();
      } else {
        showNotification("error", data.message || "Failed to delete category");
      }
    } catch (err: any) {
      showNotification("error", "Failed to delete: " + (err.message || "Network error"));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCat || !currentCat.name.trim()) {
      showNotification("error", "Category name is required.");
      return;
    }

    const payload = {
      ...currentCat,
      slug: slugify(currentCat.slug || currentCat.name),
      banner: currentCat.banner || currentCat.image || "",
      image: currentCat.image || currentCat.banner || "",
    };

    try {
      const url = isNewCategory
        ? "/api/v1/taxonomies/category"
        : `/api/v1/taxonomies/category/${payload.id || payload.slug}`;
      const method = isNewCategory ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("success", `Category "${payload.name}" saved successfully.`);
        setIsModalOpen(false);
        fetchCategories();
      } else {
        showNotification("error", data.message || "Failed to save category.");
      }
    } catch (err: any) {
      showNotification("error", "Failed to save: " + (err.message || "Network error"));
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen text-gray-200">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c5a880]/15 flex items-center justify-center border border-[#c5a880]/30 text-[#c5a880]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Product Categories</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage tile collections, banners, descriptions, and SEO for the public catalog.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchCategories}
            disabled={loading}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl border border-white/10 transition-colors cursor-pointer"
            title="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-[#c5a880] hover:bg-[#b0936d] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#c5a880]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
              : "bg-red-500/15 border border-red-500/30 text-red-300"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#0f172a]/70 p-3 rounded-2xl border border-white/10">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name, slug, or description..."
            className="w-full bg-[#111827] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
          />
        </div>

        <div className="sm:col-span-4 flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880] cursor-pointer"
          >
            <option value="all">All Statuses ({categories.length})</option>
            <option value="published">Published</option>
            <option value="draft">Draft / Hidden</option>
          </select>
        </div>
      </div>

      {/* Categories Grid / Table */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#c5a880]" />
          <p className="text-xs">Loading product categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl p-8 bg-white/[0.02] space-y-3">
          <Layers className="w-10 h-10 text-gray-500 mx-auto opacity-50" />
          <p className="text-sm font-semibold text-gray-300">No categories found</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new category to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => {
            const imgUrl = cat.banner || cat.image || "";
            const isDraft = cat.status === "draft";

            return (
              <div
                key={cat.id || cat.slug}
                className="bg-[#0f172a]/60 border border-white/10 hover:border-[#c5a880]/50 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col group"
              >
                {/* Banner Header Image */}
                <div className="h-32 bg-black/40 relative overflow-hidden border-b border-white/10">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gradient-to-br from-white/5 to-white/0">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isDraft
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      {cat.status || "published"}
                    </span>

                    {cat.productCount !== undefined && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-gray-200 border border-white/15 backdrop-blur-sm">
                        {cat.productCount} Tiles
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <Link
                      href={`/product-category/${cat.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-[#c5a880] text-white hover:text-black transition-colors border border-white/20 backdrop-blur-sm block"
                      title="View public category page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#c5a880] transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 font-mono">/product-category/{cat.slug}</span>
                    {cat.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">Order: #{cat.order || 0}</span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(cat)}
                        className="px-2.5 py-1 bg-white/5 hover:bg-[#c5a880] text-gray-300 hover:text-black text-xs font-semibold rounded-lg border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT / CREATE MODAL */}
      {isModalOpen && currentCat && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-white/15 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#c5a880]" />
                <h3 className="text-base font-bold text-white">
                  {isNewCategory ? "Add New Category" : `Edit Category: ${currentCat.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "general"
                    ? "bg-[#c5a880] text-black"
                    : "bg-white/5 text-gray-300 hover:text-white"
                }`}
              >
                General Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "media"
                    ? "bg-[#c5a880] text-black"
                    : "bg-white/5 text-gray-300 hover:text-white"
                }`}
              >
                Banner & Image
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "seo"
                    ? "bg-[#c5a880] text-black"
                    : "bg-white/5 text-gray-300 hover:text-white"
                }`}
              >
                SEO & Metadata
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Category Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={currentCat.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setCurrentCat((prev) =>
                          prev
                            ? {
                                ...prev,
                                name,
                                slug: isNewCategory ? slugify(name) : prev.slug,
                              }
                            : null
                        );
                      }}
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      placeholder="e.g. Brick, Marble, Hexagon"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Category Slug <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={currentCat.slug}
                      onChange={(e) =>
                        setCurrentCat((prev) => (prev ? { ...prev, slug: slugify(e.target.value) } : null))
                      }
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c5a880]"
                      placeholder="e.g. brick"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                      Public URL: /product-category/{currentCat.slug || "slug"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={currentCat.description || ""}
                      onChange={(e) =>
                        setCurrentCat((prev) => (prev ? { ...prev, description: e.target.value } : null))
                      }
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      placeholder="Brief category intro..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">Display Order</label>
                      <input
                        type="number"
                        value={currentCat.order || 0}
                        onChange={(e) =>
                          setCurrentCat((prev) =>
                            prev ? { ...prev, order: parseInt(e.target.value) || 0 } : null
                          )
                        }
                        className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">Status</label>
                      <select
                        value={currentCat.status || "published"}
                        onChange={(e) =>
                          setCurrentCat((prev) => (prev ? { ...prev, status: e.target.value as any } : null))
                        }
                        className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880] cursor-pointer"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Banner Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentCat.banner || currentCat.image || ""}
                        onChange={(e) =>
                          setCurrentCat((prev) =>
                            prev ? { ...prev, banner: e.target.value, image: e.target.value } : null
                          )
                        }
                        placeholder="https://... or /uploads/..."
                        className="flex-1 bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      />
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="px-3 py-2 bg-white/10 hover:bg-[#c5a880] hover:text-black text-gray-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Media</span>
                      </button>
                    </div>
                  </div>

                  {(currentCat.banner || currentCat.image) && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-white/10 bg-black/40 h-44 relative">
                      <img
                        src={currentCat.banner || currentCat.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">SEO Title</label>
                    <input
                      type="text"
                      value={currentCat.seoTitle || ""}
                      onChange={(e) =>
                        setCurrentCat((prev) => (prev ? { ...prev, seoTitle: e.target.value } : null))
                      }
                      placeholder={`${currentCat.name || "Category"} Tiles | Timex Ceramic`}
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Meta Description</label>
                    <textarea
                      rows={3}
                      value={currentCat.metaDescription || ""}
                      onChange={(e) =>
                        setCurrentCat((prev) => (prev ? { ...prev, metaDescription: e.target.value } : null))
                      }
                      placeholder="Search engine snippet description..."
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Focus Keyword</label>
                    <input
                      type="text"
                      value={currentCat.focusKeyword || ""}
                      onChange={(e) =>
                        setCurrentCat((prev) => (prev ? { ...prev, focusKeyword: e.target.value } : null))
                      }
                      placeholder="e.g. brick wall tiles mumbai"
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c5a880] hover:bg-[#b0936d] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-[#c5a880]/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-white/15 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Select Category Banner from Media Library</h3>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <MediaManagerClient
              isPickerMode={true}
              onSelectMedia={(item: any) => {
                if (item?.url && currentCat) {
                  setCurrentCat({ ...currentCat, banner: item.url, image: item.url });
                  setIsMediaPickerOpen(false);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
