"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Check,
  Globe,
  Building,
  Key,
  Share2,
} from "lucide-react";

export function SeoSettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [siteName, setSiteName] = useState("Timex Ceramic");
  const [siteUrl, setSiteUrl] = useState("https://www.timexceramic.com");
  const [titleTemplate, setTitleTemplate] = useState("%s | Timex Ceramic");
  const [defaultDesc, setDefaultDesc] = useState(
    "Experience luxury surfaces with Timex Ceramic. Explore premium floor tiles, vitrified slabs, bathware, and interactive visualizers for luxury spaces."
  );
  const [defaultOgImage, setDefaultOgImage] = useState("https://www.timexceramic.com/images/og-image.jpg");
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);

  // Organization
  const [orgStreet, setOrgStreet] = useState("402, Pratik Avenue, Opp. Shiv Sagar Rest., Nehru Road, Vile Parle (E)");
  const [orgCity, setOrgCity] = useState("Mumbai");
  const [orgPostal, setOrgPostal] = useState("400057");
  const [orgPhone, setOrgPhone] = useState("+91-22-26122960");
  const [orgEmail, setOrgEmail] = useState("smm@ambestmedia.com");

  // Verification
  const [googleCode, setGoogleCode] = useState("google-site-verification-timex-sample");
  const [bingCode, setBingCode] = useState("");

  useEffect(() => {
    fetch("/api/v1/seo/settings?_t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const s = data.settings;
          if (s.site_name) setSiteName(s.site_name);
          if (s.site_url) setSiteUrl(s.site_url);
          if (s.default_title_template) setTitleTemplate(s.default_title_template);
          if (s.default_meta_description) setDefaultDesc(s.default_meta_description);
          if (s.default_og_image) setDefaultOgImage(s.default_og_image);
          if (s.default_robots_index !== undefined) setRobotsIndex(s.default_robots_index);
          if (s.default_robots_follow !== undefined) setRobotsFollow(s.default_robots_follow);

          const org = s.organization_data || {};
          if (org.telephone) setOrgPhone(org.telephone);
          if (org.email) setOrgEmail(org.email);
          if (org.address?.streetAddress) setOrgStreet(org.address.streetAddress);
          if (org.address?.addressLocality) setOrgCity(org.address.addressLocality);
          if (org.address?.postalCode) setOrgPostal(org.address.postalCode);

          const ver = s.verification_codes || {};
          if (ver.google) setGoogleCode(ver.google);
          if (ver.bing) setBingCode(ver.bing);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        site_name: siteName,
        site_url: siteUrl,
        default_title_template: titleTemplate,
        default_meta_description: defaultDesc,
        default_og_image: defaultOgImage,
        default_robots_index: robotsIndex,
        default_robots_follow: robotsFollow,
        organization_data: {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: siteName,
          url: siteUrl,
          logo: "https://www.timexceramic.com/wp-content/uploads/2023/07/Timex-Ceramic-Logo.png",
          email: orgEmail,
          telephone: orgPhone,
          address: {
            "@type": "PostalAddress",
            streetAddress: orgStreet,
            addressLocality: orgCity,
            addressRegion: "Maharashtra",
            postalCode: orgPostal,
            addressCountry: "IN",
          },
        },
        verification_codes: {
          google: googleCode,
          bing: bingCode,
        },
      };

      const res = await fetch("/api/v1/seo/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Global SEO settings saved and synchronized with public layout.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Global SEO Settings</h2>
          <p className="text-xs text-gray-400">
            Define site-wide metadata defaults, Organization schema, and webmaster search console verifications.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading SEO configuration...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: Brand & Defaults */}
            <div className="space-y-6">
              <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
                  <Globe className="w-4 h-4 text-[#c5a880]" />
                  Site Identity & Meta Defaults
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-300">Site Name</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-300">Production Public Site URL</label>
                    <input
                      type="text"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-300">Default Title Template</label>
                    <input
                      type="text"
                      value={titleTemplate}
                      onChange={(e) => setTitleTemplate(e.target.value)}
                      placeholder="%s | Timex Ceramic"
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-300">Default Meta Description</label>
                    <textarea
                      rows={3}
                      value={defaultDesc}
                      onChange={(e) => setDefaultDesc(e.target.value)}
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl p-3 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-300">Default Social Share Image (OG Image)</label>
                    <input
                      type="text"
                      value={defaultOgImage}
                      onChange={(e) => setDefaultOgImage(e.target.value)}
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Crawler Defaults */}
              <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-white">Default Search Engine Directives</span>
                <div className="flex items-center gap-6 text-xs text-gray-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={robotsIndex}
                      onChange={(e) => setRobotsIndex(e.target.checked)}
                      className="accent-[#c5a880] w-4 h-4 rounded"
                    />
                    <span>Default: Index public surfaces</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={robotsFollow}
                      onChange={(e) => setRobotsFollow(e.target.checked)}
                      className="accent-[#c5a880] w-4 h-4 rounded"
                    />
                    <span>Default: Follow outbound links</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Col: Organization Schema & Webmaster Verification */}
            <div className="space-y-6">
              {/* Organization Schema */}
              <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
                  <Building className="w-4 h-4 text-[#c5a880]" />
                  Corporate Organization Schema (JSON-LD)
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-300">Street Address</label>
                    <input
                      type="text"
                      value={orgStreet}
                      onChange={(e) => setOrgStreet(e.target.value)}
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-300">City / State</label>
                      <input
                        type="text"
                        value={orgCity}
                        onChange={(e) => setOrgCity(e.target.value)}
                        className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-300">Postal Code</label>
                      <input
                        type="text"
                        value={orgPostal}
                        onChange={(e) => setOrgPostal(e.target.value)}
                        className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-300">Experience Centre Phone</label>
                      <input
                        type="text"
                        value={orgPhone}
                        onChange={(e) => setOrgPhone(e.target.value)}
                        className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-300">Official Email</label>
                      <input
                        type="email"
                        value={orgEmail}
                        onChange={(e) => setOrgEmail(e.target.value)}
                        className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Webmaster Verification */}
              <div className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
                  <Key className="w-4 h-4 text-[#c5a880]" />
                  Webmaster Console Verifications
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-300">Google Search Console Verification Token</label>
                    <input
                      type="text"
                      value={googleCode}
                      onChange={(e) => setGoogleCode(e.target.value)}
                      placeholder="google-site-verification=..."
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-300">Bing Webmaster Token</label>
                    <input
                      type="text"
                      value={bingCode}
                      onChange={(e) => setBingCode(e.target.value)}
                      placeholder="bing-verification-code..."
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c5a880]/20 hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save SEO Settings"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
