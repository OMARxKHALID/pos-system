"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Image from "next/image";
import { usePOSStore } from "@/hooks/use-pos-store";
import { QuantityControl } from "@/components/ui/quantity-control";
import { CATEGORY_COLORS } from "@/lib/constants";

export const ItemDetailModal = () => {
  const { selectedItem, setSelectedItem, addToCart } = usePOSStore();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  if (!selectedItem) return null;

  const handleClose = () => {
    setSelectedItem(null);
    setQuantity(1);
    setNotes("");
  };

  const handleAddToCart = () => {
    addToCart(selectedItem, quantity);
    handleClose();
  };

  const getCategoryColor = (category) => {
    return (
      CATEGORY_COLORS[category] || "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-xs border bg-white/95 backdrop-blur-xl border-white/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800">Detail Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="w-6 h-6 rounded-lg"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-3 rounded-lg bg-slate-50">
            <Image
              src={selectedItem.image || "/placeholder.svg"}
              alt={selectedItem.name}
              width={60}
              height={60}
              className="object-cover rounded-lg"
            />
          </div>

          <div className="mb-3 text-center">
            <Badge
              className={`mb-2 border rounded-md text-xs ${getCategoryColor(
                selectedItem.category
              )}`}
            >
              {selectedItem.category}
            </Badge>
            <h3 className="mb-1 text-sm font-bold text-slate-800">
              {selectedItem.name}
            </h3>
            <p className="text-lg font-bold text-blue-600">
              ${selectedItem.price.toFixed(2)}
            </p>
          </div>

          <Input
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-8 mb-3 text-xs border-slate-200 focus:border-blue-300 focus:ring-blue-200"
          />

          <div className="flex justify-center mb-4">
            <QuantityControl
              quantity={quantity}
              onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
              onIncrease={() => setQuantity(quantity + 1)}
            />
          </div>

          <Button
            className="w-full text-xs font-semibold text-white bg-blue-500 rounded-lg h-9"
            onClick={handleAddToCart}
          >
            Add to Cart (${(selectedItem.price * quantity).toFixed(2)})
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
