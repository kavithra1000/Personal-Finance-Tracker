import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";

export default function BudgetProgress({ data }) {
  const chartData = data.map((b) => ({
    name: b.category,
    budget: Number(b.budgetAmount),
    spent: Number(b.actualSpent),
    color: b.color || "#3b82f6",
  }));

  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-text-main">Budget progress</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Budget vs actual spend.</p>
      
      <div className="h-80">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-300 text-sm text-text-muted">
            No budgets set for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical" 
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12, fill: "#64748b" }} 
                axisLine={false} 
                tickLine={false}
                width={80}
              />
              <Tooltip 
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                formatter={(val) => `$${Number(val).toLocaleString()}`} 
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: "20px" }} />
              <Bar dataKey="budget" fill="#e2e8f0" radius={[0, 4, 4, 0]} name="Budget Limit" barSize={12} />
              <Bar dataKey="spent" radius={[0, 4, 4, 0]} name="Actual Spent" barSize={12}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.spent > entry.budget ? "#ef4444" : "#3b82f6"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}