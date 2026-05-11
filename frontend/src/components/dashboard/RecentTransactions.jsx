import { format } from "date-fns";

export default function RecentTransactions({ transactions }) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-text-main">Recent transactions</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Most recent activity.</p>
      
      <div className="space-y-3">
        {recent.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-muted border border-dashed border-slate-300 rounded-3xl">
            No transactions found.
          </div>
        ) : (
          recent.map((tx) => (
            <div key={tx._id} className="rounded-2xl border border-slate-100 bg-background p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-text-main">{tx.title}</p>
                <p className="text-xs text-text-muted">{format(new Date(tx.date), "MMM dd, yyyy")}</p>
              </div>
              <p className={`font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                {tx.type === "income" ? "+" : "-"}${Number(tx.amount).toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}