"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { useNavigationFilterGroups } from "@/hooks/useNavigationFilterGroups";

export function ExploreTilesMegaMenuSection() {
  const navigationFilterGroups = useNavigationFilterGroups();
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);

  const toggleMobileAccordion = (id: string) => {
    setOpenMobileAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-12 md:py-16 relative z-10 bg-[#F7F5F0] border-t border-[#EDEAE4]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        {/* ==================================================
            TOP HEADER BAR (Matching Reference Screenshot)
            ================================================== */}
        <Reveal direction="up">
          <div className="flex items-center justify-between mb-8 md:mb-10 w-full">
            <div className="flex items-center flex-1 mr-4 sm:mr-8">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C95745] font-sans shrink-0">
                EXPLORE TILES BY
              </span>
              <div className="h-[1px] w-full bg-[#333333]/20 ml-4 sm:ml-6" />
            </div>
            <div className="flex items-center shrink-0">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C95745] font-sans">
                EVERY SURFACE TELLS A STORY
              </span>
              <div className="h-[1px] w-8 sm:w-16 bg-[#333333]/20 ml-4 sm:ml-6 hidden sm:block" />
            </div>
          </div>
        </Reveal>

        {/* ==================================================
            DESKTOP & TABLET 10-COLUMN EDITORIAL GRID
            ================================================== */}
        <Reveal direction="up" delay={0.1} className="hidden md:block">
          <div className="border border-[#DED9D0] bg-[#F7F5F0] grid grid-cols-5 xl:grid-cols-10 rounded-[2px] overflow-hidden">
            {navigationFilterGroups.map((group, idx) => {
              const isLastXl = idx === 9;
              const isLastMdInRow = idx % 5 === 4;
              const isFirstMdRow = idx < 5;

              return (
                <div
                  key={group.id}
                  className={`group/col p-3.5 lg:p-3 xl:p-3.5 flex flex-col justify-between h-full bg-[#F7F5F0] hover:bg-[#EDEAE4]/40 transition-colors duration-200 border-[#DED9D0] ${
                    isLastXl ? "xl:border-r-0" : "xl:border-r"
                  } ${
                    isLastMdInRow ? "md:border-r-0" : "md:border-r"
                  } ${
                    isFirstMdRow ? "md:border-b" : "md:border-b-0"
                  } xl:border-b-0`}
                >
                  {/* Top: Title, Arrow & Horizontal Divider */}
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <Link
                        href={group.viewAllHref}
                        className="font-serif text-[13px] sm:text-[14px] font-semibold text-[#101B38] group-hover/col:text-[#C95745] transition-colors leading-tight"
                      >
                        {group.footerTitle || group.title}
                      </Link>
                      <Link
                        href={group.viewAllHref}
                        aria-label={`Explore ${group.title}`}
                        className="text-xs text-[#333333]/50 group-hover/col:text-[#C95745] group-hover/col:translate-x-0.5 transition-all shrink-0 mt-0.5"
                      >
                        →
                      </Link>
                    </div>

                    {/* Thin horizontal divider below column heading */}
                    <div className="h-[1px] w-full bg-[#333333]/15 mb-3" />

                    {/* All Items List - with smooth scroll for longer columns */}
                    <ul className="space-y-1.5 sm:space-y-2 mb-3 max-h-[260px] overflow-y-auto pr-1">
                      {group.items.map((item, i) => (
                        <li key={`${group.id}-${i}`}>
                          <Link
                            href={item.href}
                            className="block text-[11px] sm:text-[12px] text-[#555555] hover:text-[#C95745] transition-colors leading-relaxed truncate"
                            title={item.name}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom: VIEW ALL → */}
                  <div className="pt-3 mt-auto border-t border-[#333333]/10">
                    <Link
                      href={group.viewAllHref}
                      className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-[#101B38] group-hover/col:text-[#C95745] inline-flex items-center space-x-1 transition-colors group"
                    >
                      <span>VIEW ALL</span>
                      <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ==================================================
            MOBILE RESPONSIVE ACCORDION (Visible on Mobile)
            ================================================== */}
        <div className="block md:hidden space-y-2.5">
          {navigationFilterGroups.map((group) => {
            const isOpen = openMobileAccordion === group.id;
            return (
              <div
                key={group.id}
                className="bg-[#FCFBF8] rounded-[2px] border border-[#DED9D0] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleMobileAccordion(group.id)}
                  className="w-full flex items-center justify-between p-3.5 text-left font-serif text-sm font-semibold text-[#101B38] hover:text-[#C95745] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{group.footerTitle || group.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C95745] transition-transform duration-200 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 bg-[#EDEAE4]/30 border-t border-[#DED9D0] space-y-3">
                    <ul className="grid grid-cols-2 gap-2 text-xs">
                      {group.items.map((item, idx) => (
                        <li key={`mob-${group.id}-${idx}`}>
                          <Link
                            href={item.href}
                            className="block py-1 px-1 text-[#555555] hover:text-[#C95745] transition-colors leading-snug truncate"
                            title={item.name}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-[#DED9D0]/60">
                      <Link
                        href={group.viewAllHref}
                        className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C95745] hover:text-[#101B38] inline-flex items-center space-x-1 transition-colors"
                      >
                        <span>VIEW ALL {group.title.toUpperCase()}</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
