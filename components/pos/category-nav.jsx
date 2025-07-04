"use client";

import { useCategory } from "@/hooks/use-category";
import { useMenu } from "@/hooks/use-menu";
import { normalizeString } from "@/utils/string-utils";
import { getCategoryColor } from "@/utils/category-colors";
import { CategoryNavSkeleton } from "./category-nav-skeleton";

export function CategoryNav({ selectedCategory, onCategoryChange }) {
  const { categories, isLoading: categoriesLoading } = useCategory();
  const { menuItems, isLoading: menuLoading } = useMenu();

  // Calculate item counts for each category
  const getCategoryItemCount = (categoryId) => {
    if (!menuItems || categoryId === "all") {
      return menuItems ? menuItems.length : 0;
    }

    return menuItems.filter((item) => {
      // Handle both string and object category values
      const itemCategory =
        typeof item.category === "object" && item.category !== null
          ? item.category._id || item.category.name
          : item.category;

      return normalizeString(itemCategory) === normalizeString(categoryId);
    }).length;
  };

  const allCategories = categories
    ? [{ _id: "all", name: "All", icon: "🍽️" }, ...categories]
    : [];

  const isLoading = categoriesLoading || menuLoading;

  if (isLoading) {
    return <CategoryNavSkeleton />;
  }

  return (
    <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide">
      {allCategories.map((category) => (
        <button
          key={category._id}
          className={`flex flex-col items-start p-2 rounded-2xl transition-all duration-200 w-[90px] h-[90px] sm:w-[105px] sm:h-[105px] border-2 flex-shrink-0 ${
            selectedCategory === category._id
              ? "bg-blue-50 border-blue-400"
              : `bg-white ${getCategoryColor(category._id, "both")}`
          }`}
          onClick={() => onCategoryChange(category._id)}
        >
          <div className="mb-2 sm:mb-3">
            {selectedCategory === category._id ? (
              <div className="w-7 h-7 sm:w-9 sm:h-9 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm sm:text-lg">
                  {category.icon}
                </span>
              </div>
            ) : (
              <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-lg sm:text-xl">
                  {category.icon}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col text-left w-full">
            <h3 className="text-gray-900 font-medium text-xs sm:text-sm mb-0.5 sm:mb-1 leading-tight text-left">
              {category.name}
            </h3>
            <p className="text-gray-500 text-xs text-left">
              {getCategoryItemCount(category._id)} Items
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
