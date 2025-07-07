import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db-connect";
import Order from "@/models/order";
import Menu from "@/models/menu";
import User from "@/models/user";
import { apiSuccess, apiError } from "@/lib/api-middleware";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return apiError("Not authenticated", 401);
    }

    await dbConnect();

    // Get orders from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo },
    }).sort({ createdAt: -1 });

    // Get all menu items for calculations
    const menuItems = await Menu.find({});
    // Get all users for customer count
    const users = await User.find({});

    // Calculate dashboard statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalProducts = menuItems.length;
    const totalCustomers = users.length;

    // Calculate daily revenue for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentOrders = orders.filter(
      (order) => order.createdAt >= sevenDaysAgo
    );
    const previousOrders = orders.filter(
      (order) =>
        order.createdAt >= fourteenDaysAgo && order.createdAt < sevenDaysAgo
    );

    // Calculate revenue and orders for last 7 days and previous 7 days
    const recentRevenue = recentOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const previousRevenue = previousOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const recentOrderCount = recentOrders.length;
    const previousOrderCount = previousOrders.length;

    // Calculate percentage change
    const revenueChange =
      previousRevenue === 0
        ? 0
        : ((recentRevenue - previousRevenue) / previousRevenue) * 100;
    const ordersChange =
      previousOrderCount === 0
        ? 0
        : ((recentOrderCount - previousOrderCount) / previousOrderCount) * 100;

    // Calculate daily revenue for the last 7 days
    const dailyRevenue = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = recentOrders.filter(
        (order) => order.createdAt >= date && order.createdAt < nextDate
      );

      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);

      dailyRevenue.push({
        date: date.toISOString().split("T")[0],
        revenue: dayRevenue,
        orders: dayOrders.length,
      });
    }

    // Calculate top selling items
    const itemSales = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (itemSales[item.name]) {
          itemSales[item.name] += item.quantity;
        } else {
          itemSales[item.name] = item.quantity;
        }
      });
    });

    // Enrich top selling items with icon, image, and category
    const topSellingItems = Object.entries(itemSales)
      .map(([name, quantity]) => {
        const menuItem = menuItems.find((m) => m.name === name);
        return {
          name,
          quantity,
          icon: menuItem?.icon || "",
          image: menuItem?.image || "",
          category: menuItem?.category?.name || "",
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Calculate customersChange and productsChange
    // Get users and menu items created in the last 14 days
    const fourteenDaysAgoForUsers = new Date();
    fourteenDaysAgoForUsers.setDate(fourteenDaysAgoForUsers.getDate() - 14);
    const usersLast14 = users.filter(
      (user) => user.createdAt >= fourteenDaysAgoForUsers
    );
    const usersLast7 = usersLast14.filter(
      (user) => user.createdAt >= sevenDaysAgo
    );
    const usersPrev7 = usersLast14.filter(
      (user) => user.createdAt < sevenDaysAgo
    );
    const customersChange =
      usersPrev7.length === 0
        ? 0
        : ((usersLast7.length - usersPrev7.length) / usersPrev7.length) * 100;

    const fourteenDaysAgoForProducts = new Date();
    fourteenDaysAgoForProducts.setDate(
      fourteenDaysAgoForProducts.getDate() - 14
    );
    const productsLast14 = menuItems.filter(
      (item) => item.createdAt >= fourteenDaysAgoForProducts
    );
    const productsLast7 = productsLast14.filter(
      (item) => item.createdAt >= sevenDaysAgo
    );
    const productsPrev7 = productsLast14.filter(
      (item) => item.createdAt < sevenDaysAgo
    );
    const productsChange =
      productsPrev7.length === 0
        ? 0
        : ((productsLast7.length - productsPrev7.length) /
            productsPrev7.length) *
          100;

    return apiSuccess({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      dailyRevenue,
      topSellingItems,
      recentOrders: recentOrders.slice(0, 10), // Last 10 orders
      totalCustomers,
      totalProducts,
      revenueChange,
      ordersChange,
      customersChange,
      productsChange,
    });
  } catch (error) {
    return apiError(error.message);
  }
}
