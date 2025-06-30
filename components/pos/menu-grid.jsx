"use client";

import { useMemo } from "react";
import { menuItems } from "@/data/menu-data";
import { usePOSStore } from "@/hooks/use-pos-store";
import { MenuItemCard } from "./menu-item-card";

export const MenuGrid = () => {
  const { selectedCategory, searchQuery, cartOpen } = usePOSStore();

  const filteredItems = useMemo(() => {
    let items =
      selectedCategory === "all"
        ? menuItems
        : menuItems.filter(
            (item) =>
              item.category.toLowerCase() === selectedCategory.toLowerCase()
          );

    if (searchQuery.trim()) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex-1 px-4 py-3 overflow-y-auto">
      <div
        className={`grid gap-3 transition-all duration-300 ${
          cartOpen
            ? "grid-cols-4 xl:grid-cols-6"
            : "grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8"
        } transition-all duration-300`}
      >
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
      {filteredItems.length === 0 && (
        <div className="mt-8 text-center text-slate-400">
          <p className="text-sm">No items found</p>
        </div>
      )}
    </div>
  );
};
