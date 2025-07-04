"use client";

import { useHydrateMenu } from "@/hooks/hydration/use-hydrate-menu";

export default function HydrateMenu() {
  // Always call the hook to maintain hook order consistency
  // The hook internally handles whether to hydrate based on the current path
  useHydrateMenu();

  return null;
}
