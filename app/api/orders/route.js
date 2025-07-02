import dbConnect from "@/lib/db-connect";
import Order from "@/models/order";

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find().populate("items.menuItem");
    return Response.json(orders);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (
      !Array.isArray(data.items) ||
      data.items.length === 0 ||
      typeof data.total !== "number" ||
      !data.status
    ) {
      return Response.json(
        {
          error:
            "Missing required fields: items (array), total (number), status",
        },
        { status: 400 }
      );
    }
    const order = await Order.create(data);
    return Response.json(order, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
    const { status } = await req.json();
    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
