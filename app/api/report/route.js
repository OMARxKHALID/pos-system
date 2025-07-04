import dbConnect from "@/lib/db-connect";
import Order from "@/models/order";
import Menu from "@/models/menu";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Total sales
    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;
    const totalOrders = totalSalesAgg[0]?.count || 0;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Top products (by quantity sold)
    const topProductsAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.price" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
    ]);
    // Populate product names
    const topProducts = await Promise.all(
      topProductsAgg.map(async (prod) => {
        const menu = await Menu.findById(prod._id);
        return {
          name: menu?.name || "Unknown",
          quantity: prod.quantity,
          revenue: prod.revenue,
          image: menu?.image || "",
          icon: menu?.icon || "",
          category: menu?.category || "",
        };
      })
    );

    // Sales by day (last 7 days)
    const salesByDayAgg = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 },
    ]);
    const salesByDay = salesByDayAgg.map((d) => ({
      date: d._id,
      sales: d.sales,
      orders: d.orders,
    }));

    // Sales by category
    const salesByCategoryAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "menus",
          localField: "items.menuItem",
          foreignField: "_id",
          as: "menuInfo",
        },
      },
      { $unwind: "$menuInfo" },
      {
        $group: {
          _id: "$menuInfo.category",
          sales: { $sum: "$items.price" },
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { sales: -1 } },
    ]);
    const salesByCategory = salesByCategoryAgg.map((c) => ({
      category: c._id,
      sales: c.sales,
      quantity: c.quantity,
    }));

    // Sales by payment method (if available)
    // For now, mock data (implement if payment method is tracked in Order)
    const salesByPaymentMethod = [];

    // Top customers (mock, as customer info is not in Order model)
    const topCustomers = [];

    return NextResponse.json({
      totalSales,
      totalOrders,
      averageOrderValue,
      salesByDay,
      salesByCategory,
      salesByPaymentMethod,
      topProducts,
      topCustomers,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
