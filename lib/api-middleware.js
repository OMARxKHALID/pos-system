import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Consistent authentication check middleware
export async function requireAuth(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

// Admin-only authentication check
export async function requireAdmin(req) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }
  return session;
}

// Consistent error response helper
export function apiError(message, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

// Consistent success response helper
export function apiSuccess(data, status = 200) {
  return NextResponse.json(data, { status });
}

// Consistent validation helper
export function validateRequiredFields(data, requiredFields) {
  const missing = requiredFields.filter((field) => !data[field]);
  if (missing.length > 0) {
    return apiError(`Missing required fields: ${missing.join(", ")}`, 400);
  }
  return null;
}

// Extract ID from query parameters consistently
export function extractId(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return apiError("Missing id parameter", 400);
  }
  return id;
}
