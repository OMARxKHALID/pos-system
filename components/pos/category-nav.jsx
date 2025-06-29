"use client";

import { Button } from "@/components/ui/button";
import { categories } from "@/data/menu-data";
import { usePOSStore } from "@/hooks/use-pos-store";

export const CategoryNav = () => {
  const { selectedCategory, setSelectedCategory } = usePOSStore();

  return (
    <nav className="flex gap-1.5 mb-4 overflow-x-auto">
      {categories.map((category) => (
        <Button
          key={category.id}
          className={`flex flex-col items-center px-3 py-2 h-auto min-w-[70px] rounded-xl text-xs font-medium transition-all duration-200 ${
            selectedCategory === category.id
              ? "bg-blue-500 text-white"
              : "bg-slate-50 text-slate-600 border border-slate-200"
          }`}
          onClick={() => setSelectedCategory(category.id)}
        >
          <div className="text-sm mb-0.5">{category.icon}</div>
          <div className="text-xs font-medium leading-tight">
            {category.name}
          </div>
          <div className="text-xs opacity-75">{category.count}</div>
        </Button>
      ))}
    </nav>
  );
};
