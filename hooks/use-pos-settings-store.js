import { create } from "zustand";

const useAdminSidebarStore = create((set) => ({
  open: true,
  setOpen: (open) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open })),
}));

export { useAdminSidebarStore };

const useDownloadReceiptStore = create((set) => ({
  open: true,
  switch: () => set((state) => ({ open: !state.open })),
}));
export { useDownloadReceiptStore };
