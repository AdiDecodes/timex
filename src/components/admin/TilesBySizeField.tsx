"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Ruler, Search, Check, Plus, X, Pencil, Trash2, RotateCcw } from "lucide-react";
import { isSpecUnspecified } from "@/utils/productSpecs";

export const DEFAULT_TILE_SIZE_OPTIONS = [
  "Large Format Tiles",
  "Medium Format Tiles",
  "Small Format Tiles",
];

interface TilesBySizeFieldProps {
  value?: string; // Comma-separated sizes, e.g. "Large Format Tiles, Medium Format Tiles"
  sizes?: string[]; // Array of selected sizes
  customSize?: string; // Custom size value
  onChange: (payload: {
    tilesBySize: string;
    tiles_by_size: string;
    tilesBySizeList: string[];
    customTilesBySize: string;
    custom_tiles_by_size: string;
  }) => void;
}

export function TilesBySizeField({
  value = "",
  sizes = [],
  customSize = "",
  onChange,
}: TilesBySizeFieldProps) {
  const [sizeOptions, setSizeOptions] = useState<string[]>(DEFAULT_TILE_SIZE_OPTIONS);
  const [customSizesList, setCustomSizesList] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Add custom size states
  const [showAddCustom, setShowAddCustom] = useState<boolean>(false);
  const [newCustomInput, setNewCustomInput] = useState<string>("");
  const [addError, setAddError] = useState<string>("");

  // Inline edit state
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [editError, setEditError] = useState<string>("");

  // Direct Custom Mode toggle (matches TilesByShape pattern)
  const [isDirectCustom, setIsDirectCustom] = useState<boolean>(false);
  const [directCustomVal, setDirectCustomVal] = useState<string>("");

  // Fetch manageable size options from API
  const fetchSizeOptions = async () => {
    try {
      const res = await fetch(`/api/v1/taxonomies/tiles-by-size?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.sizes)) {
          const defaults = Array.isArray(data.defaultSizes) ? data.defaultSizes : DEFAULT_TILE_SIZE_OPTIONS;
          const customs = Array.isArray(data.customSizes) ? data.customSizes : [];
          setSizeOptions([...new Set([...defaults, ...customs])]);
          setCustomSizesList(customs);
        }
      }
    } catch (_) {
      // Fallback to default options
    }
  };

  useEffect(() => {
    fetchSizeOptions();
  }, []);

  // Synchronize incoming props to internal state
  useEffect(() => {
    const rawVal = (value || "").trim();
    const rawCustom = (customSize || "").trim();

    if (isSpecUnspecified(rawVal) && !rawCustom && (!sizes || sizes.length === 0)) {
      setSelectedSizes([]);
      setIsDirectCustom(false);
      setDirectCustomVal("");
      return;
    }

    let initialList: string[] = [];
    if (Array.isArray(sizes) && sizes.length > 0) {
      initialList = sizes.map((s) => String(s).trim()).filter(Boolean);
    } else if (rawVal) {
      initialList = rawVal
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const matchedStandards: string[] = [];
    let detectedCustom = rawCustom;

    initialList.forEach((item) => {
      const found = sizeOptions.find((opt) => opt.toLowerCase() === item.toLowerCase());
      if (found) {
        if (!matchedStandards.includes(found)) {
          matchedStandards.push(found);
        }
      } else if (!detectedCustom) {
        detectedCustom = item;
      }
    });

    setSelectedSizes(matchedStandards);

    if (detectedCustom && !isSpecUnspecified(detectedCustom)) {
      setIsDirectCustom(true);
      setDirectCustomVal(detectedCustom);
    } else {
      setIsDirectCustom(false);
      setDirectCustomVal("");
    }
  }, [value, sizes, customSize, sizeOptions]);

  // Propagate state changes to parent form
  const notifyChange = (newSelected: string[], directCustomActive: boolean, directVal: string) => {
    const finalList: string[] = [...newSelected];
    const trimmedDirect = directVal.trim();

    if (directCustomActive && trimmedDirect && !finalList.includes(trimmedDirect)) {
      finalList.push(trimmedDirect);
    }

    const finalString = finalList.join(", ");

    onChange({
      tilesBySize: finalString,
      tiles_by_size: finalString,
      tilesBySizeList: finalList,
      customTilesBySize: directCustomActive ? trimmedDirect : "",
      custom_tiles_by_size: directCustomActive ? trimmedDirect : "",
    });
  };

  // Toggle selection
  const handleToggleSize = (sizeName: string) => {
    let updated: string[];
    if (selectedSizes.includes(sizeName)) {
      updated = selectedSizes.filter((s) => s !== sizeName);
    } else {
      updated = [...selectedSizes, sizeName];
    }
    setSelectedSizes(updated);
    notifyChange(updated, isDirectCustom, directCustomVal);
  };

  // Clear all / Not specified
  const handleClearAll = () => {
    setSelectedSizes([]);
    setIsDirectCustom(false);
    setDirectCustomVal("");
    notifyChange([], false, "");
  };

  // Toggle Direct Custom mode
  const handleToggleDirectCustom = () => {
    const next = !isDirectCustom;
    setIsDirectCustom(next);
    if (!next) {
      setDirectCustomVal("");
      notifyChange(selectedSizes, false, "");
    } else {
      notifyChange(selectedSizes, true, directCustomVal);
    }
  };

  const handleDirectCustomChange = (val: string) => {
    setDirectCustomVal(val);
    notifyChange(selectedSizes, isDirectCustom, val);
  };

  // Add a new custom size to the taxonomy
  const handleAddCustomSize = async () => {
    setAddError("");
    const trimmed = newCustomInput.trim();
    if (!trimmed) {
      setAddError("Please enter a custom size name.");
      return;
    }

    // Check duplicate
    if (sizeOptions.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setAddError("This size classification already exists in the list.");
      return;
    }

    try {
      const res = await fetch("/api/v1/taxonomies/tiles-by-size", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAddError(data.error || "Failed to add custom size.");
        return;
      }

      // Update options and select newly created custom size
      setSizeOptions((prev) => [...prev, trimmed]);
      setCustomSizesList((prev) => [...prev, trimmed]);
      const nextSelected = [...selectedSizes, trimmed];
      setSelectedSizes(nextSelected);
      notifyChange(nextSelected, isDirectCustom, directCustomVal);

      setNewCustomInput("");
      setShowAddCustom(false);
      setAddError("");
    } catch (err: any) {
      setAddError(err.message || "Failed to add custom size.");
    }
  };

  // Start editing a custom size
  const handleStartEdit = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    setEditingItem(size);
    setEditingText(size);
    setEditError("");
  };

  // Save edited custom size
  const handleSaveEdit = async (e: React.MouseEvent, oldSize: string) => {
    e.stopPropagation();
    setEditError("");
    const trimmed = editingText.trim();
    if (!trimmed) {
      setEditError("Size name cannot be empty.");
      return;
    }

    if (trimmed.toLowerCase() === oldSize.toLowerCase()) {
      setEditingItem(null);
      return;
    }

    // Duplicate check
    if (sizeOptions.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setEditError("A size with this name already exists.");
      return;
    }

    try {
      const res = await fetch("/api/v1/taxonomies/tiles-by-size", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldSize, newSize: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setEditError(data.error || "Failed to update size.");
        return;
      }

      // Update options
      setSizeOptions((prev) => prev.map((s) => (s === oldSize ? trimmed : s)));
      setCustomSizesList((prev) => prev.map((s) => (s === oldSize ? trimmed : s)));

      // Update selected
      const nextSelected = selectedSizes.map((s) => (s === oldSize ? trimmed : s));
      setSelectedSizes(nextSelected);
      notifyChange(nextSelected, isDirectCustom, directCustomVal);

      setEditingItem(null);
    } catch (err: any) {
      setEditError(err.message || "Failed to update size.");
    }
  };

  // Delete a custom size
  const handleDeleteCustomSize = async (e: React.MouseEvent, sizeToDelete: string) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove "${sizeToDelete}" from the custom sizes list?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/taxonomies/tiles-by-size?size=${encodeURIComponent(sizeToDelete)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSizeOptions((prev) => prev.filter((s) => s !== sizeToDelete));
        setCustomSizesList((prev) => prev.filter((s) => s !== sizeToDelete));

        const nextSelected = selectedSizes.filter((s) => s !== sizeToDelete);
        setSelectedSizes(nextSelected);
        notifyChange(nextSelected, isDirectCustom, directCustomVal);
      } else {
        alert(data.error || "Could not delete custom size.");
      }
    } catch (err) {
      alert("Failed to delete custom size.");
    }
  };

  // Filtered options based on search query
  const filteredOptions = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return sizeOptions;
    return sizeOptions.filter((opt) => opt.toLowerCase().includes(q));
  }, [sizeOptions, searchTerm]);

  const isNotSpecified = selectedSizes.length === 0 && (!isDirectCustom || !directCustomVal.trim());
  const isDefaultOption = (opt: string) => DEFAULT_TILE_SIZE_OPTIONS.includes(opt);

  return (
    <div className="space-y-3 p-4 bg-[#111827] border border-white/10 rounded-2xl">
      {/* 1. Header with Label, Selection Status, and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-[#c5a880]" />
          <label className="text-xs font-bold text-gray-200">Tiles By Size</label>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-white/5 text-gray-400">
            {isNotSpecified
              ? "Not Specified"
              : isDirectCustom && selectedSizes.length === 0
              ? `Custom: ${directCustomVal || "..."}`
              : `${selectedSizes.length} Selected${isDirectCustom && directCustomVal ? " + Custom" : ""}`}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleClearAll}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              isNotSpecified
                ? "bg-white/15 text-white border border-white/20 shadow-xs"
                : "bg-black/30 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            Not Specified (Hide)
          </button>

          <button
            type="button"
            onClick={handleToggleDirectCustom}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              isDirectCustom
                ? "bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/50 font-bold"
                : "bg-black/30 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* 2. Selected Sizes Removable Chips/Tags */}
      {selectedSizes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-[#090d16] border border-white/5 rounded-xl">
          {selectedSizes.map((size) => (
            <span
              key={size}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/30 transition-all hover:bg-[#c5a880]/25"
            >
              <span>{size}</span>
              <button
                type="button"
                onClick={() => handleToggleSize(size)}
                className="text-gray-400 hover:text-white rounded-full p-0.5 hover:bg-black/30 transition-colors cursor-pointer"
                title={`Remove ${size}`}
                aria-label={`Remove ${size}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 3. Searchable Multi-Select Dropdown Container */}
      <div className="space-y-2 bg-[#0d131f] border border-white/10 rounded-xl p-3">
        {/* Search Input Filter */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tile sizes (e.g. Large Format, Medium, Small)..."
            className="w-full bg-[#111827] border border-white/10 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Scrollable Checkbox List */}
        <div className="max-h-52 overflow-y-auto divide-y divide-white/5 rounded-lg border border-white/5 bg-[#090d16] p-1">
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-xs text-gray-400">
              No matching tile sizes found.
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = selectedSizes.includes(opt);
              const isDefault = isDefaultOption(opt);
              const isEditingThis = editingItem === opt;

              if (isEditingThis) {
                return (
                  <div key={opt} className="p-2 space-y-1.5 bg-[#111827] rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="flex-1 bg-[#090d16] border border-[#c5a880] rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={(e) => handleSaveEdit(e, opt)}
                        className="p-1.5 bg-[#c5a880] text-black hover:bg-[#d4be9e] rounded text-xs font-bold cursor-pointer"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(null);
                          setEditError("");
                        }}
                        className="p-1.5 text-gray-400 hover:text-white rounded text-xs cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {editError && <p className="text-[10px] text-red-400">{editError}</p>}
                  </div>
                );
              }

              return (
                <div
                  key={opt}
                  onClick={() => handleToggleSize(opt)}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors select-none ${
                    isSelected ? "bg-[#c5a880]/10 text-white" : "hover:bg-white/5 text-gray-300"
                  }`}
                >
                  <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by outer container click
                      className="w-4 h-4 rounded border-gray-600 text-[#c5a880] focus:ring-[#c5a880] bg-[#111827] cursor-pointer shrink-0"
                    />
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className={`text-xs truncate ${isSelected ? "text-[#c5a880] font-bold" : "text-gray-200"}`}>
                        {opt}
                      </span>
                      {isDefault && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 text-gray-400 bg-white/5 rounded font-mono shrink-0">
                          Standard
                        </span>
                      )}
                      {!isDefault && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 text-[#c5a880] bg-[#c5a880]/10 border border-[#c5a880]/20 rounded font-mono shrink-0">
                          Custom
                        </span>
                      )}
                    </div>
                  </label>

                  {/* Actions for Custom options: Edit and Delete */}
                  {!isDefault && (
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={(e) => handleStartEdit(e, opt)}
                        className="p-1 text-gray-400 hover:text-[#c5a880] rounded hover:bg-white/5 transition-colors cursor-pointer"
                        title={`Edit "${opt}"`}
                        aria-label={`Edit ${opt}`}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCustomSize(e, opt)}
                        className="p-1 text-gray-400 hover:text-red-400 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        title={`Delete "${opt}"`}
                        aria-label={`Delete ${opt}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 4. Add Custom Option Form */}
        <div className="pt-2 border-t border-white/5">
          {!showAddCustom ? (
            <button
              type="button"
              onClick={() => {
                setShowAddCustom(true);
                setAddError("");
              }}
              className="text-[11px] text-[#c5a880] hover:text-[#d4be9e] font-medium flex items-center gap-1.5 transition-colors cursor-pointer py-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Tile Size to List</span>
            </button>
          ) : (
            <div className="space-y-2 p-2.5 bg-[#090d16] border border-[#c5a880]/30 rounded-xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#c5a880]">New Custom Tile Size</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCustom(false);
                    setNewCustomInput("");
                    setAddError("");
                  }}
                  className="text-gray-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCustomInput}
                  onChange={(e) => {
                    setNewCustomInput(e.target.value);
                    if (addError) setAddError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomSize();
                    }
                  }}
                  placeholder="e.g. Extra Large Slabs, Mosaic Miniature, Sub-Compact"
                  className="bg-[#111827] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] flex-1"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCustomSize}
                  className="px-3.5 py-1.5 rounded-lg bg-[#c5a880] hover:bg-[#b0936b] text-black font-bold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Add Size
                </button>
              </div>

              {addError && <p className="text-[10px] text-red-400">{addError}</p>}
            </div>
          )}
        </div>
      </div>

      {/* 5. Direct Custom Value Input Drawer */}
      {isDirectCustom && (
        <div className="pt-3 border-t border-white/10 space-y-1.5 animate-in fade-in duration-200">
          <label className="block text-[11px] font-semibold text-[#c5a880]">
            Direct Custom Size Specification
          </label>
          <input
            type="text"
            value={directCustomVal}
            onChange={(e) => handleDirectCustomChange(e.target.value)}
            placeholder="e.g. Custom Architectural Slabs, Bespoke Dimension"
            className="w-full bg-[#0c1220] border border-[#c5a880]/60 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#c5a880] placeholder-gray-500"
          />
          <p className="text-[10px] text-gray-400">
            Specify a custom tile size classification. This value displays directly on the public product page under &ldquo;Tiles By Size&rdquo;.
          </p>
        </div>
      )}

      {/* Helper text */}
      <p className="text-[10px] text-gray-500 pt-0.5">
        Select one or more size classifications (e.g. Large Format, Medium, Small) or add custom size tags. If &ldquo;Not Specified&rdquo; is chosen, Tiles By Size will remain hidden from the public product page.
      </p>
    </div>
  );
}

