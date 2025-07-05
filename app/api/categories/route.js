import dbConnect from "@/lib/db-connect";
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
    const categories = await Category.find({}).populate("items");
    return apiSuccess(categories);
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

    const validationError = validateRequiredFields(data, ["name"]);
    if (validationError) return validationError;

    const category = await Category.create(data);
    return apiSuccess(category, 201);
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
    const updated = await Category.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      return apiError("Category not found", 404);
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

    // Check if category has items
    const category = await Category.findById(id).populate("items");
    if (!category) {
      return apiError("Category not found", 404);
    }

    if (category.items && category.items.length > 0) {
      return apiError("Cannot delete category with existing items", 400);
    }

    const deleted = await Category.findByIdAndDelete(id);
    return apiSuccess({ success: true });
  } catch (error) {
    return apiError(error.message);
  }
}
