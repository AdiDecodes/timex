"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import {
  Calculator,
  Layers,
  Box,
  Ruler,
  Check,
  CheckCircle2,
  AlertCircle,
  Mail,
  RefreshCw,
  Search,
  Filter,
  Info,
  DollarSign,
  Scale,
  Sparkles,
  ChevronDown,
  Building2,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";
import { createInquiry } from "@/actions/inquiry";
import {
  filterNameInput,
  filterPhoneInput,
  getNameError,
  getPhoneError,
  getEmailError,
  sanitizeText,
} from "@/lib/validation";

interface CalculatorClientProps {
  initialProducts?: any[];
}

export interface ParsedTileSize {
  wMm: number;
  hMm: number;
  areaSqm: number;
  areaSqft: number;
  displayMm: string;
}

// Extract safe products array from any API or SSR response
function extractProductsArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

// Parse tile size string (e.g., "600mm x 1200mm", "800x1600 mm", "100mm x 100mm", "20x60 cm")
export function parseTileSize(sizeStr?: string): ParsedTileSize | null {
  if (!sizeStr || typeof sizeStr !== "string") return null;
  const match = sizeStr.match(/(\d+(?:\.\d+)?)\s*(mm|cm|m)?\s*[xX*×]\s*(\d+(?:\.\d+)?)\s*(mm|cm|m)?/i);
  if (!match) return null;

  let w = parseFloat(match[1]);
  let h = parseFloat(match[3]);
  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;

  const u1 = (match[2] || "").toLowerCase();
  const u2 = (match[4] || u1 || "mm").toLowerCase();

  let wMm = w;
  if (u1 === "m") wMm = w * 1000;
  else if (u1 === "cm") wMm = w * 10;

  let hMm = h;
  if (u2 === "m") hMm = h * 1000;
  else if (u2 === "cm") hMm = h * 10;

  // Single tile area in square meters and square feet
  const areaSqm = (wMm / 1000) * (hMm / 1000);
  const areaSqft = areaSqm * 10.7639104;

  return {
    wMm,
    hMm,
    areaSqm,
    areaSqft,
    displayMm: `${Math.round(wMm)} × ${Math.round(hMm)} mm`,
  };
}

// Safe product image resolver
function getProductThumbnail(product: any): string {
  if (!product) return "/images/hero-bg.jpg";
  if (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === "string" && product.images[0].trim()) {
    return product.images[0].trim();
  }
  if (typeof product.image === "string" && product.image.trim()) {
    return product.image.trim();
  }
  if (typeof product.imageUrl === "string" && product.imageUrl.trim()) {
    return product.imageUrl.trim();
  }
  if (product.images_json) {
    try {
      const parsed = JSON.parse(product.images_json);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string" && parsed[0].trim()) {
        return parsed[0].trim();
      }
    } catch (_) {}
  }
  return "/images/hero-bg.jpg";
}

// Determine pieces per box based on product specs or size defaults
function getPcsPerBox(product: any, parsedSize: ParsedTileSize | null): number {
  if (product?.pcsPerBox) {
    const parsed = parseInt(String(product.pcsPerBox).replace(/\D+/g, ""), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (product?.packingDetails) {
    const parsed = parseInt(String(product.packingDetails).replace(/\D+/g, ""), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  // Standard packaging heuristics based on tile area
  if (parsedSize) {
    if (parsedSize.areaSqm >= 1.2) return 2; // e.g. 800x1600mm, 1200x2400mm
    if (parsedSize.areaSqm >= 0.7) return 2; // e.g. 600x1200mm
    if (parsedSize.areaSqm >= 0.3) return 4; // e.g. 600x600mm
    if (parsedSize.areaSqm >= 0.15) return 8; // e.g. 300x600mm
    if (parsedSize.areaSqm >= 0.05) return 16;
    return 25; // small mosaics or subways
  }
  return 4;
}

// Determine coverage per box (in sqft and sqm)
function getCoveragePerBox(product: any, parsedSize: ParsedTileSize | null, pcsPerBox: number) {
  const rawSft = product?.sftPerBox || product?.sft_per_box || product?.sqftPerBox;
  if (rawSft) {
    const sft = parseFloat(String(rawSft));
    if (!isNaN(sft) && sft > 0) {
      return {
        sqft: sft,
        sqm: sft / 10.7639104,
      };
    }
  }
  if (parsedSize && pcsPerBox > 0) {
    const sqm = parsedSize.areaSqm * pcsPerBox;
    const sqft = parsedSize.areaSqft * pcsPerBox;
    return { sqft, sqm };
  }
  return { sqft: 15.5, sqm: 1.44 };
}

const COMMON_ROOM_PRESETS = [
  { label: "Powder Room", lengthFt: 6, widthFt: 5 },
  { label: "Master Bathroom", lengthFt: 10, widthFt: 8 },
  { label: "Kitchen Floor", lengthFt: 12, widthFt: 10 },
  { label: "Living Room", lengthFt: 18, widthFt: 14 },
  { label: "Balcony / Deck", lengthFt: 12, widthFt: 5 },
  { label: "Master Bedroom", lengthFt: 16, widthFt: 12 },
];

export function CalculatorClient({ initialProducts = [] }: CalculatorClientProps) {
  // Products state
  const [products, setProducts] = useState<any[]>(() => extractProductsArray(initialProducts));
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productsLoading, setProductsLoading] = useState(false);
  const [tileSearch, setTileSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const productPickerRef = useRef<HTMLDivElement>(null);

  // Unit and Area Dimensions
  const [unitSystem, setUnitSystem] = useState<"sqft" | "sqm">("sqft");
  const [length, setLength] = useState<number>(15);
  const [width, setWidth] = useState<number>(12);
  const [wastagePercent, setWastagePercent] = useState<number>(10);

  // Quote Request Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: "", email: "", phone: "", company: "", message: "", honeypot: "" });
  const [quoteFieldErrors, setQuoteFieldErrors] = useState<Record<string, string>>({});
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  // Fetch products if initialProducts was empty
  useEffect(() => {
    if (products.length === 0) {
      setProductsLoading(true);
      fetch("/api/v1/products?includeInactive=false")
        .then((res) => res.json())
        .then((data) => {
          const list = extractProductsArray(data).filter(
            (p: any) =>
              p &&
              !p.is_trashed &&
              !p.isTrashed &&
              p.isActive !== false &&
              p.is_active !== false &&
              p.status !== "Inactive"
          );
          setProducts(list);
        })
        .catch((err) => console.warn("Failed to load products for calculator:", err))
        .finally(() => setProductsLoading(false));
    }
  }, [products.length]);

  // Handle URL deep linking (e.g. ?product=ascot or ?id=...) and initial product selection
  useEffect(() => {
    if (products.length === 0) return;

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get("product") || params.get("id") || params.get("code") || params.get("slug");
      if (queryParam) {
        const needle = queryParam.trim().toLowerCase();
        const found = products.find(
          (p) =>
            String(p.id).toLowerCase() === needle ||
            String(p.slug || "").toLowerCase() === needle ||
            String(p.code || "").toLowerCase() === needle ||
            String(p.name || "").toLowerCase() === needle
        );
        if (found) {
          setSelectedProductId(String(found.id));
          return;
        }
      }
    }

    if (!selectedProductId && products.length > 0) {
      // Pick first active product
      setSelectedProductId(String(products[0].id));
    }
  }, [products, selectedProductId]);

  // Close picker on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (productPickerRef.current && !productPickerRef.current.contains(event.target as Node)) {
        setIsProductPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Currently selected product object
  const selectedProduct = useMemo(() => {
    return products.find((p) => String(p.id) === String(selectedProductId)) || products[0] || null;
  }, [products, selectedProductId]);

  // Parsed tile size of selected product
  const parsedSize = useMemo(() => {
    if (!selectedProduct?.size) {
      // Fallback standard size
      return parseTileSize("600mm x 1200mm");
    }
    return parseTileSize(selectedProduct.size) || parseTileSize("600mm x 1200mm");
  }, [selectedProduct]);

  // Packaging specs
  const pcsPerBox = useMemo(() => {
    return getPcsPerBox(selectedProduct, parsedSize);
  }, [selectedProduct, parsedSize]);

  const coveragePerBox = useMemo(() => {
    return getCoveragePerBox(selectedProduct, parsedSize, pcsPerBox);
  }, [selectedProduct, parsedSize, pcsPerBox]);

  // Distinct categories for quick filter
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const cat = p.category_name || p.category || (typeof p.category === "object" ? p.category?.name : "");
      if (cat && typeof cat === "string" && cat.trim()) {
        set.add(cat.trim());
      }
    });
    return Array.from(set);
  }, [products]);

  // Filtered products list for product selector
  const filteredProducts = useMemo(() => {
    const q = tileSearch.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "ALL") {
        const cat = String(p.category_name || p.category || (typeof p.category === "object" ? p.category?.name : "")).toLowerCase();
        if (cat !== categoryFilter.toLowerCase()) return false;
      }
      if (!q) return true;
      const name = String(p.name || "").toLowerCase();
      const code = String(p.code || "").toLowerCase();
      const size = String(p.size || "").toLowerCase();
      const finish = String(p.finish || "").toLowerCase();
      return name.includes(q) || code.includes(q) || size.includes(q) || finish.includes(q);
    });
  }, [products, tileSearch, categoryFilter]);

  // Handle unit system switch
  const handleUnitToggle = (newUnit: "sqft" | "sqm") => {
    if (newUnit === unitSystem) return;
    if (newUnit === "sqm") {
      // ft to m
      setLength((prev) => parseFloat((prev * 0.3048).toFixed(2)));
      setWidth((prev) => parseFloat((prev * 0.3048).toFixed(2)));
    } else {
      // m to ft
      setLength((prev) => parseFloat((prev / 0.3048).toFixed(2)));
      setWidth((prev) => parseFloat((prev / 0.3048).toFixed(2)));
    }
    setUnitSystem(newUnit);
  };

  // Perform calculations
  const calculationResults = useMemo(() => {
    const validLength = Math.max(0, Number(length) || 0);
    const validWidth = Math.max(0, Number(width) || 0);
    const validWastage = Math.max(0, Math.min(100, Number(wastagePercent) || 0));

    // 1. Calculate Net Area in both Square Feet and Square Meters
    let netAreaSqFt = 0;
    let netAreaSqM = 0;

    if (unitSystem === "sqft") {
      netAreaSqFt = validLength * validWidth;
      netAreaSqM = netAreaSqFt / 10.7639104;
    } else {
      netAreaSqM = validLength * validWidth;
      netAreaSqFt = netAreaSqM * 10.7639104;
    }

    // 2. Wastage buffer calculation
    const wastageFactor = 1 + validWastage / 100;
    const wastageAreaSqFt = netAreaSqFt * (validWastage / 100);
    const wastageAreaSqM = netAreaSqM * (validWastage / 100);

    const grossAreaSqFt = netAreaSqFt * wastageFactor;
    const grossAreaSqM = netAreaSqM * wastageFactor;

    // 3. Tile pieces calculation
    const singleTileAreaSqm = parsedSize?.areaSqm || 0.72;
    const singleTileAreaSqft = parsedSize?.areaSqft || 7.75;

    let tilesNeeded = 0;
    if (grossAreaSqM > 0 && singleTileAreaSqm > 0) {
      tilesNeeded = Math.ceil(grossAreaSqM / singleTileAreaSqm);
    }

    // 4. Boxes calculation
    let boxesNeeded = 0;
    if (tilesNeeded > 0 && pcsPerBox > 0) {
      boxesNeeded = Math.ceil(tilesNeeded / pcsPerBox);
    }

    // Actual total coverage provided by the purchased whole boxes
    const totalBoxesCoverageSqft = boxesNeeded * (coveragePerBox?.sqft || (singleTileAreaSqft * pcsPerBox));
    const totalBoxesCoverageSqm = boxesNeeded * (coveragePerBox?.sqm || (singleTileAreaSqm * pcsPerBox));
    const spareTiles = (boxesNeeded * pcsPerBox) - tilesNeeded;

    // 5. Weight & adhesive estimation (bonus architectural helpers)
    const adhesiveWeightKg = grossAreaSqM * 4.5; // standard trowel coverage
    const groutWeightKg = grossAreaSqM * 0.4; // 3mm joints average
    const approxWeightKg = boxesNeeded * (parseFloat(String(selectedProduct?.kgPerBox || selectedProduct?.weight || 30)) || 30);

    // 6. Pricing calculation
    const rawPrice = selectedProduct?.price;
    const priceNum = typeof rawPrice === "number" ? rawPrice : parseFloat(String(rawPrice || 0));
    const hasValidPrice = !isNaN(priceNum) && priceNum > 0;

    let estimatedTotalAmount: number | null = null;
    if (hasValidPrice && boxesNeeded > 0) {
      // Standard tile retail in India is per box
      estimatedTotalAmount = boxesNeeded * priceNum;
    }

    return {
      netAreaSqFt,
      netAreaSqM,
      wastageAreaSqFt,
      wastageAreaSqM,
      grossAreaSqFt,
      grossAreaSqM,
      singleTileAreaSqft,
      singleTileAreaSqm,
      tilesNeeded,
      boxesNeeded,
      totalBoxesCoverageSqft,
      totalBoxesCoverageSqm,
      spareTiles,
      adhesiveWeightKg,
      groutWeightKg,
      approxWeightKg,
      hasValidPrice,
      pricePerBox: hasValidPrice ? priceNum : null,
      estimatedTotalAmount,
    };
  }, [length, width, unitSystem, wastagePercent, parsedSize, pcsPerBox, coveragePerBox, selectedProduct]);

  // Handle quote form submission
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteLoading) return;

    // Anti-spam honeypot
    if (quoteForm.honeypot) {
      setQuoteSuccess(true);
      setTimeout(() => {
        setQuoteSuccess(false);
        setShowQuoteModal(false);
      }, 2000);
      return;
    }

    const nameErr = getNameError(quoteForm.name);
    const phoneErr = getPhoneError(quoteForm.phone);
    const emailErr = getEmailError(quoteForm.email, true);

    if (nameErr || phoneErr || emailErr) {
      setQuoteFieldErrors({
        name: nameErr || "",
        phone: phoneErr || "",
        email: emailErr || "",
      });
      setQuoteError(nameErr || phoneErr || emailErr || "Please fill in all required fields accurately.");
      return;
    }

    setQuoteFieldErrors({});
    setQuoteLoading(true);
    setQuoteError("");
    setQuoteSuccess(false);

    const productName = selectedProduct?.name || "Selected Tile";
    const productCode = selectedProduct?.code || "";
    const sizeDisplay = parsedSize?.displayMm || selectedProduct?.size || "";

    const messageText = sanitizeText(quoteForm.message.trim()) ||
      `Online Tile Calculator Estimate:
Tile: ${productName} (${productCode})
Size: ${sizeDisplay}
Area: ${calculationResults.grossAreaSqFt.toFixed(1)} sq ft (${calculationResults.grossAreaSqM.toFixed(1)} sq m)
Quantity: ${calculationResults.tilesNeeded} pieces (${calculationResults.boxesNeeded} boxes)
Estimated Budget: ${calculationResults.hasValidPrice && calculationResults.estimatedTotalAmount ? `INR ${calculationResults.estimatedTotalAmount.toLocaleString("en-IN")}` : "Pricing on Request"}`;

    const res = await createInquiry({
      type: "QUOTE_REQUEST",
      name: quoteForm.name.trim(),
      email: quoteForm.email.trim(),
      phone: quoteForm.phone.trim(),
      company: sanitizeText(quoteForm.company.trim()),
      message: messageText,
      pageSource: "Online Tile Calculator",
      honeypot_field: quoteForm.honeypot,
      details: {
        productName,
        productCode,
        tileSize: sizeDisplay,
        dimensions: `${length} × ${width} ${unitSystem === "sqft" ? "ft" : "m"}`,
        wastagePercent: `${wastagePercent}%`,
        netAreaSqFt: calculationResults.netAreaSqFt.toFixed(2),
        grossAreaSqFt: calculationResults.grossAreaSqFt.toFixed(2),
        tilesNeeded: calculationResults.tilesNeeded,
        boxesNeeded: calculationResults.boxesNeeded,
        estimatedTotalAmount: calculationResults.estimatedTotalAmount,
      },
    });

    setQuoteLoading(false);
    if (res.success) {
      setQuoteSuccess(true);
      setQuoteForm({ name: "", email: "", phone: "", company: "", message: "", honeypot: "" });
      setTimeout(() => {
        setQuoteSuccess(false);
        setShowQuoteModal(false);
      }, 3000);
    } else {
      setQuoteError(res.error || "Failed to submit quote request.");
    }
  };

  return (
    <div className="bg-[#F7F5F0] min-h-screen py-12 md:py-20 text-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#101B38]/5 border border-[#101B38]/10 rounded-full text-[#C95745] text-xs font-semibold uppercase tracking-widest">
            <Calculator className="w-3.5 h-3.5" />
            <span>Online Tile Calculation Tool</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#101B38] tracking-tight">
            Tile Quantity & Area Calculator
          </h1>
          <p className="text-xs md:text-sm text-[#333333]/70 font-light max-w-xl mx-auto leading-relaxed">
            Select your desired Timex Ceramic tile, enter your room dimensions, and instantly calculate exact tile pieces, packaging boxes, and estimated project amounts.
          </p>
        </div>

        {/* Main Grid: Calculation Inputs vs Live Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Configuration & Dimensions (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Tile Product Selection Card */}
            <div className="bg-[#FCFBF8] rounded-[2px] p-6 md:p-8 border border-[#EDEAE4] shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#EDEAE4] pb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-[#101B38] text-[#FCFBF8] text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#101B38]">
                      Select Tile Product
                    </h2>
                    <p className="text-[11px] text-[#333333]/60">
                      Calculations will be computed from the tile&apos;s real dimensions
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsProductPickerOpen((prev) => !prev)}
                  className="px-3.5 py-1.5 bg-[#EDEAE4] hover:bg-[#DED9D0] text-[#101B38] rounded-[2px] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-[#C95745]" />
                  <span>{isProductPickerOpen ? "Close List" : "Browse All"}</span>
                </button>
              </div>

              {/* Selected Tile Preview Card */}
              {selectedProduct ? (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-[#EDEAE4]/40 border border-[#EDEAE4] rounded-[2px]">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#EDEAE4] rounded-[2px] overflow-hidden border border-[#DED9D0]">
                    <Image
                      src={getProductThumbnail(selectedProduct)}
                      alt={selectedProduct.name || "Tile Product"}
                      fill
                      sizes="112px"
                      className="object-cover"
                      unoptimized={getProductThumbnail(selectedProduct).startsWith("/uploads/")}
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#101B38] text-[#FCFBF8] rounded-[2px]">
                        {selectedProduct.code || "TMX"}
                      </span>
                      {selectedProduct.category_name || selectedProduct.category ? (
                        <span className="text-[10px] px-2 py-0.5 bg-[#EDEAE4] text-[#333333] rounded-[2px] font-medium">
                          {selectedProduct.category_name || (typeof selectedProduct.category === "string" ? selectedProduct.category : selectedProduct.category?.name)}
                        </span>
                      ) : null}
                      {selectedProduct.finish && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#EDEAE4] text-[#333333] rounded-[2px]">
                          {selectedProduct.finish}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-lg md:text-xl font-bold text-[#101B38] truncate">
                      {selectedProduct.name}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#333333]/60 block font-semibold">
                          Tile Size
                        </span>
                        <span className="font-bold text-[#101B38]">
                          {parsedSize?.displayMm || selectedProduct.size || "Standard"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#333333]/60 block font-semibold">
                          Tile Area
                        </span>
                        <span className="font-semibold text-[#101B38]">
                          {parsedSize ? `${parsedSize.areaSqft.toFixed(2)} sq.ft` : "—"}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#333333]/60 block font-semibold">
                          Packaging
                        </span>
                        <span className="font-semibold text-[#101B38]">
                          {pcsPerBox} pcs / box
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#333333]/60 bg-[#EDEAE4]/40 border border-[#EDEAE4] rounded-[2px]">
                  {productsLoading ? "Loading products..." : "No tile product selected. Please select one below."}
                </div>
              )}

              {/* Direct Quick Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#101B38] flex items-center justify-between">
                  <span>Quick Select Tile</span>
                  <span className="text-[10px] font-normal text-[#333333]/60">
                    {products.length} tile designs available
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      setIsProductPickerOpen(false);
                    }}
                    className="w-full bg-[#FCFBF8] border border-[#333333]/30 rounded-[2px] p-3 text-xs md:text-sm text-[#101B38] outline-none focus:border-[#101B38] appearance-none pr-10 cursor-pointer font-medium"
                  >
                    {(Array.isArray(products) ? products : []).map((p) => {
                      const pSize = parseTileSize(p.size)?.displayMm || p.size || "";
                      return (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.code || "Tile"}) — {pSize}
                          {p.price && p.price > 0 ? ` [₹${p.price}/box]` : ""}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#333333]/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Collapsible Search & Grid Picker */}
              {isProductPickerOpen && (
                <div
                  ref={productPickerRef}
                  className="p-4 bg-[#EDEAE4]/50 border border-[#DED9D0] rounded-[2px] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-[#333333]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by name, code (e.g. TMX-118), finish, or size..."
                        value={tileSearch}
                        onChange={(e) => setTileSearch(e.target.value)}
                        className="w-full bg-[#FCFBF8] border border-[#333333]/30 rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#101B38] outline-none focus:border-[#101B38]"
                      />
                    </div>
                    {categoriesList.length > 0 && (
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-[#FCFBF8] border border-[#333333]/30 rounded-[2px] px-3 py-2 text-xs text-[#101B38] outline-none focus:border-[#101B38] cursor-pointer"
                      >
                        <option value="ALL">All Categories</option>
                        {categoriesList.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Tile Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
                    {filteredProducts.map((p) => {
                      const isSelected = String(p.id) === String(selectedProductId);
                      const thumb = getProductThumbnail(p);
                      const pSize = parseTileSize(p.size)?.displayMm || p.size || "Standard";

                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedProductId(String(p.id));
                            setIsProductPickerOpen(false);
                          }}
                          className={`text-left p-2 rounded-[2px] border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-[#101B38] text-[#FCFBF8] border-[#101B38] shadow-sm"
                              : "bg-[#FCFBF8] text-[#333333] border-[#EDEAE4] hover:border-[#101B38]/40"
                          }`}
                        >
                          <div className="relative w-full h-16 bg-[#EDEAE4] rounded-[2px] overflow-hidden mb-1.5">
                            <Image
                              src={thumb}
                              alt={p.name}
                              fill
                              sizes="120px"
                              className="object-cover"
                              unoptimized={thumb.startsWith("/uploads/")}
                            />
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C95745] text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-[9px] font-mono opacity-70 block truncate">
                              {p.code || "TMX"}
                            </span>
                            <span className="font-bold text-xs block truncate leading-tight">
                              {p.name}
                            </span>
                            <span className="text-[10px] opacity-75 block truncate mt-0.5">
                              {pSize}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <div className="col-span-full py-6 text-center text-xs text-[#333333]/60">
                        No tile designs matching your search.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Dimensions & Measurement Inputs Card */}
            <div className="bg-[#FCFBF8] rounded-[2px] p-6 md:p-8 border border-[#EDEAE4] shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDEAE4] pb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-[#101B38] text-[#FCFBF8] text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#101B38]">
                      Enter Area Dimensions
                    </h2>
                    <p className="text-[11px] text-[#333333]/60">
                      Provide room length and width to estimate tile quantity
                    </p>
                  </div>
                </div>

                {/* Unit Switcher */}
                <div className="flex bg-[#EDEAE4] rounded-[2px] border border-[#DED9D0] p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => handleUnitToggle("sqft")}
                    className={`px-3 py-1.5 rounded-[2px] font-semibold transition-colors cursor-pointer ${
                      unitSystem === "sqft"
                        ? "bg-[#101B38] text-[#FCFBF8]"
                        : "text-[#333333] hover:text-[#101B38]"
                    }`}
                  >
                    Sq. Ft (ft)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnitToggle("sqm")}
                    className={`px-3 py-1.5 rounded-[2px] font-semibold transition-colors cursor-pointer ${
                      unitSystem === "sqm"
                        ? "bg-[#101B38] text-[#FCFBF8]"
                        : "text-[#333333] hover:text-[#101B38]"
                    }`}
                  >
                    Sq. M (m)
                  </button>
                </div>
              </div>

              {/* Room Dimensions Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#101B38] flex items-center justify-between">
                    <span>Length ({unitSystem === "sqft" ? "Feet" : "Metres"})</span>
                    <span className="text-[10px] text-[#333333]/60">Positive number</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={length || ""}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setLength(isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      placeholder="e.g. 15"
                      className="w-full bg-[#FCFBF8] border border-[#333333]/30 rounded-[2px] p-3 text-sm font-semibold text-[#101B38] outline-none focus:border-[#101B38]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#333333]/50">
                      {unitSystem === "sqft" ? "ft" : "m"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#101B38] flex items-center justify-between">
                    <span>Width ({unitSystem === "sqft" ? "Feet" : "Metres"})</span>
                    <span className="text-[10px] text-[#333333]/60">Positive number</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={width || ""}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setWidth(isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      placeholder="e.g. 12"
                      className="w-full bg-[#FCFBF8] border border-[#333333]/30 rounded-[2px] p-3 text-sm font-semibold text-[#101B38] outline-none focus:border-[#101B38]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#333333]/50">
                      {unitSystem === "sqft" ? "ft" : "m"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Room Presets */}
              <div className="space-y-2">
                <span className="text-[10px] text-[#333333]/60 font-semibold uppercase tracking-wider block">
                  Standard Room Presets (Quick Fill)
                </span>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ROOM_PRESETS.map((preset) => {
                    const pLen = unitSystem === "sqft" ? preset.lengthFt : parseFloat((preset.lengthFt * 0.3048).toFixed(2));
                    const pWid = unitSystem === "sqft" ? preset.widthFt : parseFloat((preset.widthFt * 0.3048).toFixed(2));
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setLength(pLen);
                          setWidth(pWid);
                        }}
                        className="px-2.5 py-1 bg-[#EDEAE4]/70 hover:bg-[#101B38] hover:text-[#FCFBF8] text-[#333333] text-[11px] font-medium rounded-[2px] border border-[#DED9D0] transition-colors cursor-pointer"
                      >
                        {preset.label} ({pLen}×{pWid} {unitSystem === "sqft" ? "ft" : "m"})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Wastage Percentage Buffer */}
              <div className="pt-4 border-t border-[#EDEAE4] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-[#101B38] block">
                      Cutting & Layout Wastage Percentage
                    </label>
                    <p className="text-[11px] text-[#333333]/60">
                      Extra tiles needed for corner cuts, edge trimming, and future replacements
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#C95745]">
                    +{wastagePercent}% Buffer
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[0, 5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setWastagePercent(pct)}
                      className={`py-2 text-xs font-semibold rounded-[2px] border transition-colors cursor-pointer ${
                        wastagePercent === pct
                          ? "bg-[#101B38] text-[#FCFBF8] border-[#101B38]"
                          : "bg-[#FCFBF8] text-[#333333] border-[#EDEAE4] hover:border-[#101B38]/50"
                      }`}
                    >
                      {pct}% {pct === 10 ? "(Std)" : ""}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#333333]/60 italic flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-[#C95745] shrink-0" />
                  <span>10% is industry standard for straight tiling; 15% is recommended for herringbone or diagonal patterns.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Calculation Breakdown & Amount Panel (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-[#101B38] text-[#FCFBF8] rounded-[2px] p-6 md:p-8 border border-[#101B38] shadow-xl space-y-6">
              
              {/* Header */}
              <div className="border-b border-[#FCFBF8]/15 pb-4">
                <span className="text-[10px] tracking-widest text-[#C95745] font-semibold uppercase block">
                  Calculation Results
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#FCFBF8] mt-0.5">
                  Required Tile Quantity
                </h2>
                <p className="text-xs text-[#EDEAE4]/70 font-light mt-0.5">
                  Calculated based on {selectedProduct?.name || "selected tile"} ({parsedSize?.displayMm || selectedProduct?.size || "standard"})
                </p>
              </div>

              {/* Main Badge: Boxes & Tiles Needed */}
              <div className="grid grid-cols-2 gap-3 bg-[#FCFBF8]/10 border border-[#FCFBF8]/15 rounded-[2px] p-4 text-center">
                <div className="border-r border-[#FCFBF8]/10 pr-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#C95745] font-bold block">
                    Boxes Required
                  </span>
                  <div className="font-serif text-3xl md:text-4xl font-bold text-[#FCFBF8] my-1">
                    {calculationResults.boxesNeeded}
                  </div>
                  <span className="text-[10px] text-[#EDEAE4]/70 font-light block">
                    {calculationResults.totalBoxesCoverageSqft.toFixed(1)} sq.ft coverage
                  </span>
                </div>

                <div className="pl-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#C95745] font-bold block">
                    Tiles Required
                  </span>
                  <div className="font-serif text-3xl md:text-4xl font-bold text-[#FCFBF8] my-1">
                    {calculationResults.tilesNeeded}
                  </div>
                  <span className="text-[10px] text-[#EDEAE4]/70 font-light block">
                    +{calculationResults.spareTiles} spare pieces in box
                  </span>
                </div>
              </div>

              {/* Section 1: Total Area Breakdown */}
              <div className="space-y-3 border-b border-[#FCFBF8]/15 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C95745] block">
                  Area Breakdown
                </span>
                
                <div className="flex justify-between text-xs">
                  <span className="text-[#EDEAE4]/70 flex items-center space-x-1.5">
                    <Ruler className="w-3.5 h-3.5 text-[#C95745]" />
                    <span>Net Room Area:</span>
                  </span>
                  <span className="font-semibold text-[#FCFBF8]">
                    {calculationResults.netAreaSqFt.toFixed(2)} sq.ft ({calculationResults.netAreaSqM.toFixed(2)} sq.m)
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-[#EDEAE4]/70 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C95745]" />
                    <span>Wastage Buffer (+{wastagePercent}%):</span>
                  </span>
                  <span className="font-medium text-[#EDEAE4]">
                    +{calculationResults.wastageAreaSqFt.toFixed(2)} sq.ft ({calculationResults.wastageAreaSqM.toFixed(2)} sq.m)
                  </span>
                </div>

                <div className="flex justify-between text-xs pt-1 border-t border-[#FCFBF8]/10 font-bold">
                  <span className="text-[#FCFBF8]">Total Area Required:</span>
                  <span className="text-[#FCFBF8]">
                    {calculationResults.grossAreaSqFt.toFixed(2)} sq.ft ({calculationResults.grossAreaSqM.toFixed(2)} sq.m)
                  </span>
                </div>
              </div>

              {/* Section 2: Selected Tile Size & Packaging Specs */}
              <div className="space-y-3 border-b border-[#FCFBF8]/15 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C95745] block">
                  Tile & Packaging Specs
                </span>

                <div className="flex justify-between text-xs">
                  <span className="text-[#EDEAE4]/70">Selected Tile:</span>
                  <span className="font-semibold text-[#FCFBF8] text-right truncate max-w-[200px]">
                    {selectedProduct?.name} ({selectedProduct?.code || "TMX"})
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-[#EDEAE4]/70">Dimensions:</span>
                  <span className="font-medium text-[#FCFBF8]">
                    {parsedSize?.displayMm || selectedProduct?.size || "600 × 1200 mm"}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-[#EDEAE4]/70">Single Tile Area:</span>
                  <span className="font-medium text-[#FCFBF8]">
                    {calculationResults.singleTileAreaSqft.toFixed(2)} sq.ft ({calculationResults.singleTileAreaSqm.toFixed(3)} sq.m)
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-[#EDEAE4]/70">Box Packaging:</span>
                  <span className="font-medium text-[#FCFBF8]">
                    {pcsPerBox} pieces ({coveragePerBox.sqft.toFixed(2)} sq.ft / box)
                  </span>
                </div>
              </div>

              {/* Section 3: Estimated Total Amount */}
              <div className="bg-[#FCFBF8]/5 border border-[#FCFBF8]/15 rounded-[2px] p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C95745] block">
                  Estimated Total Amount
                </span>

                {calculationResults.hasValidPrice && calculationResults.estimatedTotalAmount !== null ? (
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-serif text-3xl font-bold text-[#FCFBF8]">
                        ₹ {calculationResults.estimatedTotalAmount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-[#EDEAE4]/70">
                        (₹ {calculationResults.pricePerBox?.toLocaleString("en-IN")} / box)
                      </span>
                    </div>
                    <p className="text-[10px] text-[#EDEAE4]/70 font-light leading-relaxed">
                      Estimated material amount for {calculationResults.boxesNeeded} boxes ({calculationResults.totalBoxesCoverageSqft.toFixed(1)} sq.ft coverage). Taxes, shipping, and handling may vary.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 text-[#C95745] font-semibold text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Amount cannot be calculated (Pricing on request)</span>
                    </div>
                    <p className="text-[11px] text-[#EDEAE4]/70 font-light leading-relaxed">
                      Timex Ceramic tiles in this architectural series are priced based on project volume, customized batch finishes, and destination logistics. Request a formal quote below to receive exact factory pricing.
                    </p>
                  </div>
                )}
              </div>

              {/* Section 4: Material Helpers (Adhesive & Grout) */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#EDEAE4]/50 block font-semibold">
                  Installation Material Estimates
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#FCFBF8]/5 p-2 rounded-[2px]">
                    <span className="text-[#EDEAE4]/60 block">Adhesive Needed:</span>
                    <span className="font-semibold text-[#FCFBF8]">~{calculationResults.adhesiveWeightKg.toFixed(0)} kg</span>
                  </div>
                  <div className="bg-[#FCFBF8]/5 p-2 rounded-[2px]">
                    <span className="text-[#EDEAE4]/60 block">Grout Needed:</span>
                    <span className="font-semibold text-[#FCFBF8]">~{calculationResults.groutWeightKg.toFixed(1)} kg</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Request Official Quote (NO PDF BUTTON) */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full py-3.5 bg-[#C95745] hover:bg-[#b04838] text-[#FCFBF8] rounded-[2px] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Request Official Price Quote</span>
                </button>

                <p className="text-[10px] text-center text-[#EDEAE4]/50 font-light">
                  Estimates are calculated live on this page. All quotes are delivered promptly by our architectural project team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-[#101B38]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#FCFBF8] p-6 md:p-8 rounded-[2px] shadow-2xl border border-[#EDEAE4] relative text-[#333333] max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-4 right-4 text-[#333333]/60 hover:text-[#101B38] text-lg font-bold cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="mb-5 border-b border-[#EDEAE4] pb-3">
              <span className="text-[10px] tracking-widest text-[#C95745] font-semibold uppercase block">
                Official Project Quotation
              </span>
              <h3 className="font-serif text-xl font-bold text-[#101B38] mt-0.5">
                Request Tile Price Quote
              </h3>
              <p className="text-xs text-[#333333]/70 font-light mt-1">
                Estimating {calculationResults.boxesNeeded} boxes ({calculationResults.tilesNeeded} pieces) of {selectedProduct?.name || "Selected Tile"}.
              </p>
            </div>

            {quoteSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#101B38] mx-auto" />
                <h4 className="font-serif font-bold text-base text-[#101B38]">
                  Quote Request Dispatched!
                </h4>
                <p className="text-xs text-[#333333]/70 font-light">
                  Our surface specialists will review your requirements and email an official commercial quotation within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                {quoteError && (
                  <div className="p-3 bg-red-50 text-[#C95745] rounded-[2px] text-xs font-medium border border-red-200">
                    {quoteError}
                  </div>
                )}

                {/* Honeypot field */}
                <input
                  type="text"
                  name="honeypot_field"
                  value={quoteForm.honeypot}
                  onChange={(e) => setQuoteForm({ ...quoteForm, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <label className="block font-medium mb-1 text-[#101B38]">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={quoteForm.name}
                    onChange={(e) => {
                      const filtered = filterNameInput(e.target.value);
                      setQuoteForm({ ...quoteForm, name: filtered });
                      if (quoteFieldErrors.name) {
                        setQuoteFieldErrors((prev) => ({ ...prev, name: getNameError(filtered) || "" }));
                      }
                    }}
                    onBlur={() => {
                      const err = getNameError(quoteForm.name);
                      if (err) setQuoteFieldErrors((prev) => ({ ...prev, name: err }));
                    }}
                    className={`w-full p-2.5 border rounded-[2px] outline-none bg-[#FCFBF8] ${
                      quoteFieldErrors.name ? "border-[#C95745] focus:border-[#C95745]" : "border-[#333333]/30 focus:border-[#101B38]"
                    }`}
                  />
                  {quoteFieldErrors.name && (
                    <p className="text-[11px] text-[#C95745] font-medium mt-1">{quoteFieldErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1 text-[#101B38]">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={quoteForm.email}
                      onChange={(e) => {
                        setQuoteForm({ ...quoteForm, email: e.target.value });
                        if (quoteFieldErrors.email) {
                          setQuoteFieldErrors((prev) => ({ ...prev, email: getEmailError(e.target.value, true) || "" }));
                        }
                      }}
                      onBlur={() => {
                        const err = getEmailError(quoteForm.email, true);
                        if (err) setQuoteFieldErrors((prev) => ({ ...prev, email: err }));
                      }}
                      className={`w-full p-2.5 border rounded-[2px] outline-none bg-[#FCFBF8] ${
                        quoteFieldErrors.email ? "border-[#C95745] focus:border-[#C95745]" : "border-[#333333]/30 focus:border-[#101B38]"
                      }`}
                    />
                    {quoteFieldErrors.email && (
                      <p className="text-[11px] text-[#C95745] font-medium mt-1">{quoteFieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-[#101B38]">Phone Number *</label>
                    <div className="flex relative">
                      <span className="inline-flex items-center px-2 bg-[#EDEAE4] border border-r-0 border-[#DED9D0] rounded-l-[2px] text-xs font-semibold text-[#101B38] select-none shrink-0">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        required
                        placeholder="10-digit mobile"
                        value={quoteForm.phone}
                        onChange={(e) => {
                          const filtered = filterPhoneInput(e.target.value);
                          setQuoteForm({ ...quoteForm, phone: filtered });
                          if (quoteFieldErrors.phone) {
                            setQuoteFieldErrors((prev) => ({ ...prev, phone: getPhoneError(filtered) || "" }));
                          }
                        }}
                        onBlur={() => {
                          const err = getPhoneError(quoteForm.phone);
                          if (err) setQuoteFieldErrors((prev) => ({ ...prev, phone: err }));
                        }}
                        className={`w-full p-2.5 border rounded-r-[2px] rounded-l-none outline-none bg-[#FCFBF8] ${
                          quoteFieldErrors.phone ? "border-[#C95745] focus:border-[#C95745]" : "border-[#333333]/30 focus:border-[#101B38]"
                        }`}
                      />
                    </div>
                    {quoteFieldErrors.phone && (
                      <p className="text-[11px] text-[#C95745] font-medium mt-1">{quoteFieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-[#101B38]">Company / Architectural Studio (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Design Atelier, Construction Firm"
                    value={quoteForm.company}
                    onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                    className="w-full p-2.5 border border-[#333333]/30 rounded-[2px] outline-none focus:border-[#101B38] bg-[#FCFBF8]"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-[#101B38]">Project Notes / Delivery Location</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Delivery needed in Mumbai by next month, need sample first..."
                    value={quoteForm.message}
                    onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                    className="w-full p-2.5 border border-[#333333]/30 rounded-[2px] outline-none focus:border-[#101B38] bg-[#FCFBF8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={quoteLoading}
                  className="w-full py-3 bg-[#101B38] text-[#FCFBF8] rounded-[2px] font-semibold uppercase tracking-wider text-xs hover:bg-[#C95745] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {quoteLoading ? "Submitting Inquiry..." : "Submit Quote Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
