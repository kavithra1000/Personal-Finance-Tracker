import express from "express";
import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectedRoute); // All transaction routes are protected

router.route("/").get(getTransactions).post(addTransaction);
router.route("/:id").put(updateTransaction).delete(deleteTransaction);

export default router;
