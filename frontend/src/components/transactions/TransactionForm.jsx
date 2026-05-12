import { useEffect, useState } from "react";
import { 
  X, Loader, Tag, Calendar, DollarSign, 
  ChevronDown, Type, AlignLeft, Plus,
  TrendingUp, TrendingDown, Wallet, Clock
} from "lucide-react";
import { useCategoryStore } from "../../store/useCategoryStore";
import toast from "react-hot-toast";

export default function TransactionForm({ transaction = null, onSave, onCancel, isSaving }) {
  const { categories, addCategory } = useCategoryStore();
  
  // Get current local date-time string in YYYY-MM-DDTHH:mm format
  const getLocalDatetime = (date = new Date()) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: getLocalDatetime(),
    description: "",
  });

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");

  useEffect(() => {
    if (transaction) {
      setFormData({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category?._id || transaction.category,
        date: getLocalDatetime(transaction.date),
        description: transaction.description || "",
      });
    }
  }, [transaction]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (formData.type === "expense" && !newCategoryBudget) {
      toast.error("Initial budget is required for expense categories");
      return;
    }

    const res = await addCategory({
      name: newCategoryName,
      type: formData.type,
      color: newCategoryColor,
      initialBudget: formData.type === "expense" ? Number(newCategoryBudget) : undefined
    });

    if (res.success) {
      setFormData({ ...formData, category: res.category._id });
      setIsCreatingCategory(false);
      setNewCategoryName("");
      setNewCategoryBudget("");
      toast.success("Category created!");
    } else {
      toast.error(res.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.category) {
      toast.error("All required fields must be filled.");
      return;
    }

    const payload = {
      ...formData,
      amount: Number(formData.amount),
    };

    const result = await onSave(payload, transaction?._id);
    if (!result.success) {
      toast.error(result.message || "Unable to save transaction");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh]">
        {/* Header */}
        <div className="p-5 md:p-8 pb-3 md:pb-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-text-main leading-tight">
              {transaction ? "Edit Transaction" : "New Transaction"}
            </h2>
            <p className="text-[10px] md:text-sm text-text-muted mt-0.5">Record your financial movement accurately.</p>
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
          <form id="tx-form" onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Title Input */}
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Title</label>
              <div className="relative group">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full pl-11 md:pl-12 pr-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium text-sm md:text-base"
                  placeholder="What was this for?"
                  required
                />
              </div>
            </div>

            {/* Type & Amount Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Type</label>
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${
                      formData.type === "expense" ? "bg-white text-rose-600 shadow-sm" : "text-text-muted"
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${
                      formData.type === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-text-muted"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Income
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Amount</label>
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
            </div>

            {/* Category Section */}
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
                  
                  {formData.type === "expense" && (
                    <div className="space-y-1.5 md:space-y-2 animate-in slide-in-from-top-1 duration-200">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Monthly Budget</label>
                        <span className="text-[8px] md:text-[9px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase border border-rose-100">Required *</span>
                      </div>
                      <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={newCategoryBudget}
                          onChange={(e) => setNewCategoryBudget(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 md:py-2.5 rounded-xl bg-white border border-slate-200 focus:border-primary outline-none text-xs md:text-sm font-medium"
                          placeholder="e.g. 500.00"
                        />
                      </div>
                    </div>
                  )}

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
                      className="flex-1 py-2.5 md:py-3 bg-primary text-white text-xs md:text-sm font-bold rounded-xl md:rounded-2xl hover:bg-primary-dark transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                    >
                      Create
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
                      <Wallet className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    )}
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-11 md:pl-12 pr-10 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium text-sm md:text-base appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Choose category</option>
                    {categories
                      .filter(c => c.type === formData.type)
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Date & Time Input */}
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Date & Time</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-11 md:pl-12 pr-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium text-sm md:text-base appearance-none"
                  required
                />
              </div>
            </div>

            {/* Notes Field */}
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Notes (Optional)</label>
              <div className="relative group">
                <AlignLeft className="absolute left-4 top-4 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full pl-11 md:pl-12 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium text-sm md:text-base min-h-[100px] md:min-h-[120px] resize-none"
                  placeholder="Add details about this transaction..."
                  rows={3}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 md:p-8 pt-3 md:pt-4 shrink-0 bg-white md:bg-transparent border-t md:border-t-0 border-slate-100">
          <button
            type="submit"
            form="tx-form"
            disabled={isSaving || isCreatingCategory}
            className="group relative w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-primary text-white font-bold text-base md:text-lg hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden shadow-xl shadow-primary/20"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {isSaving ? (
                <Loader className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
              ) : (
                <span>{transaction ? "Update Transaction" : "Create Transaction"}</span>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
          </button>
        </div>
      </div>
    </div>
  );
}
