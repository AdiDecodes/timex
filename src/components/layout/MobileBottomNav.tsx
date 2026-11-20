"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calculator, Play } from "lucide-react";

interface MobileBottomNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isSpecial?: boolean;
}

const BOTTOM_NAV_ITEMS: MobileBottomNavItem[] = [
  {
    name: "Catalog Maker",
    href: "/catalogue-maker",
    icon: BookOpen,
  },
  {
    name: "Tile Calculator",
    href: "/calculator",
    icon: Calculator,
  },
  {
    name: "Watch & Choose",
    href: "/watch-and-choose",
    icon: Play,
    isSpecial: true,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Quick Tools Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5E5] shadow-[0_-2px_12px_rgba(16,27,56,0.08)] transition-transform duration-200 select-none"
      style={{
        paddingBottom: "max(0.4rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="grid grid-cols-3 max-w-md mx-auto items-stretch">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex flex-col items-center justify-center py-2 px-1 text-center transition-colors duration-150 min-h-[54px] active:bg-neutral-50 touch-manipulation ${
                isActive
                  ? "text-[#C95745]"
                  : "text-[#101B38] hover:text-[#C95745]"
              }`}
            >
              <div className="relative flex items-center justify-center">
                {item.isSpecial ? (
                  <Icon
                    className="w-4 h-4 text-[#C95745] fill-[#C95745] transition-transform duration-200 group-hover:scale-110"
                  />
                ) : (
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? "text-[#C95745]"
                        : "text-[#101B38] group-hover:text-[#C95745]"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[10.5px] sm:text-[11px] tracking-tight leading-tight mt-1 truncate max-w-full font-sans ${
                  isActive ? "font-semibold text-[#C95745]" : "font-medium"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
