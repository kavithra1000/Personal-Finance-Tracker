import { AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function BudgetAlerts({ data }) {
  const overBudgets = data.filter((b) => b.actualSpent > b.budgetAmount);

  if (overBudgets.length === 0) return null;

  return (
    <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50/50 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-rose-100 p-2 text-rose-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-rose-900">Budget Exceeded</h3>
          <p className="text-sm text-rose-700 mt-1">
            You've exceeded your budget in {overBudgets.length} {overBudgets.length === 1 ? "category" : "categories"}. Consider reviewing your spending.
          </p>
          
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {overBudgets.map((b) => (
              <div key={b.category} className="rounded-2xl border border-rose-100 bg-white/60 p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-rose-900">{b.category}</p>
                  <p className="text-xs text-rose-600">
                    Over by <span className="font-bold">${(b.actualSpent - b.budgetAmount).toFixed(2)}</span>
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-rose-50 flex items-center justify-center">
                   <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Link 
          to="/budgets" 
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-rose-700 hover:text-rose-900 transition-colors"
        >
          Manage Budgets <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
