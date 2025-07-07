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
      rememberLastCustomer: false,
      lastCustomerName: "",
      downloadReceipt: true,
      preferredPaymentMethods: ["cash", "card", "wallet"],

      // Actions
      setDefaultPaymentMethod: (method) =>
        set({ defaultPaymentMethod: method }),

      setDefaultCustomerName: (name) => set({ defaultCustomerName: name }),

      setAutoFillCustomerName: (enabled) =>
        set({ autoFillCustomerName: enabled }),

      setRememberLastCustomer: (enabled) =>
        set({ rememberLastCustomer: enabled }),

      setLastCustomerName: (name) => set({ lastCustomerName: name }),

      setDownloadReceipt: (enabled) => set({ downloadReceipt: enabled }),

      setPreferredPaymentMethods: (methods) =>
        set({ preferredPaymentMethods: methods }),

      // Helper functions
      getDefaultCustomerName: () => {
        const state = get();
        if (state.autoFillCustomerName) {
          return state.rememberLastCustomer && state.lastCustomerName
            ? state.lastCustomerName
            : state.defaultCustomerName;
        }
        return "";
      },

      updateLastCustomer: (name) => {
        const state = get();
        if (state.rememberLastCustomer && name.trim()) {
          set({ lastCustomerName: name.trim() });
        }
      },

      resetPaymentSettings: () =>
        set({
          defaultPaymentMethod: "cash",
          defaultCustomerName: "",
          autoFillCustomerName: true,
          rememberLastCustomer: false,
          lastCustomerName: "",
          downloadReceipt: true,
          preferredPaymentMethods: ["cash", "card", "wallet"],
        }),
    }),
    createPersistConfig("payment-settings-store")
  )
);

export { usePaymentSettingsStore };
