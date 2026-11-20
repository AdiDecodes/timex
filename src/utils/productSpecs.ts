/**
 * src/utils/productSpecs.ts
 * Single source of truth for Product Specification visibility, formatting,
 * and "Not Specified" detection across Admin and Public website.
 */

/**
 * Determines whether a specification value is empty, sentinel, or explicitly marked as "Not Specified".
 * Unspecified specifications must be completely hidden from the public product page.
 */
export function isSpecUnspecified(val: any): boolean {
  if (val === undefined || val === null) return true;
  if (Array.isArray(val)) {
    return val.length === 0 || val.every(isSpecUnspecified);
  }
  const s = String(val).trim().toLowerCase();
  
  if (s === "") return true;
  
  // Direct matches & variants
  if (
    s === "not specified" ||
    s === "notspecified" ||
    s === "not_specified" ||
    s === "not-specified"
  ) {
    return true;
  }

  if (
    s === "default" ||
    s === "default / not specified" ||
    s === "default/not specified" ||
    s === "default - not specified"
  ) {
    return true;
  }

  if (
    s.startsWith("not specified") ||
    s.startsWith("not_specified") ||
    s.startsWith("not-specified")
  ) {
    return true;
  }

  if (
    s.includes("(hide from public page)") ||
    s.includes("hide from public") ||
    s.includes("hide from public page")
  ) {
    return true;
  }
  
  // Placeholder / Sentinel values
  if (s === "custom" || s === "__custom__") return true; // Sentinel "Custom" without actual custom value
  if (
    s === "none" ||
    s === "null" ||
    s === "undefined" ||
    s === "n/a" ||
    s === "na" ||
    s === "-" ||
    s === "--"
  ) {
    return true;
  }

  return false;
}

/**
 * Determines whether a specification value is valid and should be rendered publicly.
 */
export function isValidSpec(val: any): boolean {
  return !isSpecUnspecified(val);
}

/**
 * Sanitizes a specification value for storage or presentation.
 * Returns empty string if unspecified, otherwise trimmed string.
 */
export function cleanSpecValue(val: any): string {
  if (Array.isArray(val)) {
    const valid = val.map((v) => String(v).trim()).filter((v) => !isSpecUnspecified(v));
    return valid.join(", ");
  }
  if (isSpecUnspecified(val)) return "";
  return String(val).trim();
}

export * from "./productCollection";
