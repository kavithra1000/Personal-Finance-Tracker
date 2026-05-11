import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function CashflowChart({ transactions, month, year, months }) {
  const data = useMemo(() => {
    const labels = [];
    // Build last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(year, month - 1 - i, 1);
      labels.push({
        key: `${date.getFullYear()}-${date.getMonth() + 1}`,
        label: `${months[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`,
      });
    }

    const monthMap = labels.reduce((map, l) => ({ ...map, [l.key]: { income: 0, expense: 0, month: l.label } }), {});

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const k = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (monthMap[k]) {
        if (tx.type === "income") monthMap[k].income += Number(tx.amount);
        else monthMap[k].expense += Number(tx.amount);
      }
    });

    return Object.values(monthMap);
  }, [transactions, month, year, months]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-text-main">Monthly income vs expenses</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Last 6 months of cash flow.</p>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val) => `$${Number(val).toFixed(2)}`} />
            <Legend />
            <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}