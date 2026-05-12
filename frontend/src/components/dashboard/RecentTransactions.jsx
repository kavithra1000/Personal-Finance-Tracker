import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecentTransactions({ transactions }) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  function capitalizeFirstLetter(text) {
    if (!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-5 md:p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-text-main leading-tight">Recent Activity</h2>
          <p className="text-xs text-text-muted mt-0.5">Your latest transactions.</p>
        </div>
        <Link to="/transactions" className="text-xs font-bold text-primary hover:underline whitespace-nowrap">View All</Link>
      </div>

      <div className="space-y-3 md:space-y-4 flex-1">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-text-muted border border-dashed border-slate-200 rounded-3xl h-full min-h-[240px]">
            <p>No activity found.</p>
          </div>
        ) : (
          recent.map((tx) => (
            <div key={tx._id} className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 md:p-4 transition-all hover:bg-slate-50">
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <div className={`shrink-0 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl ${tx.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                  }`}>
                  {tx.type === "income" ? <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" /> : <ArrowDownRight className="h-4 w-4 md:h-5 md:w-5" />}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-text-main text-sm group-hover:text-primary transition-colors truncate">{capitalizeFirstLetter(tx.title)}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-text-muted whitespace-nowrap">{format(new Date(tx.date), "MMM dd")}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] font-bold text-primary truncate max-w-[80px]">{tx.category?.name || "Uncategorized"}</span>
                  </div>
                </div>
              </div>
              <p className={`text-sm md:text-base font-black shrink-0 ml-3 ${tx.type === "income" ? "text-emerald-600" : "text-text-main"}`}>
                {tx.type === "income" ? "+" : "-"}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}