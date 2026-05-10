import express from "express";
import {
  getFinancialSummary,
  getExpenseDistribution,
  getMonthlyTrend,
  getBudgetVsActual,
} from "../controllers/insight.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectedRoute);

router.get("/summary", getFinancialSummary);
router.get("/expense-distribution", getExpenseDistribution);
router.get("/monthly-trend", getMonthlyTrend);
router.get("/budget-vs-actual", getBudgetVsActual);

export default router;
