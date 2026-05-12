import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useInsightStore = create((set) => ({
  summary: { totalIncome: 0, totalExpense: 0, balance: 0 },
  expenseDistribution: [],
  monthlyTrend: [],
  budgetVsActual: [],
  isLoading: false,
  isExporting: false, // Track export state separately

  downloadReport: async (filters = {}) => {
    const { month, year, format } = filters;
    set({ isExporting: true });

    try {
      const res = await axiosInstance.get("/insights/reports", {
        params: { month, year, format },
        responseType: "blob", // CRITICAL for handling PDF/Excel binary data
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;

      const extension = format === "excel" ? "xlsx" : "pdf";
      link.setAttribute("download", `Finance_Report_${month}_${year}.${extension}`);

      document.body.appendChild(link);
      link.click();

      // Cleanup DOM
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} report generated!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to download report");
    } finally {
      set({ isExporting: false });
    }
  },

  fetchSummary: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/insights/summary", { params: filters });
      set({ summary: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching summary");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchExpenseDistribution: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/insights/expense-distribution", { params: filters });
      set({ expenseDistribution: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching distribution");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMonthlyTrend: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/insights/monthly-trend");
      set({ monthlyTrend: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching monthly trend");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBudgetVsActual: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/insights/budget-vs-actual", { params: filters });
      set({ budgetVsActual: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching budget vs actual");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllInsights: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const [summaryRes, distributionRes, trendRes, budgetRes] = await Promise.all([
        axiosInstance.get("/insights/summary", { params: filters }),
        axiosInstance.get("/insights/expense-distribution", { params: filters }),
        axiosInstance.get("/insights/monthly-trend"),
        axiosInstance.get("/insights/budget-vs-actual", { params: filters }),
      ]);

      set({
        summary: summaryRes.data.data,
        expenseDistribution: distributionRes.data.data,
        monthlyTrend: trendRes.data.data,
        budgetVsActual: budgetRes.data.data,
      });
    } catch (error) {
      console.error("Error fetching all insights:", error);
      toast.error("Error fetching dashboard data");
    } finally {
      set({ isLoading: false });
    }
  }
}));