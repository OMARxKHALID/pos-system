// Zustand store for user management
// State at top, actions grouped, SSR-safe persist, named export

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistConfig } from "@/lib/zustand-storage";

const useUserStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      // Actions
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    createPersistConfig("user-store")
  )
);

export { useUserStore };
