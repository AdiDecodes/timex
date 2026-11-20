import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Compass,
  Layers,
  Home as HomeIcon,
  Sparkles,
  FileText,
  ExternalLink,
} from "lucide-react";
import { getSeoMetadata, buildPageMetadata } from "@/services/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/sitemap");
  return buildPageMetadata({
    ...seo,
    title: seo.title || "HTML Sitemap – Timex Ceramic",
    description:
      seo.description ||
      "Navigate all pages, designer tile collections, spatial concepts, and architectural design tools across Timex Ceramic.",
    canonicalUrl: seo.canonicalUrl || "https://www.timexceramic.com/sitemap",
  });
}

interface SitemapLink {
  title: string;
  href: string;
  description?: string;
}

interface SitemapSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  links: SitemapLink[];
}

const SITEMAP_SECTIONS: SitemapSection[] = [
  {
    id: "main-company",
    title: "Company & Experience",
    description: "Brand overview, showroom visits, and official company channels.",
    icon: HomeIcon,
    links: [
      { title: "Home", href: "/", description: "Discover luxury wall & floor tiles" },
      { title: "About Us", href: "/about", description: "Our heritage, philosophy & craftsmanship" },
      { title: "World of Tiles", href: "/world-of-tiles", description: "Comprehensive tile category portfolio" },
      { title: "Inspiration Gallery", href: "/inspiration", description: "Architectural & spatial tile ideas" },
      { title: "Completed Projects", href: "/projects", description: "Residential & commercial showcase" },
      { title: "Book a Showroom Visit", href: "/book-a-showroom-visit", description: "Schedule a Mumbai Experience Centre tour" },
      { title: "Contact Us", href: "/contact", description: "Get in touch with our design team" },
      { title: "Disclaimer", href: "/disclaimer", description: "Legal notice & website terms of use" },
    ],
  },
  {
    id: "tile-collections",
    title: "Designer Collections",
    description: "Curated surface designs, patterns, and international finishes.",
    icon: Layers,
    links: [
      { title: "All Collections", href: "/collections", description: "Explore all curated collections" },
      { title: "All Products", href: "/products", description: "Browse complete tile catalogue" },
      { title: "Marble Look Tiles", href: "/collections/marble" },
      { title: "Natural Stone Look", href: "/collections/stone" },
      { title: "Wooden Look Tiles", href: "/collections/wooden" },
      { title: "Brick Tiles", href: "/collections/brick" },
      { title: "Hexagon Tiles", href: "/collections/hexagon" },
      { title: "Subway Tiles", href: "/collections/subway" },
      { title: "Moroccan & Decorative", href: "/collections/moroccan" },
      { title: "Modular Tile Designs", href: "/collections/modular" },
      { title: "Octagonal Tiles", href: "/collections/octagonal" },
      { title: "Textured & 3D Surfaces", href: "/collections/texture" },
      { title: "Colourful & Artistic Tiles", href: "/collections/colourful" },
      { title: "Fabric Look Tiles", href: "/collections/fabric" },
      { title: "Tropical Series", href: "/collections/tropical" },
      { title: "Metallic & Contemporary", href: "/collections/metallic" },
      { title: "Highlighter Tiles", href: "/collections/highlighter" },
      { title: "Mosaic & Small Format", href: "/collections/mosaic" },
      { title: "Boutique Collection", href: "/collections/boutique" },
      { title: "French Frames", href: "/collections/french-frames" },
    ],
  },
  {
    id: "tiles-by-space",
    title: "Tiles by Space & Application",
    description: "Specialized tiles designed for specific residential and commercial environments.",
    icon: Compass,
    links: [
      { title: "All Spaces Overview", href: "/spaces" },
      { title: "Applications Overview", href: "/applications" },
      { title: "Bathroom Tiles", href: "/bathroom-tiles" },
      { title: "Kitchen Tiles", href: "/kitchen-tiles" },
      { title: "Living & Dining Room Tiles", href: "/living-dining-room-tiles" },
      { title: "Bedroom Tiles", href: "/bedroom-tiles" },
      { title: "Balcony & Terrace Tiles", href: "/balcony-terrace-tiles" },
      { title: "Elevation & Exterior Tiles", href: "/elevation-exterior-tiles" },
      { title: "Hotel & Hospitality Tiles", href: "/hotel-hospitality-tiles" },
      { title: "Café & Restaurant Tiles", href: "/cafe-restaurant-tiles" },
      { title: "Commercial & Office Tiles", href: "/commercial-office-tiles" },
      { title: "Spa & Wellness Tiles", href: "/spa-wellness-tiles" },
      { title: "Swimming Pool Tiles", href: "/swimming-pool-tiles" },
      { title: "Outdoor & Landscape Tiles", href: "/outdoor-landscape-tiles" },
    ],
  },
  {
    id: "tools-resources",
    title: "Interactive Tools & Resources",
    description: "Visualisation tools, specification portals, and architectural downloads.",
    icon: Sparkles,
    links: [
      { title: "3D Tile Visualiser", href: "/visualiser", description: "Render tiles live in virtual rooms" },
      { title: "Tile Area Calculator", href: "/calculator", description: "Calculate tile boxes & grout needs" },
      { title: "Custom Catalogue Maker", href: "/catalogue-maker", description: "Generate customized product PDF brochures" },
      { title: "Watch & Choose Video Reels", href: "/watch-and-choose", description: "Short-form tile inspiration videos" },
      { title: "Saved Wishlist", href: "/wishlist", description: "Your shortlisted tile finishes" },
      { title: "Product Comparison", href: "/compare", description: "Side-by-side technical specs compare" },
      { title: "Brochures & PDF Downloads", href: "/downloads", description: "Official catalogues & technical sheets" },
      { title: "Design Blog & Editorial", href: "/blogs", description: "Trends, styling guides & architectural tips" },
      { title: "Architect Portal", href: "/architect-portal", description: "Exclusive tools for trade professionals" },
      { title: "Dealer Portal", href: "/dealer-portal", description: "Partner ordering & dealer support" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#333333] pt-28 pb-24 px-6 md:px-10 selection:bg-[#C95745] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#C95745] hover:text-[#101B38] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-8 md:p-12 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-[1px] bg-[#C95745]"></span>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C95745]">
              Navigation Architecture
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#101B38] tracking-tight">
            Website Sitemap
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#333333]/85 font-light leading-relaxed max-w-3xl">
            Explore a structured overview of the entire Timex Ceramic website. Discover our designer tile collections, residential and commercial space solutions, interactive design tools, and architectural resources.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-[#333333]/70 font-normal">
            <FileText className="w-4 h-4 text-[#C95745]" />
            <span>Search engines and automated crawlers can also access the machine-readable</span>
            <Link
              href="/sitemap.xml"
              className="text-[#C95745] hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>XML Sitemap</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Sitemap Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SITEMAP_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-7 sm:p-9 shadow-xs hover:border-[#C95745]/40 transition-colors duration-300 flex flex-col"
              >
                {/* Section Header */}
                <div className="pb-5 mb-5 border-b border-[#EDEAE4]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-[2px] bg-[#101B38] text-white flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#C95745]" />
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#101B38] tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-xs text-[#333333]/75 font-light pl-11">
                    {section.description}
                  </p>
                </div>

                {/* Section Links List */}
                <ul className="space-y-2.5 flex-1 pl-1">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex flex-col py-1 text-xs sm:text-sm text-[#101B38] hover:text-[#C95745] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C95745]/60 group-hover:bg-[#C95745] group-hover:scale-125 transition-all shrink-0" />
                          <span className="font-medium group-hover:underline underline-offset-2">
                            {link.title}
                          </span>
                        </div>
                        {link.description && (
                          <span className="text-[11px] text-[#333333]/60 pl-3.5 pt-0.5 group-hover:text-[#333333]/80">
                            {link.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
