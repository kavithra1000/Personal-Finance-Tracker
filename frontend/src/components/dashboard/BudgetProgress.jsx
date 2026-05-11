import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function BudgetProgress({ budgets }) {
  const chartData = budgets.map((b, i) => ({
    name: b.category?.name || `Budget ${i + 1}`,
    budget: Number(b.amount),
    spent: Number(b.spent || 0),
  }));

  return (
    <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-text-main">Budget progress</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Budget vs actual spend.</p>
      
      {chartData.length === 0 ? (
        <div className="flex h-80 items-center justify-center rounded-3xl border border-dashed border-slate-300 text-sm text-text-muted">
          No budgets found for this period.
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(val) => `$${Number(val).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="budget" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="spent" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}