"use client";

import { useMenu } from "@/hooks/use-menu";
import { MenuItemCard } from "./menu-item-card";
import { normalizeString } from "@/utils/pos-utils";

export function MenuGrid({
  selectedCategory = "all",
  searchQuery = "",
  onItemSelect,
}) {
  const { data: menuItems, isLoading, isError } = useMenu();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <div className="text-6xl mb-4 opacity-40">🍔</div>
        <p className="text-sm font-medium mb-1">Loading menu...</p>
      </div>
    );
  }
  if (isError || !menuItems) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <div className="text-6xl mb-4 opacity-40">❌</div>
        <p className="text-sm font-medium mb-1">Failed to load menu.</p>
      </div>
    );
  }

  let items =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter(
          (item) =>
            normalizeString(item.category) === normalizeString(selectedCategory)
        );

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q)
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <div className="text-6xl mb-4 opacity-40">🔍</div>
        <p className="text-sm font-medium mb-1">No items found</p>
        <p className="text-xs">Try adjusting your search or category filter</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 pb-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9 gap-2 ">
        {items.map((item) => (
          <MenuItemCard key={item._id} item={item} onSelect={onItemSelect} />
        ))}
      </div>
    </div>
  );
}
