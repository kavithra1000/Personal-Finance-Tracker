import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6", "#f97316"];

export default function ExpenseDistribution({ data }) {
  const chartData = data.map((item) => ({
    name: item.category,
    value: Number(item.amount),
    color: item.color,
  }));

  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-text-main">Expense distribution</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Where your money goes.</p>
      
      <div className="h-80">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-300 text-sm text-text-muted">
            No expenses found for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                formatter={(val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
              />
              <Legend verticalAlign="bottom" align="center" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}