export function calculateOrderTotals(orderItems, cartDiscountPercentage = 0) {
  const subtotal = calculateSubtotalBeforeDiscounts(orderItems);
  const itemDiscountsTotal = calculateTotalItemDiscounts(orderItems);
  const subtotalAfterItemDiscounts = subtotal - itemDiscountsTotal;

  const cartDiscountAmount =
    (cartDiscountPercentage / 100) * subtotalAfterItemDiscounts;
  const subtotalAfterAllDiscounts =
    subtotalAfterItemDiscounts - cartDiscountAmount;

  const taxRate = 0.1;
  const taxAmount = subtotalAfterAllDiscounts * taxRate;
  const grandTotal = subtotalAfterAllDiscounts + taxAmount;

  return {
    subtotal,
    tax: taxAmount,
    discount: cartDiscountAmount,
    total: grandTotal,
    itemDiscounts: itemDiscountsTotal,
  };
}

function calculateSubtotalBeforeDiscounts(orderItems) {
  return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateTotalItemDiscounts(orderItems) {
  return orderItems.reduce((sum, item) => {
    const itemPrice = item.price * item.quantity;
    const itemDiscountPercentage = (item.discount || 0) / 100;
    return sum + itemPrice * itemDiscountPercentage;
  }, 0);
}

export function calculateItemOriginalPrice(item) {
  return item.price * item.quantity;
}

export function calculateItemDiscountAmount(item) {
  return calculateItemOriginalPrice(item) * ((item.discount || 0) / 100);
}

export function calculateItemFinalPrice(item) {
  return calculateItemOriginalPrice(item) - calculateItemDiscountAmount(item);
}

export function clampDiscountPercentage(discount) {
  return Math.max(0, Math.min(100, discount));
}

export function analyzeOrderFinancials(order) {
  const subtotalBeforeDiscounts = order.items.reduce(
    (sum, item) => sum + calculateItemOriginalPrice(item),
    0
  );

  const totalItemDiscounts = order.items.reduce(
    (sum, item) => sum + calculateItemDiscountAmount(item),
    0
  );

  const subtotalAfterItemDiscounts =
    subtotalBeforeDiscounts - totalItemDiscounts;
  const cartDiscountAmount =
    (order.discount / 100) * subtotalAfterItemDiscounts;
  const subtotalAfterAllDiscounts =
    subtotalAfterItemDiscounts - cartDiscountAmount;

  const taxAmount = subtotalAfterAllDiscounts * 0.1;
  const grandTotal = subtotalAfterAllDiscounts + taxAmount;

  return {
    subtotalBeforeDiscounts,
    totalItemDiscounts,
    cartDiscountAmount,
    subtotalAfterAllDiscounts,
    taxAmount,
    grandTotal,
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDateTime(timestamp) {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  return (
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) +
    " " +
    date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

export function normalizeString(str) {
  return (str || "").toLowerCase().trim();
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

export function aggregateProductSales(orders) {
  const productMap = new Map();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const current = productMap.get(item.name) || {
        name: item.name,
        quantity: 0,
        revenue: 0,
      };

      productMap.set(item.name, {
        ...current,
        quantity: current.quantity + item.quantity,
        revenue: current.revenue + item.price * item.quantity,
      });
    });
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
}

export function aggregateCustomerOrders(orders) {
  const customerMap = new Map();

  orders.forEach((order) => {
    const current = customerMap.get(order.customerName) || {
      name: order.customerName,
      orderCount: 0,
      totalSpent: 0,
    };

    customerMap.set(order.customerName, {
      ...current,
      orderCount: current.orderCount + 1,
      totalSpent: current.totalSpent + order.total,
    });
  });

  return Array.from(customerMap.values())
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);
}

export function calculateWeeklySalesTrend(orders) {
  const dailySalesMap = new Map();
  const today = new Date();

  // Initialize last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    dailySalesMap.set(dateKey, {
      date: dateKey,
      totalSales: 0,
      orderCount: 0,
    });
  }

  // Populate with order data
  orders.forEach((order) => {
    const orderDate = new Date(order.timestamp);
    const dateKey = orderDate.toISOString().split("T")[0];

    if (dailySalesMap.has(dateKey)) {
      const dayData = dailySalesMap.get(dateKey);
      dailySalesMap.set(dateKey, {
        ...dayData,
        totalSales: dayData.totalSales + order.total,
        orderCount: dayData.orderCount + 1,
      });
    }
  });

  return Array.from(dailySalesMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

export function aggregatePaymentMethods(orders) {
  const paymentMethodMap = new Map();

  orders.forEach((order) => {
    const current = paymentMethodMap.get(order.paymentMethod) || {
      method: order.paymentMethod,
      totalAmount: 0,
      usageCount: 0,
    };

    paymentMethodMap.set(order.paymentMethod, {
      ...current,
      totalAmount: current.totalAmount + order.total,
      usageCount: current.usageCount + 1,
    });
  });

  return Array.from(paymentMethodMap.values());
}

export function exportAnalyticsToCSV(analyticsData, linkRef) {
  if (!analyticsData) return;

  const rows = [
    ["Metric", "Value"],
    ["Total Sales", analyticsData.totalSales],
    ["Total Orders", analyticsData.totalOrders],
    ["Average Order Value", analyticsData.averageOrderValue],
  ];

  createAndTriggerCSVDownload(rows, "analytics.csv", linkRef);
}

export function exportOrdersToCSV(orders, linkRef) {
  if (!orders || orders.length === 0) return;

  const rows = [
    ["Order ID", "Date", "Status", "Total", "Items"],
    ...orders.map((order) => [
      order._id,
      new Date(order.createdAt).toLocaleString(),
      order.status,
      order.total,
      order.items
        .map((item) => `${item.menuItem?.name || "Unknown"} x${item.quantity}`)
        .join("; "),
    ]),
  ];

  createAndTriggerCSVDownload(rows, "orders.csv", linkRef);
}

function createAndTriggerCSVDownload(rows, filename, linkRef) {
  const csvContent = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  if (linkRef.current) {
    linkRef.current.href = url;
    linkRef.current.download = filename;
    linkRef.current.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
