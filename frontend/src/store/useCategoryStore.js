import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/category");
      set({ categories: res.data.categories, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch categories", isLoading: false });
    }
  },

  addCategory: async (categoryData) => {
    try {
      const { initialBudget, ...data } = categoryData;
      const res = await axiosInstance.post("/category", data);
      const newCategory = res.data.category;
      
      set((state) => ({ categories: [newCategory, ...state.categories] }));

      // If initialBudget is provided and it's an expense category, create a budget
      if (initialBudget && data.type === "expense") {
        try {
          await axiosInstance.post("/budgets", {
            category: newCategory._id,
            amount: Number(initialBudget),
            periodMonth: new Date().getMonth() + 1,
            periodYear: new Date().getFullYear(),
          });
        } catch (budgetError) {
          console.error("Failed to create initial budget:", budgetError);
          // We don't fail the whole operation if budget creation fails
        }
      }

      return { success: true, category: newCategory };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to add category" };
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const { initialBudget, ...data } = categoryData;
      const res = await axiosInstance.put(`/category/${id}`, data);
      const updatedCategory = res.data.category;

      set((state) => ({
        categories: state.categories.map((category) =>
          category._id === id ? updatedCategory : category
        ),
      }));

      // If initialBudget is provided, create a budget
      if (initialBudget && data.type === "expense") {
        try {
          await axiosInstance.post("/budgets", {
            category: id,
            amount: Number(initialBudget),
            periodMonth: new Date().getMonth() + 1,
            periodYear: new Date().getFullYear(),
          });
        } catch (budgetError) {
          console.error("Failed to create budget during update:", budgetError);
        }
      }

      return { success: true, category: updatedCategory };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to update category" };
    }
  },

  deleteCategory: async (id, transferToId) => {
    try {
      await axiosInstance.delete(`/category/${id}`, { data: { transferToId } });
      set((state) => ({ categories: state.categories.filter((category) => category._id !== id) }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to delete category" };
    }
  },

  checkCategoryExists: async (name, type) => {
    try {
      const res = await axiosInstance.get(`/category/check-exists?name=${name}&type=${type}`);
      return res.data; // { exists: boolean, categoryId: string }
    } catch (error) {
      console.error("Check exists failed:", error);
      return { exists: false };
    }
  },
}));
