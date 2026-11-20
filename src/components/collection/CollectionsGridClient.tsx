"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import Card from "@/components/ui/Card";
import { CategoryItem } from "@/services/categories";

const DEFAULT_CATEGORY_SUBTITLES: Record<string, string> = {
  brick: "Rustic Charm Meets Modern Design",
  marble: "Classic Italian Statuario & Calacatta Slabs",
  hexagon: "Geometric Hex Porcelain for Floor & Wall",
  modular: "Multi-Format Opus Romano Layout Sets",
  stone: "Earthy Cleft & Natural Stone Textures",
  subway: "Beveled Metro Bricks & Gloss Finishes",
  moroccan: "Zellige Glazed Handcrafted Arabesque Art",
  octagonal: "Victorian Dot & Octagon Traditional Pavers",
  wooden: "Royal Oak & Timber Plank Porcelain Slabs",
  texture: "Fluted 3D Bas-Relief & Chiseled Surfaces",
  colorful: "Vibrant Glazes, Pastels & Saturated Hues",
  terrazzo: "Venetian Agglomerate Chip Composite Slabs",
  tropical: "Botanical Prints & Lush Leaf Deco Slabs",
  metallic: "Liquid Bronze, Oxidized Copper & Gold Sheen",
  highlighter: "Gold Leaf Accents, Lustre & Statement Borders",
  mosaic: "Glass, Marble & Penny Round Mesh Sheets",
  boutique: "Handcrafted Artisanal Cotto & Atelier Ceramics",
  "french-frames": "Classic French Boiserie & Panel Mouldings",
  fabric: "Woven Linen, Tweed & Silk Texture Ceramics",
};

interface CollectionsGridClientProps {
  initialCategories: CategoryItem[];
}

export function CollectionsGridClient({ initialCategories }: CollectionsGridClientProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);

  // Dynamic live rehydration from central backend taxonomy API
  useEffect(() => {
    let isMounted = true;
    const loadLiveCategories = async () => {
      try {
        const res = await fetch(`/api/v1/taxonomies/categories?status=published&_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.categories) && data.categories.length > 0 && isMounted) {
            const published = data.categories.filter((c: any) => c.status !== "draft");
            setCategories(published);
          }
        }
      } catch (err) {
        console.warn("Failed to live rehydrate categories:", err);
      }
    };

    loadLiveCategories();

    const handleUpdate = () => loadLiveCategories();
    window.addEventListener("timex-taxonomy-updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("timex-taxonomy-updated", handleUpdate);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {categories.map((col, idx) => {
        const subtitle =
          DEFAULT_CATEGORY_SUBTITLES[col.slug] ||
          col.seoTitle ||
          `${col.name} Luxury Slabs & Tiles`;
        const count = col.productCount !== undefined ? col.productCount : 0;
        const link = col.url || `/product-category/${col.slug}`;
        const image =
          col.banner ||
          col.ogImage ||
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80";

        return (
          <Reveal key={col.id || col.slug} direction="up" delay={idx * 0.03}>
            <Link href={link} className="block h-full">
              <Card className="group flex flex-col h-full bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] overflow-hidden shadow-xs hover:border-[#101B38]/30 transition-all duration-300">
                {/* Image Container */}
                <div className="relative h-60 w-full overflow-hidden bg-[#EDEAE4]">
                  <Image
                    src={image}
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <span className="absolute top-3 left-3 z-10 text-[9px] bg-[#101B38] text-[#FCFBF8] font-medium uppercase tracking-widest px-2.5 py-1 rounded-[2px]">
                    {count}+ Designs
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101B38]/50 via-transparent to-transparent opacity-70 group-hover:opacity-30 transition-opacity duration-500" />
                </div>

                {/* Details Container */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[9px] text-[#C95745] font-semibold uppercase tracking-widest block">
                      {subtitle}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#101B38] group-hover:text-[#C95745] transition-colors duration-300">
                      {col.name}
                    </h3>
                    <p className="text-xs text-[#333333]/70 font-light leading-relaxed line-clamp-2">
                      {col.description || `Explore our curated ${col.name} tile collection.`}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EDEAE4]">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#101B38] group-hover:text-[#C95745] pb-1.5 border-b border-[#EDEAE4] group-hover:border-[#C95745] transition-colors duration-300 uppercase tracking-wider font-sans">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
