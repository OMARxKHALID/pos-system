import dbConnect from "@/lib/db-connect";
import Menu from "@/models/menu";
import Category from "@/models/category";
import {
  requireAuth,
  apiError,
  apiSuccess,
  validateRequiredFields,
  extractId,
} from "@/lib/api-middleware";

export async function GET() {
  try {
    await dbConnect();
    const menuItems = await Menu.find({}).populate("category");
    return apiSuccess(menuItems);
  } catch (error) {
    return apiError(error.message);
  }
}

export async function POST(req) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();
    const data = await req.json();

    const validationError = validateRequiredFields(data, [
      "name",
      "price",
      "category",
    ]);
    if (validationError) return validationError;

    // Validate that category exists
    const category = await Category.findById(data.category);
    if (!category) {
      return apiError("Category not found", 400);
    }

    // Create menu item
    const menuItem = await Menu.create(data);

    // Add menu item to category's items array
    await Category.findByIdAndUpdate(data.category, {
      $push: { items: menuItem._id },
    });

    return apiSuccess(menuItem, 201);
  } catch (error) {
    return apiError(error.message);
  }
}

export async function PUT(req) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();
    const id = extractId(req);
    if (id instanceof Response) return id;

    const data = await req.json();

    // If category is being updated, validate it exists
    if (data.category) {
      const category = await Category.findById(data.category);
      if (!category) {
        return apiError("Category not found", 400);
      }
    }

    const updated = await Menu.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      return apiError("Menu item not found", 404);
    }

    return apiSuccess(updated);
  } catch (error) {
    return apiError(error.message);
  }
}

export async function DELETE(req) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();
    const id = extractId(req);
    if (id instanceof Response) return id;

    const deleted = await Menu.findByIdAndUpdate(
      id,
      { available: false },
      { new: true }
    );

    if (!deleted) {
      return apiError("Menu item not found", 404);
    }

    return apiSuccess({ success: true });
  } catch (error) {
    return apiError(error.message);
  }
}
