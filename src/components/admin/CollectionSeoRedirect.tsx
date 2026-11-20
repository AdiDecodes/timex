"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FolderTree } from "lucide-react";

export function CollectionSeoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/product-categories");
  }, [router]);

  return (
    <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
      <FolderTree className="w-12 h-12 text-[#c5a880] mb-4 animate-pulse" />
      <h2 className="text-xl font-bold text-white mb-2">Category SEO & URLs Unified</h2>
      <p className="text-sm text-gray-400 max-w-md mb-6">
        Product Category Photos, URLs, and SEO settings have been merged into the central Product Categories management dashboard.
      </p>
      <Link
        href="/admin/product-categories"
        className="px-5 py-2.5 rounded-xl bg-[#c5a880] text-black font-semibold text-xs inline-flex items-center gap-2 hover:bg-[#b0926a] transition-all shadow-lg shadow-[#c5a880]/20"
      >
        <span>Go to Product Categories</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
