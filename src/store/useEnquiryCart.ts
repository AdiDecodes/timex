"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EnquiryItem {
  id: string; // Composite key: `${productId}-${size}`
  productId: string;
  name: string;
  code: string;
  slug: string;
  size: string;
  finish: string;
  image: string;
  quantity: number;
  category?: string;
  price?: number;
}

interface EnquiryCartState {
  items: EnquiryItem[];
  isDrawerOpen: boolean;
  addItem: (item: Omit<EnquiryItem, "quantity" | "id">, quantity?: number) => { wasDuplicate: boolean; totalQty: number };
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  getTotalItems: () => number;
}

export const useEnquiryCart = create<EnquiryCartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (item, quantity = 1) => {
        const id = `${item.productId}-${item.size || "default"}`;
        const existingIndex = get().items.findIndex((i) => i.id === id);

        if (existingIndex > -1) {
          // Increment quantity of existing item
          const updatedItems = [...get().items];
          const newQty = updatedItems[existingIndex].quantity + quantity;
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: newQty,
          };
          set({ items: updatedItems });
          return { wasDuplicate: true, totalQty: newQty };
        } else {
          // Add new item
          const newItem: EnquiryItem = {
            ...item,
            id,
            quantity: Math.max(1, quantity),
          };
          set({ items: [...get().items, newItem] });
          return { wasDuplicate: false, totalQty: newItem.quantity };
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + (item.quantity || 1), 0);
      },
    }),
    {
      name: "timex-enquiry-cart",
      // Only persist the items array, avoid persisting drawer open/closed state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
