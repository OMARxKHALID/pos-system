// Zustand store for sales/order dashboard
// State at top, actions grouped, SSR-safe persist, named export

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  totalProductSales,
  totalCustomerOrders,
  calculateWeeklySalesTrend,
  totalPaymentMethods,
} from "@/utils/dashboard";
import { createPersistConfig } from "@/lib/zustand-storage";

const useSalesStore = create(
  persist(
    (set, get) => ({
      // State
      orders: [],
      // Actions
      setOrders: (orders) => set({ orders }),
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === id ? { ...order, status } : order
          ),
        })),
      // Selectors
      getOrderById: (id) => get().orders.find((order) => order._id === id),
      getOrdersByDateRange: (startDate, endDate) =>
        get().orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startDate && orderDate <= endDate;
        }),
      getDashboard: () => {
        const completedOrders = get().orders.filter(
          (order) => order.status === "paid"
        );
        const totalSales = completedOrders.reduce(
          (sum, order) => sum + order.total,
          0
        );
        const totalOrders = completedOrders.length;
        const averageOrderValue =
          totalOrders > 0 ? totalSales / totalOrders : 0;
        return {
          totalSales,
          totalOrders,
          averageOrderValue,
          topProducts: totalProductSales(completedOrders),
          topCustomers: totalCustomerOrders(completedOrders),
          salesByDay: calculateWeeklySalesTrend(completedOrders),
          salesByPaymentMethod: totalPaymentMethods(completedOrders),
        };
      },
    }),
    createPersistConfig("sales-storage")
  )
);

export { useSalesStore };
