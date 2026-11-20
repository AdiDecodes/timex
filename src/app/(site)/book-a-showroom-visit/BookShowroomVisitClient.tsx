"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Layers,
  Users,
  LayoutGrid,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Clock,
  ArrowRight,
  Check,
  AlertCircle,
  PenLine,
  Compass,
} from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { createInquiry } from "@/actions/inquiry";
import {
  filterNameInput,
  validateName,
  filterPhoneInput,
  validatePhone,
  validateEmail,
  validateDateNotPast,
} from "@/lib/validation";

const PROFILE_OPTIONS = [
  "Architect / Interior Designer",
  "Homeowner / Residential Client",
  "Builder / Property Developer",
  "Contractor / Project Consultant",
  "Dealer / Trade Partner",
  "Other",
];

const TIME_SLOT_OPTIONS = [
  "Morning (10:00 AM – 1:00 PM)",
  "Afternoon (1:00 PM – 4:00 PM)",
  "Evening (4:00 PM – 7:00 PM)",
];

const LOOKING_FOR_OPTIONS = [
  "Wall & Floor Tiles",
  "Bathroom Tiles",
  "Kitchen Tiles",
  "Living Room Tiles",
  "Bedroom Tiles",
  "Outdoor Tiles",
  "Decorative & Feature Wall Tiles",
  "Commercial Projects",
];

export function BookShowroomVisitClient() {
  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [profile, setProfile] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Submission State
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedDetails, setSubmittedDetails] = useState<{
    name: string;
    date: string;
    time: string;
    profile: string;
  } | null>(null);

  // Calculate today's date in YYYY-MM-DD for date-picker min attribute (prevents past dates)
  const todayISO = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const handleCheckboxToggle = (option: string) => {
    setLookingFor((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // 1. Validation
    const nameCheck = validateName(fullName);
    if (!nameCheck.valid) {
      setErrorMessage(nameCheck.error || "Please enter a valid full name.");
      return;
    }

    const phoneCheck = validatePhone(phoneNumber, true);
    if (!phoneCheck.valid) {
      setErrorMessage(phoneCheck.error || "Please enter a valid 10-digit mobile phone number.");
      return;
    }

    if (emailAddress.trim()) {
      const emailCheck = validateEmail(emailAddress, true);
      if (!emailCheck.valid) {
        setErrorMessage(emailCheck.error || "Please enter a valid email address or leave it blank.");
        return;
      }
    }

    if (!profile) {
      setErrorMessage("Please select your professional profile (You are a...).");
      return;
    }

    const dateCheck = validateDateNotPast(visitDate);
    if (!dateCheck.valid) {
      setErrorMessage(dateCheck.error || "Please select today or a future date for your showroom visit.");
      return;
    }

    if (!timeSlot) {
      setErrorMessage("Please select your preferred time slot.");
      return;
    }

    setLoading(true);

    // Format comprehensive message summary for admin review
    const selectedInterests = lookingFor.length > 0 ? lookingFor.join(", ") : "Not specified";
    const formattedMessage = [
      `SHOWROOM VISIT REQUEST:`,
      `Profile: ${profile}`,
      `Preferred Date: ${visitDate}`,
      `Preferred Time Slot: ${timeSlot}`,
      `Looking For: ${selectedInterests}`,
      additionalRequirements.trim() ? `Additional Notes: ${additionalRequirements.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const cleanDigits = phoneNumber.replace(/\D/g, "");
      const submissionPayload = {
        type: "SHOWROOM_VISIT" as const,
        name: fullName.trim(),
        email: emailAddress.trim(),
        phone: `+91 ${cleanDigits.slice(-10)}`,
        message: formattedMessage,
        pageSource: "Book a Showroom Visit Page (/book-a-showroom-visit)",
        details: {
          fullName: fullName.trim(),
          phone: `+91 ${cleanDigits.slice(-10)}`,
          email: emailAddress.trim() || "Not provided",
          profile,
          preferredVisitDate: visitDate,
          preferredTimeSlot: timeSlot,
          lookingFor,
          additionalRequirements: additionalRequirements.trim(),
        },
        honeypot: honeypot.trim() || undefined,
      };

      const result = await createInquiry(submissionPayload);

      setLoading(false);

      if (result.success) {
        setSuccess(true);
        setSubmittedDetails({
          name: fullName.trim(),
          date: visitDate,
          time: timeSlot,
          profile,
        });
        // Reset form
        setFullName("");
        setPhoneNumber("");
        setEmailAddress("");
        setProfile("");
        setVisitDate("");
        setTimeSlot("");
        setLookingFor([]);
        setAdditionalRequirements("");
      } else {
        setErrorMessage(
          result.error || "Unable to submit your visit request. Please check your connection and try again."
        );
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(
        err.message || "A network error occurred while submitting your visit request. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#333333] flex flex-col justify-between selection:bg-[#C95745] selection:text-white">
      {/* =========================================================================
          MAIN TWO-COLUMN SECTION (Inspired by Attached Reference Image)
          Left: Showroom Introduction, 4 Features, Showroom Photography
          Right: Premium White Booking Form Card
          ========================================================================= */}
      <section className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start">
          {/* ===================================================================
              LEFT COLUMN – SHOWROOM INTRODUCTION & FEATURES
              =================================================================== */}
          <div className="lg:col-span-5 space-y-8">
            <Reveal direction="up">
              {/* Eyebrow Label with Colored Line Accent */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] sm:text-xs tracking-[0.25em] text-[#C95745] font-semibold uppercase">
                  BOOK A SHOWROOM VISIT
                </span>
                <span className="w-10 sm:w-14 h-[1.5px] bg-[#C95745]" />
              </div>
            </Reveal>

            {/* Prominent Heading */}
            <Reveal direction="up" delay={0.1}>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-normal tracking-tight text-[#101B38] leading-[1.15]">
                Experience the World of Designer Tiles.
              </h1>
            </Reveal>

            {/* Short Description */}
            <Reveal direction="up" delay={0.15}>
              <p className="font-sans text-xs sm:text-sm text-[#333333]/85 font-normal leading-relaxed">
                Visit Timex Ceramic to explore our exclusive imported tile collections, discover inspiring designs and get assistance in selecting the perfect tiles for your space.
              </p>
            </Reveal>

            {/* 4 Feature Points with Clean Rounded Icon Badges */}
            <Reveal direction="up" delay={0.2}>
              <div className="space-y-5 pt-2">
                {/* Feature 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#EDEAE4] border border-[#DED9D0] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Layers className="w-5 h-5 text-[#101B38]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm sm:text-[15px] font-bold text-[#101B38] leading-snug">
                      Explore Imported Collections
                    </h3>
                    <p className="font-sans text-xs text-[#333333]/70 font-normal leading-relaxed">
                      From Italy, Spain and across the globe
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#EDEAE4] border border-[#DED9D0] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Users className="w-5 h-5 text-[#101B38]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm sm:text-[15px] font-bold text-[#101B38] leading-snug">
                      Personalised Assistance
                    </h3>
                    <p className="font-sans text-xs text-[#333333]/70 font-normal leading-relaxed">
                      From our tile experts
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#EDEAE4] border border-[#DED9D0] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <LayoutGrid className="w-5 h-5 text-[#101B38]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm sm:text-[15px] font-bold text-[#101B38] leading-snug">
                      Inspiration for Every Space
                    </h3>
                    <p className="font-sans text-xs text-[#333333]/70 font-normal leading-relaxed">
                      Homes, hospitality and commercial projects
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#EDEAE4] border border-[#DED9D0] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <MapPin className="w-5 h-5 text-[#101B38]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm sm:text-[15px] font-bold text-[#101B38] leading-snug">
                      Convenient Mumbai Location
                    </h3>
                    <p className="font-sans text-xs text-[#333333]/70 font-normal leading-relaxed">
                      Vile Parle East
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Actual Timex Ceramic Showroom Photograph Visual */}
            <Reveal direction="up" delay={0.25}>
              <div className="relative aspect-[16/10] w-full rounded-[2px] overflow-hidden border border-[#EDEAE4] shadow-md group mt-6">
                <Image
                  src="/images/banners/hero.webp"
                  alt="Timex Ceramic Mumbai Experience Centre & Flagship Tile Showroom"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between z-10 text-[11px] font-medium">
                  <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-[2px] tracking-wide inline-flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#C95745]" />
                    <span>Mumbai Experience Centre</span>
                  </span>
                  <span className="bg-[#C95745] text-white px-2 py-0.5 rounded-[2px] font-semibold text-[10px] tracking-wider uppercase">
                    Timex Ceramic
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ===================================================================
              RIGHT COLUMN – BOOKING FORM CARD
              =================================================================== */}
          <div className="lg:col-span-7">
            <Reveal direction="up" delay={0.1}>
              <div className="bg-[#FCFBF8] border border-[#DED9D0] rounded-[2px] p-6 sm:p-9 md:p-11 shadow-lg relative overflow-hidden">
                {/* Form Header */}
                <div className="space-y-2 mb-8">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#101B38]">
                    Book a Showroom Visit
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-[#333333]/80 font-normal leading-relaxed">
                    Plan your visit with our team and explore our premium imported tile collections in person.
                  </p>
                </div>

                {/* Success View */}
                {success && submittedDetails ? (
                  <div className="py-12 px-4 text-center space-y-5 animate-fade-in">
                    <div className="w-16 h-16 bg-[#E3EFE9] text-[#2D5A43] rounded-full flex items-center justify-center mx-auto shadow-xs">
                      <Check className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-bold text-[#101B38]">
                        Showroom Visit Request Received!
                      </h3>
                      <p className="text-xs sm:text-sm text-[#333333]/80 max-w-md mx-auto leading-relaxed">
                        Thank you, <strong className="text-[#101B38]">{submittedDetails.name}</strong>. Our consultation team will contact you shortly to confirm your appointment for:
                      </p>
                    </div>

                    <div className="p-4 bg-[#EDEAE4] rounded-[2px] max-w-sm mx-auto text-xs text-[#101B38] space-y-1.5 text-left border border-[#DED9D0]">
                      <div>
                        <strong>Date:</strong> {submittedDetails.date}
                      </div>
                      <div>
                        <strong>Time Slot:</strong> {submittedDetails.time}
                      </div>
                      <div>
                        <strong>Profile:</strong> {submittedDetails.profile}
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSuccess(false);
                          setSubmittedDetails(null);
                        }}
                        className="px-5 py-2.5 bg-[#101B38] text-white hover:bg-[#C95745] text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                      >
                        Request Another Visit
                      </button>
                      <Link
                        href="/collections"
                        className="px-5 py-2.5 bg-transparent border border-[#101B38] text-[#101B38] hover:bg-[#101B38] hover:text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-colors"
                      >
                        Explore Collections
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Form Fields */
                  <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
                    {/* Error Banner */}
                    {errorMessage && (
                      <div className="p-3.5 bg-red-50 border border-red-200 text-[#C95745] text-xs rounded-[2px] font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-[#C95745]" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Anti-spam honeypot */}
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

                    {/* Field 1: Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#101B38]">
                        Full Name <span className="text-[#C95745]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(filterNameInput(e.target.value))}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] placeholder-gray-400 focus:outline-none focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Field 2: Phone Number & Email Address (2-Column Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Phone Number */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#101B38]">
                          Phone Number <span className="text-[#C95745]">*</span>
                        </label>
                        <div className="relative flex">
                          <span className="inline-flex items-center gap-1 px-3 bg-[#EDEAE4] border border-r-0 border-[#DED9D0] rounded-l-[2px] text-xs font-medium text-[#101B38] select-none">
                            <Phone className="w-3.5 h-3.5 text-gray-500" />
                            <span>+91</span>
                          </span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(filterPhoneInput(e.target.value))}
                            placeholder="Enter 10-digit mobile number"
                            className="w-full px-3.5 py-3 bg-white border border-[#DED9D0] rounded-r-[2px] text-xs sm:text-sm text-[#101B38] placeholder-gray-400 focus:outline-none focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38] transition-colors"
                          />
                        </div>
                      </div>

                      {/* Email Address (Optional) */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#101B38]">
                          Email Address <span className="text-gray-400 font-normal lowercase">(optional)</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value.trim())}
                            placeholder="Enter your email address"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] placeholder-gray-400 focus:outline-none focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38] transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Field 3: You are a (Required Dropdown) */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#101B38]">
                        You are a <span className="text-[#C95745]">*</span>
                      </label>
                      <select
                        required
                        value={profile}
                        onChange={(e) => setProfile(e.target.value)}
                        className="w-full px-3.5 py-3 bg-white border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] focus:outline-none focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38] transition-colors cursor-pointer"
                      >
                        <option value="" disabled>
                          Select your profile
                        </option>
                        {PROFILE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Field 4: Preferred Visit Date & Preferred Time Slot (2-Column Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Preferred Visit Date */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#101B38]">
                          Preferred Visit Date <span className="text-[#C95745]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            min={todayISO}
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            className="w-full px-3.5 py-3 bg-white border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] focus:outline-none focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38] transition-colors cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Preferred Time Slot */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#101B38]">
                          Preferred Time Slot <span className="text-[#C95745]">*</span>
                        </label>
                        <select
                          required
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full px-3.5 py-3 bg-white border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] focus:outline-none focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38] transition-colors cursor-pointer"
                        >
                          <option value="" disabled>
                            Select time slot
                          </option>
                          {TIME_SLOT_OPTIONS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Field 5: What are you looking for? (Multi-select Checkboxes) */}
                    <div className="space-y-2.5 pt-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#101B38]">
                        What are you looking for?{" "}
                        <span className="text-gray-400 font-normal lowercase">(You can select multiple)</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {LOOKING_FOR_OPTIONS.map((option) => {
                          const isChecked = lookingFor.includes(option);
                          return (
                            <label
                              key={option}
                              onClick={() => handleCheckboxToggle(option)}
                              className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-[2px] border text-xs cursor-pointer select-none transition-all ${
                                isChecked
                                  ? "bg-[#EDEAE4] border-[#101B38] text-[#101B38] font-semibold"
                                  : "bg-white border-[#DED9D0] text-[#333333] hover:border-[#101B38]/40"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-[2px] border flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked
                                    ? "bg-[#101B38] border-[#101B38] text-white"
                                    : "border-gray-400 bg-white"
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="leading-tight">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Field 6: Additional Requirements (Optional Textarea) */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#101B38]">
                        Additional Requirements{" "}
                        <span className="text-gray-400 font-normal lowercase">(optional)</span>
                      </label>
                      <div className="relative">
                        <textarea
                          rows={3}
                          value={additionalRequirements}
                          onChange={(e) => setAdditionalRequirements(e.target.value)}
                          placeholder="Tell us about your project or tile requirements..."
                          className="w-full p-3.5 bg-white border border-[#DED9D0] rounded-[2px] text-xs sm:text-sm text-[#101B38] placeholder-gray-400 focus:outline-none focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38] transition-colors resize-y"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 space-y-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#101B38] text-[#FCFBF8] hover:bg-[#C95745] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-[2px] font-semibold uppercase tracking-widest text-xs sm:text-sm cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      >
                        {loading ? (
                          <span>REQUESTING SHOWROOM VISIT...</span>
                        ) : (
                          <>
                            <span>REQUEST A SHOWROOM VISIT</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* Below Button Supporting Text */}
                      <div className="text-center space-y-0.5 pt-1 text-[11px] sm:text-xs text-[#333333]/70 font-light leading-relaxed">
                        <p>Our team will contact you to confirm your preferred showroom visit date and time.</p>
                        <p className="font-medium text-[#101B38]">Your appointment is subject to confirmation.</p>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SHOWROOM INFORMATION SECTION (Bottom Bar inspired by Reference Image)
          ========================================================================= */}
      <section className="bg-[#101B38] text-[#FCFBF8] border-t border-[#202B48] py-8 sm:py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Showroom Address */}
            <div className="md:col-span-8 flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <MapPin className="w-5 h-5 text-[#C95745]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#FCFBF8]">
                  Visit Our Showroom
                </h3>
                <p className="font-sans text-xs sm:text-[13px] text-[#EDEAE4]/80 font-light leading-relaxed">
                  401/402, Pratik Avenue, Opp. Shiv Sagar Restaurant, Nehru Road, Vile Parle (East), Mumbai – 400057, Maharashtra, India.
                </p>
              </div>
            </div>

            {/* Right: Phone & Email Contacts */}
            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col lg:flex-row md:items-end lg:items-center justify-start md:justify-end gap-3 sm:gap-6 border-t md:border-t-0 md:border-l border-white/15 pt-4 md:pt-0 md:pl-6 text-xs sm:text-[13px]">
              <div className="inline-flex items-center gap-2 text-[#FCFBF8]">
                <Phone className="w-4 h-4 text-[#C95745] shrink-0" />
                <a
                  href="tel:+912226122960"
                  className="font-medium text-[#FCFBF8] hover:text-[#C95745] transition-colors"
                  title="Call showroom"
                >
                  +91 22 2612 2960
                </a>
              </div>

              <div className="inline-flex items-center gap-2 text-[#FCFBF8]">
                <Mail className="w-4 h-4 text-[#C95745] shrink-0" />
                <a
                  href="mailto:info@timexceramic.com"
                  className="font-medium text-[#FCFBF8] hover:text-[#C95745] transition-colors"
                  title="Email showroom"
                >
                  info@timexceramic.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
