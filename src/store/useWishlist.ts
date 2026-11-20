"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[]; // Array of product IDs/SKUs
  addItem: (id: string) => void;
  removeItem: (id: string, slug?: string) => void;
  clearWishlist: () => void;
  hasItem: (id: string, slug?: string) => boolean;
  toggleItem?: (id: string, slug?: string) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => {
        if (!id) return;
        const current = get().items;
        if (!current.includes(id)) {
          set({ items: [...current, id] });
        }
      },
      removeItem: (id, slug) => {
        if (!id && !slug) return;
        set({
          items: get().items.filter(
            (item) => item !== id && (!slug || item !== slug)
          ),
        });
      },
      clearWishlist: () => set({ items: [] }),
      hasItem: (id, slug) => {
        if (!id && !slug) return false;
        const current = get().items;
        return (
          (id ? current.includes(id) : false) ||
          (slug ? current.includes(slug) : false)
        );
      },
      toggleItem: (id, slug) => {
        const has = get().hasItem(id, slug);
        if (has) {
          get().removeItem(id, slug);
        } else {
          get().addItem(id);
        }
      },
    }),
    {
      name: "timex-wishlist-store",
    }
  )
);
