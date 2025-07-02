export function calculateOrderTotals(orderItems, cartDiscount = 0) {
  const subtotal = orderItems.reduce((sum, item) => {
    const itemPrice = item.price * item.quantity;
    const itemDiscount = (item.discount || 0) / 100;
    const discountedPrice = itemPrice * (1 - itemDiscount);
    return sum + discountedPrice;
  }, 0);

  const cartDiscountAmount = (cartDiscount / 100) * subtotal;
  const discountedSubtotal = subtotal - cartDiscountAmount;
  const taxRate = 0.1;
  const tax = discountedSubtotal * taxRate;
  const total = discountedSubtotal + tax;

  return {
    subtotal,
    tax,
    discount: cartDiscountAmount,
    total,
    itemDiscounts: orderItems.reduce((sum, item) => {
      const itemPrice = item.price * item.quantity;
      const itemDiscount = (item.discount || 0) / 100;
      return sum + itemPrice * itemDiscount;
    }, 0),
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

export function normalizeString(str) {
  return (str || "").toLowerCase().trim();
}

// Clamp discount between 0 and 100
export function clampDiscount(discount) {
  return Math.max(0, Math.min(100, discount));
}

// Calculate the original price for a cart item
export function calculateItemOriginalPrice(item) {
  return item.price * item.quantity;
}

// Calculate the discount amount for a cart item
export function calculateItemDiscountAmount(item) {
  return calculateItemOriginalPrice(item) * ((item.discount || 0) / 100);
}

// Calculate the final price for a cart item after discount
export function calculateItemFinalPrice(item) {
  return calculateItemOriginalPrice(item) - calculateItemDiscountAmount(item);
}

// Calculate receipt breakdown (for receipt-generator)
export function calculateReceiptBreakdown(order) {
  const actualSubtotal = order.items.reduce(
    (sum, item) => sum + calculateItemOriginalPrice(item),
    0
  );
  const actualItemDiscounts = order.items.reduce(
    (sum, item) => sum + calculateItemDiscountAmount(item),
    0
  );
  const subtotalAfterItemDiscounts = actualSubtotal - actualItemDiscounts;
  const cartDiscountAmount = order.discount - actualItemDiscounts;
  const finalSubtotal = subtotalAfterItemDiscounts - cartDiscountAmount;
  const taxAmount = finalSubtotal * 0.1;
  const finalTotal = finalSubtotal + taxAmount;
  return {
    actualSubtotal,
    actualItemDiscounts,
    cartDiscountAmount,
    finalSubtotal,
    taxAmount,
    finalTotal,
  };
}

// --- Sales Analytics Aggregators ---

export function aggregateProducts(orders) {
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

export function aggregateCustomers(orders) {
  const customerMap = new Map();
  orders.forEach((order) => {
    const current = customerMap.get(order.customerName) || {
      name: order.customerName,
      orders: 0,
      total: 0,
    };
    customerMap.set(order.customerName, {
      ...current,
      orders: current.orders + 1,
      total: current.total + order.total,
    });
  });
  return Array.from(customerMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}

export function getDailySales(orders) {
  const dailyMap = new Map();
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    dailyMap.set(dateStr, { date: dateStr, sales: 0, orders: 0 });
  }
  orders.forEach((order) => {
    const orderDate = new Date(order.timestamp);
    const dateKey = orderDate.toISOString().split("T")[0];
    if (dailyMap.has(dateKey)) {
      const day = dailyMap.get(dateKey);
      dailyMap.set(dateKey, {
        ...day,
        sales: day.sales + order.total,
        orders: day.orders + 1,
      });
    }
  });
  return Array.from(dailyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

export function aggregatePayments(orders) {
  const paymentMap = new Map();
  orders.forEach((order) => {
    const current = paymentMap.get(order.paymentMethod) || {
      method: order.paymentMethod,
      amount: 0,
      count: 0,
    };
    paymentMap.set(order.paymentMethod, {
      ...current,
      amount: current.amount + order.total,
      count: current.count + 1,
    });
  });
  return Array.from(paymentMap.values());
}
