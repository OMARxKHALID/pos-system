import dbConnect from "@/lib/db-connect";
import Order from "@/models/order";
import Menu from "@/models/menu";
import { requireAuth, apiError, apiSuccess } from "@/lib/api-middleware";

export async function GET(req) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof Response) return authResult;

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
    ]);

    // Create a map of existing sales data
    const salesMap = new Map();
    salesByDayAgg.forEach((d) => {
      salesMap.set(d._id, {
        date: d._id,
        sales: d.sales,
        orders: d.orders,
      });
    });

    // Generate all 7 days with default values for missing days
    const today = new Date();
    const salesByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      salesByDay.push(
        salesMap.get(dateKey) || {
          date: dateKey,
          sales: 0,
          orders: 0,
        }
      );
    }

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
        $lookup: {
          from: "categories",
          localField: "menuInfo.category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.name",
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

    return apiSuccess({
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
    return apiError(error.message);
  }
}
