"use client";

import { useState } from "react";
import { UserCheck, ShieldCheck, LayoutDashboard, Database, ClipboardList, Award, Image as ImageIcon, MapPin, Download, Search, FileText, Sparkles } from "lucide-react";
import { createInquiry } from "@/actions/inquiry";
import { getEmailError } from "@/lib/validation";

// Mock B2B Warehouses inventories
const WAREHOUSE_INVENTORY = [
  { code: "TMX-001", name: "Carrara Gold Slabs", ahmedabad: 450, mumbai: 180, delhi: 90 },
  { code: "TMX-002", name: "Royal Oak Brown", ahmedabad: 1200, mumbai: 600, delhi: 350 },
  { code: "TMX-003", name: "Slate Nero Slabs", ahmedabad: 800, mumbai: 300, delhi: 150 },
  { code: "TMX-004", name: "Concrete Grigio", ahmedabad: 600, mumbai: 400, delhi: 200 },
  { code: "TMX-005", name: "Terrazzo Bianco", ahmedabad: 300, mumbai: 150, delhi: 50 },
];

export function DealerPortalClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "stock" | "orders" | "rewards" | "marketing">("dashboard");
  const [stockSearch, setStockSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    const emailErr = getEmailError(email, true);
    if (emailErr) {
      setLoginError(emailErr);
      return;
    }

    setLoginError("");
    setLoading(true);

    await createInquiry({
      type: "DEALER_REGISTRATION",
      name: "B2B Dealer Partner",
      email: email.trim(),
      phone: "+91 98200 00000",
      message: "Dealer Network Authorization Request & B2B Inventory Access.",
      pageSource: "B2B Dealer Network Portal",
    });

    setLoading(false);
    setIsLoggedIn(true);
  };

  const filteredStock = WAREHOUSE_INVENTORY.filter(
    (item) =>
      item.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
      item.code.toLowerCase().includes(stockSearch.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div className="bg-[#F7F5F0] min-h-screen py-16 md:py-24 flex items-center justify-center px-6">
        <div className="bg-[#FCFBF8] w-full max-w-md rounded-[2px] shadow-md p-8 border border-[#EDEAE4] space-y-6">
          <div className="text-center space-y-2">
            <UserCheck className="w-10 h-10 text-[#C95745] mx-auto" />
            <h2 className="font-serif text-3xl font-bold text-[#101B38]">Dealer Portal</h2>
            <p className="text-xs text-[#333333]/70 font-light max-w-xs mx-auto">
              Authorized B2B wholesale network dashboard. Secure credential authentication required.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="flex flex-col space-y-1">
              <label className="text-[#101B38] font-medium">Dealer ID / Email</label>
              <input
                type="email"
                required
                placeholder="e.g. dealer.gujarat@timex.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-[#333333]/30 rounded-[2px] p-3 outline-none focus:border-[#101B38] bg-[#FCFBF8] text-[#101B38]"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[#101B38] font-medium">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-[#333333]/30 rounded-[2px] p-3 outline-none focus:border-[#101B38] bg-[#FCFBF8] text-[#101B38]"
              />
            </div>
            {loginError && (
              <p className="text-[#C95745] text-xs font-medium">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#101B38] text-[#FCFBF8] py-3.5 rounded-[2px] text-xs font-medium uppercase tracking-wider hover:bg-[#C95745] transition-colors cursor-pointer"
            >
              Secure Login &rarr;
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5F0] min-h-screen py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Navigation Column (lg:col-span-3) */}
        <aside className="lg:col-span-3 bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-6 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#EDEAE4]">
            <div className="w-10 h-10 rounded-[2px] bg-[#EDEAE4] text-[#101B38] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#101B38] text-base">Gujarat Ceramics Ltd.</h4>
              <p className="text-[10px] text-[#333333]/60 font-light mt-0.5">Dealer Tier: Gold Partner</p>
            </div>
          </div>

          <nav className="flex flex-col space-y-1.5 text-xs">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left py-3 px-4 rounded-[2px] flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === "dashboard" ? "bg-[#101B38] text-[#FCFBF8] font-medium" : "text-[#333333] hover:bg-[#EDEAE4] hover:text-[#101B38]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Partner Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("stock")}
              className={`w-full text-left py-3 px-4 rounded-[2px] flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === "stock" ? "bg-[#101B38] text-[#FCFBF8] font-medium" : "text-[#333333] hover:bg-[#EDEAE4] hover:text-[#101B38]"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Live Stock Checker</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left py-3 px-4 rounded-[2px] flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === "orders" ? "bg-[#101B38] text-[#FCFBF8] font-medium" : "text-[#333333] hover:bg-[#EDEAE4] hover:text-[#101B38]"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Dispatches & Invoices</span>
            </button>
            <button
              onClick={() => setActiveTab("rewards")}
              className={`w-full text-left py-3 px-4 rounded-[2px] flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === "rewards" ? "bg-[#101B38] text-[#FCFBF8] font-medium" : "text-[#333333] hover:bg-[#EDEAE4] hover:text-[#101B38]"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Loyalty Rewards Ledger</span>
            </button>
            <button
              onClick={() => setActiveTab("marketing")}
              className={`w-full text-left py-3 px-4 rounded-[2px] flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === "marketing" ? "bg-[#101B38] text-[#FCFBF8] font-medium" : "text-[#333333] hover:bg-[#EDEAE4] hover:text-[#101B38]"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Brand Marketing Collaterals</span>
            </button>
          </nav>
        </aside>

        {/* Right Dashboard Workspace (lg:col-span-9) */}
        <main className="lg:col-span-9 bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-8 shadow-xs min-h-[500px]">
          
          {/* TAB 1: Dashboard overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#101B38]">Partner Dashboard</h3>
                <p className="text-xs text-[#333333]/70 font-light mt-1">Real-time credit standings and trade analytics.</p>
              </div>

              {/* Stats Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[#EDEAE4]/50 p-6 rounded-[2px] border border-[#EDEAE4] space-y-1">
                  <span className="text-[10px] text-[#333333]/60 font-semibold uppercase tracking-wider block">Trade Credit Status</span>
                  <div className="font-serif text-2xl font-bold text-[#101B38]">Tier A Credit</div>
                  <p className="text-[9px] text-green-600 font-medium">Approved Dealer Trade Account</p>
                </div>
                <div className="bg-[#EDEAE4]/50 p-6 rounded-[2px] border border-[#EDEAE4] space-y-1">
                  <span className="text-[10px] text-[#333333]/60 font-semibold uppercase tracking-wider block">Accumulated Loyalty Points</span>
                  <div className="font-serif text-2xl font-bold text-[#C95745]">24,500 pts</div>
                  <p className="text-[9px] text-[#101B38] font-medium hover:underline cursor-pointer">Redeem lookbook gifts &rarr;</p>
                </div>
                <div className="bg-[#EDEAE4]/50 p-6 rounded-[2px] border border-[#EDEAE4] space-y-1">
                  <span className="text-[10px] text-[#333333]/60 font-semibold uppercase tracking-wider block">Pending Dispatches</span>
                  <div className="font-serif text-2xl font-bold text-[#101B38]">2 Shipments</div>
                  <p className="text-[9px] text-[#333333]/60 font-light">Est. Delivery: 48 Hours</p>
                </div>
              </div>

              {/* Announcements */}
              <div className="bg-[#EDEAE4] border border-[#DED9D0] p-6 rounded-[2px] space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#101B38]">
                  <Sparkles className="w-4 h-4 text-[#C95745]" />
                  <span>Annual Dealer Incentive Announcement</span>
                </div>
                <p className="text-xs text-[#333333]/80 font-light leading-relaxed">
                  Redeem 25,000 points this quarter to secure fully sponsored luxury packages for the Ceramic Design Expo in Milan, October 2026.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Live Stock Checker */}
          {activeTab === "stock" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#101B38]">Warehouse Stock Availability</h3>
                  <p className="text-xs text-[#333333]/70 font-light mt-1">Cross-check slab inventories across regional depots instantly.</p>
                </div>
                <div className="flex items-center bg-[#FCFBF8] border border-[#333333]/30 rounded-[2px] px-3 py-2 text-xs w-full sm:max-w-xs focus-within:border-[#101B38]">
                  <Search className="w-4 h-4 text-[#333333]/50 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search SKU or slab design..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    className="outline-none bg-transparent w-full text-[#101B38] font-light"
                  />
                </div>
              </div>

              <div className="border border-[#EDEAE4] rounded-[2px] overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#EDEAE4] border-b border-[#DED9D0] text-[#101B38] font-bold">
                      <th className="p-4">SKU Code</th>
                      <th className="p-4">Design Name</th>
                      <th className="p-4 flex items-center space-x-1"><MapPin className="w-3.5 h-3.5 text-[#C95745]" /><span>Ahmedabad</span></th>
                      <th className="p-4"><MapPin className="w-3.5 h-3.5 text-[#C95745]" /><span>Mumbai</span></th>
                      <th className="p-4"><MapPin className="w-3.5 h-3.5 text-[#C95745]" /><span>Delhi</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEAE4] text-[#333333] font-light">
                    {filteredStock.map((item) => (
                      <tr key={item.code} className="hover:bg-[#F7F5F0] transition-colors">
                        <td className="p-4 font-medium text-[#101B38]">{item.code}</td>
                        <td className="p-4">{item.name}</td>
                        <td className={`p-4 font-semibold ${item.ahmedabad > 400 ? "text-green-600" : "text-yellow-600"}`}>
                          {item.ahmedabad} boxes
                        </td>
                        <td className="p-4">{item.mumbai} boxes</td>
                        <td className="p-4">{item.delhi} boxes</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Dispatches & Invoices */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#101B38]">Dispatches & Invoices</h3>
                <p className="text-xs text-[#333333]/70 font-light mt-1">Track orders transit dispatches and download GST invoices.</p>
              </div>

              <div className="space-y-4">
                {/* Order card 1 */}
                <div className="border border-[#EDEAE4] rounded-[2px] p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-[#EDEAE4] pb-3">
                    <div>
                      <span className="font-semibold text-[#101B38]">Order ID: #TMX-2026-98402</span>
                      <span className="text-[10px] bg-yellow-50 text-yellow-700 font-semibold px-2 py-0.5 rounded-[2px] ml-3 uppercase">
                        In Transit
                      </span>
                    </div>
                    <span className="text-[#333333]/60">Date: June 28, 2026</span>
                  </div>

                  {/* Shipment progress timeline */}
                  <div className="flex items-center justify-between text-[10px] text-[#333333]/60 font-medium px-4">
                    <div className="flex flex-col items-center space-y-1 text-[#101B38]">
                      <div className="w-5 h-5 rounded-[2px] bg-[#101B38] text-[#FCFBF8] flex items-center justify-center font-bold">1</div>
                      <span>Confirmed</span>
                    </div>
                    <div className="flex-grow h-0.5 bg-[#101B38] mx-2" />
                    <div className="flex flex-col items-center space-y-1 text-[#101B38]">
                      <div className="w-5 h-5 rounded-[2px] bg-[#101B38] text-[#FCFBF8] flex items-center justify-center font-bold">2</div>
                      <span>Dispatched</span>
                    </div>
                    <div className="flex-grow h-0.5 bg-yellow-500 mx-2" />
                    <div className="flex flex-col items-center space-y-1 text-yellow-700">
                      <div className="w-5 h-5 rounded-[2px] bg-yellow-500 text-white flex items-center justify-center font-bold">3</div>
                      <span>In Depot</span>
                    </div>
                    <div className="flex-grow h-0.5 bg-[#EDEAE4] mx-2" />
                    <div className="flex flex-col items-center space-y-1 text-[#333333]/50">
                      <div className="w-5 h-5 rounded-[2px] bg-[#EDEAE4] flex items-center justify-center font-bold">4</div>
                      <span>Delivered</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-[#333333]/70 font-light">Slabs Quantity: 800 boxes (Ahmedabad Depot)</span>
                    <button className="text-xs text-[#101B38] hover:text-[#C95745] flex items-center space-x-1.5 font-medium cursor-pointer">
                      <FileText className="w-4 h-4 text-[#C95745]" />
                      <span>Download Invoice PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Rewards */}
          {activeTab === "rewards" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#101B38]">Loyalty Rewards Ledger</h3>
                <p className="text-xs text-[#333333]/70 font-light mt-1">Convert wholesale volumes into points redeemable for premium awards.</p>
              </div>

              <div className="bg-[#EDEAE4]/50 p-6 rounded-[2px] border border-[#EDEAE4] flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] text-[#333333]/60 font-semibold uppercase tracking-wider block">Redeemable Balance</span>
                  <div className="font-serif text-4xl font-bold text-[#C95745]">24,500 Points</div>
                  <p className="text-[10px] text-[#333333]/60 font-light">Equivalent valuation: INR 24,500</p>
                </div>
                <button className="bg-[#101B38] text-[#FCFBF8] text-xs font-medium uppercase tracking-wider px-6 py-3 rounded-[2px] hover:bg-[#C95745] transition-colors cursor-pointer">
                  Redeem Rewards Ledger
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Marketing */}
          {activeTab === "marketing" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#101B38]">Brand Marketing Collaterals</h3>
                <p className="text-xs text-[#333333]/70 font-light mt-1">Download high-res brand logotypes, lookbook catalogs, and showroom assets.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-[#101B38]">
                <div className="border border-[#EDEAE4] rounded-[2px] p-5 flex items-center justify-between group hover:border-[#101B38]/30 transition-all bg-[#FCFBF8]">
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="w-8 h-8 text-[#C95745]" />
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#101B38]">Showroom Banner Visuals</h4>
                      <p className="text-[9px] text-[#333333]/60 font-light">Zip Package &bull; 80MB</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-[#333333]/60 group-hover:text-[#C95745] transition-colors cursor-pointer" />
                </div>
                <div className="border border-[#EDEAE4] rounded-[2px] p-5 flex items-center justify-between group hover:border-[#101B38]/30 transition-all bg-[#FCFBF8]">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-[#C95745]" />
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#101B38]">GST Branding Guidelines</h4>
                      <p className="text-[9px] text-[#333333]/60 font-light">PDF document &bull; 4MB</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-[#333333]/60 group-hover:text-[#C95745] transition-colors cursor-pointer" />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

