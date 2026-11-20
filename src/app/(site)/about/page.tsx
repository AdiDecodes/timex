import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Reveal } from "@/components/animations/Reveal";
import { Award, Shield, Cpu, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/about");
  return buildPageMetadata(seo);
}

export default function AboutPage() {
  const coreValues = [
    { icon: <Award className="w-6 h-6 text-[#C95745]" />, title: "Italian Artistry", desc: "Collaborating with Milan's elite styling studios to capture realistic surface patterns." },
    { icon: <Cpu className="w-6 h-6 text-[#C95745]" />, title: "Precision Engineering", desc: "Baked at 1200°C for exceptional durability, scratch resilience, and structural longevity." },
    { icon: <Shield className="w-6 h-6 text-[#C95745]" />, title: "Certified Standards", desc: "Rigorous quality certifications across water absorption, friction coefficients, and load stress." },
    { icon: <Clock className="w-6 h-6 text-[#C95745]" />, title: "22+ Years Legacy", desc: "Pioneering premium designer tiles and bathware since 2004, serving thousands of custom homes." }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] relative overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="py-20 md:py-28 relative z-10 bg-[#EDEAE4] border-b border-[#DED9D0]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] tracking-[0.3em] text-[#C95745] font-semibold uppercase block">Our Heritage</span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#101B38] leading-tight tracking-tight">
            Defining Premium Surfaces
          </h1>
          <div className="w-16 h-[2px] bg-[#C95745] mx-auto my-4" />
          <p className="text-sm md:text-base text-[#333333]/80 font-light max-w-2xl mx-auto leading-relaxed">
            Discover the design philosophy, scientific engineering, and service commitment behind India&apos;s premier imported tiles supplier.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        <Reveal direction="left">
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.25em] text-[#C95745] font-semibold uppercase block">Luxury in Details</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#101B38]">
              Over Two Decades of Crafting Elegance
            </h2>
            <p className="text-sm text-[#333333]/80 font-light leading-relaxed">
              Timex Ceramic stands as an industry benchmark in India for luxury tiles, vitrified slabs, and modern sanitaryware. From our flagship showroom in Mumbai to corporate landmarks nationwide, we curate international-class surfaces for discerning architects and interior designers.
            </p>
            <div className="border-l-2 border-[#C95745] pl-6 py-3 italic text-sm text-[#101B38] font-light bg-[#EDEAE4]">
              &ldquo;We specialize in importing high-fidelity porcelain, mosaics, and technical tiles that capture the warmth of genuine materials.&rdquo;
            </div>
            <p className="text-sm text-[#333333]/80 font-light leading-relaxed">
              We specialize in importing high-fidelity porcelain, mosaics, and technical tiles that capture the warmth of natural hardwood, the grandeur of Italian statuario, and the minimalism of industrial concrete. Every tile series undergoes strict quality validation to ensure compliance with heavy commercial traffic requirements.
            </p>
          </div>
        </Reveal>

        <Reveal direction="right" className="relative">
          <div className="relative z-10 w-full h-[450px] rounded-[2px] overflow-hidden shadow-md border border-[#EDEAE4] group">
            <Image
              src="/images/banners/hero.webp"
              alt="Timex Ceramic Office"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Subtle architectural border frame */}
          <div className="absolute -top-3 -left-3 w-full h-full border border-[#101B38]/20 rounded-[2px] -z-10 pointer-events-none" />
        </Reveal>
      </section>

      {/* Core Values */}
      <section className="py-24 relative z-10 bg-[#EDEAE4] border-t border-[#DED9D0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] tracking-[0.25em] text-[#C95745] font-semibold uppercase block">The Timex Edge</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#101B38]">Our Core Pillars</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, idx) => (
              <Reveal key={v.title} direction="up" delay={idx * 0.1}>
                <Card className="bg-[#FCFBF8] p-8 rounded-[2px] border border-[#DED9D0] shadow-xs h-full flex flex-col justify-between min-h-[260px] hover:border-[#101B38]/30 transition-all">
                  <div className="space-y-4">
                    <div className="p-3 bg-[#EDEAE4] rounded-[2px] w-fit">
                      {v.icon}
                    </div>
                    <h4 className="font-serif text-xl font-bold text-[#101B38]">{v.title}</h4>
                    <p className="text-xs text-[#333333]/70 font-light leading-relaxed">{v.desc}</p>
                  </div>
                  <div className="w-8 h-[2px] bg-[#C95745] mt-6" />
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
