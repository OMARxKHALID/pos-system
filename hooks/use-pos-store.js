"use client";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  setCurrentPage,
  setSelectedCategory,
  setSearchQuery,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setSelectedItem,
  setTable,
  setOrderType,
  setCustomerName,
  togglePromo,
  toggleSidebar,
  toggleCart,
  placeOrder,
  closeTrackingOrder,
  clearOrderHistory,
  toggleTrackOrder,
  openEditCustomerNameModal,
  closeEditCustomerNameModal,
} from "@/redux/pos-slice";

export const usePOSStore = () => {
  const pos = useSelector((state) => {
    const p = state.pos || {};
    return {
      ...p,
      orderTracking: Array.isArray(p.orderTracking) ? p.orderTracking : [],
    };
  }, shallowEqual);
  const dispatch = useDispatch();

  return {
    ...pos,
    orderHistory: pos.orderHistory, // <-- ensure always up-to-date
    setCurrentPage: (page) => dispatch(setCurrentPage(page)),
    setSelectedCategory: (cat) => dispatch(setSelectedCategory(cat)),
    setSearchQuery: (q) => dispatch(setSearchQuery(q)),
    addToCart: (item, quantity = 1) => dispatch(addToCart({ item, quantity })),
    updateQuantity: (id, quantity) =>
      dispatch(updateQuantity({ id, quantity })),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    clearCart: () => dispatch(clearCart()),
    setSelectedItem: (item) => dispatch(setSelectedItem(item)),
    setTable: (table) => dispatch(setTable(table)),
    setOrderType: (type) => dispatch(setOrderType(type)),
    togglePromo: () => dispatch(togglePromo()),
    toggleSidebar: () => dispatch(toggleSidebar()),
    toggleCart: () => dispatch(toggleCart()),
    placeOrder: () => dispatch(placeOrder()),
    closeTrackingOrder: (orderNumber) =>
      dispatch(closeTrackingOrder(orderNumber)),
    clearOrderHistory: () => dispatch(clearOrderHistory()),
    toggleTrackOrder: () => dispatch(toggleTrackOrder()),
    setCustomerName: (name) =>
      dispatch({ type: "pos/setCustomerName", payload: name }),
    openEditCustomerNameModal: () => dispatch(openEditCustomerNameModal()),
    closeEditCustomerNameModal: () => dispatch(closeEditCustomerNameModal()),
  };
};
