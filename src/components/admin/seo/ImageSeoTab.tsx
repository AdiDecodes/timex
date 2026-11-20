"use client";

import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Save,
  Search,
  Filter,
  Check,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export function ImageSeoTab() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMissing, setFilterMissing] = useState(false);
  const [search, setSearch] = useState("");
  const [editingAlt, setEditingAlt] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/seo/images?_t=" + Date.now());
      const data = await res.json();
      if (data.success && Array.isArray(data.images)) {
        setImages(data.images);
        const map: Record<string, string> = {};
        data.images.forEach((img: any) => {
          map[img.id] = img.alt_text || "";
        });
        setEditingAlt(map);
      }
    } catch (err) {
      console.error("Failed to load images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSaveAlt = async (img: any) => {
    setSavingId(img.id);
    try {
      const newAlt = editingAlt[img.id] || "";
      const res = await fetch("/api/v1/seo/images/alt", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_type: img.source_type,
          source_id: img.source_id,
          image_url: img.url,
          alt_text: newAlt,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedId(img.id);
        setTimeout(() => setSavedId(null), 2500);
      }
    } catch (err) {
      console.error("Save ALT text error:", err);
    } finally {
      setSavingId(null);
    }
  };

  const filteredImages = images.filter((img) => {
    const matchesFilter = filterMissing ? !img.has_alt : true;
    const matchesSearch =
      !search ||
      img.filename?.toLowerCase().includes(search.toLowerCase()) ||
      img.source?.toLowerCase().includes(search.toLowerCase()) ||
      editingAlt[img.id]?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Image SEO & ALT Manager</h2>
          <p className="text-xs text-gray-400">
            Audit image filenames, detect missing descriptive ALT attributes, and edit image accessibility tags inline.
          </p>
        </div>

        <button
          onClick={fetchImages}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white cursor-pointer w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-scan Images
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#111827] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setFilterMissing(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              !filterMissing ? "bg-[#c5a880] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            All Images ({images.length})
          </button>
          <button
            onClick={() => setFilterMissing(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterMissing ? "bg-[#c5a880] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Missing / Weak ALT ({images.filter((i) => !i.has_alt).length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by filename or surface..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#090d16] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
          />
        </div>
      </div>

      {/* Images List */}
      {loading ? (
        <div className="p-16 text-center text-gray-400 font-mono text-xs animate-pulse">
          Scanning image assets...
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-[#111827] border border-white/10 rounded-2xl">
          No images match your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredImages.map((img) => {
            const isSaving = savingId === img.id;
            const isSaved = savedId === img.id;

            return (
              <div
                key={img.id}
                className="p-4 bg-[#111827] border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-4 hover:border-white/20 transition-all"
              >
                {/* Image Thumbnail */}
                <div className="w-full sm:w-28 h-28 bg-[#090d16] rounded-xl overflow-hidden shrink-0 border border-white/5 relative group">
                  <img
                    src={img.url}
                    alt={editingAlt[img.id] || img.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 font-mono text-[9px] px-1 rounded bg-black/80 text-white font-bold">
                    {img.format}
                  </span>
                </div>

                {/* Details & Inline Editor */}
                <div className="flex-1 space-y-2.5 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-semibold text-white truncate">{img.filename}</p>
                      <p className="text-[10px] text-gray-400 truncate">{img.source}</p>
                    </div>

                    <div className="shrink-0">
                      {editingAlt[img.id]?.trim().length > 3 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ALT Set
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Missing ALT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inline ALT Editor */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">ALT Text</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingAlt[img.id] || ""}
                        onChange={(e) => setEditingAlt({ ...editingAlt, [img.id]: e.target.value })}
                        placeholder="Descriptive image ALT text..."
                        className="flex-1 bg-[#090d16] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
                      />
                      <button
                        onClick={() => handleSaveAlt(img)}
                        disabled={isSaving}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                          isSaved
                            ? "bg-emerald-500 text-white"
                            : "bg-[#c5a880] text-black hover:bg-[#d8bc93]"
                        }`}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                        {isSaving ? "Saving" : isSaved ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
