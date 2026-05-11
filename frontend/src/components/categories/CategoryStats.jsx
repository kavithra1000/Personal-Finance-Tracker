import React from 'react';
import { Layers, TrendingDown, TrendingUp } from 'lucide-react';

/**
 * Props:
 *  - stats: { total: number, expenses: number, income: number }
 */
export default function CategoryStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
      {/* Total */}
      <div className="bg-surface p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5 transition-all hover:shadow-md">
        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-blue-50 text-primary">
          <Layers className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Total</p>
          <p className="text-xl md:text-2xl font-bold text-text-main">{stats.total}</p>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-surface p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5 transition-all hover:shadow-md">
        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-rose-50 text-rose-600">
          <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Expenses</p>
          <p className="text-xl md:text-2xl font-bold text-text-main">{stats.expenses}</p>
        </div>
      </div>

      {/* Income */}
      <div className="bg-surface p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5 transition-all hover:shadow-md">
        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-emerald-50 text-emerald-600">
          <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Income</p>
          <p className="text-xl md:text-2xl font-bold text-text-main">{stats.income}</p>
        </div>
      </div>
    </div>
  );
}
