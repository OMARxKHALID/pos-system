import { createJSONStorage } from "zustand/middleware";

// SSR-safe storage configuration for Zustand stores
export const createSSRSafeStorage = (storageName) => {
  return createJSONStorage(() => {
    if (typeof window !== "undefined") {
      return localStorage;
    }
    // SSR-safe fallback
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  });
};

// Standard persist configuration
export const createPersistConfig = (storageName) => ({
  name: storageName,
  storage: createSSRSafeStorage(storageName),
});
