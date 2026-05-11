import { useEffect, useMemo, useState } from "react";
import { Plus, Edit3, Trash2, Loader } from "lucide-react";
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
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Categories</h1>
          <p className="text-text-muted mt-1">Create, update, and organize income and expense categories.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-text-main">Expense Categories</h2>
              <p className="text-sm text-text-muted mt-1">Track spending categories for budgets and transactions.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{expenseCategories.length}</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : expenseCategories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-text-muted">
              No expense categories yet. Add one to start categorizing expenses.
            </div>
          ) : (
            <div className="space-y-3">
              {expenseCategories.map((category) => (
                <div key={category._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-3xl border border-slate-200 bg-background p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-2xl" style={{ backgroundColor: category.color }} />
                    <div>
                      <p className="font-semibold text-text-main">{category.name}</p>
                      <p className="text-sm text-text-muted">{category.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-text-muted hover:border-slate-300 hover:text-text-main transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-text-main">Income Categories</h2>
              <p className="text-sm text-text-muted mt-1">Organize incoming funds for reporting and budgeting.</p>
            </div>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">{incomeCategories.length}</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : incomeCategories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-text-muted">
              No income categories yet. Add one to identify income sources.
            </div>
          ) : (
            <div className="space-y-3">
              {incomeCategories.map((category) => (
                <div key={category._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-3xl border border-slate-200 bg-background p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-2xl" style={{ backgroundColor: category.color }} />
                    <div>
                      <p className="font-semibold text-text-main">{category.name}</p>
                      <p className="text-sm text-text-muted">{category.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-text-muted hover:border-slate-300 hover:text-text-main transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
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
