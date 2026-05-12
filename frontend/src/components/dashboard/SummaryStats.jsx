import { TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react";

export default function SummaryStats({ summary }) {
  const cards = [
    { 
      label: "Income", 
      value: summary.totalIncome, 
      color: "text-emerald-600", 
      bgColor: "bg-emerald-50",
      icon: <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
    },
    { 
      label: "Expenses", 
      value: summary.totalExpense, 
      color: "text-rose-600", 
      bgColor: "bg-rose-50",
      icon: <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-rose-600" />
    },
    { 
      label: "Balance", 
      value: summary.balance, 
      color: "text-text-main", 
      bgColor: "bg-slate-100",
      icon: <Wallet className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
    },
    { 
      label: "Usage", 
      value: summary.usage !== undefined ? `${summary.usage.toFixed(0)}%` : "0%", 
      color: "text-primary", 
      bgColor: "bg-blue-50",
      icon: <PieChart className="h-4 w-4 md:h-5 md:w-5 text-primary" />
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-4 w-full">
      {cards.map((card) => (
        <div key={card.label} className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
          <div className={`p-2 w-fit rounded-xl md:rounded-2xl ${card.bgColor} mb-3 md:mb-4`}>
            {card.icon}
          </div>
          <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">{card.label}</p>
          <p className={`mt-0.5 text-lg md:text-xl font-bold truncate ${card.color}`}>
            {typeof card.value === "number" ? `$${card.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : card.value}
          </p>
        </div>
      ))}
    </div>
  );
}