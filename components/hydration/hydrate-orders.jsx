"use client";

import { useHydrateOrders } from "@/hooks/hydration/use-hydrate-orders";

export default function HydrateOrders() {
  useHydrateOrders();
  return null;
}
