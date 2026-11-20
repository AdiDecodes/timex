import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Reveal } from "@/components/animations/Reveal";
import Card from "@/components/ui/Card";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/projects");
  return buildPageMetadata(seo);
}

export default function ProjectsPage() {
  const projects = [
    { title: "The Imperial Heights", location: "Mumbai", scope: "Luxury Penthouse Floors", tiles: "Carrara Gold Glazed Vitrified", image: "/images/spaces/living-room.svg" },
    { title: "Grand Atrium Lobby", location: "Delhi NCR", scope: "Commercial Reception", tiles: "Statuario Extra Premium", image: "/images/spaces/commercial.svg" },
    { title: "Marina Bay Condos", location: "Goa", scope: "Outdoor Terrace & Pool Deck", tiles: "Nero Slate Textured Anti-Skid", image: "/images/spaces/outdoor.svg" }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <section className="bg-[#EDEAE4] py-16 md:py-24 border-b border-[#DED9D0]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] tracking-[0.25em] text-[#C95745] font-semibold uppercase block">Our Footprint</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#101B38]">Featured Projects</h1>
          <p className="text-xs md:text-sm text-[#333333]/70 font-light max-w-xl mx-auto leading-relaxed">
            Take a look at commercial high-rises and private luxury homes nationwide that trust Timex Ceramic for architectural longevity.
          </p>
        </div>
      </section>

      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, idx) => (
            <Reveal key={p.title} direction="up" delay={idx * 0.1}>
              <Card className="group bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] shadow-xs hover:border-[#101B38]/30 transition-all h-full overflow-hidden">
                <div className="relative h-64 w-full overflow-hidden bg-[#EDEAE4]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101B38]/80 to-transparent" />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-xl font-bold text-[#101B38]">{p.title}</h3>
                    <span className="text-[10px] bg-[#EDEAE4] px-2.5 py-0.5 rounded-[2px] text-[#101B38] font-medium">{p.location}</span>
                  </div>
                  <div className="text-xs text-[#333333]/70 font-light space-y-1">
                    <p><strong className="font-medium text-[#101B38]">Scope:</strong> {p.scope}</p>
                    <p><strong className="font-medium text-[#101B38]">Material:</strong> {p.tiles}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
