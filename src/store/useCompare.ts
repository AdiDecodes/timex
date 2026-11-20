"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareState {
  items: string[]; // Array of product IDs/SKUs
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCompare: () => void;
  hasItem: (id: string) => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => {
        if (get().items.length >= 4) {
          return;
        }
        if (!get().items.includes(id)) {
          set({ items: [...get().items, id] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item !== id) });
      },
      clearCompare: () => set({ items: [] }),
      hasItem: (id) => get().items.includes(id),
    }),
    {
      name: "timex-compare-store",
    }
  )
);
