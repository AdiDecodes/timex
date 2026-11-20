/**
 * Timex Ceramic Backend Validation Utility (CommonJS)
 * Mirrors src/lib/validation.ts for server-side revalidation.
 */

const UNICODE_NAME_REGEX = /^[\p{L}\p{M}]+(?:['\-\s][\p{L}\p{M}]+)*$/u;
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function validateName(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Please enter your full name." };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters long." };
  }
  if (trimmed.length > 80) {
    return { valid: false, error: "Name cannot exceed 80 characters." };
  }
  if (/\d/.test(trimmed)) {
    return { valid: false, error: "Name cannot contain numbers." };
  }
  if (!UNICODE_NAME_REGEX.test(trimmed)) {
    return { valid: false, error: "Name can only contain alphabetic letters and spaces." };
  }
  return { valid: true };
}

function validatePhone(phone) {
  const trimmed = String(phone || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Please enter your 10-digit mobile number." };
  }

  // Reject alphabetic characters
  if (/[a-zA-Z]/.test(trimmed)) {
    return { valid: false, error: "Mobile number cannot contain alphabetic characters." };
  }

  // Reject special characters or emojis (allowing optional leading + for country code, spaces or dashes)
  if (/[^0-9+\s\-]/.test(trimmed)) {
    return { valid: false, error: "Mobile number cannot contain special characters or symbols." };
  }

  let cleanDigits = trimmed.replace(/\D/g, "");
  // If user passed with +91 country code (12 digits starting with 91), strip it
  if (cleanDigits.length === 12 && cleanDigits.startsWith("91")) {
    cleanDigits = cleanDigits.slice(2);
  }

  if (!cleanDigits) {
    return { valid: false, error: "Please enter a valid 10-digit mobile number." };
  }

  if (cleanDigits.length < 10) {
    return { valid: false, error: "Mobile number must be exactly 10 digits." };
  }

  if (cleanDigits.length > 10) {
    return { valid: false, error: "Mobile number cannot exceed 10 digits." };
  }

  if (!/^[6-9]\d{9}$/.test(cleanDigits)) {
    return { valid: false, error: "Mobile number must start with 6, 7, 8, or 9." };
  }

  // Check for dummy repeating numbers (e.g. 0000000000, 9999999999)
  if (/^(\d)\1{9}$/.test(cleanDigits)) {
    return { valid: false, error: "Please enter a valid, active mobile number." };
  }

  return { valid: true, clean: cleanDigits };
}

function validateEmail(email, required = true) {
  const trimmed = (email || "").trim();
  if (!trimmed) {
    if (required) {
      return { valid: false, error: "Please enter your email address." };
    }
    return { valid: true };
  }

  if (/\s/.test(trimmed)) {
    return { valid: false, error: "Email address cannot contain spaces." };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address (e.g. name@company.com)." };
  }

  const parts = trimmed.split(".");
  const tld = parts[parts.length - 1];
  if (!tld || tld.length < 2) {
    return { valid: false, error: "Email address must include a valid domain extension." };
  }

  return { valid: true };
}

function sanitizeText(text, maxLength = 3000) {
  if (!text) return "";
  let clean = String(text).trim();
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  clean = clean.replace(/javascript:/gi, "");
  return clean;
}

module.exports = {
  validateName,
  validatePhone,
  validateEmail,
  sanitizeText,
};
