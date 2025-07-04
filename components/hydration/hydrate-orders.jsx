"use client";

import { useHydrateOrders } from "@/hooks/hydration/use-hydrate-orders";
import { usePathname } from "next/navigation";

export default function HydrateOrders() {
  const pathname = usePathname();

  // Only hydrate orders data on admin pages that need it
  const shouldHydrate =
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/orders") ||
    pathname.startsWith("/admin/reports");

  if (!shouldHydrate) return null;

  useHydrateOrders();
  return null;
}
