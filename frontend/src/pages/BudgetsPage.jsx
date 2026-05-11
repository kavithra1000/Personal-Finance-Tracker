import { useEffect, useMemo, useState } from "react";
import { 
  Plus, Edit3, Trash2, Loader, 
  TrendingUp, TrendingDown, AlertCircle, 
  Calendar, PieChart, ChevronRight, Target, Tag, Wallet,
  Search, Filter, ArrowUpDown, ChevronDown
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

  // Search and Advanced Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, exceeded, near-limit, on-track
  const [sortBy, setSortBy] = useState("name"); // name, amount-desc, amount-asc, usage-desc

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

  const filteredBudgets = useMemo(() => {
    let result = budgets.map(b => ({
      ...b,
      usageRatio: b.amount > 0 ? (b.spent / b.amount) * 100 : 0
    }));

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        (b.category?.name || "Unknown").toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter === "exceeded") {
      result = result.filter(b => b.isExceeded);
    } else if (statusFilter === "near-limit") {
      result = result.filter(b => !b.isExceeded && b.usageRatio >= 80);
    } else if (statusFilter === "on-track") {
      result = result.filter(b => b.usageRatio < 80);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") {
        return (a.category?.name || "").localeCompare(b.category?.name || "");
      } else if (sortBy === "amount-desc") {
        return b.amount - a.amount;
      } else if (sortBy === "amount-asc") {
        return a.amount - b.amount;
      } else if (sortBy === "usage-desc") {
        return b.usageRatio - a.usageRatio;
      }
      return 0;
    });

    return result;
  }, [budgets, searchQuery, statusFilter, sortBy]);

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
      {/* Header section */}
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

      {/* Stats Summary */}
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

      {/* Advanced Filters and Search */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
          {/* Primary Filters (Month/Year) */}
          <div className="flex items-center gap-3 bg-surface p-1.5 rounded-2xl border border-slate-200 shadow-sm">
             <div className="relative group">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
               <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(Number(e.target.value))}
                  className="pl-9 pr-8 py-2 rounded-xl bg-transparent text-sm font-semibold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  {monthNames.map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
             </div>
             <div className="w-px h-6 bg-slate-200 mx-1" />
             <input
                type="number"
                min="2024"
                value={filterYear}
                onChange={(e) => setFilterYear(Number(e.target.value))}
                className="w-20 bg-transparent px-2 py-2 text-sm font-semibold text-text-main outline-none"
              />
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <div className="relative group flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-40">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-9 pr-8 py-3 rounded-2xl bg-surface border border-slate-200 text-sm font-semibold text-text-main outline-none appearance-none cursor-pointer hover:border-primary transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="exceeded">Exceeded</option>
                  <option value="near-limit">Near Limit</option>
                  <option value="on-track">On Track</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative flex-1 sm:w-40">
                <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-8 py-3 rounded-2xl bg-surface border border-slate-200 text-sm font-semibold text-text-main outline-none appearance-none cursor-pointer hover:border-primary transition-all"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="amount-desc">Budget: High</option>
                  <option value="amount-asc">Budget: Low</option>
                  <option value="usage-desc">Most Usage</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget List */}
      {isLoading ? (
        <div className="p-24 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredBudgets.length === 0 ? (
        <div className="p-24 text-center bg-surface rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4">
             <Search className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-xl font-semibold text-text-main">No budgets found</p>
          <p className="text-sm text-text-muted mt-2">Try adjusting your filters or search query.</p>
          {(searchQuery || statusFilter !== "all") && (
            <button 
              onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
              className="mt-6 text-primary font-bold text-sm uppercase tracking-widest hover:underline"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBudgets.map((budget) => {
            const ratio = budget.usageRatio;
            const isOver = budget.isExceeded;
            const isNearLimit = !isOver && ratio >= 80;
            const categoryName = budget.category?.name || "Unknown";
            const categoryColor = budget.category?.color || "#3b82f6";

            return (
              <div 
                key={budget._id} 
                className="group relative bg-surface rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Visual Accent */}
                <div 
                  className="absolute top-0 left-0 w-full h-1.5 opacity-20" 
                  style={{ backgroundColor: categoryColor }}
                />

                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div 
                      className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg" 
                      style={{ backgroundColor: categoryColor }}
                    >
                       <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-lg">{categoryName}</h3>
                      <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
                        {monthNames[budget.periodMonth - 1]} {budget.periodYear}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="p-2 text-text-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                   <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Progress</p>
                        {isOver && <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-tighter border border-rose-100">Exceeded</span>}
                        {isNearLimit && <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-tighter border border-amber-100">Warning</span>}
                      </div>
                      <p className={`text-sm font-black ${isOver ? 'text-rose-600' : isNearLimit ? 'text-amber-600' : 'text-primary'}`}>
                        {ratio.toFixed(0)}%
                      </p>
                   </div>
                   <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isOver ? 'bg-rose-500' : ratio > 80 ? 'bg-amber-500' : 'bg-primary'}`} 
                        style={{ width: `${Math.min(ratio, 100)}%` }} 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Limit</p>
                      <p className="text-xl font-bold text-text-main tracking-tight">${Number(budget.amount).toLocaleString()}</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        {isOver ? 'Deficit' : 'Available'}
                      </p>
                      <p className={`text-xl font-bold tracking-tight ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
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
