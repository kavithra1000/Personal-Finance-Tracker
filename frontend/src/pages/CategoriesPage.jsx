import { useEffect, useMemo, useState } from "react";
import { 
  Plus, Edit3, Trash2, Loader, Tag, 
  TrendingUp, TrendingDown, Layers, 
  Search, Filter, ChevronDown, PieChart,
  ArrowUpDown, Activity, DollarSign
} from "lucide-react";
import { useCategoryStore } from "../store/useCategoryStore";
import { useTransactionStore } from "../store/useTransactionStore";
import { useBudgetStore } from "../store/useBudgetStore";
import CategoryForm from "../components/CategoryForm";
import DeleteCategoryModal from "../components/DeleteCategoryModal";
import { startOfMonth, endOfMonth } from "date-fns";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const { categories, isLoading, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const { budgets, fetchBudgets } = useBudgetStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Deletion States
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters and Sorting
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

  const stats = useMemo(() => {
    const total = categories.length;
    const expenses = categories.filter(c => c.type === "expense").length;
    const income = categories.filter(c => c.type === "income").length;
    return { total, expenses, income };
  }, [categories]);

  // Calculate insights for each category
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
      const budget = budgets.find(b => (b.category?._id === cat._id || b.category === cat._id));

      insightMap[cat._id] = {
        totalCount: catTransactions.length,
        monthlyAmount: totalAmount,
        hasBudget: !!budget,
        budgetAmount: budget?.amount || 0
      };
    });

    return insightMap;
  }, [categories, transactions, budgets]);

  const filteredCategories = useMemo(() => {
    let result = categories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || cat.type === typeFilter;
      return matchesSearch && matchesType;
    });

    // Apply Sorting
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
    const response = activeCategory?._id ? await updateCategory(activeCategory._id, data) : await addCategory(data);
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
      {/* Header section */}
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

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="bg-surface p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5 transition-all hover:shadow-md">
          <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-blue-50 text-primary">
            <Layers className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Total</p>
            <p className="text-xl md:text-2xl font-bold text-text-main">{stats.total}</p>
          </div>
        </div>

        <div className="bg-surface p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5 transition-all hover:shadow-md">
          <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-rose-50 text-rose-600">
            <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Expenses</p>
            <p className="text-xl md:text-2xl font-bold text-text-main">{stats.expenses}</p>
          </div>
        </div>

        <div className="bg-surface p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5 transition-all hover:shadow-md sm:col-span-2 md:col-span-1">
          <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Income</p>
            <p className="text-xl md:text-2xl font-bold text-text-main">{stats.income}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-4 mb-8 items-start xl:items-center justify-between">
        <div className="relative group w-full xl:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border border-slate-200 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-surface p-1.5 rounded-3xl border border-slate-200 shadow-sm w-full xl:w-auto">
          <div className="relative flex-1 xl:flex-none xl:w-40">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-xs font-bold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="hidden sm:block w-px h-6 bg-slate-200" />

          <div className="relative flex-1 xl:flex-none xl:w-44">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-xs font-bold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="type">By Type</option>
              <option value="newest">Newest First</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main List View */}
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
            <p className="text-sm text-text-muted mt-2 max-w-xs mx-auto">Try adjusting your filters or create a new category to get started.</p>
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
            {/* List Header */}
            <div className="bg-slate-50/80 px-4 md:px-8 py-3 border-b border-slate-100 backdrop-blur-sm">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                  Managing {filteredCategories.length} {typeFilter === "all" ? "Categories" : `${typeFilter} Categories`}
               </p>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredCategories.map((category) => {
                const insight = categoryInsights[category._id] || { totalCount: 0, monthlyAmount: 0 };
                return (
                  <div 
                    key={category._id} 
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 px-4 md:px-8 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 md:gap-5">
                      <div 
                        className="h-10 w-10 md:h-11 md:w-11 rounded-2xl flex items-center justify-center text-white shadow-sm border-2 border-white shrink-0" 
                        style={{ backgroundColor: category.color }}
                      >
                        <Tag className="w-5 h-5 drop-shadow-sm" />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                          <h3 className="font-bold text-text-main text-base md:text-lg leading-none truncate">{category.name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-wider border whitespace-nowrap ${
                            category.type === "expense" 
                              ? "bg-rose-50 text-rose-600 border-rose-100" 
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          }`}>
                            {category.type === "expense" ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />}
                            {category.type}
                          </span>
                        </div>
                        <div className="text-[10px] md:text-xs text-text-muted mt-1.5 flex flex-wrap items-center gap-2 md:gap-3">
                          <span className="flex items-center gap-1 font-medium">
                            <Activity className="w-3 h-3" />
                            {insight.totalCount} {insight.totalCount === 1 ? 'Tx' : 'Txs'}
                          </span>
                          <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300" />
                          <span className="flex items-center gap-1 font-bold text-slate-500">
                            <DollarSign className="w-3 h-3" />
                            ${insight.monthlyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} this month
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:translate-x-2 sm:group-hover:translate-x-0">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 md:p-2.5 text-text-muted hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
                        title="Edit Category"
                      >
                        <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="p-2 md:p-2.5 text-text-muted hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CategoryForm
          category={activeCategory}
          onSave={handleSaveCategory}
          onCancel={() => {
            setActiveCategory(null);
            setIsModalOpen(false);
          }}
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
