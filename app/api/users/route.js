import dbConnect from "@/lib/db-connect";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import {
  requireAdmin,
  requireUserManagement,
  apiError,
  apiSuccess,
  validateRequiredFields,
  extractId,
} from "@/lib/api-middleware";
import {
  validateEmail,
  validateName,
  validateRequired,
} from "@/utils/validation";

export async function GET(req) {
  try {
    // Allow staff with users permission to view users
    const authResult = await requireUserManagement(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();
    const users = await User.find({}, "-password");
    return apiSuccess(users);
  } catch (error) {
    return apiError(error.message);
  }
}

export async function POST(req) {
  try {
    // Only admin can create new users
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

    // Additional validation using utility functions
    if (!validateRequired(data.name)) {
      return apiError("Name is required", 400);
    }

    if (!validateName(data.name)) {
      return apiError("Name can only contain letters and spaces", 400);
    }

    if (data.name.length > 50) {
      return apiError(`Name must be less than 50 characters`, 400);
    }

    if (!validateEmail(data.email)) {
      return apiError("Please enter a valid email address", 400);
    }

    if (data.password.length < 6) {
      return apiError(`Password must be at least 6 characters`, 400);
    }

    if (data.password.length > 100) {
      return apiError(`Password must be less than 100 characters`, 400);
    }

    // Set default permissions based on role if not provided
    if (!data.permissions) {
      data.permissions =
        data.role === "admin"
          ? ["dashboard", "menu", "category", "orders", "users", "settings"]
          : ["dashboard", "menu", "category", "orders"];
    }

    data.password = await bcrypt.hash(data.password, 10);
    const user = await User.create(data);

    return apiSuccess({ ...user.toObject(), password: undefined }, 201);
  } catch (error) {
    return apiError(error.message);
  }
}

export async function PUT(req) {
  try {
    // Allow staff with users permission to update users
    const authResult = await requireUserManagement(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();
    const id = extractId(req);
    if (id instanceof Response) return id;

    const data = await req.json();

    // Additional validation for updates
    if (data.name) {
      if (!validateName(data.name)) {
        return apiError("Name can only contain letters and spaces", 400);
      }

      if (data.name.length > 50) {
        return apiError(`Name must be less than 50 characters`, 400);
      }
    }

    if (data.email && !validateEmail(data.email)) {
      return apiError("Please enter a valid email address", 400);
    }

    if (data.password) {
      if (data.password.length < 6) {
        return apiError(`Password must be at least 6 characters`, 400);
      }

      if (data.password.length > 100) {
        return apiError(`Password must be less than 100 characters`, 400);
      }

      data.password = await bcrypt.hash(data.password, 10);
    }

    // Update permissions if role is being changed
    if (data.role && !data.permissions) {
      data.permissions =
        data.role === "admin"
          ? ["dashboard", "menu", "category", "orders", "users", "settings"]
          : ["dashboard", "menu", "category", "orders"];
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
    // Only admin can delete users
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
