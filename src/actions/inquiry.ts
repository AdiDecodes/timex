import { TARGET_RECIPIENT_EMAIL } from "@/lib/mail";
import {
  validateName,
  validatePhone,
  validateEmail,
  sanitizeText,
} from "@/lib/validation";

export interface InquiryInput {
  type:
    | "GENERAL"
    | "SAMPLE"
    | "DEALER_REGISTRATION"
    | "ARCHITECT_REGISTRATION"
    | "BULK_INQUIRY"
    | "QUOTE_REQUEST"
    | "CATALOGUE_REQUEST"
    | "NEWSLETTER"
    | "SHOWROOM_VISIT"
    | "EXPERT_CONSULTATION";
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  pageSource?: string;
  details?: Record<string, any>;
  honeypot?: string;
  honeypot_field?: string;
}

export async function createInquiry(input: InquiryInput) {
  // 1. Anti-Spam Honeypot Check
  if (input.honeypot || input.honeypot_field) {
    return { success: false, error: "Spam bot submission detected and blocked." };
  }

  // 2. Full Name Validation
  const nameResult = validateName(input.name);
  if (!nameResult.valid) {
    return { success: false, error: nameResult.error || "Please enter a valid full name." };
  }

  // 3. Mobile Phone Validation
  const phoneResult = validatePhone(input.phone);
  if (!phoneResult.valid) {
    return { success: false, error: phoneResult.error || "Please enter a valid contact phone number." };
  }

  // 4. Email Validation (if provided or required)
  const isEmailProvided = Boolean(input.email && input.email.trim());
  if (isEmailProvided) {
    const emailResult = validateEmail(input.email, true);
    if (!emailResult.valid) {
      return { success: false, error: emailResult.error || "Please enter a valid email address." };
    }
  }

  const cleanMessage = sanitizeText(input.message || "", 3000);

  const payload = {
    ...input,
    name: input.name.trim(),
    email: isEmailProvided ? input.email.trim() : "",
    phone: input.phone.trim(),
    company: input.company ? input.company.trim() : "",
    message: cleanMessage,
    pageSource: input.pageSource || "Timex Ceramic Website",
  };

  try {
    const backendBase =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5001";
    const endpoint =
      typeof window !== "undefined"
        ? "/api/v1/enquiries"
        : `${backendBase}/api/v1/enquiries`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: payload.type || "GENERAL",
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        company: payload.company,
        message: payload.message,
        page_source: payload.pageSource,
        details: payload.details || {},
      }),
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.success) {
      return {
        success: true,
        id: data.enquiryId || data.id || `inq_${Date.now()}`,
        recipient: TARGET_RECIPIENT_EMAIL,
        message:
          data.message ||
          "Thank you! Your enquiry has been received and forwarded to our sales team.",
      };
    } else {
      return {
        success: false,
        error:
          data?.error ||
          `Submission failed with status ${res.status}. Please check your details and try again.`,
      };
    }
  } catch (err: any) {
    console.error("createInquiry network error:", err);
    return {
      success: false,
      error:
        "A network connection error occurred while submitting your enquiry. Please check your connection and try again.",
    };
  }
}
