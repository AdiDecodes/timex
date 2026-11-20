"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Heart, 
  Trash2, 
  RefreshCw, 
  Eye, 
  ShoppingBag, 
  X, 
  Check 
} from "lucide-react";
import { useWishlist } from "@/store/useWishlist";
import { useCompare } from "@/store/useCompare";
import { MOCK_PRODUCTS } from "@/data/products";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { resolveProductImage } from "@/utils/productImages";
import { resolveProductCollection } from "@/utils/productCollection";
import { TileOfSpainBadge } from "@/components/product/TileOfSpainBadge";

export function WishlistClient() {
  const [mounted, setMounted] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>(MOCK_PRODUCTS);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const wishlist = useWishlist();
  const compare = useCompare();

  useEffect(() => {
    setMounted(true);
    let isCancelled = false;

    fetch("/api/v1/products?_t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data.products && Array.isArray(data.products)) {
          const productMap = new Map<string, any>();
          MOCK_PRODUCTS.forEach((p) => {
            if (p.id) productMap.set(p.id, p);
            if (p.slug) productMap.set(p.slug, p);
          });
          data.products.forEach((p: any) => {
            if (p.id) productMap.set(p.id, p);
            if (p.slug) productMap.set(p.slug, p);
          });
          setAllProducts(Array.from(new Set(Array.from(productMap.values()))));
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch live products for wishlist, falling back to mock:", err);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Fetch any missing individual products if not present in allProducts
  useEffect(() => {
    if (!mounted || wishlist.items.length === 0) return;
    const missingIds = wishlist.items.filter(
      (id) => !allProducts.some((p) => p.id === id || p.slug === id)
    );
    if (missingIds.length === 0) return;

    missingIds.forEach((missingId) => {
      fetch(`/api/v1/products/${missingId}?_t=` + Date.now())
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.product) {
            setAllProducts((prev) => {
              if (prev.some((p) => p.id === data.product.id || p.slug === data.product.slug)) {
                return prev;
              }
              return [...prev, data.product];
            });
          }
        })
        .catch(() => {});
    });
  }, [mounted, wishlist.items, allProducts]);

  // Compute matched saved products without duplicates
  const savedProducts = useMemo(() => {
    if (!mounted) return [];
    const results: any[] = [];
    const seen = new Set<string>();

    for (const savedId of wishlist.items) {
      if (!savedId) continue;
      const prod = allProducts.find(
        (p) =>
          p.id === savedId ||
          p.slug === savedId ||
          (p.code && p.code.toLowerCase() === savedId.toLowerCase())
      );
      if (prod) {
        const key = prod.id || prod.slug;
        if (!seen.has(key)) {
          seen.add(key);
          results.push(prod);
        }
      }
    }
    return results;
  }, [wishlist.items, allProducts, mounted]);

  const handleMoveToCompare = (prodId: string) => {
    compare.addItem(prodId);
    setCopiedId(prodId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-16 pb-24 min-h-screen bg-[#F7F5F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumbs */}
        <nav className="text-[10px] text-[#333333]/60 font-medium tracking-[0.25em] uppercase flex items-center space-x-2 mb-8">
          <Link href="/" className="hover:text-[#C95745] transition-colors duration-300">Home</Link>
          <span>/</span>
          <span className="text-[#C95745]">Saved Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#EDEAE4] pb-8 mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.3em] text-[#C95745] font-semibold uppercase block">
              Personal Collection
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#101B38] leading-tight tracking-tight">
              Saved Wishlist
            </h1>
            <p className="text-xs md:text-sm text-[#333333]/70 font-light max-w-xl leading-relaxed">
              Review, compare, and manage your selected vitrified slabs and designer tile series.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/products">
              <Button variant="outline" size="sm" className="text-[11px] tracking-wider uppercase font-medium flex items-center space-x-2 border-[#333333] text-[#101B38] hover:bg-[#101B38] hover:text-[#FCFBF8] rounded-[2px]">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Button>
            </Link>

            {savedProducts.length > 0 && (
              <button
                onClick={() => wishlist.clearWishlist()}
                className="text-[11px] font-medium text-[#333333]/60 hover:text-[#C95745] uppercase tracking-wider underline transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {savedProducts.length === 0 ? (
          <div className="py-24 text-center space-y-6 bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-12 shadow-xs max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-[#EDEAE4] text-[#C95745] rounded-[2px] flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#101B38]">Your Wishlist is Empty</h2>
              <p className="text-xs text-[#333333]/70 font-light max-w-md mx-auto leading-relaxed">
                You haven&apos;t saved any tile collections or vitrified slabs yet. Explore our curated series to bookmark your favorite designs.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/products">
                <Button className="text-xs font-medium tracking-wider uppercase px-8 py-3.5 rounded-[2px] bg-[#101B38] hover:bg-[#C95745] text-[#FCFBF8] transition-colors">
                  Explore Collections &rarr;
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Grid List of Saved Products */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedProducts.map((prod) => {
              const inCompare = compare.hasItem(prod.id);
              const isCopied = copiedId === prod.id;
              const collectionInfo = resolveProductCollection(prod);
              const collectionName = collectionInfo.name;
              const rawImage =
                Array.isArray(prod.images) && prod.images.length > 0
                  ? prod.images[0]
                  : (prod.thumbnail || "");
              const displayImage = resolveProductImage(
                rawImage,
                prod.categoryId || prod.category_id,
                0
              );

              return (
                <Card
                  key={prod.id || prod.slug}
                  className="bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] overflow-hidden shadow-xs hover:border-[#101B38]/30 transition-all duration-300 flex flex-col group h-full"
                >
                  {/* Thumbnail Image Header */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#EDEAE4] border-b border-[#EDEAE4]">
                    <img
                      src={displayImage}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Top Badges & Actions */}
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span className="bg-[#101B38] text-[9px] font-medium text-[#FCFBF8] px-2.5 py-1 rounded-[2px] tracking-widest uppercase">
                        {prod.code || prod.sku || "TMX"}
                      </span>
                    </div>

                    {/* Tile of Spain Badge */}
                    {Boolean(prod.showTileOfSpainBadge || prod.show_tile_of_spain_badge) && (
                      <TileOfSpainBadge size="md" />
                    )}

                    <button
                      onClick={() => wishlist.removeItem(prod.id, prod.slug)}
                      className="absolute top-3 right-3 p-2 rounded-[2px] bg-[#FCFBF8]/90 border border-[#EDEAE4] text-[#333333]/60 hover:text-[#C95745] cursor-pointer transition-colors"
                      title="Remove from Wishlist"
                      aria-label="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-[#333333]/60 font-medium block uppercase tracking-widest">
                        {collectionName}
                      </span>
                      <Link href={`/product/${prod.slug}`} className="block">
                        <h3 className="font-serif text-xl font-bold text-[#101B38] group-hover:text-[#C95745] transition-colors duration-300 leading-snug">
                          {prod.name}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[9px] bg-[#EDEAE4] text-[#333333] font-medium px-2.5 py-0.5 rounded-[2px]">
                          {prod.finish?.trim().toLowerCase() === "matte" ? "Matt" : (prod.finish || "Vitrified")}
                        </span>
                        {prod.look && (
                          <span className="text-[9px] bg-[#EDEAE4] text-[#333333] font-medium px-2.5 py-0.5 rounded-[2px]">
                            {prod.look}
                          </span>
                        )}
                        {prod.size && (
                          <span className="text-[9px] bg-[#EDEAE4] text-[#333333] font-medium px-2.5 py-0.5 rounded-[2px]">
                            {prod.size}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="border-t border-[#EDEAE4] pt-4 mt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#C95745] font-semibold uppercase tracking-widest">
                          Price on Request
                        </span>
                        
                        <button
                          onClick={() => setQuickViewProduct(prod)}
                          className="text-[10px] font-medium text-[#101B38] hover:text-[#C95745] uppercase tracking-widest transition-colors duration-300 inline-flex items-center cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>Quick View</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleMoveToCompare(prod.id)}
                          className={`w-full py-2.5 rounded-[2px] border text-[9px] font-medium uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
                            inCompare || isCopied
                              ? "bg-[#101B38] text-[#FCFBF8] border-[#101B38]"
                              : "border-[#333333]/20 text-[#333333] hover:border-[#101B38] bg-[#EDEAE4]"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-500" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>{inCompare ? "In Compare" : "To Compare"}</span>
                            </>
                          )}
                        </button>

                        <Link href={`/product/${prod.slug}`} className="w-full">
                          <Button size="sm" className="w-full py-2.5 text-[9px] tracking-wider uppercase font-medium text-center bg-[#101B38] text-[#FCFBF8] hover:bg-[#C95745] rounded-[2px]">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101B38]/60 backdrop-blur-xs">
          <div className="bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] shadow-2xl max-w-3xl w-full overflow-hidden relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-[2px] bg-[#EDEAE4] hover:bg-[#EDEAE4]/80 text-[#333333] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square bg-[#EDEAE4]">
                <img
                  src={resolveProductImage(
                    Array.isArray(quickViewProduct.images) && quickViewProduct.images.length > 0
                      ? quickViewProduct.images[0]
                      : (quickViewProduct.thumbnail || ""),
                    quickViewProduct.categoryId || quickViewProduct.category_id,
                    0
                  )}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-[9px] bg-[#C95745]/10 text-[#C95745] font-semibold px-3 py-1 rounded-[2px] uppercase tracking-wider inline-block">
                    {quickViewProduct.code || quickViewProduct.sku || "TMX"}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#101B38]">
                    {quickViewProduct.name}
                  </h3>
                  <p className="text-xs text-[#333333]/70 font-light leading-relaxed">
                    {quickViewProduct.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-light text-[#333333]/70 pt-3 border-t border-[#EDEAE4]">
                    <div><strong className="text-[#101B38] font-medium">Size:</strong> {quickViewProduct.size || "Standard"}</div>
                    <div><strong className="text-[#101B38] font-medium">Finish:</strong> {quickViewProduct.finish?.trim().toLowerCase() === "matte" ? "Matt" : (quickViewProduct.finish || "Vitrified")}</div>
                    <div><strong className="text-[#101B38] font-medium">Look:</strong> {quickViewProduct.look || "Marble / Stone"}</div>
                    <div><strong className="text-[#101B38] font-medium">Thickness:</strong> {quickViewProduct.thickness || "9 mm"}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#EDEAE4]">
                  <div className="text-xs font-semibold text-[#C95745] uppercase tracking-widest">
                    Pricing Available Upon Request
                  </div>

                  <div className="flex space-x-3">
                    <Link href={`/product/${quickViewProduct.slug}`} className="flex-1">
                      <Button size="sm" className="w-full text-center py-3 text-xs tracking-wider uppercase font-medium bg-[#101B38] text-[#FCFBF8] hover:bg-[#C95745] rounded-[2px]">
                        Full Product Details
                      </Button>
                    </Link>
                    <button
                      onClick={() => {
                        handleMoveToCompare(quickViewProduct.id);
                      }}
                      className="p-3 border border-[#333333]/30 rounded-[2px] hover:border-[#101B38] hover:text-[#101B38] transition-colors cursor-pointer"
                      title="Add to Compare"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

