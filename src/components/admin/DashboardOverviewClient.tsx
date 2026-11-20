"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  FileText,
  Globe,
  Image as ImageIcon,
  Inbox,
  Trash2,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface HealthData {
  success: boolean;
  service: string;
  version: string;
  uptimeSeconds: number;
  database: {
    isMysqlConnected: boolean;
    mode: string;
  };
  counts: {
    products: number;
    activeProducts: number;
    blogs: number;
    activeBlogs: number;
    media: number;
    activeMedia: number;
    pages: number;
    trashedTotal: number;
    seoRecords: number;
    enquiries: number;
  };
}

export function DashboardOverviewClient() {
  const { user } = useAdminAuth();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [hRes, eRes] = await Promise.all([
          fetch(`/api/v1/health?_t=${Date.now()}`),
          fetch(`/api/v1/enquiries?_t=${Date.now()}`),
        ]);
        const hData = await hRes.json();
        const eData = await eRes.json();
        if (hData.success) setHealth(hData);
        if (eData.success && Array.isArray(eData.enquiries)) {
          setRecentEnquiries(eData.enquiries.slice(0, 5));
        }
      } catch (err) {
        console.warn("Overview data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const counts = health?.counts || {
    products: 40,
    activeProducts: 40,
    blogs: 6,
    activeBlogs: 6,
    media: 70,
    activeMedia: 70,
    pages: 15,
    trashedTotal: 0,
    seoRecords: 5,
    enquiries: 4,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#c5a880] font-extrabold uppercase tracking-widest block mb-1">
            System Overview & Metrics
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Welcome back, {user?.username || "Administrator"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Live statistics and synchronized system health for the Timex Ceramic store engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-xs font-semibold transition-colors"
          >
            <span>Preview Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#c5a880]" />
          </Link>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Products */}
        <Link
          href="/admin/products"
          className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-2 hover:border-[#c5a880]/40 transition-all group block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Total Products</span>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#c5a880] transition-colors" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-serif font-bold text-white group-hover:text-[#c5a880] transition-colors">
              {counts.products}
            </span>
            <Package className="w-6 h-6 text-[#c5a880]" />
          </div>
          <p className="text-[11px] text-emerald-400">{counts.activeProducts} active on public website</p>
        </Link>

        {/* Blog Posts */}
        <Link
          href="/admin/blog"
          className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-2 hover:border-[#c5a880]/40 transition-all group block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Published Articles</span>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#c5a880] transition-colors" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-serif font-bold text-white group-hover:text-[#c5a880] transition-colors">
              {counts.blogs}
            </span>
            <FileText className="w-6 h-6 text-[#c5a880]" />
          </div>
          <p className="text-[11px] text-gray-400">Live on /blogs editorial journal</p>
        </Link>

        {/* Media */}
        <Link
          href="/admin/media"
          className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-2 hover:border-[#c5a880]/40 transition-all group block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Media Assets</span>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#c5a880] transition-colors" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-serif font-bold text-white group-hover:text-[#c5a880] transition-colors">
              {counts.media}
            </span>
            <ImageIcon className="w-6 h-6 text-[#c5a880]" />
          </div>
          <p className="text-[11px] text-emerald-400">Indexed photographs & surface textures</p>
        </Link>

        {/* Pages */}
        <Link
          href="/admin/pages"
          className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-2 hover:border-[#c5a880]/40 transition-all group block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Website Pages</span>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#c5a880] transition-colors" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-serif font-bold text-white group-hover:text-[#c5a880] transition-colors">
              {counts.pages}
            </span>
            <Globe className="w-6 h-6 text-[#c5a880]" />
          </div>
          <p className="text-[11px] text-gray-400">Core static & dynamic route endpoints</p>
        </Link>

        {/* Enquiries */}
        <Link
          href="/admin/enquiries"
          className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-2 hover:border-[#c5a880]/40 transition-all group block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Customer Enquiries</span>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#c5a880] transition-colors" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-serif font-bold text-white group-hover:text-[#c5a880] transition-colors">
              {counts.enquiries}
            </span>
            <Inbox className="w-6 h-6 text-[#c5a880]" />
          </div>
          <p className="text-[11px] text-amber-400">Client leads & quotation requests</p>
        </Link>

        {/* Recycle Bin */}
        <Link
          href="/admin/recycle-bin"
          className="p-5 bg-[#111827] border border-white/10 rounded-2xl space-y-2 hover:border-red-500/40 transition-all group block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Recycle Bin</span>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-serif font-bold text-white group-hover:text-red-400 transition-colors">
              {counts.trashedTotal}
            </span>
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-[11px] text-gray-400">
            {counts.trashedTotal > 0 ? `${counts.trashedTotal} items pending purge` : "Recycle bin is clean"}
          </p>
        </Link>
      </div>

      {/* Recent Enquiries Preview */}
      <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Customer Enquiries</h3>
            <p className="text-xs text-gray-400">Latest quotation requests from prospective clients</p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs text-[#c5a880] hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">No customer enquiries recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase text-gray-400 border-b border-white/5">
                <tr>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentEnquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-semibold text-white">{e.name}</td>
                    <td className="py-3 text-gray-300 font-mono text-[11px]">{e.email}</td>
                    <td className="py-3 text-gray-400">{e.type || "Inquiry"}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          e.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400"
                            : e.status === "IN_PROGRESS"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
