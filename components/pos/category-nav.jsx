"use client";

import { Button } from "@/components/ui/button";
import { categories } from "@/data/menu-data";
import { usePOSStore } from "@/hooks/use-pos-store";

export const CategoryNav = () => {
  const { selectedCategory, setSelectedCategory } = usePOSStore();

  return (
    <nav className="flex gap-2 pb-1 mb-6 overflow-x-auto">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="ghost"
          className={`flex flex-col items-center px-4 h-auto min-w-[90px] rounded-lg text-xs font-medium transition-all duration-200
            ${
              selectedCategory === category.id
                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-sm hover:bg-blue-500/20"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-blue-500 hover:border-gray-300"
            }
          `}
          onClick={() => setSelectedCategory(category.id)}
        >
          <div className="mb-1 text-3xl">{category.icon}</div>
          <div className="text-sm font-medium leading-tight">
            {category.name}
          </div>
          <div
            className={`text-xs mt-0.5 ${
              selectedCategory === category.id
                ? "text-blue-500/80"
                : "text-gray-500"
            }`}
          >
            {category.count}
          </div>
        </Button>
      ))}
    </nav>
  );
};
