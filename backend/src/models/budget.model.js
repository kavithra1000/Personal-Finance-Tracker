import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Please add a budget amount"],
    },
    periodMonth: {
      type: Number,
      required: [true, "Please specify the month (1-12)"],
      min: 1,
      max: 12,
    },
    periodYear: {
      type: Number,
      required: [true, "Please specify the year"],
    },
  },
  { timestamps: true }
);

// Ensure a user can only have one budget per category per month
budgetSchema.index({ user: 1, category: 1, periodMonth: 1, periodYear: 1 }, { unique: true });

export default mongoose.model("Budget", budgetSchema);
