import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6", "#f97316"];

export default function ExpenseDistribution({ data }) {
  const chartData = data.map((item) => ({
    name: item.category,
    value: Number(item.amount),
    color: item.color,
  }));

  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-5 md:p-6 shadow-sm flex flex-col h-full">
      <h2 className="text-lg md:text-xl font-bold text-text-main leading-tight">Expense Mix</h2>
      <p className="text-xs text-text-muted mt-0.5 mb-6">Spending by category.</p>
      
      <div className="h-64 md:h-80 w-full flex-1">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-text-muted">
            No expenses found.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={window.innerWidth < 768 ? 50 : 70}
                outerRadius={window.innerWidth < 768 ? 70 : 100}
                paddingAngle={4}
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
                contentStyle={{ 
                  borderRadius: "16px", 
                  border: "none", 
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "12px"
                }}
                formatter={(val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 0 })}`} 
              />
              <Legend 
                verticalAlign="bottom" 
                align="center" 
                iconType="circle"
                wrapperStyle={{ 
                  paddingTop: "20px",
                  fontSize: "10px",
                  fontWeight: "700",
                  textTransform: "uppercase"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}