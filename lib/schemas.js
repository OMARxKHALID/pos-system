import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  role: z.enum(["admin", "staff"], {
    required_error: "Please select a role",
  }),
});

export const userEditSchema = userSchema.extend({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .optional(),
});

// Menu item form schema
export const menuItemSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  price: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    })
    .transform((val) => Number(val)),
  category: z.string().min(1, "Category is required"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  image: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  icon: z
    .string()
    .max(10, "Icon must be less than 10 characters")
    .optional()
    .or(z.literal("")),
});

// Menu form schema (updated for new form structure)
export const menuSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  price: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    })
    .transform((val) => Number(val)),
  category: z.string().min(1, "Category is required"),
  image: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  available: z.boolean().default(true),
});

export const menuEditSchema = menuSchema;

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

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

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  image: z.string().optional(),
});
