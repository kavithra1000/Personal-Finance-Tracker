import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function CashflowChart({ data }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-5 md:p-6 shadow-sm">
      <h2 className="text-lg md:text-xl font-bold text-text-main leading-tight">Cash Flow Trend</h2>
      <p className="text-xs text-text-muted mt-0.5 mb-6">Income vs expenses (last 6 months).</p>
      
      <div className="h-64 md:h-80 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-text-muted">
            No trend data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }} 
                axisLine={false} 
                tickLine={false}
                dy={10}
              />
              <YAxis 
                tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
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
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }} 
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" barSize={window.innerWidth < 768 ? 12 : 24} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" barSize={window.innerWidth < 768 ? 12 : 24} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}