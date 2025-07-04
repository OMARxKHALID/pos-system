"use client";

import { useHydrateMenu } from "@/hooks/hydration/use-hydrate-menu";
import { usePathname } from "next/navigation";

export default function HydrateMenu() {
  const pathname = usePathname();

  // Only hydrate menu data on pages that need it
  const shouldHydrate =
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/pos");

  if (!shouldHydrate) return null;

  useHydrateMenu();
  return null;
}
