"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { usePOSStore } from "@/hooks/use-pos-store";
import { calculateOrderTotals } from "@/utils/pos-utils";

export const OrderSummary = () => {
  const {
    orderItems,
    promoApplied,
    togglePromo,
    placeOrder,
    selectedTable,
    selectedOrderType,
  } = usePOSStore();

  const totals = calculateOrderTotals(orderItems, promoApplied);
  const canPlaceOrder =
    orderItems.length > 0 && selectedTable && selectedOrderType;

  return (
    <div className="p-4 border-t border-slate-200/50 bg-white/30">
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-semibold text-slate-800">
            $ {totals.subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-600">Tax (10%)</span>
          <span className="font-semibold text-slate-800">
            $ {totals.tax.toFixed(2)}
          </span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-emerald-600">Discount</span>
            <span className="font-semibold text-emerald-600">
              -$ {totals.discount.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2 mb-4 text-sm font-bold border-t border-slate-200">
        <span className="text-slate-800">TOTAL</span>
        <span className="text-slate-800">$ {totals.total.toFixed(2)}</span>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={promoApplied ? "default" : "outline"}
          className={`flex-1 h-8 rounded-lg text-xs ${
            promoApplied
              ? "bg-emerald-500 text-white"
              : "border-slate-200 text-slate-600"
          }`}
          onClick={togglePromo}
        >
          {promoApplied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Promo Applied
            </>
          ) : (
            "Add Promo"
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-8 text-xs bg-transparent rounded-lg border-slate-200 text-slate-600"
        >
          QRIS
        </Button>
      </div>

      <Button
        className="w-full h-10 text-sm font-semibold text-white bg-blue-500 shadow-md hover:bg-blue-600 rounded-xl disabled:opacity-50"
        onClick={placeOrder}
        disabled={!canPlaceOrder}
      >
        Place Order
      </Button>
    </div>
  );
};
