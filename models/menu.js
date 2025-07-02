import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    category: String,
    description: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema);
