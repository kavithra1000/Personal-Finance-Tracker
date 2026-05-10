import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [50, "Title can not be more than 50 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Please add a positive or negative number"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Please specify type as income or expense"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, "Note can not be more than 200 characters"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
