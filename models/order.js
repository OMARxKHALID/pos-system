import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: [true, "Menu item is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
  },
});

const OrderSchema = new mongoose.Schema(
  {
    items: {
      type: [OrderItemSchema],
      required: [true, "At least one item is required"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one item is required",
      },
    },

    customerName: {
      type: String,
      default: "Guest",
      trim: true,
    },

    orderNumber: {
      type: String,
      unique: true,
      required: [true, "Order number is required"],
      index: true,
    },

    servedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },

    tax: {
      type: Number,
      required: [true, "Tax is required"],
      min: [0, "Tax cannot be negative"],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },

    total: {
      type: Number,
      required: [true, "Total is required"],
      min: [0, "Total cannot be negative"],
    },

    paymentMethod: {
      type: String,
      enum: {
        values: ["cash", "card", "wallet"],
        message: "Payment method must be cash, card, or wallet",
      },
      required: [true, "Payment method is required"],
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "paid", "cancelled"],
        message: "Status must be pending, paid, or cancelled",
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
