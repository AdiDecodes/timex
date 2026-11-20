"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ProductsPluralSlugClient({ slug }: { slug: string }) {
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      router.replace(`/product/${slug}`);
    }
  }, [router, slug]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-gray-400 text-sm">
      Loading product surface...
    </div>
  );
}
