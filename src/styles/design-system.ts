/**
 * Centralized Design System tokens for Timex Ceramic Brand Update.
 * Reference Palette: Warm Off-White, Light Stone, Soft White, Charcoal, Midnight Navy, Timex Red.
 */

export const DESIGN_TOKENS = {
  colors: {
    // Brand Core Palette
    warmOffWhite: "#F7F5F0",  // Main website background
    lightStone: "#EDEAE4",    // Alternate section background
    softWhite: "#FCFBF8",     // Cards and content surfaces
    charcoal: "#333333",      // Body text and dark elements
    midnightNavy: "#101B38",  // Primary brand colour
    timexRed: "#C95745",      // Accent colour

    // Semantic mappings & compatibility
    primaryBrandBlue: "#101B38",
    primarySlate: "#101B38",
    primaryNavy: "#101B38",
    brandGold: "#C95745",
    accentRed: "#C95745",
    secondaryGray: "#333333",
    neutralLight: "#EDEAE4",
    neutralDark: "#101B38",
    background: "#F7F5F0",
  },
  typography: {
    fontSans: 'var(--font-sans), "Manrope", sans-serif',
    fontSerif: 'var(--font-serif), "Cormorant Garamond", serif',
  },
  borderRadius: {
    none: "rounded-none",
    xs: "rounded-xs",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  },
  shadows: {
    sm: "shadow-xs",
    md: "shadow-sm",
    lg: "shadow-md",
    xl: "shadow-lg",
    lux: "shadow-[0_10px_30px_-10px_rgba(16,27,56,0.06)]",
    luxHover: "shadow-[0_20px_40px_-15px_rgba(201,87,69,0.12)]",
  },
  transitions: {
    default: "transition-all duration-300 ease-out",
    slow: "transition-all duration-500 ease-in-out",
    lux: "transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1)",
  },
  spacing: {
    xs: "p-2",
    sm: "p-4",
    md: "p-6",
    lg: "p-10",
    xl: "p-16",
    "2xl": "p-24",
  },
};

export default DESIGN_TOKENS;
