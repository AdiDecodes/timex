import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { getBlogs } from "@/services/blog";
import { BlogsListClient } from "./BlogsListClient";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/blogs");
  return buildPageMetadata(seo);
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      {/* Header Banner */}
      <section className="bg-[#101B38] text-[#FCFBF8] py-16 md:py-24 relative overflow-hidden border-b border-[#101B38]">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="Blogs Header Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center space-y-4 relative z-10">
          <span className="text-[10px] tracking-[0.3em] text-[#C95745] font-semibold uppercase bg-[#C95745]/10 px-4 py-1.5 rounded-[2px] border border-[#C95745]/30 inline-block">
            Design Feeds & Architectural Insights
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#FCFBF8] tracking-tight">
            Surface Inspirations & Articles
          </h1>
          <p className="text-xs md:text-sm text-[#EDEAE4]/80 font-light max-w-xl mx-auto leading-relaxed">
            Read professional insights, trend analysis, and technical tiling guidelines curated by leading interior architects and Timex surface specialists.
          </p>
        </div>
      </section>

      {/* Main Grid Content with Live Database Rehydration */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <BlogsListClient initialBlogs={blogs} />
      </section>
    </div>
  );
}
