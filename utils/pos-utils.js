import React from "react";
import PropTypes from "prop-types";

// Utility functions
export const calculateOrderTotals = (orderItems, promoApplied = false) => {
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const discount = promoApplied ? 1.0 : 0;
  const total = subtotal + tax - discount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

export const getCategoryBadgeColor = (category) => {
  const colorMap = {
    Sandwich: "bg-orange-100 text-orange-600",
    Pastry: "bg-teal-100 text-teal-600",
    Donut: "bg-orange-100 text-orange-600",
    Cake: "bg-pink-100 text-pink-600",
    Bread: "bg-blue-100 text-blue-600",
    Tart: "bg-yellow-100 text-yellow-600",
  };

  return colorMap[category] || "bg-gray-100 text-gray-600";
};

// Example React component using the utilities
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

OrderSummary.propTypes = {
  orderItems: PropTypes.arrayOf(
    PropTypes.shape({
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  promoApplied: PropTypes.bool,
};

export { calculateOrderTotals, getCategoryBadgeColor, OrderSummary };
