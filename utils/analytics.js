// Pure analytics functions - no side effects

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

export function calculateSalesByCategory(orders, menuItems) {
  const categoryMap = new Map();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const menuItem = menuItems.find((mi) => mi._id === item.menuItem);
      const category = menuItem?.category || "Unknown";

      const current = categoryMap.get(category) || {
        category,
        totalSales: 0,
        orderCount: 0,
      };

      categoryMap.set(category, {
        ...current,
        totalSales: current.totalSales + item.price * item.quantity,
        orderCount: current.orderCount + 1,
      });
    });
  });

  return Array.from(categoryMap.values()).sort(
    (a, b) => b.totalSales - a.totalSales
  );
}

export function calculateHourlySalesTrend(orders) {
  const hourlyMap = new Map();

  // Initialize 24 hours
  for (let i = 0; i < 24; i++) {
    hourlyMap.set(i, {
      hour: i,
      totalSales: 0,
      orderCount: 0,
    });
  }

  orders.forEach((order) => {
    const orderDate = new Date(order.timestamp);
    const hour = orderDate.getHours();

    const hourData = hourlyMap.get(hour);
    hourlyMap.set(hour, {
      ...hourData,
      totalSales: hourData.totalSales + order.total,
      orderCount: hourData.orderCount + 1,
    });
  });

  return Array.from(hourlyMap.values());
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
