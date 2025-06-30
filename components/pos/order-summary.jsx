"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { calculateOrderTotals } from "@/utils/pos-utils";
import { useRef, useEffect } from "react";

export const OrderSummary = ({
  orderItems = [],
  promoApplied = false,
  selectedTable = null,
  selectedOrderType = null,
  customerName = "",
  orderHistory = [],
  placeOrder = () => {},
  togglePromo = () => {},
}) => {
  const orderHistoryRef = useRef(orderHistory);
  useEffect(() => {
    orderHistoryRef.current = orderHistory;
  }, [orderHistory]);

  const totals = calculateOrderTotals(orderItems, promoApplied);
  const canPlaceOrder =
    orderItems.length > 0 && selectedTable && selectedOrderType;

  const handlePlaceOrder = () => {
    if (!canPlaceOrder) return;
    placeOrder();

    setTimeout(() => {
      // Use latest orderHistory from store
      const latestOrder =
        orderHistoryRef.current && orderHistoryRef.current.length > 0
          ? orderHistoryRef.current[orderHistoryRef.current.length - 1]
          : null;
      if (!latestOrder) return;

      // Prepare order data for print
      const orderData = {
        orderItems: latestOrder.items,
        promoApplied,
        selectedTable: latestOrder.table,
        selectedOrderType: latestOrder.type,
        customerName: latestOrder.customerName,
        orderNumber: latestOrder.orderNumber,
        totals: {
          subtotal:
            latestOrder.totalPayment -
            (promoApplied ? latestOrder.totalPayment * 0.1 : 0),
          tax: latestOrder.totalPayment * 0.1,
          discount: promoApplied ? latestOrder.totalPayment * 0.1 : 0,
          total: latestOrder.totalPayment,
        },
        date: latestOrder.date,
        time: latestOrder.time,
      };

      // Open print window
      const printWindow = window.open("", "_blank", "width=400,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
          <head>
            <title>Order Receipt</title>
            <style>
              body { font-family: monospace, monospace; color: #222; background: #fafbfc; margin: 0; padding: 24px; }
              h2 { margin-bottom: 8px; }
              .section { margin-bottom: 16px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
              th, td { text-align: left; padding: 4px 0; }
              th { border-bottom: 1px solid #000; }
              .total-row { font-weight: bold; border-top: 1px solid #000; }
              .right { text-align: right; }
              .center { text-align: center; }
            </style>
          </head>
          <body>
            <h2 class="center">Order Receipt</h2>
            <div class="section">
              <div>Order: <b>${orderData.orderNumber}</b></div>
              <div>Name: <b>${orderData.customerName || "-"}</b></div>
              <div>Table: <b>${orderData.selectedTable || "-"}</b></div>
              <div>Type: <b>${orderData.selectedOrderType || "-"}</b></div>
              <div>Date: <b>${
                orderData.date || new Date().toLocaleDateString()
              }</b></div>
              <div>Time: <b>${
                orderData.time ||
                new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }</b></div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th class="right">Qty</th>
                  <th class="right">Price</th>
                  <th class="right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.orderItems
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td class="right">${item.quantity}</td>
                    <td class="right">$${item.price.toFixed(2)}</td>
                    <td class="right">$${(item.price * item.quantity).toFixed(
                      2
                    )}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="right">Subtotal</td>
                  <td class="right">$${orderData.totals.subtotal.toFixed(
                    2
                  )}</td>
                </tr>
                <tr>
                  <td colspan="3" class="right">Tax (10%)</td>
                  <td class="right">$${orderData.totals.tax.toFixed(2)}</td>
                </tr>
                ${
                  orderData.totals.discount > 0
                    ? `<tr>
                        <td colspan="3" class="right">Discount</td>
                        <td class="right">-$${orderData.totals.discount.toFixed(
                          2
                        )}</td>
                      </tr>`
                    : ""
                }
                <tr class="total-row">
                  <td colspan="3" class="right">TOTAL</td>
                  <td class="right">$${orderData.totals.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            <div class="center">Thank you!</div>
            <script>
              window.onload = function() { window.print(); setTimeout(() => window.close(), 500); };
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
    }, 100); // Wait for state to update
  };

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
        onClick={handlePlaceOrder}
        disabled={!canPlaceOrder}
      >
        Place Order
      </Button>
    </div>
  );
};
