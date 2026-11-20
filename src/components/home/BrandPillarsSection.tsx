"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Flame, Award, ArrowRight, ShieldCheck, Palette, Layers, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";

interface Pillar {
  id: string;
  number: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  icon: any;
  techSpecs: string[];
  link: string;
  linkText: string;
}

const PILLARS: Pillar[] = [
  {
    id: "artistry",
    number: "01",
    badge: "Italian Artistry",
    title: "Milan Designer Collaboration",
    highlight: "Milan Studio Studio Certified",
    description:
      "Collaborating with leading design studios in Milan to render marble veins, organic wood grains, and raw concrete textures with absolute graphic fidelity and 3D surface depth.",
    icon: Palette,
    techSpecs: ["3D Vein Matching", "High-Def Digital Printing", "Authentic Texture Relief"],
    link: "/products?category=moroccan",
    linkText: "Explore Italian Designs",
  },
  {
    id: "tech",
    number: "02",
    badge: "Vitrification Tech",
    title: "Precision Baking at 1200°C",
    highlight: "Zero Absorption Sintered Tech",
    description:
      "Vitrified porcelain engineered in high-tonnage hydraulic presses and baked at 1200°C for heavy load resilience, absolute stain protection, zero liquid absorption, and slip-resistant safety ratings.",
    icon: Flame,
    techSpecs: ["< 0.05% Water Absorption", "Mohs 8 Hardness Rating", "Thermal Shock Resistant"],
    link: "/products?material=porcelain",
    linkText: "View Porcelain Specs",
  },
  {
    id: "heritage",
    number: "03",
    badge: "Corporate Heritage",
    title: "22+ Years of Reliability",
    highlight: "Trusted Nationwide Partner",
    description:
      "Trusted by leading real estate developers, interior designers, and architects nationwide to supply premium commercial landmarks, airports, luxury hotels, and residential estates.",
    icon: Award,
    techSpecs: ["500+ Landmark Projects", "ISO 9001:2015 Certified", "Nationwide Dealer Hubs"],
    link: "/about",
    linkText: "Discover Our Legacy",
  },
];

export function BrandPillarsSection() {
  const [activeCard, setActiveCard] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32 relative z-10 overflow-hidden bg-[#F7F5F0] border-b border-[#EDEAE4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <Reveal direction="up">
            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#C95745] uppercase bg-[#C95745]/10 px-4 py-1.5 rounded-[2px] border border-[#C95745]/20 inline-block">
              Engineering &amp; Aesthetic Standards
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#101B38] tracking-tight">
              Pillars of Architectural Excellence
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="text-xs md:text-sm text-[#333333] font-normal leading-relaxed">
              Every Timex surface is a synthesis of Italian design mastery, cutting-edge thermal vitrification technology, and over two decades of corporate trust.
            </p>
          </Reveal>
        </div>

        {/* 3 Interactive Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isActive = activeCard === idx;

            return (
              <Reveal key={pillar.id} direction="up" delay={idx * 0.15}>
                <div
                  onMouseEnter={() => setActiveCard(idx)}
                  className={`relative group rounded-[2px] p-8 md:p-10 transition-all duration-500 border flex flex-col justify-between h-full min-h-[440px] cursor-pointer overflow-hidden ${
                    isActive
                      ? "bg-[#FCFBF8] border-[#101B38] shadow-lg"
                      : "bg-[#FCFBF8] border-[#EDEAE4] shadow-xs hover:border-[#101B38]/40"
                  }`}
                >
                  {/* Card Content Top */}
                  <div className="relative z-10 space-y-6">
                    {/* Header Row with Icon Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-14 h-14 rounded-[2px] flex items-center justify-center transition-all duration-300 shadow-xs ${
                          isActive
                            ? "bg-[#101B38] text-[#FCFBF8]"
                            : "bg-[#EDEAE4] text-[#101B38] group-hover:bg-[#C95745] group-hover:text-[#FCFBF8]"
                        }`}
                      >
                        <Icon className="w-7 h-7 stroke-[1.5]" />
                      </div>

                      <span className="text-[9px] font-semibold tracking-[0.25em] text-[#C95745] uppercase bg-[#EDEAE4] px-3 py-1 rounded-[2px] border border-[#DED9D0]">
                        {pillar.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-3 pt-2">
                      <h3 className="font-serif text-2xl font-normal text-[#101B38] leading-snug group-hover:text-[#C95745] transition-colors duration-300">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-[#555555] font-normal leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>

                    {/* Interactive Tech Specs list */}
                    <div className="pt-2 space-y-2 border-t border-[#EDEAE4]">
                      {pillar.techSpecs.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center space-x-2.5 text-[11px] text-[#333333] font-medium"
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 flex-shrink-0 transition-colors duration-300 ${
                              isActive ? "text-[#C95745]" : "text-gray-400"
                            }`}
                          />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA Link */}
                  <div className="relative z-10 pt-8 mt-6 border-t border-[#EDEAE4] flex items-center justify-between">
                    <Link
                      href={pillar.link}
                      className={`text-xs font-semibold uppercase tracking-widest flex items-center space-x-2 transition-all duration-300 ${
                        isActive
                          ? "text-[#101B38]"
                          : "text-gray-500 group-hover:text-[#C95745]"
                      }`}
                    >
                      <span>{pillar.linkText}</span>
                      <ArrowRight
                        className={`w-4 h-4 transform transition-transform duration-300 ${
                          isActive ? "translate-x-1.5 text-[#C95745]" : "group-hover:translate-x-1"
                        }`}
                      />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
