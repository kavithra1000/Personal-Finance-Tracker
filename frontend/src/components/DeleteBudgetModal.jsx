import { X, Trash2, Loader, AlertTriangle, PiggyBank, Calendar, DollarSign } from "lucide-react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function DeleteBudgetModal({ budget, onConfirm, onCancel, isDeleting }) {
  if (!budget) return null;

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
              <h2 className="text-xl font-bold text-text-main leading-tight">Remove Budget</h2>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-0.5">This limit will be removed</p>
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
          {/* Budget Preview Card */}
          <div className="mb-6 p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner">
             <div className="flex items-center gap-4 mb-4">
                <div 
                  className="h-11 w-11 flex items-center justify-center rounded-2xl text-white shadow-sm"
                  style={{ backgroundColor: budget.category?.color || '#3b82f6' }}
                >
                  <PiggyBank className="h-6 w-6" />
                </div>
                <div>
                   <h3 className="font-bold text-text-main text-base line-clamp-1">{budget.category?.name || "Budget"}</h3>
                   <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span className="font-bold uppercase tracking-wider">{months[budget.periodMonth - 1]} {budget.periodYear}</span>
                   </div>
                </div>
             </div>

             <div className="flex justify-between items-end pt-4 border-t border-slate-200/60">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Limit Amount</p>
                   <p className="text-xl font-black text-text-main">
                      ${Number(budget.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </p>
                </div>
                <div className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-text-muted uppercase shadow-sm">
                   Preview
                </div>
             </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-amber-800 text-xs leading-relaxed">
             <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
             <p>Are you sure you want to remove this budget? You can always recreate it later if you need to set this spending limit again.</p>
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
                  <span>Confirm Deletion</span>
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
          </button>
          
          <button
            onClick={onCancel}
            className="w-full mt-4 py-2 text-xs font-bold text-text-muted hover:text-text-main transition-colors uppercase tracking-widest"
          >
            Keep this budget
          </button>
        </div>
      </div>
    </div>
  );
}
