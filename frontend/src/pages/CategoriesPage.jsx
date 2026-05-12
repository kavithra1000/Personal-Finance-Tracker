import { useEffect, useMemo, useState } from "react";
import { Plus, Loader, Search } from "lucide-react";
import { useCategoryStore } from "../store/useCategoryStore";
import { useTransactionStore } from "../store/useTransactionStore";
import { useBudgetStore } from "../store/useBudgetStore";
import CategoryForm from "../components/categories/CategoryForm";
import DeleteCategoryModal from "../components/categories/DeleteCategoryModal";
import CategoryStats from "../components/categories/CategoryStats";
import CategoryFilters from "../components/categories/CategoryFilters";
import CategoryCard from "../components/categories/CategoryCard";
import { startOfMonth, endOfMonth } from "date-fns";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const { categories, isLoading, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const { budgets, fetchBudgets } = useBudgetStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
    fetchBudgets({
      periodMonth: new Date().getMonth() + 1,
      periodYear: new Date().getFullYear()
    });
  }, [fetchCategories, fetchTransactions, fetchBudgets]);

  const stats = useMemo(() => ({
    total: categories.length,
    expenses: categories.filter(c => c.type === "expense").length,
    income: categories.filter(c => c.type === "income").length,
  }), [categories]);

  const categoryInsights = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const insightMap = {};

    categories.forEach(cat => {
      const catTransactions = transactions.filter(t => t.category?._id === cat._id || t.category === cat._id);
      const monthlyTransactions = catTransactions.filter(t => {
        const d = new Date(t.date);
        return d >= start && d <= end;
      });
      const totalAmount = monthlyTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
      const budget = budgets.find(b => b.category?._id === cat._id || b.category === cat._id);

      insightMap[cat._id] = {
        totalCount: catTransactions.length,
        monthlyAmount: totalAmount,
        hasBudget: !!budget,
        budgetAmount: budget?.amount || 0,
      };
    });

    return insightMap;
  }, [categories, transactions, budgets]);

  const filteredCategories = useMemo(() => {
    const result = categories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || cat.type === typeFilter;
      return matchesSearch && matchesType;
    });

    result.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

    return result;
  }, [categories, searchQuery, typeFilter, sortBy]);

  const openCreateModal = () => {
    setActiveCategory(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (data) => {
    setIsSaving(true);
    const response = activeCategory?._id
      ? await updateCategory(activeCategory._id, data)
      : await addCategory(data);
    setIsSaving(false);

    if (response.success) {
      toast.success(`Category ${activeCategory ? "updated" : "created"} successfully`);
      setIsModalOpen(false);
      setActiveCategory(null);
    } else {
      toast.error(response.message || "An error occurred.");
    }
    return response;
  };

  const handleEdit = (category) => {
    setActiveCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async (transferToId) => {
    setIsDeleting(true);
    const response = await deleteCategory(categoryToDelete._id, transferToId);
    setIsDeleting(false);

    if (response.success) {
      toast.success("Category deleted and transactions transferred");
      setCategoryToDelete(null);
      fetchTransactions();
      fetchBudgets({
        periodMonth: new Date().getMonth() + 1,
        periodYear: new Date().getFullYear()
      });
    } else {
      toast.error(response.message || "Unable to delete category.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-primary">Organization</p>
          <h1 className="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-text-main">Categories</h1>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 md:px-6 md:py-3.5 text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98] font-bold"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm md:text-base">Add Category</span>
        </button>
      </div>

      <CategoryStats stats={stats} />

      <CategoryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Main List */}
      <div className="bg-surface rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12 min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-text-main">No categories found</h3>
            <p className="text-sm text-text-muted mt-2 max-w-xs mx-auto">
              Try adjusting your filters or create a new category to get started.
            </p>
            {(searchQuery || typeFilter !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setTypeFilter("all"); }}
                className="mt-6 px-6 py-2 rounded-xl bg-slate-100 text-text-main font-bold hover:bg-slate-200 transition-all"
              >
                Reset all filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            <div className="bg-slate-50/80 px-4 md:px-8 py-3 border-b border-slate-100 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                Managing {filteredCategories.length} {typeFilter === "all" ? "Categories" : `${typeFilter} Categories`}
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  insight={categoryInsights[category._id] || { totalCount: 0, monthlyAmount: 0 }}
                  handleEdit={handleEdit}
                  handleDelete={handleDeleteClick}  // ← maps to handleDeleteClick, not handleDelete
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CategoryForm
          category={activeCategory}
          onSave={handleSaveCategory}
          onCancel={() => { setActiveCategory(null); setIsModalOpen(false); }}
          isSaving={isSaving}
        />
      )}

      {categoryToDelete && (
        <DeleteCategoryModal
          category={categoryToDelete}
          transactionCount={categoryInsights[categoryToDelete._id]?.totalCount || 0}
          onConfirm={handleConfirmDelete}
          onCancel={() => setCategoryToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}