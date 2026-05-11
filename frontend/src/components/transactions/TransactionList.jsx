import { 
  ArrowUpRight, ArrowDownRight, Calendar, Edit3, Trash2, Search, Loader 
} from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

export default function TransactionList({ 
  groupedTransactions, 
  isLoading, 
  onEdit, 
  onDelete, 
  isDeleting,
  onResetFilters 
}) {
  const getDateHeader = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM dd, yyyy");
  };

  if (isLoading) {
    return (
      <div className="bg-surface rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (groupedTransactions.length === 0) {
    return (
      <div className="bg-surface rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Search className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-xl font-bold text-text-main">No records found</p>
        <p className="text-text-muted mt-2 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
        <button
          onClick={onResetFilters}
          className="mt-6 px-6 py-2 rounded-xl bg-slate-100 text-text-main font-bold hover:bg-slate-200 transition-all"
        >
          Reset all filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
      {groupedTransactions.map(group => (
        <div key={group.date.toISOString()}>
          <div className="bg-slate-50/80 px-4 md:px-8 py-3 border-y border-slate-100 sticky top-0 z-10 backdrop-blur-sm">
            <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-widest">
              {getDateHeader(group.date)}
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {group.items.map(tx => (
              <div 
                key={tx._id} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 md:px-8 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-start md:items-center gap-3 md:gap-5">
                  <div className={`h-11 w-11 md:h-12 md:w-12 shrink-0 flex items-center justify-center rounded-2xl ${
                    tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  } shadow-sm`}>
                    {tx.type === "income" ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownRight className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-text-main text-sm md:text-base truncate">{tx.title}</h3>
                      {tx.category && (
                        <span 
                          className="px-2 py-0.5 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                          style={{ 
                            backgroundColor: `${tx.category.color}15`, 
                            color: tx.category.color,
                            border: `1px solid ${tx.category.color}20`
                          }}
                        >
                          {tx.category.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-text-muted mt-1">
                      <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(tx.date), "hh:mm a")}
                      </span>
                      {tx.description && <span className="hidden sm:inline opacity-50">•</span>}
                      {tx.description && <span className="truncate italic hidden sm:inline max-w-[200px]">{tx.description}</span>}
                    </div>
                    {tx.description && <p className="sm:hidden text-[10px] text-text-muted mt-1 italic truncate">{tx.description}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <p className={`text-base md:text-xl font-black ${tx.type === "income" ? "text-emerald-600" : "text-text-main"}`}>
                    {tx.type === "income" ? "+" : "-"}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  
                  <div className="flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-2 md:p-2.5 text-text-muted hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(tx)}
                      disabled={isDeleting}
                      className="p-2 md:p-2.5 text-text-muted hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
