"use client";

import { OrderItem } from "./order-item";
import { useCartStore } from "@/hooks/zustand/use-cart-store";
import { formatCurrency } from "@/utils/formatters";

export default function CartPage() {
  const cartStore = useCartStore();

  const totalItems = cartStore.getTotalQuantity();
  const totalPrice = cartStore.orderItems.reduce((sum, item) => {
    const finalPrice =
      item.price * item.quantity * (1 - (item.discount || 0) / 100);
    return sum + finalPrice;
  }, 0);

  return (
    <div className="max-w-xs mx-auto py-4 px-3">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-base font-semibold text-gray-900">Cart</h1>
        <span className="text-xs text-gray-500">{totalItems} items</span>
      </div>

      {cartStore.orderItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-xs">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="bg-white">
            {cartStore.orderItems.map((item) => (
              <OrderItem key={item._id} item={item} />
            ))}
          </div>

          {/* Simple Total */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Total</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
