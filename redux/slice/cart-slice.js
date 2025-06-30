import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { item, quantity = 1 } = action.payload;
      const existingItem = state.orderItems.find(
        (orderItem) => orderItem.id === item.id
      );

      if (existingItem) {
        existingItem.quantity += quantity; // add the passed quantity
        // Optionally update notes if provided
        if (item.notes) {
          existingItem.notes = item.notes;
        }
      } else {
        state.orderItems.push({ ...item, quantity });
      }
    },

    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.orderItems.find((item) => item.id === id);

      if (item) {
        if (quantity <= 0) {
          state.orderItems = state.orderItems.filter((item) => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },

    removeFromCart(state, action) {
      state.orderItems = state.orderItems.filter(
        (item) => item.id !== action.payload
      );
    },

    clearCart(state) {
      state.orderItems = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
