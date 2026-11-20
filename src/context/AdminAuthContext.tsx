"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AdminUser, checkAuthStatus, getAdminProfile } from "@/services/auth";

interface AdminAuthContextType {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isSetupRequired: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  setIsSetupRequired: (val: boolean) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 1) {
  if (typeof document === "undefined") return;
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${
    isSecure ? "; Secure" : ""
  }`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${
    isSecure ? "; Secure" : ""
  }`;
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSetupRequired, setIsSetupRequired] = useState(false);

  const login = useCallback((newToken: string, newUser: AdminUser) => {
    setToken(newToken);
    setUser(newUser);
    setCookie("timex_admin_token", newToken, 1);
    if (typeof window !== "undefined") {
      localStorage.setItem("timex_admin_token", newToken);
      localStorage.setItem("timex_admin_user", JSON.stringify(newUser));
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    removeCookie("timex_admin_token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("timex_admin_token");
      localStorage.removeItem("timex_admin_user");
      window.location.href = "/admin/login";
    }
    fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
  }, []);

  const refreshProfile = useCallback(async () => {
    const curToken = token || getCookie("timex_admin_token") || (typeof window !== "undefined" ? localStorage.getItem("timex_admin_token") : null);
    if (!curToken) return;
    try {
      const res = await getAdminProfile(curToken);
      if (res.success && res.user) {
        setUser(res.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("timex_admin_user", JSON.stringify(res.user));
        }
      }
    } catch (err) {
      console.warn("Could not refresh profile:", err);
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        // 1. Check system setup status
        const status = await checkAuthStatus();
        if (!isMounted) return;

        if (status.setupRequired) {
          setIsSetupRequired(true);
          setToken(null);
          setUser(null);
          removeCookie("timex_admin_token");
          if (typeof window !== "undefined") {
            localStorage.removeItem("timex_admin_token");
            localStorage.removeItem("timex_admin_user");
          }
          setIsAuthLoading(false);
          return;
        }

        // 2. Read saved token (cookie has priority, fallback to localStorage)
        let savedToken = getCookie("timex_admin_token");
        if (!savedToken && typeof window !== "undefined") {
          savedToken = localStorage.getItem("timex_admin_token");
        }

        if (savedToken) {
          const profile = await getAdminProfile(savedToken);
          if (!isMounted) return;

          if (profile.success && profile.user) {
            setToken(savedToken);
            setUser(profile.user);
            setCookie("timex_admin_token", savedToken, 1);
            if (typeof window !== "undefined") {
              localStorage.setItem("timex_admin_token", savedToken);
              localStorage.setItem("timex_admin_user", JSON.stringify(profile.user));
            }
          } else {
            // Expired or invalid token
            setToken(null);
            setUser(null);
            removeCookie("timex_admin_token");
            if (typeof window !== "undefined") {
              localStorage.removeItem("timex_admin_token");
              localStorage.removeItem("timex_admin_user");
            }
          }
        }
      } catch (err) {
        console.error("Auth context initialization error:", err);
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        isAuthLoading,
        isSetupRequired,
        login,
        logout,
        refreshProfile,
        setIsSetupRequired,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return ctx;
}
