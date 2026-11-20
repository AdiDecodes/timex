"use client";

import React, { useState, useEffect } from "react";
import {
  Gauge,
  FileText,
  FileCheck2,
  Tag,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Sliders,
  FileCode,
  Compass,
  AlertCircle,
  Link2Off,
  Share2,
  Bot,
  ShieldAlert,
  Settings,
  Server,
  Sparkles,
  FileCode2,
} from "lucide-react";

import { SeoDashboardTab } from "./SeoDashboardTab";
import { PageSeoTab } from "./PageSeoTab";
import { ContentAnalysisTab } from "./ContentAnalysisTab";
import { KeywordAnalysisTab } from "./KeywordAnalysisTab";
import { InternalLinksTab } from "./InternalLinksTab";
import { ImageSeoTab } from "./ImageSeoTab";
import { SchemaManagerTab } from "./SchemaManagerTab";
import { SitemapTab } from "./SitemapTab";
import { RobotsTab } from "./RobotsTab";
import { RedirectsTab } from "./RedirectsTab";
import { FourZeroFourTab } from "./FourZeroFourTab";
import { BrokenLinksTab } from "./BrokenLinksTab";
import { SocialSeoTab } from "./SocialSeoTab";
import { AeoGeoTab } from "./AeoGeoTab";
import { SiteAuditTab } from "./SiteAuditTab";
import { SeoSettingsTab } from "./SeoSettingsTab";
import { HtaccessTab } from "./HtaccessTab";
import { LlmsTxtTab } from "./LlmsTxtTab";
import { CustomCodeTab } from "./CustomCodeTab";

export type SeoSubTabKey =
  | "seo-dashboard"
  | "page-seo"
  | "content-analysis"
  | "keyword-analysis"
  | "internal-links"
  | "image-seo"
  | "schema"
  | "sitemap"
  | "robots"
  | "redirects"
  | "404-monitor"
  | "broken-links"
  | "social-seo"
  | "aeo-geo"
  | "site-audit"
  | "seo-settings"
  | "htaccess"
  | "llms-txt"
  | "custom-code";

interface SeoManagerClientProps {
  initialSubTab?: SeoSubTabKey;
  onSubTabChange?: (key: SeoSubTabKey) => void;
}

export function SeoManagerClient({ initialSubTab = "seo-dashboard", onSubTabChange }: SeoManagerClientProps) {
  const [activeTab, setActiveTab] = useState<SeoSubTabKey>(initialSubTab);

  useEffect(() => {
    if (initialSubTab && initialSubTab !== activeTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleTabChange = (key: string) => {
    setActiveTab(key as SeoSubTabKey);
    if (onSubTabChange) onSubTabChange(key as SeoSubTabKey);
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation Bar for Quick Navigation within SEO */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
        {[
          { key: "seo-dashboard", label: "Dashboard", icon: Gauge },
          { key: "page-seo", label: "Page SEO", icon: FileText },
          { key: "content-analysis", label: "Content", icon: FileCheck2 },
          { key: "keyword-analysis", label: "Keywords", icon: Tag },
          { key: "internal-links", label: "Internal Links", icon: LinkIcon },
          { key: "image-seo", label: "Image SEO", icon: ImageIcon },
          { key: "schema", label: "Schema", icon: Code },
          { key: "sitemap", label: "Sitemap", icon: Sliders },
          { key: "robots", label: "Robots.txt", icon: FileCode },
          { key: "redirects", label: "Redirects", icon: Compass },
          { key: "404-monitor", label: "404 Monitor", icon: AlertCircle },
          { key: "broken-links", label: "Broken Links", icon: Link2Off },
          { key: "social-seo", label: "Social SEO", icon: Share2 },
          { key: "aeo-geo", label: "AEO / GEO", icon: Bot },
          { key: "site-audit", label: "Site Audit", icon: ShieldAlert },
          { key: "seo-settings", label: "Settings", icon: Settings },
          { key: "htaccess", label: ".htaccess", icon: Server },
          { key: "llms-txt", label: "llms.txt", icon: Sparkles },
          { key: "custom-code", label: "Custom Code", icon: FileCode2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as SeoSubTabKey)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#c5a880] text-black shadow-md shadow-[#c5a880]/20"
                  : "bg-[#111827] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Sub-Tool */}
      {activeTab === "seo-dashboard" && <SeoDashboardTab onNavigateTab={handleTabChange} />}
      {activeTab === "page-seo" && <PageSeoTab />}
      {activeTab === "content-analysis" && <ContentAnalysisTab />}
      {activeTab === "keyword-analysis" && <KeywordAnalysisTab />}
      {activeTab === "internal-links" && <InternalLinksTab />}
      {activeTab === "image-seo" && <ImageSeoTab />}
      {activeTab === "schema" && <SchemaManagerTab />}
      {activeTab === "sitemap" && <SitemapTab />}
      {activeTab === "robots" && <RobotsTab />}
      {activeTab === "redirects" && <RedirectsTab />}
      {activeTab === "404-monitor" && <FourZeroFourTab />}
      {activeTab === "broken-links" && <BrokenLinksTab />}
      {activeTab === "social-seo" && <SocialSeoTab />}
      {activeTab === "aeo-geo" && <AeoGeoTab />}
      {activeTab === "site-audit" && <SiteAuditTab onNavigateTab={handleTabChange} />}
      {activeTab === "seo-settings" && <SeoSettingsTab />}
      {activeTab === "htaccess" && <HtaccessTab />}
      {activeTab === "llms-txt" && <LlmsTxtTab />}
      {activeTab === "custom-code" && <CustomCodeTab />}
    </div>
  );
}
