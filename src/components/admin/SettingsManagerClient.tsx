"use client";

import React, { useState, useEffect } from "react";
import {
  KeyRound,
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  Server,
  Activity,
  Database,
  Cpu,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { changeAdminPassword } from "@/services/auth";

export function SettingsManagerClient() {
  const { user, token } = useAdminAuth();

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Diagnostics state
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/v1/health")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setHealthData(d);
      })
      .catch(() => {});
  }, []);

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Active session not found. Please log in again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await changeAdminPassword(
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        token
      );

      if (data.success) {
        setSuccess(data.message || "Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Failed to update password.");
      }
    } catch (err: any) {
      setError("Error updating password: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <span className="text-[10px] text-[#c5a880] font-extrabold uppercase tracking-widest block mb-1">
          Access & Security Controls
        </span>
        <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Administrator Settings</h2>
        <p className="text-xs text-gray-400">
          Manage your administrative credentials, encryption standards, and server environment.
        </p>
      </div>

      {/* Account Overview Card */}
      <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Active Administrator Account</h3>
            <p className="text-xs text-gray-400">Current authentication credentials and cryptographic profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-[#111827] rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Username</span>
            <span className="text-sm font-semibold text-white mt-1 block">{user?.username || "Admin"}</span>
          </div>
          <div className="p-4 bg-[#111827] rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Email</span>
            <span className="text-sm font-semibold text-white mt-1 block truncate">{user?.email || "admin@timexceramic.com"}</span>
          </div>
          <div className="p-4 bg-[#111827] rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Security Standard</span>
            <span className="text-xs font-semibold text-emerald-400 mt-1 block">Bcrypt (12 Rounds) + 24h JWT</span>
          </div>
        </div>
      </div>

      {/* Change Password Form Card */}
      <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Change Admin Password</h3>
            <p className="text-xs text-gray-400">Update your credentials. Minimum 16 characters with full complexity required.</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              New Password (16+ Characters)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
              placeholder="Enter new 16+ character password"
              autoComplete="new-password"
            />
          </div>

          {renderPasswordRules(newPassword)}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[11px] text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#c5a880] hover:bg-[#b09166] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-[#c5a880]/20"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Diagnostics Card */}
      <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">System Diagnostics</h3>
            <p className="text-xs text-gray-400">Server environment, database mode, and active services</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#111827] rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-gray-400">Backend API</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>

          <div className="p-3 bg-[#111827] rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-gray-400">Storage Mode</span>
            <span className="text-white font-mono text-[11px]">
              {healthData?.database?.mode || "Local Resilient Store (store.json)"}
            </span>
          </div>

          <div className="p-3 bg-[#111827] rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-gray-400">API Service</span>
            <span className="text-gray-200">{healthData?.service || "Timex Ceramic Admin API"}</span>
          </div>

          <div className="p-3 bg-[#111827] rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-gray-400">Version</span>
            <span className="text-[#c5a880] font-mono">{healthData?.version || "1.0.0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
