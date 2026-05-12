import Transaction from "../models/transaction.model.js";
import Budget from "../models/budget.model.js";

// ── Helper ────────────────────────────────────────────────────────────────────

const getMonthDateRange = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate   = new Date(year, month, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ── Financial summary ─────────────────────────────────────────────────────────

export const getFinancialSummary = async (userId, { startDate, endDate } = {}) => {
  const matchQuery = { user: userId };

  if (startDate || endDate) {
    matchQuery.date = {};
    if (startDate) matchQuery.date.$gte = new Date(startDate);
    if (endDate)   matchQuery.date.$lte = new Date(endDate);
  }

  const summary = await Transaction.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
        },
      },
    },
  ]);

  if (summary.length === 0) {
    return { totalIncome: 0, totalExpense: 0, balance: 0 };
  }

  const { totalIncome, totalExpense } = summary[0];
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

// ── Expense distribution by category ─────────────────────────────────────────

export const getExpenseDistribution = async (userId, { startDate, endDate } = {}) => {
  const matchQuery = { user: userId, type: "expense" };

  if (startDate || endDate) {
    matchQuery.date = {};
    if (startDate) matchQuery.date.$gte = new Date(startDate);
    if (endDate)   matchQuery.date.$lte = new Date(endDate);
  }

  const distribution = await Transaction.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id:         "$category",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from:         "categories",
        localField:   "_id",
        foreignField: "_id",
        as:           "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" },
    {
      $project: {
        _id:      0,
        category: "$categoryDetails.name",
        color:    "$categoryDetails.color",
        amount:   "$totalAmount",
      },
    },
    { $sort: { amount: -1 } },
  ]);

  return distribution;
};

// ── Monthly income vs expense trend ──────────────────────────────────────────

export const getMonthlyTrend = async (userId) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const trend = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year:  { $year: "$date" },
          month: { $month: "$date" },
        },
        income: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
        },
        expense: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return trend.map((item) => ({
    month:   `${MONTH_NAMES[item._id.month - 1]} ${item._id.year}`,
    income:  item.income,
    expense: item.expense,
  }));
};

// ── Budget vs actual spending ─────────────────────────────────────────────────

export const getBudgetVsActual = async (userId, { periodMonth, periodYear }) => {
  if (!periodMonth || !periodYear) {
    throw new Error("MISSING_PERIOD");
  }

  const budgets = await Budget.find({
    user:        userId,
    periodMonth: parseInt(periodMonth),
    periodYear:  parseInt(periodYear),
  }).populate("category", "name color");

  const { startDate, endDate } = getMonthDateRange(periodYear, periodMonth);

  const budgetVsActual = await Promise.all(
    budgets.map(async (budget) => {
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
        category:     budget.category.name,
        color:        budget.category.color,
        budgetAmount: budget.amount,
        actualSpent:  totalSpent,
      };
    })
  );

  return budgetVsActual;
};