"use client";

import { useLazyOrders } from "@/hooks/use-orders";
import { useSalesStore } from "@/hooks/zustand/use-sales-store";
import { useEffect } from "react";

export function useHydrateOrders() {
  const { orders, isLoading, isError, refetch } = useLazyOrders();
  const setOrders = useSalesStore((s) => s.setOrders);

  useEffect(() => {
    // Only fetch orders when this hook is used
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (orders && !isLoading && !isError) {
      setOrders(orders);
    }
  }, [orders, isLoading, isError, setOrders]);

  return {
    isHydrated: !isLoading && !isError && !!orders,
    isLoading,
    isError,
  };
}
