import dbConnect from "@/lib/db-connect";
import Menu from "@/models/menu";

export async function GET() {
  try {
    await dbConnect();
    const menu = await Menu.find();
    return Response.json(menu);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (!data.name || typeof data.price !== "number" || !data.category) {
      return Response.json(
        { error: "Missing required fields: name, price, category" },
        { status: 400 }
      );
    }
    const menuItem = await Menu.create(data);
    return Response.json(menuItem, { status: 201 });
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
    const data = await req.json();
    if (
      ("price" in data && typeof data.price !== "number") ||
      ("name" in data && !data.name) ||
      ("category" in data && !data.category)
    ) {
      return Response.json(
        { error: "Invalid or missing fields: name, price, category" },
        { status: 400 }
      );
    }
    const updated = await Menu.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
    const deleted = await Menu.findByIdAndDelete(id);
    if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
