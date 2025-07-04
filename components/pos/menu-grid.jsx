"use client";

import { useMenu } from "@/hooks/use-menu";
import { MenuItemCard } from "./menu-item-card";
import { MenuItemSkeleton } from "./menu-item-skeleton";
import { normalizeString } from "@/utils/string-utils";

export function MenuGrid({
  selectedCategory = "all",
  searchQuery = "",
  onItemSelect,
}) {
  const { menuItems, isLoading, isError } = useMenu();

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2">
          {Array.from({ length: 15 }).map((_, index) => (
            <MenuItemSkeleton key={index} />
          ))}
        </div>
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
      : menuItems.filter((item) => {
          // Handle both string and object category values
          const itemCategory =
            typeof item.category === "object" && item.category !== null
              ? item.category._id || item.category.name
              : item.category;

          return (
            normalizeString(itemCategory) === normalizeString(selectedCategory)
          );
        });

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    items = items.filter((item) => {
      // Handle both string and object category values for search
      const itemCategory =
        typeof item.category === "object" && item.category !== null
          ? item.category.name
          : item.category;

      return (
        item.name.toLowerCase().includes(q) ||
        (itemCategory || "").toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q)
      );
    });
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 ">
        {items.map((item) => (
          <MenuItemCard key={item._id} item={item} onSelect={onItemSelect} />
        ))}
      </div>
    </div>
  );
}
