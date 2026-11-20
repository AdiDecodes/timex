"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import {
  useWorldOfTilesCategories,
  resolveCategoryImage,
} from "@/hooks/useWorldOfTilesCategories";
import { CategoryItem } from "@/services/categories";

export type WorldOfTilesCategory = CategoryItem;

export interface CategoryRow {
  id: string;
  columns: 2 | 3;
  categories: CategoryItem[];
}

/**
 * Dynamically chunks categories into alternating 2-column and 3-column rows,
 * matching the original luxury alternating rhythm while avoiding orphan cards.
 */
export function chunkCategoriesIntoRows(items: CategoryItem[]): CategoryRow[] {
  const rows: CategoryRow[] = [];
  let index = 0;
  // Alternating pattern: 2, 2, 3, 2, 3, 3, 2, 3...
  const pattern: (2 | 3)[] = [2, 2, 3, 2, 3, 3, 2, 3];
  let step = 0;

  while (index < items.length) {
    const remaining = items.length - index;
    let take: 2 | 3 = 2;

    if (remaining <= 3) {
      take = remaining === 3 ? 3 : 2;
    } else if (remaining === 4) {
      take = 2;
    } else {
      const preferred = pattern[step % pattern.length];
      if (remaining - preferred === 1) {
        take = preferred === 3 ? 2 : 3;
      } else {
        take = preferred;
      }
    }

    const chunk = items.slice(index, index + take);
    rows.push({
      id: `row-${rows.length + 1}-${chunk.map((c) => c.slug).join("-")}`,
      columns: (chunk.length === 3 ? 3 : 2) as 2 | 3,
      categories: chunk,
    });
    index += take;
    step++;
  }

  return rows;
}

interface TileCardProps {
  category: CategoryItem;
  priority?: boolean;
}

function TileCard({ category, priority = false }: TileCardProps) {
  const primarySrc = resolveCategoryImage(category);
  const [currentSrc, setCurrentSrc] = useState<string>(primarySrc);
  const [hasError, setHasError] = useState<boolean>(false);

  // Sync if category images are updated via live admin events
  useEffect(() => {
    const nextImg = resolveCategoryImage(category);
    if (nextImg && nextImg !== currentSrc) {
      setCurrentSrc(nextImg);
      setHasError(false);
    }
  }, [category.banner, category.ogImage, category.image]);

  const handleImageError = () => {
    if (!hasError) {
      // Fallback luxury tile image
      setCurrentSrc(
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
      );
      setHasError(true);
    }
  };

  const href = category.url || `/product-category/${category.slug}`;

  return (
    <Link
      href={href}
      aria-label={`Explore ${category.name} collection`}
      className="group relative block w-full h-[320px] sm:h-[350px] md:h-[370px] lg:h-[380px] rounded-[2px] overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300"
    >
      {/* Background Image with Smooth Zoom on Hover */}
      {currentSrc && (
        <Image
          src={currentSrc}
          alt={`${category.name} tiles and architectural surfaces`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          onError={handleImageError}
        />
      )}

      {/* Subtle Dark Gradient Overlay for High Contrast Text Legibility */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />

      {/* Centered Content: Category Title & VIEW MORE Button */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-10 text-center space-y-6">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-3xl lg:text-[32px] text-white font-light tracking-[0.12em] uppercase transition-transform duration-300 drop-shadow-md group-hover:scale-102">
          {category.name}
        </h2>

        <div>
          <span className="inline-block bg-black/85 group-hover:bg-[#C95745] text-white text-[11px] sm:text-[12px] md:text-[13px] font-medium tracking-[0.18em] uppercase px-7 py-3 transition-colors duration-300 shadow-md">
            VIEW MORE
          </span>
        </div>
      </div>
    </Link>
  );
}

interface WorldOfTilesClientProps {
  initialCategories?: CategoryItem[];
}

export function WorldOfTilesClient({ initialCategories }: WorldOfTilesClientProps) {
  const categories = useWorldOfTilesCategories(initialCategories);
  const rows = useMemo(() => chunkCategoriesIntoRows(categories), [categories]);

  if (!categories || categories.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm font-sans uppercase tracking-widest text-[#333333]/70">
          No published collections found in World of Tiles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      {rows.map((row, rowIdx) => {
        const isTwoCol = row.columns === 2;
        const gridClass = isTwoCol
          ? "grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
          : "grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6";

        return (
          <Reveal key={row.id} direction="up" delay={0.05} className="w-full">
            <div className={gridClass}>
              {row.categories.map((cat, catIdx) => {
                const isPriority = rowIdx === 0 && catIdx < 2;

                return (
                  <TileCard
                    key={cat.slug || cat.id}
                    category={cat}
                    priority={isPriority}
                  />
                );
              })}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
