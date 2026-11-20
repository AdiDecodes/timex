"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ProductsRedirectClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams ? searchParams.toString() : "";
    router.replace(`/world-of-tiles${qs ? `?${qs}` : ""}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-gray-400 text-sm">
      Redirecting to World of Tiles...
    </div>
  );
}

