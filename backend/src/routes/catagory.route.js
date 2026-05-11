import express from "express";

import {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  checkCategoryExists
} from "../controllers/category.controller.js";

import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create category
router.post("/", protectedRoute, addCategory);

// Update category
router.put("/:id", protectedRoute, updateCategory);

// Delete category
// TODO: If user need to delete a category that has transactions, we should either:
// 1. Prevent deletion and ask user to reassign transactions to another category first
// 2. Allow deletion but set category of those transactions to null or "Uncategorized"
router.delete("/:id", protectedRoute, deleteCategory);

// Check if category exists
router.get("/check-exists", protectedRoute, checkCategoryExists);

// Get all categories for the authenticated user
router.get("/", protectedRoute, getCategories);

// Get category by ID (optional, can be used for editing)
router.get("/:id", protectedRoute, getCategoryById);

export default router;