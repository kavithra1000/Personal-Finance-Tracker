import Budget from "../models/budget.model.js";
import Transaction from "../models/transaction.model.js";

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res) => {
  try {
    const { category, amount, periodMonth, periodYear } = req.body;

    // Check if budget already exists for this category and month
    let existingBudget = await Budget.findOne({
      user: req.user._id,
      category,
      periodMonth,
      periodYear,
    });

    if (existingBudget) {
      return res.status(400).json({ success: false, error: "Budget already exists for this category and period" });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      amount,
      periodMonth,
      periodYear,
    });

    res.status(201).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    } else {
      return res.status(500).json({ success: false, error: "Server Error" });
    }
  }
};

// @desc    Get all budgets with progress
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const { periodMonth, periodYear } = req.query;
    
    let query = { user: req.user._id };
    
    if (periodMonth) query.periodMonth = periodMonth;
    if (periodYear) query.periodYear = periodYear;

    const budgets = await Budget.find(query).populate("category", "name icon color");

    // Calculate progress for each budget
    const budgetWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        // Construct start and end dates for the month
        const startDate = new Date(budget.periodYear, budget.periodMonth - 1, 1);
        const endDate = new Date(budget.periodYear, budget.periodMonth, 0, 23, 59, 59, 999);

        // Find sum of expenses for this category in this month
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
          ...budget._doc,
          spent: totalSpent,
          remaining: budget.amount - totalSpent,
          isExceeded: totalSpent > budget.amount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: budgetWithProgress.length,
      data: budgetWithProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, error: "Budget not found" });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, error: "Not authorized to update this budget" });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, error: "Budget not found" });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, error: "Not authorized to delete this budget" });
    }

    await budget.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
