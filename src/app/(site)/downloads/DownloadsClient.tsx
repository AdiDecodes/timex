"use client";

import React, { useState } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { Download, FileText, LayoutGrid, X, Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createInquiry } from "@/actions/inquiry";
import {
  filterNameInput,
  validateName,
  filterPhoneInput,
  validatePhone,
  validateEmail,
  sanitizeText,
  getNameError,
  getPhoneError,
  getEmailError,
} from "@/lib/validation";

export function DownloadsClient() {
  const [activeModalItem, setActiveModalItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", honeypot: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const catalogs = [
    { title: "Harlem Series Catalogue 2026", type: "PDF Format", size: "1.0 MB", pdfUrl: "/catalogue/harlem-series.pdf" },
    { title: "General Product Catalog 2026", type: "PDF Format", size: "1.0 MB", pdfUrl: "/catalogue/harlem-series.pdf" },
    { title: "Stone & Marble Look Slabs", type: "PDF Format", size: "1.0 MB", pdfUrl: "/catalogue/harlem-series.pdf" },
    { title: "Artisanal Moroccan Series", type: "PDF Format", size: "1.0 MB", pdfUrl: "/catalogue/harlem-series.pdf" }
  ];

  const bimModels = [
    { title: "800x1600mm Floor Slabs BIM", type: "Revit Model (.RFA)", size: "4.8 MB" },
    { title: "Subway Tile Wall Detail Blocks", type: "AutoCAD block (.DWG)", size: "1.2 MB" }
  ];

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Honeypot anti-spam check
    if (formData.honeypot) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActiveModalItem(null);
      }, 2000);
      return;
    }

    const nameErr = getNameError(formData.name);
    const phoneErr = getPhoneError(formData.phone);
    const emailErr = getEmailError(formData.email, true);

    if (nameErr || phoneErr || emailErr) {
      setFieldErrors({
        name: nameErr || "",
        phone: phoneErr || "",
        email: emailErr || "",
      });
      setErrorMsg(nameErr || phoneErr || emailErr || "Please fill in all required fields accurately.");
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    const res = await createInquiry({
      type: "CATALOGUE_REQUEST",
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: sanitizeText(formData.company.trim()),
      message: `Requested digital file download link for "${activeModalItem}".`,
      pageSource: "Downloads Resource Page",
      honeypot_field: formData.honeypot,
      details: {
        resourceTitle: activeModalItem,
      },
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", company: "", honeypot: "" });
      setTimeout(() => {
        setSuccess(false);
        setActiveModalItem(null);
      }, 3000);
    } else {
      setErrorMsg(res.error || "Failed to process download request.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <section className="bg-[#EDEAE4] py-16 md:py-24 border-b border-[#DED9D0]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] tracking-[0.25em] text-[#C95745] font-semibold uppercase block">Resource Center</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#101B38]">Downloads</h1>
          <p className="text-xs md:text-sm text-[#333333]/70 font-light max-w-xl mx-auto leading-relaxed">
            Access our complete digital catalogs and technical drawings for seamless inclusion in your architectural design projects.
          </p>
        </div>
      </section>

      <section className="py-24 max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Catalogs Section */}
        <Reveal direction="left" className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#101B38] flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#C95745]" />
            <span>Product Catalogs</span>
          </h2>
          <div className="space-y-4">
            {catalogs.map((c) => (
              <Card key={c.title} className="p-6 flex items-center justify-between bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] shadow-xs hover:border-[#101B38]/30 transition-colors">
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-[#101B38]">{c.title}</h4>
                  <p className="text-[10px] text-[#333333]/60 font-light">{c.type} • {c.size}</p>
                </div>
                <a
                  href={c.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#FCFBF8] hover:bg-[#101B38] hover:text-[#FCFBF8] border border-[#333333] text-[#101B38] rounded-[2px] text-xs font-medium cursor-pointer inline-flex items-center space-x-1.5 transition-colors uppercase tracking-wider"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Open Catalogue</span>
                </a>
              </Card>
            ))}
          </div>
        </Reveal>

        {/* Technical Models Section */}
        <Reveal direction="right" className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#101B38] flex items-center space-x-2">
            <LayoutGrid className="w-5 h-5 text-[#C95745]" />
            <span>BIM & CAD Files</span>
          </h2>
          <div className="space-y-4">
            {bimModels.map((b) => (
              <Card key={b.title} className="p-6 flex items-center justify-between bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] shadow-xs hover:border-[#101B38]/30 transition-colors">
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-[#101B38]">{b.title}</h4>
                  <p className="text-[10px] text-[#333333]/60 font-light">{b.type} • {b.size}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveModalItem(b.title)}
                  className="px-4 py-2 cursor-pointer bg-[#101B38] hover:bg-[#C95745] text-[#FCFBF8] rounded-[2px]"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                </Button>
              </Card>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Catalogue Request Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-[#101B38]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-[#FCFBF8] p-6 shadow-2xl border border-[#EDEAE4] rounded-[2px] relative text-[#333333]">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 text-[#333333]/60 hover:text-[#101B38] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <span className="text-[9px] tracking-widest text-[#C95745] font-semibold uppercase block">
                Digital Resource Download
              </span>
              <h3 className="font-serif text-xl font-bold text-[#101B38] mt-1">
                {activeModalItem}
              </h3>
            </div>

            {success ? (
              <div className="text-center py-8 space-y-2">
                <Check className="w-10 h-10 text-[#101B38] mx-auto" />
                <h4 className="font-serif text-base font-bold text-[#101B38]">Download Package Sent!</h4>
                <p className="text-xs text-[#333333]/70 font-light">
                  The download link has been dispatched to your email address.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                {/* Honeypot anti-spam field */}
                <input
                  type="text"
                  name="honeypot_field"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-[#C95745] text-xs rounded-[2px] font-medium">
                    {errorMsg}
                  </div>
                )}

                <Input
                  label="Your Name *"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const filtered = filterNameInput(e.target.value);
                    setFormData({ ...formData, name: filtered });
                    if (fieldErrors.name) {
                      setFieldErrors((prev) => ({ ...prev, name: getNameError(filtered) || "" }));
                    }
                  }}
                  onBlur={() => {
                    const err = getNameError(formData.name);
                    if (err) setFieldErrors((prev) => ({ ...prev, name: err }));
                  }}
                  error={fieldErrors.name}
                  className="rounded-[2px] border-[#333333]/30 focus:border-[#101B38] bg-[#FCFBF8]"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: getEmailError(e.target.value, true) || "" }));
                      }
                    }}
                    onBlur={() => {
                      const err = getEmailError(formData.email, true);
                      if (err) setFieldErrors((prev) => ({ ...prev, email: err }));
                    }}
                    error={fieldErrors.email}
                    className="rounded-[2px] border-[#333333]/30 focus:border-[#101B38] bg-[#FCFBF8]"
                  />
                  <Input
                    label="Phone Number *"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    leftAddon="+91"
                    placeholder="10-digit mobile number"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      const filtered = filterPhoneInput(e.target.value);
                      setFormData({ ...formData, phone: filtered });
                      if (fieldErrors.phone) {
                        setFieldErrors((prev) => ({ ...prev, phone: getPhoneError(filtered) || "" }));
                      }
                    }}
                    onBlur={() => {
                      const err = getPhoneError(formData.phone);
                      if (err) setFieldErrors((prev) => ({ ...prev, phone: err }));
                    }}
                    error={fieldErrors.phone}
                    className="rounded-[2px] border-[#333333]/30 focus:border-[#101B38] bg-[#FCFBF8]"
                  />
                </div>

                <Input
                  label="Company / Studio"
                  placeholder="Architect firm / Company name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="rounded-[2px] border-[#333333]/30 focus:border-[#101B38] bg-[#FCFBF8]"
                />

                <Button type="submit" disabled={loading} className="w-full cursor-pointer bg-[#101B38] text-[#FCFBF8] hover:bg-[#C95745] rounded-[2px] py-3.5 text-xs font-medium uppercase tracking-wider transition-colors">
                  {loading ? "Processing Download..." : "Send File to Email"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

