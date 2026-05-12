import { X, Trash2, Loader, AlertTriangle, ArrowUpRight, ArrowDownRight, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function DeleteTransactionModal({ transaction, onConfirm, onCancel, isDeleting }) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main leading-tight">Delete Record</h2>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-0.5">This action is permanent</p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-text-muted transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {/* Record Preview Card */}
          <div className="mb-6 p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner">
             <div className="flex items-center gap-4 mb-4">
                <div className={`h-11 w-11 flex items-center justify-center rounded-2xl ${
                  transaction.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                }`}>
                  {transaction.type === "income" ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownRight className="h-6 w-6" />}
                </div>
                <div>
                   <h3 className="font-bold text-text-main text-base line-clamp-1">{transaction.title}</h3>
                   <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                      <span className="font-bold text-primary uppercase">{transaction.category?.name || "Uncategorized"}</span>
                      <span className="opacity-30">•</span>
                      <span>{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
                   </div>
                </div>
             </div>

             <div className="flex justify-between items-end pt-4 border-t border-slate-200/60">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Amount</p>
                   <p className={`text-xl font-black ${transaction.type === "income" ? "text-emerald-600" : "text-text-main"}`}>
                      {transaction.type === "income" ? "+" : "-"}${Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </p>
                </div>
                <div className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-text-muted uppercase shadow-sm">
                   Preview
                </div>
             </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-amber-800 text-xs leading-relaxed">
             <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
             <p>Are you sure you want to remove this transaction? This will update your balances and budget usage immediately.</p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-8 pt-4 shrink-0">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="group relative w-full py-4 rounded-2xl bg-rose-600 text-white font-bold text-lg hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden shadow-xl shadow-rose-200"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {isDeleting ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Transaction</span>
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
          </button>
          
          <button
            onClick={onCancel}
            className="w-full mt-4 py-2 text-xs font-bold text-text-muted hover:text-text-main transition-colors uppercase tracking-widest"
          >
            No, keep it
          </button>
        </div>
      </div>
    </div>
  );
}
