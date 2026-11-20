"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";

const INSPIRATION_IMAGES = [
  { id: "insp-1", src: "/uploads/products/1002-2.webp", alt: "Timex Ceramic Tile 1002-2" },
  { id: "insp-2", src: "/uploads/products/5109-insparation-3.webp", alt: "Timex Ceramic Tile 5109-3" },
  { id: "insp-3", src: "/uploads/products/gm91-insparation-1.webp", alt: "Timex Ceramic Tile GM91-1" },
  { id: "insp-4", src: "/uploads/products/allowy-insparation-1.webp", alt: "Timex Ceramic Tile Allowy-1" },
  { id: "insp-5", src: "/uploads/products/zelij-insparation.webp", alt: "Timex Ceramic Tile Zelij" },
  { id: "insp-6", src: "/uploads/products/wood-story-insparation.webp", alt: "Timex Ceramic Tile Wood Story" },
  { id: "insp-7", src: "/uploads/products/6016-insparation.webp", alt: "Timex Ceramic Tile 6016" },
  { id: "insp-8", src: "/uploads/products/6014-instaration.webp", alt: "Timex Ceramic Tile 6014" },
];

export function InspirationGallerySection() {
  const col1Images = INSPIRATION_IMAGES.filter((_, idx) => idx % 2 === 0);
  const col2Images = INSPIRATION_IMAGES.filter((_, idx) => idx % 2 === 1);

  // Duplicated list to create infinite seamless vertical loop
  const col1Items = [...col1Images, ...col1Images];
  const col2Items = [...col2Images, ...col2Images];

  return (
    <section className="py-20 md:py-28 relative z-10 bg-[#EDEAE4] border-b border-[#DED9D0] overflow-hidden">
      {/* Inline Keyframe Styles for Continuous Vertical Marquee Animation */}
      <style jsx global>{`
        @keyframes marqueeVerticalUp {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes marqueeVerticalDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0%);
          }
        }
        .animate-marquee-up {
          animation: marqueeVerticalUp 32s linear infinite;
        }
        .animate-marquee-down {
          animation: marqueeVerticalDown 32s linear infinite;
        }
        .animate-marquee-up:hover,
        .animate-marquee-down:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Side: Content & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal direction="up">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#101B38] leading-[1.15]">
                Transform Your Space with the Power of Design
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.08}>
              <p className="text-xs sm:text-sm text-[#333333] font-normal leading-relaxed max-w-lg">
                Your space is more than just walls and floors-it’s a reflection of your personality, taste, and lifestyle. From kitchens to living rooms, and bathrooms to outdoor spaces, our designs are crafted to elevate every corner of your home. Let these inspiring images spark your creativity and help you envision the perfect space. Whether you dream of a minimalist retreat or a bold and vibrant setting, your transformation is just a tile away. Explore, imagine, and create a home that truly reflects you with{" "}
                <Link
                  href="https://www.timexceramic.com/about-us/"
                  className="underline underline-offset-2 hover:text-[#C95745] font-medium transition-colors"
                >
                  Timex Ceramic
                </Link>
                .
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.2} className="pt-2">
              <Link
                href="/inspiration"
                className="group text-xs font-semibold text-[#101B38] hover:text-[#C95745] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors font-sans pb-2 border-b border-[#D8D3C8] hover:border-[#C95745]"
              >
                <span>VIEW ALL DESIGNS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Reveal>
          </div>

          {/* Right Side: Animated Vertical Scrolling Gallery */}
          <div className="lg:col-span-7 relative h-[480px] sm:h-[540px] md:h-[600px] overflow-hidden rounded-[2px]">
            {/* Top & Bottom Gradient Fades */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#EDEAE4] to-transparent z-20"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#EDEAE4] to-transparent z-20"></div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 h-full">
              {/* Column 1: Moves Upward */}
              <div className="overflow-hidden relative h-full">
                <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 animate-marquee-up">
                  {col1Items.map((item, idx) => (
                    <div
                      key={`col1-${item.id}-${idx}`}
                      className="group/card relative aspect-[3/4] rounded-[2px] overflow-hidden bg-[#101B38] border border-[#DED9D0] shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 50vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Moves Downward */}
              <div className="overflow-hidden relative h-full">
                <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 animate-marquee-down">
                  {col2Items.map((item, idx) => (
                    <div
                      key={`col2-${item.id}-${idx}`}
                      className="group/card relative aspect-[3/4] rounded-[2px] overflow-hidden bg-[#101B38] border border-[#DED9D0] shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 50vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
