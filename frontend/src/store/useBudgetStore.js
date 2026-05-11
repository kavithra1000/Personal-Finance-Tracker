import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useBudgetStore = create((set) => ({
  budgets: [],
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  error: null,

  fetchBudgets: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (filters.periodMonth) queryParams.append("periodMonth", filters.periodMonth);
      if (filters.periodYear) queryParams.append("periodYear", filters.periodYear);

      const url = `/budgets${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const res = await axiosInstance.get(url);

      set({ budgets: res.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to fetch budgets", isLoading: false });
    }
  },

  addBudget: async (budgetData) => {
    set({ isSaving: true, error: null });
    try {
      const res = await axiosInstance.post("/budgets", budgetData);
      set((state) => ({ budgets: [res.data.data, ...state.budgets], isSaving: false }));
      return { success: true, budget: res.data.data };
    } catch (error) {
      set({ isSaving: false });
      return { success: false, message: error.response?.data?.error || "Failed to create budget" };
    }
  },

  updateBudget: async (id, budgetData) => {
    set({ isSaving: true, error: null });
    try {
      const res = await axiosInstance.put(`/budgets/${id}`, budgetData);
      set((state) => ({
        budgets: state.budgets.map((budget) => (budget._id === id ? res.data.data : budget)),
        isSaving: false,
      }));
      return { success: true, budget: res.data.data };
    } catch (error) {
      set({ isSaving: false });
      return { success: false, message: error.response?.data?.error || "Failed to update budget" };
    }
  },

  deleteBudget: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      await axiosInstance.delete(`/budgets/${id}`);
      set((state) => ({ budgets: state.budgets.filter((budget) => budget._id !== id), isDeleting: false }));
      return { success: true };
    } catch (error) {
      set({ isDeleting: false });
      return { success: false, message: error.response?.data?.error || "Failed to delete budget" };
    }
  },
}));
