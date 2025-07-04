"use client";

import { useLazyOrders } from "@/hooks/use-orders";
import { useSalesStore } from "@/hooks/zustand/use-sales-store";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useHydrateOrders() {
  const pathname = usePathname();
  const { orders, isLoading, isError, refetch } = useLazyOrders();
  const setOrders = useSalesStore((s) => s.setOrders);

  // Check if we should hydrate on this page
  const shouldHydrate =
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/orders") ||
    pathname.startsWith("/admin/reports");

  useEffect(() => {
    // Only fetch orders when this hook is used and we should hydrate
    if (shouldHydrate) {
      refetch();
    }
  }, [refetch, shouldHydrate]);

  useEffect(() => {
    if (shouldHydrate && orders && !isLoading && !isError) {
      setOrders(orders);
    }
  }, [orders, isLoading, isError, setOrders, shouldHydrate]);

  return {
    isHydrated: shouldHydrate ? !isLoading && !isError && !!orders : true,
    isLoading: shouldHydrate ? isLoading : false,
    isError: shouldHydrate ? isError : false,
  };
}
