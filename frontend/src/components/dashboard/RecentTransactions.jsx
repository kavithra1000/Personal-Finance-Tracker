import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function RecentTransactions({ transactions }) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-text-main">Recent transactions</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Most recent activity.</p>
      
      <div className="space-y-4">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-text-muted border border-dashed border-slate-300 rounded-3xl h-64">
            <p>No transactions found.</p>
          </div>
        ) : (
          recent.map((tx) => (
            <div key={tx._id} className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  tx.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                }`}>
                  {tx.type === "income" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-semibold text-text-main group-hover:text-primary transition-colors">{tx.title}</p>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    {tx.category?.name || "Uncategorized"} • {format(new Date(tx.date), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <p className={`text-lg font-bold ${tx.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                {tx.type === "income" ? "+" : "-"}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}