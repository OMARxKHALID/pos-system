import dbConnect from "@/lib/db-connect";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Placeholder admin check (replace with real session/auth check)
async function isAdmin(req) {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}, "-password");
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!(await isAdmin(req)))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    await dbConnect();
    const data = await req.json();
    if (!data.password)
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    data.password = await bcrypt.hash(data.password, 10);
    const user = await User.create(data);
    return NextResponse.json(
      { ...user.toObject(), password: undefined },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    if (!(await isAdmin(req)))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const data = await req.json();
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    const updated = await User.findByIdAndUpdate(id, data, {
      new: true,
      select: "-password",
    });
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!(await isAdmin(req)))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
