"use client";

import { useState, useRef, useEffect } from "react";
import { X, Check, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { createInquiry } from "@/actions/inquiry";
import {
  filterNameInput,
  validateName,
  filterPhoneInput,
  validatePhone,
  validateEmail,
  validateDateNotPast,
  sanitizeText,
  getTodayDateISO,
  getNameError,
  getPhoneError,
  getEmailError,
  getDateError,
} from "@/lib/validation";

export function StickyVerticalCta() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"QUOTE" | "VISIT" | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    preferredDate: "",
    notes: "",
  });

  // Close panel on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleOpenQuote = () => {
    setSuccess(false);
    setError(null);
    setModalType("QUOTE");
    setIsOpen(false);
  };

  const handleOpenVisit = () => {
    setSuccess(false);
    setError(null);
    setModalType("VISIT");
    setIsOpen(false);
  };

  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send/?phone=919323777787&text=Hello%21+I+found+Timex+Ceramic+through+your+website+and+I%27m+interested+in+your+premium+tile+collection.+Please+share+your+latest+catalogue%2C+pricing%2C+available+sizes%2C+finishes%2C+and+help+me+choose+the+right+tiles+for+my+project.+I+would+also+like+to+know+about+product+availability+and+delivery+timelines.&type=phone_number&app_absent=0", "_blank");
  };

  const handleDownloadCatalogue = () => {
    window.open("/catalogue/harlem-series.pdf", "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Honeypot anti-spam check
    if (honeypot) {
      setSuccess(true);
      setTimeout(() => {
        setModalType(null);
        setSuccess(false);
      }, 2000);
      return;
    }

    const nameErr = getNameError(formData.name);
    const phoneErr = getPhoneError(formData.phone);
    const emailErr = getEmailError(formData.email, true);
    let dateErr: string | null = null;
    if (modalType === "VISIT" && formData.preferredDate) {
      dateErr = getDateError(formData.preferredDate);
    }

    if (nameErr || phoneErr || emailErr || dateErr) {
      setFieldErrors({
        name: nameErr || "",
        phone: phoneErr || "",
        email: emailErr || "",
        preferredDate: dateErr || "",
      });
      setError(nameErr || phoneErr || emailErr || dateErr || "Please fill in all required fields accurately.");
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError(null);

    const message =
      modalType === "QUOTE"
        ? `Request for Quote. City: ${sanitizeText(formData.city) || "Not specified"}. Project Notes: ${sanitizeText(formData.notes) || "Standard catalog pricing requested"}.`
        : `Request to Book Experience Centre Visit on ${formData.preferredDate || "Earliest available date"}. City: ${sanitizeText(formData.city) || "Mumbai"}. Notes: ${sanitizeText(formData.notes) || "None"}.`;

    try {
      const res = await createInquiry({
        type: modalType === "QUOTE" ? "QUOTE_REQUEST" : "GENERAL",
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message,
        pageSource: `Sticky CTA Panel - ${modalType === "QUOTE" ? "Quote" : "Visit"}`,
        honeypot_field: honeypot,
        details: {
          city: sanitizeText(formData.city.trim()),
          preferredDate: formData.preferredDate,
          notes: sanitizeText(formData.notes.trim()),
        },
      });

      if (res.success) {
        setSuccess(true);
        setHoneypot("");
        setTimeout(() => {
          setModalType(null);
          setSuccess(false);
          setFormData({ name: "", phone: "", email: "", city: "", preferredDate: "", notes: "" });
        }, 2500);
      } else {
        setError(res.error || "Submission failed. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. COLLAPSIBLE FLOATING QUICK ACTIONS SIDEBAR (Right edge, vertically centered) */}
      {/* ========================================================================= */}
      <div
        ref={panelRef}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center select-none transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0"
            : "translate-x-[84px] lg:translate-x-[88px]"
        }`}
      >
        {/* SLIM COLLAPSIBLE / EXPANDABLE ARROW TAB */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close Quick Actions" : "Open Quick Actions"}
          aria-expanded={isOpen}
          title={isOpen ? "Close Quick Actions" : "Open Quick Actions"}
          className="w-7 sm:w-8 h-14 sm:h-16 bg-[#F7F5F0] hover:bg-[#EDEAE4] text-[#101B38] hover:text-[#C95745] rounded-l-[4px] shadow-2xl border-l border-t border-b border-[#DED9D0] flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C95745] group shrink-0"
        >
          {isOpen ? (
            <ChevronRight className="w-4 h-4 text-[#101B38] group-hover:text-[#C95745] group-hover:translate-x-0.5 transition-all" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#101B38] group-hover:text-[#C95745] group-hover:-translate-x-0.5 transition-all" />
          )}
        </button>

        {/* 4 QUICK ACTIONS VERTICAL PANEL */}
        <aside
          aria-label="Quick actions"
          className="flex flex-col bg-[#F7F5F0] rounded-l-[2px] overflow-hidden shadow-2xl border-l border-t border-b border-[#DED9D0] select-none shrink-0"
        >
          {/* ACTION 1: GET QUOTE */}
          <button
            onClick={handleOpenQuote}
            className="w-[84px] lg:w-[88px] py-4 px-2 bg-[#F7F5F0] hover:bg-[#EDEAE4] text-[#101B38] hover:text-[#C95745] flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group cursor-pointer focus:outline-none"
            title="Get a Quote"
          >
            {/* Swatch / Slab Icon */}
            <div className="w-8 h-8 rounded-[2px] border border-[#101B38]/80 group-hover:border-[#C95745] flex items-center justify-center p-1 group-hover:scale-110 transition-all">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-[#101B38] group-hover:text-[#C95745] transition-colors"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9l12 12" />
                <path d="M9 3l12 12" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-center leading-tight text-[#101B38] group-hover:text-[#C95745] transition-colors">
              GET QUOTE
            </span>
          </button>

          {/* ACTION 2: BOOK VISIT */}
          <button
            onClick={handleOpenVisit}
            className="w-[84px] lg:w-[88px] py-4 px-2 bg-[#F7F5F0] hover:bg-[#EDEAE4] text-[#101B38] hover:text-[#C95745] flex flex-col items-center justify-center gap-1.5 transition-all duration-300 border-t border-[#DED9D0] group cursor-pointer focus:outline-none"
            title="Book Experience Centre Visit"
          >
            {/* Calendar Icon */}
            <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-[#101B38] group-hover:text-[#C95745] transition-colors"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
                <circle cx="8" cy="14" r="1" fill="currentColor" />
                <circle cx="12" cy="14" r="1" fill="currentColor" />
                <circle cx="16" cy="14" r="1" fill="currentColor" />
                <circle cx="8" cy="18" r="1" fill="currentColor" />
                <circle cx="12" cy="18" r="1" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-center leading-tight text-[#101B38] group-hover:text-[#C95745] transition-colors">
              BOOK VISIT
            </span>
          </button>

          {/* ACTION 3: WHATSAPP */}
          <button
            onClick={handleWhatsApp}
            className="w-[84px] lg:w-[88px] py-4 px-2 bg-[#F7F5F0] hover:bg-[#EDEAE4] text-[#101B38] hover:text-[#C95745] flex flex-col items-center justify-center gap-1.5 transition-all duration-300 border-t border-[#DED9D0] group cursor-pointer focus:outline-none"
            title="WhatsApp Expert"
          >
            {/* WhatsApp Icon */}
            <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-[#101B38] group-hover:text-[#C95745] transition-colors"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                <path d="M9.5 9.5c.3.8 1.1 1.6 2 2 .4.2.7.2 1-.1l.6-.6c.3-.3.8-.3 1.1-.1l1.5.8c.4.2.5.7.3 1.1-.5.9-1.5 1.5-2.5 1.4-2.5-.2-4.5-2.2-4.7-4.7-.1-1 .5-2 1.4-2.5.4-.2.9-.1 1.1.3l.8 1.5c.2.3.2.8-.1 1.1l-.6.6z" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-center leading-tight text-[#101B38] group-hover:text-[#C95745] transition-colors">
              WHATSAPP
            </span>
          </button>

          {/* ACTION 4: DOWNLOAD CATALOGUE */}
          <button
            onClick={handleDownloadCatalogue}
            className="w-[84px] lg:w-[88px] py-4 px-2 bg-[#F7F5F0] hover:bg-[#EDEAE4] text-[#101B38] hover:text-[#C95745] flex flex-col items-center justify-center gap-1.5 transition-all duration-300 border-t border-[#DED9D0] group cursor-pointer focus:outline-none"
            title="Download Master Catalogue"
          >
            {/* Download Bag Icon */}
            <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-[#101B38] group-hover:text-[#C95745] transition-colors"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
                <path d="M12 14v4" />
                <path d="m10 16 2 2 2-2" />
              </svg>
            </div>
            <span className="text-[9px] font-semibold tracking-wider uppercase text-center leading-tight text-[#101B38] group-hover:text-[#C95745] transition-colors px-0.5">
              DOWNLOAD CATALOGUE
            </span>
          </button>
        </aside>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE MODAL DIALOG (Get Quote / Book Visit)                      */}
      {/* ========================================================================= */}
      {modalType && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setModalType(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#FCFBF8] rounded-[2px] p-6 sm:p-8 shadow-2xl border border-[#EDEAE4] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EDEAE4]">
              <div>
                <span className="text-[10px] font-semibold tracking-widest text-[#C95745] uppercase block">
                  {modalType === "QUOTE" ? "Instant Trade Pricing" : "Showroom Experience"}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#101B38]">
                  {modalType === "QUOTE" ? "Request a Free Quote" : "Book Experience Centre Visit"}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="p-2 rounded-[2px] hover:bg-[#EDEAE4] text-gray-500 hover:text-[#101B38] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form / Success View */}
            {success ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-normal text-[#101B38]">
                  {modalType === "QUOTE" ? "Quote Request Received!" : "Visit Scheduled Successfully!"}
                </h4>
                <p className="text-xs text-[#555555] max-w-sm mx-auto leading-relaxed">
                  Our senior relationship manager will contact you within 2 business hours with full details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                {/* Honeypot anti-spam field */}
                <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                  <input
                    type="text"
                    name="honeypot_field"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-[2px] text-xs text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
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
                    className={`w-full px-4 py-2.5 text-xs bg-[#F7F5F0] border rounded-[2px] text-[#333333] focus:outline-none ${
                      fieldErrors.name ? "border-[#C95745] focus:border-[#C95745]" : "border-[#EDEAE4] focus:border-[#101B38]"
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-[11px] text-[#C95745] font-medium mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#333333] mb-1">Phone Number *</label>
                    <div className="flex relative">
                      <span className="inline-flex items-center px-2.5 bg-[#EDEAE4] border border-r-0 border-[#DED9D0] rounded-l-[2px] text-xs font-semibold text-[#101B38] select-none shrink-0">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        required
                        placeholder="10-digit mobile number"
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
                        className={`w-full px-4 py-2.5 text-xs bg-[#F7F5F0] border rounded-r-[2px] rounded-l-none text-[#333333] focus:outline-none ${
                          fieldErrors.phone ? "border-[#C95745] focus:border-[#C95745]" : "border-[#EDEAE4] focus:border-[#101B38]"
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-[11px] text-[#C95745] font-medium mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#333333] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
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
                      className={`w-full px-4 py-2.5 text-xs bg-[#F7F5F0] border rounded-[2px] text-[#333333] focus:outline-none ${
                        fieldErrors.email ? "border-[#C95745] focus:border-[#C95745]" : "border-[#EDEAE4] focus:border-[#101B38]"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] text-[#C95745] font-medium mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#333333] mb-1">City / Region</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Delhi, Bangalore"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-[#F7F5F0] border border-[#EDEAE4] rounded-[2px] text-[#333333] focus:outline-none focus:border-[#101B38]"
                    />
                  </div>
                  {modalType === "VISIT" ? (
                    <div>
                      <label className="block text-xs font-semibold text-[#333333] mb-1">Preferred Date</label>
                      <input
                        type="date"
                        min={getTodayDateISO()}
                        value={formData.preferredDate}
                        onChange={(e) => {
                          setFormData({ ...formData, preferredDate: e.target.value });
                          if (fieldErrors.preferredDate) {
                            setFieldErrors((prev) => ({ ...prev, preferredDate: getDateError(e.target.value) || "" }));
                          }
                        }}
                        onBlur={() => {
                          if (formData.preferredDate) {
                            const err = getDateError(formData.preferredDate);
                            if (err) setFieldErrors((prev) => ({ ...prev, preferredDate: err }));
                          }
                        }}
                        className={`w-full px-4 py-2.5 text-xs bg-[#F7F5F0] border rounded-[2px] text-[#333333] focus:outline-none ${
                          fieldErrors.preferredDate ? "border-[#C95745] focus:border-[#C95745]" : "border-[#EDEAE4] focus:border-[#101B38]"
                        }`}
                      />
                      {fieldErrors.preferredDate && (
                        <p className="text-[11px] text-[#C95745] font-medium mt-1">{fieldErrors.preferredDate}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-[#333333] mb-1">Project Type</label>
                      <select
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs bg-[#F7F5F0] border border-[#EDEAE4] rounded-[2px] text-[#333333] focus:outline-none focus:border-[#101B38]"
                      >
                        <option value="Residential Villa / Apartment">Residential Villa / Apartment</option>
                        <option value="Commercial / Office">Commercial / Office</option>
                        <option value="Hotel / Hospitality">Hotel / Hospitality</option>
                        <option value="Architect / Interior Spec">Architect / Interior Spec</option>
                      </select>
                    </div>
                  )}
                </div>

                {modalType === "QUOTE" && (
                  <div>
                    <label className="block text-xs font-semibold text-[#333333] mb-1">Requirements / Area (sq. ft)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Need 1200x2400mm Statuario porcelain slabs for living room approx 1500 sq ft."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-[#F7F5F0] border border-[#EDEAE4] rounded-[2px] text-[#333333] focus:outline-none focus:border-[#101B38]"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#101B38] hover:bg-[#C95745] text-[#FCFBF8] font-semibold text-xs tracking-wider uppercase rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>{modalType === "QUOTE" ? "Get Immediate Quote" : "Confirm Booking"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
