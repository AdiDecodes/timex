"use client";

import React, { useState } from "react";
import { CollectionSeoData } from "@/data/collectionSeoData";
import { CheckCircle2, ChevronDown, Sparkles, HelpCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BrickCollectionContent } from "./BrickCollectionContent";
import { MarbleCollectionContent } from "./MarbleCollectionContent";
import { HexagonCollectionContent } from "./HexagonCollectionContent";
import { ModularCollectionContent } from "./ModularCollectionContent";
import { StoneCollectionContent } from "./StoneCollectionContent";
import { SubwayCollectionContent } from "./SubwayCollectionContent";
import { MoroccanCollectionContent } from "./MoroccanCollectionContent";
import { OctagonalCollectionContent } from "./OctagonalCollectionContent";
import { WoodenCollectionContent } from "./WoodenCollectionContent";
import { TextureCollectionContent } from "./TextureCollectionContent";
import { ColourfulCollectionContent } from "./ColourfulCollectionContent";
import { TropicalCollectionContent } from "./TropicalCollectionContent";
import { MetallicCollectionContent } from "./MetallicCollectionContent";
import { HighlighterCollectionContent } from "./HighlighterCollectionContent";
import { MosaicCollectionContent } from "./MosaicCollectionContent";
import { BoutiqueCollectionContent } from "./BoutiqueCollectionContent";
import { FrenchFramesCollectionContent } from "./FrenchFramesCollectionContent";
import { FabricCollectionContent } from "./FabricCollectionContent";

export function CollectionSeoSection({ seoData }: { seoData: CollectionSeoData }) {
  if (seoData.slug === "brick") {
    return <BrickCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "marble") {
    return <MarbleCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "hexagon") {
    return <HexagonCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "modular") {
    return <ModularCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "stone") {
    return <StoneCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "subway") {
    return <SubwayCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "moroccan") {
    return <MoroccanCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "octagonal") {
    return <OctagonalCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "wooden") {
    return <WoodenCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "texture") {
    return <TextureCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "colourful" || seoData.slug === "colorful") {
    return <ColourfulCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "tropical") {
    return <TropicalCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "metallic") {
    return <MetallicCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "highlighter") {
    return <HighlighterCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "mosaic") {
    return <MosaicCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "boutique") {
    return <BoutiqueCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "french-frames" || seoData.slug === "french-frame") {
    return <FrenchFramesCollectionContent faqs={seoData.faqs} />;
  }
  if (seoData.slug === "fabric") {
    return <FabricCollectionContent faqs={seoData.faqs} />;
  }

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // First FAQ open by default

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="w-full mt-20 border-t border-[#DED9D0] bg-[#EDEAE4] py-20 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-16 relative z-10">
        {/* 1. Main Header & Intro */}
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-[#C95745]/10 text-[#C95745] px-3.5 py-1 rounded-[2px] text-[10px] font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design & Buying Guide</span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#101B38] leading-tight tracking-tight">
            {seoData.title}
          </h2>

          <p className="text-base md:text-lg text-[#333333] font-normal leading-relaxed">
            {seoData.subtitle}
          </p>

          {seoData.introText && (
            <p className="text-sm text-[#333333]/80 font-light leading-relaxed pt-2">
              {seoData.introText}
            </p>
          )}
        </div>

        {/* 2. Explore Range Grid */}
        {seoData.usageItems && seoData.usageItems.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#101B38] flex items-center space-x-2 border-b border-[#DED9D0] pb-3">
              <span>{seoData.usageTitle || "Explore Our Range"}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {seoData.usageItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FCFBF8] border border-[#DED9D0] p-6 rounded-[2px] shadow-xs hover:border-[#101B38]/40 transition-all duration-300 space-y-2 group"
                >
                  <div className="flex items-center space-x-2 font-medium text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#C95745] flex-shrink-0" />
                    <span className="text-[#101B38] font-serif text-lg font-bold transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#333333]/70 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Why Choose & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className={`${seoData.closingText && seoData.closingText.trim() !== "" ? "lg:col-span-7" : "lg:col-span-12"} bg-[#FCFBF8] border border-[#DED9D0] p-8 rounded-[2px] shadow-xs space-y-5`}>
            <h3 className="font-serif text-2xl font-bold text-[#101B38]">
              {seoData.whyChooseTitle || "Why Choose This Collection?"}
            </h3>
            <p className="text-sm text-[#333333]/80 font-light leading-relaxed">
              {seoData.whyChooseText}
            </p>

            {seoData.benefits && seoData.benefits.length > 0 && (
              <div className="pt-4 border-t border-[#EDEAE4] space-y-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C95745] block">
                  {seoData.benefitsTitle || "Key Benefits:"}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {seoData.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs font-medium text-[#333333]">
                      <ShieldCheck className="w-4 h-4 text-[#C95745] flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Elevate Your Space Banner */}
          {seoData.closingText && seoData.closingText.trim() !== "" && (
            <div className="lg:col-span-5 bg-[#101B38] text-[#FCFBF8] p-8 rounded-[2px] border border-[#101B38] shadow-lg flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] tracking-widest text-[#C95745] font-semibold uppercase block">
                  Elevate Your Space
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#FCFBF8]">Timex Ceramic Excellence</h4>
                <p className="text-xs text-[#EDEAE4]/80 font-light leading-relaxed">
                  {seoData.closingText}
                </p>
              </div>
              <a
                href="/contact"
                className="group self-start inline-flex items-center gap-1.5 text-xs font-semibold text-[#FCFBF8] hover:text-[#C95745] pb-2 border-b border-[#EDEAE4]/35 hover:border-[#C95745] transition-colors uppercase tracking-wider font-sans"
              >
                <span>Request Sample Board</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          )}
        </div>

        {/* 5. FAQs Accordion */}
        {seoData.faqs && seoData.faqs.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center space-x-3 border-b border-[#DED9D0] pb-4">
              <div className="p-2.5 bg-[#101B38] text-[#FCFBF8] rounded-[2px]">
                <HelpCircle className="w-5 h-5 text-[#FCFBF8]" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#101B38]">
                  {seoData.faqTitle || "Frequently Asked Questions"}
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-[#C95745] font-semibold">
                  Got questions? We have answers.
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {seoData.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.id || `faq-${idx}`}
                    className="bg-[#FCFBF8] border border-[#DED9D0] rounded-[2px] overflow-hidden transition-all duration-300 shadow-xs"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif text-base font-bold text-[#101B38]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#101B38] transition-transform duration-300 flex-shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-2 text-xs md:text-sm text-[#333333]/80 font-light leading-relaxed border-t border-[#EDEAE4] bg-[#F7F5F0]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. Bottom Closing Section (Below FAQ) */}
        {seoData.bottomText && (
          <div className="pt-6 border-t border-[#DED9D0]">
            <div className="bg-[#101B38] text-[#FCFBF8] p-8 md:p-10 rounded-[2px] border border-[#101B38] shadow-lg space-y-4">
              <div className="inline-flex items-center space-x-2 bg-[#C95745]/20 text-[#FCFBF8] px-3.5 py-1 rounded-[2px] text-[10px] font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#C95745]" />
                <span>Timex Ceramic Excellence</span>
              </div>
              <h3 className="font-serif text-2xl md:text-4xl font-bold text-[#FCFBF8] tracking-tight">
                {seoData.bottomTitle || "Elevate Your Space with Timex Ceramic"}
              </h3>
              <p className="text-xs md:text-sm text-[#EDEAE4]/80 font-light leading-relaxed max-w-4xl">
                {seoData.bottomText}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
