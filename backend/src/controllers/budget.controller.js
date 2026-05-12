import * as budgetService from "../services/budget.service.js";

const ERROR_MAP = {
  BUDGET_ALREADY_EXISTS: { status: 400, error: "Budget already exists for this category and period" },
  BUDGET_NOT_FOUND:      { status: 404, error: "Budget not found" },
  NOT_AUTHORIZED:        { status: 401, error: "Not authorized to perform this action" },
};

const handleError = (res, err) => {
  const known = ERROR_MAP[err.message];
  if (known) return res.status(known.status).json({ success: false, error: known.error });

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ success: false, error: messages });
  }

  console.error(err);
  return res.status(500).json({ success: false, error: "Server Error" });
};

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res) => {
  try {
    const budget = await budgetService.createBudget(req.user._id, req.body);
    return res.status(201).json({ success: true, data: budget });
  } catch (err) {
    return handleError(res, err);
  }
};

// @desc    Get all budgets with progress
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const data = await budgetService.getBudgets(req.user._id, req.query);
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    return handleError(res, err);
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    const budget = await budgetService.updateBudget(req.user._id, req.params.id, req.body);
    return res.status(200).json({ success: true, data: budget });
  } catch (err) {
    return handleError(res, err);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    await budgetService.deleteBudget(req.user._id, req.params.id);
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return handleError(res, err);
  }
};