// Zustand store for download receipt modal open state
// State at top, actions grouped, named export

import { create } from "zustand";

const useDownloadReceiptStore = create((set) => ({
  // State
  open: true,
  // Actions
  switch: () => set((state) => ({ open: !state.open })),
}));

export { useDownloadReceiptStore };
