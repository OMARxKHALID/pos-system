// Order Number Store
// Manages sequential order numbering with date-based reset

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistConfig } from "@/lib/zustand-storage";

const useOrderNumberStore = create(
  persist(
    (set, get) => ({
      // Order number state
      lastOrderNumber: "",
      lastOrderDate: "",
      orderCounter: 0,

      // Generate next order number
      generateNextOrderNumber: () => {
        const now = new Date();
        const date = now.getDate().toString().padStart(2, "0");
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const currentDateKey = `${date}-${month}`;

        const state = get();

        // Reset counter if it's a new date
        if (currentDateKey !== state.lastOrderDate) {
          set({
            orderCounter: 0,
            lastOrderDate: currentDateKey,
          });
        }

        // Increment counter
        const newCounter = state.orderCounter + 1;
        const sequentialNumber = newCounter.toString().padStart(3, "0");
        const newOrderNumber = `#ORD-${date}-${month}-${sequentialNumber}`;

        // Update state
        set({
          orderCounter: newCounter,
          lastOrderNumber: newOrderNumber,
        });

        return newOrderNumber;
      },

      // Get current order number without incrementing
      getCurrentOrderNumber: () => {
        const now = new Date();
        const date = now.getDate().toString().padStart(2, "0");
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const currentDateKey = `${date}-${month}`;

        const state = get();

        // If it's a new date, start from 001
        if (currentDateKey !== state.lastOrderDate) {
          return `#ORD-${date}-${month}-001`;
        }

        // Return the next number that would be generated
        const nextCounter = state.orderCounter + 1;
        const sequentialNumber = nextCounter.toString().padStart(3, "0");
        return `#ORD-${date}-${month}-${sequentialNumber}`;
      },

      // Reset order counter (for testing or manual reset)
      resetOrderCounter: () => {
        set({
          orderCounter: 0,
          lastOrderNumber: "",
          lastOrderDate: "",
        });
      },
    }),
    createPersistConfig("order-number-store")
  )
);

export { useOrderNumberStore };
