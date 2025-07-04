"use client";
import { useMenu } from "@/hooks/use-menu";
import { useCartStore } from "@/hooks/zustand/use-cart-store";
import { useEffect } from "react";

export default function HydrateMenu() {
  const { data, isSuccess } = useMenu();
  const setMenu = useCartStore((s) => s.setMenu);

  useEffect(() => {
    if (isSuccess && data) setMenu(data);
  }, [isSuccess, data, setMenu]);

  return null;
}
