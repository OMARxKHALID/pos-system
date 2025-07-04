// Zustand store for cart management
// State at top, actions grouped, SSR-safe persist, named export

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clampDiscountPercentage } from "@/utils/calculations";
import { createPersistConfig } from "@/lib/zustand-storage";

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      menu: [],
      cart: [],
      orderItems: [],
      cartDiscount: 0,

      // Actions
      setMenu: (menu) => set({ menu }),
      addToCart: (item, quantity = 1) =>
        set(({ orderItems }) => {
          const id = item._id;
          const existing = orderItems.find((i) => i._id === id);
          if (existing) {
            return {
              orderItems: orderItems.map((i) =>
                i._id === id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          } else {
            return {
              orderItems: [...orderItems, { ...item, _id: id, quantity }],
            };
          }
        }),
      updateQuantity: (_id, quantity) =>
        set(({ orderItems }) => ({
          orderItems:
            quantity <= 0
              ? orderItems.filter((item) => item._id !== _id)
              : orderItems.map((item) =>
                  item._id === _id ? { ...item, quantity } : item
                ),
        })),
      removeFromCart: (_id) =>
        set(({ orderItems }) => ({
          orderItems: orderItems.filter((item) => item._id !== _id),
        })),
      clearCart: () => set({ orderItems: [], cartDiscount: 0 }),
      applyItemDiscount: (_id, discount) =>
        set(({ orderItems }) => ({
          orderItems: orderItems.map((item) =>
            item._id === _id
              ? { ...item, discount: clampDiscountPercentage(discount) }
              : item
          ),
        })),
      applyCartDiscount: (discount) =>
        set({
          cartDiscount: clampDiscountPercentage(discount),
        }),
      removeItemDiscount: (_id) =>
        set(({ orderItems }) => ({
          orderItems: orderItems.map((item) =>
            item._id === _id ? { ...item, discount: 0 } : item
          ),
        })),
      removeCartDiscount: () => set({ cartDiscount: 0 }),
      // Selectors
      getTotalItems: () => get().orderItems.length,
      getTotalQuantity: () =>
        get().orderItems.reduce((sum, item) => sum + item.quantity, 0),
    }),
    createPersistConfig("cart-store")
  )
);

export { useCartStore };
