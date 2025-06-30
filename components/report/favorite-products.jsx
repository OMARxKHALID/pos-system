import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { favoriteProducts } from "@/lib/report-data";
import { CATEGORY_COLORS } from "@/lib/constants";

export const FavoriteProducts = () => {
  const getCategoryColor = (category) => {
    return (
      CATEGORY_COLORS[category] || "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  return (
    <Card className="border bg-white/80 backdrop-blur-sm border-slate-200/60">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Top Products</h3>
          <Button
            variant="ghost"
            size="icon"
            className="bg-transparent h-9 w-9 rounded-xl text-slate-400"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 pb-3 text-sm font-semibold border-b text-slate-600 border-slate-200">
            <span>Product</span>
            <span>Category</span>
            <span className="text-right">Orders</span>
          </div>

          {favoriteProducts.map((product, index) => (
            <div
              key={product.id}
              className="grid items-center grid-cols-3 gap-4 px-2 py-3 transition-colors rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={32}
                      height={32}
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full -top-1 -left-1">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {product.name}
                  </p>
                </div>
              </div>
              <div>
                <Badge
                  className={`text-xs border rounded-lg px-2 py-1 ${getCategoryColor(
                    product.category
                  )}`}
                >
                  {product.category}
                </Badge>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-slate-800">
                  {product.orders}
                </span>
                <span className="ml-1 text-xs text-slate-500">orders</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
