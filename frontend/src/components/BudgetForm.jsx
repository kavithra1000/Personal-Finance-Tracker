import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BudgetForm({ budget, categories, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    periodMonth: new Date().getMonth() + 1,
    periodYear: new Date().getFullYear(),
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category?._id || budget.category,
        amount: budget.amount,
        periodMonth: budget.periodMonth,
        periodYear: budget.periodYear,
      });
    }
  }, [budget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.category || !formData.amount) {
      setMessage("Category and amount are required.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setMessage("Budget amount must be greater than zero.");
      return;
    }

    const body = {
      category: formData.category,
      amount: Number(formData.amount),
      periodMonth: Number(formData.periodMonth),
      periodYear: Number(formData.periodYear),
    };

    onSave(body);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-semibold text-text-main">{budget ? "Edit Budget" : "Create Budget"}</h3>
            <p className="text-sm text-text-muted mt-1">Set a budget for a category and track spending progress.</p>
          </div>
          <button onClick={onCancel} className="text-text-muted hover:text-text-main transition-colors">×</button>
        </div>

        <div className="p-6 space-y-4">
          {message && <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{message}</div>}

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-background px-4 py-3 text-sm text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select category</option>
              {categories
                .filter((category) => category.type === "expense")
                .map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Amount *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-background px-4 py-3 text-sm text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Month</label>
              <select
                value={formData.periodMonth}
                onChange={(e) => setFormData({ ...formData, periodMonth: Number(e.target.value) })}
                className="w-full rounded-2xl border border-slate-200 bg-background px-4 py-3 text-sm text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Year</label>
            <input
              type="number"
              min="2024"
              value={formData.periodYear}
              onChange={(e) => setFormData({ ...formData, periodYear: Number(e.target.value) })}
              className="w-full rounded-2xl border border-slate-200 bg-background px-4 py-3 text-sm text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-slate-300 bg-background px-4 py-3 text-sm font-medium text-text-muted hover:border-slate-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : budget ? "Save Changes" : "Create Budget"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
