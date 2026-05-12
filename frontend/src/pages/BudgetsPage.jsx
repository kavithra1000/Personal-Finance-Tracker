import { useEffect, useMemo, useState } from "react";
import {
  Plus, Loader, Search } from "lucide-react";
import { useBudgetStore } from "../store/useBudgetStore";
import { useCategoryStore } from "../store/useCategoryStore";
import BudgetForm from "../components/budgets/BudgetForm";
import DeleteBudgetModal from "../components/budgets/DeleteBudgetModal";
import toast from "react-hot-toast";
import BudgetStats from "../components/budgets/BudgetStats";
import BudgetFilters from "../components/budgets/BudgetFilters";
import BudgetCard from "../components/budgets/BudgetCard";

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
  const [budgetToDelete, setBudgetToDelete] = useState(null);

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
        return b.amount - a.amount;
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
      toast.success(`Budget ${activeBudget ? "updated" : "created"} successfully`);
      setIsModalOpen(false);
      setActiveBudget(null);
      fetchBudgets({ periodMonth: filterMonth, periodYear: filterYear });
    } else {
      toast.error(response.message || "Unable to save budget.");
    }
  };

  const handleEdit = (budget) => {
    setActiveBudget(budget);
    setIsModalOpen(true);
  };

  const handleDelete = (budget) => {
    setBudgetToDelete(budget);
  };

  const confirmDelete = async () => {
    if (budgetToDelete) {
      const response = await deleteBudget(budgetToDelete._id);
      if (response.success) {
        toast.success("Budget removed successfully");
        setBudgetToDelete(null);
      } else {
        toast.error(response.message || "Unable to delete budget.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      {/* Header section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-primary">Planning</p>
          <h1 className="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-text-main">Budgets</h1>
        </div>
        
        <button
          onClick={openNewBudget}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 md:px-6 md:py-3.5 text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold text-sm md:text-base">New Budget</span>
        </button>
      </div>

      {/* Stats Summary */}
      <BudgetStats summary={summary} />

      {/* Advanced Filters and Search */}
      <BudgetFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        filterYear={filterYear}
        setFilterYear={setFilterYear}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        monthNames={monthNames}
      />

      {/* Budget List */}
      {isLoading ? (
        <div className="p-24 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredBudgets.length === 0 ? (
        <div className="p-24 text-center bg-surface rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Search className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-xl font-bold text-text-main">No budgets found</p>
          <p className="text-text-muted mt-2 max-w-xs mx-auto">Adjust your filters or try a different search term to see your budgets.</p>
          {(searchQuery || statusFilter !== "all") && (
            <button 
              onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
              className="mt-6 px-6 py-2 rounded-xl bg-slate-100 text-text-main font-bold hover:bg-slate-200 transition-all"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredBudgets.map((budget) => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              monthNames={monthNames}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
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

      {budgetToDelete && (
        <DeleteBudgetModal
          budget={budgetToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setBudgetToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
