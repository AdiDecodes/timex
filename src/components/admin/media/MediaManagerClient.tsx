"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Eye,
  Copy,
  Check,
  RefreshCw,
  FolderOpen,
  Image as ImageIcon,
  FileText,
  FileCode,
  Video,
  Info,
  ExternalLink,
  X,
  AlertCircle,
  LayoutGrid,
  List,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MediaItem, MediaUsageRef } from "@/types/media";
import {
  getMediaList,
  uploadMedia,
  updateMedia,
  softDeleteMedia,
  getMediaStats,
} from "@/services/media";

interface MediaManagerClientProps {
  onSelectMedia?: (media: MediaItem) => void;
  isPickerMode?: boolean;
}

function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function MediaManagerClient({
  onSelectMedia,
  isPickerMode = false,
}: MediaManagerClientProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filters & Sorting
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "size">("newest");

  // Server-side Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(36);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview & Details modal state
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [editingAlt, setEditingAlt] = useState("");
  const [editingCaption, setEditingCaption] = useState("");
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);

  // Delete modal state
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadMedia = async (page = currentPage, limit = pageSize) => {
    setLoading(true);
    try {
      const data = await getMediaList({
        search,
        type: typeFilter,
        sort: sortBy,
        page,
        limit,
      });
      setMediaList(data.media);
      setTotalCount(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadMedia(1, pageSize);
  }, [typeFilter, sortBy, pageSize]);

  // Debounced search with initial mount skip
  const isSearchMountedRef = useRef(false);
  useEffect(() => {
    if (!isSearchMountedRef.current) {
      isSearchMountedRef.current = true;
      return;
    }
    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadMedia(1, pageSize);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    const safe = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(safe);
    loadMedia(safe, pageSize);
  };

  // Copy URL to clipboard
  const handleCopyUrl = (url: string) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    showToast("URL copied to clipboard!");
  };

  // Upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFiles(Array.from(e.target.files));
      setUploadError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadFiles(Array.from(e.dataTransfer.files));
      setUploadError(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return;

    setUploading(true);
    setUploadError(null);
    let successCount = 0;
    const total = uploadFiles.length;
    const CONCURRENCY = Math.min(2, total);
    let nextIdx = 0;
    let completed = 0;
    const failedList: string[] = [];

    const uploadWorker = async () => {
      while (nextIdx < total) {
        const idx = nextIdx++;
        const file = uploadFiles[idx];
        setUploadProgress(`Uploading ${completed + 1} of ${total}: ${file.name}...`);

        let res = await uploadMedia(file);
        if (!res.success) {
          await new Promise((r) => setTimeout(r, 350));
          res = await uploadMedia(file);
        }

        completed++;
        if (res.success) {
          successCount++;
        } else {
          failedList.push(file.name);
        }
      }
    };

    const workers = [];
    for (let w = 0; w < CONCURRENCY; w++) {
      workers.push(uploadWorker());
    }
    await Promise.all(workers);

    if (failedList.length > 0) {
      setUploadError(
        `Failed to upload ${failedList.length} file(s): ${failedList.slice(0, 3).join(", ")}${failedList.length > 3 ? "..." : ""}`
      );
    }

    setUploading(false);
    setUploadProgress("");

    if (successCount > 0) {
      showToast(`Successfully uploaded ${successCount} file(s)!`);
      setUploadFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setUploadModalOpen(false);
      loadMedia();
    }
  };

  // Open Preview & Details
  const handleOpenDetails = (item: MediaItem) => {
    setSelectedMedia(item);
    setEditingAlt(item.altText || "");
    setEditingCaption(item.caption || "");
  };

  // Save Alt / Caption
  const handleSaveMetadata = async () => {
    if (!selectedMedia) return;
    setIsSavingMetadata(true);
    try {
      const res = await updateMedia(selectedMedia.id, {
        altText: editingAlt,
        caption: editingCaption,
      });
      if (res.success && res.media) {
        setSelectedMedia(res.media);
        setMediaList((prev) =>
          prev.map((m) => (m.id === selectedMedia.id ? res.media! : m))
        );
        showToast("Media metadata updated successfully!");
      } else {
        alert(res.error || "Failed to update metadata");
      }
    } catch (err: any) {
      alert(err.message || "Failed to save");
    } finally {
      setIsSavingMetadata(false);
    }
  };

  // Confirm Soft Delete (Move to Recycle Bin)
  const confirmSoftDelete = async () => {
    if (!mediaToDelete) return;
    setDeleting(true);
    try {
      const res = await softDeleteMedia(mediaToDelete.id);
      if (res.success) {
        showToast(`"${mediaToDelete.filename}" moved to Recycle Bin.`);
        setMediaList((prev) => prev.filter((m) => m.id !== mediaToDelete.id));
        if (selectedMedia?.id === mediaToDelete.id) {
          setSelectedMedia(null);
        }
      } else {
        alert(res.error || "Failed to move media to trash.");
      }
    } catch (err: any) {
      alert(`Error deleting media: ${err.message}`);
    } finally {
      setDeleting(false);
      setMediaToDelete(null);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4 text-[#c5a880]" />;
      case "svg":
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      case "video":
        return <Video className="w-4 h-4 text-sky-400" />;
      default:
        return <FileText className="w-4 h-4 text-purple-400" />;
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

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            {isPickerMode ? "Select Media from Library" : "Media Library"}
          </h2>
          <p className="text-xs text-gray-400">
            {isPickerMode
              ? "Choose an image to attach or upload a new asset directly."
              : "Manage tile textures, high-res showroom photographs, vector graphics, and documents."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadMedia()}
            title="Reload library"
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors cursor-pointer border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#c5a880]" : ""}`} />
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#c5a880]/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>UPLOAD MEDIA</span>
          </button>
        </div>
      </div>

      {/* Filters, Search & Controls Bar */}
      <div className="p-3 bg-[#111827] border border-white/10 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name, alt text, or caption..."
            className="w-full pl-10 pr-4 py-2 bg-[#090d16] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
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

        {/* Filter by Type & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* File Type Filter */}
          <div className="flex items-center gap-1 bg-[#090d16] border border-white/10 rounded-xl px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-white text-xs border-none focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111827]">All Files</option>
              <option value="image" className="bg-[#111827]">Images</option>
              <option value="svg" className="bg-[#111827]">SVGs / Vectors</option>
              <option value="video" className="bg-[#111827]">Videos</option>
              <option value="document" className="bg-[#111827]">Documents</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-[#090d16] border border-white/10 rounded-xl px-2.5 py-1 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white text-xs border-none focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-[#111827]">Newest First</option>
              <option value="oldest" className="bg-[#111827]">Oldest First</option>
              <option value="name" className="bg-[#111827]">File Name (A-Z)</option>
              <option value="size" className="bg-[#111827]">Largest Size</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-[#090d16] border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-[#c5a880] text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              title="List / Table View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-[#c5a880] text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-16 text-center text-gray-400 space-y-3 bg-[#111827] border border-white/10 rounded-2xl">
          <div className="w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading media assets...</p>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="p-16 text-center text-gray-400 space-y-4 bg-[#111827] border border-dashed border-white/10 rounded-2xl">
          <FolderOpen className="w-12 h-12 mx-auto text-gray-600" />
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-white">No Media Found</h3>
            <p className="text-xs max-w-sm mx-auto text-gray-500">
              {search || typeFilter !== "all"
                ? "Try adjusting your search criteria or clearing filters."
                : "Your media storage is ready. Upload high-res images to use across products, blogs, and pages."}
            </p>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 bg-[#c5a880] text-black text-xs font-bold rounded-xl cursor-pointer"
          >
            Upload First File
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mediaList.map((item) => {
            const hasUsage = (item.usedByCount || 0) > 0;
            return (
              <div
                key={item.id}
                className="group bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-[#c5a880]/50 transition-all flex flex-col relative"
              >
                {/* Thumbnail Container */}
                <div
                  onClick={() => {
                    if (isPickerMode && onSelectMedia) {
                      onSelectMedia(item);
                    } else {
                      handleOpenDetails(item);
                    }
                  }}
                  className="aspect-square bg-black/40 relative cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  {item.fileType === "image" || item.fileType === "svg" ? (
                    <img
                      src={
                        item.thumbnailUrl ||
                        (item.fileType === "image"
                          ? `/api/v1/media/thumbnail/${encodeURIComponent(item.filename)}?w=300`
                          : item.url)
                      }
                      alt={item.altText || item.filename}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        if (e.currentTarget.src !== item.url) {
                          e.currentTarget.src = item.url;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : item.fileType === "video" ? (
                    <Video className="w-10 h-10 text-sky-400" />
                  ) : (
                    <FileText className="w-10 h-10 text-purple-400" />
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/70 backdrop-blur text-white uppercase border border-white/10">
                      {item.fileType}
                    </span>
                  </div>

                  {hasUsage && (
                    <div className="absolute top-2 right-2">
                      <span
                        title={`Referenced by ${item.usedByCount} item(s)`}
                        className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#c5a880] text-black shadow"
                      >
                        {item.usedByCount} used
                      </span>
                    </div>
                  )}

                  {/* Overlay for Quick Actions */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {isPickerMode ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectMedia) onSelectMedia(item);
                        }}
                        className="px-3 py-1.5 bg-[#c5a880] text-black text-xs font-bold rounded-lg shadow-lg cursor-pointer"
                      >
                        Select Asset
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetails(item);
                          }}
                          title="View Details"
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(item.url);
                          }}
                          title="Copy URL"
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMediaToDelete(item);
                          }}
                          title="Move to Recycle Bin"
                          className="p-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-3 text-[11px] space-y-1">
                  <p
                    className="font-medium text-white truncate cursor-pointer hover:text-[#c5a880] transition-colors"
                    title={item.filename}
                    onClick={() => handleOpenDetails(item)}
                  >
                    {item.filename}
                  </p>
                  <div className="flex items-center justify-between text-gray-400 text-[10px]">
                    <span>{formatBytes(item.size)}</span>
                    <span>{item.dimensions || "—"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090d16] text-gray-400 border-b border-white/10 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">File Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Dimensions</th>
                  <th className="px-4 py-3">File Size</th>
                  <th className="px-4 py-3">Used By</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mediaList.map((item) => {
                  const usedCount = item.usedByCount || 0;
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-3">
                        <div
                          onClick={() => handleOpenDetails(item)}
                          className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0 cursor-pointer flex items-center justify-center"
                        >
                          {item.fileType === "image" || item.fileType === "svg" ? (
                            <img
                              src={
                                item.thumbnailUrl ||
                                (item.fileType === "image"
                                  ? `/api/v1/media/thumbnail/${encodeURIComponent(item.filename)}?w=120`
                                  : item.url)
                              }
                              alt={item.filename}
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                if (e.currentTarget.src !== item.url) {
                                  e.currentTarget.src = item.url;
                                }
                              }}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getFileIcon(item.fileType)
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p
                          onClick={() => handleOpenDetails(item)}
                          className="font-bold text-white text-xs hover:text-[#c5a880] transition-colors cursor-pointer truncate max-w-[200px]"
                        >
                          {item.filename}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate max-w-[200px]">
                          {item.url}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 text-gray-300 border border-white/10">
                          {item.fileType}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-300 font-mono text-[11px]">
                        {item.dimensions || "—"}
                      </td>

                      <td className="px-4 py-3 text-gray-300 font-mono text-[11px]">
                        {formatBytes(item.size)}
                      </td>

                      <td className="px-4 py-3">
                        {usedCount > 0 ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c5a880]">
                              <Layers className="w-3 h-3" />
                              {usedCount} Reference{usedCount > 1 ? "s" : ""}
                            </span>
                            <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                              {item.usedBy?.map((u) => u.name).slice(0, 2).join(", ")}
                              {usedCount > 2 ? "..." : ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-[10px]">Unused</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-gray-400 text-[11px] whitespace-nowrap">
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPickerMode ? (
                            <button
                              onClick={() => onSelectMedia && onSelectMedia(item)}
                              className="px-3 py-1.5 bg-[#c5a880] text-black text-xs font-bold rounded-lg cursor-pointer"
                            >
                              Select
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleOpenDetails(item)}
                                title="View Details"
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleCopyUrl(item.url)}
                                title="Copy URL"
                                className="p-1.5 text-gray-400 hover:text-[#c5a880] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setMediaToDelete(item)}
                                title="Move to Recycle Bin"
                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
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

      {/* Pagination Controls Bar */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#111827] border border-white/10 rounded-2xl text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-white font-semibold">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
              <strong className="text-white font-semibold">{Math.min(currentPage * pageSize, totalCount)}</strong> of{" "}
              <strong className="text-white font-semibold">{totalCount}</strong> assets
            </span>
            <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
              <span className="text-[11px] text-gray-400">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-[#090d16] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#c5a880]"
              >
                <option value={24}>24</option>
                <option value={36}>36</option>
                <option value={48}>48</option>
                <option value={96}>96</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2;
                })
                .map((p, idx, arr) => {
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && p - prevPage > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span className="px-1 text-gray-500">...</span>}
                      <button
                        onClick={() => handlePageChange(p)}
                        disabled={loading}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          p === currentPage
                            ? "bg-[#c5a880] text-black font-bold"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UPLOAD MODAL                                                              */}
      {/* ========================================================================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-[125] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/10 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#c5a880]/15 text-[#c5a880] rounded-xl border border-[#c5a880]/30">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Upload New Media</h3>
                  <p className="text-xs text-gray-400">Supported: JPG, PNG, WEBP, SVG, MP4, PDF (up to 25MB)</p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-[#c5a880]/50 rounded-2xl p-8 text-center bg-[#090d16] hover:bg-white/[0.02] transition-colors cursor-pointer space-y-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,video/*,application/pdf"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#c5a880]">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">
                    {uploadFiles.length > 0
                      ? `${uploadFiles.length} file(s) selected`
                      : "Drag & drop your files here, or click to browse"}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Files will be stored securely in the production media repository.
                  </p>
                </div>
              </div>

              {/* Selected files preview */}
              {uploadFiles.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-[#090d16] rounded-xl border border-white/10 text-xs">
                  {uploadFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between text-gray-300 p-1.5">
                      <span className="truncate max-w-[280px]">{file.name}</span>
                      <span className="font-mono text-gray-500 text-[10px]">{formatBytes(file.size)}</span>
                    </div>
                  ))}
                </div>
              )}

              {uploadProgress && (
                <div className="text-xs text-[#c5a880] flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin" />
                  <span>{uploadProgress}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadFiles.length === 0 || uploading}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : `Upload ${uploadFiles.length > 0 ? uploadFiles.length : ""} Files`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PREVIEW & DETAILS MODAL                                                   */}
      {/* ========================================================================= */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[125] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white bg-black/60 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Media Preview */}
            <div className="md:w-3/5 bg-black/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 relative">
              <div className="max-h-[50vh] md:max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-white/5">
                {selectedMedia.fileType === "image" || selectedMedia.fileType === "svg" ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.altText || selectedMedia.filename}
                    className="max-h-[450px] w-auto max-w-full object-contain"
                  />
                ) : selectedMedia.fileType === "video" ? (
                  <video src={selectedMedia.url} controls className="max-h-[450px] w-full rounded-xl" />
                ) : (
                  <div className="p-12 text-center text-gray-400 space-y-3">
                    <FileText className="w-16 h-16 mx-auto text-[#c5a880]" />
                    <p className="text-xs font-mono">{selectedMedia.filename}</p>
                    <a
                      href={selectedMedia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 rounded-xl text-xs text-white"
                    >
                      <span>Open Document</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Direct Open Link */}
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#c5a880] hover:underline"
                >
                  <span>Open Full Resolution in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right: Metadata & Usage Details */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] text-[#c5a880] font-mono uppercase tracking-widest block font-bold">
                    File Details
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white break-words mt-1">
                    {selectedMedia.filename}
                  </h3>
                </div>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-[#090d16] p-3.5 rounded-2xl border border-white/5">
                  <div>
                    <span className="text-gray-500 text-[10px] block">File Type</span>
                    <span className="font-bold text-gray-200 uppercase font-mono">{selectedMedia.fileType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">File Size</span>
                    <span className="font-bold text-gray-200 font-mono">{formatBytes(selectedMedia.size)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">Dimensions</span>
                    <span className="font-bold text-gray-200 font-mono">{selectedMedia.dimensions || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">Upload Date</span>
                    <span className="font-bold text-gray-200">
                      {new Date(selectedMedia.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Copy URL Box */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">File URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={selectedMedia.url}
                      className="flex-1 bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 font-mono"
                    />
                    <button
                      onClick={() => handleCopyUrl(selectedMedia.url)}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Alt Text and Caption Editing */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                      Alt Text (SEO & Accessibility)
                    </label>
                    <input
                      type="text"
                      value={editingAlt}
                      onChange={(e) => setEditingAlt(e.target.value)}
                      placeholder="e.g. Italian marble glazed vitrified floor tile slab"
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                      Caption / Notes
                    </label>
                    <textarea
                      rows={2}
                      value={editingCaption}
                      onChange={(e) => setEditingCaption(e.target.value)}
                      placeholder="Internal description or visual notes..."
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <button
                    onClick={handleSaveMetadata}
                    disabled={isSavingMetadata}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {isSavingMetadata ? "Saving..." : "Save Alt Text & Caption"}
                  </button>
                </div>

                {/* Used By Breakdown */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#c5a880]" />
                      Used By ({selectedMedia.usedByCount || 0})
                    </span>
                  </div>

                  {(selectedMedia.usedByCount || 0) === 0 ? (
                    <p className="text-[11px] text-gray-500">
                      This file is not currently referenced by any active product, blog post, or page.
                    </p>
                  ) : (
                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                      {selectedMedia.usedBy?.map((ref, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-[#090d16] rounded-xl border border-white/5 text-xs"
                        >
                          <div className="truncate pr-2">
                            <span className="text-[10px] uppercase font-bold text-[#c5a880] mr-1.5">
                              [{ref.type}]
                            </span>
                            <span className="text-white font-medium">{ref.name}</span>
                          </div>
                          {ref.slug && (
                            <Link
                              href={
                                ref.type === "Product"
                                  ? `/product/${ref.slug}`
                                  : ref.type === "Blog"
                                  ? `/blogs/${ref.slug}`
                                  : `/${ref.slug}`
                              }
                              target="_blank"
                              className="text-gray-400 hover:text-white shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const toDel = selectedMedia;
                    setSelectedMedia(null);
                    setMediaToDelete(toDel);
                  }}
                  className="px-3 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Move to Trash</span>
                </button>

                {isPickerMode && onSelectMedia && (
                  <button
                    onClick={() => {
                      onSelectMedia(selectedMedia);
                      setSelectedMedia(null);
                    }}
                    className="px-4 py-2 bg-[#c5a880] text-black text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Select this Asset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SOFT DELETE CONFIRMATION MODAL                                            */}
      {/* ========================================================================= */}
      {mediaToDelete && (
        <div className="fixed inset-0 z-[125] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/10 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-white">Move Media to Trash</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to move <strong>"{mediaToDelete.filename}"</strong> to the Recycle Bin?
            </p>
            {(mediaToDelete.usedByCount || 0) > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs space-y-1">
                <p className="font-bold">⚠️ Warning: Media is currently in use!</p>
                <p className="text-[11px]">
                  This image is referenced by {mediaToDelete.usedByCount} active item(s). Moving it to the Recycle Bin may cause broken images on the website until restored.
                </p>
              </div>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setMediaToDelete(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSoftDelete}
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
