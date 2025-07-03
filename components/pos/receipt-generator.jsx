"use client";
import { useEffect } from "react";
import {
  calculateItemFinalPrice,
  formatCurrency,
  calculateOrderTotals,
} from "@/utils/pos-utils";

export function ReceiptGenerator({
  open = false,
  orderData = null,
  totals = null,
  onPrinted = () => {},
}) {
  useEffect(() => {
    if (!open || !orderData || !totals) return;

    const generateReceiptContent = () => {
      const breakdown = calculateOrderTotals(orderData);
      return `
<!DOCTYPE html>
<html>
<head>
    <title>Order Receipt</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Poppins', sans-serif;
      color: #1a1a1a;
      background: #fff;
      padding: 20px;
      font-size: 12px;
      line-height: 1.4;
      font-weight: 400;
      max-width: 300px;
      margin: 0 auto;
    }
    .receipt-container {
      width: 100%;
      max-width: 280px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #000;
      padding-bottom: 15px;
      width: 100%;
    }
    .header h1 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 5px;
      letter-spacing: 1px;
    }
    .header .address {
      font-size: 10px;
      line-height: 1.3;
      color: #555;
    }
    .header .datetime {
      font-size: 10px;
      color: #888;
      margin-top: 4px;
      text-align: center;
      letter-spacing: 0.5px;
      width: 100%;
      display: block;
    }
    .section {
      margin-bottom: 15px;
    }
    .section-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
      font-size: 11px;
    }
    .section-row .label { font-weight: 600; color: #333; }
    .section-row .value { font-weight: 400; color: #666; }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    .items-table th {
      text-align: left;
      padding: 5px 0;
      border-bottom: 1px solid #333;
      font-weight: 700;
      font-size: 10px;
      text-transform: uppercase;
    }
    .items-table td {
      padding: 4px 0;
      font-size: 10px;
      vertical-align: top;
    }
    .item-row { border-bottom: 1px dotted #ccc; }
    .item-name { font-weight: 600; color: #333; }
    .item-discount {
      font-size: 9px;
      color: #16a34a;
      font-weight: 600;
      margin-top: 2px;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }

    .totals-section {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid #333;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
      font-size: 11px;
    }
    .total-row.subtotal { color: #666; }
    .total-row.discount {
      color: #16a34a;
      font-weight: 600;
    }
    .total-row.tax { color: #666; }
    .total-row.final {
      font-weight: 700;
      font-size: 14px;
      color: #000;
      border-top: 2px solid #000;
      padding-top: 5px;
      margin-top: 8px;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 2px solid #000;
      font-size: 11px;
    }
    .footer .thank-you {
      font-weight: 700;
      margin-bottom: 5px;
      font-size: 12px;
    }
    .footer .come-again {
      color: #666;
      font-size: 10px;
    }

    @media print {
      body {
        padding: 10px;
        font-size: 11px;
      }
      .receipt-container {
        max-width: 260px;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <h1>RestaurantPOS</h1>
      <div class="address">
        123 Main Street<br>
        Phone: (555) 123-4567
      </div>
      <div class="datetime">${`${orderData.date} ${orderData.time}`.trim()}</div>
    </div>

    <div class="section">
      <div class="section-row"><span class="label">Order:</span><span class="value">${
        orderData.orderNumber
      }</span></div>
      <div class="section-row"><span class="label">Customer:</span><span class="value">${
        orderData.customerName || "Guest"
      }</span></div>
      <div class="section-row"><span class="label">Payment:</span><span class="value">${
        orderData.paymentMethod?.charAt(0).toUpperCase() +
          orderData.paymentMethod?.slice(1) || "Cash"
      }</span></div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 50%;">Item</th>
          <th style="width: 15%;" class="text-center">Qty</th>
          <th style="width: 20%;" class="text-right">Price</th>
          <th style="width: 15%;" class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${orderData.items
          .map((item) => {
            const final = calculateItemFinalPrice(item);
            return `
            <tr class="item-row">
              <td>
                <div class="item-name">${item.name}</div>
                ${
                  item.discount
                    ? `<div class="item-discount">${item.discount}% OFF</div>`
                    : ""
                }
              </td>
              <td class="text-center">${item.quantity}</td>
              <td class="text-right">${formatCurrency(item.price)}</td>
              <td class="text-right">${formatCurrency(final)}</td>
            </tr>`;
          })
          .join("")}
      </tbody>
    </table>

    <div class="totals-section">
      <div class="total-row subtotal"><span>Subtotal:</span><span>${formatCurrency(
        breakdown.actualSubtotal
      )}</span></div>
      ${
        breakdown.actualItemDiscounts > 0
          ? `<div class="total-row discount"><span>Item Discounts:</span><span>-${formatCurrency(
              breakdown.actualItemDiscounts
            )}</span></div>`
          : ""
      }
      ${
        breakdown.cartDiscountAmount > 0
          ? `<div class="total-row discount"><span>Cart Discount:</span><span>-${formatCurrency(
              breakdown.cartDiscountAmount
            )}</span></div>`
          : ""
      }
      <div class="total-row tax"><span>Tax (10%):</span><span>${formatCurrency(
        breakdown.taxAmount
      )}</span></div>
      <div class="total-row final"><span>TOTAL:</span><span>${formatCurrency(
        breakdown.finalTotal
      )}</span></div>
    </div>

    <div class="footer">
      <div class="thank-you">Thank you for your order!</div>
      <div class="come-again">Please come again</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
      setTimeout(() => window.close(), 1000);
    };
  </script>
</body>
</html>`;
    };

    const html = generateReceiptContent().trim();

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${orderData.orderNumber || Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    onPrinted();
  }, [open, orderData, totals, onPrinted]);

  return null;
}
