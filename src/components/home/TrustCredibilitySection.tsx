"use client";

import React from "react";
import Image from "next/image";
import { 
  Trophy, 
  Globe, 
  Layers, 
  Map, 
  Users, 
  MapPin 
} from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";

interface TrustStat {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  title: string;
  description: string;
}

const TRUST_STATS: TrustStat[] = [
  {
    icon: Trophy,
    value: "25+",
    title: "YEARS OF EXPERTISE",
    description: "A legacy built on tile knowledge and design excellence.",
  },
  {
    icon: Globe,
    value: "4",
    title: "GLOBAL SOURCING MARKETS",
    description: "Spain, Italy, China & Turkey.",
  },
  {
    icon: Layers,
    value: "1000+",
    title: "PREMIUM DESIGNS",
    description: "Curated patterns, textures, colours and finishes.",
  },
  {
    icon: Map,
    value: "Pan-India",
    title: "DEALER NETWORK",
    description: "Bringing premium tile solutions closer to projects across India.",
  },
  {
    icon: Users,
    value: "Trusted by",
    title: "DESIGN PROFESSIONALS",
    description: "Chosen by architects, designers and builders.",
  },
  {
    icon: MapPin,
    value: "Mumbai",
    title: "EXPERIENCE CENTRE",
    description: "Explore collections and experience the Timex difference.",
  },
];

function getStatBorderClasses(index: number): string {
  const classes: string[] = ["border-[#E2DED6]"];

  // Mobile (2 columns): right border on left items (even indices)
  if (index % 2 === 0) {
    classes.push("border-r");
  }
  // Mobile (2 columns): bottom border on rows 1 and 2 (indices 0, 1, 2, 3)
  if (index < 4) {
    classes.push("border-b");
  }

  // Tablet (3 columns): right border on cols 0 & 1 (indices % 3 !== 2)
  if (index % 3 !== 2) {
    classes.push("md:border-r");
  } else {
    classes.push("md:border-r-0");
  }
  // Tablet (3 columns): bottom border on row 1 (indices 0, 1, 2)
  if (index < 3) {
    classes.push("md:border-b");
  } else {
    classes.push("md:border-b-0");
  }

  // Desktop (6 columns): right border on items 0-4, none on item 5
  if (index < 5) {
    classes.push("lg:border-r");
  } else {
    classes.push("lg:border-r-0");
  }
  // Desktop (6 columns): no horizontal bottom border
  classes.push("lg:border-b-0");

  return classes.join(" ");
}

export function TrustCredibilitySection() {
  return (
    <section className="relative z-10 bg-[#F7F5F0] overflow-hidden border-b border-[#E2DED6] m-0 p-0">
      {/* 1. Top Feature Area: Editorial Split Layout (Photo Left Touching Hero, Text Right; On Mobile: Text First, Photo Below) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 items-stretch m-0 p-0">
        {/* Left Column (Desktop) / Second (Mobile): Architectural Photo */}
        <div className="order-2 md:order-1 relative w-full h-[340px] sm:h-[420px] md:h-full min-h-[340px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[500px] xl:min-h-[540px] overflow-hidden">
          <Image
            src="/uploads/products/Luxury-Pool-Terrace-at-Sunset.webp"
            alt="Timex Ceramic - 25+ Years of Curating Exceptional Surfaces"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
            priority
          />
        </div>

        {/* Right Column (Desktop) / First (Mobile): Editorial Statement */}
        <div className="order-1 md:order-2 flex flex-col justify-center px-6 sm:px-10 md:px-10 lg:px-14 xl:px-20 2xl:px-24 py-12 sm:py-16 md:py-18 lg:py-20 xl:py-24">
          <div className="max-w-xl">
            {/* Eyebrow with elegant horizontal divider line */}
            <Reveal direction="up">
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <span className="text-[11px] sm:text-xs tracking-[0.25em] text-[#C95745] font-bold uppercase font-sans">
                  A LEGACY OF DESIGN &amp; TRUST
                </span>
                <div className="h-[1px] flex-1 max-w-[100px] sm:max-w-[140px] bg-[#E2DED6]" />
              </div>
            </Reveal>

            {/* Editorial Heading */}
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-[52px] font-normal text-[#101B38] tracking-tight leading-[1.14] mb-5 sm:mb-6">
                25+ Years of Curating <br />
                Exceptional Surfaces
              </h2>
            </Reveal>

            {/* Supporting Description */}
            <Reveal direction="up" delay={0.15}>
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#333333]/85 font-normal leading-relaxed">
                From globally sourced tiles to thoughtfully curated collections, Timex Ceramic brings together international design, quality and expertise to help create spaces that stand apart.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* 2. Bottom Statistics Row: 6 Highlight Columns */}
      <div className="w-full border-t border-[#E2DED6]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {TRUST_STATS.map((item, index) => {
            const Icon = item.icon;
            const borderClasses = getStatBorderClasses(index);

            return (
              <div 
                key={item.title} 
                className={`${borderClasses} flex flex-col`}
              >
                <Reveal 
                  direction="up" 
                  delay={0.04 * index}
                  className="h-full"
                >
                  <div className="px-4 sm:px-5 lg:px-4 xl:px-6 py-8 sm:py-10 md:py-11 lg:py-12 flex flex-col items-center text-center justify-start h-full group">
                    {/* Line Icon */}
                    <div className="mb-3 sm:mb-4 text-[#101B38] group-hover:text-[#C95745] transition-colors duration-300">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.25]" />
                    </div>

                    {/* Value */}
                    <div className="font-serif text-2xl sm:text-3xl lg:text-[28px] xl:text-[36px] font-normal text-[#101B38] tracking-tight mb-1.5 sm:mb-2 leading-none">
                      {item.value}
                    </div>

                    {/* Title */}
                    <h3 className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#101B38] mb-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Supporting Description */}
                    <p className="font-sans text-xs text-[#333333]/70 font-light leading-relaxed max-w-[210px]">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
