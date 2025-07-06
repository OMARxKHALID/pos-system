"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { formatDateTime, formatCurrency } from "@/utils/formatters";
import { Printer, Download, Receipt } from "lucide-react";

const OrderDetailModal = ({ order, isOpen, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!order) return null;

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const printWindow = window.open("", "_blank");
      const receiptContent = generateReceiptHTML(order);

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt - Order ${order.orderNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .receipt { max-width: 400px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .restaurant-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
              .order-info { margin-bottom: 20px; }
              .items { margin-bottom: 20px; }
              .item { display: flex; justify-content: space-between; margin-bottom: 8px; }
              .summary { border-top: 1px solid #ccc; padding-top: 10px; }
              .summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; }
              .footer { text-align: center; margin-top: 20px; color: #666; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            ${receiptContent}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } catch (error) {
      console.error("Print failed:", error);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const receiptContent = generateReceiptHTML(order);
      const blob = new Blob([receiptContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${order.orderNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const generateReceiptHTML = (order) => {
    // Process order data similar to ReceiptDataProcessor
    const processedData = {
      header: {
        restaurantName: "RestaurantPOS",
        address: "123 Main Street",
        phone: "(555) 123-4567",
        dateTime: formatDateTime(order.createdAt),
      },
      orderInfo: {
        orderNumber: order.orderNumber,
        customerName: order.customerName || "Guest",
        paymentMethod: order.paymentMethod
          ? order.paymentMethod.charAt(0).toUpperCase() +
            order.paymentMethod.slice(1)
          : "Cash",
      },
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: formatCurrency(item.price),
        total: formatCurrency(item.price * item.quantity),
        discount: item.discount || 0,
      })),
      totals: {
        subtotal: formatCurrency(order.subtotal),
        itemDiscounts: null,
        cartDiscount:
          order.discount > 0 ? formatCurrency(order.discount) : null,
        tax: formatCurrency(order.tax),
        total: formatCurrency(order.total),
      },
      footer: {
        thankYou: "Thank you for your order!",
        comeAgain: "Please come again",
      },
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Order Receipt</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              'poppins': ['Poppins', 'sans-serif'],
            }
          }
        }
      }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body class="font-poppins text-gray-900 bg-white p-5 text-xs leading-relaxed font-normal max-w-xs mx-auto">
  <div class="w-full max-w-[280px] mx-auto">
    ${this.generateHeader(processedData.header)}
    ${this.generateOrderInfo(processedData.orderInfo)}
    ${this.generateItemsTable(processedData.items)}
    ${this.generateTotalsSection(processedData.totals)}
    ${this.generateFooter(processedData.footer)}
  </div>
</body>
</html>`;
  };

  const generateHeader = (header) => {
    return `
    <div class="text-center mb-5 border-b-2 border-black pb-4 w-full">
      <h1 class="text-lg font-bold mb-1 tracking-wider">
        ${header.restaurantName}
      </h1>
      <div class="text-[10px] leading-tight text-gray-600">
        ${header.address}<br>
        Phone: ${header.phone}
      </div>
      <div class="text-[10px] text-gray-500 mt-1 text-center tracking-wider w-full block">
        ${header.dateTime}
      </div>
    </div>`;
  };

  const generateOrderInfo = (orderInfo) => {
    return `
    <div class="mb-4">
      <div class="flex justify-between items-center mb-1 text-[11px]">
        <span class="font-semibold text-gray-700">Order:</span>
        <span class="font-normal text-gray-600">${orderInfo.orderNumber}</span>
      </div>
      <div class="flex justify-between items-center mb-1 text-[11px]">
        <span class="font-semibold text-gray-700">Customer:</span>
        <span class="font-normal text-gray-600">${orderInfo.customerName}</span>
      </div>
      <div class="flex justify-between items-center mb-1 text-[11px]">
        <span class="font-semibold text-gray-700">Payment:</span>
        <span class="font-normal text-gray-600">${orderInfo.paymentMethod}</span>
      </div>
    </div>`;
  };

  const generateItemsTable = (items) => {
    const itemsHTML = items
      .map(
        (item) => `
        <tr class="border-b border-dotted border-gray-300">
          <td class="py-1 text-[10px] align-top">
            <div class="font-semibold text-gray-700">${item.name}</div>
            ${
              item.discount > 0
                ? `<div class="text-[9px] text-green-600 font-semibold mt-0.5">${item.discount}% OFF</div>`
                : ""
            }
          </td>
          <td class="py-1 text-[10px] text-center">${item.quantity}</td>
          <td class="py-1 text-[10px] text-right">${item.price}</td>
          <td class="py-1 text-[10px] text-right">${item.total}</td>
        </tr>`
      )
      .join("");

    return `
    <table class="w-full border-collapse my-4">
      <thead>
        <tr>
          <th class="text-left py-1 border-b border-gray-700 font-bold text-[10px] uppercase" style="width: 50%;">Item</th>
          <th class="text-center py-1 border-b border-gray-700 font-bold text-[10px] uppercase" style="width: 15%;">Qty</th>
          <th class="text-right py-1 border-b border-gray-700 font-bold text-[10px] uppercase" style="width: 20%;">Price</th>
          <th class="text-right py-1 border-b border-gray-700 font-bold text-[10px] uppercase" style="width: 15%;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>`;
  };

  const generateTotalsSection = (totals) => {
    return `
    <div class="mt-4 pt-3 border-t border-gray-700">
      <div class="flex justify-between mb-1 text-[11px] text-gray-600">
        <span>Subtotal:</span>
        <span>${totals.subtotal}</span>
      </div>
      ${
        totals.itemDiscounts
          ? `
      <div class="flex justify-between mb-1 text-[11px] text-green-600 font-semibold">
        <span>Item Discounts:</span>
        <span>-${totals.itemDiscounts}</span>
      </div>`
          : ""
      }
      ${
        totals.cartDiscount
          ? `
      <div class="flex justify-between mb-1 text-[11px] text-green-600 font-semibold">
        <span>Cart Discount:</span>
        <span>-${totals.cartDiscount}</span>
      </div>`
          : ""
      }
      <div class="flex justify-between mb-1 text-[11px] text-gray-600">
        <span>Tax (10%):</span>
        <span>${totals.tax}</span>
      </div>
      <div class="flex justify-between mb-1 text-sm font-bold text-black border-t-2 border-black pt-1 mt-2">
        <span>TOTAL:</span>
        <span>${totals.total}</span>
      </div>
    </div>`;
  };

  const generateFooter = (footer) => {
    return `
    <div class="text-center mt-5 pt-4 border-t-2 border-black text-[11px]">
      <div class="font-bold mb-1 text-xs">
        ${footer.thankYou}
      </div>
      <div class="text-gray-600 text-[10px]">
        ${footer.comeAgain}
      </div>
    </div>`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full p-0">
        <DialogHeader className="p-4 border-b pr-12">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-blue-600" />
              <span className="font-medium">#{order.orderNumber}</span>
            </div>
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Basic Info */}
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span>{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span>{formatDateTime(order.createdAt).split(" ")[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Items</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <span>{item.name}</span>
                    <span className="text-gray-500 ml-1">×{item.quantity}</span>
                  </div>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium mt-2 pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handlePrint}
              disabled={isPrinting}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Printer className="h-3 w-3 mr-1" />
              {isPrinting ? "Printing..." : "Print"}
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Download className="h-3 w-3 mr-1" />
              {isDownloading ? "..." : "Download"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
