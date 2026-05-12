import { Tag, Edit3, Trash2, TrendingDown, TrendingUp, Activity, DollarSign } from 'lucide-react';

/**
 * Props:
 *  - category: object with fields _id, name, type, color, etc.
 *  - insight: { totalCount: number, monthlyAmount: number }
 *  - handleEdit: (category) => void
 *  - handleDelete: (category) => void
 */
export default function CategoryCard({ category, insight, handleEdit, handleDelete }) {

  function capitalizeFirstLetter(text) {
    if (!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return (
    <div
      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 px-4 md:px-8 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-4 md:gap-5">
        <div
          className="h-10 w-10 md:h-11 md:w-11 rounded-2xl flex items-center justify-center text-white shadow-sm border-2 border-white shrink-0"
          style={{ backgroundColor: category.color }}
        >
          <Tag className="w-5 h-5 drop-shadow-sm" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <h3 className="font-bold text-text-main text-base md:text-lg leading-none truncate">
              {capitalizeFirstLetter(category.name)}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-wider border whitespace-nowrap ${category.type === 'expense'
                  ? 'bg-rose-50 text-rose-600 border-rose-100'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}
            >
              {category.type === 'expense' ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />}
              {category.type}
            </span>
          </div>
          <div className="text-[10px] md:text-xs text-text-muted mt-1.5 flex flex-wrap items-center gap-2 md:gap-3">
            <span className="flex items-center gap-1 font-medium">
              <Activity className="w-3 h-3" />
              {insight.totalCount} {insight.totalCount === 1 ? 'Tx' : 'Txs'}
            </span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1 font-bold text-slate-500">
              <DollarSign className="w-3 h-3" />
              ${insight.monthlyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} this month
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:translate-x-2 sm:group-hover:translate-x-0">
        <button
          onClick={() => handleEdit(category)}
          className="p-2 md:p-2.5 text-text-muted hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
          title="Edit Category"
        >
          <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button
          onClick={() => handleDelete(category)}
          className="p-2 md:p-2.5 text-text-muted hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
          title="Delete Category"
        >
          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}
