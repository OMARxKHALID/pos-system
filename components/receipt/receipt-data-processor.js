import {
  calculateItemFinalPrice,
  calculateOrderTotals,
} from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatters";
import { capitalizeFirst } from "@/utils/string-utils";

export class ReceiptDataProcessor {
  static processOrderData(orderData) {
    const breakdown = calculateOrderTotals(
      orderData.items || [],
      orderData.discount || 0
    );

    return {
      header: this.processHeader(orderData),
      orderInfo: this.processOrderInfo(orderData),
      items: this.processItems(orderData.items || []),
      totals: this.processTotals(breakdown),
      footer: this.processFooter(),
    };
  }

  static processHeader(orderData) {
    return {
      restaurantName: "RestaurantPOS",
      address: "123 Main Street",
      phone: "(555) 123-4567",
      dateTime: `${orderData.date} ${orderData.time}`.trim(),
    };
  }

  static processOrderInfo(orderData) {
    return {
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName || "Guest",
      paymentMethod: orderData.paymentMethod
        ? capitalizeFirst(orderData.paymentMethod)
        : "Cash",
    };
  }

  static processItems(items) {
    return items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: formatCurrency(item.price),
      total: formatCurrency(calculateItemFinalPrice(item)),
      discount: item.discount || 0,
    }));
  }

  static processTotals(breakdown) {
    return {
      subtotal: formatCurrency(breakdown.subtotal),
      itemDiscounts:
        breakdown.itemDiscounts > 0
          ? formatCurrency(breakdown.itemDiscounts)
          : null,
      cartDiscount:
        breakdown.discount > 0 ? formatCurrency(breakdown.discount) : null,
      tax: formatCurrency(breakdown.tax),
      total: formatCurrency(breakdown.total),
    };
  }

  static processFooter() {
    return {
      thankYou: "Thank you for your order!",
      comeAgain: "Please come again",
    };
  }
}
