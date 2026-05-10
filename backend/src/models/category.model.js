import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    color: {
      type: String,
      default: "#4CAF50",
    },
  },
  {
    timestamps: true,
  }
);

// unique per user + name + type
categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;