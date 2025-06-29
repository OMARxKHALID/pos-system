import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { favoriteProducts } from "@/lib/report-data";

export const FavoriteProducts = () => {
  const getCategoryColor = (category) => {
    const colors = {
      Pastry: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Sandwich: "bg-orange-50 text-orange-700 border-orange-200",
      Cake: "bg-pink-50 text-pink-700 border-pink-200",
      Bread: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return colors[category] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <Card className="border bg-white/80 backdrop-blur-sm border-slate-200/60">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Top Products</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-100"
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
              className="grid items-center grid-cols-3 gap-4 px-2 py-3 transition-colors hover:bg-slate-50/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
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
