export default function SummaryStats({ stats }) {
  const cards = [
    { label: "Total income", value: stats.totalIncome, color: "text-emerald-600" },
    { label: "Total expenses", value: stats.totalExpenses, color: "text-rose-600" },
    { label: "Current balance", value: stats.balance, color: "text-text-main" },
    { label: "Budget usage", value: `${stats.usage.toFixed(0)}%`, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 w-full">
      {cards.map((card) => (
        <div key={card.label} className="rounded-3xl border border-slate-200 bg-surface p-4 shadow-sm">
          <p className="text-sm text-text-muted">{card.label}</p>
          <p className={`mt-3 text-2xl font-semibold ${card.color}`}>
            {typeof card.value === "number" ? `$${card.value.toFixed(2)}` : card.value}
          </p>
        </div>
      ))}
    </div>
  );
}