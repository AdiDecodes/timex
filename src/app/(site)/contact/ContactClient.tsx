"use client";

import React, { useState } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { Mail, Phone, MapPin, Clock, Check, AlertCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import { createInquiry } from "@/actions/inquiry";
import {
  filterNameInput,
  validateName,
  filterPhoneInput,
  validatePhone,
  validateEmail,
} from "@/lib/validation";

export function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "architect",
    message: "",
    honeypot: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const officeInfo: {
    icon: React.ReactNode;
    title: string;
    detail: React.ReactNode;
  }[] = [
    {
      icon: <MapPin className="w-5 h-5 text-[#C95745]" />,
      title: "Corporate Address",
      detail:
        "402, Pratik Avenue, Opp. Shiv Sagar Rest., Nehru Road, Vile Parle (E), Mumbai - 400 057, India",
    },
    {
      icon: <Phone className="w-5 h-5 text-[#C95745]" />,
      title: "Call Inquiries",
      detail: (
        <>
          <a
            href="tel:+912226122960"
            className="hover:text-[#C95745] transition-colors"
          >
            +91 - 22 - 2612 2960
          </a>
          <br />
          <a
            href="tel:+919820045678"
            className="hover:text-[#C95745] transition-colors"
          >
            +91 - 98200 45678
          </a>
        </>
      ),
    },
    {
      icon: <Mail className="w-5 h-5 text-[#C95745]" />,
      title: "Email Address",
      detail: (
        <a
          href="mailto:info@timexceramic.com"
          className="hover:text-[#C95745] transition-colors"
        >
          info@timexceramic.com
        </a>
      ),
    },
    {
      icon: <Clock className="w-5 h-5 text-[#C95745]" />,
      title: "Showroom Hours",
      detail: "Mon - Sat: 10:00 AM to 7:00 PM (Sunday Closed)",
    },
  ];

  const handleBlur = (field: string) => {
    const errors = { ...fieldErrors };
    if (field === "name") {
      const res = validateName(formData.name);
      if (!res.valid) errors.name = res.error || "Invalid name";
      else delete errors.name;
    }
    if (field === "phone") {
      const res = validatePhone(formData.phone);
      if (!res.valid) errors.phone = res.error || "Invalid phone number";
      else delete errors.phone;
    }
    if (field === "email") {
      const res = validateEmail(formData.email, true);
      if (!res.valid) errors.email = res.error || "Invalid email";
      else delete errors.email;
    }
    setFieldErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Validate all fields
    const nameCheck = validateName(formData.name);
    const phoneCheck = validatePhone(formData.phone);
    const emailCheck = validateEmail(formData.email, true);

    const errors: Record<string, string> = {};
    if (!nameCheck.valid) errors.name = nameCheck.error || "Invalid name";
    if (!phoneCheck.valid) errors.phone = phoneCheck.error || "Invalid phone";
    if (!emailCheck.valid) errors.email = emailCheck.error || "Invalid email";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg("Please fix the highlighted errors before submitting.");
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    const typeMap: Record<string, any> = {
      residential: "GENERAL",
      architect: "ARCHITECT_REGISTRATION",
      dealer: "DEALER_REGISTRATION",
      export: "BULK_INQUIRY",
    };

    const res = await createInquiry({
      type: typeMap[formData.inquiryType] || "GENERAL",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      pageSource: "Contact Page",
      honeypot: formData.honeypot,
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", inquiryType: "architect", message: "", honeypot: "" });
    } else {
      setErrorMsg(res.error || "Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] relative overflow-hidden">
      {/* Header section */}
      <section className="py-20 md:py-28 relative z-10 bg-[#EDEAE4] border-b border-[#DED9D0]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] tracking-[0.3em] text-[#C95745] font-semibold uppercase block">Connect With Us</span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#101B38] leading-tight tracking-tight">Contact Us</h1>
          <div className="w-16 h-[2px] bg-[#C95745] mx-auto my-4" />
          <p className="text-sm md:text-base text-[#333333]/80 font-light max-w-2xl mx-auto leading-relaxed">
            Reach out to our project consultation team to request physical tile samples, get wholesale price sheets, or resolve technical specs.
          </p>
        </div>
      </section>

      {/* Grid section */}
      <section className="py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start relative z-10">
        {/* Contact Coordinates */}
        <Reveal direction="left" className="space-y-10">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.25em] text-[#C95745] font-semibold uppercase block">Visit Showrooms</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#101B38]">Timex Ceramic HQ</h2>
            <p className="text-sm text-[#333333]/80 font-light leading-relaxed">
              Located in the heart of Mumbai, our head office houses an extensive selection of porcelain tile boards, mosaics, and bathware concepts. Contact us to schedule an appointment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {officeInfo.map((info) => (
              <Card key={info.title} className="p-8 bg-[#FCFBF8] border border-[#DED9D0] rounded-[2px] shadow-xs flex flex-col justify-between min-h-[200px] hover:border-[#101B38]/30 transition-all">
                <div className="space-y-4">
                  <div className="p-3 bg-[#EDEAE4] rounded-[2px] w-fit">
                    {info.icon}
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#101B38]">{info.title}</h4>
                </div>
                <div className="text-xs text-[#333333]/70 font-light leading-relaxed mt-4">{info.detail}</div>
              </Card>
            ))}
          </div>
        </Reveal>

        {/* Contact Form */}
        <Reveal direction="right">
          <Card className="p-8 md:p-12 bg-[#FCFBF8] border border-[#DED9D0] shadow-xs rounded-[2px] relative overflow-hidden">
            <h3 className="font-serif text-2xl font-bold text-[#101B38] mb-8 tracking-tight">Send an Inquiry</h3>

            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#EDEAE4] text-[#101B38] rounded-[2px] flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-[#101B38]" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#101B38]">Inquiry Sent Successfully!</h4>
                <p className="text-xs text-[#333333]/70 max-w-sm mx-auto font-light leading-relaxed">
                  Thank you for reaching out. Our project consultation team will review your message and reply within 24 business hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-xs font-semibold text-[#101B38] hover:text-[#C95745] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Honeypot field for bot protection */}
                <input
                  type="text"
                  name="user_note_hp"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-[#C95745] text-xs rounded-[2px] font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Your Name *"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: filterNameInput(e.target.value) })
                    }
                    onBlur={() => handleBlur("name")}
                    error={fieldErrors.name}
                    className="focus:border-[#101B38] focus:ring-[#101B38]/30 rounded-[2px]"
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                    onBlur={() => handleBlur("email")}
                    error={fieldErrors.email}
                    className="focus:border-[#101B38] focus:ring-[#101B38]/30 rounded-[2px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Phone Number *"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    leftAddon="+91"
                    placeholder="10-digit mobile number"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: filterPhoneInput(e.target.value) })
                    }
                    onBlur={() => handleBlur("phone")}
                    error={fieldErrors.phone}
                    className="focus:border-[#101B38] focus:ring-[#101B38]/30 rounded-[2px]"
                  />
                  <Dropdown
                    label="Inquiry Type"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    options={[
                      { value: "residential", label: "Residential Owner" },
                      { value: "architect", label: "Architect / Interior Designer" },
                      { value: "dealer", label: "Wholesale / Dealership" },
                      { value: "export", label: "Export / International Trade" }
                    ]}
                  />
                </div>
                <Input
                  label="Your Message *"
                  textarea
                  rows={4}
                  placeholder="Detail your project dimensions, looks required, and sample requirements..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="focus:border-[#101B38] focus:ring-[#101B38]/30 rounded-[2px]"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#101B38] text-[#FCFBF8] hover:bg-[#C95745] rounded-[2px] font-medium uppercase tracking-widest text-xs cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending Inquiry..." : "Submit Inquiry"}
                </Button>
              </form>
            )}
          </Card>
        </Reveal>
      </section>
    </div>
  );
}

