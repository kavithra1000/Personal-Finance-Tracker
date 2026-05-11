import { TrendingUp, TrendingDown, Wallet, Tag } from "lucide-react";

export default function TransactionSummary({ stats, activeFilter }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-4 mb-8">
      <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
        <div className="p-2 w-fit rounded-xl bg-emerald-50 mb-3 md:mb-4">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
        </div>
        <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Income</p>
        <p className="mt-0.5 text-lg md:text-xl font-bold text-emerald-600 truncate">
          ${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
      
      <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
        <div className="p-2 w-fit rounded-xl bg-rose-50 mb-3 md:mb-4">
          <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
        </div>
        <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Expense</p>
        <p className="mt-0.5 text-lg md:text-xl font-bold text-rose-600 truncate">
          ${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
        <div className="p-2 w-fit rounded-xl bg-slate-100 mb-3 md:mb-4">
          <Wallet className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
        </div>
        <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Net Result</p>
        <p className={`mt-0.5 text-lg md:text-xl font-bold truncate ${stats.total >= 0 ? "text-text-main" : "text-rose-600"}`}>
          {stats.total < 0 ? "-" : ""}${Math.abs(stats.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
        <div className="p-2 w-fit rounded-xl bg-blue-50 mb-3 md:mb-4">
          <Tag className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        </div>
        <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Active</p>
        <p className="mt-0.5 text-lg md:text-xl font-bold text-primary truncate capitalize">{activeFilter || "All"}</p>
      </div>
    </div>
  );
}
