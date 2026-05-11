import Budget from "../models/budget.model.js";
import Transaction from "../models/transaction.model.js";

// ── Create budget ─────────────────────────────────────────────────────────────

export const createBudget = async (userId, { category, amount, periodMonth, periodYear }) => {
  const existingBudget = await Budget.findOne({
    user: userId,
    category,
    periodMonth,
    periodYear,
  });

  if (existingBudget) {
    throw new Error("BUDGET_ALREADY_EXISTS");
  }

  const budget = await Budget.create({
    user: userId,
    category,
    amount,
    periodMonth,
    periodYear,
  });

  return budget;
};

// ── Get all budgets with progress ─────────────────────────────────────────────

export const getBudgets = async (userId, { periodMonth, periodYear } = {}) => {
  const query = { user: userId };
  if (periodMonth) query.periodMonth = periodMonth;
  if (periodYear)  query.periodYear  = periodYear;

  const budgets = await Budget.find(query).populate("category", "name icon color");

  const budgetsWithProgress = await Promise.all(
    budgets.map(async (budget) => {
      const startDate = new Date(budget.periodYear, budget.periodMonth - 1, 1);
      const endDate   = new Date(budget.periodYear, budget.periodMonth, 0, 23, 59, 59, 999);

      const expenses = await Transaction.aggregate([
        {
          $match: {
            user:     userId,
            category: budget.category._id,
            type:     "expense",
            date:     { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id:        null,
            totalSpent: { $sum: "$amount" },
          },
        },
      ]);

      const totalSpent = expenses.length > 0 ? expenses[0].totalSpent : 0;

      return {
        ...budget._doc,
        spent:      totalSpent,
        remaining:  budget.amount - totalSpent,
        isExceeded: totalSpent > budget.amount,
      };
    })
  );

  return budgetsWithProgress;
};

// ── Update budget ─────────────────────────────────────────────────────────────

export const updateBudget = async (userId, budgetId, updateData) => {
  const budget = await Budget.findById(budgetId);

  if (!budget) {
    throw new Error("BUDGET_NOT_FOUND");
  }

  if (budget.user.toString() !== userId.toString()) {
    throw new Error("NOT_AUTHORIZED");
  }

  const updated = await Budget.findByIdAndUpdate(budgetId, updateData, {
    new:          true,
    runValidators: true,
  });

  return updated;
};

// ── Delete budget ─────────────────────────────────────────────────────────────

export const deleteBudget = async (userId, budgetId) => {
  const budget = await Budget.findById(budgetId);

  if (!budget) {
    throw new Error("BUDGET_NOT_FOUND");
  }

  if (budget.user.toString() !== userId.toString()) {
    throw new Error("NOT_AUTHORIZED");
  }

  await budget.deleteOne();
};