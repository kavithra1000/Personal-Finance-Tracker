import express from "express";
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectedRoute);

router.route("/").get(getBudgets).post(createBudget);
router.route("/:id").put(updateBudget).delete(deleteBudget);

export default router;
