import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
});

const OrderSchema = new mongoose.Schema(
  {
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },

    customerName: {
      type: String,
      default: "Guest",
      trim: true,
    },

    orderNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    servedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    tax: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "wallet"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
