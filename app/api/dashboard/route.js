import dbConnect from "@/lib/db-connect";
import Order from "@/models/order";
import Menu from "@/models/menu";
import User from "@/models/user";
import mongoose from "mongoose";
import { requireAuth, apiError, apiSuccess } from "@/lib/api-middleware";
import {
  totalProductSales,
  totalCustomerOrders,
  calculateWeeklySalesTrend,
  totalPaymentMethods,
  calculateSalesByCategory,
  calculateHourlySalesTrend,
} from "@/utils/dashboard";

export async function GET(req) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();

    // Test database connection
    console.log("Database connected:", mongoose.connection.readyState === 1);

    // Fetch all orders with populated menu items
    const orders = await Order.find({})
      .populate("items.menuItem")
      .sort({ createdAt: -1 })
      .exec();

    // Debug: Simple check for orders
    console.log("Dashboard: Found", orders.length, "orders");
    if (orders.length > 0) {
      console.log("First order customer name:", orders[0].customerName);
    }

    // Fetch all menu items for category calculations
    const menuItems = await Menu.find({}).exec();

    // Calculate dashboard metrics using utility functions
    const [
      totalSalesData,
      totalProducts,
      totalCustomers,
      topProducts,
      weeklySalesTrend,
      paymentMethods,
      salesByCategory,
      hourlySalesTrend,
    ] = await Promise.all([
      getTotalSalesData(orders),
      Menu.countDocuments(),
      getUniqueCustomerCount(orders),
      totalProductSales(orders),
      calculateWeeklySalesTrend(orders),
      totalPaymentMethods(orders),
      calculateSalesByCategory(orders, menuItems),
      calculateHourlySalesTrend(orders),
    ]);

    const { totalSales, totalOrders, averageOrderValue } = totalSalesData;
    const { todaySales, yesterdaySales } =
      calculateDailySales(weeklySalesTrend);

    console.log(
      "Dashboard results - Customers:",
      totalCustomers,
      "Orders:",
      totalOrders
    );

    return apiSuccess({
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      averageOrderValue,
      revenueData: weeklySalesTrend,
      topProducts: topProducts.slice(0, 5),
      todaySales,
      yesterdaySales,
      salesByCategory,
      paymentMethods,
      hourlySalesTrend,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return apiError(error.message);
  }
}

async function getTotalSalesData(orders) {
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return { totalSales, totalOrders, averageOrderValue };
}

function getUniqueCustomerCount(orders) {
  // Count unique customers from orders
  const uniqueCustomers = new Set();

  orders.forEach((order) => {
    const customerName = order.customerName || "Guest";
    uniqueCustomers.add(customerName.trim());
  });

  console.log(
    "Customer counting - Found",
    uniqueCustomers.size,
    "unique customers:",
    Array.from(uniqueCustomers)
  );

  return uniqueCustomers.size;
}

function calculateDailySales(weeklySalesTrend) {
  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split("T")[0];

  const todaySales =
    weeklySalesTrend.find((d) => d.date === todayKey)?.totalSales || 0;
  const yesterdaySales =
    weeklySalesTrend.find((d) => d.date === yesterdayKey)?.totalSales || 0;

  return { todaySales, yesterdaySales };
}
