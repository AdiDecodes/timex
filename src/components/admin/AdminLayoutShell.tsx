"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  Globe,
  Image as ImageIcon,
  Inbox,
  Sparkles,
  HelpCircle,
  Trash2,
  KeyRound,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  Compass,
  FolderTree,
  BookOpen,
  Video,
  Palette,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface AdminCounts {
  products?: number;
  blogs?: number;
  pages?: number;
  media?: number;
  enquiries?: number;
  trashedTotal?: number;
}

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const [counts, setCounts] = useState<AdminCounts>({
    products: 40,
    blogs: 6,
    pages: 15,
    media: 70,
    enquiries: 4,
    trashedTotal: 0,
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchCounts() {
      try {
        const res = await fetch(`/api/v1/health?_t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.success && data.counts) {
          setCounts(data.counts);
        }
      } catch (err) {
        console.warn("Could not fetch badge counts:", err);
      }
    }
    fetchCounts();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: Package,
      badge: counts.products,
    },
    {
      label: "Product Categories",
      href: "/admin/product-categories",
      icon: FolderTree,
    },
    {
      label: "Blog Posts",
      href: "/admin/blog",
      icon: FileText,
      badge: counts.blogs,
    },
    {
      label: "Blog Categories",
      href: "/admin/blog-categories",
      icon: BookOpen,
    },
    {
      label: "Tiles by Space / Area",
      href: "/admin/tiles-by-space",
      icon: Compass,
    },
    {
      label: "Color Management",
      href: "/admin/colors",
      icon: Palette,
    },
    {
      label: "Pages",
      href: "/admin/pages",
      icon: Globe,
      badge: counts.pages,
    },
    {
      label: "Media",
      href: "/admin/media",
      icon: ImageIcon,
      badge: counts.media,
    },
    {
      label: "Enquiries",
      href: "/admin/enquiries",
      icon: Inbox,
      badge: counts.enquiries,
    },
    {
      label: "Watch & Choose Videos",
      href: "/admin/videos",
      icon: Video,
      badge: "217",
    },
    {
      label: "SEO Engine",
      href: "/admin/seo",
      icon: Sparkles,
      badge: "19",
    },
    {
      label: "Recycle Bin",
      href: "/admin/recycle-bin",
      icon: Trash2,
      badge: counts.trashedTotal,
      isTrash: true,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: KeyRound,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col font-sans relative selection:bg-[#c5a880] selection:text-black">
      {/* Top Sticky Header */}
      <header className="bg-[#0d1424] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#c5a880] to-[#99794d] rounded-xl flex items-center justify-center shadow-lg shadow-[#c5a880]/20">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-white tracking-wide">Timex Ceramic CMS</h1>
            <p className="text-[10px] text-[#c5a880] font-semibold uppercase tracking-wider">
              Single Source of Truth Store Engine
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#c5a880]" />
          </Link>

          <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{user?.username || "Admin User"}</p>
              <p className="text-[10px] text-gray-400">System Manager</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              type="button"
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#0d1424] border-r border-white/5 p-4 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto relative z-30 pointer-events-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");

            let activeClass = "bg-[#c5a880] text-black shadow-lg shadow-[#c5a880]/20 font-semibold";
            let badgeClass = "bg-black/20 text-black";

            if (item.isTrash) {
              if (isActive) {
                activeClass = "bg-red-600 text-white shadow-lg shadow-red-600/20 font-semibold";
                badgeClass = "bg-black/30 text-white";
              } else if (Number(item.badge) > 0) {
                activeClass = "text-red-400 hover:bg-red-500/10 hover:text-red-300";
                badgeClass = "bg-red-500/20 text-red-400 font-bold border border-red-500/30";
              } else {
                activeClass = "text-gray-400 hover:bg-white/5 hover:text-white";
                badgeClass = "bg-white/10 text-gray-400";
              }
            } else if (!isActive) {
              activeClass = "text-gray-300 hover:bg-white/5 hover:text-white";
              badgeClass = "bg-white/10 text-gray-300";
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={(e) => {
                  if (pathname === item.href) {
                    e.preventDefault();
                  }
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer select-none pointer-events-auto ${activeClass}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 font-medium ${badgeClass}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </aside>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full relative z-10 pointer-events-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
