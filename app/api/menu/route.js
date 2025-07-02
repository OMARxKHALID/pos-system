import dbConnect from "@/lib/db-connect";
import Menu from "@/models/menu";

export async function GET() {
  await dbConnect();
  const menu = await Menu.find();
  return Response.json(menu);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const menuItem = await Menu.create(data);
  return Response.json(menuItem, { status: 201 });
}

export async function PUT(req) {
  await dbConnect();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const data = await req.json();
  const updated = await Menu.findByIdAndUpdate(id, data, { new: true });
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(req) {
  await dbConnect();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const deleted = await Menu.findByIdAndDelete(id);
  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
