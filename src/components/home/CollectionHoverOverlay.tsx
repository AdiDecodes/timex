"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { isValidSpec, cleanSpecValue } from "@/utils/productSpecs";

export interface CollectionSpecs {
  size?: string | null;
  kgPerBox?: string | number | null;
  pcsPerBox?: string | number | null;
}

interface CollectionHoverOverlayProps {
  name: string;
  description?: string;
  specs?: CollectionSpecs;
  touchActive?: boolean;
}

/**
 * Resolves technical specifications (Size, Kg. Per Box, Pcs Per Box)
 * dynamically from an item (product or category) or matching product.
 */
export function resolveCollectionSpecs(
  item: any,
  productList: any[] = []
): CollectionSpecs {
  if (!item) return {};

  let rawSize =
    item.size ||
    item.dimensions ||
    item.specs?.size ||
    (Array.isArray(item.availableSizes) && item.availableSizes.length > 0
      ? item.availableSizes[0]
      : undefined);

  let rawKg =
    item.kgPerBox ||
    item.kg_per_box ||
    item.weight ||
    item.specs?.kgPerBox;

  let rawPcs =
    item.pcsPerBox ||
    item.pcs_per_box ||
    item.packingDetails ||
    item.specs?.pcsPerBox;

  // If specs are not directly present and a product list is provided, lookup matching active product
  if (
    (!isValidSpec(rawSize) || !isValidSpec(rawKg) || !isValidSpec(rawPcs)) &&
    Array.isArray(productList) &&
    productList.length > 0
  ) {
    const slug = String(item.slug || item.id || "").toLowerCase().trim();
    const name = String(item.name || "").toLowerCase().trim();

    const match = productList.find((p: any) => {
      if (p.is_trashed || p.isTrashed) return false;
      if (p.isActive === false || p.is_active === false) return false;
      const pCatId = String(p.categoryId || p.category_id || "").toLowerCase().trim();
      const pCatName = String(p.category_name || p.category || "").toLowerCase().trim();
      const pCollId = String(p.collectionId || p.collection_id || "").toLowerCase().trim();
      const pSlug = String(p.slug || "").toLowerCase().trim();

      return (
        pCatId === slug ||
        pCatName === name ||
        pCollId === slug ||
        pSlug === slug
      );
    });

    if (match) {
      if (!isValidSpec(rawSize)) {
        rawSize =
          match.size ||
          match.dimensions ||
          (Array.isArray(match.availableSizes) && match.availableSizes.length > 0
            ? match.availableSizes[0]
            : undefined);
      }
      if (!isValidSpec(rawKg)) {
        rawKg = match.kgPerBox || match.kg_per_box || match.weight;
      }
      if (!isValidSpec(rawPcs)) {
        rawPcs = match.pcsPerBox || match.pcs_per_box || match.packingDetails;
      }
    }
  }

  return {
    size: isValidSpec(rawSize) ? cleanSpecValue(rawSize) : undefined,
    kgPerBox: isValidSpec(rawKg) ? cleanSpecValue(rawKg) : undefined,
    pcsPerBox: isValidSpec(rawPcs) ? cleanSpecValue(rawPcs) : undefined,
  };
}

/**
 * Premium dark blurred overlay for collection/product cards on the homepage.
 * Renders dynamically centered specifications, description, and hero-styled VIEW COLLECTION CTA
 * with smooth fade/slide transition and mobile tap support.
 */
export function CollectionHoverOverlay({
  name,
  description,
  specs,
  touchActive = false,
}: CollectionHoverOverlayProps) {
  const size = specs?.size && isValidSpec(specs.size) ? cleanSpecValue(specs.size) : "";
  const kgPerBox = specs?.kgPerBox && isValidSpec(specs.kgPerBox) ? cleanSpecValue(specs.kgPerBox) : "";
  const pcsPerBox = specs?.pcsPerBox && isValidSpec(specs.pcsPerBox) ? cleanSpecValue(specs.pcsPerBox) : "";

  const hasAnySpec = Boolean(size || kgPerBox || pcsPerBox);
  const cleanDesc = description ? description.replace(/\s+/g, " ").trim() : "";

  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 sm:p-7 bg-black/70 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
        touchActive
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
      }`}
    >
      <div className="flex flex-col items-center justify-center text-center max-w-[280px] w-full transform transition-transform duration-300 ease-out">
        {/* 1. Collection / Series Name */}
        <h4 className="font-serif text-lg sm:text-xl font-normal text-white tracking-wide leading-snug mb-2 drop-shadow-xs line-clamp-2">
          {name}
        </h4>

        {/* 2. Existing Product Description directly below series name */}
        {cleanDesc && (
          <p className="font-sans text-xs sm:text-[13px] text-white/85 font-light leading-relaxed line-clamp-2 mb-3">
            {cleanDesc}
          </p>
        )}

        {/* 3. Selected Product Specifications */}
        {hasAnySpec && (
          <div className="space-y-1 font-sans text-xs sm:text-[13px] text-white/90 font-light mb-1">
            {size && (
              <p className="leading-relaxed">
                <span className="text-white/70">Size:</span> {size}
              </p>
            )}
            {kgPerBox && (
              <p className="leading-relaxed">
                <span className="text-white/70">Kg. Per Box:</span> {kgPerBox}
              </p>
            )}
            {pcsPerBox && (
              <p className="leading-relaxed">
                <span className="text-white/70">Pcs Per Box:</span> {pcsPerBox}
              </p>
            )}
          </div>
        )}

        {/* 4. Subtle Divider Line */}
        <div className="w-12 h-px bg-white/30 my-3.5" />

        {/* 5. VIEW COLLECTION → CTA matching Hero button styling */}
        <div className="inline-flex items-center gap-2.5 text-[11px] sm:text-[12px] font-bold tracking-[0.16em] uppercase text-[#FFFFFF] group-hover:text-[#C95745] pb-1.5 border-b border-[#FFFFFF] group-hover:border-[#C95745] transition-all duration-300">
          <span>VIEW COLLECTION</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
}
