import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be less than 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0.01, "Price must be greater than 0"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Description must be less than 500 characters"],
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

    icon: {
      type: String,
      default: "",
      maxlength: [10, "Icon must be less than 10 characters"],
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema);
