"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Copy,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import { ProductItem } from "@/types/admin";
import { ProductEditorModal } from "./ProductEditorModal";
import { ProductTagsManagerModal, TagType } from "./ProductTagsManagerModal";

const API_BASE = "/api/v1";

const CATEGORIES = [
  { id: "brick", name: "Brick Look", slug: "brick" },
  { id: "stone", name: "Stone Look", slug: "stone" },
  { id: "wooden", name: "Wooden Look", slug: "wooden" },
  { id: "tropical", name: "Tropical / Floral", slug: "tropical" },
  { id: "mosaic", name: "Mosaic Tiles", slug: "mosaic" },
  { id: "marble", name: "Marble Look", slug: "marble" },
  { id: "subway", name: "Subway Tiles", slug: "subway" },
  { id: "texture", name: "Texture / 3D", slug: "texture" },
  { id: "metallic", name: "Metallic Finish", slug: "metallic" },
  { id: "boutique", name: "Boutique Tiles", slug: "boutique" },
  { id: "hexagon", name: "Hexagon Tiles", slug: "hexagon" },
  { id: "moroccan", name: "Moroccan Tiles", slug: "moroccan" },
  { id: "colorful", name: "Colorful Tiles", slug: "colorful" },
  { id: "highlighter", name: "Highlighter Tiles", slug: "highlighter" },
  { id: "french-frames", name: "French Frames", slug: "french-frames" },
  { id: "modular", name: "Modular Tiles", slug: "modular" },
  { id: "octagonal", name: "Octagonal Tiles", slug: "octagonal" },
  { id: "terrazzo", name: "Terrazzo Pattern", slug: "terrazzo" },
  { id: "white", name: "White / Plain", slug: "white" },
  { id: "fabric", name: "Fabric Texture", slug: "fabric" },
  { id: "geometric", name: "Geometric Pattern", slug: "geometric" },
];

export function ProductsManagerClient() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [tagFilter, setTagFilter] = useState("ALL");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, tagFilter, pageSize]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  // Tags Management Modal state
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [tagsModalInitialTag, setTagsModalInitialTag] = useState<TagType>("NEW_ARRIVAL");

  const handleOpenTagsModal = (tag: TagType = "NEW_ARRIVAL") => {
    setTagsModalInitialTag(tag);
    setIsTagsModalOpen(true);
  };

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let res = await fetch(`${API_BASE}/products?includeInactive=true&_t=${Date.now()}`);
      if (!res.ok) {
        res = await fetch(`/api/products?includeInactive=true&_t=${Date.now()}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleSave = async (productData: Partial<ProductItem>) => {
    if (!productData.name || !productData.name.trim()) {
      throw new Error("Please enter a product name.");
    }

    setFormSaving(true);
    try {
      const isEdit = Boolean(editingProduct?.id);
      const url = isEdit ? `${API_BASE}/products/${editingProduct?.id}` : `${API_BASE}/products`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const data = await res.json();

      if (data.success && data.product) {
        showToast(isEdit ? "Product updated successfully!" : "New product added successfully!");
        setEditingProduct(data.product);

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("product-updated", { detail: data.product }));
          try {
            localStorage.setItem("timex_products_updated", Date.now().toString());
          } catch (_) {}
        }

        setProducts((prev) => {
          if (isEdit) {
            return prev.map((p) => (p.id === data.product.id ? data.product : p));
          } else {
            return [data.product, ...prev];
          }
        });

        return data.product;
      } else {
        throw new Error(data.error || "Failed to save product.");
      }
    } finally {
      setFormSaving(false);
    }
  };

  const handleDuplicate = async (p: ProductItem) => {
    try {
      showToast(`Duplicating "${p.name}"...`);
      const res = await fetch(`${API_BASE}/products/${p.id}/duplicate`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.product) {
        showToast(`"${p.name}" duplicated successfully!`);
        setProducts((prev) => [data.product, ...prev]);
        handleOpenEdit(data.product);
      } else {
        // Fallback: client-side clone via handleSave
        const cloned: Partial<ProductItem> = {
          ...p,
          id: undefined,
          name: `${p.name} (Copy)`,
          slug: `${p.slug}-copy-${Date.now().toString(36).slice(-4)}`,
        };
        const saved = await handleSave(cloned);
        if (saved) {
          handleOpenEdit(saved);
        }
      }
    } catch (err: any) {
      showToast(`Error duplicating: ${err.message}`);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const { id, name } = productToDelete;
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Product "${name}" moved to Recycle Bin.`);
        setProducts((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
      } else {
        alert(data.error || "Failed to move product to trash.");
      }
    } catch (err: any) {
      alert(`Error deleting product: ${err.message}`);
    } finally {
      setProductToDelete(null);
    }
  };

  const handleExportExcel = async () => {
    try {
      showToast("Generating Excel report...");
      const XLSX = await import("xlsx");
      const exportData = filteredProducts.map((p) => ({
        ID: p.id,
        Name: p.name,
        Category: p.category || p.category_name,
        AdditionalCategories: (p.secondaryCategories || p.secondary_categories || []).join(", "),
        Subcategories: (p.subcategories || []).join(", "),
        Slug: p.slug,
        Size: p.size || "150mm X 450mm",
        Finish: p.finish?.trim().toLowerCase() === "matte" ? "Matt" : (p.finish || "Shiny"),
        Material: p.material || "Porcelain",
        NewArrival: p.isNewArrival || p.is_new_arrival ? "YES" : "NO",
        TileOfSpain: (p.showTileOfSpainBadge || p.show_tile_of_spain_badge) ? "YES" : "NO",
        Status: p.isActive !== false && p.is_active !== false ? "Active" : "Inactive",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      XLSX.writeFile(workbook, `Timex_Ceramic_Products_${new Date().toISOString().split("T")[0]}.xlsx`);
      showToast("Downloaded Excel report of products catalogue!");
    } catch (err: any) {
      showToast(`Excel export error: ${err.message}`);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const categoryObj = CATEGORIES.find((c) => c.id === categoryFilter);
      const categoryName = categoryObj ? categoryObj.name.toLowerCase() : "";
      const categorySlug = categoryFilter.toLowerCase();

      const secondaryList = [
        ...(Array.isArray(p.secondaryCategories) ? p.secondaryCategories : []),
        ...(Array.isArray(p.secondary_categories) ? p.secondary_categories : []),
        ...(Array.isArray(p.subcategories) ? p.subcategories : []),
      ].map((s) => String(s).toLowerCase());

      const matchesCategory =
        categoryFilter === "ALL" ||
        p.category_id === categoryFilter ||
        p.categoryId === categoryFilter ||
        p.category_name?.toLowerCase() === categorySlug ||
        p.category?.toLowerCase() === categorySlug ||
        p.category_name?.toLowerCase() === categoryName ||
        p.category?.toLowerCase() === categoryName ||
        secondaryList.includes(categorySlug) ||
        secondaryList.includes(categoryName);

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);

      const isNew = Boolean(p.isNewArrival || p.is_new_arrival);
      const isSpain = Boolean(p.showTileOfSpainBadge || p.show_tile_of_spain_badge);

      const matchesTag =
        tagFilter === "ALL" ||
        (tagFilter === "NEW" && isNew) ||
        (tagFilter === "NEW_ARRIVAL" && isNew) ||
        (tagFilter === "TILE_OF_SPAIN" && isSpain) ||
        (tagFilter === "REGULAR" && !isNew && !isSpain);

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [products, categoryFilter, tagFilter, search]);

  const totalFiltered = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalFiltered);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, startIndex, endIndex]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#c5a880] text-black text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/10 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-white">Move Product to Recycle Bin</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to move product <strong>"{productToDelete.name}"</strong> to the Recycle Bin? It will be hidden from the public store and can be restored at any time.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg"
              >
                Move to Recycle Bin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Editor Modal */}
      {isModalOpen && (
        <ProductEditorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          editingProduct={editingProduct}
          saving={formSaving}
        />
      )}

      {/* Product Tags Management Modal (Bulk Assignment) */}
      {isTagsModalOpen && (
        <ProductTagsManagerModal
          isOpen={isTagsModalOpen}
          onClose={() => setIsTagsModalOpen(false)}
          initialTag={tagsModalInitialTag}
          products={products}
          onSaved={async () => {
            await fetchProducts();
            showToast("Product tags updated successfully!");
          }}
        />
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Products Management</h2>
          <p className="text-xs text-gray-400">Manage tile surfaces, dimensions, finishes, packaging, and color swatches.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            title="Reload products"
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors cursor-pointer border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#c5a880]" : ""}`} />
          </button>

          <button
            onClick={() => handleOpenTagsModal(tagFilter === "TILE_OF_SPAIN" ? "TILE_OF_SPAIN" : "NEW_ARRIVAL")}
            title="Manage Product Tags (Bulk Assignment & Removal)"
            className="flex items-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 text-amber-300 rounded-xl transition-colors cursor-pointer border border-amber-500/20 text-xs font-semibold"
          >
            <Tag className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Manage Tags</span>
          </button>

          <button
            onClick={handleExportExcel}
            title="Export to Excel"
            className="flex items-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors cursor-pointer border border-white/10 text-xs font-semibold"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#c5a880]/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-[#111827] border border-white/10 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or slug..."
            className="w-full pl-10 pr-4 py-2 bg-[#090d16] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
          >
            <option value="ALL">All Categories ({products.length})</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
          >
            <option value="ALL">All Product Tags</option>
            <option value="NEW">✨ New Arrival</option>
            <option value="TILE_OF_SPAIN">🇪🇸 Tile of Spain</option>
            <option value="REGULAR">Regular (No Tags)</option>
          </select>

          {tagFilter !== "ALL" && tagFilter !== "REGULAR" && (
            <button
              onClick={() => handleOpenTagsModal(tagFilter === "TILE_OF_SPAIN" ? "TILE_OF_SPAIN" : "NEW_ARRIVAL")}
              title={`Manage products in ${tagFilter === "TILE_OF_SPAIN" ? "Tile of Spain" : "New Arrival"}`}
              className="px-2.5 py-1.5 bg-[#c5a880]/15 hover:bg-[#c5a880]/25 text-[#c5a880] border border-[#c5a880]/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Tag className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Edit This Tag</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <div className="w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs">Loading product catalogue...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <Package className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-sm font-medium text-gray-300">No products match your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c1220] border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3.5">Product</th>
                  <th className="px-4 py-3.5">Category / Collection</th>
                  <th className="px-4 py-3.5">Slug</th>
                  <th className="px-4 py-3.5 text-center">Tags / Badges</th>
                  <th className="px-4 py-3.5">Size & Finish</th>
                  <th className="px-4 py-3.5">Material</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedProducts.map((p) => {
                  const mainImage =
                    Array.isArray(p.images) && p.images.length > 0
                      ? p.images[0]
                      : "https://www.timexceramic.com/wp-content/uploads/2025/08/timex-ceramic-harlem-series-blue-wall-and-floor-tiles-shiny-finish-tiles-ambience.jpg";
                  const thumbUrl = mainImage.includes("/uploads/")
                    ? `/api/v1/media/thumbnail/${encodeURIComponent(mainImage.split("/").pop() || "")}?w=96`
                    : mainImage;
                  const isActive = p.isActive !== false && p.is_active !== false;

                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0 relative">
                            <img
                              src={thumbUrl}
                              alt={p.name}
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                if (e.currentTarget.src !== mainImage) {
                                  e.currentTarget.src = mainImage;
                                }
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs group-hover:text-[#c5a880] transition-colors">{p.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-300 font-medium">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-semibold text-white">
                            {p.category || p.category_name || "Brick"}
                          </span>
                          {((p.secondaryCategories && p.secondaryCategories.length > 0) ||
                            (p.secondary_categories && p.secondary_categories.length > 0)) && (
                            <div className="flex flex-wrap gap-1">
                              {Array.from(
                                new Set([
                                  ...(p.secondaryCategories || []),
                                  ...(p.secondary_categories || []),
                                ])
                              ).map((sec, idx) => {
                                const matched = CATEGORIES.find(
                                  (c) => c.id === sec || c.name.toLowerCase() === sec.toLowerCase()
                                );
                                const label = matched ? matched.name : sec;
                                return (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                    title={`Additional category: ${label}`}
                                  >
                                    +{label}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          {p.subcategories && p.subcategories.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {p.subcategories.map((sub, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                  title={`Subcategory: ${sub}`}
                                >
                                  {sub}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-[#c5a880]">
                        /product/{p.slug}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {Boolean(p.isNewArrival || p.is_new_arrival) && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[#C95745]/20 text-[#C95745] border border-[#C95745]/30 whitespace-nowrap shadow-2xs">
                              NEW
                            </span>
                          )}
                          {Boolean(p.showTileOfSpainBadge || p.show_tile_of_spain_badge) && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-600/20 text-red-400 border border-red-500/30 whitespace-nowrap shadow-2xs">
                              SPAIN
                            </span>
                          )}
                          {!Boolean(p.isNewArrival || p.is_new_arrival) && !Boolean(p.showTileOfSpainBadge || p.show_tile_of_spain_badge) && (
                            <span className="text-[11px] text-gray-500 font-medium">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-300">
                        <div>{p.size || "150mm X 450mm"}</div>
                        <div className="text-[10px] text-gray-500">{p.finish?.trim().toLowerCase() === "matte" ? "Matt" : (p.finish || "Shiny")}</div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-300">
                        {p.material || "Porcelain"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            title="View Product Page"
                            className="p-1.5 text-gray-400 hover:text-[#c5a880] hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Product"
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p)}
                            title="Duplicate Product (Clone)"
                            className="p-1.5 text-gray-400 hover:text-[#c5a880] hover:bg-[#c5a880]/15 rounded-lg transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete({ id: p.id, name: p.name })}
                            title="Delete Product"
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls Bar */}
            {totalFiltered > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-[#0c1220] border-t border-white/10 text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <span>
                    Showing <strong className="text-white font-semibold">{startIndex + 1}</strong> to{" "}
                    <strong className="text-white font-semibold">{endIndex}</strong> of{" "}
                    <strong className="text-white font-semibold">{totalFiltered}</strong> products
                  </span>
                  <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
                    <span className="text-[11px] text-gray-400">Per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="bg-[#090d16] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                    >
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return page === 1 || page === totalPages || Math.abs(page - safeCurrentPage) <= 2;
                      })
                      .map((page, idx, arr) => {
                        const prevPage = arr[idx - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;
                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && <span className="px-1 text-gray-500">...</span>}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                page === safeCurrentPage
                                  ? "bg-[#c5a880] text-black font-bold"
                                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
