import dbConnect from "@/lib/db-connect";
import Order from "@/models/order";
import {
  requireAuth,
  apiError,
  apiSuccess,
  validateRequiredFields,
  extractId,
} from "@/lib/api-middleware";

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.menuItem");
    // Map icon and name from menuItem to each item
    const ordersWithIcons = orders.map((order) => {
      const items = order.items.map((item) => {
        let icon = "";
        let name = item.name;
        if (item.menuItem && typeof item.menuItem === "object") {
          icon = item.menuItem.icon || "";
          name = item.menuItem.name || item.name;
        }
        return {
          ...item.toObject(),
          icon,
          name,
        };
      });
      return {
        ...order.toObject(),
        items,
      };
    });
    return apiSuccess(ordersWithIcons);
  } catch (error) {
    return apiError(error.message);
  }
}

export async function POST(req) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();
    const data = await req.json();

    const validationError = validateRequiredFields(data, [
      "items",
      "total",
      "status",
    ]);
    if (validationError) return validationError;

    if (!Array.isArray(data.items) || data.items.length === 0) {
      return apiError("Items must be a non-empty array", 400);
    }

    if (typeof data.total !== "number") {
      return apiError("Total must be a number", 400);
    }

    const order = await Order.create(data);
    return apiSuccess(order, 201);
  } catch (error) {
    return apiError(error.message);
  }
}

export async function PUT(req) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();
    const id = extractId(req);
    if (id instanceof Response) return id;

    const { status } = await req.json();

    if (!status) {
      return apiError("Status is required", 400);
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return apiError("Order not found", 404);
    }

    return apiSuccess(updated);
  } catch (error) {
    return apiError(error.message);
  }
}
