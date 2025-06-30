export const calculateOrderTotals = (orderItems) => {
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const discount = 0; // No promo logic
  const total = subtotal + tax - discount;

  return { subtotal, tax, discount, total };
};
