"use client";
import { useEffect } from "react";

export const ReceiptGenerator = ({
  open = false,
  orderData = null,
  totals = null,
  onPrinted = () => {},
}) => {
  useEffect(() => {
    if (!open || !orderData || !totals) return;

    const generateReceiptContent = () => `
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
          <div>Table: <b>${orderData.table || "-"}</b></div>
          <div>Type: <b>${orderData.type || "-"}</b></div>
          <div>Date: <b>${orderData.date}</b></div>
          <div>Time: <b>${orderData.time}</b></div>
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
            ${orderData.items
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
              <td class="right">$${totals.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="right">Tax (10%)</td>
              <td class="right">$${totals.tax.toFixed(2)}</td>
            </tr>
            ${
              totals.discount > 0
                ? `<tr>
                    <td colspan="3" class="right">Discount</td>
                    <td class="right">-$${totals.discount.toFixed(2)}</td>
                  </tr>`
                : ""
            }
            <tr class="total-row">
              <td colspan="3" class="right">TOTAL</td>
              <td class="right">$${totals.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <div class="center">Thank you!</div>
        <script>
          window.onload = function() { window.print(); setTimeout(() => window.close(), 500); };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(generateReceiptContent());
      printWindow.document.close();
    }
    onPrinted();
    // eslint-disable-next-line
  }, [open]);

  return null;
};
