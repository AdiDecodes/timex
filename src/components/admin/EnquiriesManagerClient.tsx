"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Inbox,
  Search,
  Filter,
  RefreshCw,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Phone,
  Mail,
  Building2,
  Calendar,
  Eye,
} from "lucide-react";

const API_BASE = "/api/v1";

interface EnquiryItem {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
  page_source?: string;
  details?: Record<string, any>;
  created_at: string;
}

export function EnquiriesManagerClient() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries?_t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.enquiries)) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "PENDING" | "IN_PROGRESS" | "RESOLVED") => {
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
        showToast(`Status updated to ${newStatus}`);
      } else {
        showToast(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update enquiry status:", err);
    }
  };

  const handleExportExcel = async () => {
    try {
      showToast("Generating Excel report...");
      const XLSX = await import("xlsx");
      const exportData = filteredEnquiries.map((e) => ({
        ID: e.id,
        Date: new Date(e.created_at).toLocaleDateString(),
        Type: e.type,
        "Customer Name": e.name,
        Email: e.email,
        Phone: e.phone,
        Company: e.company || "N/A",
        Status: e.status,
        "Source Page": e.page_source || "Website",
        Message: e.message,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");
      XLSX.writeFile(workbook, `Timex_Ceramic_Customer_Enquiries_${new Date().toISOString().split("T")[0]}.xlsx`);
      showToast("Downloaded Excel report of customer enquiries!");
    } catch (err: any) {
      showToast(`Excel export error: ${err.message}`);
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.phone?.toLowerCase().includes(q) ||
        e.message?.toLowerCase().includes(q) ||
        e.company?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#c5a880] text-black text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] text-[#c5a880] font-bold uppercase tracking-wider block">
                {selectedEnquiry.type || "Product Consultation"}
              </span>
              <h3 className="font-serif text-xl font-bold text-white">{selectedEnquiry.name}</h3>
              <p className="text-xs text-gray-400">
                Received on {new Date(selectedEnquiry.created_at).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#111827] border border-white/5 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Email</span>
                <p className="text-gray-200 font-mono text-[11px] truncate">{selectedEnquiry.email}</p>
              </div>
              <div className="p-3 bg-[#111827] border border-white/5 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Phone</span>
                <p className="text-gray-200 font-mono text-[11px]">{selectedEnquiry.phone}</p>
              </div>
              <div className="p-3 bg-[#111827] border border-white/5 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Company</span>
                <p className="text-gray-200 truncate">{selectedEnquiry.company || "Individual"}</p>
              </div>
              <div className="p-3 bg-[#111827] border border-white/5 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Source Page</span>
                <p className="text-gray-200 truncate">{selectedEnquiry.page_source || "Website"}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Customer Message</span>
              <div className="p-4 bg-[#111827] border border-white/5 rounded-2xl text-xs text-gray-300 leading-relaxed max-h-48 overflow-y-auto">
                {selectedEnquiry.message || "No specific message provided."}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value as any)}
                  className="bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Customer Enquiries</h2>
          <p className="text-xs text-gray-400">Manage client leads, architectural project requests, and sample requests.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchEnquiries}
            title="Reload enquiries"
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors cursor-pointer border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#c5a880]" : ""}`} />
          </button>

          <button
            onClick={handleExportExcel}
            title="Export to Excel"
            className="flex items-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors cursor-pointer border border-white/10 text-xs font-semibold"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-[#111827] border border-white/10 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiries by customer name, email, phone, company..."
            className="w-full pl-10 pr-4 py-2 bg-[#090d16] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
          >
            <option value="ALL">All Statuses ({enquiries.length})</option>
            <option value="PENDING">Pending Only</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <div className="w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs">Loading customer enquiries...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <Inbox className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-sm font-medium text-gray-300">No enquiries found matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c1220] border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Contact</th>
                  <th className="px-4 py-3.5">Type & Company</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEnquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-white text-xs group-hover:text-[#c5a880] transition-colors">{e.name}</p>
                      <p className="text-[10px] text-gray-400 line-clamp-1 max-w-xs">{e.message}</p>
                    </td>
                    <td className="px-4 py-3.5 text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-gray-500" />
                        <span className="font-mono text-[11px]">{e.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-500" />
                        <span className="font-mono text-[11px] text-gray-400">{e.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-white font-medium">{e.type || "General Inquiry"}</p>
                      <p className="text-[10px] text-gray-400">{e.company || "Individual Client"}</p>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-[11px] whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={e.status}
                        onChange={(evt) => handleStatusChange(e.id, evt.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          e.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : e.status === "IN_PROGRESS"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        <option value="PENDING" className="bg-[#0d1424] text-amber-400">PENDING</option>
                        <option value="IN_PROGRESS" className="bg-[#0d1424] text-blue-400">IN PROGRESS</option>
                        <option value="RESOLVED" className="bg-[#0d1424] text-emerald-400">RESOLVED</option>
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(e)}
                        title="View Full Details"
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
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
