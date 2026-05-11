import * as categoryService from "../services/categoryService.js";

const ERROR_MAP = {
  MISSING_FIELDS:    { status: 400, message: "Name and type are required" },
  NO_UPDATE_DATA:    { status: 400, message: "No fields provided to update" },
  TRANSFER_REQUIRED: { status: 400, message: "A transfer category is required to move existing transactions." },
  CATEGORY_NOT_FOUND:{ status: 404, message: "Category not found or not authorized" },
  TARGET_NOT_FOUND:  { status: 404, message: "Target category not found or not authorized" },
  TYPE_MISMATCH:     { status: 400, message: "Cannot transfer transactions between different category types" },
};

const handleError = (res, err, context = {}) => {
  const known = ERROR_MAP[err.message];
  if (known) return res.status(known.status).json({ message: known.message });

  if (err.code === 11000) {
    const msg = context.isUpdate
      ? "A category with this name already exists for the selected type."
      : `Category '${context.name}' already exists as an ${context.type}.`;
    return res.status(400).json({ message: msg });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
};

export const addCategory = async (req, res) => {
  try {
    const category = await categoryService.addCategory(req.user._id, req.body);
    return res.status(201).json({ message: "Category created successfully", category });
  } catch (err) {
    return handleError(res, err, { name: req.body.name, type: req.body.type });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories(req.user._id);
    return res.status(200).json({ message: "Categories fetched successfully", categories });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.user._id, req.params.id);
    return res.status(200).json({ category });
  } catch (err) {
    return handleError(res, err);
  }
};

export const checkCategoryExists = async (req, res) => {
  try {
    const result = await categoryService.checkCategoryExists(req.user._id, req.query);
    return res.status(200).json(result);
  } catch (err) {
    return handleError(res, err);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.user._id, req.params.id, req.body);
    return res.status(200).json({ message: "Category updated successfully", category });
  } catch (err) {
    return handleError(res, err, { isUpdate: true });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.user._id, req.params.id, req.body.transferToId);
    return res.status(200).json({ message: "Category deleted and transactions reassigned successfully" });
  } catch (err) {
    return handleError(res, err);
  }
};