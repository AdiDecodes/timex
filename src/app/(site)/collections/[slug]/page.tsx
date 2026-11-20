import React from "react";
import Link from "next/link";
import { COLLECTIONS } from "@/data/collections";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return {
    title: "Redirecting to Product Category | Timex Ceramic",
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `https://www.timexceramic.com/product-category/${slug}`,
    },
  };
}

export default async function LegacyCollectionRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  const targetUrl = `/product-category/${slug}`;

  return (
    <div className="bg-[#F7F5F0] flex items-center justify-center min-h-[70vh] text-[#101B38] font-sans px-6 py-20 text-center">
      {/* Client-side immediate redirect fallback for static export */}
      <script
        dangerouslySetInnerHTML={{
          __html: `if (typeof window !== "undefined") { window.location.replace("${targetUrl}"); }`,
        }}
      />
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        <div className="w-12 h-12 bg-[#101B38]/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C95745]">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
        <span className="text-[11px] font-bold tracking-widest text-[#C95745] uppercase mb-1 block">
          301 Permanent Redirect
        </span>
        <h1 className="font-serif text-2xl font-bold mb-2 text-[#101B38]">
          Redirecting to Category...
        </h1>
        <p className="text-sm text-stone-600 mb-6">
          This category has permanently moved to{" "}
          <Link href={targetUrl} className="text-[#C95745] font-semibold underline">
            {targetUrl}
          </Link>
        </p>
        <Link
          href={targetUrl}
          className="inline-block px-6 py-3 bg-[#101B38] hover:bg-[#C95745] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          Go to {targetUrl}
        </Link>
      </div>
    </div>
  );
}
