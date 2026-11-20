export const TARGET_RECIPIENT_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL ||
  process.env.ENQUIRY_EMAIL ||
  process.env.RECIPIENT_EMAIL ||
  process.env.NEXT_PUBLIC_ENQUIRY_EMAIL ||
  "info@timexceramic.com";

export interface SendInquiryEmailParams {
  type: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  pageSource?: string;
  details?: Record<string, any>;
  honeypot?: string;
}

export async function sendInquiryEmail(data: SendInquiryEmailParams) {
  if (data.honeypot) {
    return { success: false, error: "Spam submission rejected." };
  }

  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result && result.success) {
        return result;
      }
    } catch (e) {
      console.warn("Primary API /api/inquiry unavailable, attempting Hostinger mailer fallback:", e);
    }

    try {
      const resPhp = await fetch("/api/mail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await resPhp.json();
    } catch (e) {
      console.warn("Hostinger PHP mailer fallback error:", e);
    }
  }

  return { success: true, recipient: TARGET_RECIPIENT_EMAIL };
}
