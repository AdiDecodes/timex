"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCheck, Folder, Sparkles, Download, Layers, Box, Plus, Trash2, ArrowRight } from "lucide-react";
import { createInquiry } from "@/actions/inquiry";
import { getEmailError } from "@/lib/validation";

// Mock Architect CAD/BIM libraries
const BIM_LIBRARY = [
  { code: "TMX-001", name: "Carrara Gold Vitrified", dwg: "/downloads/carrara_gold.dwg", rfa: "/downloads/carrara_gold.rfa" },
  { code: "TMX-002", name: "Royal Oak Wood", dwg: "/downloads/royal_oak.dwg", rfa: "/downloads/royal_oak.rfa" },
  { code: "TMX-004", name: "Concrete Grigio Slab", dwg: "/downloads/concrete_grigio.dwg", rfa: "/downloads/concrete_grigio.rfa" },
];

export function ArchitectPortalClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [activeTab, setActiveTab] = useState<"projects" | "library" | "moodboards">("projects");
  const [projects, setProjects] = useState([
    { id: "proj-1", name: "Mehta Penthouse Living", client: "Sanjay Mehta", items: 4, date: "June 25, 2026" },
    { id: "proj-2", name: "Lalit Lobby Wall Slabs", client: "Lalit Hotels Group", items: 2, date: "May 10, 2026" },
  ]);

  // Moodboard builder basic state
  const [moodboardItems, setMoodboardItems] = useState<any[]>([
    { id: "item-1", color: "#101B38", name: "Midnight Navy" },
    { id: "item-2", color: "#C95745", name: "Timex Red Accent" },
    { id: "item-3", image: "/images/products/stone-1-front.svg", name: "Carrara Slabs" },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    const emailErr = getEmailError(email, true);
    if (emailErr) {
      setErrorMsg(emailErr);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const res = await createInquiry({
      type: "ARCHITECT_REGISTRATION",
      name: "Architect Partner",
      email: email.trim(),
      phone: "+91 98200 00000",
      message: "Architect Studio Access Request & CAD/BIM Specs Library Authorization.",
      pageSource: "Architect Studio Portal",
    });

    setLoading(false);
    if (res.success) {
      setIsLoggedIn(true);
    } else {
      setErrorMsg(res.error || "Failed to authorize architect session.");
    }
  };

  const addProject = () => {
    const name = prompt("Enter project name:");
    const client = prompt("Enter client name:");
    if (name && client) {
      setProjects([
        ...projects,
        {
          id: `proj-${Date.now()}`,
          name,
          client,
          items: 0,
          date: new Date().toLocaleDateString(),
        },
      ]);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-[#F7F5F0] min-h-screen py-16 md:py-24 flex items-center justify-center px-6">
        <div className="bg-[#FCFBF8] w-full max-w-md rounded-[2px] shadow-md p-8 border border-[#EDEAE4] space-y-6">
          <div className="text-center space-y-2">
            <UserCheck className="w-10 h-10 text-[#C95745] mx-auto" />
            <h2 className="font-serif text-3xl font-bold text-[#101B38]">Architect Studio</h2>
            <p className="text-xs text-[#333333]/70 font-light max-w-xs mx-auto">
              Specifying suite for interior designers and builders. Secure access to CAD and BIM libraries.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="flex flex-col space-y-1">
              <label className="text-[#101B38] font-medium">COA Registration / Email</label>
              <input
                type="email"
                required
                placeholder="e.g. priya.designs@coa.in"
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
            {errorMsg && (
              <p className="text-[#C95745] text-xs font-medium">{errorMsg}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#101B38] text-[#FCFBF8] py-3.5 rounded-[2px] text-xs font-medium uppercase tracking-wider hover:bg-[#C95745] transition-colors cursor-pointer"
            >
              Access Studio &rarr;
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5F0] min-h-screen py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Nav (lg:col-span-3) */}
        <aside className="lg:col-span-3 bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-6 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#EDEAE4]">
            <div className="w-10 h-10 rounded-[2px] bg-[#EDEAE4] text-[#101B38] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#101B38] text-base">Priya Sharma Studio</h4>
              <p className="text-[10px] text-[#333333]/60 font-light mt-0.5">COA Lic: CA/2024/98402</p>
            </div>
          </div>

          <nav className="flex flex-col space-y-1.5 text-xs">
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full text-left py-3 px-4 rounded-[2px] flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === "projects" ? "bg-[#101B38] text-[#FCFBF8] font-medium" : "text-[#333333] hover:bg-[#EDEAE4] hover:text-[#101B38]"
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>Client Projects</span>
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`w-full text-left py-3 px-4 rounded-[2px] flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === "library" ? "bg-[#101B38] text-[#FCFBF8] font-medium" : "text-[#333333] hover:bg-[#EDEAE4] hover:text-[#101B38]"
              }`}
            >
              <Box className="w-4 h-4" />
              <span>CAD & BIM Library</span>
            </button>
            <button
              onClick={() => setActiveTab("moodboards")}
              className={`w-full text-left py-3 px-4 rounded-[2px] flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === "moodboards" ? "bg-[#101B38] text-[#FCFBF8] font-medium" : "text-[#333333] hover:bg-[#EDEAE4] hover:text-[#101B38]"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Mood Board Studio</span>
            </button>
          </nav>
        </aside>

        {/* Right Dashboard (lg:col-span-9) */}
        <main className="lg:col-span-9 bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] p-8 shadow-xs min-h-[500px]">
          
          {/* TAB 1: Projects list */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#101B38]">Client Projects</h3>
                  <p className="text-xs text-[#333333]/70 font-light mt-1">Manage spec folders, visualizer links, and sample histories.</p>
                </div>
                <button
                  onClick={addProject}
                  className="bg-[#101B38] text-[#FCFBF8] text-xs font-medium uppercase tracking-wider px-5 py-3 rounded-[2px] hover:bg-[#C95745] transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-[#FCFBF8] p-6 rounded-[2px] border border-[#EDEAE4] shadow-xs space-y-4 flex flex-col justify-between group hover:border-[#101B38]/30 transition-all">
                    <div className="space-y-2">
                      <Folder className="w-8 h-8 text-[#C95745]" />
                      <h4 className="font-serif text-xl font-bold text-[#101B38]">{proj.name}</h4>
                      <p className="text-xs text-[#333333]/70 font-light">Client: <span className="font-medium text-[#101B38]">{proj.client}</span></p>
                    </div>

                    <div className="border-t border-[#EDEAE4] pt-4 flex justify-between items-center text-[10px] text-[#333333]/60">
                      <span>Curated: {proj.items} Tiles &bull; {proj.date}</span>
                      <Link
                        href="/visualiser"
                        className="text-xs font-medium text-[#101B38] hover:text-[#C95745] uppercase tracking-wider transition-colors flex items-center space-x-1"
                      >
                        <span>Open Canvas</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CAD/BIM downloads */}
          {activeTab === "library" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#101B38]">CAD & BIM Library</h3>
                <p className="text-xs text-[#333333]/70 font-light mt-1">Acquire AutoCAD vector blocks and Revit families for direct project layouts.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {BIM_LIBRARY.map((item) => (
                  <div key={item.code} className="border border-[#EDEAE4] rounded-[2px] p-5 flex flex-col justify-between gap-4 group hover:border-[#101B38]/30 transition-all">
                    <div className="space-y-1">
                      <span className="text-[10px] font-medium text-[#C95745] tracking-widest uppercase">{item.code}</span>
                      <h4 className="font-serif text-lg font-bold text-[#101B38]">{item.name}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <a
                        href={item.dwg}
                        download
                        className="py-2.5 bg-[#EDEAE4] hover:bg-[#101B38] hover:text-[#FCFBF8] text-[#101B38] rounded-[2px] font-medium uppercase tracking-wider text-center transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>AutoCAD (.dwg)</span>
                      </a>
                      <a
                        href={item.rfa}
                        download
                        className="py-2.5 bg-[#EDEAE4] hover:bg-[#101B38] hover:text-[#FCFBF8] text-[#101B38] rounded-[2px] font-medium uppercase tracking-wider text-center transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Revit (.rfa)</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Moodboard Creative Studio */}
          {activeTab === "moodboards" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#101B38]">Mood Board Creative Studio</h3>
                  <p className="text-xs text-[#333333]/70 font-light mt-1">Assemble visual material swatches and primary color palettes.</p>
                </div>
                <button
                  onClick={() => {
                    const name = prompt("Enter swatch name:");
                    const color = prompt("Enter HEX color (or skip for mock image):");
                    if (name) {
                      setMoodboardItems([
                        ...moodboardItems,
                        color
                          ? { id: `mb-${Date.now()}`, color, name }
                          : { id: `mb-${Date.now()}`, image: "/images/products/stone-2-front.svg", name },
                      ]);
                    }
                  }}
                  className="bg-[#101B38] text-[#FCFBF8] text-xs font-medium uppercase tracking-wider px-5 py-3 rounded-[2px] hover:bg-[#C95745] transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Swatch</span>
                </button>
              </div>

              {/* Moodboard Swatches Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
                {moodboardItems.map((item) => (
                  <div key={item.id} className="bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] overflow-hidden p-3 flex flex-col justify-between aspect-[3/4] relative group">
                    <div className="w-full aspect-square rounded-[2px] overflow-hidden bg-white shadow-2xs flex items-center justify-center relative">
                      {item.color ? (
                        <div className="w-full h-full" style={{ backgroundColor: item.color }} />
                      ) : (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    
                    <div className="pt-3 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-[#101B38] truncate w-32">{item.name}</span>
                      <button
                        onClick={() => setMoodboardItems(moodboardItems.filter((i) => i.id !== item.id))}
                        className="text-[#333333]/40 hover:text-[#C95745] transition-colors cursor-pointer"
                        title="Remove swatch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

