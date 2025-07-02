"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Trash2, Receipt, Hash } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { useSalesStore } from "@/hooks/use-sales-store";
import { OrderItem } from "./order-item";
import { PaymentModal } from "./payment-modal";
import { DiscountModal } from "./discount-modal";
import { ReceiptGenerator } from "./receipt-generator";
import { useState, useMemo, useEffect, useCallback } from "react";
import { calculateOrderTotals, generateOrderNumber } from "@/utils/pos-utils";

export function OrderCart({ toggleCart = () => {}, isMobile = false }) {
  const { orderItems, clearCart, cartDiscount } = useCartStore();
  const { addOrder } = useSalesStore();

  const [localOrderNumber, setLocalOrderNumber] = useState(null);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(false);
  const [lastOrderData, setLastOrderData] = useState(null);

  const totals = useMemo(
    () => calculateOrderTotals(orderItems, cartDiscount),
    [orderItems, cartDiscount]
  );

  useEffect(() => {
    setLocalOrderNumber(generateOrderNumber());
  }, []);

  const handlePlaceOrder = useCallback(
    (customerName, paymentMethod) => {
      if (!orderItems.length) return;

      const now = new Date();
      const orderData = {
        id: crypto.randomUUID(),
        items: orderItems,
        customerName: customerName.trim() || "Guest",
        orderNumber: localOrderNumber || "",
        subtotal: totals.subtotal,
        tax: totals.tax,
        discount: totals.discount + totals.itemDiscounts,
        total: totals.total,
        paymentMethod,
        status: "completed",
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: now.getTime(),
      };

      addOrder(orderData);
      setLastOrderData(orderData);
      setPrintReceipt(true);
      clearCart();

      setTimeout(() => {
        setPaymentModalOpen(false);
        if (isMobile) toggleCart();
      }, 100);
    },
    [orderItems, localOrderNumber, totals, isMobile]
  );

  const hasItems = orderItems.length > 0;

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden bg-white/90 backdrop-blur-sm border-gray-200 rounded-lg shadow-sm">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Receipt className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Customer's Order
                </h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Hash className="w-3 h-3" />
                  <span>{localOrderNumber ?? "..."}</span>
                </div>
              </div>
            </div>

            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-md"
                onClick={toggleCart}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          {cartDiscount > 0 && (
            <div className="mt-3 flex justify-end">
              <Badge className="bg-green-50 text-green-700 border-0 text-[10px] h-5">
                {cartDiscount}% Cart Discount Applied
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-3">
          {!hasItems ? (
            <EmptyCart />
          ) : (
            <div className="space-y-3">
              {orderItems.map((item) => (
                <OrderItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>

        {hasItems && (
          <CartFooter
            totals={totals}
            cartDiscount={cartDiscount}
            setDiscountModalOpen={setDiscountModalOpen}
            setPaymentModalOpen={setPaymentModalOpen}
          />
        )}
      </Card>

      <DiscountModal
        open={discountModalOpen}
        onOpenChange={setDiscountModalOpen}
        currentDiscount={cartDiscount}
        type="cart"
      />

      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        total={totals.total}
        onConfirm={handlePlaceOrder}
      />

      <ReceiptGenerator
        open={printReceipt}
        orderData={lastOrderData}
        totals={totals}
        onPrinted={() => setPrintReceipt(false)}
      />
    </>
  );
}

// Extracted components
const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
    <div className="text-6xl mb-4 opacity-20">🛒</div>
    <p className="text-sm font-medium mb-1">No Item Selected</p>
    <p className="text-xs text-center">Please add some items from the menu</p>
  </div>
);

const CartFooter = ({
  totals,
  cartDiscount,
  setDiscountModalOpen,
  setPaymentModalOpen,
}) => {
  const { clearCart } = useCartStore();

  return (
    <CardContent className="pt-0 bg-gradient-to-t from-gray-50/30 to-transparent">
      <div className="space-y-2 mb-4 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">$ {totals.subtotal.toFixed(2)}</span>
        </div>

        {totals.itemDiscounts > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Item Discounts</span>
            <span>-$ {totals.itemDiscounts.toFixed(2)}</span>
          </div>
        )}

        {cartDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Cart Discount</span>
            <span>-$ {totals.discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="font-medium">$ {totals.tax.toFixed(2)}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-sm">
          <span>TOTAL</span>
          <span>$ {totals.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs bg-white/70 border-gray-200 hover:bg-white rounded-md"
            onClick={() => setDiscountModalOpen(true)}
          >
            Add Discount
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs bg-white/70 border-gray-200 hover:bg-white rounded-md"
            onClick={clearCart}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        <Button
          className="w-full h-9 font-medium bg-primary hover:bg-primary/90 rounded-md text-sm"
          onClick={() => setPaymentModalOpen(true)}
        >
          Place Order
        </Button>
      </div>
    </CardContent>
  );
};
