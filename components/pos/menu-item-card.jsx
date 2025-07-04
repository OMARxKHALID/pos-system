"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { useCategory } from "@/hooks/use-category";
import { getCategoryColor } from "@/utils/category-colors";

export function MenuItemCard({ item, onSelect }) {
  const { categories } = useCategory();

  const getCategory = (category) => {
    // If category is a populated object, return it directly
    if (typeof category === "object" && category !== null) {
      return category;
    }

    // If category is a string ID, find it in categories array
    return categories?.find((c) => c._id === category);
  };

  const category = getCategory(item.category);

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-sm group bg-white/80 backdrop-blur-sm border-gray-200 rounded-2xl overflow-hidden ${
        !item.available ? "opacity-50 pointer-events-none" : "cursor-pointer"
      }`}
      onClick={() => item.available && onSelect(item)}
    >
      <CardContent className="p-3">
        <div className="flex flex-col h-full items-center text-center">
          <div className="w-full aspect-square flex items-center justify-center  rounded-md mb-3 group-hover:from-primary/5 group-hover:to-primary/10 transition-colors overflow-hidden">
            <span className="text-6xl">{item.icon}</span>
          </div>

          <div className="flex-1 flex flex-col items-center text-center">
            <div className="mb-2">
              <h3 className="font-medium text-sm leading-tight mb-1 text-gray-900 font-quantico line-clamp-2">
                {item.name}
              </h3>
              <Badge
                variant="secondary"
                className={`text-[10px] font-quantico h-4 px-1 ${getCategoryColor(
                  typeof item.category === "object"
                    ? item.category.name
                    : item.category,
                  "border"
                )}`}
              >
                {category
                  ? `${category.icon} ${category.name}`
                  : typeof item.category === "object"
                  ? item.category.name
                  : item.category}
              </Badge>
              {!item.available && (
                <Badge variant="secondary" className="text-xs mt-1">
                  Unavailable
                </Badge>
              )}
            </div>

            <div className="mt-auto text-center">
              <p className="text-sm font-semibold text-primary font-quantico">
                {formatCurrency(item.price)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
