import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [1, "Name is required"],
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    icon: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          return v === "" || /^https?:\/\/.+/.test(v);
        },
        message: "Image must be a valid URL",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
