import Category from "../models/category.model.js";
import Budget from "../models/budget.model.js";
import Transaction from "../models/transaction.model.js";

// ── Add category ──────────────────────────────────────────────────────────────

export const addCategory = async (userId, { name, type, color }) => {
  if (!name || !type) {
    throw new Error("MISSING_FIELDS");
  }

  const category = await Category.create({ user: userId, name, type, color });

  return category;
};

// ── Get all categories ────────────────────────────────────────────────────────

export const getCategories = async (userId) => {
  const categories = await Category.find({ user: userId }).sort({ createdAt: -1 });
  return categories;
};

// ── Get category by ID ────────────────────────────────────────────────────────

export const getCategoryById = async (userId, categoryId) => {
  const category = await Category.findOne({ _id: categoryId, user: userId });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  return category;
};

// ── Check if category exists ──────────────────────────────────────────────────

export const checkCategoryExists = async (userId, { name, type }) => {
  if (!name || !type) {
    throw new Error("MISSING_FIELDS");
  }

  const category = await Category.findOne({
    user: userId,
    name: name.toLowerCase(),
    type,
  });

  return {
    exists:     !!category,
    categoryId: category?._id,
  };
};

// ── Update category ───────────────────────────────────────────────────────────

export const updateCategory = async (userId, categoryId, { name, type, color }) => {
  const updateData = {};
  if (name)  updateData.name  = name;
  if (type)  updateData.type  = type;
  if (color) updateData.color = color;

  if (Object.keys(updateData).length === 0) {
    throw new Error("NO_UPDATE_DATA");
  }

  const updatedCategory = await Category.findOneAndUpdate(
    { _id: categoryId, user: userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedCategory) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  // If type changed to income, budgets no longer make sense — clean them up
  if (type === "income") {
    await Budget.deleteMany({ category: categoryId, user: userId });
  }

  return updatedCategory;
};

// ── Delete category ───────────────────────────────────────────────────────────

export const deleteCategory = async (userId, categoryId, transferToId) => {
  if (!transferToId) {
    throw new Error("TRANSFER_REQUIRED");
  }

  // Verify the category to delete belongs to the user
  const categoryToDelete = await Category.findOne({ _id: categoryId, user: userId });
  if (!categoryToDelete) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  // Verify the target category belongs to the user
  const targetCategory = await Category.findOne({ _id: transferToId, user: userId });
  if (!targetCategory) {
    throw new Error("TARGET_NOT_FOUND");
  }

  // Types must match to safely transfer transactions
  if (targetCategory.type !== categoryToDelete.type) {
    throw new Error("TYPE_MISMATCH");
  }

  // Migrate transactions to the target category
  await Transaction.updateMany(
    { category: categoryId, user: userId },
    { category: transferToId }
  );

  // Delete associated budgets
  await Budget.deleteMany({ category: categoryId, user: userId });

  // Delete the category
  await Category.findByIdAndDelete(categoryId);
};