"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  aggregateProducts,
  aggregateCustomers,
  getDailySales,
  aggregatePayments,
} from "@/utils/pos-utils";

const useSalesStore = create(
  persist(
    (set, get) => ({
      orders: [],
      setOrders: (orders) => set({ orders }),
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        })),

      getOrderById: (id) => get().orders.find((order) => order.id === id),

      getOrdersByDateRange: (startDate, endDate) =>
        get().orders.filter((order) => {
          const orderDate = new Date(order.timestamp);
          return orderDate >= startDate && orderDate <= endDate;
        }),

      getAnalytics: () => {
        const completedOrders = get().orders.filter(
          (order) => order.status === "completed"
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
          topProducts: aggregateProducts(completedOrders),
          topCustomers: aggregateCustomers(completedOrders),
          salesByDay: getDailySales(completedOrders),
          salesByPaymentMethod: aggregatePayments(completedOrders),
        };
      },
    }),
    {
      name: "sales-storage",
      storage: createJSONStorage(() => {
        // Check if we're in a browser environment before accessing localStorage
        if (typeof window !== "undefined") {
          return localStorage;
        }
        // Return a mock storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export { useSalesStore };
