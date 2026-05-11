import { useState, useMemo } from "react";
import { 
  X, AlertTriangle, Loader, ChevronDown, CheckCircle2, Tag,
  Palette, DollarSign, TrendingUp, TrendingDown, Layers
} from "lucide-react";
import { useCategoryStore } from "../store/useCategoryStore";
import toast from "react-hot-toast";

export default function DeleteCategoryModal({ category, transactionCount, onConfirm, onCancel, isDeleting }) {
  const { categories, addCategory } = useCategoryStore();
  
  const [mode, setMode] = useState("select"); // 'select' or 'create'
  const [transferToId, setTransferToId] = useState("");
  
  const [newCat, setNewCat] = useState({
    name: "",
    color: "#3b82f6",
    initialBudget: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const availableCategories = useMemo(() => {
    return categories.filter(c => c.type === category.type && c._id !== category._id);
  }, [categories, category]);

  const handleConfirm = async () => {
    setIsProcessing(true);

    try {
      let targetId = transferToId;

      if (mode === "create") {
        if (!newCat.name.trim()) {
          toast.error("Please enter a name for the new category.");
          setIsProcessing(false);
          return;
        }

        if (category.type === "expense" && !newCat.initialBudget) {
          toast.error("A monthly budget is required for new expense categories.");
          setIsProcessing(false);
          return;
        }

        const response = await addCategory({
          name: newCat.name,
          type: category.type,
          color: newCat.color,
          initialBudget: category.type === "expense" ? Number(newCat.initialBudget) : undefined
        });

        if (response.success) {
          targetId = response.category._id;
        } else {
          toast.error(response.message || "Failed to create new category.");
          setIsProcessing(false);
          return;
        }
      }

      if (!targetId) {
        toast.error("Please select or create a target category.");
        setIsProcessing(false);
        return;
      }

      onConfirm(targetId);
    } catch (err) {
      toast.error("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center bg-white border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">Safe Delete</h2>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-0.5">Affected: {transactionCount} Transactions</p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-text-muted transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh] no-scrollbar">
          {/* Warning Message */}
          <div className="mb-6 p-4 rounded-2xl bg-rose-50/50 border border-rose-100/50 text-sm text-rose-900 leading-relaxed">
            Move transactions from <span className="font-bold underline">"{category.name}"</span> to another <span className="font-bold">{category.type}</span> category.
          </div>

          <div className="space-y-6">
            {/* Mode Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
              <button 
                onClick={() => setMode("select")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${mode === 'select' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
              >
                Existing Category
              </button>
              <button 
                onClick={() => setMode("create")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${mode === 'create' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
              >
                Create New
              </button>
            </div>

            {mode === "select" ? (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Select Target</label>
                {availableCategories.length > 0 ? (
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <select
                      value={transferToId}
                      onChange={(e) => setTransferToId(e.target.value)}
                      className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-medium text-text-main appearance-none cursor-pointer"
                    >
                      <option value="">Choose a category</option>
                      {availableCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                    <p className="text-xs font-bold text-amber-700">No other {category.type} categories.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Name</label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Category name..."
                      value={newCat.name}
                      onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Color</label>
                    <div className="relative">
                      <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        type="color"
                        value={newCat.color}
                        onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
                        className="w-full h-[52px] pl-12 pr-2 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer"
                      />
                    </div>
                  </div>

                  {category.type === "expense" && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Budget</label>
                      <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                          type="number"
                          placeholder="0.00"
                          value={newCat.initialBudget}
                          onChange={(e) => setNewCat({ ...newCat, initialBudget: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-8 pt-4 flex-shrink-0">
          <button
            onClick={handleConfirm}
            disabled={(mode === "select" && !transferToId) || (mode === "create" && !newCat.name) || isDeleting || isProcessing}
            className="group relative w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden shadow-xl shadow-primary/20"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {isDeleting || isProcessing ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {category.type === 'expense' ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                  <span>Transfer & Delete</span>
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
          </button>
          
          <button
            onClick={onCancel}
            className="w-full mt-3 py-2 text-xs font-bold text-text-muted hover:text-text-main transition-colors uppercase tracking-widest"
          >
            I've changed my mind, cancel
          </button>
        </div>
      </div>
    </div>
  );
}
