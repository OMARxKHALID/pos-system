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
  orderNumber: "#001", // start from 1
  orderNumberCounter: 1, // new: numeric counter for unique order numbers
  selectedTable: "Table 05",
  selectedOrderType: "Dine In",
  promoApplied: true,
  sidebarOpen: false,
  cartOpen: true,
  searchQuery: "",
  orderHistory: [],
  orderTracking: [],
  trackOrderOpen: true,
  editCustomerNameModalOpen: false, // new: modal state
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
    setCustomerName(state, action) {
      state.customerName = action.payload;
    },
    openEditCustomerNameModal(state) {
      state.editCustomerNameModalOpen = true;
    },
    closeEditCustomerNameModal(state) {
      state.editCustomerNameModalOpen = false;
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
    toggleTrackOrder(state) {
      state.trackOrderOpen = !state.trackOrderOpen;
    },
    placeOrder(state) {
      if (!state.orderItems.length) return;
      // Generate new order number
      const newOrderNumberCounter = state.orderNumberCounter + 1;
      const newOrderNumber = `#${String(newOrderNumberCounter).padStart(
        3,
        "0"
      )}`;
      // Prepare order data
      const now = new Date();
      const date = now.toLocaleDateString("en-GB").replace(/\//g, "/");
      const time = now
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        .replace(/ /g, "");
      const totalPayment = state.orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const tax = totalPayment * 0.1;
      const discount = state.promoApplied ? totalPayment * 0.1 : 0;
      const finalTotal = totalPayment + tax - discount;
      // Add to orderHistory
      state.orderHistory.push({
        id: String(newOrderNumberCounter).padStart(3, "0"),
        orderNumber: newOrderNumber,
        date,
        time,
        customerName: state.customerName,
        table: state.selectedTable,
        type: state.selectedOrderType,
        orderStatus: "Done",
        totalPayment: finalTotal,
        paymentStatus: "Paid",
        items: state.orderItems.map((item) => ({
          ...item,
        })),
      });
      // Add to orderTracking
      state.orderTracking.push({
        customerName: state.customerName,
        orderNumber: newOrderNumber,
        table: state.selectedTable,
        type: state.selectedOrderType,
        time,
        status: "On Kitchen Hand",
        statusColor: "bg-orange-50 text-orange-400",
        items: state.orderItems.map((item) => ({
          ...item,
        })),
        orderStatus: "Active",
      });
      // Reset cart
      state.orderItems = [];
      state.orderNumberCounter = newOrderNumberCounter;
      state.orderNumber = newOrderNumber;
      state.promoApplied = false;
    },
    closeTrackingOrder(state, action) {
      // action.payload: orderNumber
      const idx = state.orderTracking.findIndex(
        (o) => o.orderNumber === action.payload
      );
      if (idx !== -1) {
        state.orderTracking[idx].orderStatus = "Closed";
        state.orderTracking[idx].status = "Closed";
        state.orderTracking[idx].statusColor = "bg-gray-100 text-gray-400";
      }
    },
    clearOrderHistory(state) {
      state.orderHistory = [];
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
  setCustomerName,
  togglePromo,
  toggleSidebar,
  toggleCart,
  toggleTrackOrder,
  placeOrder,
  closeTrackingOrder,
  clearOrderHistory,
  openEditCustomerNameModal,
  closeEditCustomerNameModal,
} = posSlice.actions;

export default posSlice.reducer;
