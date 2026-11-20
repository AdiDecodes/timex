"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        fetch("/api/v1/seo/404-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: window.location.pathname,
            referrer: document.referrer || "Direct",
            user_agent: navigator.userAgent || "Browser",
          }),
        }).catch(() => {});
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col justify-center items-center px-4 py-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c5a880]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-xl text-center space-y-6">
        <span className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/30 inline-block">
          Error 404 • Page Not Found
        </span>

        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight">
          Surface Not Located
        </h1>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          The luxury ceramic or porcelain surface you are looking for may have been relocated, renamed, or is temporarily unavailable.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c5a880]/20 hover:brightness-110 transition-all text-center"
          >
            Return to Home
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-all text-center"
          >
            Explore All Tiles
          </Link>
          <Link
            href="/visualiser"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[#c5a880] font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-all text-center"
          >
            3D Visualiser
          </Link>
        </div>

        <div className="pt-8 border-t border-white/10">
          <p className="text-xs text-gray-400">
            Need urgent assistance? Connect with the Mumbai Experience Centre at{" "}
            <a href="tel:+912226122960" className="text-[#c5a880] hover:underline">
              +91-22-26122960
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
