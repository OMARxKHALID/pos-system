import { z } from "zod";

// Base schemas for reusability
const baseNameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .trim();

const baseEmailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required")
  .trim();

const basePasswordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

const basePriceSchema = z
  .union([z.string(), z.number()])
  .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a non-negative number",
  })
  .transform((val) => Number(val));

const baseUrlSchema = z
  .string()
  .url("Please enter a valid URL")
  .optional()
  .or(z.literal(""));

// User schemas
export const userSchema = z.object({
  name: baseNameSchema.max(50, "Name must be less than 50 characters").regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: baseEmailSchema,
  password: basePasswordSchema,
  role: z.enum(["admin", "staff"], {
    required_error: "Please select a role",
  }),
});

export const userEditSchema = userSchema.extend({
  password: basePasswordSchema.optional(),
});

// Menu schemas - consolidated and aligned with Mongoose
export const menuSchema = z.object({
  name: baseNameSchema,
  price: basePriceSchema.refine((val) => val > 0, {
    message: "Price must be greater than 0",
  }),
  category: z.string().min(1, "Category is required"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .default(""),
  image: baseUrlSchema.default(""),
  icon: z
    .string()
    .max(10, "Icon must be less than 10 characters")
    .optional()
    .default(""),
  available: z.boolean().default(true),
});

// Remove duplicate menuItemSchema - use menuSchema instead
export const menuEditSchema = menuSchema;

// Category schemas
export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  icon: z.string().optional().default(""),
  image: baseUrlSchema.default(""),
});

// Order schemas - aligned with Mongoose OrderSchema
export const orderItemSchema = z.object({
  menuItem: z.string().min(1, "Menu item is required"),
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: basePriceSchema,
  discount: z.number().min(0, "Discount cannot be negative").default(0),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  customerName: z.string().trim().default("Guest"),
  orderNumber: z.string().min(1, "Order number is required"),
  servedBy: z.string().optional(),
  subtotal: basePriceSchema,
  tax: basePriceSchema,
  discount: z.number().min(0, "Discount cannot be negative").default(0),
  total: basePriceSchema,
  paymentMethod: z.enum(["cash", "card", "wallet"], {
    required_error: "Please select a payment method",
  }),
  status: z.enum(["pending", "paid", "cancelled"]).default("pending"),
});

// Login schema
export const loginSchema = z.object({
  email: baseEmailSchema,
  password: z.string().min(1, "Password is required"),
});

// Filter schemas
export const orderFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "pending", "paid", "cancelled"]).default("all"),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.enum(["all", "admin", "staff"]).default("all"),
});

export const menuFilterSchema = z.object({
  search: z.string().optional(),
  category: z
    .enum(["all", "appetizer", "main", "dessert", "beverage"])
    .default("all"),
});

// Export the old menuItemSchema for backward compatibility
export const menuItemSchema = menuSchema;
