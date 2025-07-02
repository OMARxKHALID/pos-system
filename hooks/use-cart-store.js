"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { clampDiscount } from "@/utils/pos-utils";

export const useCartStore = create(
  persist(
    (set, get) => ({
      orderItems: [],
      cartDiscount: 0,

      addToCart: (item, quantity) =>
        set(({ orderItems }) => {
          const existingIndex = orderItems.findIndex((i) => i.id === item.id);

          if (existingIndex >= 0) {
            const updatedItems = [...orderItems];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            };
            return { orderItems: updatedItems };
          }

          return {
            orderItems: [
              ...orderItems,
              {
                ...item,
                quantity,
                discount: 0,
              },
            ],
          };
        }),

      updateQuantity: (id, quantity) =>
        set(({ orderItems }) => ({
          orderItems:
            quantity <= 0
              ? orderItems.filter((item) => item.id !== id)
              : orderItems.map((item) =>
                  item.id === id ? { ...item, quantity } : item
                ),
        })),

      removeFromCart: (id) =>
        set(({ orderItems }) => ({
          orderItems: orderItems.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ orderItems: [], cartDiscount: 0 }),

      applyItemDiscount: (id, discount) =>
        set(({ orderItems }) => ({
          orderItems: orderItems.map((item) =>
            item.id === id
              ? { ...item, discount: clampDiscount(discount) }
              : item
          ),
        })),

      applyCartDiscount: (discount) =>
        set({
          cartDiscount: clampDiscount(discount),
        }),

      removeItemDiscount: (id) =>
        set(({ orderItems }) => ({
          orderItems: orderItems.map((item) =>
            item.id === id ? { ...item, discount: 0 } : item
          ),
        })),

      removeCartDiscount: () => set({ cartDiscount: 0 }),

      getTotalItems: () => get().orderItems.length,

      getTotalQuantity: () =>
        get().orderItems.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-storage",
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
