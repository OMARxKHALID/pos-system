export const calculateOrderTotals = (orderItems, promoApplied = false) => {
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + tax - discount;

  return { subtotal, tax, discount, total };
};

export const OrderSummary = ({ orderItems, promoApplied }) => {
  const totals = calculateOrderTotals(orderItems, promoApplied);

  return (
    <div>
      <div>Subtotal: ${totals.subtotal}</div>
      <div>Tax: ${totals.tax}</div>
      <div>Discount: ${totals.discount}</div>
      <div>Total: ${totals.total}</div>
    </div>
  );
};
