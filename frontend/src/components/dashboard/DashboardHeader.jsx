export default function DashboardHeader({ month, year, onMonthChange, onYearChange, months }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-text-main">Financial overview</h1>
      </div>

      <div className="flex items-center gap-3 bg-surface p-2 rounded-3xl border border-slate-200 shadow-sm">
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="rounded-2xl bg-background px-4 py-2 text-sm outline-none border-none focus:ring-2 focus:ring-primary/20"
        >
          {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="w-24 rounded-2xl bg-background px-4 py-2 text-sm outline-none border-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}