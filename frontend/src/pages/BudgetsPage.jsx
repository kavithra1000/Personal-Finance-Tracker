import { useEffect, useMemo, useState } from "react";
import { Plus, Edit3, Trash2, Loader } from "lucide-react";
import { useBudgetStore } from "../store/useBudgetStore";
import { useCategoryStore } from "../store/useCategoryStore";
import BudgetForm from "../components/BudgetForm";

const monthNames = [
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

export default function BudgetsPage() {
  const { budgets, isLoading, fetchBudgets, addBudget, updateBudget, deleteBudget, isSaving, isDeleting } = useBudgetStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBudget, setActiveBudget] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchBudgets({ periodMonth: filterMonth, periodYear: filterYear });
  }, [fetchBudgets, filterMonth, filterYear]);

  const summary = useMemo(() => {
    const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.amount), 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + Number(budget.spent || 0), 0);
    const overBudgetCount = budgets.filter((budget) => budget.isExceeded).length;
    return { totalBudget, totalSpent, totalRemaining: totalBudget - totalSpent, overBudgetCount };
  }, [budgets]);

  const openNewBudget = () => {
    setActiveBudget(null);
    setIsModalOpen(true);
  };

  const handleSaveBudget = async (data) => {
    const response = activeBudget ? await updateBudget(activeBudget._id, data) : await addBudget(data);
    if (response.success) {
      setIsModalOpen(false);
      setActiveBudget(null);
      fetchBudgets({ periodMonth: filterMonth, periodYear: filterYear });
    } else {
      alert(response.message || "Unable to save budget.");
    }
  };

  const handleEdit = (budget) => {
    setActiveBudget(budget);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this budget?")) {
      const response = await deleteBudget(id);
      if (!response.success) {
        alert(response.message || "Unable to delete budget.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Budgets</h1>
          <p className="text-text-muted mt-1">Create budgets and watch expenditure progress for each category.</p>
        </div>
        <button
          onClick={openNewBudget}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-3xl border border-slate-200 bg-surface p-5 shadow-sm">
          <p className="text-sm text-text-muted">Total budget</p>
          <p className="mt-3 text-3xl font-semibold text-text-main">${summary.totalBudget.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-surface p-5 shadow-sm">
          <p className="text-sm text-text-muted">Total spent</p>
          <p className="mt-3 text-3xl font-semibold text-text-main">${summary.totalSpent.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-surface p-5 shadow-sm">
          <p className="text-sm text-text-muted">Over budget</p>
          <p className="mt-3 text-3xl font-semibold text-rose-600">{summary.overBudgetCount}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="rounded-3xl border border-slate-200 bg-surface p-5 shadow-sm">
          <label className="block text-sm font-medium text-text-muted mb-2">Month</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(Number(e.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-surface p-5 shadow-sm">
          <label className="block text-sm font-medium text-text-muted mb-2">Year</label>
          <input
            type="number"
            min="2024"
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-surface shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : budgets.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <p>No budgets found for selected month and year.</p>
            <button onClick={openNewBudget} className="mt-4 text-primary hover:underline">Create your first budget</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-background/80 text-text-muted text-sm border-b border-slate-200">
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Budget</th>
                  <th className="p-4 font-medium">Spent</th>
                  <th className="p-4 font-medium">Remaining</th>
                  <th className="p-4 font-medium">Progress</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {budgets.map((budget) => {
                  const ratio = Math.min(Math.max((budget.spent / budget.amount) * 100, 0), 200);
                  const isOver = budget.isExceeded;
                  const barColor = isOver ? "bg-rose-500" : ratio > 90 ? "bg-amber-500" : "bg-emerald-500";
                  const categoryName = budget.category?.name || "Unknown";
                  const categoryColor = budget.category?.color || "#3b82f6";

                  return (
                    <tr key={budget._id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-3">
                          <span className="h-10 w-10 rounded-2xl" style={{ backgroundColor: categoryColor }} />
                          <div>
                            <p className="font-semibold text-text-main">{categoryName}</p>
                            <span className="text-xs text-text-muted">{monthNames[budget.periodMonth - 1]} {budget.periodYear}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-top font-semibold text-text-main">${Number(budget.amount).toFixed(2)}</td>
                      <td className="p-4 align-top text-rose-600 font-semibold">${Number(budget.spent || 0).toFixed(2)}</td>
                      <td className="p-4 align-top font-medium text-text-main">${Number(budget.remaining).toFixed(2)}</td>
                      <td className="p-4 align-top">
                        <div className="mb-2 h-3 overflow-hidden rounded-full bg-slate-100">
                          <div className={`${barColor} h-full`} style={{ width: `${ratio}%` }} />
                        </div>
                        <p className="text-xs text-text-muted">{ratio.toFixed(0)}% used</p>
                      </td>
                      <td className="p-4 align-top text-center space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-text-muted hover:border-slate-300 hover:text-text-main transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(budget._id)}
                          className="inline-flex items-center gap-1 rounded-2xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <BudgetForm
          budget={activeBudget}
          categories={categories}
          onSave={handleSaveBudget}
          onCancel={() => {
            setActiveBudget(null);
            setIsModalOpen(false);
          }}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
