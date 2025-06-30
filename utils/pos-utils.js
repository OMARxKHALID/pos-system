import React from "react";
import PropTypes from "prop-types";

// Utility functions
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

export const getCategoryBadgeColor = (category) => {
  const colorMap = {
    Sandwich: "bg-orange-50 text-orange-400",
    Pastry: "bg-emerald-50 text-emerald-500",
    Donut: "bg-pink-50 text-pink-400",
    Cake: "bg-purple-50 text-purple-400",
    Bread: "bg-amber-50 text-amber-500",
    Tart: "bg-yellow-50 text-yellow-400",
  };

  return colorMap[category] || "bg-gray-50 text-gray-500";
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
