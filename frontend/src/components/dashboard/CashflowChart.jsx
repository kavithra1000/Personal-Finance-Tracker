import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function CashflowChart({ data }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-text-main">Monthly income vs expenses</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Last 6 months of cash flow.</p>
      <div className="h-80">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-300 text-sm text-text-muted">
            No data available for the trend.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: "#64748b" }} 
                axisLine={false} 
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "#64748b" }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                formatter={(val) => `$${Number(val).toLocaleString()}`} 
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: "20px" }} />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" barSize={30} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}