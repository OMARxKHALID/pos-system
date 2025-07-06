export function totalProductSales(orders) {
  const productMap = new Map();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      // Handle both populated and non-populated menu items
      const menuItem = item.menuItem;
      const productId = menuItem?._id || item.menuItem;
      const productName = menuItem?.name || item.name;
      const productIcon = menuItem?.icon || "";
      const productImage = menuItem?.image || "";
      const productCategory = menuItem?.category || "";

      const existing = productMap.get(productId) || {
        _id: productId,
        name: productName,
        icon: productIcon,
        image: productImage,
        category: productCategory,
        quantity: 0,
        revenue: 0,
      };

      productMap.set(productId, {
        ...existing,
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + item.price * item.quantity,
      });
    });
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
}

export function totalCustomerOrders(orders) {
  const customerMap = new Map();

  orders.forEach((order) => {
    const existing = customerMap.get(order.customerName) || {
      name: order.customerName,
      orderCount: 0,
      totalSpent: 0,
    };

    customerMap.set(order.customerName, {
      ...existing,
      orderCount: existing.orderCount + 1,
      totalSpent: existing.totalSpent + order.total,
    });
  });

  return Array.from(customerMap.values())
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);
}

export function calculateWeeklySalesTrend(orders) {
  const dailySalesMap = new Map();
  const today = new Date();

  // Initialize the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];

    dailySalesMap.set(dateKey, {
      date: dateKey,
      totalSales: 0,
      orderCount: 0,
    });
  }

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
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

export function totalPaymentMethods(orders) {
  const paymentMethodMap = new Map();

  orders.forEach((order) => {
    const existing = paymentMethodMap.get(order.paymentMethod) || {
      method: order.paymentMethod,
      totalAmount: 0,
      usageCount: 0,
    };

    paymentMethodMap.set(order.paymentMethod, {
      ...existing,
      totalAmount: existing.totalAmount + order.total,
      usageCount: existing.usageCount + 1,
    });
  });

  return Array.from(paymentMethodMap.values());
}

export function calculateSalesByCategory(orders, menuItems) {
  const categoryMap = new Map();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      // Handle both populated and non-populated menu items
      const menuItem = item.menuItem;
      let category = "Unknown";

      if (menuItem) {
        if (typeof menuItem === "object" && menuItem.category) {
          category = menuItem.category.name || menuItem.category;
        } else {
          // Find the menu item in the menuItems array
          const foundMenuItem = menuItems.find(
            (mi) => mi._id.toString() === (menuItem._id || menuItem).toString()
          );
          category = foundMenuItem?.category || "Unknown";
        }
      }

      const existing = categoryMap.get(category) || {
        category,
        totalSales: 0,
        orderCount: 0,
      };

      categoryMap.set(category, {
        ...existing,
        totalSales: existing.totalSales + item.price * item.quantity,
        orderCount: existing.orderCount + 1,
      });
    });
  });

  return Array.from(categoryMap.values()).sort(
    (a, b) => b.totalSales - a.totalSales
  );
}

export function calculateHourlySalesTrend(orders) {
  const hourlyMap = new Map();

  for (let i = 0; i < 24; i++) {
    hourlyMap.set(i, {
      hour: i,
      totalSales: 0,
      orderCount: 0,
    });
  }

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
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

export function exportDashboardToCSV(dashboardData, linkRef) {
  if (!dashboardData) return;

  const rows = [
    ["Metric", "Value"],
    ["Total Sales", dashboardData.totalSales],
    ["Total Orders", dashboardData.totalOrders],
    ["Average Order Value", dashboardData.averageOrderValue],
  ];

  createAndTriggerCSVDownload(rows, "dashboard.csv", linkRef);
}

export function exportOrdersToCSV(orders, linkRef) {
  if (!orders?.length) return;

  const headers = ["Order #", "Customer", "Items", "Total", "Status", "Date"];
  const rows = [
    headers,
    ...orders.map((order) => [
      order.orderNumber,
      order.customerName,
      order.items.length,
      formatCurrency(order.total),
      order.status,
      new Date(order.createdAt).toLocaleDateString(),
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

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
