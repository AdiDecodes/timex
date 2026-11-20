"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Download,
  Plus,
  Trash2,
  MoveDown,
  MoveUp,
  Search,
  Filter,
  Check,
  CheckSquare,
  Square,
  Sparkles,
  Layers,
  FileText,
  AlertCircle,
  Eye,
  ListOrdered,
  X,
  Palette,
  Edit3,
} from "lucide-react";

interface CatalogueMakerClientProps {
  initialProducts?: any[];
}

// Helper to extract a safe products array from any API response structure
function extractProductsArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

// Helper to get the best available primary image for a product
function getProductImage(product: any): string {
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

// Helper to extract available real specifications for a product
function getProductSpecs(product: any): { label: string; value: string }[] {
  if (!product) return [];
  const specs: { label: string; value: string }[] = [];

  if (product.code) specs.push({ label: "Product Code", value: String(product.code).trim() });
  if (product.sku && product.sku !== product.code) specs.push({ label: "SKU", value: String(product.sku).trim() });
  if (product.size) specs.push({ label: "Size", value: String(product.size).trim() });
  if (product.thickness) specs.push({ label: "Thickness", value: String(product.thickness).trim() });

  if (product.finish) {
    const rawF = String(product.finish).trim();
    const formattedF = rawF.toLowerCase() === "matte" ? "Matt" : rawF;
    specs.push({ label: "Finish", value: formattedF });
  }

  if (product.look) specs.push({ label: "Look / Texture", value: String(product.look).trim() });
  if (product.material) specs.push({ label: "Material", value: String(product.material).trim() });

  const app = product.application || product.usage;
  if (app) specs.push({ label: "Application", value: String(app).trim() });

  const edge = product.edgeType || product.edge_type;
  if (edge) specs.push({ label: "Edge Profile", value: String(edge).trim() });

  const cat = product.category_name || product.category;
  if (cat) specs.push({ label: "Category", value: String(cat).trim() });

  const col = product.collection_name || product.collection;
  if (col) specs.push({ label: "Collection", value: String(col).trim() });

  return specs;
}

export function CatalogueMakerClient({ initialProducts = [] }: CatalogueMakerClientProps) {
  // Normalize initial products
  const safeInitial = useMemo(() => {
    const list = extractProductsArray(initialProducts);
    return list.filter(
      (p) =>
        p &&
        !p.is_trashed &&
        !p.isTrashed &&
        p.isActive !== false &&
        p.is_active !== false &&
        p.status !== "Inactive"
    );
  }, [initialProducts]);

  const [products, setProducts] = useState<any[]>(safeInitial);
  const [selectedProducts, setSelectedProducts] = useState<any[]>(() => safeInitial.slice(0, 2));

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedFinish, setSelectedFinish] = useState("ALL");

  // Catalogue Branding Settings
  const [catalogTitle, setCatalogTitle] = useState("Curated Architectural Tile Lookbook");
  const [clientName, setClientName] = useState("Prestige Residential Project");
  const [catalogTheme, setCatalogTheme] = useState<"minimal" | "royal" | "dark">("minimal");
  const [coverNote, setCoverNote] = useState(
    "A custom-curated selection of premium vitrified slabs and luxury porcelain surfaces sourced from premier European and international manufacturers."
  );
  const [productNotes, setProductNotes] = useState<Record<string, string>>({});
  const [showWatermark, setShowWatermark] = useState(true);

  // Status & Progress State
  const [isLoading, setIsLoading] = useState(safeInitial.length === 0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [compiling, setCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState("");
  const [activeTab, setActiveTab] = useState<"builder" | "preview">("builder");

  // Digital Signature Canvas
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [sigSaved, setSigSaved] = useState(false);
  const [sigDataUrl, setSigDataUrl] = useState<string | null>(null);
  const isDrawing = useRef(false);

  // Client-side fetch to ensure fresh products from production API
  useEffect(() => {
    let isSubscribed = true;

    async function loadFreshProducts() {
      try {
        const res = await fetch(`/api/v1/products?activeOnly=true&_t=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const rawList = extractProductsArray(data);

        if (isSubscribed && rawList.length > 0) {
          const activeList = rawList.filter(
            (p) =>
              p &&
              !p.is_trashed &&
              !p.isTrashed &&
              p.isActive !== false &&
              p.is_active !== false &&
              p.status !== "Inactive"
          );
          setProducts(activeList);
          setFetchError(null);

          // If no products were pre-selected yet, pick first 2
          setSelectedProducts((prev) => (prev.length === 0 && activeList.length > 0 ? activeList.slice(0, 2) : prev));
        }
      } catch (err: any) {
        console.warn("Notice loading fresh products in CatalogueMakerClient:", err.message);
        if (products.length === 0) {
          setFetchError("Unable to load live products from server. Please check your connection.");
        }
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    }

    loadFreshProducts();
    return () => {
      isSubscribed = false;
    };
  }, []);

  // Safe array of products guaranteed at all times
  const safeProducts = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  // Extract unique categories & finishes for filters
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    safeProducts.forEach((p) => {
      const c = p.category_name || p.category;
      if (c && typeof c === "string") set.add(c.trim());
    });
    return Array.from(set).sort();
  }, [safeProducts]);

  const finishOptions = useMemo(() => {
    const set = new Set<string>();
    safeProducts.forEach((p) => {
      if (p.finish && typeof p.finish === "string") {
        const f = p.finish.trim().toLowerCase() === "matte" ? "Matt" : p.finish.trim();
        set.add(f);
      }
    });
    return Array.from(set).sort();
  }, [safeProducts]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return safeProducts.filter((p) => {
      // Category filter
      if (selectedCategory !== "ALL") {
        const pCat = (p.category_name || p.category || p.category_id || p.categoryId || "").toLowerCase();
        if (!pCat.includes(selectedCategory.toLowerCase())) return false;
      }

      // Finish filter
      if (selectedFinish !== "ALL") {
        const pFinish = (p.finish || "").toLowerCase();
        const targetFinish = selectedFinish.toLowerCase();
        if (!pFinish.includes(targetFinish) && !(targetFinish === "matt" && pFinish.includes("matte"))) {
          return false;
        }
      }

      // Search query (name, code, SKU, collection)
      if (q) {
        const name = (p.name || "").toLowerCase();
        const code = (p.code || "").toLowerCase();
        const sku = (p.sku || "").toLowerCase();
        const col = (p.collection_name || p.collection || "").toLowerCase();
        return name.includes(q) || code.includes(q) || sku.includes(q) || col.includes(q);
      }

      return true;
    });
  }, [safeProducts, searchQuery, selectedCategory, selectedFinish]);

  // Selection toggle
  const toggleProduct = useCallback((product: any) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  // Select all visible filtered products
  const handleSelectAllVisible = useCallback(() => {
    setSelectedProducts((prev) => {
      const currentIds = new Set(prev.map((item) => item.id));
      const newItems = filteredProducts.filter((p) => !currentIds.has(p.id));
      return [...prev, ...newItems];
    });
  }, [filteredProducts]);

  // Clear all selections
  const handleClearAll = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  // Move product up / down in order
  const moveProduct = useCallback(
    (index: number, direction: "up" | "down") => {
      const newItems = [...selectedProducts];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newItems.length) return;
      const temp = newItems[index];
      newItems[index] = newItems[targetIndex];
      newItems[targetIndex] = temp;
      setSelectedProducts(newItems);
    },
    [selectedProducts]
  );

  // Digital Signature Canvas Helpers
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;
    if ("touches" in e) {
      clientX = e.touches[0]?.clientX || 0;
      clientY = e.touches[0]?.clientY || 0;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#101B38";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const endDrawing = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSigSaved(false);
    setSigDataUrl(null);
  };

  const saveSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    setSigDataUrl(canvas.toDataURL("image/png"));
    setSigSaved(true);
  };

  // Compile Canvas Slides to High-Resolution A4 PDF
  const handleCompilePdf = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product before exporting the catalogue.");
      return;
    }

    setCompiling(true);
    setCompileProgress("Initializing PDF engine...");

    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pages = document.querySelectorAll(".catalog-page-slide");
      const totalPages = pages.length;

      for (let i = 0; i < totalPages; i++) {
        setCompileProgress(`Rendering high-resolution page ${i + 1} of ${totalPages}...`);
        const page = pages[i] as HTMLElement;

        const canvas = await html2canvas(page, {
          scale: 2, // 300 DPI high resolution
          useCORS: true,
          allowTaint: true,
          logging: false,
          imageTimeout: 15000,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pageWidth = 210; // A4 mm
        const pageHeight = 297; // A4 mm

        if (i > 0) doc.addPage("a4", "p");
        doc.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
      }

      setCompileProgress("Finalizing & saving catalogue PDF...");
      const sanitizedName = (clientName || "Presentation").replace(/[^a-zA-Z0-9_-]/g, "_");
      doc.save(`Timex-Ceramic-Catalogue-${sanitizedName}.pdf`);
    } catch (err: any) {
      console.error("PDF Compilation Failed:", err);
      alert("Unable to compile PDF lookbook. Please ensure all product images have loaded properly.");
    } finally {
      setCompiling(false);
      setCompileProgress("");
    }
  };

  // Theme styling configurations
  const themeClasses = {
    minimal: {
      slideBg: "bg-[#FFFFFF] text-[#333333]",
      headerBorder: "border-[#E5E5E5]",
      accentText: "text-[#C95745]",
      headingText: "text-[#101B38]",
      subText: "text-[#666666]",
      specRow: "border-[#F0EDE6] text-[#333333]",
      specLabel: "text-[#101B38]",
      cardBg: "bg-[#F7F5F0]",
    },
    royal: {
      slideBg: "bg-[#FCFBF8] text-[#333333]",
      headerBorder: "border-[#DED9D0]",
      accentText: "text-[#C95745]",
      headingText: "text-[#101B38]",
      subText: "text-[#555555]",
      specRow: "border-[#EDEAE4] text-[#333333]",
      specLabel: "text-[#101B38]",
      cardBg: "bg-[#FAF8F3]",
    },
    dark: {
      slideBg: "bg-[#101B38] text-[#FCFBF8]",
      headerBorder: "border-white/15",
      accentText: "text-[#C95745]",
      headingText: "text-[#FCFBF8]",
      subText: "text-white/70",
      specRow: "border-white/10 text-white/90",
      specLabel: "text-white",
      cardBg: "bg-[#162345]",
    },
  }[catalogTheme];

  return (
    <div className="bg-[#F7F5F0] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-[#EDEAE4] pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#C95745] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Lookbook Studio</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#101B38] mt-1 tracking-tight">
              Catalogue Maker
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-light mt-1 max-w-2xl">
              Curate, arrange, and export customized PDF presentation catalogues with high-resolution imagery, official specifications, and client authorization.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* View Switcher on Mobile/Tablet */}
            <div className="flex lg:hidden bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab("builder")}
                className={`px-3 py-1.5 text-xs font-medium rounded-[2px] transition-colors ${
                  activeTab === "builder" ? "bg-[#101B38] text-white" : "text-[#333333]"
                }`}
              >
                Products &amp; Settings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 text-xs font-medium rounded-[2px] transition-colors ${
                  activeTab === "preview" ? "bg-[#101B38] text-white" : "text-[#333333]"
                }`}
              >
                PDF Preview ({selectedProducts.length + 3} Pages)
              </button>
            </div>

            <button
              type="button"
              onClick={handleCompilePdf}
              disabled={compiling || selectedProducts.length === 0}
              className="bg-[#101B38] text-[#FCFBF8] hover:bg-[#C95745] disabled:opacity-50 disabled:cursor-not-allowed px-5 sm:px-6 py-3 rounded-[2px] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-xs ml-auto md:ml-0"
              title={selectedProducts.length === 0 ? "Select at least 1 product to export" : "Export high-resolution PDF"}
            >
              <Download className="w-4 h-4" />
              <span>{compiling ? (compileProgress || "Generating...") : `Export PDF (${selectedProducts.length + 3} Pages)`}</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {fetchError && (
          <div className="mb-6 p-4 rounded-[2px] bg-red-50 border border-red-200 text-red-800 flex items-center space-x-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{fetchError}</span>
          </div>
        )}

        {/* Progress Modal Overlay during PDF export */}
        {compiling && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FCFBF8] rounded-[2px] p-6 max-w-sm w-full border border-[#EDEAE4] text-center space-y-4 shadow-2xl animate-fade-in">
              <div className="w-12 h-12 border-3 border-[#C95745] border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h3 className="font-serif text-lg font-bold text-[#101B38]">Building PDF Catalogue</h3>
                <p className="text-xs text-[#333333]/80 mt-1 font-sans">{compileProgress}</p>
              </div>
              <span className="text-[10px] text-[#666666] block">Please keep this browser tab open</span>
            </div>
          </div>
        )}

        {/* Main Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Controls, Product Pool, and Selected Queue   */}
          {/* ========================================================= */}
          <div className={`lg:col-span-5 space-y-6 ${activeTab === "preview" ? "hidden lg:block" : "block"}`}>
            
            {/* 1. Catalogue Branding & Client Details */}
            <div className="bg-[#FCFBF8] rounded-[2px] p-5 border border-[#EDEAE4] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDEAE4] pb-3">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-[#C95745]" />
                  <h3 className="font-serif text-sm font-bold text-[#101B38] uppercase tracking-wider">
                    Catalogue Configuration
                  </h3>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C95745]">
                  {selectedProducts.length} Selected
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#101B38] font-semibold block mb-1">Catalogue Title</label>
                  <input
                    type="text"
                    value={catalogTitle}
                    onChange={(e) => setCatalogTitle(e.target.value)}
                    placeholder="e.g. Luxury Porcelain Lookbook"
                    className="w-full bg-white border border-[#DED9D0] rounded-[2px] px-3 py-2 outline-none focus:border-[#101B38] text-[#101B38]"
                  />
                </div>

                <div>
                  <label className="text-[#101B38] font-semibold block mb-1">Client / Project Reference</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Oberoi Penthouse / Villa Project"
                    className="w-full bg-white border border-[#DED9D0] rounded-[2px] px-3 py-2 outline-none focus:border-[#101B38] text-[#101B38]"
                  />
                </div>

                <div>
                  <label className="text-[#101B38] font-semibold block mb-1">Cover Summary Note</label>
                  <textarea
                    rows={2}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Add project brief or introduction..."
                    className="w-full bg-white border border-[#DED9D0] rounded-[2px] px-3 py-2 outline-none focus:border-[#101B38] text-[#101B38] resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[#101B38] font-semibold block mb-1">Visual Theme</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(["minimal", "royal", "dark"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setCatalogTheme(t)}
                          className={`py-1.5 text-[10px] uppercase font-semibold tracking-wider rounded-[2px] border transition-colors cursor-pointer ${
                            catalogTheme === t
                              ? "bg-[#101B38] text-white border-[#101B38]"
                              : "bg-white text-[#333333] border-[#EDEAE4] hover:border-[#101B38]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[#101B38] font-semibold block mb-1">Watermark</label>
                    <label className="flex items-center space-x-2 bg-white border border-[#DED9D0] rounded-[2px] px-2.5 py-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showWatermark}
                        onChange={(e) => setShowWatermark(e.target.checked)}
                        className="accent-[#C95745]"
                      />
                      <span className="text-[11px] text-[#333333]">Brand Stamp</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Product Search & Selection Pool */}
            <div className="bg-[#FCFBF8] rounded-[2px] p-5 border border-[#EDEAE4] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDEAE4] pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-[#C95745]" />
                  <h3 className="font-serif text-sm font-bold text-[#101B38] uppercase tracking-wider">
                    Select Products ({filteredProducts.length} of {safeProducts.length})
                  </h3>
                </div>

                {/* Bulk Controls */}
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAllVisible}
                    disabled={filteredProducts.length === 0}
                    className="text-[11px] font-semibold text-[#101B38] hover:text-[#C95745] transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Select All
                  </button>
                  <span className="text-[#DED9D0]">|</span>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={selectedProducts.length === 0}
                    className="text-[11px] font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by product name or code (e.g. TMX-101)..."
                    className="w-full pl-8 pr-3 py-2 bg-white border border-[#DED9D0] rounded-[2px] text-xs outline-none focus:border-[#101B38] text-[#101B38]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white border border-[#DED9D0] rounded-[2px] px-2 py-1.5 text-[11px] outline-none text-[#333333]"
                  >
                    <option value="ALL">All Categories</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedFinish}
                    onChange={(e) => setSelectedFinish(e.target.value)}
                    className="bg-white border border-[#DED9D0] rounded-[2px] px-2 py-1.5 text-[11px] outline-none text-[#333333]"
                  >
                    <option value="ALL">All Finishes</option>
                    {finishOptions.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Grid Pool */}
              <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2">
                {isLoading ? (
                  <div className="py-12 text-center text-xs text-[#666666]">Loading tile catalogue...</div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-10 text-center text-xs text-[#666666]">
                    No matching products found. Try adjusting your search query or filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                    {filteredProducts.map((p) => {
                      const isSelected = selectedProducts.some((item) => item.id === p.id);
                      const imgSrc = getProductImage(p);

                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleProduct(p)}
                          className={`group relative p-2.5 rounded-[2px] border text-left cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                            isSelected
                              ? "bg-white border-[#C95745] shadow-xs ring-1 ring-[#C95745]"
                              : "bg-white border-[#EDEAE4] hover:border-[#101B38]"
                          }`}
                        >
                          <div>
                            <div className="relative w-full aspect-square bg-[#F7F5F0] rounded-[2px] overflow-hidden mb-2">
                              <img
                                src={imgSrc}
                                alt={p.name}
                                crossOrigin="anonymous"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div
                                className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                  isSelected ? "bg-[#C95745] text-white" : "bg-black/40 text-white"
                                }`}
                              >
                                {isSelected ? <Check className="w-3 h-3 stroke-3" /> : <Plus className="w-3 h-3" />}
                              </div>
                            </div>

                            <span className="text-[11px] font-serif font-bold text-[#101B38] block truncate leading-tight">
                              {p.name}
                            </span>
                            <span className="text-[9.5px] text-[#666666] font-mono block mt-0.5">
                              {p.code || "NO-CODE"}
                            </span>
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-[#F0EDE6] flex items-center justify-between text-[9px] text-[#777777]">
                            <span className="truncate">{p.size || "Standard"}</span>
                            <span className="font-medium text-[#C95745] uppercase">{p.finish ? p.finish.split(",")[0] : ""}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Selected Queue & Reordering */}
            <div className="bg-[#FCFBF8] rounded-[2px] p-5 border border-[#EDEAE4] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDEAE4] pb-3">
                <div className="flex items-center space-x-2">
                  <ListOrdered className="w-4 h-4 text-[#C95745]" />
                  <h3 className="font-serif text-sm font-bold text-[#101B38] uppercase tracking-wider">
                    Catalogue Order ({selectedProducts.length} Items)
                  </h3>
                </div>
                <span className="text-[10px] text-[#666666]">Arrange slides</span>
              </div>

              {selectedProducts.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#777777]">
                  No products selected. Click any tile in the catalogue pool above to add it.
                </div>
              ) : (
                <div className="max-h-[260px] overflow-y-auto pr-1 space-y-1.5">
                  {selectedProducts.map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-[2px] bg-white border border-[#EDEAE4] text-xs hover:border-[#101B38]/40 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <span className="text-[10px] font-mono text-[#999999] w-4 text-center">{idx + 1}</span>
                        <img
                          src={getProductImage(p)}
                          alt={p.name}
                          crossOrigin="anonymous"
                          className="w-7 h-7 object-cover rounded-[1px] border border-[#EDEAE4]"
                        />
                        <div className="truncate">
                          <span className="font-serif font-bold text-[#101B38] block truncate">{p.name}</span>
                          <span className="text-[9px] text-[#666666] font-mono">{p.code}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center space-x-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => moveProduct(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 text-[#666666] hover:text-[#101B38] disabled:opacity-20 cursor-pointer"
                          title="Move slide up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveProduct(idx, "down")}
                          disabled={idx === selectedProducts.length - 1}
                          className="p-1 text-[#666666] hover:text-[#101B38] disabled:opacity-20 cursor-pointer"
                          title="Move slide down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleProduct(p)}
                          className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                          title="Remove from catalogue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Live Interactive A4 Lookbook Preview Canvas */}
          {/* ========================================================= */}
          <div className={`lg:col-span-7 space-y-8 flex flex-col items-center ${activeTab === "builder" ? "hidden lg:flex" : "flex"}`}>
            
            {/* Top Bar Preview Status */}
            <div className="w-full flex items-center justify-between bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-3 text-xs">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-[#C95745]" />
                <span className="font-serif font-bold text-[#101B38] uppercase tracking-wider">
                  Live A4 Lookbook Sheets ({selectedProducts.length + 3} Total Pages)
                </span>
              </div>
              <span className="text-[10px] text-[#666666]">Standard 210mm × 297mm PDF Output</span>
            </div>

            {/* -------------------------------------------------------- */}
            {/* SHEET 1: COVER PAGE                                      */}
            {/* -------------------------------------------------------- */}
            <div
              className={`catalog-page-slide w-full max-w-[794px] min-h-[1123px] rounded-[2px] border shadow-md p-10 sm:p-16 md:p-20 flex flex-col justify-between relative overflow-hidden select-none transition-colors ${
                themeClasses.slideBg
              } ${themeClasses.headerBorder}`}
            >
              {/* Header Bar */}
              <div className={`flex justify-between items-center border-b pb-6 ${themeClasses.headerBorder}`}>
                <div className="flex items-center space-x-3">
                  <img
                    src="/timex-logo.png"
                    alt="Timex Ceramic"
                    crossOrigin="anonymous"
                    className="h-10 w-auto object-contain"
                  />
                  <div>
                    <span className="font-serif text-lg font-bold tracking-wider uppercase block leading-none">
                      TIMEX CERAMIC
                    </span>
                    <span className="text-[9px] tracking-[0.25em] text-[#C95745] uppercase font-sans font-semibold">
                      Architectural Surfaces
                    </span>
                  </div>
                </div>

                <span className="text-[9px] tracking-[0.25em] uppercase font-semibold text-[#C95745] font-sans">
                  Private Lookbook
                </span>
              </div>

              {/* Title Block */}
              <div className="my-auto space-y-6">
                <span className="text-xs font-semibold tracking-[0.25em] text-[#C95745] uppercase block font-sans">
                  Exclusive Surface Presentation
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  {catalogTitle || "Timex Ceramic Curated Portfolio"}
                </h2>
                <div className="w-20 h-1 bg-[#C95745]" />
                <p className={`text-sm sm:text-base font-light leading-relaxed max-w-xl ${themeClasses.subText}`}>
                  {coverNote}
                </p>
              </div>

              {/* Cover Footer Details */}
              <div className={`border-t pt-8 flex justify-between items-end text-xs font-light ${themeClasses.headerBorder}`}>
                <div>
                  <p className={`font-semibold uppercase tracking-wider text-[10px] ${themeClasses.accentText}`}>Prepared Exclusively For</p>
                  <p className="mt-1 font-serif text-base sm:text-lg font-bold">{clientName || "Valued Client"}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px]">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  <p className="mt-1 text-[11px] font-semibold tracking-wider">Timex Ceramic Studio, Mumbai</p>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* SHEET 2: TABLE OF CONTENTS INDEX                         */}
            {/* -------------------------------------------------------- */}
            <div
              className={`catalog-page-slide w-full max-w-[794px] min-h-[1123px] rounded-[2px] border shadow-md p-10 sm:p-16 md:p-20 flex flex-col justify-between relative overflow-hidden select-none transition-colors ${
                themeClasses.slideBg
              } ${themeClasses.headerBorder}`}
            >
              <div className={`flex justify-between items-center border-b pb-6 ${themeClasses.headerBorder}`}>
                <div className="flex items-center space-x-2">
                  <img src="/timex-logo.png" alt="Timex Logo" crossOrigin="anonymous" className="h-7 w-auto object-contain" />
                  <span className="font-serif text-sm font-bold tracking-wider uppercase">TIMEX CERAMIC</span>
                </div>
                <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#C95745]">Index</span>
              </div>

              <div className="my-auto space-y-8">
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C95745] uppercase block font-sans">
                    Catalogue Structure
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1">Table of Contents</h3>
                </div>

                <div className="space-y-3 text-xs sm:text-sm font-light max-w-xl">
                  <div className={`flex justify-between border-b pb-2 ${themeClasses.specRow}`}>
                    <span className="font-semibold">1. Title &amp; Presentation Overview</span>
                    <span className="font-mono text-xs">Page 1</span>
                  </div>
                  <div className={`flex justify-between border-b pb-2 ${themeClasses.specRow}`}>
                    <span className="font-semibold">2. Table of Contents &amp; Index</span>
                    <span className="font-mono text-xs">Page 2</span>
                  </div>
                  {selectedProducts.map((p, index) => (
                    <div key={p.id} className={`flex justify-between border-b pb-2 ${themeClasses.specRow}`}>
                      <span className="font-semibold truncate mr-4">
                        {index + 3}. {p.name} {p.code ? `(${p.code})` : ""}
                      </span>
                      <span className="font-mono text-xs shrink-0">Page {index + 3}</span>
                    </div>
                  ))}
                  <div className={`flex justify-between border-b pb-2 ${themeClasses.specRow}`}>
                    <span className="font-semibold">
                      {selectedProducts.length + 3}. Quality Endorsement &amp; Sign-off
                    </span>
                    <span className="font-mono text-xs">Page {selectedProducts.length + 3}</span>
                  </div>
                </div>
              </div>

              <div className={`flex justify-between items-center text-[10px] border-t pt-4 ${themeClasses.headerBorder} ${themeClasses.subText}`}>
                <span>Timex Ceramic Premium Imported Tile Portfolio</span>
                <span>Page 2</span>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* SHEET 3+: INDIVIDUAL PRODUCT SPECIFICATION PAGES         */}
            {/* -------------------------------------------------------- */}
            {selectedProducts.map((p, index) => {
              const imgSrc = getProductImage(p);
              const specs = getProductSpecs(p);

              return (
                <div
                  key={p.id}
                  className={`catalog-page-slide w-full max-w-[794px] min-h-[1123px] rounded-[2px] border shadow-md p-10 sm:p-14 md:p-16 flex flex-col justify-between relative overflow-hidden select-none transition-colors ${
                    themeClasses.slideBg
                  } ${themeClasses.headerBorder}`}
                >
                  {/* Top Bar */}
                  <div className={`flex justify-between items-center border-b pb-4 ${themeClasses.headerBorder}`}>
                    <div className="flex items-center space-x-2">
                      <img src="/timex-logo.png" alt="Timex" crossOrigin="anonymous" className="h-6 w-auto object-contain" />
                      <span className="font-serif text-xs font-bold tracking-wide uppercase truncate max-w-[280px]">
                        {catalogTitle || "Timex Ceramic"}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono tracking-widest uppercase font-semibold text-[#C95745]">
                      Slide {index + 3} of {selectedProducts.length + 3}
                    </span>
                  </div>

                  {/* Main Product Layout: Image Top/Left, Specs Right */}
                  <div className="my-auto space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      {/* Product Visual */}
                      <div className="md:col-span-6 space-y-3">
                        <div className="relative aspect-square w-full rounded-[2px] overflow-hidden bg-neutral-100 border border-[#EDEAE4] shadow-xs">
                          <img
                            src={imgSrc}
                            alt={p.name}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-semibold px-2.5 py-1 rounded-[2px] bg-[#C95745] text-white">
                            CODE: {p.code || "TMX-CERAMIC"}
                          </span>
                          {p.sku && (
                            <span className="text-[10px] text-[#666666] font-mono">
                              SKU: {p.sku}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Specifications Block */}
                      <div className="md:col-span-6 space-y-4">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C95745] block font-sans">
                            {p.category_name || p.category || "Tile Surface"}
                          </span>
                          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mt-0.5">
                            {p.name}
                          </h3>
                        </div>

                        {/* Specs Table */}
                        <div className="space-y-1.5 text-xs font-light">
                          {specs.map((s) => (
                            <div key={s.label} className={`flex justify-between border-b pb-1.5 ${themeClasses.specRow}`}>
                              <span className={`font-semibold ${themeClasses.specLabel}`}>{s.label}:</span>
                              <span className="font-medium text-right ml-4">{s.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Architect / Project Notes Input */}
                        <div className="pt-2">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-[#C95745] block mb-1">
                            Architect / Project Specification Notes:
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Add notes for this product (e.g. Master bathroom accent wall, 2mm spacer recommended)..."
                            value={productNotes[p.id] || ""}
                            onChange={(e) => setProductNotes({ ...productNotes, [p.id]: e.target.value })}
                            className="w-full bg-white/70 border border-[#DED9D0] rounded-[2px] p-2 text-xs outline-none focus:border-[#101B38] text-[#101B38] resize-none font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sheet Footer */}
                  <div className={`flex items-center justify-between border-t pt-4 text-[10px] ${themeClasses.headerBorder} ${themeClasses.subText}`}>
                    {showWatermark ? (
                      <span className="tracking-[0.2em] uppercase font-semibold text-[#C95745]">
                        TIMEX CERAMIC PRO • FOR CLIENT PRESENTATION ONLY
                      </span>
                    ) : (
                      <span>Timex Ceramic Architectural Portfolio</span>
                    )}

                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => toggleProduct(p)}
                        className="text-red-500 hover:text-red-700 flex items-center space-x-1 cursor-pointer"
                        title="Remove slide"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Slide</span>
                      </button>
                      <span className="font-mono">Page {index + 3}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* -------------------------------------------------------- */}
            {/* SHEET LAST: SIGN-OFF & BRAND AUTHORIZATION               */}
            {/* -------------------------------------------------------- */}
            <div
              className={`catalog-page-slide w-full max-w-[794px] min-h-[1123px] rounded-[2px] border shadow-md p-10 sm:p-16 md:p-20 flex flex-col justify-between relative overflow-hidden select-none transition-colors ${
                themeClasses.slideBg
              } ${themeClasses.headerBorder}`}
            >
              <div className={`flex justify-between items-center border-b pb-6 ${themeClasses.headerBorder}`}>
                <div className="flex items-center space-x-2">
                  <img src="/timex-logo.png" alt="Timex Logo" crossOrigin="anonymous" className="h-8 w-auto object-contain" />
                  <span className="font-serif text-sm font-bold tracking-wider uppercase">TIMEX CERAMIC</span>
                </div>
                <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#C95745]">Sign-off</span>
              </div>

              <div className="my-auto space-y-10">
                <div className="space-y-3">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C95745] uppercase block font-sans">
                    Official Endorsement
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold">Project Authorization &amp; Warranty</h3>
                  <p className={`text-xs sm:text-sm font-light leading-relaxed max-w-lg ${themeClasses.subText}`}>
                    All vitrified slabs, porcelain surfaces, and designer tiles featured in this lookbook are authorized specifications supplied by Timex Ceramic. Natural shade and calibre variations are inherent to fired ceramics. Please verify batch numbers and dry-lay tiles prior to installation.
                  </p>
                </div>

                {/* Digital Signature Box */}
                <div className="space-y-3 max-w-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C95745] block">
                    Architect / Client Approval Signature:
                  </span>

                  {sigSaved && sigDataUrl ? (
                    <div className="border border-dashed border-[#C95745] rounded-[2px] p-4 bg-white/50 h-32 flex items-center justify-center relative">
                      <img src={sigDataUrl} alt="Signature" className="max-h-full object-contain" />
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="absolute bottom-2 right-2 text-[10px] font-bold uppercase tracking-wider text-[#C95745] underline cursor-pointer"
                      >
                        Re-sign
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <canvas
                        ref={sigCanvasRef}
                        width={440}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={endDrawing}
                        onMouseLeave={endDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={endDrawing}
                        className="border border-[#DED9D0] rounded-[2px] bg-white w-full cursor-crosshair touch-none h-[120px]"
                      />
                      <div className="flex space-x-2 text-[11px]">
                        <button
                          type="button"
                          onClick={saveSignature}
                          className="bg-[#101B38] text-white hover:bg-[#C95745] px-4 py-1.5 rounded-[2px] font-medium transition-colors cursor-pointer"
                        >
                          Lock Signature
                        </button>
                        <button
                          type="button"
                          onClick={clearSignature}
                          className="bg-neutral-200 text-[#333333] hover:bg-neutral-300 px-4 py-1.5 rounded-[2px] transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Corporate Address & Support */}
                <div className={`border-t pt-6 grid grid-cols-2 gap-4 text-xs font-light ${themeClasses.headerBorder}`}>
                  <div>
                    <p className="font-semibold text-[#101B38]">Headquarters</p>
                    <p className="text-[11px] mt-0.5 text-[#555555]">402, Pratik Avenue, Nehru Road, Vile Parle (E), Mumbai - 400057</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#101B38]">Direct Contact</p>
                    <p className="text-[11px] mt-0.5 text-[#555555]">Phone: +91 22 2612 2960 | info@timexceramic.com</p>
                  </div>
                </div>
              </div>

              <div className={`flex justify-between items-center text-[10px] border-t pt-4 ${themeClasses.headerBorder} ${themeClasses.subText}`}>
                <span>Timex Ceramic Architectural Network</span>
                <span>Page {selectedProducts.length + 3}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
