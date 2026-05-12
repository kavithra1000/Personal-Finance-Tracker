import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useTransactionStore = create((set) => ({
  transactions: [],
  isLoading: false,
  isAdding: false,
  isUpdating: false,
  isDeleting: false,
  error: null,

  fetchTransactions: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.type) queryParams.append("type", filters.type);

      const queryString = queryParams.toString();
      const url = `/transactions${queryString ? `?${queryString}` : ""}`;

      const res = await axiosInstance.get(url);
      set({ transactions: res.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to fetch transactions", isLoading: false });
    }
  },

  addTransaction: async (transactionData) => {
    set({ isAdding: true });
    try {
      const res = await axiosInstance.post("/transactions", transactionData);
      set((state) => ({ 
        transactions: [res.data.data, ...state.transactions],
        isAdding: false 
      }));
      return { success: true };
    } catch (error) {
      set({ isAdding: false });
      return { success: false, message: error.response?.data?.error || "Failed to add transaction" };
    }
  },

  updateTransaction: async (id, transactionData) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put(`/transactions/${id}`, transactionData);
      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction._id === id ? res.data.data : transaction
        ),
        isUpdating: false,
      }));
      return { success: true };
    } catch (error) {
      set({ isUpdating: false });
      return { success: false, message: error.response?.data?.error || "Failed to update transaction" };
    }
  },

  deleteTransaction: async (id) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/transactions/${id}`);
      set((state) => ({
        transactions: state.transactions.filter((t) => t._id !== id),
        isDeleting: false
      }));
      return { success: true };
    } catch (error) {
      set({ isDeleting: false });
      return { success: false, message: error.response?.data?.error || "Failed to delete transaction" };
    }
  },
}));
