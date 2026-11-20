"use client";

import React, { useState, useMemo } from "react";
import {
  GitMerge,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Box,
  Image as ImageIcon,
  ImageOff,
  X,
  Check,
  Camera,
} from "lucide-react";
import { SizeColorProductMapping, ProductItem } from "@/types/admin";
import { getAdminThumbnailUrl } from "@/utils/adminThumbnails";
import { MediaManagerClient } from "./media/MediaManagerClient";

interface CombinationProductMappingManagerProps {
  availableSizes: string[];
  availableColors: string[];
  mappings: SizeColorProductMapping[];
  onChange: (mappings: SizeColorProductMapping[]) => void;
  currentProduct?: Partial<ProductItem>;
}

export function CombinationProductMappingManager({
  availableSizes = [],
  availableColors = [],
  mappings = [],
  onChange,
  currentProduct,
}: CombinationProductMappingManagerProps) {
  // New mapping input states
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Photo Picker Modal state
  // targetType "new": picking photo for the new combination form
  // targetType "row": picking photo for an existing saved mapping at rowIndex
  const [photoPickerTarget, setPhotoPickerTarget] = useState<{
    targetType: "new" | "row";
    rowIndex?: number;
    size?: string;
    color?: string;
    currentImage?: string;
  } | null>(null);

  // Full Media Library picker modal state
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);

  // Track failed image URLs to fall back gracefully to placeholder
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (url: string) => {
    if (!url) return;
    setFailedImages((prev) => ({ ...prev, [url]: true }));
  };

  const showFeedback = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 4500);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Helper to extract clean filename from an image path
  const getImageFilename = (url?: string): string => {
    if (!url) return "";
    try {
      const clean = url.split("?")[0];
      return clean.split("/").pop() || url;
    } catch {
      return url;
    }
  };

  // Existing gallery images of the current parent product
  const productGalleryImages = useMemo(() => {
    if (!currentProduct?.images || !Array.isArray(currentProduct.images)) return [];
    return currentProduct.images.filter((img) => typeof img === "string" && img.trim().length > 0);
  }, [currentProduct?.images]);

  // Apply selected image from either gallery or media library
  const handleApplySelectedImage = (imageUrl: string) => {
    if (!photoPickerTarget) return;

    if (photoPickerTarget.targetType === "new") {
      setSelectedImage(imageUrl);
      showFeedback(`Selected photo: ${getImageFilename(imageUrl)}`);
    } else if (photoPickerTarget.targetType === "row" && photoPickerTarget.rowIndex !== undefined) {
      const idx = photoPickerTarget.rowIndex;
      const next = [...mappings];
      if (next[idx]) {
        next[idx] = {
          ...next[idx],
          image: imageUrl,
          assignedProductImage: imageUrl,
        };
        onChange(next);
        showFeedback(
          `Updated photo for ${next[idx].size} + ${next[idx].color} → ${getImageFilename(imageUrl)}`
        );
      }
    }

    setPhotoPickerTarget(null);
    setMediaLibraryOpen(false);
  };

  // Add a new mapping
  const handleAddMapping = () => {
    setErrorMessage(null);
    if (!selectedSize.trim()) {
      showFeedback("Please select a Size for the combination.", true);
      return;
    }
    if (!selectedColor.trim()) {
      showFeedback("Please select a Colour for the combination.", true);
      return;
    }
    if (!selectedImage.trim()) {
      showFeedback("Please select a Product Photo for this combination.", true);
      return;
    }

    const normSize = selectedSize.trim();
    const normColor = selectedColor.trim();

    // Prevent duplicate mapping for the same (size, color)
    const exists = mappings.some(
      (m) =>
        m.size.replace(/\s+/g, "").toLowerCase() === normSize.replace(/\s+/g, "").toLowerCase() &&
        m.color.trim().toLowerCase() === normColor.toLowerCase()
    );

    if (exists) {
      showFeedback(
        `A mapping for Size "${normSize}" + Colour "${normColor}" already exists. Change its photo in the table below or remove it first.`,
        true
      );
      return;
    }

    const newMapping: SizeColorProductMapping = {
      productId: currentProduct?.id || "",
      size: normSize,
      color: normColor,
      image: selectedImage.trim(),
      assignedProductImage: selectedImage.trim(),
    };

    const next = [...mappings, newMapping];
    onChange(next);
    showFeedback(`Mapping saved: ${normSize} + ${normColor} with selected photo`);

    // Reset inputs
    setSelectedSize("");
    setSelectedColor("");
    setSelectedImage("");
  };

  // Remove photo from existing mapping
  const handleClearRowImage = (index: number) => {
    const next = [...mappings];
    if (next[index]) {
      next[index] = {
        ...next[index],
        image: "",
        assignedProductImage: "",
      };
      onChange(next);
      showFeedback(`Photo removed from combination ${next[index].size} + ${next[index].color}`);
    }
  };

  // Remove an entire mapping row
  const handleRemoveMapping = (index: number) => {
    const next = mappings.filter((_, idx) => idx !== index);
    onChange(next);
  };

  // Auto-generate all pairwise combinations (availableSizes × availableColors)
  const handleAutoGenerate = () => {
    if (availableSizes.length === 0 || availableColors.length === 0) {
      showFeedback("Please configure at least one Size and one Colour above before generating combinations.", true);
      return;
    }

    let addedCount = 0;
    const next = [...mappings];

    availableSizes.forEach((size) => {
      availableColors.forEach((color) => {
        const normSize = size.trim();
        const normColor = color.trim();
        const exists = next.some(
          (m) =>
            m.size.replace(/\s+/g, "").toLowerCase() === normSize.replace(/\s+/g, "").toLowerCase() &&
            m.color.trim().toLowerCase() === normColor.toLowerCase()
        );
        if (!exists) {
          next.push({
            productId: currentProduct?.id || "",
            size: normSize,
            color: normColor,
            image: "",
            assignedProductImage: "",
          });
          addedCount++;
        }
      });
    });

    if (addedCount > 0) {
      onChange(next);
      showFeedback(`Generated ${addedCount} new combination(s). Click "Select Photo" on each row to assign an image.`);
    } else {
      showFeedback("All possible Size + Colour combinations are already configured.");
    }
  };

  // Clear all mappings
  const handleClearAll = () => {
    if (mappings.length === 0) return;
    if (window.confirm("Are you sure you want to remove all combination photo mappings?")) {
      onChange([]);
      showFeedback("All combination mappings cleared.");
    }
  };

  return (
    <div className="bg-[#0f172a]/70 border border-white/10 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-[#c5a880]" />
            <h4 className="text-sm font-bold text-white tracking-wide">
              Size + Colour Combination Product Mapping
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c5a880]/15 text-[#c5a880] font-semibold border border-[#c5a880]/30">
              {mappings.length} Configured
            </span>
          </div>
          <p className="text-[11px] text-gray-400 max-w-2xl leading-relaxed">
            Assign the exact product photo to display whenever a visitor selects a combination of{" "}
            <strong className="text-gray-200">Available Size</strong> and{" "}
            <strong className="text-gray-200">Available Colour</strong> on this product page.
          </p>
        </div>

        {/* Quick Helper Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={handleAutoGenerate}
            disabled={availableSizes.length === 0 || availableColors.length === 0}
            className="px-3 py-1.5 bg-[#c5a880]/10 hover:bg-[#c5a880] text-[#c5a880] hover:text-black text-xs font-semibold rounded-xl border border-[#c5a880]/30 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Automatically populate all possible combinations of sizes and colours"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Generate Combinations</span>
          </button>

          {mappings.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl border border-red-500/20 transition-all cursor-pointer"
              title="Clear all configured mappings"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Existing Mappings List */}
      <div className="space-y-2">
        {mappings.length === 0 ? (
          <div className="text-center py-6 px-4 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
            <Box className="w-8 h-8 text-gray-500 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-gray-400 font-medium">No combination photo mappings configured yet.</p>
            <p className="text-[11px] text-gray-500 mt-1 max-w-md mx-auto">
              Add a mapping below or click &quot;Auto-Generate Combinations&quot; to assign photos to your sizes and colours.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-xl bg-[#0c1220]/60">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-gray-400 font-semibold text-[11px]">
                  <th className="py-2.5 px-3 w-16 text-center">Photo</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Colour</th>
                  <th className="py-2.5 px-3">Assigned Image Details</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mappings.map((mapping, idx) => {
                  const isSizeValid = availableSizes.some(
                    (s) => s.replace(/\s+/g, "").toLowerCase() === mapping.size.replace(/\s+/g, "").toLowerCase()
                  );
                  const isColorValid = availableColors.some(
                    (c) => c.trim().toLowerCase() === mapping.color.trim().toLowerCase()
                  );
                  const imgUrl = (mapping.image || mapping.assignedProductImage || "").trim();
                  const thumbUrl = imgUrl ? getAdminThumbnailUrl(imgUrl, 140) : "";
                  const isImgFailed = !!failedImages[thumbUrl];
                  const filename = getImageFilename(imgUrl);

                  return (
                    <tr
                      key={`${mapping.size}_${mapping.color}_${idx}`}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Photo Thumbnail */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center">
                          {imgUrl && !isImgFailed ? (
                            <button
                              type="button"
                              onClick={() =>
                                setPhotoPickerTarget({
                                  targetType: "row",
                                  rowIndex: idx,
                                  size: mapping.size,
                                  color: mapping.color,
                                  currentImage: imgUrl,
                                })
                              }
                              className="w-14 h-14 rounded-lg overflow-hidden bg-black/40 border border-white/15 hover:border-[#c5a880] relative shrink-0 shadow-sm flex items-center justify-center group/thumb cursor-pointer transition-all"
                              title="Click to change photo"
                            >
                              <img
                                src={thumbUrl}
                                alt={`${mapping.size} ${mapping.color}`}
                                loading="lazy"
                                decoding="async"
                                onError={() => handleImageError(thumbUrl)}
                                className="w-full h-full object-cover transition-transform group-hover/thumb:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                <Camera className="w-4 h-4 text-white" />
                              </div>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setPhotoPickerTarget({
                                  targetType: "row",
                                  rowIndex: idx,
                                  size: mapping.size,
                                  color: mapping.color,
                                  currentImage: "",
                                })
                              }
                              className="w-14 h-14 rounded-lg border border-dashed border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 flex flex-col items-center justify-center cursor-pointer transition-all"
                              title="Click to select a photo for this combination"
                            >
                              <ImageIcon className="w-5 h-5 opacity-80" />
                              <span className="text-[9px] font-bold mt-0.5">Select Photo</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Size */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs">
                            {mapping.size}
                          </span>
                          {!isSizeValid && (
                            <span
                              className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20"
                              title="This size is not in current Available Sizes"
                            >
                              Unlisted
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Colour */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-200 font-medium">{mapping.color}</span>
                          {!isColorValid && (
                            <span
                              className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20"
                              title="This colour is not in current Available Colours"
                            >
                              Unlisted
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Image Details & Photo Selector */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          {imgUrl ? (
                            <>
                              <div className="space-y-0.5 min-w-0 max-w-xs">
                                <span className="text-xs text-white font-medium truncate block font-mono">
                                  {filename}
                                </span>
                                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  <span>Photo linked to combination</span>
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setPhotoPickerTarget({
                                    targetType: "row",
                                    rowIndex: idx,
                                    size: mapping.size,
                                    color: mapping.color,
                                    currentImage: imgUrl,
                                  })
                                }
                                className="px-2.5 py-1 bg-white/5 hover:bg-[#c5a880] hover:text-black text-gray-300 text-xs font-semibold rounded-lg border border-white/10 transition-colors cursor-pointer shrink-0"
                              >
                                Change Photo
                              </button>

                              <button
                                type="button"
                                onClick={() => handleClearRowImage(idx)}
                                className="p-1 text-gray-400 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                title="Unassign this photo"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-amber-400 font-medium">
                                ⚠️ No photo assigned yet
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setPhotoPickerTarget({
                                    targetType: "row",
                                    rowIndex: idx,
                                    size: mapping.size,
                                    color: mapping.color,
                                    currentImage: "",
                                  })
                                }
                                className="px-2.5 py-1 bg-[#c5a880] hover:bg-[#b0936d] text-black text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                              >
                                <Camera className="w-3 h-3" />
                                <span>Select Photo</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Remove Button */}
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveMapping(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          title="Remove this combination mapping"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Combination Form */}
      <div className="pt-3 border-t border-white/10 space-y-3">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
          Add New Combination Mapping
        </label>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          {/* Size Select */}
          <div className="sm:col-span-3 space-y-1">
            <span className="text-[10px] text-gray-400 font-medium block">1. Select Size</span>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880] cursor-pointer"
            >
              <option value="">-- Choose Size --</option>
              {availableSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Colour Select */}
          <div className="sm:col-span-3 space-y-1">
            <span className="text-[10px] text-gray-400 font-medium block">2. Select Colour</span>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880] cursor-pointer"
            >
              <option value="">-- Choose Colour --</option>
              {availableColors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Select Product Photo Button & Preview */}
          <div className="sm:col-span-4 space-y-1">
            <span className="text-[10px] text-gray-400 font-medium block">3. Select Product Photo</span>
            <div className="flex items-center gap-2">
              {selectedImage ? (
                <div className="flex items-center gap-2 w-full p-1.5 bg-[#111827] border border-white/15 rounded-xl">
                  {/* Thumbnail Preview */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/50 border border-white/15 shrink-0 relative flex items-center justify-center">
                    <img
                      src={getAdminThumbnailUrl(selectedImage, 120)}
                      alt="Selected"
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(getAdminThumbnailUrl(selectedImage, 120))}
                    />
                  </div>

                  {/* Name and Change button */}
                  <div className="min-w-0 flex-1">
                    <span className="text-xs text-white truncate block font-mono">
                      {getImageFilename(selectedImage)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPhotoPickerTarget({
                          targetType: "new",
                          size: selectedSize,
                          color: selectedColor,
                          currentImage: selectedImage,
                        })
                      }
                      className="text-[11px] text-[#c5a880] hover:underline cursor-pointer block text-left"
                    >
                      Change Photo
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedImage("")}
                    className="p-1 text-gray-400 hover:text-white rounded-lg cursor-pointer"
                    title="Remove selected photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setPhotoPickerTarget({
                      targetType: "new",
                      size: selectedSize,
                      color: selectedColor,
                      currentImage: "",
                    })
                  }
                  className="w-full bg-[#111827] hover:bg-white/5 border border-white/15 hover:border-[#c5a880] rounded-xl px-3 py-2 text-xs text-gray-200 hover:text-[#c5a880] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4 text-[#c5a880]" />
                  <span>Choose Product Photo</span>
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleAddMapping}
              className="w-full bg-[#c5a880] hover:bg-[#b09166] text-black font-extrabold text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#c5a880]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {availableSizes.length === 0 || availableColors.length === 0 ? (
          <p className="text-[11px] text-amber-400/90 pt-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Note: Configure at least one Size and Colour in the sections above to add mappings.</span>
          </p>
        ) : null}
      </div>

      {/* PHOTO SELECTION MODAL */}
      {photoPickerTarget && (
        <div className="fixed inset-0 z-[115] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-white/15 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-[#c5a880] uppercase tracking-wider block">
                  Select Combination Photo
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  {photoPickerTarget.size || photoPickerTarget.color
                    ? `Assign Photo: ${photoPickerTarget.size || "Any Size"} + ${photoPickerTarget.color || "Any Colour"}`
                    : "Select Product Photo"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPhotoPickerTarget(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Images Grid */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">
                Choose from Product Gallery ({productGalleryImages.length} images)
              </label>

              {productGalleryImages.length === 0 ? (
                <div className="p-4 bg-[#070b14] rounded-xl border border-white/5 text-center text-xs text-gray-400">
                  <ImageOff className="w-6 h-6 text-gray-500 mx-auto mb-1.5 opacity-50" />
                  <p>No photos added to this product yet.</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Click &quot;Browse Full Media Library&quot; below to choose any photo from your uploaded media.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-h-56 overflow-y-auto p-2.5 bg-[#070b14] rounded-xl border border-white/5">
                  {productGalleryImages.map((imgUrl, i) => {
                    const isSelected = photoPickerTarget.currentImage === imgUrl;
                    const thumb = getAdminThumbnailUrl(imgUrl, 160);

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleApplySelectedImage(imgUrl)}
                        className={`relative aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer group ${
                          isSelected
                            ? "border-[#c5a880] ring-2 ring-[#c5a880] shadow-md shadow-[#c5a880]/30 scale-[1.02]"
                            : "border-white/10 hover:border-[#c5a880] hover:scale-105"
                        }`}
                        title={getImageFilename(imgUrl)}
                      >
                        <img
                          src={thumb}
                          alt={`Gallery ${i + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (e.currentTarget.src !== imgUrl) {
                              e.currentTarget.src = imgUrl;
                            }
                          }}
                        />
                        <div
                          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <Check
                            className={`w-5 h-5 ${
                              isSelected ? "text-[#c5a880] stroke-[3]" : "text-white"
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with Media Library button */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMediaLibraryOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#c5a880] hover:bg-[#b0936d] text-black text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Browse Full Media Library</span>
              </button>

              <button
                type="button"
                onClick={() => setPhotoPickerTarget(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL MEDIA LIBRARY PICKER MODAL */}
      {mediaLibraryOpen && (
        <div className="fixed inset-0 z-[125] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-white/15 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#c5a880]" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Choose Photo from Media Library
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMediaLibraryOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <MediaManagerClient
                isPickerMode
                onSelectMedia={(media) => {
                  if (media && media.url) {
                    handleApplySelectedImage(media.url);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
