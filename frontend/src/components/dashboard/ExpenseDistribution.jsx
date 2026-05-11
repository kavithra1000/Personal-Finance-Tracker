import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useMemo } from "react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6", "#f97316"];

export default function ExpenseDistribution({ transactions }) {
  const data = useMemo(() => {
    const map = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((acc, tx) => {
        const name = tx.category?.name || "Uncategorized";
        acc[name] = (acc[name] || 0) + Number(tx.amount);
        return acc;
      }, {});

    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 7);
  }, [transactions]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-text-main">Expense distribution</h2>
      <div className="h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              label={({ name }) => name} // ADDED LABELS HERE
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => `$${Number(val).toFixed(2)}`} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}