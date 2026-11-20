"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  Search,
  ExternalLink,
  Edit3,
  Image as ImageIcon,
  Sparkles,
  Check,
  AlertCircle,
  X,
  Upload,
  RefreshCw,
  Globe,
  Sliders,
  CheckCircle2,
  Trash2,
  Plus,
} from "lucide-react";
import { SpaceItem } from "@/types/spaces";
import defaultSpaces from "../../../../server/data/defaultSpaces.json";
import { MediaManagerClient } from "../media/MediaManagerClient";
import { normalizeImageUrl } from "@/utils/imageUrl";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TilesBySpaceManagerClient() {
  const [spaces, setSpaces] = useState<SpaceItem[]>(defaultSpaces as SpaceItem[]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSpace, setEditingSpace] = useState<SpaceItem | null>(null);
  const [isNewSpace, setIsNewSpace] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "preview">("general");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});

  // Delete protection modal state
  const [deleteTarget, setDeleteTarget] = useState<SpaceItem | null>(null);
  const [deleteDiagnostics, setDeleteDiagnostics] = useState<{ productCount: number } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch live spaces and product counts
  const loadData = async () => {
    setLoading(true);
    try {
      const [spacesRes, productsRes] = await Promise.all([
        fetch(`/api/v1/spaces?_t=${Date.now()}`),
        fetch(`/api/v1/products?_t=${Date.now()}`),
      ]);

      if (spacesRes.ok) {
        const sData = await spacesRes.json();
        if (sData.spaces && Array.isArray(sData.spaces) && sData.spaces.length > 0) {
          const normalized = sData.spaces.map((sp: SpaceItem) => ({
            ...sp,
            image: normalizeImageUrl(sp.image),
            ogImage: normalizeImageUrl(sp.ogImage || sp.image),
          }));
          setSpaces(normalized);
        }
      }

      if (productsRes.ok) {
        const pData = await productsRes.json();
        const allProducts = Array.isArray(pData.products) ? pData.products : (Array.isArray(pData) ? pData : []);

        const counts: Record<string, number> = {};
        for (const sp of spaces) {
          const targetBase = sp.name.toLowerCase().replace(/\s+tiles$/, "");
          counts[sp.slug] = allProducts.filter((p: any) => {
            const pSpace = (p.tilesBySpace || p.tiles_by_space || p.spaceArea || "").toLowerCase().trim();
            const pBase = pSpace.replace(/\s+tiles$/, "");
            return !p.is_trashed && (pSpace === sp.name.toLowerCase() || pBase === targetBase);
          }).length;
        }
        setProductCounts(counts);
      }
    } catch (e) {
      console.warn("Failed to load spaces in admin:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered spaces by search query
  const filteredSpaces = useMemo(() => {
    if (!searchQuery.trim()) return spaces;
    const q = searchQuery.toLowerCase().trim();
    return spaces.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }, [spaces, searchQuery]);

  // Open Add Space Modal
  const handleOpenAdd = () => {
    setIsNewSpace(true);
    setEditingSpace({
      id: "",
      name: "",
      slug: "",
      spaceArea: "",
      pageTitle: "",
      description: "",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      mediaId: "",
      status: "published",
      order: spaces.length + 1,
      seoTitle: "",
      metaDescription: "",
      focusKeyword: "",
      secondaryKeywords: "",
      canonicalUrl: "",
      robotsIndex: true,
      robotsFollow: true,
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      schemaType: "CollectionPage",
      schemaData: "",
      seoScore: 85,
    });
    setActiveTab("general");
  };

  // Open Edit Modal
  const handleOpenEdit = (space: SpaceItem) => {
    setIsNewSpace(false);
    setEditingSpace({
      ...space,
      image: normalizeImageUrl(space.image),
      ogImage: normalizeImageUrl(space.ogImage || space.image),
    });
    setActiveTab("general");
  };

  // Handle Name Change
  const handleNameChange = (name: string) => {
    if (!editingSpace) return;
    const updated = { ...editingSpace, name };
    if (isNewSpace) {
      let slugBase = name.trim();
      if (!slugBase.toLowerCase().endsWith("tiles") && !slugBase.toLowerCase().includes("tiles")) {
        slugBase = `${slugBase} Tiles`;
      }
      updated.slug = slugify(slugBase);
      updated.spaceArea = name;
      updated.canonicalUrl = `https://timexceramic.com/${updated.slug}`;
      updated.seoTitle = `${name} - Premium Architectural Tiles | Timex Ceramic`;
    }
    setEditingSpace(updated);
  };

  // Handle Image File Upload
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingSpace) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", `${editingSpace.name} Space Visual`);
    formData.append("category", "spaces");

    try {
      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image file");
      }

      const data = await res.json();
      const uploadedUrl = data.url || (data.media && data.media.url);

      if (uploadedUrl) {
        const cleanUrl = normalizeImageUrl(uploadedUrl);
        setEditingSpace({
          ...editingSpace,
          image: cleanUrl,
          mediaId: data.media?.id || "",
          ogImage: cleanUrl,
        });
        setNotification({
          type: "success",
          message: "Image uploaded successfully. Save changes to persist.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to upload image file.",
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Save Space
  const handleSaveSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpace || !editingSpace.name.trim()) return;

    setSaving(true);
    try {
      const isCreating = isNewSpace;
      const url = isCreating ? "/api/v1/spaces" : `/api/v1/spaces/${editingSpace.slug}`;
      const method = isCreating ? "POST" : "PUT";

      const normalizedPayload = {
        ...editingSpace,
        image: normalizeImageUrl(editingSpace.image),
        ogImage: normalizeImageUrl(editingSpace.ogImage || editingSpace.image),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save changes to space");
      }

      setNotification({
        type: "success",
        message: isCreating
          ? `Successfully created new space "${editingSpace.name}".`
          : `Successfully saved changes for "${editingSpace.name}".`,
      });
      setEditingSpace(null);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("timex-taxonomy-updated"));
      }
      await loadData();
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to update space.",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Delete Request
  const handleRequestDelete = (space: SpaceItem) => {
    const count = productCounts[space.slug] || space.productCount || 0;
    setDeleteDiagnostics({ productCount: count });
    setDeleteTarget(space);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/spaces/${deleteTarget.slug}?force=true`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({
          type: "success",
          message: data.message || `Space '${deleteTarget.name}' deleted successfully.`,
        });
        setDeleteTarget(null);
        setDeleteDiagnostics(null);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("timex-taxonomy-updated"));
        }
        await loadData();
      } else {
        setNotification({
          type: "error",
          message: data.error || "Failed to delete space.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "An unexpected error occurred.",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Toggle Space Status
  const handleToggleStatus = async (space: SpaceItem) => {
    const nextStatus = space.status === "draft" ? "published" : "draft";
    try {
      const res = await fetch(`/api/v1/spaces/${space.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setSpaces((prev) =>
          prev.map((s) => (s.slug === space.slug ? { ...s, status: nextStatus } : s))
        );
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("timex-taxonomy-updated"));
        }
        setNotification({
          type: "success",
          message: `Space status changed to ${nextStatus}.`,
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (e) {
      setNotification({
        type: "error",
        message: "Failed to update space status.",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 bg-[#c5a880]/15 border border-[#c5a880]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Spaces</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide">
            Tiles by Space Management
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
            Manage high-resolution visuals, canonical URLs, display order, and SEO engine metadata for architectural spaces.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-[#c5a880] hover:bg-[#b0936d] text-black text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#c5a880]/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Space</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-3 border ${
            notification.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/40 border-red-500/30 text-red-300"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-xs font-medium">{notification.message}</span>
        </div>
      )}

      {/* Search & Overview Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search spaces by name or slug..."
            className="w-full bg-[#0d1424] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
          />
        </div>
        <div className="text-xs text-gray-400">
          Showing <span className="text-white font-bold">{filteredSpaces.length}</span> of {spaces.length} spaces
        </div>
      </div>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSpaces.map((space) => {
          const directUrl = `/${space.slug}`;
          const count = productCounts[space.slug] || space.productCount || 0;
          return (
            <div
              key={space.slug}
              className="bg-[#0e1628] border border-white/10 rounded-2xl overflow-hidden hover:border-[#c5a880]/50 transition-all duration-300 group flex flex-col justify-between shadow-lg"
            >
              {/* Space Image & Overlay */}
              <div className="relative aspect-[16/10] bg-black/40 overflow-hidden">
                <Image
                  src={normalizeImageUrl(space.image) || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"}
                  alt={space.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] via-transparent to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-semibold text-white">
                  {count} product{count === 1 ? "" : "s"} assigned
                </div>

                <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                  <Link
                    href={directUrl}
                    target="_blank"
                    className="p-1.5 bg-black/75 hover:bg-[#c5a880] text-white hover:text-black rounded-lg backdrop-blur-md transition-colors"
                    title="View public page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Space Info */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-bold text-white group-hover:text-[#c5a880] transition-colors truncate">
                      {space.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(space)}
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border cursor-pointer ${
                        space.status === "draft"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      {space.status === "draft" ? "Draft" : "Published"}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-gray-400 break-all">
                    {directUrl}
                  </p>
                  <p className="text-xs text-gray-400 font-light line-clamp-2 leading-relaxed pt-1">
                    {space.description}
                  </p>
                </div>

                {/* Actions & Status */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-medium">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>SEO Ready</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(space)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#c5a880] hover:text-black text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRequestDelete(space)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Space"
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

      {/* EDIT / CREATE MODAL */}
      {editingSpace && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0a0f1d]">
              <div>
                <span className="text-[10px] font-bold text-[#c5a880] uppercase tracking-wider block">
                  Space Configuration & SEO
                </span>
                <h2 className="font-serif text-xl font-bold text-white mt-0.5">
                  {isNewSpace ? "Add New Architectural Space" : `Edit: ${editingSpace.name}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingSpace(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-white/10 px-6 bg-[#0d1424] gap-6">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "general"
                    ? "border-[#c5a880] text-[#c5a880]"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                General & Media
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "seo"
                    ? "border-[#c5a880] text-[#c5a880]"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                SEO Engine Metadata
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "preview"
                    ? "border-[#c5a880] text-[#c5a880]"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                Google Search Preview
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveSpace} className="flex-grow overflow-y-auto p-6 space-y-6">
              {activeTab === "general" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Space Name *
                      </label>
                      <input
                        type="text"
                        value={editingSpace.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Rooftop Lounge Tiles"
                        className="w-full bg-[#070b14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        URL Slug (Direct Route) *
                      </label>
                      <input
                        type="text"
                        value={editingSpace.slug}
                        onChange={(e) =>
                          setEditingSpace({
                            ...editingSpace,
                            slug: slugify(e.target.value),
                            canonicalUrl: `https://timexceramic.com/${slugify(e.target.value)}`,
                          })
                        }
                        disabled={!isNewSpace}
                        placeholder="rooftop-lounge-tiles"
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-mono ${
                          !isNewSpace
                            ? "bg-white/5 border-white/5 text-gray-400 cursor-not-allowed"
                            : "bg-[#070b14] border-white/10 text-white focus:border-[#c5a880]"
                        }`}
                        required
                      />
                      <span className="text-[10px] text-gray-500 mt-1 block">
                        Direct public URL: https://timexceramic.com/{editingSpace.slug}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Publish Status
                      </label>
                      <select
                        value={editingSpace.status || "published"}
                        onChange={(e: any) =>
                          setEditingSpace({ ...editingSpace, status: e.target.value })
                        }
                        className="w-full bg-[#070b14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={editingSpace.order || 1}
                        onChange={(e) =>
                          setEditingSpace({ ...editingSpace, order: Number(e.target.value) })
                        }
                        className="w-full bg-[#070b14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Space Description (Hero Subtitle)
                    </label>
                    <textarea
                      rows={3}
                      value={editingSpace.description}
                      onChange={(e) =>
                        setEditingSpace({ ...editingSpace, description: e.target.value })
                      }
                      className="w-full bg-[#070b14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      required
                    />
                  </div>

                  {/* Primary Space Image */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-gray-300">
                        Primary Space Image (Hero Banner Background)
                      </label>
                      <span className="text-[10px] text-gray-400">
                        Powers full-width hero on /{editingSpace.slug}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 bg-[#070b14] border border-white/10 rounded-2xl">
                      <div className="relative w-44 h-28 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 group">
                        {editingSpace.image ? (
                          <Image
                            src={normalizeImageUrl(editingSpace.image)}
                            alt="Space Visual Preview"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                            <ImageIcon className="w-8 h-8 mb-1" />
                            <span className="text-[10px]">No image selected</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <label className="text-[11px] text-gray-400 block mb-1">
                            Direct Image URL
                          </label>
                          <input
                            type="text"
                            value={editingSpace.image}
                            onChange={(e) => {
                              const val = e.target.value;
                              const normalized = (val.includes("localhost") || val.includes("127.0.0.1") || val.includes("trycloudflare.com"))
                                ? normalizeImageUrl(val)
                                : val;
                              setEditingSpace({
                                ...editingSpace,
                                image: normalized,
                                ogImage: normalized,
                              });
                            }}
                            onBlur={(e) => {
                              const normalized = normalizeImageUrl(e.target.value);
                              setEditingSpace({
                                ...editingSpace,
                                image: normalized,
                                ogImage: normalized,
                              });
                            }}
                            placeholder="/uploads/... or https://..."
                            className="w-full bg-[#0d1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setIsMediaPickerOpen(true)}
                            className="px-3.5 py-2 bg-[#c5a880]/15 hover:bg-[#c5a880]/25 text-[#c5a880] text-xs font-semibold rounded-lg border border-[#c5a880]/30 transition-colors cursor-pointer flex items-center space-x-1.5"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Select From Media Library</span>
                          </button>

                          <label className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-lg border border-white/10 transition-colors cursor-pointer flex items-center space-x-1.5">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingImage ? "Uploading..." : "Upload New File"}</span>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileUpload}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={editingSpace.seoTitle || ""}
                        onChange={(e) =>
                          setEditingSpace({ ...editingSpace, seoTitle: e.target.value })
                        }
                        placeholder={`${editingSpace.name} - Luxury Tiles | Timex Ceramic`}
                        className="w-full bg-[#070b14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Focus Keyword
                      </label>
                      <input
                        type="text"
                        value={editingSpace.focusKeyword || ""}
                        onChange={(e) =>
                          setEditingSpace({ ...editingSpace, focusKeyword: e.target.value })
                        }
                        placeholder={editingSpace.name.toLowerCase()}
                        className="w-full bg-[#070b14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={editingSpace.metaDescription || ""}
                      onChange={(e) =>
                        setEditingSpace({
                          ...editingSpace,
                          metaDescription: e.target.value,
                        })
                      }
                      placeholder="High-converting search engine description (150-160 chars)..."
                      className="w-full bg-[#070b14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      value={editingSpace.canonicalUrl || ""}
                      onChange={(e) =>
                        setEditingSpace({
                          ...editingSpace,
                          canonicalUrl: e.target.value,
                        })
                      }
                      placeholder={`https://timexceramic.com/${editingSpace.slug}`}
                      className="w-full bg-[#070b14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>
              )}

              {activeTab === "preview" && (
                <div className="space-y-6">
                  <div className="bg-[#1f293d] p-5 rounded-2xl border border-white/10 space-y-2 max-w-xl">
                    <div className="text-[11px] text-gray-400 flex items-center space-x-2">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      <span>https://timexceramic.com &gt; {editingSpace.slug}</span>
                    </div>
                    <h3 className="text-base text-blue-400 font-semibold hover:underline cursor-pointer">
                      {editingSpace.seoTitle || `${editingSpace.name} | Luxury Ceramic & Porcelain Tiles | Timex Ceramic`}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {editingSpace.metaDescription ||
                        editingSpace.description ||
                        `Explore curated ${editingSpace.name} with Italian precision, offering high stain resistance and architectural durability.`}
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 space-y-1">
                    <div className="font-semibold flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Search Engine Optimization Ready</span>
                    </div>
                    <p className="text-gray-400">
                      This space has a dedicated canonical route at <code>/{editingSpace.slug}</code>, dynamic schema markup for Google rich snippets, and server-side metadata generation.
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingSpace(null)}
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
                      <span>{isNewSpace ? "Create Space" : "Save Changes"}</span>
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
                Select Space Visual from Media Library
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
                if (editingSpace) {
                  const normalized = normalizeImageUrl(media.url);
                  setEditingSpace({
                    ...editingSpace,
                    image: normalized,
                    mediaId: media.id || "",
                    ogImage: normalized,
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
                  Delete Space: {deleteTarget.name}
                </h3>
                <p className="text-xs text-gray-400">Protection check and safety warning</p>
              </div>
            </div>

            {deleteDiagnostics && deleteDiagnostics.productCount > 0 ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Space is currently assigned to products:</span>
                </p>
                <p className="text-gray-300">
                  <strong>{deleteDiagnostics.productCount} product(s)</strong> are assigned to <em>{deleteTarget.name}</em>.
                </p>
                <p className="text-[11px] text-gray-400 pt-1 border-t border-amber-500/20">
                  <strong>Safe Deletion Guarantee:</strong> Products will <em>never</em> be deleted. Only this space listing and route will be removed.
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-300 leading-relaxed">
                Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This will remove its canonical route at <code>/{deleteTarget.slug}</code>.
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
