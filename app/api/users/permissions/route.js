import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db-connect";
import User from "@/models/user";
import {
  requireUserManagement,
  apiError,
  apiSuccess,
} from "@/lib/api-middleware";
import { permissionSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return apiError("Not authenticated", 401);
    }

    await dbConnect();

    const users = await User.find({}, "name email role permissions active");

    return apiSuccess({
      users: users.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
        active: user.active,
      })),
    });
  } catch (error) {
    return apiError(error.message);
  }
}

export async function PUT(req) {
  try {
    const authResult = await requireUserManagement(req);
    if (authResult instanceof Response) return authResult;

    await dbConnect();
    const data = await req.json();

    const validationResult = permissionSchema.safeParse(data);
    if (!validationResult.success) {
      return apiError("Invalid request data", 400);
    }

    const { userId, permissions } = data;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { permissions },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return apiError("User not found", 404);
    }

    return apiSuccess(updatedUser);
  } catch (error) {
    return apiError(error.message);
  }
}
