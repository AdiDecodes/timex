"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SlidersHorizontal } from "lucide-react";
import { resolveProductImage } from "@/utils/productImages";
import { ProductCard } from "@/components/product/ProductCard";
import { matchesProductCategory } from "@/utils/productCategories";

interface CollectionProductGridClientProps {
  initialProducts: any[];
  collectionSlug: string;
  collectionId: string;
  collectionName: string;
}

export function CollectionProductGridClient({
  initialProducts,
  collectionSlug,
  collectionId,
  collectionName,
}: CollectionProductGridClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);

  // Sync with initialProducts when prop changes
  useEffect(() => {
    if (Array.isArray(initialProducts)) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  // Live Database Rehydration: ensures products added or edited in /admin reflect immediately
  useEffect(() => {
    fetch("/api/v1/products?_t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        const all = Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);
        if (all.length > 0) {
          const seen = new Set<string>();
          const matched = all.filter((p: any) => {
            if (!p) return false;
            if (
              p.is_trashed ||
              p.isTrashed ||
              p.isActive === false ||
              p.is_active === false ||
              p.status === "Inactive" ||
              p.status === "Draft"
            ) {
              return false;
            }

            const isMatch =
              matchesProductCategory(p, collectionSlug) ||
              matchesProductCategory(p, collectionId) ||
              matchesProductCategory(p, collectionName);

            if (!isMatch) return false;

            const key = String(p.id || p.slug || "").trim();
            if (key) {
              if (seen.has(key)) return false;
              seen.add(key);
            }
            return true;
          });

          if (matched.length > 0) {
            setProducts(matched);
          }
        }
      })
      .catch(() => {});
  }, [collectionSlug, collectionId, collectionName]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
      {/* Products Heading & Filter Trigger */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#EDEAE4] gap-4">
        <div>
          <span className="text-xs md:text-sm text-[#333333]/70 font-medium block mb-1">
            Showing all {products.length} results
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#101B38]">
            {collectionName} Series
          </h2>
        </div>

        <Link href={`/products?category=${collectionSlug}`}>
          <Button variant="outline" size="sm" className="text-[11px] tracking-wider uppercase font-medium flex items-center space-x-2 border-[#333333] text-[#101B38] hover:bg-[#101B38] hover:text-[#FCFBF8] rounded-[2px]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Catalog</span>
          </Button>
        </Link>
      </div>

      <div className={`grid grid-cols-1 ${products.length <= 2 ? "md:grid-cols-2 max-w-4xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"} gap-6 md:gap-8`}>
        {(Array.isArray(products) ? products : []).map((prod) => (
          <ProductCard key={prod.id || prod.slug} product={prod} />
        ))}
      </div>
    </section>
  );
}
