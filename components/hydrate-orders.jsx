"use client";

import { useOrders } from "@/hooks/use-orders";
import { useSalesStore } from "@/hooks/use-sales-store";
import { useEffect } from "react";

export default function HydrateOrders() {
  const { data, isSuccess } = useOrders();
  const setOrders = useSalesStore((s) => s.setOrders);

  useEffect(() => {
    if (isSuccess && data) setOrders(data);
  }, [isSuccess, data, setOrders]);

  return null;
}
