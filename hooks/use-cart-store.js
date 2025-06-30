"use client";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "@/redux/slice/cart-slice";

export const useCartStore = () => {
  const cart = useSelector(
    (state) => ({
      orderItems: Array.isArray(state.cart?.orderItems)
        ? state.cart.orderItems
        : [],
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  return {
    orderItems: cart.orderItems,
    addToCart: (item, quantity = 1, notes) =>
      dispatch(addToCart({ item: { ...item, notes }, quantity })), // quantity is passed through
    updateQuantity: (id, quantity) =>
      dispatch(updateQuantity({ id, quantity })),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    clearCart: () => dispatch(clearCart()),
  };
};
