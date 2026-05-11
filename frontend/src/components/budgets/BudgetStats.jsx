import React from 'react';
import { Target, TrendingDown, Wallet, AlertCircle } from 'lucide-react';

/**
 * Props:
 *  - summary: {
 *      totalBudget: number,
 *      totalSpent: number,
 *      totalRemaining: number,
 *      overBudgetCount: number,
 *    }
 */
export default function BudgetStats({ summary }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-4 mb-8">
      {/* Allocated */}
      <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
        <div className="p-2 w-fit rounded-xl bg-blue-50 mb-3 md:mb-4">
          <Target className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        </div>
        <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Allocated</p>
        <p className="mt-0.5 text-lg md:text-xl font-bold text-text-main truncate">
          {summary.totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Spent */}
      <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
        <div className="p-2 w-fit rounded-xl bg-rose-50 mb-3 md:mb-4">
          <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
        </div>
        <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Spent</p>
        <p className="mt-0.5 text-lg md:text-xl font-bold text-text-main truncate">
          {summary.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Remaining */}
      <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
        <div className="p-2 w-fit rounded-xl bg-emerald-50 mb-3 md:mb-4">
          <Wallet className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
        </div>
        <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Remaining</p>
        <p className="mt-0.5 text-lg md:text-xl font-bold text-emerald-600 truncate">
          {Math.max(0, summary.totalRemaining).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Alerts */}
      <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
        <div
          className={`p-2 w-fit rounded-xl mb-3 md:mb-4 ${summary.overBudgetCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-primary'}`}
        >
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Alerts</p>
        <p
          className={`mt-0.5 text-lg md:text-xl font-bold truncate ${summary.overBudgetCount > 0 ? 'text-rose-600' : 'text-text-main'}`}
        >
          {summary.overBudgetCount > 0 ? `${summary.overBudgetCount} Over` : 'None'}
        </p>
      </div>
    </div>
  );
}
