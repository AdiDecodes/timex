"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  PackageSearch,
} from "lucide-react";
import { matchProductSearch } from "@/services/product";
import { resolveProductImage } from "@/utils/productImages";
import { resolveProductCollection } from "@/utils/productCollection";
import { TileOfSpainBadge } from "@/components/product/TileOfSpainBadge";

interface ProductSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SUGGESTIONS = [
  "Marble",
  "Subway",
  "Moroccan",
  "Wooden",
  "Stone",
  "Hexagon",
  "Metallic",
  "Brick",
  "Modular",
  "Porcelain",
  "Large Format",
  "Bathroom Tiles",
];

export function ProductSearchOverlay({ isOpen, onClose }: ProductSearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 1. Fetch full product catalog from API on open (or pre-warm once)
  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;

    async function loadProducts() {
      if (hasLoaded && allProducts.length > 0) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/products?activeOnly=true&_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (isSubscribed && Array.isArray(data.products)) {
            // Filter out trashed & draft/inactive items
            const active = data.products.filter(
              (p: any) =>
                !p.is_trashed &&
                !p.isTrashed &&
                p.isActive !== false &&
                p.is_active !== false &&
                p.status !== "Inactive"
            );
            setAllProducts(active);
            setHasLoaded(true);
          }
        }
      } catch (err) {
        console.warn("Notice loading dynamic products for search:", err);
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    }

    loadProducts();

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, hasLoaded, allProducts.length]);

  // 2. Lock body scroll and focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Focus input with slight delay for animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
      };
    } else {
      setQuery("");
    }
  }, [isOpen, onClose]);

  // 3. Dynamic client filtering whenever query or allProducts change
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setFilteredProducts([]);
      return;
    }

    startTransition(() => {
      const results = allProducts.filter((p) => matchProductSearch(p, trimmed));
      setFilteredProducts(results);
    });
  }, [query, allProducts]);

  // 4. Handle suggestion click
  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  // 5. Handle clear input
  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  // 6. Handle product click navigation
  const handleProductSelect = (slug: string) => {
    onClose();
    router.push(`/product/${slug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product Search"
          className="fixed inset-0 z-[100] flex flex-col justify-start items-center bg-black/60 backdrop-blur-md overflow-hidden"
        >
          {/* Backdrop Click Dismiss */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Search Modal Window */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl mx-auto my-0 md:my-8 bg-[#FCFBF8] border-b md:border border-[#EDEAE4] md:rounded-lg shadow-2xl flex flex-col max-h-[100vh] md:max-h-[90vh] overflow-hidden"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 md:px-7 py-4 md:py-5 border-b border-[#EDEAE4] bg-[#FCFBF8] gap-3">
              <Search className="w-5 h-5 md:w-6 md:h-6 text-[#C95745] flex-shrink-0" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tiles by name, series, category, code, or keyword..."
                aria-label="Search tiles"
                className="w-full bg-transparent text-[#101B38] placeholder-[#888888] text-base md:text-xl font-medium focus:outline-none tracking-normal"
              />

              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear search query"
                  className="p-1.5 text-[#888888] hover:text-[#101B38] hover:bg-[#EDEAE4]/60 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close search overlay"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#101B38] bg-[#EDEAE4]/70 hover:bg-[#C95745] hover:text-[#FCFBF8] rounded-md transition-all duration-200 cursor-pointer ml-1 flex-shrink-0"
              >
                <span>Close</span>
                <span className="hidden md:inline-block text-[10px] opacity-70 bg-black/10 px-1.5 py-0.5 rounded">
                  ESC
                </span>
              </button>
            </div>

            {/* Subheader / Status Bar */}
            <div className="px-4 md:px-7 py-2.5 bg-[#F7F5F0] border-b border-[#EDEAE4] flex items-center justify-between text-xs text-[#333333]">
              <div className="flex items-center gap-2">
                {query.trim() ? (
                  <span>
                    Found{" "}
                    <strong className="text-[#101B38] font-bold">
                      {filteredProducts.length}
                    </strong>{" "}
                    {filteredProducts.length === 1 ? "tile" : "tiles"} matching &ldquo;
                    <span className="text-[#C95745] font-semibold">{query.trim()}</span>
                    &rdquo;
                  </span>
                ) : (
                  <span className="text-[#666666]">
                    Browse catalog or explore popular collections below:
                  </span>
                )}
              </div>

              {isLoading && (
                <span className="flex items-center gap-1.5 text-[#C95745] text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#C95745] animate-ping" />
                  Syncing catalog...
                </span>
              )}
            </div>

            {/* Modal Body / Results / Suggestions */}
            <div className="flex-1 overflow-y-auto p-4 md:p-7 space-y-6">
              {/* State A: Query is Empty - Show Popular Suggestions & Quick Links */}
              {!query.trim() && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase text-[#101B38] mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C95745]" />
                      Popular Searches & Collections
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SUGGESTIONS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleSuggestionClick(tag)}
                          className="px-3.5 py-1.5 bg-[#EDEAE4]/60 hover:bg-[#101B38] hover:text-[#FCFBF8] text-[#101B38] text-xs font-medium rounded-full transition-all duration-200 cursor-pointer border border-[#EDEAE4]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-[#F7F5F0] border border-[#EDEAE4] rounded-lg">
                    <p className="text-xs text-[#666666] leading-relaxed">
                      <strong className="text-[#101B38] font-semibold">Search Tip:</strong> You
                      can search by <span className="text-[#101B38] font-medium">Product Name</span>{" "}
                      (e.g., <em>Rusty Metal</em>, <em>Veranda</em>),{" "}
                      <span className="text-[#101B38] font-medium">Series / Collection</span> (e.g.,{" "}
                      <em>Marble Collection</em>, <em>Moroccan</em>),{" "}
                      <span className="text-[#101B38] font-medium">Tile Code</span> (e.g.,{" "}
                      <em>TMX-589</em>), or surface finish and space.
                    </p>
                  </div>
                </div>
              )}

              {/* State B: Query is Active and Has Matches */}
              {query.trim() && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {filteredProducts.map((product) => {
                    const collectionInfo = resolveProductCollection(product);
                    const collectionName = collectionInfo.name;
                    const rawImage =
                      Array.isArray(product.images) && product.images.length > 0
                        ? product.images[0]
                        : product.thumbnail || "";
                    const displayImage = resolveProductImage(
                      rawImage,
                      product.categoryId || product.category_id,
                      0
                    );

                    const categoryName =
                      product.category || product.category_name || "Vitrified Tiles";
                    const isNew = Boolean(product.isNewArrival || product.is_new_arrival);
                    const showSpain = Boolean(
                      product.showTileOfSpainBadge || product.show_tile_of_spain_badge
                    );

                    return (
                      <div
                        key={product.id || product.slug}
                        onClick={() => handleProductSelect(product.slug)}
                        className="group flex flex-col bg-white border border-[#EDEAE4] hover:border-[#C95745]/60 rounded-[3px] overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer relative"
                      >
                        {/* Image Thumbnail */}
                        <div className="relative aspect-[4/3] w-full bg-[#EDEAE4]/40 overflow-hidden">
                          <Image
                            src={displayImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />

                          {/* Subtle hover gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Spain Badge */}
                          {showSpain && (
                            <div className="absolute top-2.5 left-2.5 z-10">
                              <TileOfSpainBadge size="sm" />
                            </div>
                          )}

                          {/* New Arrival Badge */}
                          {isNew && (
                            <div className="absolute top-2.5 right-2.5 z-10">
                              <span className="bg-[#C95745] text-white text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] shadow-xs">
                                New Arrival
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                          <div>
                            {/* Badges / Taxonomy */}
                            <div className="flex items-center gap-1.5 flex-wrap text-[10px] uppercase tracking-wider font-semibold text-[#888888] mb-1">
                              <span className="text-[#C95745]">{collectionName}</span>
                              {categoryName && (
                                <>
                                  <span>•</span>
                                  <span>{categoryName}</span>
                                </>
                              )}
                            </div>

                            {/* Product Title */}
                            <h4 className="font-serif text-base md:text-lg font-bold text-[#101B38] group-hover:text-[#C95745] transition-colors line-clamp-1">
                              {product.name}
                            </h4>

                            {/* Code / Specs */}
                            <div className="flex items-center gap-2 text-xs text-[#666666] mt-1">
                              {product.code && (
                                <span className="font-mono text-[11px] bg-[#EDEAE4]/50 px-1.5 py-0.5 rounded">
                                  {product.code}
                                </span>
                              )}
                              {product.size && (
                                <span className="truncate">{product.size}</span>
                              )}
                              {product.finish && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{product.finish}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Card Footer Link */}
                          <div className="pt-2 border-t border-[#EDEAE4]/60 flex items-center justify-between text-xs font-semibold text-[#101B38] group-hover:text-[#C95745] transition-colors">
                            <span>View Tile Details</span>
                            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* State C: Query is Active and Has NO Matches */}
              {query.trim() && filteredProducts.length === 0 && (
                <div className="py-12 px-4 text-center max-w-lg mx-auto flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#EDEAE4]/70 flex items-center justify-center text-[#C95745] mb-4">
                    <PackageSearch className="w-8 h-8" />
                  </div>

                  <h3 className="font-serif text-xl md:text-2xl font-bold text-[#101B38] mb-2">
                    No Tiles Found
                  </h3>

                  <p className="text-xs md:text-sm text-[#666666] leading-relaxed mb-6">
                    We couldn&apos;t find any ceramic tiles or slabs matching &ldquo;
                    <span className="text-[#101B38] font-medium">{query.trim()}</span>&rdquo;. Try
                    checking for typos or searching by collection (e.g., <em>Marble</em>,{" "}
                    <em>Subway</em>, <em>Moroccan</em>) or material.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-4 py-2 bg-[#101B38] text-white text-xs font-semibold rounded hover:bg-[#C95745] transition-colors cursor-pointer"
                    >
                      Clear Search
                    </button>
                    <Link
                      href="/world-of-tiles"
                      onClick={onClose}
                      className="px-4 py-2 border border-[#101B38] text-[#101B38] text-xs font-semibold rounded hover:bg-[#EDEAE4] transition-colors"
                    >
                      Browse World of Tiles
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 md:px-7 py-3 bg-[#F7F5F0] border-t border-[#EDEAE4] flex items-center justify-between text-xs text-[#888888]">
              <span className="hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 bg-white border border-[#EDEAE4] rounded text-[10px] text-[#333333] font-mono">ESC</kbd> to exit search
              </span>
              <Link
                href="/world-of-tiles"
                onClick={onClose}
                className="text-xs font-bold text-[#C95745] hover:underline flex items-center gap-1 ml-auto"
              >
                <span>Explore All Collections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

