import Transaction from "../models/transaction.model.js";
import Budget from "../models/budget.model.js";
import mongoose from "mongoose";

// Helper function to get start and end dates of a month
const getMonthDateRange = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

// @desc    Get financial summary (Total income, total expenses, balance)
// @route   GET /api/insights/summary
// @access  Private
export const getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchQuery = { user: req.user._id };

    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
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

    let data = { totalIncome: 0, totalExpense: 0, balance: 0 };
    if (summary.length > 0) {
      data = {
        totalIncome: summary[0].totalIncome,
        totalExpense: summary[0].totalExpense,
        balance: summary[0].totalIncome - summary[0].totalExpense,
      };
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get expense distribution by category
// @route   GET /api/insights/expense-distribution
// @access  Private
export const getExpenseDistribution = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchQuery = { user: req.user._id, type: "expense" };

    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const distribution = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $project: {
          _id: 0,
          category: "$categoryDetails.name",
          color: "$categoryDetails.color",
          amount: "$totalAmount",
        },
      },
      { $sort: { amount: -1 } },
    ]);

    res.status(200).json({ success: true, data: distribution });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get monthly income vs expenses trend
// @route   GET /api/insights/monthly-trend
// @access  Private
export const getMonthlyTrend = async (req, res) => {
  try {
    // Default to last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const trend = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
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

    // Format for easy charting
    const formattedTrend = trend.map((item) => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return {
        month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        income: item.income,
        expense: item.expense,
      };
    });

    res.status(200).json({ success: true, data: formattedTrend });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get budget vs actual spending
// @route   GET /api/insights/budget-vs-actual
// @access  Private
export const getBudgetVsActual = async (req, res) => {
  try {
    const { periodMonth, periodYear } = req.query;

    if (!periodMonth || !periodYear) {
      return res.status(400).json({ success: false, error: "Please provide periodMonth and periodYear" });
    }

    const budgets = await Budget.find({
      user: req.user._id,
      periodMonth: parseInt(periodMonth),
      periodYear: parseInt(periodYear),
    }).populate("category", "name color");

    const { startDate, endDate } = getMonthDateRange(periodYear, periodMonth);

    const budgetVsActual = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await Transaction.aggregate([
          {
            $match: {
              user: req.user._id,
              category: budget.category._id,
              type: "expense",
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: "$amount" },
            },
          },
        ]);

        const totalSpent = expenses.length > 0 ? expenses[0].totalSpent : 0;

        return {
          category: budget.category.name,
          color: budget.category.color,
          budgetAmount: budget.amount,
          actualSpent: totalSpent,
        };
      })
    );

    res.status(200).json({ success: true, data: budgetVsActual });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
