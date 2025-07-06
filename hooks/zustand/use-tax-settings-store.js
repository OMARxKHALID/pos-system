// Tax Settings Store
// Manages tax-related preferences and configurations

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistConfig } from "@/lib/zustand-storage";

const useTaxSettingsStore = create(
  persist(
    (set, get) => ({
      // Tax Settings
      enableTax: true,
      taxRate: 10, // Tax rate percentage (10% = 0.1)
      taxName: "Sales Tax", // Display name for tax

      // Actions
      setEnableTax: (enabled) => set({ enableTax: enabled }),

      setTaxRate: (rate) => set({ taxRate: Math.max(0, Math.min(100, rate)) }),

      setTaxName: (name) => set({ taxName: name }),

      // Helper functions
      getTaxRate: () => {
        const state = get();
        return state.enableTax ? state.taxRate / 100 : 0; // Convert percentage to decimal
      },

      resetTaxSettings: () =>
        set({
          enableTax: true,
          taxRate: 10,
          taxName: "Sales Tax",
        }),
    }),
    createPersistConfig("tax-settings-store")
  )
);

export { useTaxSettingsStore };
