"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { formatDateTime, formatCurrency } from "@/utils/formatters";
import {
  Printer,
  Download,
  Package,
  User,
  CreditCard,
  Calendar,
  Hash,
  Receipt,
} from "lucide-react";
import { OrderDetailContent } from "./order-detail-content";
import { OrderDetailActions } from "./order-detail-actions";

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
              .item-details { display: flex; justify-content: space-between; }
              .quantity { color: #666; }
              .price { font-weight: bold; }
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
    return `
      <div class="receipt">
        <div class="header">
          <div class="restaurant-name">Restaurant POS</div>
          <div>123 Main Street, City, State</div>
          <div>Phone: (555) 123-4567</div>
        </div>

        <div class="order-info">
          <div><strong>Order #:</strong> ${order.orderNumber}</div>
          <div><strong>Date:</strong> ${formatDateTime(order.createdAt)}</div>
          <div><strong>Customer:</strong> ${order.customerName}</div>
          <div><strong>Status:</strong> ${order.status.toUpperCase()}</div>
        </div>

        <div class="items">
          ${order.items
            .map(
              (item) => `
            <div class="item">
              <div>
                <div>${item.name}</div>
                <div class="quantity">Qty: ${item.quantity}</div>
              </div>
              <div class="price">${formatCurrency(
                item.price * item.quantity
              )}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(order.subtotal)}</span>
          </div>
          ${
            order.tax
              ? `
            <div class="summary-row">
              <span>Tax:</span>
              <span>${formatCurrency(order.tax)}</span>
            </div>
          `
              : ""
          }
          ${
            order.discount
              ? `
            <div class="summary-row">
              <span>Discount:</span>
              <span>-${formatCurrency(order.discount)}</span>
            </div>
          `
              : ""
          }
          <div class="total">
            <span>Total:</span>
            <span>${formatCurrency(order.total)}</span>
          </div>
        </div>

        <div class="footer">
          <div>Payment Method: ${order.paymentMethod.toUpperCase()}</div>
          <div>Thank you for your order!</div>
          <div>Please come again</div>
        </div>
      </div>
    `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Receipt className="h-6 w-6 text-blue-600" />
            Order #{order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <OrderDetailContent order={order} />
          <OrderDetailActions
            onPrint={handlePrint}
            onDownload={handleDownload}
            isPrinting={isPrinting}
            isDownloading={isDownloading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
