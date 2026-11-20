"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Check,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export function SiteAuditTab({ onNavigateTab }: { onNavigateTab?: (tab: string) => void }) {
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [filterLevel, setFilterLevel] = useState<"ALL" | "ERROR" | "WARNING">("ALL");

  const runAudit = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/v1/seo/audit?_t=" + Date.now());
      const data = await res.json();
      if (data.success && data.audit) {
        setAudit(data.audit);
      }
    } catch (err) {
      console.error("Run audit error:", err);
    } finally {
      setRunning(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  const issues: any[] = audit?.issues || [];
  const filteredIssues = issues.filter(
    (i) => filterLevel === "ALL" || i.level === filterLevel
  );

  const healthScore = audit?.healthScore || 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#111827] border border-white/10 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/20">
              Diagnostic Crawler Engine
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Automated Site-Wide SEO Audit
          </h2>
          <p className="text-xs text-gray-400">
            Real-time multi-point crawl of titles, descriptions, canonicals, 404s, schema, image ALTs, and indexability.
          </p>
        </div>

        <button
          onClick={runAudit}
          disabled={running}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#b09166] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c5a880]/20 hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 w-fit"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${running ? "animate-pulse" : ""}`} />
          {running ? "Auditing Site..." : "Start SEO Audit"}
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-gray-400 font-mono text-xs animate-pulse">
          Running 18-point comprehensive audit across 84 surfaces...
        </div>
      ) : (
        <>
          {/* Audit Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#111827] border border-white/10 rounded-2xl space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Health Score</span>
              <div className="text-3xl font-serif font-bold text-white mt-1">
                {healthScore} <span className="text-xs text-gray-400 font-normal">/ 100</span>
              </div>
              <p className="text-[10px] text-emerald-400">Calculated from 18 inspection rules</p>
            </div>

            <div className="p-4 bg-[#111827] border border-white/10 rounded-2xl space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Checks Passed</span>
              <div className="text-3xl font-serif font-bold text-emerald-400 mt-1">
                {audit?.passedChecksCount || 0}
              </div>
              <p className="text-[10px] text-gray-400">Clean HTML tags & structured schemas</p>
            </div>

            <div className="p-4 bg-[#111827] border border-white/10 rounded-2xl space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Errors (Critical)</span>
              <div className="text-3xl font-serif font-bold text-rose-400 mt-1">
                {audit?.errorCount || 0}
              </div>
              <p className="text-[10px] text-rose-300">Requires prompt correction</p>
            </div>

            <div className="p-4 bg-[#111827] border border-white/10 rounded-2xl space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Warnings</span>
              <div className="text-3xl font-serif font-bold text-amber-400 mt-1">
                {audit?.warningCount || 0}
              </div>
              <p className="text-[10px] text-amber-300">Optimization opportunities</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 bg-[#111827] border border-white/10 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterLevel("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  filterLevel === "ALL" ? "bg-[#c5a880] text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                All Issues ({issues.length})
              </button>
              <button
                onClick={() => setFilterLevel("ERROR")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  filterLevel === "ERROR" ? "bg-rose-500 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Errors ({audit?.errorCount || 0})
              </button>
              <button
                onClick={() => setFilterLevel("WARNING")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  filterLevel === "WARNING" ? "bg-amber-500 text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                Warnings ({audit?.warningCount || 0})
              </button>
            </div>

            <span className="text-[11px] text-gray-400">
              Scanned: {audit?.scannedPagesCount || 84} live public surfaces
            </span>
          </div>

          {/* Issues List */}
          <div className="space-y-3">
            {filteredIssues.length === 0 ? (
              <div className="p-12 text-center bg-[#111827] border border-white/10 rounded-2xl space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-serif font-bold text-white">No Issues In This Category</h3>
                <p className="text-xs text-gray-400">All evaluated factors meet the highest standard.</p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start justify-between gap-4 transition-all ${
                    issue.level === "ERROR"
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                      : "bg-[#111827] border-white/10 text-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {issue.level === "ERROR" ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            issue.level === "ERROR"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {issue.level}
                        </span>
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white/5 text-[#c5a880]">
                          {issue.page}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-mono">[{issue.category}]</span>
                      </div>

                      <p className="text-xs font-semibold text-white">{issue.message}</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        <strong>Suggested Action:</strong> {issue.recommendation}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {onNavigateTab && (
                      <button
                        onClick={() =>
                          onNavigateTab(
                            issue.category === "404 Errors"
                              ? "404-monitor"
                              : issue.category === "Sitemap"
                              ? "sitemap"
                              : "page-seo"
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#c5a880] text-gray-300 hover:text-black font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        Fix Issue <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
