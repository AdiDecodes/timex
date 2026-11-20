/**
 * Timex Ceramic – Centralized Form Validation, Input Sanitization & Spam Protection
 * Applied across all website forms: Contact, Book Showroom Visit, Talk to Tile Expert,
 * Product Inquiry, Catalogue Downloads, Tile Calculator, and Sticky CTA.
 */

// Name regex: Allows Unicode letters (\p{L}), accents/combining marks (\p{M}), spaces, hyphens, and apostrophes.
// Strictly disallows numbers, symbols, emojis.
export const UNICODE_NAME_REGEX = /^[\p{L}\p{M}]+(?:['\-\s][\p{L}\p{M}]+)*$/u;

/**
 * Filter input while typing: prevents numbers, emojis, and symbols from ever being entered.
 */
export function filterNameInput(value: string): string {
  return value.replace(/[^\p{L}\p{M}\s'\-]/gu, "");
}

/**
 * Strict Name Validator:
 * - Minimum 2 characters, maximum 80 characters
 * - Only alphabetic characters (Unicode supported for Indian & international names)
 * - Allows spaces between words, hyphens, apostrophes
 * - Strictly rejects numbers, symbols, and random characters
 */
export function validateName(name: string): { valid: boolean; error?: string } {
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

/**
 * Filter phone input while typing:
 * - Restricts input strictly to numeric digits 0-9
 * - Rejects all letters, special characters, and emojis
 * - Enforces maximum 10 digits
 */
export function filterPhoneInput(value: string, _allowPlus?: boolean): string {
  return (value || "").replace(/\D/g, "").slice(0, 10);
}

/**
 * Strict 10-Digit Mobile Phone Number Validator:
 * - Accept exactly 10 numeric digits.
 * - Do not allow fewer than 10 digits.
 * - Do not allow more than 10 digits.
 * - Do not allow alphabetic characters.
 * - Do not allow special characters or emojis.
 * - Must start with 6, 7, 8, or 9 (Indian mobile series).
 * - Disallows obviously fake repeating dummy numbers (e.g. 0000000000, 9999999999).
 */
export function validatePhone(phone: string, _isIndianOnly?: boolean): { valid: boolean; error?: string } {
  const trimmed = (phone || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Please enter your 10-digit mobile number." };
  }

  // Reject alphabetic characters
  if (/[a-zA-Z]/.test(trimmed)) {
    return { valid: false, error: "Mobile number cannot contain alphabetic characters." };
  }

  // Reject special characters or emojis
  if (/[^0-9]/.test(trimmed)) {
    return { valid: false, error: "Mobile number cannot contain special characters or symbols." };
  }

  if (trimmed.length < 10) {
    return { valid: false, error: "Mobile number must be exactly 10 digits." };
  }

  if (trimmed.length > 10) {
    return { valid: false, error: "Mobile number cannot exceed 10 digits." };
  }

  if (!/^[6-9]\d{9}$/.test(trimmed)) {
    return { valid: false, error: "Mobile number must start with 6, 7, 8, or 9." };
  }

  // Check for dummy repeating numbers (e.g. 0000000000, 9999999999)
  if (/^(\d)\1{9}$/.test(trimmed)) {
    return { valid: false, error: "Please enter a valid, active mobile number." };
  }

  return { valid: true };
}

// RFC 5322 compliant regex for email validation
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Strict Email Validator:
 * - Rejects spaces and invalid formats
 * - If optional (required = false) and empty, returns valid
 * - Validates TLD domain length (at least 2 chars)
 */
export function validateEmail(email: string, required: boolean = true): { valid: boolean; error?: string } {
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
    return { valid: false, error: "Email address must include a valid domain extension (e.g. .com)." };
  }

  return { valid: true };
}

/**
 * Date Validator: rejects past dates and invalid dates.
 */
export function validateDateNotPast(dateStr: string): { valid: boolean; error?: string } {
  if (!dateStr) {
    return { valid: false, error: "Please select a date." };
  }
  const selected = new Date(dateStr);
  if (isNaN(selected.getTime())) {
    return { valid: false, error: "Please enter a valid date." };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selected < today) {
    return { valid: false, error: "Please select today or a future date for your showroom visit." };
  }

  return { valid: true };
}

/**
 * Text Sanitizer: strips script tags, iframes, and limits maximum length.
 */
export function sanitizeText(text: string, maxLength: number = 3000): string {
  if (!text) return "";
  let clean = text.trim();
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  clean = clean.replace(/javascript:/gi, "");
  return clean;
}

/**
 * Convenient helper to get error string directly (or null if valid)
 */
export function getNameError(name: string): string | null {
  const res = validateName(name);
  return res.valid ? null : (res.error || "Please enter a valid full name.");
}

export function getPhoneError(phone: string, _isIndianOnly?: boolean): string | null {
  const res = validatePhone(phone);
  return res.valid ? null : (res.error || "Please enter a valid 10-digit mobile number.");
}

export function getEmailError(email: string, required: boolean = true): string | null {
  const res = validateEmail(email, required);
  return res.valid ? null : (res.error || "Please enter a valid email address.");
}

export function getDateError(dateStr: string): string | null {
  const res = validateDateNotPast(dateStr);
  return res.valid ? null : (res.error || "Please select a valid date.");
}

/**
 * Returns today's date formatted as YYYY-MM-DD for min date inputs
 */
export function getTodayDateISO(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
