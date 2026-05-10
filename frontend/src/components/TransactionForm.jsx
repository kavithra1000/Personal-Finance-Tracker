import { useState, useEffect } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { X, Loader, Plus } from "lucide-react";

export default function TransactionForm({ onClose }) {
  const { addTransaction, isAdding } = useTransactionStore();
  const { categories, fetchCategories, addCategory } = useCategoryStore();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // Inline Category Creation State
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Filter categories based on selected type
  const filteredCategories = categories.filter(c => c.type === formData.type);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setMessage({ type: "error", text: "Category name is required" });
      return;
    }

    setIsAddingCategory(true);
    setMessage({ type: "", text: "" });

    const res = await addCategory({
      name: newCategoryName,
      type: formData.type,
      color: newCategoryColor
    });

    setIsAddingCategory(false);

    if (res.success) {
      setFormData({ ...formData, category: res.category._id });
      setIsCreatingCategory(false);
      setNewCategoryName("");
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.title || !formData.amount || !formData.category || !formData.date) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    const res = await addTransaction({
      ...formData,
      amount: Number(formData.amount)
    });

    if (res.success) {
      onClose();
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-text-main">Add Transaction</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-50 text-red-500 border border-red-200" : "bg-green-50 text-green-500 border border-green-200"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Toggle */}
            <div className="flex p-1 bg-background rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${formData.type === "income" ? "bg-white text-green-600 shadow-sm" : "text-text-muted hover:text-text-main"}`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${formData.type === "expense" ? "bg-white text-red-600 shadow-sm" : "text-text-muted hover:text-text-main"}`}
              >
                Expense
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-main"
                placeholder="e.g. Groceries"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted">Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-2 rounded-lg bg-background border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-main"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-main"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-text-muted">Category *</label>
                <button
                  type="button"
                  onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {isCreatingCategory ? "Cancel New" : "New Category"}
                </button>
              </div>

              {isCreatingCategory ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-3">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-white border border-slate-200 text-sm focus:border-primary outline-none"
                    placeholder="Category Name"
                    autoFocus
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={isAddingCategory || !newCategoryName.trim()}
                      className="flex-1 py-1.5 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isAddingCategory ? "Saving..." : "Save & Select"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-main"
                    required
                  >
                    <option value="">Select Category</option>
                    {filteredCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  {filteredCategories.length === 0 && (
                    <p className="text-xs text-amber-500 mt-1">No categories found. Click "New Category" to add one.</p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted">Note (Optional)</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-main resize-none"
                placeholder="Any additional details..."
                rows="3"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isAdding || isCreatingCategory}
              className="w-full py-3 mt-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center shadow-md shadow-primary/20"
            >
              {isAdding ? <Loader className="w-5 h-5 animate-spin" /> : "Save Transaction"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
