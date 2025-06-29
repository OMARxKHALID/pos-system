"use client";

import { useSelector, useDispatch } from "react-redux";
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
  togglePromo,
  toggleSidebar,
  toggleCart,
  placeOrder,
} from "@/redux/pos-slice";

export const usePOSStore = () => {
  const pos = useSelector((state) => state.pos);
  const dispatch = useDispatch();

  return {
    ...pos,
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
  };
};
