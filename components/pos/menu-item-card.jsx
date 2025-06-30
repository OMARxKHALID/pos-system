"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CATEGORY_COLORS } from "@/lib/constants";
import { usePOSStore } from "@/hooks/use-pos-store";

export const MenuItemCard = ({ item }) => {
  const { setSelectedItem } = usePOSStore();

  const getCategoryColor = (category) => {
    return (
      CATEGORY_COLORS[category] || "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  return (
    <Card
      className="transition-all duration-200 border cursor-pointer bg-white/80 backdrop-blur-sm border-slate-200/60 rounded-xl group"
      onClick={() => setSelectedItem(item)}
    >
      <CardContent className="p-2.5">
        <div className="flex items-center justify-center mb-2 transition-colors rounded-lg aspect-square bg-slate-50">
          {/* <Image
            src={item.image}
            alt={item.name}
            width={60}
            height={60}
            className="object-cover rounded-lg"
          /> */}
          <div className="text-7xl">{item.icon}</div>
        </div>
        <h3 className="font-semibold text-xs mb-1.5 text-slate-800 line-clamp-2 leading-tight">
          {item.name}
        </h3>
        <Badge
          className={`text-xs mb-1.5 border rounded-md px-1.5 py-0.5 ${getCategoryColor(
            item.category
          )}`}
        >
          {item.category}
        </Badge>
        <p className="text-sm font-bold text-slate-800">
          ${item.price.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
};
