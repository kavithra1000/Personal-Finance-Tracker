import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import Budget from "../models/budget.model.js";
import Transaction from "../models/transaction.model.js";

export const addCategory = async (req, res) => {
    try {
        const { name, type, color } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                message: "Name and type are required",
            });
        }

        const userId = req.user._id;

        const category = await Category.create({
            user: userId,
            name,
            type,
            color,
        });

        res.status(201).json({
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        console.log("Add Category Error:", error.message);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, color } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Category ID is required",
            });
        }

        // Build dynamic update object
        const updateData = {};

        if (name) updateData.name = name;
        if (type) updateData.type = type;
        if (color) updateData.color = color;

        // Prevent empty updates
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No fields provided to update",
            });
        }

        const updatedCategory = await Category.findOneAndUpdate(
            {
                _id: id,
                user: req.user._id, // 🔐 ownership check
            },
            updateData,
            {
                new: true,
                runValidators: true, // important for enum/type validation
            }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                message: "Category not found or not authorized",
            });
        }

        // If the type was changed to "income", delete any associated budgets
        if (type === "income") {
            try {
                await Budget.deleteMany({ category: id, user: req.user._id });
            } catch (budgetError) {
                console.log("Budget cleanup error:", budgetError.message);
                // We still proceed as the category update was successful
            }
        }

        res.status(200).json({
            message: "Category updated successfully",
            category: updatedCategory,
        });
    } catch (error) {
        console.log("Update Category Error:", error.message);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { transferToId } = req.body;

        if (!transferToId) {
            return res.status(400).json({
                message: "A transfer category is required to move existing transactions.",
            });
        }

        // 1. Verify the category being deleted exists and belongs to the user
        const categoryToDelete = await Category.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!categoryToDelete) {
            return res.status(404).json({
                message: "Category to delete not found or not authorized",
            });
        }

        // 2. Verify the target category exists, belongs to the user, and matches the type
        const targetCategory = await Category.findOne({
            _id: transferToId,
            user: req.user._id,
        });

        if (!targetCategory) {
            return res.status(404).json({
                message: "Target category not found or not authorized",
            });
        }

        if (targetCategory.type !== categoryToDelete.type) {
            return res.status(400).json({
                message: `Cannot transfer transactions from ${categoryToDelete.type} to ${targetCategory.type}`,
            });
        }

        // 3. Migrate all transactions
        await Transaction.updateMany(
            { category: id, user: req.user._id },
            { category: transferToId }
        );

        // 4. Delete all budgets associated with the old category
        await Budget.deleteMany({
            category: id,
            user: req.user._id,
        });

        // 5. Finally delete the category
        await Category.findByIdAndDelete(id);

        res.status(200).json({
            message: "Category deleted and transactions reassigned successfully",
        });
    } catch (error) {
        console.log("Delete Category Error:", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.log("Get Categories Error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      category,
    });
  } catch (error) {
    console.log("Get Category Error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};