import { Tag, Edit3, Trash2 } from 'lucide-react';

/**
 * Props:
 *  - budget: object containing budget details
 *  - monthNames: string[] for month display
 *  - handleEdit: (budget) => void
 *  - handleDelete: (budget) => void
 */
export default function BudgetCard({ budget, monthNames, handleEdit, handleDelete }) {
  const ratio = budget.usageRatio;
  const isOver = budget.isExceeded;
  const isNearLimit = !isOver && ratio >= 80;
  const categoryName = budget.category?.name || 'Unknown';
  const categoryColor = budget.category?.color || '#3b82f6';

  return (
    <div
      className="group relative bg-surface rounded-3xl border border-slate-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Visual Accent */}
      <div
        className="absolute top-0 left-0 w-full h-1.5 opacity-20"
        style={{ backgroundColor: categoryColor }}
      />

      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
          <div
            className="h-10 w-10 md:h-12 md:w-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
            style={{ backgroundColor: categoryColor }}
          >
            <Tag className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-text-main text-base md:text-lg truncate">
              {categoryName}
            </h3>
            <p className="text-[10px] md:text-[11px] font-bold text-text-muted uppercase tracking-widest truncate">
              {monthNames[budget.periodMonth - 1]} {budget.periodYear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:translate-x-2 sm:group-hover:translate-x-0 shrink-0">
          <button
            onClick={() => handleEdit(budget)}
            className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(budget)}
            className="p-2 text-text-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all hidden"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-6 md:mb-8">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <p className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest">
              Progress
            </p>
            {isOver && (
              <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[8px] md:text-[9px] font-black uppercase tracking-tighter border border-rose-100">
                Exceeded
              </span>
            )}
            {isNearLimit && (
              <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[8px] md:text-[9px] font-black uppercase tracking-tighter border border-amber-100">
                Warning
              </span>
            )}
          </div>
          <p className={`text-xs md:text-sm font-black ${isOver ? 'text-rose-600' : isNearLimit ? 'text-amber-600' : 'text-primary'}`}>
            {ratio.toFixed(0)}%
          </p>
        </div>
        <div className="h-2 md:h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isOver ? 'bg-rose-500' : ratio > 80 ? 'bg-amber-500' : 'bg-primary'}`}
            style={{ width: `${Math.min(ratio, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-5 md:pt-6 border-t border-slate-50">
        <div className="space-y-1">
          <p className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest">
            Limit
          </p>
          <p className="text-lg md:text-xl font-bold text-text-main tracking-tight">
            {Number(budget.amount).toLocaleString()}$
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest">
            {isOver ? 'Deficit' : 'Available'}
          </p>
          <p className={`text-lg md:text-xl font-bold tracking-tight ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
            {Math.abs(Number(budget.remaining)).toLocaleString()}$
          </p>
        </div>
      </div>
    </div>
  );
}
