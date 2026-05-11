import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export default function CategoryForm({ category = null, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    color: "#4caf50",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color || "#4caf50",
      });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name.trim()) {
      setMessage("Category name is required.");
      return;
    }

    onSave({
      name: formData.name.trim(),
      type: formData.type,
      color: formData.color,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-semibold text-text-main">{category ? "Edit Category" : "Add Category"}</h3>
            <p className="text-sm text-text-muted mt-1">Organize transactions by category and type.</p>
          </div>
          <button onClick={onCancel} className="text-text-muted hover:text-text-main transition-colors">×</button>
        </div>

        <div className="p-6 space-y-4">
          {message && <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{message}</div>}

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-background px-4 py-3 text-sm text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Groceries"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-background px-4 py-3 text-sm text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-14 rounded-2xl border border-slate-200 bg-background px-4 py-3 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-slate-300 bg-background px-4 py-3 text-sm font-medium text-text-muted hover:border-slate-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : category ? "Save Category" : "Create Category"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
