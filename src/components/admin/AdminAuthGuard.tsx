"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { AdminLayoutShell } from "./AdminLayoutShell";

function InnerGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useAdminAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && !isLoginPage) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/admin/login?returnUrl=${returnUrl}`);
      // Guaranteed redirect fallback across tunnels and slow networks
      const timer = setTimeout(() => {
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
          window.location.href = `/admin/login?returnUrl=${returnUrl}`;
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAuthLoading, isLoginPage, pathname, router]);

  // If we are on the login page, render children directly without dashboard shell
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#070b14] text-white">{children}</div>;
  }

  // During auth check, show secure loading screen; NEVER render children or leak admin markup
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-white p-6 select-none">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c5a880]/20 to-[#c5a880]/5 border border-[#c5a880]/30 flex items-center justify-center shadow-2xl relative">
            <Lock className="w-7 h-7 text-[#c5a880]" />
            <div className="absolute inset-0 rounded-2xl border border-[#c5a880]/40 animate-ping opacity-20" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white tracking-wide">Verifying Admin Authorization</h2>
            <p className="text-xs text-gray-400">Authenticating secure administrative session...</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#c5a880] font-mono pt-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#c5a880]" />
            <span>Establishing encrypted channel</span>
          </div>
        </div>
      </div>
    );
  }

  // If unauthenticated, render redirect message (router.replace will redirect to /admin/login)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-white p-6">
        <div className="flex flex-col items-center space-y-3 max-w-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-sm font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-gray-400">Redirecting to administrator login...</p>
        </div>
      </div>
    );
  }

  // Authenticated: render persistent layout shell with child route
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <InnerGuard>{children}</InnerGuard>
    </AdminAuthProvider>
  );
}
