import dbConnect from "@/lib/db-connect";
import Menu from "@/models/menu";
import Category from "@/models/category";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const menuItems = await Menu.find({}).populate("category");
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (!data.name || typeof data.price !== "number" || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, category" },
        { status: 400 }
      );
    }
    // Create menu item
    const menuItem = await Menu.create(data);
    // Add menu item to category's items array
    await Category.findByIdAndUpdate(data.category, {
      $push: { items: menuItem._id },
    });
    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const data = await req.json();
    if (
      ("price" in data && typeof data.price !== "number") ||
      ("name" in data && !data.name) ||
      ("category" in data && !data.category)
    ) {
      return NextResponse.json(
        { error: "Invalid or missing fields: name, price, category" },
        { status: 400 }
      );
    }
    const updated = await Menu.findByIdAndUpdate(id, data, { new: true });
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const deleted = await Menu.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
