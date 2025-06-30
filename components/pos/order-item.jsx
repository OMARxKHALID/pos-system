"use client";

import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import Image from "next/image";
import { QuantityControl } from "@/components/ui/quantity-control";
import { usePOSStore } from "@/hooks/use-pos-store";
import { Card } from "@/components/ui/card";

export const OrderItem = ({ item, showCheckmark = false }) => {
  const { updateQuantity, removeFromCart } = usePOSStore();

  return (
    <Card className="flex items-center gap-3 p-2 border-0 rounded-lg bg-white/50">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-50">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={32}
          height={32}
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold truncate text-slate-800">
          {item.name}
        </h4>
        <p className="text-xs text-slate-600">${item.price.toFixed(2)}</p>
      </div>
      {showCheckmark && (
        <div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <QuantityControl
        quantity={item.quantity}
        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
        size="sm"
      />
      <Button
        variant="ghost"
        size="icon"
        className="w-6 h-6 text-red-400 rounded"
        onClick={() => removeFromCart(item.id)}
      >
        <X className="w-3 h-3" />
      </Button>
    </Card>
  );
};
