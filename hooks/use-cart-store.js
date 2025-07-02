"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { clampDiscount } from "@/utils/pos-utils";

const useCartStore = create(
  persist(
    (set, get) => ({
      menu: [],
      cart: [],
      orderItems: [],
      cartDiscount: 0,

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
              ? { ...item, discount: clampDiscount(discount) }
              : item
          ),
        })),

      applyCartDiscount: (discount) =>
        set({
          cartDiscount: clampDiscount(discount),
        }),

      removeItemDiscount: (_id) =>
        set(({ orderItems }) => ({
          orderItems: orderItems.map((item) =>
            item._id === _id ? { ...item, discount: 0 } : item
          ),
        })),

      removeCartDiscount: () => set({ cartDiscount: 0 }),

      getTotalItems: () => get().orderItems.length,

      getTotalQuantity: () =>
        get().orderItems.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => {
        // Check if we're in a browser environment before accessing localStorage
        if (typeof window !== "undefined") {
          return localStorage;
        }
        // Return a mock storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export { useCartStore };
