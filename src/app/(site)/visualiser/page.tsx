import { Suspense } from "react";
import type { Metadata } from "next";
import { VisualiserCanvas } from "@/components/visualiser/VisualiserCanvas";
import { Sparkles } from "lucide-react";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/visualiser");
  return buildPageMetadata(seo);
}

export default function VisualiserPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#101B38] text-[#FCFBF8] flex flex-col items-center justify-center space-y-4">
          <Sparkles className="w-10 h-10 text-[#C95745] animate-spin" />
          <h2 className="font-serif text-xl font-normal tracking-wide">Loading Visualiser Studio...</h2>
          <p className="text-xs text-[#EDEAE4]/80 font-light">Initializing WebGL rendering and surface polygon coordinates.</p>
        </div>
      }
    >
      <VisualiserCanvas />
    </Suspense>
  );
}
