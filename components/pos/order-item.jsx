"use client";

import { Button } from "@/components/ui/button";
import { X, Edit3 } from "lucide-react";
import { QuantityControl } from "@/components/ui/quantity-control";
import { DiscountModal } from "./discount-modal";
import { useCartStore } from "@/hooks/zustand/use-cart-store";
import { useState } from "react";
import {
  calculateItemOriginalPrice,
  calculateItemFinalPrice,
} from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatters";

export function OrderItem({ item }) {
  const cartStore = useCartStore();
  const [discountModalOpen, setDiscountModalOpen] = useState(false);

  const handleDecrease = () => {
    if (!cartStore) return;

    if (item.quantity <= 1) {
      cartStore.removeFromCart(item._id);
    } else {
      cartStore.updateQuantity(item._id, item.quantity - 1);
    }
  };

  const originalPrice = calculateItemOriginalPrice(item);
  const finalPrice = calculateItemFinalPrice(item);

  return (
    <>
      <div className="flex items-center gap-3 py-3 px-3 border border-gray-200 rounded-lg bg-gray-50/50 mb-2 last:mb-0">
        {/* Item Image/Icon */}
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
          {item.icon ? (
            <span className="text-lg">{item.icon}</span>
          ) : item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-8 h-8 object-cover rounded"
            />
          ) : (
            <span className="text-gray-400 text-sm">📦</span>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm text-gray-900 mb-1 truncate">
                {item.name}
              </h4>
              <p className="text-xs text-gray-500">
                {formatCurrency(item.price)} each
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg touch-manipulation"
              onClick={() => cartStore?.removeFromCart(item._id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Quantity and Price Controls */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <QuantityControl
                quantity={item.quantity}
                onDecrease={handleDecrease}
                onIncrease={() =>
                  cartStore?.updateQuantity(item._id, item.quantity + 1)
                }
                size="sm"
              />

              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-blue-600 hover:bg-blue-50 rounded-sm"
                onClick={() => setDiscountModalOpen(true)}
              >
                <Edit3 className="w-2 h-2 mr-1" />
                {(item.discount || 0) > 0 ? `${item.discount}%` : "Edit"}
              </Button>
            </div>

            <div className="text-right">
              {(item.discount || 0) > 0 && (
                <span className="text-xs text-gray-400 line-through block">
                  {formatCurrency(originalPrice)}
                </span>
              )}
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(finalPrice)}
              </span>
            </div>
          </div>

          {/* Discount Badge */}
          {(item.discount || 0) > 0 && (
            <div className="mt-2">
              <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                {item.discount}% off
              </span>
            </div>
          )}
        </div>
      </div>

      <DiscountModal
        open={discountModalOpen}
        onOpenChange={setDiscountModalOpen}
        currentDiscount={item.discount || 0}
        type="item"
        itemId={item._id}
        itemName={item.name}
      />
    </>
  );
}
