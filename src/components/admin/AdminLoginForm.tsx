"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  loginAdmin,
  setupInitialAdmin,
  forgotPassword,
  resetPasswordWithToken,
} from "@/services/auth";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/admin";
  const resetTokenParam = searchParams.get("resetToken") || "";

  const { isAuthenticated, isAuthLoading, isSetupRequired, login, setIsSetupRequired } = useAdminAuth();

  // Mode: "login" | "setup" | "forgot" | "reset"
  const [mode, setMode] = useState<"login" | "setup" | "forgot" | "reset">("login");

  // Login inputs (strictly empty, no hints, no pre-fill)
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Setup inputs
  const [setupUsername, setSetupUsername] = useState("");
  const [setupEmail, setSetupEmail] = useState("");
  const [setupPassword, setSetupPassword] = useState("");
  const [setupConfirmPassword, setSetupConfirmPassword] = useState("");
  const [setupError, setSetupError] = useState("");
  const [isSettingUp, setIsSettingUp] = useState(false);

  // Forgot password inputs
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [devResetToken, setDevResetToken] = useState<string | null>(null);

  // Reset password inputs
  const [resetToken, setResetToken] = useState(resetTokenParam);
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(returnUrl);
    }
  }, [isAuthenticated, isAuthLoading, router, returnUrl]);

  // Set mode based on setup status or URL params
  useEffect(() => {
    if (resetTokenParam) {
      setResetToken(resetTokenParam);
      setMode("reset");
    } else if (isSetupRequired) {
      setMode("setup");
    }
  }, [isSetupRequired, resetTokenParam]);

  // Password rules validation helper
  const renderPasswordRules = (pwd: string) => {
    const criteria = [
      { label: "16+ characters minimum", met: pwd.length >= 16 },
      { label: "Uppercase letter (A-Z)", met: /[A-Z]/.test(pwd) },
      { label: "Lowercase letter (a-z)", met: /[a-z]/.test(pwd) },
      { label: "Numeric digit (0-9)", met: /[0-9]/.test(pwd) },
      { label: "Special symbol (!@#$%...)", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pwd) },
      {
        label: "No predictable keywords (admin, timex, password)",
        met:
          pwd.length > 0 &&
          !["admin", "admin123", "password", "123456", "timex", "timex123", "qwerty", "letmein"].some((t) =>
            pwd.toLowerCase().includes(t)
          ),
      },
    ];

    return (
      <div className="p-3.5 bg-[#111827] border border-white/5 rounded-2xl space-y-1.5 text-[11px]">
        <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-2">Password Requirements</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {criteria.map((c, i) => (
            <div key={i} className={`flex items-center gap-1.5 ${c.met ? "text-emerald-400 font-semibold" : "text-gray-500"}`}>
              {c.met ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-gray-600 shrink-0" />
              )}
              <span className="truncate">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await loginAdmin(loginIdentifier.trim(), loginPassword);
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        setLoginPassword("");
        router.replace(returnUrl);
      } else {
        setLoginError(res.error || "Invalid username or password.");
      }
    } catch (err: any) {
      setLoginError("Could not connect to authentication service. Please check network connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle First-Time Setup
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError("");

    if (setupPassword !== setupConfirmPassword) {
      setSetupError("Password confirmation does not match.");
      return;
    }

    setIsSettingUp(true);
    try {
      const res = await setupInitialAdmin({
        username: setupUsername.trim(),
        email: setupEmail.trim(),
        password: setupPassword,
        confirmPassword: setupConfirmPassword,
      });

      if (res.success && res.token && res.user) {
        setIsSetupRequired(false);
        login(res.token, res.user);
        setSetupPassword("");
        setSetupConfirmPassword("");
        router.replace(returnUrl);
      } else {
        setSetupError(res.error || "Failed to initialize administrator account.");
      }
    } catch (err: any) {
      setSetupError("Error creating admin account: " + err.message);
    } finally {
      setIsSettingUp(false);
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    setIsForgotLoading(true);

    try {
      const res = await forgotPassword(forgotEmail.trim());
      if (res.success) {
        setForgotMessage(res.message || "Reset instructions have been generated.");
        if (res.resetToken) {
          setDevResetToken(res.resetToken);
        }
      } else {
        setForgotError(res.error || "Failed to process password reset request.");
      }
    } catch (err: any) {
      setForgotError("Error requesting password reset: " + err.message);
    } finally {
      setIsForgotLoading(false);
    }
  };

  // Handle Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (resetNewPassword !== resetConfirmPassword) {
      setResetError("New passwords do not match.");
      return;
    }

    setIsResetting(true);
    try {
      const res = await resetPasswordWithToken({
        token: resetToken.trim(),
        newPassword: resetNewPassword,
        confirmPassword: resetConfirmPassword,
      });

      if (res.success) {
        setResetSuccess(res.message || "Password successfully changed!");
        setTimeout(() => {
          setMode("login");
          setResetSuccess("");
          setResetNewPassword("");
          setResetConfirmPassword("");
          setResetToken("");
        }, 2000);
      } else {
        setResetError(res.error || "Failed to reset password.");
      }
    } catch (err: any) {
      setResetError("Error resetting password: " + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6 luxury-grid relative">
      <div className="glow-gold w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25 pointer-events-none" />

      <div className="max-w-md w-full bg-[#0d1424] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 space-y-6">
        {/* ======================================================== */}
        {/* 1. FIRST-TIME ADMIN SETUP                                */}
        {/* ======================================================== */}
        {mode === "setup" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-gradient-to-br from-[#c5a880]/20 to-transparent rounded-2xl border border-[#c5a880]/30 mb-2">
                <ShieldCheck className="w-8 h-8 text-[#c5a880]" />
              </div>
              <span className="text-[10px] tracking-[0.3em] text-[#c5a880] font-extrabold uppercase block">
                Security Initialization
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">First-Time Admin Setup</h1>
              <p className="text-xs text-gray-400 font-light">
                Create your primary administrator account. A secure 16+ character password with full complexity is required.
              </p>
            </div>

            {setupError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{setupError}</span>
              </div>
            )}

            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={setupUsername}
                  onChange={(e) => setSetupUsername(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  placeholder="e.g. timex_admin"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  placeholder="e.g. admin@timexceramic.com"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Create Password (16+ Characters)
                </label>
                <input
                  type="password"
                  required
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  placeholder=""
                  autoComplete="new-password"
                />
              </div>

              {renderPasswordRules(setupPassword)}

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={setupConfirmPassword}
                  onChange={(e) => setSetupConfirmPassword(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  placeholder=""
                  autoComplete="new-password"
                />
                {setupConfirmPassword && setupPassword !== setupConfirmPassword && (
                  <p className="text-[11px] text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSettingUp}
                className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#c5a880]/20 hover:opacity-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isSettingUp ? "Initializing Security Vault..." : "Create Administrator Account"}
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. ADMIN LOGIN FORM                                      */}
        {/* ======================================================== */}
        {mode === "login" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-gradient-to-br from-[#c5a880]/20 to-transparent rounded-2xl border border-[#c5a880]/30 mb-2">
                <ShieldCheck className="w-8 h-8 text-[#c5a880]" />
              </div>
              <span className="text-[10px] tracking-[0.3em] text-[#c5a880] font-extrabold uppercase block">
                Timex Ceramic Management System
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">Admin Control Portal</h1>
              <p className="text-xs text-gray-400 font-light">
                Sign in to manage surface products, blogs, SEO metadata, and customer lead inquiries.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Email / Username
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  placeholder=""
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  placeholder=""
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#c5a880]/20 hover:opacity-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? "Authenticating..." : "LOGIN"}
              </button>
            </form>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setLoginError("");
                  setMode("forgot");
                }}
                className="text-gray-400 hover:text-[#c5a880] transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                &larr; Return to Public Website
              </Link>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. FORGOT PASSWORD REQUEST                               */}
        {/* ======================================================== */}
        {mode === "forgot" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-gradient-to-br from-[#c5a880]/20 to-transparent rounded-2xl border border-[#c5a880]/30 mb-2">
                <KeyRound className="w-8 h-8 text-[#c5a880]" />
              </div>
              <span className="text-[10px] tracking-[0.3em] text-[#c5a880] font-extrabold uppercase block">
                Account Recovery
              </span>
              <h1 className="font-serif text-2xl font-bold text-white">Reset Admin Password</h1>
              <p className="text-xs text-gray-400 font-light">
                Enter your registered email address to receive or generate a 1-hour secure password reset token.
              </p>
            </div>

            {forgotError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotMessage && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{forgotMessage}</span>
              </div>
            )}

            {devResetToken && (
              <div className="p-4 bg-[#111827] border border-[#c5a880]/30 rounded-2xl space-y-2">
                <p className="text-[10px] font-bold text-[#c5a880] uppercase tracking-wider">
                  Temporary Reset Token (Valid for 1 Hour):
                </p>
                <code className="block p-2 bg-black/40 rounded-lg text-[11px] font-mono text-gray-200 break-all select-all">
                  {devResetToken}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    setResetToken(devResetToken);
                    setMode("reset");
                  }}
                  className="w-full py-2 bg-[#c5a880] hover:bg-[#b09166] text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Proceed to Set New Password &rarr;
                </button>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Registered Email
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  placeholder="e.g. admin@timexceramic.com"
                />
              </div>

              <button
                type="submit"
                disabled={isForgotLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#c5a880]/20 hover:opacity-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isForgotLoading ? "Generating..." : "Generate Reset Token"}
              </button>
            </form>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setForgotError("");
                  setForgotMessage("");
                  setMode("login");
                }}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                &larr; Back to Login
              </button>
              <button
                type="button"
                onClick={() => setMode("reset")}
                className="text-[#c5a880] hover:underline transition-colors cursor-pointer"
              >
                Already have a token?
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. RESET PASSWORD WITH TOKEN                             */}
        {/* ======================================================== */}
        {mode === "reset" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-gradient-to-br from-[#c5a880]/20 to-transparent rounded-2xl border border-[#c5a880]/30 mb-2">
                <Lock className="w-8 h-8 text-[#c5a880]" />
              </div>
              <span className="text-[10px] tracking-[0.3em] text-[#c5a880] font-extrabold uppercase block">
                Account Recovery
              </span>
              <h1 className="font-serif text-2xl font-bold text-white">Set New Admin Password</h1>
              <p className="text-xs text-gray-400 font-light">
                Enter your 1-hour secure reset token and create a strong 16+ character password.
              </p>
            </div>

            {resetError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Reset Token
                </label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors font-mono"
                  placeholder="Paste 64-character token"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  New Password (16+ Characters)
                </label>
                <input
                  type="password"
                  required
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  placeholder=""
                  autoComplete="new-password"
                />
              </div>

              {renderPasswordRules(resetNewPassword)}

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  placeholder=""
                  autoComplete="new-password"
                />
                {resetConfirmPassword && resetNewPassword !== resetConfirmPassword && (
                  <p className="text-[11px] text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#c5a880]/20 hover:opacity-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isResetting ? "Updating Password..." : "Save New Password"}
              </button>
            </form>

            <div className="pt-2 text-center text-xs">
              <button
                type="button"
                onClick={() => {
                  setResetError("");
                  setResetSuccess("");
                  setMode("login");
                }}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                &larr; Return to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
