// Zustand store for admin sidebar state management
// State at top, actions grouped, named export

import { create } from "zustand";

const useAdminSidebarStore = create((set) => ({
  // State
  open: true,

  // Actions
  setOpen: (open) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open })),
}));

export { useAdminSidebarStore };
