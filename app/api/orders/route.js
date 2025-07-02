import dbConnect from "@/lib/db-connect";
import Order from "@/models/order";

export async function GET() {
  await dbConnect();
  const orders = await Order.find().populate("items.menuItem");
  return Response.json(orders);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const order = await Order.create(data);
  return Response.json(order, { status: 201 });
}

export async function PUT(req) {
  await dbConnect();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const { status } = await req.json();
  const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(updated);
}
