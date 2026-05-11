import { useEffect, useState } from "react";
import { X, Loader, Tag, Palette, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function CategoryForm({ category = null, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    color: "#3b82f6",
    initialBudget: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color || "#3b82f6",
        initialBudget: "", // Don't show initial budget on edit
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

    const data = {
      name: formData.name.trim(),
      type: formData.type,
      color: formData.color,
    };

    const needsBudget = formData.type === "expense" && (!category || category.type === "income");

    if (needsBudget) {
      if (!formData.initialBudget) {
        setMessage("Initial budget is required for expense categories.");
        return;
      }
      data.initialBudget = Number(formData.initialBudget);
    }

    const result = onSave(data);
    
    // If onSave returns a promise (which it does in CategoriesPage), handle the result
    if (result instanceof Promise) {
      result.then(res => {
        if (!res?.success) {
          setMessage(res?.message || "An error occurred while saving.");
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-text-main">
              {category ? "Edit Category" : "New Category"}
            </h2>
            <p className="text-sm text-text-muted mt-1">Define how you organize your money.</p>
          </div>
          <button 
            onClick={onCancel} 
            className="p-2 rounded-full hover:bg-slate-100 text-text-muted transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {message && (
            <div className="mb-6 p-4 rounded-2xl text-sm bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              {message}
            </div>
          )}

          <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Category Name</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium"
                  placeholder="e.g. Shopping, Salary, Bills"
                  required
                />
              </div>
            </div>

            {/* Type & Color Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Type</label>
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "expense" })}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      formData.type === "expense" ? "bg-white text-rose-600 shadow-sm" : "text-text-muted"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "income" })}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      formData.type === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-text-muted"
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Color</label>
                <div className="relative group">
                   <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                   <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-[52px] pl-12 pr-2 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Conditional Budget Field */}
            {formData.type === "expense" && (!category?._id || category.type === "income") && (
               <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                       {category?._id ? "Set Monthly Budget" : "Initial Monthly Budget"}
                    </label>
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase border border-rose-100">Required *</span>
                  </div>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.initialBudget}
                      onChange={(e) => setFormData({ ...formData, initialBudget: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium"
                      placeholder="e.g. 500.00"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-text-muted px-1">
                    {category?._id 
                      ? "Converting to expense requires setting a budget for the current month." 
                      : "Setting this creates your budget for the current month instantly."}
                  </p>
               </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4">
          <button
            type="submit"
            form="category-form"
            disabled={isSaving}
            className="group relative w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden shadow-xl shadow-primary/20"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {isSaving ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <span>{category ? "Update Category" : "Create Category"}</span>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
          </button>
        </div>
      </div>
    </div>
  );
}
