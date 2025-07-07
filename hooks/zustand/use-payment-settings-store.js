// Zustand store for payment settings state management
// State at top, actions grouped, SSR-safe persist, named export

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistConfig } from "@/lib/zustand-storage";

const usePaymentSettingsStore = create(
  persist(
    (set, get) => ({
      // State
      defaultPaymentMethod: "cash",
      defaultCustomerName: "",
      autoFillCustomerName: true,
      downloadReceipt: true,
      preferredPaymentMethods: ["cash", "card", "wallet"],

      // Actions
      setDefaultPaymentMethod: (method) =>
        set({ defaultPaymentMethod: method }),
      setAutoFillCustomerName: (enabled) =>
        set({ autoFillCustomerName: enabled }),
      setDownloadReceipt: (enabled) => set({ downloadReceipt: enabled }),
      setPreferredPaymentMethods: (methods) =>
        set({ preferredPaymentMethods: methods }),

      // Helper functions
      getDefaultCustomerName: () => {
        const state = get();
        if (!state.autoFillCustomerName) return "";
        return state.defaultCustomerName;
      },

      resetPaymentSettings: () =>
        set({
          defaultPaymentMethod: "cash",
          defaultCustomerName: "",
          autoFillCustomerName: true,
          downloadReceipt: true,
          preferredPaymentMethods: ["cash", "card", "wallet"],
        }),
    }),
    createPersistConfig("payment-settings-store")
  )
);

export { usePaymentSettingsStore };
