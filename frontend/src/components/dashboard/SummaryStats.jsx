import { TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react";

export default function SummaryStats({ summary }) {
  const cards = [
    { 
      label: "Total income", 
      value: summary.totalIncome, 
      color: "text-emerald-600", 
      bgColor: "bg-emerald-50",
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />
    },
    { 
      label: "Total expenses", 
      value: summary.totalExpense, 
      color: "text-rose-600", 
      bgColor: "bg-rose-50",
      icon: <TrendingDown className="h-5 w-5 text-rose-600" />
    },
    { 
      label: "Current balance", 
      value: summary.balance, 
      color: "text-text-main", 
      bgColor: "bg-slate-100",
      icon: <Wallet className="h-5 w-5 text-slate-600" />
    },
    { 
      label: "Budget usage", 
      value: summary.usage !== undefined ? `${summary.usage.toFixed(0)}%` : "0%", 
      color: "text-primary", 
      bgColor: "bg-blue-50",
      icon: <PieChart className="h-5 w-5 text-primary" />
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 w-full">
      {cards.map((card) => (
        <div key={card.label} className="rounded-3xl border border-slate-200 bg-surface p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-2xl ${card.bgColor}`}>
              {card.icon}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-text-muted">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold ${card.color}`}>
              {typeof card.value === "number" ? `$${card.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}