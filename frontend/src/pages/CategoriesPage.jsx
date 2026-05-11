import { useEffect, useMemo, useState } from "react";
import { 
  Plus, Edit3, Trash2, Loader, Tag, 
  TrendingUp, TrendingDown, Layers, 
  Search, Filter, ChevronDown, PieChart,
  ArrowUpDown
} from "lucide-react";
import { useCategoryStore } from "../store/useCategoryStore";
import CategoryForm from "../components/CategoryForm";

export default function CategoriesPage() {
  const { categories, isLoading, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filters and Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc"); // name-asc, name-desc, type, newest

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const stats = useMemo(() => {
    const total = categories.length;
    const expenses = categories.filter(c => c.type === "expense").length;
    const income = categories.filter(c => c.type === "income").length;
    return { total, expenses, income };
  }, [categories]);

  const filteredCategories = useMemo(() => {
    let result = categories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || cat.type === typeFilter;
      return matchesSearch && matchesType;
    });

    // Apply Sorting
    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      } else if (sortBy === "type") {
        return a.type.localeCompare(b.type);
      } else if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
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
    const response = activeCategory ? await updateCategory(activeCategory._id, data) : await addCategory(data);
    setIsSaving(false);
    if (response.success) {
      setIsModalOpen(false);
      setActiveCategory(null);
    } else {
      alert(response.message || "Unable to save category.");
    }
  };

  const handleEdit = (category) => {
    setActiveCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category? Existing transactions will keep their category reference.")) {
      const response = await deleteCategory(id);
      if (!response.success) {
        alert(response.message || "Unable to delete category.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">Organization</p>
          <h1 className="mt-3 text-3xl font-semibold text-text-main">Categories</h1>
        </div>
        
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-white shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98] font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
          <div className="p-4 rounded-2xl bg-blue-50 text-primary">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Total Categories</p>
            <p className="text-2xl font-bold text-text-main">{stats.total}</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
          <div className="p-4 rounded-2xl bg-rose-50 text-rose-600">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Expense Types</p>
            <p className="text-2xl font-bold text-text-main">{stats.expenses}</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Income Types</p>
            <p className="text-2xl font-bold text-text-main">{stats.income}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center justify-between">
        <div className="relative group w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-[1.5rem] bg-surface border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-3 bg-surface p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm w-full lg:w-auto overflow-x-auto no-scrollbar">
          <div className="relative flex-1 lg:flex-none lg:w-40 min-w-[120px]">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-sm font-semibold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="w-px h-6 bg-slate-200 hidden lg:block" />

          <div className="relative flex-1 lg:flex-none lg:w-44 min-w-[140px]">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-sm font-semibold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
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
      <div className="bg-surface rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden mb-12 min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-6 rounded-full bg-slate-50 mb-4">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-text-main">No categories found</h3>
            <p className="text-sm text-text-muted mt-2">Try adjusting your filters or create a new one.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* List Header */}
            <div className="bg-slate-50/50 px-8 py-3 border-b border-slate-100">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                  Managing {filteredCategories.length} {typeFilter === "all" ? "Categories" : `${typeFilter} Categories`}
               </p>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredCategories.map((category) => (
                <div 
                  key={category._id} 
                  className="group flex items-center justify-between p-4 px-8 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-5">
                    <div 
                      className="h-11 w-11 rounded-2xl flex items-center justify-center text-white shadow-sm border-2 border-white transition-transform group-hover:scale-105" 
                      style={{ backgroundColor: category.color }}
                    >
                      <Tag className="w-5 h-5 drop-shadow-sm" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-text-main text-lg leading-none">{category.name}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border ${
                          category.type === "expense" 
                            ? "bg-rose-50 text-rose-600 border-rose-100" 
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}>
                          {category.type === "expense" ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                          {category.type}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1.5">
                        <Layers className="w-3 h-3" />
                        Custom organizational label
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        title="Edit Category"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="p-2.5 text-text-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Category"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
