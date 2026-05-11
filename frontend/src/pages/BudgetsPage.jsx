import { useEffect, useMemo, useState } from "react";
import { 
  Plus, Edit3, Trash2, Loader, 
  TrendingUp, TrendingDown, AlertCircle, 
  Calendar, PieChart, ChevronRight, Target, Tag, Wallet
} from "lucide-react";
import { useBudgetStore } from "../store/useBudgetStore";
import { useCategoryStore } from "../store/useCategoryStore";
import BudgetForm from "../components/BudgetForm";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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
    const usagePercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    return { totalBudget, totalSpent, totalRemaining: totalBudget - totalSpent, overBudgetCount, usagePercent };
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header section matching Dashboard style */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">Planning</p>
          <h1 className="mt-3 text-3xl font-semibold text-text-main">Budgets</h1>
        </div>
        
        <button
          onClick={openNewBudget}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-white shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Budget</span>
        </button>
      </div>

      {/* Stats Summary - Matching Dashboard card style */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <div className="p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm transition-all hover:shadow-md">
          <div className="p-2 w-fit rounded-2xl bg-blue-50 mb-4">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-text-muted">Total Allocated</p>
          <p className="mt-1 text-2xl font-semibold text-text-main">${summary.totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        
        <div className="p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm transition-all hover:shadow-md">
          <div className="p-2 w-fit rounded-2xl bg-rose-50 mb-4">
            <TrendingDown className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-sm font-medium text-text-muted">Total Spent</p>
          <p className="mt-1 text-2xl font-semibold text-text-main">${summary.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm transition-all hover:shadow-md">
          <div className="p-2 w-fit rounded-2xl bg-emerald-50 mb-4">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-text-muted">Remaining</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">${Math.max(0, summary.totalRemaining).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm transition-all hover:shadow-md">
          <div className={`p-2 w-fit rounded-2xl mb-4 ${summary.overBudgetCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-primary'}`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-text-muted">Alerts</p>
          <p className={`mt-1 text-2xl font-semibold ${summary.overBudgetCount > 0 ? 'text-rose-600' : 'text-text-main'}`}>
            {summary.overBudgetCount > 0 ? `${summary.overBudgetCount} Over` : 'None'}
          </p>
        </div>
      </div>

      {/* Date Filters - Matching Dashboard filter card style */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex items-center gap-3 bg-surface p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
           <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(Number(e.target.value))}
              className="rounded-xl bg-background px-4 py-2 text-sm font-medium text-text-main outline-none border-none focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer"
            >
              {monthNames.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
            <input
              type="number"
              min="2024"
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="w-20 rounded-xl bg-background px-4 py-2 text-sm font-medium text-text-main outline-none border-none focus:ring-2 focus:ring-primary/10"
            />
        </div>
      </div>

      {/* Budget List */}
      {isLoading ? (
        <div className="p-24 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="p-24 text-center bg-surface rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xl font-medium text-text-main">No budgets planned for this period</p>
          <button onClick={openNewBudget} className="mt-4 text-primary font-medium hover:underline">
            Create your first budget
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const ratio = Math.min(Math.max((budget.spent / budget.amount) * 100, 0), 100);
            const isOver = budget.isExceeded;
            const categoryName = budget.category?.name || "Unknown";
            const categoryColor = budget.category?.color || "#3b82f6";

            return (
              <div 
                key={budget._id} 
                className="group relative bg-surface rounded-3xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-sm" 
                      style={{ backgroundColor: categoryColor }}
                    >
                       <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-main">{categoryName}</h3>
                      <p className="text-xs text-text-muted">{monthNames[budget.periodMonth - 1]} {budget.periodYear}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="p-2 text-text-muted hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                   <div className="flex justify-between items-end">
                      <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Usage</p>
                      <p className={`text-sm font-semibold ${isOver ? 'text-rose-600' : 'text-text-main'}`}>
                        {ratio.toFixed(0)}%
                      </p>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${isOver ? 'bg-rose-500' : ratio > 90 ? 'bg-amber-500' : 'bg-primary'}`} 
                        style={{ width: `${ratio}%` }} 
                      />
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <div>
                      <p className="text-[10px] font-medium text-text-muted uppercase tracking-widest mb-1">Budget</p>
                      <p className="text-lg font-semibold text-text-main">${Number(budget.amount).toLocaleString()}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-medium text-text-muted uppercase tracking-widest mb-1">
                        {isOver ? 'Over' : 'Left'}
                      </p>
                      <p className={`text-lg font-semibold ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
                        ${Math.abs(Number(budget.remaining)).toLocaleString()}
                      </p>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
