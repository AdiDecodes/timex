"use client";

import React, { useState } from "react";
import {
  Code,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Save,
  Wand2,
  FileCheck,
  Layers,
  Sparkles,
} from "lucide-react";

const SCHEMA_TYPES = [
  "Product",
  "Article",
  "BlogPosting",
  "NewsArticle",
  "Service",
  "LocalBusiness",
  "Organization",
  "Person",
  "FAQPage",
  "HowTo",
  "VideoObject",
  "BreadcrumbList",
  "WebPage",
  "Review",
  "Event",
];

const TEMPLATES: Record<string, any> = {
  Product: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Timex Statuario Royal Vitrified Slab",
    "image": "https://www.timexceramic.com/images/og-image.jpg",
    "description": "Luxury imported vitrified porcelain tile surface for residential and commercial spaces.",
    "sku": "TMX-SKU-STATUARIO",
    "brand": {
      "@type": "Brand",
      "name": "Timex Ceramic"
    },
    "offers": {
      "@type": "Offer",
      "price": "240.00",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": "https://www.timexceramic.com/products"
    }
  },
  Article: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Modern Ceramic & Vitrified Tile Design Trends for 2026",
    "image": "https://www.timexceramic.com/images/og-image.jpg",
    "author": {
      "@type": "Person",
      "name": "Timex Design Editorial"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Timex Ceramic",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.timexceramic.com/wp-content/uploads/2023/07/Timex-Ceramic-Logo.png"
      }
    },
    "datePublished": "2026-09-23T10:00:00Z"
  },
  LocalBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Timex Ceramic Mumbai Experience Centre",
    "image": "https://www.timexceramic.com/images/og-image.jpg",
    "telephone": "+91-22-26122960",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "402, Pratik Avenue, Opp. Shiv Sagar Rest., Nehru Road, Vile Parle (E)",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400057",
      "addressCountry": "IN"
    },
    "openingHours": "Mo-Sa 10:00-19:00"
  },
  Organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Timex Ceramic",
    "url": "https://www.timexceramic.com",
    "logo": "https://www.timexceramic.com/wp-content/uploads/2023/07/Timex-Ceramic-Logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-22-26122960",
      "contactType": "Customer Service"
    }
  },
  FAQPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the water absorption rate of Timex porcelain tiles?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Timex vitrified porcelain slabs feature an impervious water absorption rate of less than 0.05%."
        }
      },
      {
        "@type": "Question",
        "name": "Can Timex tiles be used for exterior facades?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our full body vitrified slabs are engineered for extreme weather and UV resistance."
        }
      }
    ]
  },
  BreadcrumbList: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.timexceramic.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "World of Tiles",
        "item": "https://www.timexceramic.com/world-of-tiles"
      }
    ]
  },
  WebPage: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "3D Room Visualiser | Timex Ceramic",
    "description": "Experience virtual reality tile placement inside 3D architectures."
  }
};

export function SchemaManagerTab() {
  const [activeSubTab, setActiveSubTab] = useState<"templates" | "generator" | "validator">("generator");
  const [selectedType, setSelectedType] = useState<string>("Product");
  const [jsonText, setJsonText] = useState<string>(
    JSON.stringify(TEMPLATES.Product, null, 2)
  );
  const [copied, setCopied] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  // Template switch
  const handleSelectTemplate = (type: string) => {
    setSelectedType(type);
    const tmpl = TEMPLATES[type] || {
      "@context": "https://schema.org",
      "@type": type,
      "name": `Sample ${type} for Timex Ceramic`,
      "url": "https://www.timexceramic.com"
    };
    setJsonText(JSON.stringify(tmpl, null, 2));
    setValidationResult(null);
  };

  // Live validator logic
  const handleValidate = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const parsed = JSON.parse(jsonText);

      // Schema.org checks
      if (!parsed["@context"] || !parsed["@context"].includes("schema.org")) {
        errors.push("Missing or invalid '@context'. Must be 'https://schema.org'.");
      }
      if (!parsed["@type"]) {
        errors.push("Missing '@type' declaration.");
      }

      // Type-specific requirements
      if (parsed["@type"] === "Product") {
        if (!parsed.name) errors.push("Product schema requires 'name'.");
        if (!parsed.image) warnings.push("Google recommends providing an 'image' for Product rich results.");
        if (!parsed.offers) warnings.push("Google recommends providing 'offers' (price & availability) for Product snippets.");
      }

      if (parsed["@type"] === "Article" || parsed["@type"] === "BlogPosting") {
        if (!parsed.headline) errors.push("Article requires a 'headline'.");
        if (!parsed.author) warnings.push("Article should specify 'author' for Google News & Discover.");
      }

      if (parsed["@type"] === "LocalBusiness") {
        if (!parsed.address) errors.push("LocalBusiness requires an 'address'.");
        if (!parsed.telephone) warnings.push("Providing 'telephone' improves local map visibility.");
      }

      setValidationResult({
        valid: errors.length === 0,
        errors,
        warnings,
      });
    } catch (e: any) {
      setValidationResult({
        valid: false,
        errors: [`JSON Syntax Error: ${e.message}`],
        warnings: [],
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Structured Schema Engine</h2>
          <p className="text-xs text-gray-400">
            Generate, customize, and validate Schema.org JSON-LD structured data for Google Rich Results.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1 bg-[#111827] border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab("generator")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeSubTab === "generator" ? "bg-[#c5a880] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" /> Generator
          </button>
          <button
            onClick={() => setActiveSubTab("templates")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeSubTab === "templates" ? "bg-[#c5a880] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Templates
          </button>
          <button
            onClick={() => {
              setActiveSubTab("validator");
              handleValidate();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeSubTab === "validator" ? "bg-[#c5a880] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" /> Validator
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Type Selection & Templates */}
        <div className="space-y-4">
          <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-gray-200">Schema Type:</span>
            <div className="grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-1">
              {SCHEMA_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => handleSelectTemplate(t)}
                  className={`px-3 py-2 rounded-xl text-left font-mono text-xs font-semibold transition-all cursor-pointer truncate ${
                    selectedType === t
                      ? "bg-[#c5a880] text-black shadow-md shadow-[#c5a880]/20"
                      : "bg-[#090d16] text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#111827] border border-white/10 rounded-2xl space-y-2">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
              Google Rich Results Tips
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Google uses JSON-LD to power rich snippets (product prices, ratings, FAQ accordions, and organization breadcrumbs).
            </p>
          </div>
        </div>

        {/* Right 2 Cols: JSON Editor & Validator Feedback */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-3 flex flex-col h-[520px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-[#c5a880]" />
                JSON-LD Editor ({selectedType})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={handleValidate}
                  className="px-3 py-1 rounded-lg bg-[#c5a880] text-black text-xs font-bold hover:bg-[#d8bc93] cursor-pointer"
                >
                  Validate
                </button>
              </div>
            </div>

            {/* Code textarea */}
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="flex-1 w-full bg-[#090d16] border border-white/10 rounded-xl p-4 font-mono text-xs text-emerald-400 focus:outline-none focus:border-[#c5a880] resize-none"
              spellCheck={false}
            />

            {/* Live Validator Box */}
            {validationResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  validationResult.valid
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {validationResult.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>
                    {validationResult.valid
                      ? "Valid JSON-LD Schema • Passed Syntax & Schema.org Checks"
                      : "Validation Errors Detected"}
                  </span>
                </div>

                {validationResult.errors.map((err, idx) => (
                  <p key={idx} className="text-[11px] text-rose-400 pl-6">
                    • {err}
                  </p>
                ))}

                {validationResult.warnings.map((warn, idx) => (
                  <p key={idx} className="text-[11px] text-amber-400 pl-6">
                    • Warning: {warn}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
