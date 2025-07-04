"use client";

import { useHydrateOrders } from "@/hooks/hydration/use-hydrate-orders";

export default function HydrateOrders() {
  // Always call the hook to maintain hook order consistency
  // The hook internally handles whether to hydrate based on the current path
  useHydrateOrders();

  return null;
}
