"use client";

import { create } from "zustand";

export type LayingPattern = "Straight" | "Brick" | "Herringbone" | "Diagonal" | "Basket Weave";

interface VisualiserState {
  mode: "2d" | "3d";
  activeRoom: "bathroom" | "kitchen" | "living-room" | "custom";
  customImage: string | null; // Data URL for uploaded room
  selectedWallTile: any | null; // Product object
  selectedFloorTile: any | null; // Product object
  groutColor: string;
  groutThickness: number; // in mm (1-10)
  tilePattern: LayingPattern;
  tileScale: number; // 0.5 to 3
  tileRepeatX: number;
  tileRepeatY: number;
  tileOffsetX: number;
  tileOffsetY: number;
  dayNight: "day" | "night";
  lightingIntensity: number;
  isSplit: boolean;
  splitPosition: number; // 0-100 percentage
  
  // Actions
  setMode: (mode: "2d" | "3d") => void;
  setActiveRoom: (room: "bathroom" | "kitchen" | "living-room" | "custom") => void;
  setCustomImage: (img: string | null) => void;
  setSelectedWallTile: (tile: any | null) => void;
  setSelectedFloorTile: (tile: any | null) => void;
  setGroutColor: (color: string) => void;
  setGroutThickness: (thickness: number) => void;
  setTilePattern: (pattern: LayingPattern) => void;
  setTileScale: (scale: number) => void;
  setTileRepeat: (x: number, y: number) => void;
  setTileOffset: (x: number, y: number) => void;
  setDayNight: (val: "day" | "night") => void;
  setLightingIntensity: (val: number) => void;
  setIsSplit: (val: boolean) => void;
  setSplitPosition: (val: number) => void;
  resetVisualiser: () => void;
}

export const useVisualiser = create<VisualiserState>((set) => ({
  mode: "2d",
  activeRoom: "bathroom",
  customImage: null,
  selectedWallTile: null,
  selectedFloorTile: null,
  groutColor: "#E5E7EB",
  groutThickness: 3,
  tilePattern: "Straight",
  tileScale: 1.0,
  tileRepeatX: 6,
  tileRepeatY: 6,
  tileOffsetX: 0,
  tileOffsetY: 0,
  dayNight: "day",
  lightingIntensity: 1.0,
  isSplit: false,
  splitPosition: 50,

  setMode: (mode) => set({ mode }),
  setActiveRoom: (activeRoom) => set((state) => ({
    activeRoom,
    // Reset custom image if selecting presets
    customImage: activeRoom !== "custom" ? null : state.customImage
  })),
  setCustomImage: (customImage) => set({ customImage, activeRoom: "custom" }),
  setSelectedWallTile: (selectedWallTile) => set({ selectedWallTile }),
  setSelectedFloorTile: (selectedFloorTile) => set({ selectedFloorTile }),
  setGroutColor: (groutColor) => set({ groutColor }),
  setGroutThickness: (groutThickness) => set({ groutThickness }),
  setTilePattern: (tilePattern) => set({ tilePattern }),
  setTileScale: (tileScale) => set({ tileScale }),
  setTileRepeat: (tileRepeatX, tileRepeatY) => set({ tileRepeatX, tileRepeatY }),
  setTileOffset: (tileOffsetX, tileOffsetY) => set({ tileOffsetX, tileOffsetY }),
  setDayNight: (dayNight) => set({
    dayNight,
    lightingIntensity: dayNight === "day" ? 1.0 : 0.3
  }),
  setLightingIntensity: (lightingIntensity) => set({ lightingIntensity }),
  setIsSplit: (isSplit) => set({ isSplit }),
  setSplitPosition: (splitPosition) => set({ splitPosition }),
  resetVisualiser: () => set({
    mode: "2d",
    activeRoom: "bathroom",
    customImage: null,
    selectedWallTile: null,
    selectedFloorTile: null,
    groutColor: "#E5E7EB",
    groutThickness: 3,
    tilePattern: "Straight",
    tileScale: 1.0,
    tileRepeatX: 6,
    tileRepeatY: 6,
    tileOffsetX: 0,
    tileOffsetY: 0,
    dayNight: "day",
    lightingIntensity: 1.0,
    isSplit: false,
    splitPosition: 50,
  })
}));
