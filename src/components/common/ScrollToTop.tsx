"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollToTop Component
 * Ensures every internal page navigation starts cleanly at the top of the viewport.
 * - Multi-frame confirmation ensures Next.js async layout hydration doesn't restore old scroll positions.
 * - Preserves intentional in-page anchor navigation (e.g. #contact, #specifications).
 * - Ignores in-page query/filter changes so users are not kicked to top when interacting on the same page.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const lastPathnameRef = useRef<string | null>(null);

  // Set manual scroll restoration on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isNewRoute = lastPathnameRef.current !== null && lastPathnameRef.current !== pathname;
    const isInitialMount = lastPathnameRef.current === null;
    lastPathnameRef.current = pathname;

    // Only run on initial mount or when the actual page pathname changes
    if (!isNewRoute && !isInitialMount) {
      return;
    }

    // Check for intentional anchor navigation in URL
    const hash = window.location.hash;
    if (hash) {
      const scrollToHashElement = () => {
        try {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            return true;
          }
        } catch (_) {}
        return false;
      };

      if (!scrollToHashElement()) {
        const t1 = setTimeout(scrollToHashElement, 50);
        const t2 = setTimeout(scrollToHashElement, 250);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
      return;
    }

    // Force scroll position to the very top (top: 0, left: 0)
    const resetScrollToTop = () => {
      const html = document.documentElement;
      const originalScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      html.scrollTop = 0;
      if (document.body) {
        document.body.scrollTop = 0;
      }

      html.style.scrollBehavior = originalScrollBehavior;
    };

    // 1. Immediate execution
    resetScrollToTop();

    // 2. Next animation frame
    const rafId = requestAnimationFrame(() => {
      resetScrollToTop();
    });

    // 3. Post-hydration execution to eliminate race conditions with React Suspense / Next.js layout shifts
    const timer1 = setTimeout(resetScrollToTop, 50);
    const timer2 = setTimeout(resetScrollToTop, 150);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);

  return null;
}
