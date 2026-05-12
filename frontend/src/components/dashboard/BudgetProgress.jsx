import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";

export default function BudgetProgress({ data }) {
  const chartData = data.map((b) => ({
    name: b.category,
    budget: Number(b.budgetAmount),
    spent: Number(b.actualSpent),
    color: b.color || "#3b82f6",
  })).slice(0, 6); // Keep it clean

  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-5 md:p-6 shadow-sm flex flex-col h-full">
      <h2 className="text-lg md:text-xl font-bold text-text-main leading-tight">Budget Progress</h2>
      <p className="text-xs text-text-muted mt-0.5 mb-6">Tracking your monthly limits.</p>
      
      <div className="h-64 md:h-80 w-full flex-1">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-text-muted">
            No active budgets.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical" 
              margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }} 
                axisLine={false} 
                tickLine={false}
                width={70}
              />
              <Tooltip 
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{ 
                  borderRadius: "16px", 
                  border: "none", 
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "12px"
                }}
                formatter={(val) => `$${Number(val).toLocaleString()}`} 
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle" 
                wrapperStyle={{ 
                  paddingBottom: "25px", 
                  fontSize: "10px", 
                  fontWeight: "800", 
                  textTransform: "uppercase" 
                }} 
              />
              <Bar dataKey="budget" fill="#00ff91" radius={[0, 4, 4, 0]} name="Limit" barSize={10} />
              <Bar dataKey="spent" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Spent" barSize={10}>
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