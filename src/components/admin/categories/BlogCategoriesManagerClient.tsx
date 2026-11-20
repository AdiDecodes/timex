"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
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
} from "lucide-react";
import { MediaManagerClient } from "../media/MediaManagerClient";

export interface BlogCategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  mediaId?: string;
  status: "published" | "draft";
  order: number;
  seoTitle?: string;
  metaDescription?: string;
  blogCount?: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BlogCategoriesManagerClient() {
  const [categories, setCategories] = useState<BlogCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [currentCat, setCurrentCat] = useState<BlogCategoryData | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "media" | "seo">("general");

  // Media picker modal
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<BlogCategoryData | null>(null);
  const [deleteDiagnostics, setDeleteDiagnostics] = useState<{ assignedBlogs: number } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Saving state & notifications
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchBlogCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/taxonomies/blog-categories?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.warn("Failed to load blog categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogCategories();
  }, []);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (statusFilter !== "all" && c.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [categories, searchQuery, statusFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsNewCategory(true);
    setCurrentCat({
      id: "",
      name: "",
      slug: "",
      description: "",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      mediaId: "",
      status: "published",
      order: categories.length + 1,
      seoTitle: "",
      metaDescription: "",
      blogCount: 0,
    });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cat: BlogCategoryData) => {
    setIsNewCategory(false);
    setCurrentCat({ ...cat });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  // Name change handler
  const handleNameChange = (name: string) => {
    if (!currentCat) return;
    const updated = { ...currentCat, name };
    if (isNewCategory) {
      updated.slug = slugify(name);
      updated.seoTitle = `${name} | Timex Ceramic Blog`;
    }
    setCurrentCat(updated);
  };

  // Upload image handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentCat) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", `${currentCat.name || "Blog Category"} Visual`);
    formData.append("category", "blogs");

    try {
      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const imageUrl = data.url || (data.media && data.media.url);
        if (imageUrl) {
          setCurrentCat({
            ...currentCat,
            image: imageUrl,
            mediaId: data.media?.id || "",
          });
          showNotification("success", "Category image uploaded successfully!");
        }
      } else {
        showNotification("error", "Failed to upload image.");
      }
    } catch (err) {
      showNotification("error", "Error uploading image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Save Blog Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCat || !currentCat.name.trim()) {
      showNotification("error", "Blog category name is required.");
      return;
    }

    setSaving(true);
    try {
      const slug = slugify(currentCat.slug || currentCat.name);
      const payload = {
        ...currentCat,
        slug,
        seoTitle: currentCat.seoTitle || `${currentCat.name} | Timex Ceramic Blog`,
        metaDescription: currentCat.metaDescription || currentCat.description,
      };

      const url = isNewCategory
        ? "/api/v1/taxonomies/blog-categories"
        : `/api/v1/taxonomies/blog-categories/${currentCat.id || currentCat.slug}`;
      const method = isNewCategory ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification("success", isNewCategory ? "Blog category created successfully!" : "Blog category updated successfully!");
        setIsModalOpen(false);
        setCurrentCat(null);
        await fetchBlogCategories();
      } else {
        showNotification("error", data.error || "Failed to save blog category.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  // Request Delete with protection check
  const handleRequestDelete = (cat: BlogCategoryData) => {
    setDeleteDiagnostics({ assignedBlogs: cat.blogCount || 0 });
    setDeleteTarget(cat);
  };

  // Execute Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/taxonomies/blog-categories/${deleteTarget.id || deleteTarget.slug}?force=true`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification("success", data.message || `Blog category '${deleteTarget.name}' deleted successfully.`);
        setDeleteTarget(null);
        setDeleteDiagnostics(null);
        await fetchBlogCategories();
      } else {
        showNotification("error", data.error || "Failed to delete blog category.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "An unexpected error occurred.");
    } finally {
      setDeleting(false);
    }
  };

  // Quick toggle status
  const handleToggleStatus = async (cat: BlogCategoryData) => {
    const nextStatus = cat.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/v1/taxonomies/blog-categories/${cat.id || cat.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, status: nextStatus } : c))
        );
        showNotification("success", `Blog category status changed to ${nextStatus}.`);
      }
    } catch (e) {
      showNotification("error", "Failed to update blog category status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold backdrop-blur-md transition-all ${
            notification.type === "success"
              ? "bg-emerald-500/90 text-black shadow-emerald-500/20"
              : "bg-red-500/90 text-white shadow-red-500/20"
          }`}
        >
          {notification.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1424] border border-white/10 rounded-2xl p-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-[#c5a880]/15 flex items-center justify-center text-[#c5a880]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-white tracking-wide">Blog Categories</h1>
              <p className="text-xs text-gray-400">
                Manage editorial article topics, display order, imagery, and SEO metadata.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBlogCategories}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer border border-white/5"
            title="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#c5a880]" : ""}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c5a880] hover:bg-[#b0936d] text-black text-xs font-bold transition-all shadow-lg shadow-[#c5a880]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Blog Category</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0d1424] border border-white/5 rounded-xl p-3.5 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold">Total Categories</p>
            <p className="text-lg font-bold text-white">{categories.length}</p>
          </div>
        </div>
        <div className="bg-[#0d1424] border border-white/5 rounded-xl p-3.5 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold">Published</p>
            <p className="text-lg font-bold text-white">{categories.filter((c) => c.status === "published").length}</p>
          </div>
        </div>
        <div className="bg-[#0d1424] border border-white/5 rounded-xl p-3.5 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold">Drafts</p>
            <p className="text-lg font-bold text-white">{categories.filter((c) => c.status === "draft").length}</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#0d1424] border border-white/5 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search blog categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#070b14] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e: any) => setStatusFilter(e.target.value)}
          className="bg-[#070b14] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#c5a880] w-full sm:w-auto"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Blog Categories Table */}
      <div className="bg-[#0d1424] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111827] text-gray-400 border-b border-white/5 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Blog Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Assigned Articles</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#c5a880]" />
                    <span>Loading blog categories...</span>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                    <span>No blog categories found.</span>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr
                    key={cat.id || cat.slug}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Order */}
                    <td className="py-3.5 px-4 font-mono text-gray-400 w-16">
                      #{cat.order || "-"}
                    </td>

                    {/* Image & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0">
                          {cat.image ? (
                            <Image
                              src={cat.image}
                              alt={cat.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white group-hover:text-[#c5a880] transition-colors truncate">
                            {cat.name}
                          </p>
                          <p className="text-[10px] font-mono text-gray-400">
                            slug: {cat.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 max-w-xs truncate text-gray-400">
                      {cat.description || "—"}
                    </td>

                    {/* Assigned Blog Count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/5 text-gray-300">
                        <FileText className="w-3 h-3 text-[#c5a880]" />
                        <span>{cat.blogCount || 0}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(cat)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          cat.status === "published"
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30"
                        }`}
                      >
                        {cat.status === "published" ? "Published" : "Draft"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 text-[#c5a880] hover:text-white rounded-lg hover:bg-[#c5a880]/10 transition-colors cursor-pointer"
                          title="Edit Blog Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(cat)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete Blog Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && currentCat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">
                    {isNewCategory ? "Create Blog Category" : `Edit Blog Category: ${currentCat.name}`}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Configure editorial topic name, display order, imagery, and SEO metadata.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 border-b border-white/10 flex space-x-6 bg-[#090d18]">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === "general"
                    ? "border-[#c5a880] text-[#c5a880]"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                General Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === "media"
                    ? "border-[#c5a880] text-[#c5a880]"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                Featured Visual
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === "seo"
                    ? "border-[#c5a880] text-[#c5a880]"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                SEO Metadata
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-200 mb-1">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={currentCat.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. SUSTAINABILITY"
                        className="w-full bg-[#070b14] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-200 mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={currentCat.slug}
                        onChange={(e) =>
                          setCurrentCat({ ...currentCat, slug: slugify(e.target.value) })
                        }
                        placeholder="sustainability"
                        className="w-full bg-[#070b14] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-200 mb-1">
                        Publish Status
                      </label>
                      <select
                        value={currentCat.status}
                        onChange={(e: any) =>
                          setCurrentCat({ ...currentCat, status: e.target.value })
                        }
                        className="w-full bg-[#070b14] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-200 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={currentCat.order || 1}
                        onChange={(e) =>
                          setCurrentCat({ ...currentCat, order: Number(e.target.value) })
                        }
                        className="w-full bg-[#070b14] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 mb-1">
                      Editorial Description
                    </label>
                    <textarea
                      rows={3}
                      value={currentCat.description}
                      onChange={(e) =>
                        setCurrentCat({ ...currentCat, description: e.target.value })
                      }
                      placeholder="Articles discussing sustainable porcelain manufacturing and eco-friendly surfaces..."
                      className="w-full bg-[#070b14] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-200 mb-1">
                      Featured Visual Preview
                    </label>
                    <div className="relative h-44 w-full rounded-xl overflow-hidden bg-black/60 border border-white/10">
                      {currentCat.image ? (
                        <Image
                          src={currentCat.image}
                          alt="Category visual"
                          fill
                          className="object-cover"
                          sizes="100vw"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                          <ImageIcon className="w-8 h-8 mb-2" />
                          <span className="text-xs">No visual selected</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-200">
                      Visual Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={currentCat.image}
                        onChange={(e) =>
                          setCurrentCat({ ...currentCat, image: e.target.value })
                        }
                        placeholder="https://..."
                        className="flex-1 bg-[#070b14] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      />
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="px-4 py-2 bg-[#c5a880]/15 hover:bg-[#c5a880]/25 text-[#c5a880] text-xs font-bold rounded-xl border border-[#c5a880]/30 transition-colors cursor-pointer flex items-center space-x-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Select From Media Library</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-[#070b14] border border-white/10 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Upload New Image From Computer</p>
                      <p className="text-[10px] text-gray-400">
                        Supports WebP, PNG, JPG (recommended 1200x800).
                      </p>
                    </div>
                    <label className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-semibold rounded-xl border border-white/10 transition-colors cursor-pointer flex items-center space-x-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-200 mb-1">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={currentCat.seoTitle || ""}
                      onChange={(e) =>
                        setCurrentCat({ ...currentCat, seoTitle: e.target.value })
                      }
                      placeholder={`${currentCat.name || "Category"} | Timex Ceramic Blog`}
                      className="w-full bg-[#070b14] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 mb-1">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={currentCat.metaDescription || ""}
                      onChange={(e) =>
                        setCurrentCat({ ...currentCat, metaDescription: e.target.value })
                      }
                      placeholder="Articles exploring architectural design trends, ceramic innovations, and expert styling advice..."
                      className="w-full bg-[#070b14] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#c5a880] hover:bg-[#b0936d] text-black text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isNewCategory ? "Create Blog Category" : "Save Changes"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0f1d] border border-white/15 rounded-2xl max-w-5xl w-full h-[85vh] flex flex-col p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <h3 className="font-serif text-lg font-bold text-white">
                Select Blog Category Visual from Media Library
              </h3>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <MediaManagerClient
              isPickerMode
              onSelectMedia={(media) => {
                if (currentCat) {
                  setCurrentCat({
                    ...currentCat,
                    image: media.url,
                    mediaId: media.id,
                  });
                }
                setIsMediaPickerOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal with Protection Check */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121929] border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Delete Blog Category: {deleteTarget.name}
                </h3>
                <p className="text-xs text-gray-400">Protection check and safety warning</p>
              </div>
            </div>

            {deleteDiagnostics && deleteDiagnostics.assignedBlogs > 0 ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Category is currently in use:</span>
                </p>
                <p className="text-gray-300">
                  <strong>{deleteDiagnostics.assignedBlogs} article(s)</strong> are currently categorized under <em>{deleteTarget.name}</em>.
                </p>
                <p className="text-[11px] text-gray-400 pt-1 border-t border-amber-500/20">
                  <strong>Safe Deletion:</strong> Your blog posts will <em>never</em> be deleted. Only this category entry will be removed from future selection.
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-300 leading-relaxed">
                Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
              </p>
            )}

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteDiagnostics(null);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Proceed with Safe Deletion</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
