"use client";

import { menuItems } from "@/data/menu-data";
import { MenuItemCard } from "./menu-item-card";

// Helper function to normalize strings (e.g., for case-insensitive comparison)
function normalize(str) {
  return (str || "").toLowerCase().trim();
}

// Removed gridColsClass variable, using inline Tailwind CSS instead

export const MenuGrid = ({
  selectedCategory = "all",
  searchQuery = "",
  setSelectedItem = () => {},
}) => {
  let items =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter(
          (item) => normalize(item.category) === normalize(selectedCategory)
        );

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    items = items.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
    );
  }

  return (
    <div className="flex-1 px-2 py-2 overflow-y-auto">
      <div className="grid grid-cols-2 gap-2 transition-all duration-300 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            setSelectedItem={setSelectedItem}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="mt-8 text-center text-slate-400">
          <p className="text-sm">No items found</p>
        </div>
      )}
    </div>
  );
};
