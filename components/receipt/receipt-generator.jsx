"use client";
import { useEffect } from "react";
import { ReceiptTemplate } from "./receipt-template";
import { ReceiptDataProcessor } from "./receipt-data-processor";

export function ReceiptGenerator({
  open = false,
  orderData = null,
  totals = null,
  onPrinted = () => {},
}) {
  useEffect(() => {
    if (!open || !orderData || !totals) return;

    const generateAndDownloadReceipt = () => {
      const processedData = ReceiptDataProcessor.processOrderData(orderData);
      const receiptContent = ReceiptTemplate.generateHTML(processedData);

      const blob = new Blob([receiptContent], { type: "text/html" });
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
    };

    generateAndDownloadReceipt();
  }, [open, orderData, totals, onPrinted]);

  return null;
}
