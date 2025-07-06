// Pure calculation functions - no side effects

export function calculateOrderTotals(
  orderItems,
  cartDiscountPercentage = 0,
  taxRate = 0.1
) {
  const subtotal = calculateSubtotalBeforeDiscounts(orderItems);
  const itemDiscountsTotal = calculateTotalItemDiscounts(orderItems);
  const subtotalAfterItemDiscounts = subtotal - itemDiscountsTotal;

  const cartDiscountAmount =
    (cartDiscountPercentage / 100) * subtotalAfterItemDiscounts;
  const subtotalAfterAllDiscounts =
    subtotalAfterItemDiscounts - cartDiscountAmount;

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

export function calculateAverageOrderValue(orders) {
  if (!orders || orders.length === 0) return 0;
  const total = orders.reduce((sum, order) => sum + order.total, 0);
  return total / orders.length;
}

export function calculateTotalRevenue(orders) {
  if (!orders || orders.length === 0) return 0;
  return orders.reduce((sum, order) => sum + order.total, 0);
}

export function calculateOrderCount(orders) {
  return orders ? orders.length : 0;
}
