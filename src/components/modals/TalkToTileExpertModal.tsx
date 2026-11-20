"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  Layers,
  LayoutGrid,
  Building2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useTileExpertModal } from "@/store/useTileExpertModal";
import { createInquiry } from "@/actions/inquiry";
import {
  filterNameInput,
  validateName,
  filterPhoneInput,
  validatePhone,
  validateEmail,
} from "@/lib/validation";

const PROJECT_TYPE_OPTIONS = [
  "Residential Living Space",
  "Bathroom Renovation",
  "Kitchen Remodel",
  "Entire Home / Villa Renovation",
  "Commercial Office / Workspace",
  "Retail Store / Showroom",
  "Hospitality (Hotel / Restaurant / Café)",
  "Architectural / Builder Project",
  "Other Project",
];

const TILE_CATEGORY_OPTIONS = [
  "Marble Collection",
  "Stone Collection",
  "Wooden Collection",
  "Brick Collection",
  "Subway Collection",
  "Moroccan Collection",
  "Mosaic Collection",
  "Terrazzo Collection",
  "Hexagon Collection",
  "Metallic Collection",
  "Texture Collection",
  "Tropical Collection",
  "Boutique Series",
  "Highlighter Tiles",
  "Large Porcelain Slabs",
];

export function TalkToTileExpertModal() {
  const { isOpen, closeModal, openModal } = useTileExpertModal();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [projectType, setProjectType] = useState("");
  const [tileCategory, setTileCategory] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Submission State
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  // Set mounted on client for portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for custom DOM event "open-talk-to-tile-expert"
  useEffect(() => {
    const handleCustomTrigger = () => {
      openModal();
    };
    window.addEventListener("open-talk-to-tile-expert", handleCustomTrigger);
    return () => {
      window.removeEventListener("open-talk-to-tile-expert", handleCustomTrigger);
    };
  }, [openModal]);

  // Lock body scroll and listen for Escape key when popup is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Reset form when modal closes
  const handleClose = () => {
    closeModal();
    // Delay state reset slightly for smooth transition
    setTimeout(() => {
      setSuccess(false);
      setErrorMessage("");
    }, 300);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // 1. Validation
    const nameCheck = validateName(fullName);
    if (!nameCheck.valid) {
      setErrorMessage(nameCheck.error || "Please enter your full name.");
      return;
    }

    const phoneCheck = validatePhone(phoneNumber, true);
    if (!phoneCheck.valid) {
      setErrorMessage(phoneCheck.error || "Please enter a valid 10-digit mobile number.");
      return;
    }

    if (emailAddress.trim()) {
      const emailCheck = validateEmail(emailAddress, true);
      if (!emailCheck.valid) {
        setErrorMessage(emailCheck.error || "Please enter a valid email address or leave it blank.");
        return;
      }
    }

    if (!projectType) {
      setErrorMessage("Please select what you are looking for (project type).");
      return;
    }

    setLoading(true);

    const cleanDigits = phoneNumber.replace(/\D/g, "");

    // Format consolidated message for enquiry management system
    const formattedMessage = [
      `TALK TO A TILE EXPERT CONSULTATION REQUEST:`,
      `Customer Name: ${fullName.trim()}`,
      `Mobile: +91 ${cleanDigits.slice(-10)}`,
      emailAddress.trim() ? `Email: ${emailAddress.trim()}` : `Email: Not provided`,
      `Project Type: ${projectType}`,
      tileCategory ? `Preferred Category: ${tileCategory}` : `Preferred Category: Open / To be recommended`,
      projectLocation.trim() ? `Project Location: ${projectLocation.trim()}` : `Location: Not specified`,
      projectDetails.trim() ? `Requirements: ${projectDetails.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const payload = {
        type: "EXPERT_CONSULTATION" as const,
        name: fullName.trim(),
        email: emailAddress.trim(),
        phone: `+91 ${cleanDigits.slice(-10)}`,
        message: formattedMessage,
        pageSource: "Talk to a Tile Expert Popup",
        details: {
          fullName: fullName.trim(),
          phone: `+91 ${cleanDigits.slice(-10)}`,
          email: emailAddress.trim() || "Not provided",
          projectType,
          preferredTileCategory: tileCategory || "Not specified",
          projectLocation: projectLocation.trim() || "Not specified",
          projectDetails: projectDetails.trim() || "None",
        },
        honeypot: honeypot.trim() || undefined,
      };

      const result = await createInquiry(payload);
      setLoading(false);

      if (result.success) {
        setSubmittedName(fullName.trim());
        setSuccess(true);
        // Clear inputs
        setFullName("");
        setPhoneNumber("");
        setEmailAddress("");
        setProjectType("");
        setTileCategory("");
        setProjectLocation("");
        setProjectDetails("");
      } else {
        setErrorMessage(
          result.error || "Unable to submit your callback request. Please try again or reach out on WhatsApp."
        );
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(
        err.message || "A network error occurred while submitting. Please try again."
      );
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="expert-popup-title"
      onClick={(e) => {
        // Close when clicking directly on overlay backdrop
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 bg-black/80 backdrop-blur-xs animate-fadeIn overflow-y-auto overscroll-contain"
    >
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-5xl bg-[#FCFBF8] text-[#333333] rounded-[3px] shadow-2xl border border-[#EDEAE4] overflow-hidden max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2.5rem)] lg:max-h-[min(90vh,860px)] flex flex-col my-auto z-10">
        {/* Floating Close Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close popup"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 p-2 text-[#333333]/70 hover:text-[#C95745] bg-white/90 hover:bg-white rounded-full border border-[#EDEAE4] shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable Container on Small Screens */}
        <div className="overflow-y-auto w-full flex-1 overscroll-contain">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[560px]">
            {/* ===================================================================
                LEFT COLUMN – INTRODUCTION, IMAGE & 3 FEATURE POINTS
                =================================================================== */}
            <div className="lg:col-span-5 relative bg-[#F7F5F0] border-b lg:border-b-0 lg:border-r border-[#EDEAE4] p-6 sm:p-8 lg:p-9 flex flex-col justify-between overflow-hidden">
              {/* Background Interior Photography Asset */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/spaces/legacy-trust.jpg"
                  alt="Timex Ceramic Luxury Surfaces Interior"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center opacity-25 filter blur-[0.5px]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FCFBF8]/95 via-[#F7F5F0]/92 to-[#EDEAE4]/80" />
              </div>

              {/* Left Content (Z-Index above backdrop image) */}
              <div className="relative z-10 space-y-6">
                {/* Timex Ceramic Logo */}
                <div>
                  <Image
                    src="/timex-logo.png"
                    alt="Timex Ceramic"
                    width={115}
                    height={46}
                    className="h-9 sm:h-10 w-auto object-contain"
                    priority
                  />
                </div>

                {/* Eyebrow with Red Vertical Accent Line */}
                <div className="flex items-center gap-2.5 pt-1">
                  <span className="w-1 h-3.5 bg-[#C95745] rounded-full shrink-0" />
                  <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#101B38] font-sans">
                    PERSONALISED TILE ASSISTANCE
                  </span>
                </div>

                {/* Main Heading */}
                <h2
                  id="expert-popup-title"
                  className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#101B38] uppercase tracking-tight leading-[1.15]"
                >
                  TALK TO A TILE EXPERT
                </h2>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-[#333333]/85 font-normal leading-relaxed">
                  Find the perfect surface for your space. Share your project details and our team will help you explore designs, finishes and formats.
                </p>

                {/* 3 Feature Points with Rounded Icon Containers */}
                <div className="space-y-3.5 pt-2">
                  {/* Feature 1 */}
                  <div className="flex items-center gap-3.5 p-2.5 rounded-[2px] bg-white/75 border border-[#DED9D0]/70 backdrop-blur-xs shadow-2xs">
                    <div className="w-9 h-9 rounded-[2px] bg-[#101B38]/5 border-l-2 border-[#C95745] flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 text-[#101B38]" />
                    </div>
                    <span className="font-sans text-xs sm:text-[13px] font-semibold text-[#101B38]">
                      Curated tile collections
                    </span>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center gap-3.5 p-2.5 rounded-[2px] bg-white/75 border border-[#DED9D0]/70 backdrop-blur-xs shadow-2xs">
                    <div className="w-9 h-9 rounded-[2px] bg-[#101B38]/5 border-l-2 border-[#C95745] flex items-center justify-center shrink-0">
                      <LayoutGrid className="w-4 h-4 text-[#101B38]" />
                    </div>
                    <span className="font-sans text-xs sm:text-[13px] font-semibold text-[#101B38]">
                      Guidance on sizes &amp; finishes
                    </span>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-center gap-3.5 p-2.5 rounded-[2px] bg-white/75 border border-[#DED9D0]/70 backdrop-blur-xs shadow-2xs">
                    <div className="w-9 h-9 rounded-[2px] bg-[#101B38]/5 border-l-2 border-[#C95745] flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-[#101B38]" />
                    </div>
                    <span className="font-sans text-xs sm:text-[13px] font-semibold text-[#101B38]">
                      Support for home &amp; commercial projects
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Call / WhatsApp Help Footer on Left */}
              <div className="relative z-10 pt-6 mt-6 border-t border-[#DED9D0]/60 text-xs text-[#333333]/70 font-sans flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C95745]" />
                <span>
                  Immediate assistance:{" "}
                  <a
                    href="tel:+912226122960"
                    className="text-[#101B38] font-semibold hover:text-[#C95745] transition-colors"
                  >
                    +91 22 2612 2960
                  </a>
                </span>
              </div>
            </div>

            {/* ===================================================================
                RIGHT COLUMN – ENQUIRY FORM CARD
                =================================================================== */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 lg:p-9 flex flex-col justify-center">
              {/* Form Heading & Accent Line */}
              <div className="mb-6 space-y-1">
                <h3 className="font-serif text-2xl sm:text-[26px] font-bold text-[#101B38] tracking-tight">
                  Let&apos;s Plan Your Space
                </h3>
                <div className="w-8 h-[2.5px] bg-[#C95745]" />
                <p className="font-sans text-xs sm:text-sm text-[#333333]/70 font-normal pt-0.5">
                  Tell us a little about your project.
                </p>
              </div>

              {/* Success View */}
              {success ? (
                <div className="py-8 px-4 text-center space-y-5 animate-fadeIn">
                  <div className="w-14 h-14 bg-[#E3EFE9] text-[#2D5A43] rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-2xl font-bold text-[#101B38]">
                      Callback Request Received!
                    </h4>
                    <p className="text-xs sm:text-sm text-[#333333]/80 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-[#101B38]">{submittedName}</strong>. Our tile experts will review your project details and reach out to you shortly.
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-6 py-2.5 bg-[#101B38] text-white hover:bg-[#C95745] text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-[#C95745] text-xs rounded-[2px] font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Honeypot field for spam bots */}
                  <input
                    type="text"
                    name="honeypot_field"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* Row 1: Full Name & Mobile Number (2-Column Grid on Tablet/Desktop) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#101B38]">
                        Full Name <span className="text-[#C95745]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(filterNameInput(e.target.value))}
                        placeholder="Your name"
                        className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] placeholder-gray-400 focus:outline-none focus:border-[#101B38] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#101B38]">
                        Mobile Number <span className="text-[#C95745]">*</span>
                      </label>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-2.5 bg-[#EDEAE4] border border-r-0 border-[#DED9D0] rounded-l-[2px] text-xs font-medium text-[#101B38] select-none">
                          +91
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(filterPhoneInput(e.target.value))}
                          placeholder="Enter 10-digit mobile number"
                          className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#DED9D0] rounded-r-[2px] text-xs sm:text-sm text-[#101B38] placeholder-gray-400 focus:outline-none focus:border-[#101B38] focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Email Address (Optional) */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#101B38]">
                      Email Address <span className="text-gray-400 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value.trim())}
                      placeholder="Your email address"
                      className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] placeholder-gray-400 focus:outline-none focus:border-[#101B38] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Row 3: I'm Looking For & Preferred Tile Category (2-Column Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* I'm Looking For (Required Dropdown) */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#101B38]">
                        I&apos;m Looking For <span className="text-[#C95745]">*</span>
                      </label>
                      <select
                        required
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] focus:outline-none focus:border-[#101B38] focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="" disabled>
                          Select project type
                        </option>
                        {PROJECT_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Tile Category (Optional Dropdown) */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#101B38]">
                        Preferred Tile Category <span className="text-gray-400 font-normal lowercase">(optional)</span>
                      </label>
                      <select
                        value={tileCategory}
                        onChange={(e) => setTileCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] focus:outline-none focus:border-[#101B38] focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="">Choose a category</option>
                        {TILE_CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Project Location (Optional) */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#101B38]">
                      Project Location <span className="text-gray-400 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      placeholder="City or area"
                      className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] placeholder-gray-400 focus:outline-none focus:border-[#101B38] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Row 5: Project Details (Optional Textarea) */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#101B38]">
                      Project Details <span className="text-gray-400 font-normal lowercase">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      placeholder="Tell us about your requirements..."
                      className="w-full p-3 bg-[#FCFBF8] border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] placeholder-gray-400 focus:outline-none focus:border-[#101B38] focus:bg-white transition-colors resize-y"
                    />
                  </div>

                  {/* Submit Button & Security Note */}
                  <div className="pt-2 space-y-2.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#101B38] text-[#FCFBF8] hover:bg-[#C95745] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-[2px] font-semibold uppercase tracking-wider text-xs sm:text-sm cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 shadow-xs hover:shadow-md"
                    >
                      {loading ? (
                        <span>SUBMITTING REQUEST...</span>
                      ) : (
                        <>
                          <span>REQUEST A CALLBACK</span>
                          <ArrowRight className="w-4 h-4 text-[#C95745] group-hover:text-white" />
                        </>
                      )}
                    </button>

                    {/* Security Note Below Button */}
                    <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-gray-500 font-sans">
                      <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                      <span>Your details are safe with us.</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
