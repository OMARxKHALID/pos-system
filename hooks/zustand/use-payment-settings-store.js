// Payment Settings Store
// Manages payment-related preferences and defaults

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistConfig } from "@/lib/zustand-storage";

const usePaymentSettingsStore = create(
  persist(
    (set, get) => ({
      // Payment Settings
      defaultPaymentMethod: "cash",
      defaultCustomerName: "",
      autoFillCustomerName: true,
      rememberLastCustomer: false,
      lastCustomerName: "",

      // Receipt Settings
      downloadReceipt: true,
      autoPrintReceipt: false,
      receiptTemplate: "standard", // "standard", "compact", "detailed"

      // Payment Method Preferences
      preferredPaymentMethods: ["cash", "card", "wallet"],
      hideUnusedPaymentMethods: false,

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

      setAutoPrintReceipt: (enabled) => set({ autoPrintReceipt: enabled }),

      setReceiptTemplate: (template) => set({ receiptTemplate: template }),

      setPreferredPaymentMethods: (methods) =>
        set({ preferredPaymentMethods: methods }),

      setHideUnusedPaymentMethods: (hide) =>
        set({ hideUnusedPaymentMethods: hide }),

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
          autoPrintReceipt: false,
          receiptTemplate: "standard",
          preferredPaymentMethods: ["cash", "card", "wallet"],
          hideUnusedPaymentMethods: false,
        }),
    }),
    createPersistConfig("payment-settings-store")
  )
);

export { usePaymentSettingsStore };
