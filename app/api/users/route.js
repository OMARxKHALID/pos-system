import dbConnect from "@/lib/db-connect";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import {
  requireAdmin,
  apiError,
  apiSuccess,
  validateRequiredFields,
  extractId,
} from "@/lib/api-middleware";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}, "-password");
    return apiSuccess(users);
  } catch (error) {
    return apiError(error.message);
  }
}

export async function POST(req) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();
    const data = await req.json();

    const validationError = validateRequiredFields(data, [
      "name",
      "email",
      "password",
    ]);
    if (validationError) return validationError;

    data.password = await bcrypt.hash(data.password, 10);
    const user = await User.create(data);

    return apiSuccess({ ...user.toObject(), password: undefined }, 201);
  } catch (error) {
    return apiError(error.message);
  }
}

export async function PUT(req) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();
    const id = extractId(req);
    if (id instanceof Response) return id;

    const data = await req.json();
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, data, {
      new: true,
      select: "-password",
    });

    if (!updated) {
      return apiError("User not found", 404);
    }

    return apiSuccess(updated);
  } catch (error) {
    return apiError(error.message);
  }
}

export async function DELETE(req) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();
    const id = extractId(req);
    if (id instanceof Response) return id;

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return apiError("User not found", 404);
    }

    return apiSuccess({ success: true });
  } catch (error) {
    return apiError(error.message);
  }
}
