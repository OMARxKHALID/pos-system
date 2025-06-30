"use client";

import { menuItems } from "@/data/menu-data";
import { MenuItemCard } from "./menu-item-card";

export const MenuGrid = ({
  selectedCategory = "all",
  searchQuery = "",
  cartOpen = false,
  setSelectedItem = () => {},
}) => {
  let items =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter(
          (item) =>
            item.category &&
            item.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  if (searchQuery.trim()) {
    items = items.filter(
      (item) =>
        (item.name &&
          item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category &&
          item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const filteredItems = items;

  return (
    <div className="flex-1 px-4 py-3 overflow-y-auto">
      <div
        className={`grid gap-3 transition-all duration-300 ${
          cartOpen
            ? "grid-cols-4 xl:grid-cols-5"
            : "grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8"
        } transition-all duration-300`}
      >
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            setSelectedItem={setSelectedItem}
          />
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
