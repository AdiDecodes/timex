"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVisualiser, LayingPattern } from "@/store/useVisualiser";
import { Upload, Eye, Columns, RefreshCw, Sun, Moon, Save, Download, Share2, Sparkles, Check, ChevronRight, Calculator, ZoomIn } from "lucide-react";

// Dynamically import 3D R3F Canvas with SSR disabled
const ThreeDViewer = dynamic(() => import("./ThreeDViewer"), { ssr: false });

// Coordinate mappings for 2D presets (based on a 1200x800 aspect ratio)
const PRESSETS = {
  bathroom: {
    image: "/images/spaces/bathroom.svg",
    wallPoly: [{ x: 100, y: 30 }, { x: 1100, y: 30 }, { x: 1100, y: 550 }, { x: 100, y: 550 }],
    floorPoly: [{ x: 100, y: 550 }, { x: 1100, y: 550 }, { x: 1200, y: 800 }, { x: 0, y: 800 }],
  },
  kitchen: {
    image: "/images/spaces/kitchen.svg",
    wallPoly: [{ x: 300, y: 220 }, { x: 900, y: 220 }, { x: 900, y: 540 }, { x: 300, y: 540 }],
    floorPoly: [{ x: 0, y: 540 }, { x: 1200, y: 540 }, { x: 1200, y: 800 }, { x: 0, y: 800 }],
  },
  "living-room": {
    image: "/images/spaces/living-room.svg",
    wallPoly: [{ x: 380, y: 80 }, { x: 820, y: 80 }, { x: 820, y: 580 }, { x: 380, y: 580 }],
    floorPoly: [{ x: 0, y: 580 }, { x: 1200, y: 580 }, { x: 1200, y: 800 }, { x: 0, y: 800 }],
  },
};

export function VisualiserCanvas() {
  const searchParams = useSearchParams();
  const v = useVisualiser();

  const [tiles, setTiles] = useState<any[]>([]);
  const [activeSurface, setActiveSurface] = useState<"wall" | "floor">("floor");
  const [aiScanning, setAiScanning] = useState(false);
  const [aiDetected, setAiDetected] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load product catalog for textures
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((res) => {
        setTiles(res);
        // Pre-select defaults
        if (!v.selectedFloorTile) v.setSelectedFloorTile(res[0]);
        if (!v.selectedWallTile) v.setSelectedWallTile(res[1] || res[0]);

        // Read quick applies from parameters
        const applyCode = searchParams.get("applyTile");
        if (applyCode) {
          const found = res.find((t: any) => t.code.toLowerCase() === applyCode.toLowerCase());
          if (found) {
            v.setSelectedFloorTile(found);
            v.setSelectedWallTile(found);
          }
        }
      });
  }, [searchParams]);

  // Drawing the 2D canvas textures
  useEffect(() => {
    if (v.mode !== "2d" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load background image
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = v.activeRoom === "custom" && v.customImage ? v.customImage : (PRESSETS[v.activeRoom as keyof typeof PRESSETS]?.image || PRESSETS.bathroom.image);

    bgImg.onload = () => {
      // Fit canvas size
      canvas.width = 1200;
      canvas.height = 800;
      ctx.drawImage(bgImg, 0, 0, 1200, 800);

      // Render Wall Tile clipping
      if (v.selectedWallTile) {
        const poly = v.activeRoom === "custom"
          ? [{ x: 200, y: 100 }, { x: 1000, y: 100 }, { x: 1000, y: 500 }, { x: 200, y: 500 }]
          : (PRESSETS[v.activeRoom as keyof typeof PRESSETS]?.wallPoly || PRESSETS.bathroom.wallPoly);
        
        drawTiledPolygon(ctx, poly, v.selectedWallTile.images[0]);
      }

      // Render Floor Tile clipping
      if (v.selectedFloorTile) {
        const poly = v.activeRoom === "custom"
          ? [{ x: 0, y: 500 }, { x: 1200, y: 500 }, { x: 1200, y: 800 }, { x: 0, y: 800 }]
          : (PRESSETS[v.activeRoom as keyof typeof PRESSETS]?.floorPoly || PRESSETS.bathroom.floorPoly);

        drawTiledPolygon(ctx, poly, v.selectedFloorTile.images[0]);
      }
    };
  }, [v.activeRoom, v.customImage, v.selectedWallTile, v.selectedFloorTile, v.tilePattern, v.tileScale, v.groutColor, v.groutThickness, v.mode]);

  // Canvas tiling patterns drawing helper
  const drawTiledPolygon = (ctx: CanvasRenderingContext2D, poly: { x: number; y: number }[], textureUrl: string) => {
    ctx.save();
    
    // Begin clipping path
    ctx.beginPath();
    ctx.moveTo(poly[0].x, poly[0].y);
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i].x, poly[i].y);
    }
    ctx.closePath();
    ctx.clip();

    // Create patterns
    const patternImg = new Image();
    patternImg.crossOrigin = "anonymous";
    patternImg.src = textureUrl;

    // Pattern image must be loaded synchronous/cached
    if (patternImg.complete) {
      drawTexturePatterns(ctx, patternImg);
    } else {
      patternImg.onload = () => {
        drawTexturePatterns(ctx, patternImg);
      };
    }

    ctx.restore();
  };

  const drawTexturePatterns = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const size = 150 * v.tileScale; // base scaling
    
    // Draw pattern tiling grid
    for (let x = -200; x < 1400; x += size) {
      for (let y = -200; y < 1000; y += size) {
        ctx.save();
        ctx.translate(x, y);

        // Handle laying rotations patterns
        if (v.tilePattern === "Diagonal") {
          ctx.rotate(Math.PI / 4);
        } else if (v.tilePattern === "Herringbone") {
          // simple herringbone alternate columns
          const colIndex = Math.floor(x / size);
          if (colIndex % 2 === 0) {
            ctx.rotate(Math.PI / 2);
          }
        } else if (v.tilePattern === "Brick") {
          const rowIndex = Math.floor(y / size);
          if (rowIndex % 2 === 0) {
            ctx.translate(size / 2, 0);
          }
        }

        // Draw tile
        ctx.drawImage(img, 0, 0, size, size);

        // Draw Grout lines
        ctx.strokeStyle = v.groutColor;
        ctx.lineWidth = v.groutThickness;
        ctx.strokeRect(0, 0, size, size);

        ctx.restore();
      }
    }
  };

  // Custom User Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        v.setCustomImage(event.target?.result as string);
        setAiDetected(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate AI Surface Detection scanner
  const runAiDetection = () => {
    setAiScanning(true);
    setTimeout(() => {
      setAiScanning(false);
      setAiDetected(true);
    }, 2500);
  };

  // Download JPG representation of the canvas
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `timex-visualiser-${v.activeRoom}.jpg`;
    link.href = canvasRef.current.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  // Copy share URL state
  const handleShare = () => {
    const url = `${window.location.origin}/visualiser?room=${v.activeRoom}&floor=${v.selectedFloorTile?.code || ""}&wall=${v.selectedWallTile?.code || ""}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const patternsList: LayingPattern[] = ["Straight", "Brick", "Herringbone", "Diagonal", "Basket Weave"];

  return (
    <div className="min-h-screen bg-[#101B38] text-[#FCFBF8] flex flex-col lg:flex-row overflow-hidden">
      {/* Left Workspace Panel: Interactive Canvas */}
      <div className="flex-grow flex items-center justify-center p-6 relative" ref={containerRef}>
        <div className="relative w-full max-w-4xl aspect-[4/3] rounded-[2px] overflow-hidden shadow-2xl border border-white/10 bg-black/30">
          {v.mode === "2d" ? (
            /* 2D Canvas workspace */
            <div className="w-full h-full relative">
              {/* Bottom Base Image (original) */}
              <img
                src={v.activeRoom === "custom" && v.customImage ? v.customImage : (PRESSETS[v.activeRoom as keyof typeof PRESSETS]?.image || PRESSETS.bathroom.image)}
                alt="Original Room"
                className="w-full h-full object-cover absolute inset-0"
              />

              {/* Top Canvas (Tiled layout) with dynamic clip path split screen */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover absolute inset-0"
                style={{
                  clipPath: v.isSplit ? `inset(0px 0px 0px ${v.splitPosition}%)` : "none",
                }}
              />

              {/* Split screen dragging control */}
              {v.isSplit && (
                <>
                  <div
                    className="absolute inset-y-0 w-1 bg-[#C95745] cursor-ew-resize z-20 flex items-center justify-center"
                    style={{ left: `${v.splitPosition}%` }}
                  >
                    <div className="w-8 h-8 rounded-[2px] bg-[#C95745] text-[#FCFBF8] flex items-center justify-center shadow-lg border border-white/20 select-none">
                      <Columns className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                  {/* Slider invisible drag overlay */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={v.splitPosition}
                    onChange={(e) => v.setSplitPosition(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
                  />
                </>
              )}

              {/* AI scanning animation lines */}
              {aiScanning && (
                <div className="absolute inset-0 bg-[#C95745]/10 z-10 flex flex-col justify-between overflow-hidden">
                  <div className="w-full h-1 bg-[#C95745] shadow-[0_0_15px_#C95745] animate-bounce mt-auto mb-auto" />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-[10px] tracking-widest uppercase font-bold px-4 py-2 rounded-[2px] backdrop-blur-md">
                    AI Room Detection in Progress...
                  </div>
                </div>
              )}

              {/* AI Polygon coordinates overlay indicator */}
              {aiDetected && !aiScanning && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  <svg className="w-full h-full opacity-35" viewBox="0 0 1200 800">
                    <polygon points="200,100 1000,100 1000,500 200,500" fill="none" stroke="#C95745" strokeWidth="4" />
                    <polygon points="0,500 1200,500 1200,800 0,800" fill="none" stroke="#C95745" strokeWidth="4" />
                  </svg>
                  <div className="absolute bottom-16 left-4 bg-black/60 text-white text-[9px] font-bold px-3 py-1 rounded-[2px] tracking-wider uppercase">
                    AI Surface Detections Complete
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 3D WebGL workspace */
            <ThreeDViewer
              wallTile={v.selectedWallTile}
              floorTile={v.selectedFloorTile}
              groutColor={v.groutColor}
              groutThickness={v.groutThickness}
              tileScale={v.tileScale}
              dayNight={v.dayNight}
              tilePattern={v.tilePattern}
            />
          )}

          {/* Quick Toggle Controls */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-[2px] p-1.5 flex items-center space-x-1 border border-white/10 z-20">
            <button
              onClick={() => v.setMode("2d")}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                v.mode === "2d" ? "bg-[#C95745] text-[#FCFBF8] font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              2D
            </button>
            <button
              onClick={() => v.setMode("3d")}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                v.mode === "3d" ? "bg-[#C95745] text-[#FCFBF8] font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              3D
            </button>
          </div>
        </div>
      </div>

      {/* Right Control Sheet Panel */}
      <div className="w-full lg:w-96 bg-[#101B38] border-l border-white/10 flex flex-col justify-between flex-shrink-0 z-10 max-h-[85vh] lg:max-h-screen overflow-y-auto">
        {/* Workspace Configurations */}
        <div className="p-6 space-y-6">
          {/* Preset Room Selector */}
          <div className="space-y-3">
            <span className="text-[10px] tracking-widest text-[#C95745] font-semibold uppercase block">
              1. Choose Environment
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => v.setActiveRoom("bathroom")}
                className={`py-2 px-3 rounded-[2px] border text-left transition-colors cursor-pointer ${
                  v.activeRoom === "bathroom" ? "border-[#C95745] bg-[#C95745]/15 text-[#FCFBF8]" : "border-white/10 hover:border-white/30 text-gray-300"
                }`}
              >
                Bathroom
              </button>
              <button
                onClick={() => v.setActiveRoom("kitchen")}
                className={`py-2 px-3 rounded-[2px] border text-left transition-colors cursor-pointer ${
                  v.activeRoom === "kitchen" ? "border-[#C95745] bg-[#C95745]/15 text-[#FCFBF8]" : "border-white/10 hover:border-white/30 text-gray-300"
                }`}
              >
                Kitchen
              </button>
              <button
                onClick={() => v.setActiveRoom("living-room")}
                className={`py-2 px-3 rounded-[2px] border text-left transition-colors cursor-pointer ${
                  v.activeRoom === "living-room" ? "border-[#C95745] bg-[#C95745]/15 text-[#FCFBF8]" : "border-white/10 hover:border-white/30 text-gray-300"
                }`}
              >
                Living Room
              </button>
              <label
                className={`py-2 px-3 rounded-[2px] border text-left transition-colors cursor-pointer flex items-center justify-between ${
                  v.activeRoom === "custom" ? "border-[#C95745] bg-[#C95745]/15 text-[#FCFBF8]" : "border-white/10 hover:border-white/30 text-gray-300"
                }`}
              >
                <span>Upload Room</span>
                <Upload className="w-3.5 h-3.5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {v.activeRoom === "custom" && v.customImage && !aiDetected && (
              <button
                onClick={runAiDetection}
                disabled={aiScanning}
                className="w-full bg-[#C95745] text-[#FCFBF8] py-2.5 rounded-[2px] text-xs font-semibold uppercase tracking-wider hover:bg-[#C95745]/90 transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Detect Wall & Floor</span>
              </button>
            )}
          </div>

          <hr className="border-white/10" />

          {/* Surface texture applicator selector */}
          <div className="space-y-3">
            <span className="text-[10px] tracking-widest text-[#C95745] font-semibold uppercase block">
              2. Applied Surface
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setActiveSurface("floor")}
                className={`py-2.5 rounded-[2px] border transition-colors cursor-pointer flex items-center justify-center space-x-2 ${
                  activeSurface === "floor" ? "border-[#C95745] bg-[#C95745]/15 text-[#FCFBF8] font-bold" : "border-white/10 text-gray-300"
                }`}
              >
                <span>Floor Tile</span>
              </button>
              <button
                onClick={() => setActiveSurface("wall")}
                className={`py-2.5 rounded-[2px] border transition-colors cursor-pointer flex items-center justify-center space-x-2 ${
                  activeSurface === "wall" ? "border-[#C95745] bg-[#C95745]/15 text-[#FCFBF8] font-bold" : "border-white/10 text-gray-300"
                }`}
              >
                <span>Wall Tile</span>
              </button>
            </div>

            {/* Tiles Grid Scroll Selector */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Select Design:</span>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                {tiles.map((tile) => {
                  const isSelected = activeSurface === "floor" ? v.selectedFloorTile?.id === tile.id : v.selectedWallTile?.id === tile.id;
                  return (
                    <button
                      key={tile.id}
                      onClick={() => activeSurface === "floor" ? v.setSelectedFloorTile(tile) : v.setSelectedWallTile(tile)}
                      className={`aspect-square rounded-[2px] overflow-hidden border-2 transition-colors cursor-pointer ${
                        isSelected ? "border-[#C95745]" : "border-transparent"
                      }`}
                      title={tile.name}
                    >
                      <img src={tile.images?.[0]} alt={tile.name} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Laying Pattern & Grout details settings */}
          <div className="space-y-4">
            <span className="text-[10px] tracking-widest text-[#C95745] font-semibold uppercase block">
              3. Pattern & Customizations
            </span>

            {/* Laying selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-light block">Laying Pattern:</label>
              <select
                value={v.tilePattern}
                onChange={(e) => v.setTilePattern(e.target.value as LayingPattern)}
                className="w-full bg-white/5 border border-white/10 rounded-[2px] p-2.5 text-xs outline-none text-white focus:border-[#C95745]"
              >
                {patternsList.map((pat) => (
                  <option key={pat} value={pat} className="bg-[#101B38] text-white">
                    {pat} Pattern
                  </option>
                ))}
              </select>
            </div>

            {/* Grout settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-light block">Grout Color:</label>
                <input
                  type="color"
                  value={v.groutColor}
                  onChange={(e) => v.setGroutColor(e.target.value)}
                  className="w-full h-10 bg-transparent border border-white/10 rounded-[2px] cursor-pointer p-0.5"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-light block">Grout Line (mm):</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={v.groutThickness}
                  onChange={(e) => v.setGroutThickness(parseInt(e.target.value))}
                  className="w-full h-10 accent-[#C95745]"
                />
              </div>
            </div>

            {/* Tiling scale */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>Tile Repeat Scale:</span>
                <span>{v.tileScale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={v.tileScale}
                onChange={(e) => v.setTileScale(parseFloat(e.target.value))}
                className="w-full accent-[#C95745]"
              />
            </div>

            {/* Lighting Controls for 3D Mode */}
            {v.mode === "3d" && (
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-light">Scene Mood:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => v.setDayNight("day")}
                    className={`p-1.5 rounded-[2px] border cursor-pointer transition-colors ${
                      v.dayNight === "day" ? "border-[#C95745] text-[#C95745] bg-white/5" : "border-white/10 text-gray-400"
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => v.setDayNight("night")}
                    className={`p-1.5 rounded-[2px] border cursor-pointer transition-colors ${
                      v.dayNight === "night" ? "border-[#C95745] text-[#C95745] bg-white/5" : "border-white/10 text-gray-400"
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Split Screen before/after toggle */}
            {v.mode === "2d" && (
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-light">Before / After Split:</span>
                <button
                  onClick={() => v.setIsSplit(!v.isSplit)}
                  className={`px-3 py-1.5 rounded-[2px] border text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    v.isSplit ? "border-[#C95745] text-[#C95745] bg-white/5" : "border-white/10 text-gray-400"
                  }`}
                >
                  {v.isSplit ? "Split Enabled" : "Enable Split"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel Footer */}
        <div className="p-6 bg-black/30 border-t border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
            <button
              onClick={handleShare}
              className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-[2px] border border-white/10 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#C95745]" />
                  <span>Share Design</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-[2px] border border-white/10 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C95745]" />
              <span>Save Image</span>
            </button>
          </div>

          <Link
            href="/calculator"
            className="w-full bg-[#C95745] text-[#FCFBF8] py-3 rounded-[2px] text-xs font-semibold uppercase tracking-wider hover:bg-[#C95745]/90 transition-colors flex items-center justify-center space-x-1.5"
          >
            <Calculator className="w-4 h-4" />
            <span>Tile Calculator Pro</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default VisualiserCanvas;
