"use client";

import { useMenu } from "@/hooks/use-menu";
import { useCartStore } from "@/hooks/zustand/use-cart-store";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useHydrateMenu() {
  const pathname = usePathname();
  const { menuItems, isLoading, isError } = useMenu();
  const setMenu = useCartStore((s) => s.setMenu);

  // Check if we should hydrate on this page
  const shouldHydrate =
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/pos");

  useEffect(() => {
    if (shouldHydrate && menuItems && !isLoading && !isError) {
      setMenu(menuItems);
    }
  }, [menuItems, isLoading, isError, setMenu, shouldHydrate]);

  return {
    isHydrated: shouldHydrate ? !isLoading && !isError && !!menuItems : true,
    isLoading: shouldHydrate ? isLoading : false,
    isError: shouldHydrate ? isError : false,
  };
}
