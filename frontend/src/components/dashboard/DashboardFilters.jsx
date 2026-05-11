export default function DashboardFilters({
  months,
  filterMonth,
  setFilterMonth,
  filterYear,
  setFilterYear,
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <select
        value={filterMonth}
        onChange={(e) => setFilterMonth(Number(e.target.value))}
        className="rounded-2xl border border-slate-200 bg-background px-4 py-2 text-sm"
      >
        {months.map((month, index) => (
          <option key={month} value={index + 1}>
            {month}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="2023"
        value={filterYear}
        onChange={(e) => setFilterYear(Number(e.target.value))}
        className="rounded-2xl border border-slate-200 bg-background px-4 py-2 text-sm"
      />
    </div>
  );
}