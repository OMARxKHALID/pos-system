import dbConnect from "@/lib/db-connect";
import Category from "@/models/category";
import Menu from "@/models/menu";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const categories = await Category.find({}).populate("items");
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();
    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const category = await Category.create(data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const data = await req.json();
    const updated = await Category.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    // Remove category reference from menu items
    await Menu.updateMany({ category: id }, { $unset: { category: "" } });
    const deleted = await Category.findByIdAndDelete(id);
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
