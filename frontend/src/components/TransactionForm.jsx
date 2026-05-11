import { useState, useEffect } from "react";
import { useCategoryStore } from "../store/useCategoryStore";
import { X, Loader, Plus, Tag, DollarSign, Calendar, FileText, ChevronDown, Clock } from "lucide-react";

export default function TransactionForm({ transaction = null, onClose, onSave, isSaving }) {
  const { categories, fetchCategories, addCategory } = useCategoryStore();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    note: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (transaction) {
      const d = new Date(transaction.date);
      setFormData({
        title: transaction.title || "",
        amount: transaction.amount || "",
        type: transaction.type || "expense",
        category: transaction.category?._id || transaction.category || "",
        date: d.toISOString().split("T")[0],
        time: d.toTimeString().slice(0, 5),
        note: transaction.note || "",
      });
    }
  }, [transaction]);

  const filteredCategories = categories.filter((c) => c.type === formData.type);

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
      color: newCategoryColor,
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

    if (!formData.title || !formData.amount || !formData.category || !formData.date || !formData.time) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    // Merge Date and Time
    const combinedDate = new Date(`${formData.date}T${formData.time}`);

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      date: combinedDate.toISOString(),
    };

    const result = await onSave(payload, transaction?._id);
    if (result.success) {
      onClose();
    } else {
      setMessage({ type: "error", text: result.message || "Unable to save transaction" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh] max-h-[700px] animate-in zoom-in-95 duration-200">
        {/* Fixed Header */}
        <div className="p-8 pb-4 space-y-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-text-main">
              {transaction ? "Edit Transaction" : "New Transaction"}
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-slate-100 text-text-muted transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Type Toggle - Now in Header */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                formData.type === "expense" 
                  ? "bg-white text-rose-600 shadow-md" 
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "income", category: "" })}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                formData.type === "income" 
                  ? "bg-white text-emerald-600 shadow-md" 
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="px-8 overflow-y-auto grow custom-scrollbar">
          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl text-sm flex items-center gap-3 ${
              message.type === "error" 
                ? "bg-rose-50 text-rose-600 border border-rose-100" 
                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
            }`}>
              <div className={`h-2 w-2 rounded-full ${message.type === "error" ? "bg-rose-500" : "bg-emerald-500"}`} />
              {message.text}
            </div>
          )}

          <form id="tx-form" onSubmit={handleSubmit} className="space-y-6 pb-4">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Title</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium"
                  placeholder="What's this for?"
                  required
                />
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Amount</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Time</label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Category</label>
                {!isCreatingCategory && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingCategory(true)}
                    className="text-[11px] font-bold uppercase tracking-widest text-primary hover:text-primary-dark transition-colors flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg"
                  >
                    <Plus className="w-3 h-3" />
                    New Category
                  </button>
                )}
              </div>

              {isCreatingCategory ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Creating New Category</span>
                    <button 
                      type="button"
                      onClick={() => setIsCreatingCategory(false)}
                      className="text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:border-primary outline-none shadow-sm font-medium"
                    placeholder="Category Name (e.g. Health)"
                    autoFocus
                  />
                  <div className="flex gap-3 items-center">
                    <div className="relative group">
                      <input
                        type="color"
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                        className="w-12 h-10 p-0.5 rounded-xl border border-slate-200 cursor-pointer bg-white overflow-hidden"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={isAddingCategory || !newCategoryName.trim()}
                      className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                      {isAddingCategory ? "Creating..." : "Create & Select"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                     {formData.category ? (
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: categories.find(c => c._id === formData.category)?.color || '#94a3b8' }} 
                        />
                     ) : (
                        <Tag className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                     )}
                   </div>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Choose a category</option>
                    {filteredCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Note Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Note (Optional)</label>
              <div className="relative group">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium resize-none"
                  placeholder="Add a quick note..."
                  rows="3"
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="p-8 pt-4 flex-shrink-0">
          <button
            type="submit"
            form="tx-form"
            disabled={isSaving || isCreatingCategory}
            className="group relative w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden shadow-xl shadow-primary/20"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {isSaving ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>{transaction ? "Update Transaction" : "Create Transaction"}</span>
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
          </button>
        </div>
      </div>
    </div>
  );
}
