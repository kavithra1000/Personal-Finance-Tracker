import { useEffect, useMemo, useState } from "react";
import { Plus, Edit3, Trash2, Loader, Tag, TrendingUp, TrendingDown, Layers } from "lucide-react";
import { useCategoryStore } from "../store/useCategoryStore";
import CategoryForm from "../components/CategoryForm";

export default function CategoriesPage() {
  const { categories, isLoading, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === "expense"),
    [categories]
  );
  const incomeCategories = useMemo(
    () => categories.filter((category) => category.type === "income"),
    [categories]
  );

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
      {/* Header section matching Dashboard style */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">Organization</p>
          <h1 className="mt-3 text-3xl font-semibold text-text-main">Categories</h1>
        </div>
        
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-white shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Category</span>
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Expenses Section */}
        <section className="bg-surface rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <TrendingDown className="w-5 h-5" />
               </div>
               <h2 className="text-xl font-semibold text-text-main">Expenses</h2>
            </div>
            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-text-muted border border-slate-100">
              {expenseCategories.length}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : expenseCategories.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 p-8 text-center text-sm text-text-muted">
              No expense categories yet.
            </div>
          ) : (
            <div className="space-y-2">
              {expenseCategories.map((category) => (
                <div key={category._id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-8 w-8 rounded-lg shadow-sm border-2 border-white" 
                      style={{ backgroundColor: category.color }} 
                    />
                    <div>
                      <p className="font-medium text-text-main">{category.name}</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider">{category.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-1.5 text-text-muted hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Income Section */}
        <section className="bg-surface rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
               </div>
               <h2 className="text-xl font-semibold text-text-main">Income</h2>
            </div>
            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-text-muted border border-slate-100">
              {incomeCategories.length}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : incomeCategories.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 p-8 text-center text-sm text-text-muted">
              No income categories yet.
            </div>
          ) : (
            <div className="space-y-2">
              {incomeCategories.map((category) => (
                <div key={category._id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-8 w-8 rounded-lg shadow-sm border-2 border-white" 
                      style={{ backgroundColor: category.color }} 
                    />
                    <div>
                      <p className="font-medium text-text-main">{category.name}</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider">{category.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-1.5 text-text-muted hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
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
