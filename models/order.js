import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
        quantity: Number,
        price: Number,
      },
    ],
    status: { type: String, default: "pending" },
    total: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
