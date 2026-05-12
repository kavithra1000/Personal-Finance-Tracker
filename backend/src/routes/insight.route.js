import express from "express";
import {
  getFinancialSummary,
  getExpenseDistribution,
  getMonthlyTrend,
  getBudgetVsActual,
} from "../controllers/insight.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { exportReport } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/summary", protectedRoute, getFinancialSummary);
router.get("/expense-distribution", protectedRoute, getExpenseDistribution);
router.get("/monthly-trend", protectedRoute, getMonthlyTrend);
router.get("/budget-vs-actual", protectedRoute, getBudgetVsActual);
router.get("/reports", protectedRoute, exportReport);

export default router;
