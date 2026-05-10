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
      const res = await axiosInstance.post("/category", categoryData);
      set((state) => ({ categories: [res.data.category, ...state.categories] }));
      return { success: true, category: res.data.category };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to add category" };
    }
  },
}));
