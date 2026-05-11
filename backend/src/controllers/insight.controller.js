import * as insightService from "../services/insightService.js";

const ERROR_MAP = {
  MISSING_PERIOD: { status: 400, error: "Please provide periodMonth and periodYear" },
};

const handleError = (res, err) => {
  const known = ERROR_MAP[err.message];
  if (known) return res.status(known.status).json({ success: false, error: known.error });

  console.error(err);
  return res.status(500).json({ success: false, error: "Server Error" });
};

// @desc    Get financial summary (total income, total expenses, balance)
// @route   GET /api/insights/summary
// @access  Private
export const getFinancialSummary = async (req, res) => {
  try {
    const data = await insightService.getFinancialSummary(req.user._id, req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return handleError(res, err);
  }
};

// @desc    Get expense distribution by category
// @route   GET /api/insights/expense-distribution
// @access  Private
export const getExpenseDistribution = async (req, res) => {
  try {
    const data = await insightService.getExpenseDistribution(req.user._id, req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return handleError(res, err);
  }
};

// @desc    Get monthly income vs expenses trend
// @route   GET /api/insights/monthly-trend
// @access  Private
export const getMonthlyTrend = async (req, res) => {
  try {
    const data = await insightService.getMonthlyTrend(req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return handleError(res, err);
  }
};

// @desc    Get budget vs actual spending
// @route   GET /api/insights/budget-vs-actual
// @access  Private
export const getBudgetVsActual = async (req, res) => {
  try {
    const data = await insightService.getBudgetVsActual(req.user._id, req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return handleError(res, err);
  }
};