"use client";

import { Button } from "@/components/ui/button";
import { X, Check, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";

export const OrderItem = ({ item, showCheckmark = false }) => {
  const { updateQuantity, removeFromCart } = useCartStore();

  const handleDecrease = () => {
    if (item.quantity <= 1) removeFromCart(item.id);
    else updateQuantity(item.id, item.quantity - 1);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg">
      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-gray-50">
        <div className="text-4xl">{item.icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="mb-1 text-sm font-medium text-gray-900 truncate">
          {item.name}
        </h4>
        <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
      </div>
      {showCheckmark && (
        <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className="flex items-center flex-shrink-0 gap-2">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 bg-transparent border-gray-200 rounded-lg hover:bg-gray-50"
          onClick={handleDecrease}
        >
          <Minus className="w-3.5 h-3.5" />
        </Button>
        <span className="w-8 text-sm font-medium text-center text-gray-900">
          {item.quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 bg-transparent border-gray-200 rounded-lg hover:bg-gray-50"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0 w-8 h-8 text-gray-400 rounded-lg hover:text-red-500 hover:bg-red-50"
        onClick={() => removeFromCart(item.id)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
