"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { formatDateTime, formatCurrency } from "@/utils/pos-utils";
import {
  Printer,
  Download,
  X,
  Package,
  User,
  CreditCard,
  Calendar,
  Hash,
  Receipt,
} from "lucide-react";

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

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "cash":
        return <Package className="h-4 w-4" />;
      case "wallet":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Receipt className="h-6 w-6 text-blue-600" />
            Order #{order.orderNumber}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Order Header Info */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      Date & Time
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {formatDateTime(order.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      Customer
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {order.customerName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Hash className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      Order Number
                    </div>
                    <div className="text-sm text-gray-600 font-mono">
                      {order.orderNumber}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {getPaymentMethodIcon(order.paymentMethod)}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      Payment Method
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {order.paymentMethod}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900">Status:</div>
                <OrderStatusBadge status={order.status} />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity}
                      </div>
                      {item.discount > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          Discount: {formatCurrency(item.discount)}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                      <div className="text-sm text-gray-600">
                        @ {formatCurrency(item.price)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(order.tax)}
                    </span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}
                <Separator className="my-3" />
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-bold text-gray-900">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex-1"
              variant="outline"
              size="lg"
            >
              <Printer className="h-4 w-4 mr-2" />
              {isPrinting ? "Printing..." : "Print Receipt"}
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1"
              variant="outline"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Downloading..." : "Download Receipt"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
