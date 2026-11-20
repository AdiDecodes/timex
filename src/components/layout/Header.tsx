"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  BookOpen,
  Calculator,
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  FileText,
  ChevronDown,
  Newspaper,
  Play,
} from "lucide-react";
import { useWishlist } from "@/store/useWishlist";
import { useEnquiryCart } from "@/store/useEnquiryCart";
import { useNavigationFilterGroups } from "@/hooks/useNavigationFilterGroups";
import {
  APPLICATION_ITEMS,
  SPACE_ITEMS,
  COLOR_ITEMS,
  FilterItem,
} from "@/data/navigationFilters";
import {
  useWorldOfTilesCategories,
  resolveCategoryImage,
} from "@/hooks/useWorldOfTilesCategories";
import { CategoryItem } from "@/services/categories";
import { ProductSearchOverlay } from "@/components/search/ProductSearchOverlay";

type NavItemType = "link" | "world-of-tiles" | "collections" | "uses" | "space" | "color";

interface NavItem {
  name: string;
  href: string;
  type: NavItemType;
}

const NAV_ITEMS: NavItem[] = [
  { name: "World of Tiles", href: "/world-of-tiles", type: "world-of-tiles" },
  { name: "Collections", href: "/collections", type: "collections" },
  { name: "By Uses", href: "/wall-tiles", type: "uses" },
  { name: "By Space", href: "/spaces", type: "space" },
  { name: "By Color", href: "/beige-color", type: "color" },
  { name: "Inspiration", href: "/inspiration", type: "link" },
  { name: "About Us", href: "/about", type: "link" },
  { name: "Contact", href: "/contact", type: "link" },
];

interface WorldOfTilesNavCardProps {
  category: CategoryItem;
  onSelect?: () => void;
}

function WorldOfTilesNavCard({ category, onSelect }: WorldOfTilesNavCardProps) {
  const primarySrc = resolveCategoryImage(category);
  const [imgSrc, setImgSrc] = useState<string>(primarySrc);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const nextImg = resolveCategoryImage(category);
    if (nextImg !== imgSrc) {
      setImgSrc(nextImg);
      setHasError(false);
    }
  }, [category.banner, category.ogImage]);

  const handleError = () => {
    if (!hasError && category.ogImage && imgSrc !== category.ogImage) {
      setImgSrc(category.ogImage);
      setHasError(true);
    }
  };

  const href = category.url || `/product-category/${category.slug}`;

  return (
    <Link
      href={href}
      onClick={onSelect}
      className="group/card relative block h-[84px] xl:h-[90px] rounded-[2px] overflow-hidden bg-[#101B38] border border-[#EDEAE4] hover:border-[#C95745] shadow-2xs hover:shadow-lg transition-all duration-300"
      title={`Explore ${category.name} Collection`}
    >
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={`${category.name} Tiles`}
          fill
          sizes="(max-width: 1280px) 25vw, 20vw"
          className="object-cover object-center group-hover/card:scale-110 transition-transform duration-500 ease-out"
          onError={handleError}
          loading="eager"
        />
      ) : null}

      {/* Dark & Terracotta Gradient Overlay for High Contrast Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25 group-hover/card:from-[#101B38]/90 group-hover/card:via-[#C95745]/35 group-hover/card:to-black/35 transition-all duration-300" />

      {/* Centered Collection Name */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-2 text-center">
        <span className="font-serif text-[11.5px] xl:text-[12px] font-bold text-white tracking-[0.14em] uppercase drop-shadow-md group-hover/card:scale-105 transition-transform duration-300">
          {category.name}
        </span>
      </div>

      {/* Terracotta Accent Indicator on Hover */}
      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C95745] transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-300 origin-center" />
    </Link>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const navigationFilterGroups = useNavigationFilterGroups();
  const worldOfTilesCategories = useWorldOfTilesCategories();

  const wishlistItems = useWishlist((state) => state.items);
  const openEnquiryDrawer = useEnquiryCart((state) => state.openDrawer);
  const enquiryItemCount = useEnquiryCart((state) => state.getTotalItems());

  type DropdownKey = "world-of-tiles" | "collections" | "uses" | "space" | "color" | null;

  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null);
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerNavRef = useRef<HTMLElement | null>(null);

  const closeDropdownImmediately = useCallback(() => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setActiveDropdown(null);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close all menus, submenus, and search on route change
  useEffect(() => {
    closeDropdownImmediately();
    setIsOpen(false);
    setOpenMobileSubmenu(null);
    setIsSearchOpen(false);
  }, [pathname, closeDropdownImmediately]);

  // Clean up pending timers on unmount
  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerNavRef.current && !headerNavRef.current.contains(e.target as Node)) {
        closeDropdownImmediately();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDropdownImmediately();
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDropdownImmediately]);

  const handleMouseEnter = (key: DropdownKey) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }

    if (!key) {
      closeDropdownImmediately();
      return;
    }

    // If another dropdown is already open, transition immediately with no delay
    if (activeDropdown && activeDropdown !== key) {
      setActiveDropdown(key);
      return;
    }

    // 40ms micro-delay prevents erratic triggering on fast cursor passing
    enterTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(key);
    }, 40);
  };

  const handleMouseLeave = () => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }

    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }

    // 140ms grace period allows moving between menu and dropdown without flickering
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 140);
  };

  const toggleMobileSubmenu = (key: string) => {
    setOpenMobileSubmenu((prev) => (prev === key ? null : key));
  };

  const isRouteActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/world-of-tiles") return pathname === "/world-of-tiles" || pathname === "/products";
    if (href === "/collections") return pathname === "/collections" || pathname.startsWith("/collections/");
    if (href === "/spaces") return pathname === "/spaces" || pathname.startsWith("/spaces/");
    if (href === "/wall-tiles") {
      return (
        pathname === "/wall-tiles" ||
        pathname === "/floor-tiles" ||
        pathname === "/wall-floor-tiles" ||
        pathname === "/exterior-tiles"
      );
    }
    if (href === "/beige-color" || href.endsWith("-color")) return pathname.endsWith("-color") || pathname.startsWith("/color/");
    return pathname.startsWith(href);
  };

  // Dynamic colors fetched from Database/API (synced with Color Management)
  const [dynamicColorItems, setDynamicColorItems] = useState<FilterItem[]>(() => {
    const colorGroup = navigationFilterGroups.find(
      (g) => g.id === "color" || g.id === "by-color"
    );
    return colorGroup?.items && colorGroup.items.length > 0 ? colorGroup.items : COLOR_ITEMS;
  });

  useEffect(() => {
    let mounted = true;
    fetch("/api/v1/colors?activeOnly=true", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        if (mounted && data.success && Array.isArray(data.colors) && data.colors.length > 0) {
          const mapped: FilterItem[] = data.colors.map((c: any) => ({
            name: c.name,
            href: `/${c.slug}-color`,
            slug: `${c.slug}-color`,
            filterKey: "color",
            filterValue: c.name,
          }));
          setDynamicColorItems(mapped);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Collections mega menu: exclude By Look, Uses/Application, Space/Area, and Color per requirements
  const EXCLUDED_COLLECTIONS_GROUPS = new Set([
    "bylook",
    "application",
    "by-uses",
    "space",
    "by-space",
    "color",
    "by-color",
  ]);

  const collectionsGroups = navigationFilterGroups.filter((group) => {
    const id = group.id.toLowerCase();
    const title = group.title.toLowerCase();
    if (EXCLUDED_COLLECTIONS_GROUPS.has(id)) return false;
    if (title.includes("by look")) return false;
    if (title.includes("uses") || title.includes("application")) return false;
    if (title.includes("space") || title.includes("area")) return false;
    if (title.includes("color")) return false;
    return true;
  });

  // Submenu items for the 3 new main-level items
  const usesGroup = navigationFilterGroups.find(
    (g) => g.id === "application" || g.id === "by-uses"
  );
  const usesItems = usesGroup?.items && usesGroup.items.length > 0 ? usesGroup.items : APPLICATION_ITEMS;

  const spaceGroup = navigationFilterGroups.find(
    (g) => g.id === "space" || g.id === "by-space"
  );
  const spaceItems = spaceGroup?.items && spaceGroup.items.length > 0 ? spaceGroup.items : SPACE_ITEMS;

  const colorGroup = navigationFilterGroups.find(
    (g) => g.id === "color" || g.id === "by-color"
  );
  const colorItems = dynamicColorItems && dynamicColorItems.length > 0 ? dynamicColorItems : COLOR_ITEMS;

  return (
    <header className="sticky top-0 left-0 w-full z-50 transition-all duration-300">
      {/* 1. Top Header Section — Pure White Utility Header */}
      <div className="bg-[#FFFFFF] text-[#000000] border-b border-[#E5E5E5] text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-y-1.5">
          {/* Left: Contact Info */}
          <div className="flex items-center space-x-3 sm:space-x-4 text-[#000000]">
            <div className="flex items-center space-x-1.5 text-[#000000]">
              <Phone className="w-3.5 h-3.5 text-[#000000] flex-shrink-0" />
              <span>
                Call:{" "}
                <a
                  href="tel:+912226122960"
                  className="font-semibold text-[#000000] hover:text-[#C95745] transition-colors duration-200"
                  title="Click to call Timex Ceramic"
                >
                  +91 22 2612 2960
                </a>
              </span>
            </div>

            <span className="text-[#E5E5E5] select-none">|</span>

            <div className="flex items-center space-x-1.5 text-[#000000]">
              <Mail className="w-3.5 h-3.5 text-[#000000] flex-shrink-0" />
              <span>
                Email:{" "}
                <a
                  href="mailto:info@timexceramic.com"
                  className="text-[#000000] font-medium hover:text-[#C95745] transition-colors duration-200"
                  title="Click to email Timex Ceramic"
                >
                  info@timexceramic.com
                </a>
              </span>
            </div>
          </div>

          {/* Right: Quick Tools */}
          <div className="hidden md:flex items-center space-x-2.5 sm:space-x-4 text-[#000000]">
            <Link
              href="/catalogue-maker"
              className="flex items-center space-x-1.5 text-[#000000] hover:text-[#C95745] transition-colors duration-200"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#000000] flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">Catalog Maker</span>
            </Link>

            <span className="text-[#E5E5E5] select-none">|</span>

            <Link
              href="/calculator"
              className="flex items-center space-x-1.5 text-[#000000] hover:text-[#C95745] transition-colors duration-200"
            >
              <Calculator className="w-3.5 h-3.5 text-[#000000] flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">Tile Calculator</span>
            </Link>

            <span className="text-[#E5E5E5] select-none">|</span>

            <Link
              href="/blogs"
              className="flex items-center space-x-1.5 text-[#000000] hover:text-[#C95745] transition-colors duration-200"
            >
              <Newspaper className="w-3.5 h-3.5 text-[#000000] flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">Blog</span>
            </Link>

            <span className="text-[#E5E5E5] select-none">|</span>

            <Link
              href="/watch-and-choose"
              className="flex items-center space-x-1.5 text-[#000000] hover:text-[#C95745] transition-colors duration-200"
              title="Watch and Choose - Video Gallery"
            >
              <Play className="w-3 h-3 text-[#C95745] fill-[#C95745] flex-shrink-0" />
              <span className="font-semibold text-[#101B38] hover:text-[#C95745] whitespace-nowrap">Watch &amp; Choose</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar — Warm Off-White */}
      <div className="bg-[#F7F5F0] border-b border-[#EDEAE4] shadow-[0_2px_15px_-3px_rgba(16,27,56,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between relative">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group py-1 mr-3 xl:mr-5">
            <Image
              src="/timex-logo.png"
              alt="Timex Ceramic Logo"
              width={74}
              height={82}
              className="h-[52px] md:h-[60px] w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              priority
            />
          </Link>

          {/* Desktop Navigation Links — Manrope Medium */}
          <nav
            ref={headerNavRef}
            onMouseLeave={handleMouseLeave}
            className="hidden lg:flex items-center space-x-2.5 xl:space-x-3.5 2xl:space-x-4 h-full"
          >
            {NAV_ITEMS.map((item) => {
              const active = isRouteActive(item.href);

              // 0. World of Tiles Mega Menu
              if (item.type === "world-of-tiles") {
                const isMenuOpen = activeDropdown === "world-of-tiles";

                return (
                  <div
                    key={item.name}
                    className="h-full flex items-center"
                    onMouseEnter={() => handleMouseEnter("world-of-tiles")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="relative flex items-center h-full">
                      <Link
                        href={item.href}
                        onClick={closeDropdownImmediately}
                        className={`text-[11px] xl:text-[11.5px] 2xl:text-[12px] font-medium tracking-wider uppercase transition-colors duration-200 flex items-center space-x-0.5 py-6 font-sans whitespace-nowrap ${
                          active || isMenuOpen ? "text-[#C95745] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 text-[#C95745] ${
                            isMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Link>

                      {/* Underline Indicator */}
                      <span
                        className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#C95745] transition-transform duration-200 origin-left ${
                          active || isMenuOpen ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </div>

                    {/* World of Tiles Mega Menu Dropdown */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 w-[1160px] xl:w-[1240px] max-w-[calc(100vw-2rem)] bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] shadow-2xl p-6 xl:p-7 z-50 mt-0 max-h-[82vh] overflow-y-auto before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 transition-all duration-150 ease-out ${
                        isMenuOpen
                          ? "opacity-100 visible pointer-events-auto translate-y-0"
                          : "opacity-0 invisible pointer-events-none -translate-y-1"
                      }`}
                    >
                      {/* Mega Menu Top Header */}
                      <div className="border-b border-[#C95745]/40 pb-3 mb-4 flex items-center justify-between">
                        <div className="flex items-baseline space-x-3">
                          <h4 className="font-serif text-[13px] xl:text-[14px] font-bold text-[#101B38] tracking-wide uppercase">
                            World of Tiles
                          </h4>
                          <span className="text-[11px] text-[#666666] hidden sm:inline">
                            Explore {worldOfTilesCategories.length} Curated Architectural Collections
                          </span>
                        </div>
                        <Link
                          href="/world-of-tiles"
                          onClick={closeDropdownImmediately}
                          className="text-[11px] font-semibold tracking-wider uppercase text-[#C95745] hover:underline flex items-center space-x-1"
                        >
                          <span>View All Collections</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>

                      {/* Mega Menu Collections Grid: 4 cols on lg, 5 cols on xl */}
                      <div className="grid grid-cols-4 xl:grid-cols-5 gap-2.5 xl:gap-3">
                        {worldOfTilesCategories.map((category) => (
                          <WorldOfTilesNavCard
                            key={category.slug}
                            category={category}
                            onSelect={closeDropdownImmediately}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // 1. Collections Mega Menu (Without "By Look")
              if (item.type === "collections") {
                const isMenuOpen = activeDropdown === "collections";

                return (
                  <div
                    key={item.name}
                    className="h-full flex items-center"
                    onMouseEnter={() => handleMouseEnter("collections")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="relative flex items-center h-full">
                      <Link
                        href={item.href}
                        onClick={closeDropdownImmediately}
                        className={`text-[11px] xl:text-[11.5px] 2xl:text-[12px] font-medium tracking-wider uppercase transition-colors duration-200 flex items-center space-x-0.5 py-6 font-sans whitespace-nowrap ${
                          active || isMenuOpen ? "text-[#C95745] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 text-[#C95745] ${
                            isMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Link>

                      {/* Underline Indicator */}
                      <span
                        className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#C95745] transition-transform duration-200 origin-left ${
                          active || isMenuOpen ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </div>

                    {/* Collections Mega Menu Dropdown */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 w-[1160px] xl:w-[1240px] max-w-[calc(100vw-2rem)] bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] shadow-2xl p-7 z-50 mt-0 max-h-[82vh] overflow-y-auto before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 transition-all duration-150 ease-out ${
                        isMenuOpen
                          ? "opacity-100 visible pointer-events-auto translate-y-0"
                          : "opacity-0 invisible pointer-events-none -translate-y-1"
                      }`}
                    >
                      <div className="grid grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-6">
                        {collectionsGroups.map((group) => (
                          <div key={group.id} className="space-y-2.5">
                            <div className="border-b border-[#C95745]/40 pb-1.5 flex items-center justify-between">
                              <h4 className="font-serif text-[12.5px] font-bold text-[#101B38] tracking-wide uppercase">
                                {group.title}
                              </h4>
                            </div>
                            <div className="space-y-1.5 max-h-[175px] overflow-y-auto pr-1">
                              {group.items.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={closeDropdownImmediately}
                                  className="flex items-center space-x-1.5 text-[11px] font-medium tracking-wide uppercase text-[#333333] hover:text-[#C95745] transition-colors group/item truncate"
                                  title={subItem.name}
                                >
                                  <span className="text-[8px] text-[#C95745] transition-transform duration-200 group-hover/item:translate-x-0.5 select-none shrink-0">
                                    ▸
                                  </span>
                                  <span className="truncate">{subItem.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // 2. By Uses Submenu
              if (item.type === "uses") {
                const isMenuOpen = activeDropdown === "uses";

                return (
                  <div
                    key={item.name}
                    className="h-full flex items-center relative"
                    onMouseEnter={() => handleMouseEnter("uses")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="relative flex items-center h-full">
                      <Link
                        href={item.href}
                        onClick={closeDropdownImmediately}
                        className={`text-[11px] xl:text-[11.5px] 2xl:text-[12px] font-medium tracking-wider uppercase transition-colors duration-200 flex items-center space-x-0.5 py-6 font-sans whitespace-nowrap ${
                          active || isMenuOpen ? "text-[#C95745] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 text-[#C95745] ${
                            isMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Link>

                      <span
                        className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#C95745] transition-transform duration-200 origin-left ${
                          active || isMenuOpen ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </div>

                    {/* By Uses Dropdown Panel */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 w-[240px] bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] shadow-2xl p-5 z-50 before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 transition-all duration-150 ease-out ${
                        isMenuOpen
                          ? "opacity-100 visible pointer-events-auto translate-y-0"
                          : "opacity-0 invisible pointer-events-none -translate-y-1"
                      }`}
                    >
                      <div className="border-b border-[#C95745]/40 pb-2 mb-3">
                        <h4 className="font-serif text-[12.5px] font-bold text-[#101B38] tracking-wide uppercase">
                          By Uses
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {usesItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={closeDropdownImmediately}
                            className="flex items-center space-x-2 text-[11px] font-medium tracking-wide uppercase text-[#333333] hover:text-[#C95745] transition-colors group/subitem truncate"
                          >
                            <span className="text-[8px] text-[#C95745] transition-transform duration-200 group-hover/subitem:translate-x-0.5 select-none shrink-0">
                              ▸
                            </span>
                            <span className="truncate">{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // 3. By Space Submenu
              if (item.type === "space") {
                const isMenuOpen = activeDropdown === "space";

                return (
                  <div
                    key={item.name}
                    className="h-full flex items-center relative"
                    onMouseEnter={() => handleMouseEnter("space")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="relative flex items-center h-full">
                      <Link
                        href={item.href}
                        onClick={closeDropdownImmediately}
                        className={`text-[11px] xl:text-[11.5px] 2xl:text-[12px] font-medium tracking-wider uppercase transition-colors duration-200 flex items-center space-x-0.5 py-6 font-sans whitespace-nowrap ${
                          active || isMenuOpen ? "text-[#C95745] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 text-[#C95745] ${
                            isMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Link>

                      <span
                        className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#C95745] transition-transform duration-200 origin-left ${
                          active || isMenuOpen ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </div>

                    {/* By Space Dropdown Panel */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 w-[520px] max-w-[calc(100vw-2rem)] bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] shadow-2xl p-6 z-50 before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 transition-all duration-150 ease-out ${
                        isMenuOpen
                          ? "opacity-100 visible pointer-events-auto translate-y-0"
                          : "opacity-0 invisible pointer-events-none -translate-y-1"
                      }`}
                    >
                      <div className="border-b border-[#C95745]/40 pb-2 mb-3.5 flex items-center justify-between">
                        <h4 className="font-serif text-[12.5px] font-bold text-[#101B38] tracking-wide uppercase">
                          By Space
                        </h4>
                        <Link
                          href="/spaces"
                          onClick={closeDropdownImmediately}
                          className="text-[10px] font-semibold tracking-wider uppercase text-[#C95745] hover:underline"
                        >
                          All Spaces →
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-h-[360px] overflow-y-auto pr-1">
                        {spaceItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={closeDropdownImmediately}
                            className="flex items-center space-x-1.5 text-[11px] font-medium tracking-wide uppercase text-[#333333] hover:text-[#C95745] transition-colors group/subitem truncate"
                            title={subItem.name}
                          >
                            <span className="text-[8px] text-[#C95745] transition-transform duration-200 group-hover/subitem:translate-x-0.5 select-none shrink-0">
                              ▸
                            </span>
                            <span className="truncate">{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // 4. By Color Submenu
              if (item.type === "color") {
                const isMenuOpen = activeDropdown === "color";

                return (
                  <div
                    key={item.name}
                    className="h-full flex items-center relative"
                    onMouseEnter={() => handleMouseEnter("color")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="relative flex items-center h-full">
                      <Link
                        href={item.href}
                        onClick={closeDropdownImmediately}
                        className={`text-[11px] xl:text-[11.5px] 2xl:text-[12px] font-medium tracking-wider uppercase transition-colors duration-200 flex items-center space-x-0.5 py-6 font-sans whitespace-nowrap ${
                          active || isMenuOpen ? "text-[#C95745] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 text-[#C95745] ${
                            isMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Link>

                      <span
                        className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#C95745] transition-transform duration-200 origin-left ${
                          active || isMenuOpen ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </div>

                    {/* By Color Dropdown Panel */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 w-[460px] max-w-[calc(100vw-2rem)] bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] shadow-2xl p-6 z-50 before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 transition-all duration-150 ease-out ${
                        isMenuOpen
                          ? "opacity-100 visible pointer-events-auto translate-y-0"
                          : "opacity-0 invisible pointer-events-none -translate-y-1"
                      }`}
                    >
                      <div className="border-b border-[#C95745]/40 pb-2 mb-3.5 flex items-center justify-between">
                        <h4 className="font-serif text-[12.5px] font-bold text-[#101B38] tracking-wide uppercase">
                          By Color
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 max-h-[340px] overflow-y-auto pr-1">
                        {colorItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={closeDropdownImmediately}
                            className="flex items-center space-x-1.5 text-[11px] font-medium tracking-wide uppercase text-[#333333] hover:text-[#C95745] transition-colors group/subitem truncate"
                            title={subItem.name}
                          >
                            <span className="text-[8px] text-[#C95745] transition-transform duration-200 group-hover/subitem:translate-x-0.5 select-none shrink-0">
                              ▸
                            </span>
                            <span className="truncate">{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Standard Link Item (Inspiration, About Us, Contact)
              return (
                <div
                  key={item.name}
                  className="relative h-full flex items-center group"
                  onMouseEnter={() => handleMouseEnter(null)}
                >
                  <Link
                    href={item.href}
                    onClick={closeDropdownImmediately}
                    className={`text-[11px] xl:text-[11.5px] 2xl:text-[12px] font-medium tracking-wider uppercase transition-colors duration-200 font-sans whitespace-nowrap ${
                      active ? "text-[#101B38] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                    }`}
                  >
                    {item.name}
                  </Link>
                  {/* Active / Hover underline bar */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#C95745] transition-transform duration-300 origin-left ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </div>
              );
            })}
          </nav>

          {/* Action Icons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Tiles"
              className="text-[#101B38] hover:text-[#C95745] transition-colors duration-200 p-1.5 cursor-pointer focus:outline-none"
              title="Search Tiles (Name, Series, Category)"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative text-[#101B38] hover:text-[#C95745] transition-colors duration-200 p-1.5"
            >
              <Heart className="w-5 h-5" />
              {isMounted && (
                <span className="absolute -top-1 -right-1 bg-[#C95745] text-[#FCFBF8] text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Enquiry Cart Trigger Button — Cart Icon Only */}
            <button
              onClick={openEnquiryDrawer}
              className="relative text-[#101B38] hover:text-[#C95745] transition-colors duration-200 p-1.5 cursor-pointer"
              title="Enquiry Cart"
              aria-label={`Open Enquiry Cart with ${enquiryItemCount} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {isMounted && (
                <span className="absolute -top-1 -right-1 bg-[#C95745] text-[#FCFBF8] text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {enquiryItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle & Actions */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Tiles"
              className="text-[#101B38] p-1 hover:text-[#C95745] transition-colors cursor-pointer focus:outline-none"
              title="Search Tiles"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Enquiry Cart Button */}
            <button
              onClick={openEnquiryDrawer}
              className="relative p-1.5 text-[#101B38] hover:text-[#C95745] transition-colors cursor-pointer"
              aria-label={`Open Enquiry Cart with ${enquiryItemCount} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {isMounted && (
                <span className="absolute -top-1 -right-1 bg-[#C95745] text-[#FCFBF8] text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {enquiryItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#101B38] p-1 cursor-pointer focus:outline-none hover:text-[#C95745] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer — Warm Off-White */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#F7F5F0] border-b border-[#EDEAE4] px-6 py-6 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col space-y-3">
              {NAV_ITEMS.map((item) => {
                const active = isRouteActive(item.href);

                // Mobile Expandable 0: World of Tiles
                if (item.type === "world-of-tiles") {
                  const isSectionOpen = openMobileSubmenu === "world-of-tiles";
                  return (
                    <div key={item.name} className="border-b border-[#EDEAE4] pb-2.5">
                      <div className="flex items-center justify-between py-1">
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`text-xs font-medium tracking-widest uppercase font-sans ${
                            active ? "text-[#C95745] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                          }`}
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleMobileSubmenu("world-of-tiles")}
                          className="p-1 text-[#333333] focus:outline-none"
                          aria-label="Toggle World of Tiles Submenu"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isSectionOpen ? "rotate-180 text-[#C95745]" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {isSectionOpen && (
                        <div className="mt-3 pt-3 border-t border-[#EDEAE4] bg-[#FCFBF8] p-3.5 rounded-[2px] border space-y-3 max-h-[380px] overflow-y-auto">
                          <div className="flex justify-between items-center pb-1 border-b border-[#EDEAE4]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#101B38]">
                              {worldOfTilesCategories.length} Collections
                            </span>
                            <Link
                              href="/world-of-tiles"
                              onClick={() => setIsOpen(false)}
                              className="text-[9.5px] font-semibold text-[#C95745] uppercase tracking-wider"
                            >
                              All Collections →
                            </Link>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {worldOfTilesCategories.map((cat) => {
                              const thumbSrc = resolveCategoryImage(cat);
                              const href = cat.url || `/product-category/${cat.slug}`;
                              return (
                                <Link
                                  key={cat.slug}
                                  href={href}
                                  onClick={() => setIsOpen(false)}
                                  className="group relative flex items-center space-x-2 p-1.5 rounded-[2px] border border-[#EDEAE4] bg-white hover:border-[#C95745] transition-colors overflow-hidden"
                                  title={`Explore ${cat.name} Collection`}
                                >
                                  <div className="relative w-8 h-8 rounded-[1px] overflow-hidden flex-shrink-0 bg-[#101B38]">
                                    {thumbSrc ? (
                                      <Image
                                        src={thumbSrc}
                                        alt={cat.name}
                                        fill
                                        sizes="32px"
                                        className="object-cover"
                                      />
                                    ) : null}
                                  </div>
                                  <span className="text-[10px] font-serif font-bold text-[#101B38] group-hover:text-[#C95745] uppercase tracking-wide truncate">
                                    {cat.name}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Mobile Expandable 1: Collections (Without "By Look")
                if (item.type === "collections") {
                  const isSectionOpen = openMobileSubmenu === "collections";
                  return (
                    <div key={item.name} className="border-b border-[#EDEAE4] pb-2.5">
                      <div className="flex items-center justify-between py-1">
                        <Link
                          href={item.href}
                          className={`text-xs font-medium tracking-widest uppercase font-sans ${
                            active ? "text-[#C95745] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                          }`}
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleMobileSubmenu("collections")}
                          className="p-1 text-[#333333] focus:outline-none"
                          aria-label="Toggle Collections Submenu"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isSectionOpen ? "rotate-180 text-[#C95745]" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {isSectionOpen && (
                        <div className="mt-3 pt-3 border-t border-[#EDEAE4] bg-[#FCFBF8] p-3.5 rounded-[2px] border space-y-4 max-h-[360px] overflow-y-auto">
                          {collectionsGroups.map((group) => (
                            <div key={`mob-${group.id}`} className="space-y-1.5">
                              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#101B38] block pb-1 border-b border-[#EDEAE4]">
                                {group.title}
                              </span>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                                {group.items.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    className="flex items-center space-x-1.5 py-0.5 text-[#333333] hover:text-[#C95745] font-medium text-[10.5px] uppercase tracking-wide truncate"
                                    title={subItem.name}
                                  >
                                    <span className="text-[8px] text-[#C95745] shrink-0">▸</span>
                                    <span className="truncate">{subItem.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Mobile Expandable 2: By Uses
                if (item.type === "uses") {
                  const isSectionOpen = openMobileSubmenu === "uses";
                  return (
                    <div key={item.name} className="border-b border-[#EDEAE4] pb-2.5">
                      <div className="flex items-center justify-between py-1">
                        <Link
                          href={item.href}
                          className={`text-xs font-medium tracking-widest uppercase font-sans ${
                            active ? "text-[#C95745] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                          }`}
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleMobileSubmenu("uses")}
                          className="p-1 text-[#333333] focus:outline-none"
                          aria-label="Toggle By Uses Submenu"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isSectionOpen ? "rotate-180 text-[#C95745]" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {isSectionOpen && (
                        <div className="mt-3 pt-3 border-t border-[#EDEAE4] bg-[#FCFBF8] p-3 rounded-[2px] border space-y-2">
                          {usesItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="flex items-center space-x-2 py-1 text-[#333333] hover:text-[#C95745] font-medium text-[11px] uppercase tracking-wide"
                            >
                              <span className="text-[8px] text-[#C95745] shrink-0">▸</span>
                              <span>{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Mobile Expandable 3: By Space
                if (item.type === "space") {
                  const isSectionOpen = openMobileSubmenu === "space";
                  return (
                    <div key={item.name} className="border-b border-[#EDEAE4] pb-2.5">
                      <div className="flex items-center justify-between py-1">
                        <Link
                          href={item.href}
                          className={`text-xs font-medium tracking-widest uppercase font-sans ${
                            active ? "text-[#C95745] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                          }`}
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleMobileSubmenu("space")}
                          className="p-1 text-[#333333] focus:outline-none"
                          aria-label="Toggle By Space Submenu"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isSectionOpen ? "rotate-180 text-[#C95745]" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {isSectionOpen && (
                        <div className="mt-3 pt-3 border-t border-[#EDEAE4] bg-[#FCFBF8] p-3.5 rounded-[2px] border space-y-3 max-h-[340px] overflow-y-auto">
                          <div className="flex justify-between items-center pb-1 border-b border-[#EDEAE4]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#101B38]">
                              Spaces &amp; Areas
                            </span>
                            <Link
                              href="/spaces"
                              className="text-[9.5px] font-semibold text-[#C95745] uppercase tracking-wider"
                            >
                              All Spaces →
                            </Link>
                          </div>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                            {spaceItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="flex items-center space-x-1.5 py-0.5 text-[#333333] hover:text-[#C95745] font-medium text-[10.5px] uppercase tracking-wide truncate"
                                title={subItem.name}
                              >
                                <span className="text-[8px] text-[#C95745] shrink-0">▸</span>
                                <span className="truncate">{subItem.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Mobile Expandable 4: By Color
                if (item.type === "color") {
                  const isSectionOpen = openMobileSubmenu === "color";
                  return (
                    <div key={item.name} className="border-b border-[#EDEAE4] pb-2.5">
                      <div className="flex items-center justify-between py-1">
                        <Link
                          href={item.href}
                          className={`text-xs font-medium tracking-widest uppercase font-sans ${
                            active ? "text-[#C95745] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                          }`}
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleMobileSubmenu("color")}
                          className="p-1 text-[#333333] focus:outline-none"
                          aria-label="Toggle By Color Submenu"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isSectionOpen ? "rotate-180 text-[#C95745]" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {isSectionOpen && (
                        <div className="mt-3 pt-3 border-t border-[#EDEAE4] bg-[#FCFBF8] p-3.5 rounded-[2px] border space-y-3 max-h-[340px] overflow-y-auto">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#101B38] block pb-1 border-b border-[#EDEAE4]">
                            Available Colors
                          </span>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                            {colorItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="flex items-center space-x-1.5 py-0.5 text-[#333333] hover:text-[#C95745] font-medium text-[10.5px] uppercase tracking-wide truncate"
                                title={subItem.name}
                              >
                                <span className="text-[8px] text-[#C95745] shrink-0">▸</span>
                                <span className="truncate">{subItem.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Standard Single Links
                return (
                  <div key={item.name} className="border-b border-[#EDEAE4] pb-2.5">
                    <Link
                      href={item.href}
                      className={`text-xs font-medium tracking-widest uppercase flex items-center justify-between py-1 font-sans ${
                        active ? "text-[#C95745] font-bold" : "text-[#101B38] hover:text-[#C95745]"
                      }`}
                    >
                      <span>{item.name}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#C95745]" />}
                    </Link>
                  </div>
                );
              })}

              {/* Utility Quick Links in Mobile Menu */}
              <div className="pt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openEnquiryDrawer();
                  }}
                  className="w-full flex items-center justify-center space-x-2 text-xs font-medium uppercase tracking-wider text-[#FCFBF8] p-3 rounded-[2px] bg-[#101B38] hover:bg-[#C95745] transition-colors cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4 text-[#EDEAE4]" />
                  <span>Enquiry Cart ({isMounted ? enquiryItemCount : 0})</span>
                </button>

                <Link
                  href="/wishlist"
                  className="flex items-center justify-center space-x-2 text-xs font-medium uppercase tracking-wider text-[#101B38] hover:text-[#C95745] p-2.5 rounded-[2px] bg-[#FCFBF8] border border-[#EDEAE4]"
                >
                  <Heart className="w-4 h-4 text-[#C95745]" />
                  <span>Saved Wishlist ({isMounted ? wishlistItems.length : 0})</span>
                </Link>

                <Link
                  href="/blogs"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 text-xs font-medium uppercase tracking-wider text-[#101B38] hover:text-[#C95745] p-2.5 rounded-[2px] bg-[#FCFBF8] border border-[#EDEAE4]"
                >
                  <Newspaper className="w-4 h-4 text-[#C95745]" />
                  <span>Blogs &amp; Articles</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Search Overlay */}
      <ProductSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
