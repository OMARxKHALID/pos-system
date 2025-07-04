"use client";

import { useMenu } from "@/hooks/use-menu";
import { useCartStore } from "@/hooks/zustand/use-cart-store";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useHydrateMenu() {
  const pathname = usePathname();
  const { data, isSuccess } = useMenu();
  const setMenu = useCartStore((s) => s.setMenu);

  // Check if we should hydrate on this page
  const shouldHydrate =
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/pos");

  useEffect(() => {
    if (shouldHydrate && isSuccess && data) {
      setMenu(data);
    }
  }, [isSuccess, data, setMenu, shouldHydrate]);

  return {
    isHydrated: shouldHydrate ? isSuccess && !!data : true,
  };
}
