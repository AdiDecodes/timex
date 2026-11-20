"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Send,
  Loader2,
  ChevronLeft,
  Phone,
  Mail,
  Building,
  User,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useEnquiryCart } from "@/store/useEnquiryCart";
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

export function EnquiryDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
  } = useEnquiryCart();

  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"list" | "form" | "success">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ id: string; email: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset view to list when reopened
  useEffect(() => {
    if (isDrawerOpen && view === "success") {
      setView("list");
      setSubmitError(null);
    }
  }, [isDrawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  if (!mounted) return null;

  const totalItemCount = getTotalItems();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      const filtered = filterNameInput(value);
      setFormData((prev) => ({ ...prev, name: filtered }));
      if (fieldErrors.name) {
        setFieldErrors((prev) => ({ ...prev, name: getNameError(filtered) || "" }));
      }
    } else if (name === "phone") {
      const filtered = filterPhoneInput(value);
      setFormData((prev) => ({ ...prev, phone: filtered }));
      if (fieldErrors.phone) {
        setFieldErrors((prev) => ({ ...prev, phone: getPhoneError(filtered) || "" }));
      }
    } else if (name === "email") {
      setFormData((prev) => ({ ...prev, email: value }));
      if (fieldErrors.email) {
        setFieldErrors((prev) => ({ ...prev, email: getEmailError(value, true) || "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setSubmitError("Your enquiry list is empty. Please add products first.");
      return;
    }

    // Honeypot check - silent success for bots
    if (honeypot) {
      clearCart();
      setSuccessInfo({
        id: `INQ-${Date.now().toString().slice(-6)}`,
        email: formData.email,
      });
      setView("success");
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
      setSubmitError(nameErr || phoneErr || emailErr || "Please fill in all required fields accurately.");
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const siteOrigin = typeof window !== "undefined" ? window.location.origin : "https://www.timexceramic.com";

      // Build batch products details payload with full product URLs
      const productsPayload = items.map((item, index) => ({
        index: index + 1,
        productId: item.productId,
        name: item.name,
        code: item.code || "—",
        size: item.size || "Standard",
        finish: item.finish || "—",
        quantity: item.quantity || 1,
        image: item.image || "",
        slug: item.slug || "",
        productUrl: item.slug ? `${siteOrigin}/product/${item.slug}` : "",
      }));

      const payload = {
        type: "CART_ENQUIRY",
        name: formData.name.trim(),
        company: sanitizeText(formData.company.trim()),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: sanitizeText(formData.city.trim()),
        message:
          sanitizeText(formData.message.trim()) ||
          `Enquiry for ${items.length} product(s) from Timex Ceramic website.`,
        pageSource: "Enquiry Cart Drawer",
        page_source: "Enquiry Cart Drawer",
        honeypot_field: honeypot,
        details: {
          city: sanitizeText(formData.city.trim()),
          products: productsPayload,
          totalProductsCount: items.length,
          totalUnitsCount: totalItemCount,
        },
      };

      // 1. Submit to API endpoint (/api/v1/enquiries, with fallback to /api/inquiry)
      let res = await fetch("/api/v1/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => null);
      }

      if (!res) {
        throw new Error("Network connection could not be established.");
      }

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        // Clear cart ONLY AFTER backend confirms success
        clearCart();
        setSuccessInfo({
          id: data.id || data.enquiryId || `INQ-${Date.now().toString().slice(-6)}`,
          email: formData.email,
        });
        setView("success");
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          city: "",
          message: "",
        });
        setHoneypot("");
      } else {
        // Keep all items in cart on failure
        setSubmitError(
          data?.error ||
            "Unable to submit enquiry at this moment. Your items remain saved in the enquiry list. Please try again."
        );
      }
    } catch (err: any) {
      console.error("Enquiry submission network error:", err);
      // Keep all items in cart on network failure
      setSubmitError(
        "A network connection error occurred while submitting your enquiry. Your products have been preserved in the enquiry list. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[999] flex justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-[#101B38]/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Slide-over Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#FCFBF8] h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-[#EDEAE4]"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#EDEAE4] flex items-center justify-between bg-[#FCFBF8] flex-shrink-0">
              <div className="flex items-center space-x-3">
                {view === "form" && (
                  <button
                    onClick={() => setView("list")}
                    className="p-1.5 -ml-1.5 text-[#333333] hover:text-[#101B38] hover:bg-[#EDEAE4] rounded-[2px] transition-colors cursor-pointer"
                    title="Back to products list"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-semibold tracking-widest text-[#C95745] uppercase border border-[#C95745]/30 bg-[#C95745]/10 px-2 py-0.5 rounded-[2px]">
                      Timex Ceramic
                    </span>
                    <span className="text-xs text-[#333333]/60 font-medium">
                      {view === "form" ? "Step 2 of 2" : "Enquiry Basket"}
                    </span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#101B38] mt-1">
                    {view === "list" && `Enquiry List (${totalItemCount})`}
                    {view === "form" && "Client Information"}
                    {view === "success" && "Enquiry Confirmed"}
                  </h2>
                </div>
              </div>

              <button
                onClick={closeDrawer}
                className="p-2 text-[#333333]/60 hover:text-[#101B38] hover:bg-[#EDEAE4] rounded-[2px] transition-colors cursor-pointer focus:outline-none"
                aria-label="Close enquiry drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {submitError && (
              <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 rounded-[2px] flex items-start space-x-3 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Submission Issue</p>
                  <p className="mt-0.5 leading-relaxed">{submitError}</p>
                </div>
                <button
                  onClick={() => setSubmitError(null)}
                  className="text-red-400 hover:text-red-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* ========================================================= */}
              {/* VIEW 1: PRODUCTS LIST                                    */}
              {/* ========================================================= */}
              {view === "list" && (
                <>
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                      <div className="w-16 h-16 rounded-[2px] bg-[#EDEAE4] flex items-center justify-center text-[#101B38] mb-5">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-[#101B38]">
                        Your Enquiry List is Empty
                      </h3>
                      <p className="text-xs text-[#333333]/70 max-w-xs mt-2 leading-relaxed">
                        Explore our luxury porcelain slabs and ceramic tiles. Click{" "}
                        <span className="font-semibold text-[#101B38]">&ldquo;Add to Enquiry&rdquo;</span> on any
                        product page to compile your custom quotation request.
                      </p>
                      <button
                        onClick={closeDrawer}
                        className="mt-6 px-6 py-3 bg-[#101B38] hover:bg-[#C95745] text-[#FCFBF8] text-xs font-medium uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                      >
                        Explore Collections
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[#EDEAE4] text-xs text-[#333333]/70">
                        <span>{items.length} Product{items.length > 1 ? "s" : ""} Selected</span>
                        <button
                          onClick={clearCart}
                          className="text-[#333333]/60 hover:text-[#C95745] transition-colors text-[11px] cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>

                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 bg-[#FCFBF8] hover:bg-[#F7F5F0] border border-[#EDEAE4] rounded-[2px] transition-all duration-200 flex gap-3.5 relative group"
                        >
                          {/* Thumbnail */}
                          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-[2px] overflow-hidden bg-[#EDEAE4] border border-[#EDEAE4] flex-shrink-0">
                            <Image
                              src={item.image || "/images/collections/placeholder.webp"}
                              alt={item.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-[2px] bg-[#EDEAE4] text-[#101B38]">
                                  {item.code || "TMX-TILE"}
                                </span>
                                {item.finish && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-[2px] bg-[#C95745]/10 text-[#C95745]">
                                    {item.finish?.trim().toLowerCase() === "matte" ? "Matt" : item.finish}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-serif font-bold text-[#101B38] mt-1 truncate">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-[#333333]/70 font-light mt-0.5">
                                Size: <span className="font-medium text-[#101B38]">{item.size}</span>
                              </p>
                            </div>

                            {/* Quantity Stepper */}
                            <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#EDEAE4]">
                              <span className="text-[10px] uppercase tracking-wider text-[#333333]/60 font-semibold">
                                Quantity (Boxes)
                              </span>
                              <div className="flex items-center space-x-1.5 bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-0.5">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-[2px] flex items-center justify-center text-[#333333] hover:text-[#101B38] hover:bg-[#EDEAE4] transition-colors cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-medium text-[#101B38] px-2 min-w-[24px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-[2px] flex items-center justify-center text-[#333333] hover:text-[#101B38] hover:bg-[#EDEAE4] transition-colors cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Delete Item Button */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="absolute top-3 right-3 text-[#333333]/40 hover:text-[#C95745] transition-colors p-1 cursor-pointer"
                            title="Remove product"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ========================================================= */}
              {/* VIEW 2: CLIENT INFORMATION FORM                          */}
              {/* ========================================================= */}
              {view === "form" && (
                <form id="enquiry-form" onSubmit={handleSubmitEnquiry} className="space-y-4">
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

                  <div className="p-3.5 bg-[#EDEAE4] rounded-[2px] border border-[#DED9D0] text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#101B38] block">Enquiring for:</span>
                      <span className="text-[#333333]/70">
                        {items.length} Product{items.length > 1 ? "s" : ""} ({totalItemCount} Total Boxes/Units)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setView("list")}
                      className="text-[#C95745] font-semibold hover:underline cursor-pointer"
                    >
                      Review Tiles
                    </button>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#333333] flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-[#101B38]" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={() => {
                        const err = getNameError(formData.name);
                        if (err) setFieldErrors((prev) => ({ ...prev, name: err }));
                      }}
                      placeholder="e.g. Rahul Sharma / Architect Mehta"
                      className={`w-full px-3.5 py-2.5 bg-[#FCFBF8] border rounded-[2px] text-xs text-[#333333] placeholder-[#333333]/40 focus:outline-none ${
                        fieldErrors.name
                          ? "border-[#C95745] focus:border-[#C95745] focus:ring-1 focus:ring-[#C95745]"
                          : "border-[#333333]/30 focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38]"
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-[11px] text-[#C95745] font-medium mt-0.5">{fieldErrors.name}</p>
                    )}
                  </div>

                  {/* Company / Studio */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#333333] flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-[#101B38]" />
                      <span>Company / Architecture Studio</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Design Studio LLP / BuildCorp"
                      className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#333333]/30 rounded-[2px] text-xs text-[#333333] placeholder-[#333333]/40 focus:outline-none focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38]"
                    />
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#333333] flex items-center space-x-1">
                        <Mail className="w-3.5 h-3.5 text-[#101B38]" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => {
                          const err = getEmailError(formData.email, true);
                          if (err) setFieldErrors((prev) => ({ ...prev, email: err }));
                        }}
                        placeholder="rahul@example.com"
                        className={`w-full px-3.5 py-2.5 bg-[#FCFBF8] border rounded-[2px] text-xs text-[#333333] placeholder-[#333333]/40 focus:outline-none ${
                          fieldErrors.email
                            ? "border-[#C95745] focus:border-[#C95745] focus:ring-1 focus:ring-[#C95745]"
                            : "border-[#333333]/30 focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38]"
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="text-[11px] text-[#C95745] font-medium mt-0.5">{fieldErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#333333] flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-[#101B38]" />
                        <span>Phone / WhatsApp *</span>
                      </label>
                      <div className="flex relative">
                        <span className="inline-flex items-center px-2.5 bg-[#EDEAE4] border border-r-0 border-[#DED9D0] rounded-l-[2px] text-xs font-semibold text-[#101B38] select-none shrink-0">
                          +91
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          name="phone"
                          required
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={() => {
                            const err = getPhoneError(formData.phone);
                            if (err) setFieldErrors((prev) => ({ ...prev, phone: err }));
                          }}
                          placeholder="10-digit mobile number"
                          className={`w-full px-3.5 py-2.5 bg-[#FCFBF8] border rounded-r-[2px] rounded-l-none text-xs text-[#333333] placeholder-[#333333]/40 focus:outline-none ${
                            fieldErrors.phone
                              ? "border-[#C95745] focus:border-[#C95745] focus:ring-1 focus:ring-[#C95745]"
                              : "border-[#333333]/30 focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38]"
                          }`}
                        />
                      </div>
                      {fieldErrors.phone && (
                        <p className="text-[11px] text-[#C95745] font-medium mt-0.5">{fieldErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#333333] flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#101B38]" />
                      <span>City / Project Location</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai, Surat, Delhi, Dubai"
                      className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#333333]/30 rounded-[2px] text-xs text-[#333333] placeholder-[#333333]/40 focus:outline-none focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38]"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#333333] flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5 text-[#101B38]" />
                      <span>Project Details / Notes</span>
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Specify your expected delivery timeline, site area in sq.ft, or request physical tile samples..."
                      className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#333333]/30 rounded-[2px] text-xs text-[#333333] placeholder-[#333333]/40 focus:outline-none focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38]"
                    />
                  </div>
                </form>
              )}

              {/* ========================================================= */}
              {/* VIEW 3: SUCCESS CONFIRMATION                             */}
              {/* ========================================================= */}
              {view === "success" && (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-2">
                  <div className="w-16 h-16 rounded-[2px] bg-[#EDEAE4] text-[#101B38] flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#101B38]" />
                  </div>

                  <span className="text-[10px] font-semibold tracking-widest text-[#C95745] uppercase border border-[#C95745]/30 bg-[#C95745]/10 px-2.5 py-0.5 rounded-[2px]">
                    Submission Received
                  </span>

                  <h3 className="text-2xl font-serif font-bold text-[#101B38] mt-3">
                    Enquiry Sent Successfully!
                  </h3>

                  <p className="text-xs text-[#333333]/70 max-w-sm mt-2 leading-relaxed">
                    Thank you for choosing Timex Ceramic. Your consolidated enquiry has been dispatched to our sales desk.
                  </p>

                  {successInfo && (
                    <div className="mt-5 p-4 bg-[#F7F5F0] border border-[#EDEAE4] rounded-[2px] text-xs text-left w-full space-y-1.5">
                      <div className="flex justify-between text-[#333333]/70 text-[11px]">
                        <span>Reference ID:</span>
                        <span className="font-mono font-bold text-[#101B38]">{successInfo.id}</span>
                      </div>
                      <div className="flex justify-between text-[#333333]/70 text-[11px]">
                        <span>Confirmation Email:</span>
                        <span className="font-medium text-[#101B38] truncate max-w-[200px]">
                          {successInfo.email}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-6">
                    <button
                      onClick={() => {
                        setView("list");
                        closeDrawer();
                      }}
                      className="flex-1 py-3 bg-[#101B38] hover:bg-[#C95745] text-[#FCFBF8] text-xs font-medium uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                    >
                      Continue Browsing
                    </button>
                    <a
                      href="https://api.whatsapp.com/send/?phone=919323777787&text=Hello%21+I+found+Timex+Ceramic+through+your+website+and+I%27m+interested+in+your+premium+tile+collection.+Please+share+your+latest+catalogue%2C+pricing%2C+available+sizes%2C+finishes%2C+and+help+me+choose+the+right+tiles+for+my+project.+I+would+also+like+to+know+about+product+availability+and+delivery+timelines.&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noreferrer"
                      className="py-3 px-4 bg-[#FCFBF8] border border-[#333333] hover:bg-[#101B38] hover:text-[#FCFBF8] text-[#101B38] text-xs font-medium uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <span>WhatsApp Us</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            {view !== "success" && items.length > 0 && (
              <div className="p-6 border-t border-[#EDEAE4] bg-[#EDEAE4]/50 flex-shrink-0 space-y-3">
                {view === "list" ? (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#333333]/70 font-medium">Selected Tiles:</span>
                      <span className="font-bold text-[#101B38]">
                        {items.length} Product{items.length > 1 ? "s" : ""} ({totalItemCount} Units)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setView("form")}
                      className="w-full py-4 bg-[#101B38] hover:bg-[#C95745] text-[#FCFBF8] font-medium text-xs uppercase tracking-wider rounded-[2px] flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                    >
                      <span>Send Enquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setView("list")}
                      className="px-4 py-3.5 bg-[#FCFBF8] border border-[#333333] hover:bg-[#101B38] hover:text-[#FCFBF8] text-[#101B38] rounded-[2px] text-xs font-medium cursor-pointer transition-colors"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      form="enquiry-form"
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 bg-[#101B38] hover:bg-[#C95745] text-[#FCFBF8] font-medium text-xs uppercase tracking-wider rounded-[2px] flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Multi-Product Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
