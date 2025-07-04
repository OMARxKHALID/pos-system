"use client";

import { useOrders } from "@/hooks/use-orders";
import { useSalesStore } from "@/hooks/zustand/use-sales-store";
import { useEffect } from "react";

export function useHydrateOrders() {
  const { data, isSuccess } = useOrders();
  const setOrders = useSalesStore((s) => s.setOrders);

  useEffect(() => {
    if (isSuccess && data) {
      setOrders(data);
    }
  }, [isSuccess, data, setOrders]);

  return { isHydrated: isSuccess && !!data };
}
