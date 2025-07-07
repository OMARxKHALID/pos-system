import mongoose from "mongoose";
import { validatePermissions } from "../utils/permission-utils.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
      match: [/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [100, "Password must be less than 100 characters"],
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      },
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "staff"],
        message: "Role must be either 'admin' or 'staff'",
      },
      default: "staff",
    },
    active: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      default: function () {
        // Default permissions based on role
        return this.role === "admin"
          ? ["dashboard", "menu", "category", "orders", "users", "settings"]
          : ["dashboard", "menu", "category", "orders"];
      },
      validate: {
        validator: function (permissions) {
          return validatePermissions(permissions);
        },
        message: "Invalid permission provided",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
