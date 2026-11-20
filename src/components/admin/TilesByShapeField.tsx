"use client";

import React, { useState, useEffect } from "react";
import { Shapes, Check, Plus, X } from "lucide-react";
import { isSpecUnspecified } from "@/utils/productSpecs";

export const DEFAULT_SHAPE_OPTIONS = [
  "Rectangle",
  "Square",
  "Circle",
  "Hexagon",
  "Octagon",
  "Triangle",
  "Oval",
  "Other",
];

interface TilesByShapeFieldProps {
  value?: string; // Comma-separated shapes, e.g. "Rectangle, Hexagon" or "Irregular"
  shapes?: string[]; // Array of selected shapes
  customShape?: string; // Custom shape value
  onChange: (payload: {
    shape: string;
    shapes: string[];
    tilesByShape: string;
    tiles_by_shape: string;
    customShape: string;
    custom_shape: string;
  }) => void;
}

export function TilesByShapeField({
  value = "",
  shapes = [],
  customShape = "",
  onChange,
}: TilesByShapeFieldProps) {
  const [shapeOptions, setShapeOptions] = useState<string[]>(DEFAULT_SHAPE_OPTIONS);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string>("");
  const [newShapeInput, setNewShapeInput] = useState<string>("");
  const [showAddShape, setShowAddShape] = useState<boolean>(false);

  // Fetch manageable shape options from API
  useEffect(() => {
    fetch("/api/v1/taxonomies/shapes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.shapes) && data.shapes.length > 0) {
          setShapeOptions((prev) => [...new Set([...prev, ...data.shapes])]);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_SHAPE_OPTIONS
      });
  }, []);

  // Synchronize incoming props to internal state
  useEffect(() => {
    const rawVal = (value || "").trim();
    const rawCustom = (customShape || "").trim();

    if (isSpecUnspecified(rawVal) && !rawCustom && (!shapes || shapes.length === 0)) {
      setSelectedShapes([]);
      setIsCustom(false);
      setCustomValue("");
      return;
    }

    // Determine initial selected items from shapes array or comma-separated value
    let initialList: string[] = [];
    if (Array.isArray(shapes) && shapes.length > 0) {
      initialList = shapes.map((s) => String(s).trim()).filter(Boolean);
    } else if (rawVal) {
      initialList = rawVal
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const matchedStandards: string[] = [];
    let detectedCustom = rawCustom;

    initialList.forEach((item) => {
      // Check if item matches standard options (case-insensitive)
      const foundStandard = shapeOptions.find(
        (opt) => opt.toLowerCase() === item.toLowerCase()
      );
      if (foundStandard) {
        if (!matchedStandards.includes(foundStandard)) {
          matchedStandards.push(foundStandard);
        }
      } else if (!detectedCustom) {
        detectedCustom = item;
      }
    });

    setSelectedShapes(matchedStandards);

    if (detectedCustom && detectedCustom.toLowerCase() !== "not specified") {
      setIsCustom(true);
      setCustomValue(detectedCustom);
    } else {
      setIsCustom(false);
      setCustomValue("");
    }
  }, [value, shapes, customShape, shapeOptions]);

  // Propagate state changes to parent form
  const notifyChange = (newSelected: string[], customActive: boolean, newCustomVal: string) => {
    const finalShapes: string[] = [...newSelected];
    const trimmedCustom = newCustomVal.trim();

    if (customActive && trimmedCustom && !finalShapes.includes(trimmedCustom)) {
      finalShapes.push(trimmedCustom);
    }

    const finalShapeString = finalShapes.join(", ");

    onChange({
      shape: finalShapeString,
      shapes: finalShapes,
      tilesByShape: finalShapeString,
      tiles_by_shape: finalShapeString,
      customShape: customActive ? trimmedCustom : "",
      custom_shape: customActive ? trimmedCustom : "",
    });
  };

  const handleToggleShape = (shape: string) => {
    let updated: string[];
    if (selectedShapes.includes(shape)) {
      updated = selectedShapes.filter((s) => s !== shape);
    } else {
      updated = [...selectedShapes, shape];
    }
    setSelectedShapes(updated);
    notifyChange(updated, isCustom, customValue);
  };

  const handleSelectNotSpecified = () => {
    setSelectedShapes([]);
    setIsCustom(false);
    setCustomValue("");
    notifyChange([], false, "");
  };

  const handleToggleCustom = () => {
    const nextCustom = !isCustom;
    setIsCustom(nextCustom);
    if (!nextCustom) {
      setCustomValue("");
      notifyChange(selectedShapes, false, "");
    } else {
      notifyChange(selectedShapes, true, customValue);
    }
  };

  const handleCustomInputChange = (val: string) => {
    setCustomValue(val);
    notifyChange(selectedShapes, isCustom, val);
  };

  const handleAddNewShapeOption = async () => {
    const trimmed = newShapeInput.trim();
    if (!trimmed) return;

    if (!shapeOptions.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...shapeOptions, trimmed];
      setShapeOptions(updated);
      setSelectedShapes((prev) => [...prev, trimmed]);
      notifyChange([...selectedShapes, trimmed], isCustom, customValue);

      // Persist to server taxonomy
      try {
        await fetch("/api/v1/taxonomies/shapes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shape: trimmed }),
        });
      } catch (_) {}
    }
    setNewShapeInput("");
    setShowAddShape(false);
  };

  const isNotSpecified = selectedShapes.length === 0 && (!isCustom || !customValue.trim());

  return (
    <div className="space-y-3 p-4 bg-[#111827] border border-white/10 rounded-2xl">
      {/* Header with Title and Mode Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Shapes className="w-4 h-4 text-[#c5a880]" />
          <label className="text-xs font-bold text-gray-200">Tiles by Shape</label>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-white/5 text-gray-400">
            {isNotSpecified
              ? "Not Specified"
              : isCustom && selectedShapes.length === 0
              ? `Custom: ${customValue || "..."}`
              : `${selectedShapes.length} selected${isCustom && customValue ? " + Custom" : ""}`}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSelectNotSpecified}
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
            onClick={handleToggleCustom}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              isCustom
                ? "bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/50 font-bold"
                : "bg-black/30 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Common Tile Shape Checkboxes */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {shapeOptions.map((shape) => {
            const isChecked = selectedShapes.includes(shape);
            return (
              <label
                key={shape}
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleShape(shape);
                }}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all select-none ${
                  isChecked
                    ? "bg-[#c5a880]/15 border-[#c5a880] text-white font-bold ring-1 ring-[#c5a880]/30 shadow-xs"
                    : "bg-[#0c1220] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
                    isChecked
                      ? "bg-[#c5a880] border-[#c5a880] text-black"
                      : "border-white/20 bg-black/40"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="truncate">{shape}</span>
              </label>
            );
          })}
        </div>

        {/* Manageable Shape Expansion */}
        <div className="flex items-center justify-between pt-1">
          {!showAddShape ? (
            <button
              type="button"
              onClick={() => setShowAddShape(true)}
              className="text-[11px] text-[#c5a880] hover:text-[#d4be9e] font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add another shape option to list</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full max-w-sm animate-in fade-in duration-150">
              <input
                type="text"
                value={newShapeInput}
                onChange={(e) => setNewShapeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddNewShapeOption();
                  }
                }}
                placeholder="e.g. Rhombus, Chevron, Trapezoid"
                className="bg-[#0c1220] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] flex-1"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddNewShapeOption}
                className="px-3 py-1.5 rounded-xl bg-[#c5a880] hover:bg-[#b0936b] text-black font-bold text-xs transition-colors shrink-0"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewShapeInput("");
                  setShowAddShape(false);
                }}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Shape Input Drawer */}
      {isCustom && (
        <div className="pt-3 border-t border-white/10 space-y-1.5 animate-in fade-in duration-200">
          <label className="block text-[11px] font-semibold text-[#c5a880]">
            Custom Shape
          </label>
          <input
            type="text"
            value={customValue}
            onChange={(e) => handleCustomInputChange(e.target.value)}
            placeholder="e.g. Irregular, Fan / Fish Scale, Trapezoid"
            className="w-full bg-[#0c1220] border border-[#c5a880]/60 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#c5a880] placeholder-gray-500"
          />
          <p className="text-[10px] text-gray-400">
            Enter custom shape specification. This value displays directly on the public product page (e.g. &ldquo;Irregular&rdquo;).
          </p>
        </div>
      )}

      {/* Helper text */}
      <p className="text-[10px] text-gray-500 pt-0.5">
        Select one or more shapes that define this tile. If &ldquo;Not Specified&rdquo; is selected, Tiles by Shape is completely hidden from the public product page.
      </p>
    </div>
  );
}
