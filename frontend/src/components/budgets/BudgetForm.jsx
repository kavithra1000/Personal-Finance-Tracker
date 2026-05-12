import { useEffect, useState } from "react";
import { useCategoryStore } from "../../store/useCategoryStore";
import { X, Loader, Plus, Tag, DollarSign, Calendar, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function BudgetForm({ budget, categories, onSave, onCancel, isSaving }) {
  const { addCategory } = useCategoryStore();

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    periodMonth: new Date().getMonth() + 1,
    periodYear: new Date().getFullYear(),
  });

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category?._id || budget.category,
        amount: budget.amount,
        periodMonth: budget.periodMonth,
        periodYear: budget.periodYear,
      });
    }
  }, [budget]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsAddingCategory(true);

    const res = await addCategory({
      name: newCategoryName,
      type: "expense", // Budgets are always for expenses
      color: newCategoryColor,
    });

    setIsAddingCategory(false);

    if (res.success) {
      setFormData({ ...formData, category: res.category._id });
      setIsCreatingCategory(false);
      setNewCategoryName("");
      toast.success("Category created!");
    } else {
      toast.error(res.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.amount) {
      toast.error("Category and amount are required.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      toast.error("Budget amount must be greater than zero.");
      return;
    }

    const body = {
      category: formData.category,
      amount: Number(formData.amount),
      periodMonth: Number(formData.periodMonth),
      periodYear: Number(formData.periodYear),
    };

    onSave(body);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh]">
        {/* Header */}
        <div className="p-5 md:p-8 pb-3 md:pb-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-text-main leading-tight">
              {budget ? "Edit Budget" : "New Budget"}
            </h2>
            <p className="text-[10px] md:text-sm text-text-muted mt-0.5">Set limits for your spending.</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-slate-100 text-text-muted transition-all active:scale-90 shrink-0"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-5 md:px-8 py-3 md:py-4 overflow-y-auto custom-scrollbar flex-1">
          <form id="budget-form" onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Category Section */}

            {/* Category Section */}
            {!budget && (
              <div className="space-y-1.5 md:space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-text-muted">Category</label>
                  {!isCreatingCategory && (
                    <button
                      type="button"
                      onClick={() => setIsCreatingCategory(true)}
                      className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-dark transition-colors flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg"
                    >
                      <Plus className="w-3 h-3" />
                      New
                    </button>
                  )}
                </div>

                {isCreatingCategory ? (
                  <div className="p-4 md:p-5 bg-slate-50 border border-slate-200 rounded-2xl md:rounded-[2rem] flex flex-col gap-3 md:gap-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Quick Create Category</span>
                      <button
                        type="button"
                        onClick={() => setIsCreatingCategory(false)}
                        className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-white border border-slate-200 text-xs md:text-sm focus:border-primary outline-none shadow-sm font-medium"
                      placeholder="Category Name..."
                      autoFocus
                    />
                    <div className="flex gap-3 items-center">
                      <div className="relative group h-10 md:h-12 w-16 md:w-20 shrink-0">
                        <input
                          type="color"
                          value={newCategoryColor}
                          onChange={(e) => setNewCategoryColor(e.target.value)}
                          className="w-full h-full p-1 rounded-xl border border-slate-200 cursor-pointer bg-white overflow-hidden"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={isAddingCategory || !newCategoryName.trim()}
                        className="flex-1 py-2.5 md:py-3 bg-primary text-white text-xs md:text-sm font-bold rounded-xl md:rounded-2xl hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/20"
                      >
                        {isAddingCategory ? "Creating..." : "Create"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center pointer-events-none">
                      {formData.category ? (
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: categories.find(c => c._id === formData.category)?.color || '#94a3b8' }}
                        />
                      ) : (
                        <Tag className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      )}
                    </div>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full pl-11 md:pl-12 pr-10 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium text-sm md:text-base appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Choose a category</option>
                      {categories
                        .filter((category) => category.type === "expense")
                        .map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 pointer-events-none" />
                  </div>
                )}
              </div>
            )}


            {/* Amount */}
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Limit Amount</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-11 md:pl-12 pr-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-bold text-base md:text-lg"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Period Selection */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Month</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                  <select
                    value={formData.periodMonth}
                    onChange={(e) => setFormData({ ...formData, periodMonth: Number(e.target.value) })}
                    className="w-full pl-11 md:pl-12 pr-10 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium text-xs md:text-sm appearance-none cursor-pointer"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index + 1}>{month}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Year</label>
                <input
                  type="number"
                  min="2024"
                  value={formData.periodYear}
                  onChange={(e) => setFormData({ ...formData, periodYear: Number(e.target.value) })}
                  className="w-full px-4 md:px-6 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-bold text-xs md:text-sm text-center"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 md:p-8 pt-3 md:pt-4 shrink-0 bg-white md:bg-transparent border-t md:border-t-0 border-slate-100">
          <button
            type="submit"
            form="budget-form"
            disabled={isSaving || isCreatingCategory}
            className="group relative w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-primary text-white font-bold text-base md:text-lg hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden shadow-xl shadow-primary/20"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {isSaving ? (
                <Loader className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
              ) : (
                <span>{budget ? "Update Budget" : "Create Budget"}</span>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
          </button>
        </div>
      </div>
    </div>
  );
}
