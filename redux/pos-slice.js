import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: "pos",
  selectedCategory: "all",
  orderItems: [
    {
      id: "beef-crowich",
      name: "Beef Crowich",
      category: "Sandwich",
      price: 5.5,
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
    },
    {
      id: "sliced-black-forest",
      name: "Sliced Black Forest",
      category: "Cake",
      price: 5.0,
      image: "/placeholder.svg?height=80&width=80",
      quantity: 2,
    },
    {
      id: "solo-floss-bread",
      name: "Solo Floss Bread",
      category: "Bread",
      price: 4.5,
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
    },
  ],
  selectedItem: null,
  orderType: "open",
  customerName: "Eloise's Order",
  orderNumber: "#005",
  selectedTable: "Table 05",
  selectedOrderType: "Dine In",
  promoApplied: true,
  sidebarOpen: false,
  cartOpen: true,
  searchQuery: "",
};

const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    addToCart(state, action) {
      const { item, quantity = 1 } = action.payload;
      const existingItem = state.orderItems.find(
        (orderItem) => orderItem.id === item.id
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.orderItems.push({ ...item, quantity });
      }
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.orderItems = state.orderItems.filter((item) => item.id !== id);
      } else {
        const item = state.orderItems.find((item) => item.id === id);
        if (item) item.quantity = quantity;
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
    setSelectedItem(state, action) {
      state.selectedItem = action.payload;
    },
    setTable(state, action) {
      state.selectedTable = action.payload;
    },
    setOrderType(state, action) {
      state.selectedOrderType = action.payload;
    },
    togglePromo(state) {
      state.promoApplied = !state.promoApplied;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleCart(state) {
      state.cartOpen = !state.cartOpen;
    },
    placeOrder(state) {
      if (state.orderItems.length === 0) return;
      const currentNum = Number.parseInt(state.orderNumber.slice(1));
      const newOrderNumber = `#${String(currentNum + 1).padStart(3, "0")}`;
      // Optionally: log order
      state.orderItems = [];
      state.orderNumber = newOrderNumber;
      state.promoApplied = false;
    },
  },
});

export const {
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
} = posSlice.actions;

export default posSlice.reducer;
