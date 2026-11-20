/**
 * server/utils/productSpecs.js
 * Backend utility for Product Specification sanitization and "Not Specified" detection.
 */

function isSpecUnspecified(val) {
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
  if (s === "custom" || s === "__custom__") return true;
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

function isValidSpec(val) {
  return !isSpecUnspecified(val);
}

function cleanSpecValue(val) {
  if (Array.isArray(val)) {
    const valid = val.map(v => String(v).trim()).filter(v => !isSpecUnspecified(v));
    return valid.join(", ");
  }
  if (isSpecUnspecified(val)) return "";
  return String(val).trim();
}

module.exports = {
  isSpecUnspecified,
  isValidSpec,
  cleanSpecValue,
};
