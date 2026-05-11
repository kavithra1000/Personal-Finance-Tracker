import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useTransactionStore } from "../store/useTransactionStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { useBudgetStore } from "../store/useBudgetStore";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Loader } from "lucide-react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6", "#f97316"];

function buildMonthLabels(currentMonth, currentYear, monthsBack = 5) {
  const labels = [];
  for (let i = monthsBack; i >= 0; i -= 1) {
    const date = new Date(currentYear, currentMonth - 1 - i, 1);
    labels.push({
      key: `${date.getFullYear()}-${date.getMonth() + 1}`,
      label: `${months[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
  }
  return labels;
}

export default function DashboardPage() {
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const {
    transactions,
    isLoading: isTransactionsLoading,
    fetchTransactions,
  } = useTransactionStore();

  const {
    categories,
    isLoading: isCategoriesLoading,
    fetchCategories,
  } = useCategoryStore();

  const {
    budgets,
    isLoading: isBudgetsLoading,
    fetchBudgets,
  } = useBudgetStore();

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [fetchCategories, fetchTransactions]);

  useEffect(() => {
    fetchBudgets({ periodMonth: filterMonth, periodYear: filterYear });
  }, [fetchBudgets, filterMonth, filterYear]);

  const isLoading = isTransactionsLoading || isCategoriesLoading || isBudgetsLoading;

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const totalExpenses = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.amount), 0);
    const totalBudgetSpent = budgets.reduce((sum, budget) => sum + Number(budget.spent || 0), 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      totalBudget,
      totalBudgetSpent,
      budgetUsage: totalBudget > 0 ? Math.min((totalBudgetSpent / totalBudget) * 100, 999) : 0,
      overBudgetCount: budgets.filter((budget) => budget.isExceeded).length,
    };
  }, [transactions, budgets]);

  const expenseDistribution = useMemo(() => {
    const categoryMap = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((map, tx) => {
        const name = tx.category?.name || "Uncategorized";
        map[name] = (map[name] || 0) + Number(tx.amount);
        return map;
      }, {});

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [transactions]);

  const monthlyCashflow = useMemo(() => {
    const labels = buildMonthLabels(filterMonth, filterYear, 5);
    const monthMap = labels.reduce((map, label) => ({ ...map, [label.key]: { income: 0, expense: 0, label: label.label } }), {});

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (monthMap[key]) {
        if (tx.type === "income") {
          monthMap[key].income += Number(tx.amount);
        } else {
          monthMap[key].expense += Number(tx.amount);
        }
      }
    });

    return labels.map((label) => ({
      month: label.label,
      income: monthMap[label.key].income,
      expense: monthMap[label.key].expense,
    }));
  }, [transactions, filterMonth, filterYear]);

  const budgetVsActual = useMemo(
    () => budgets.map((budget, index) => ({
      name: budget.category?.name || `Budget ${index + 1}`,
      budget: Number(budget.amount),
      spent: Number(budget.spent || 0),
    })),
    [budgets]
  );

  const recentTransactions = useMemo(
    () => [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8),
    [transactions]
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-text-main">Financial overview</h1>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">A quick look at your income, expenses, budgets, and spending patterns.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 w-full max-w-lg">
          <div className="rounded-3xl border border-slate-200 bg-surface p-4 shadow-sm">
            <p className="text-sm text-text-muted">Total income</p>
            <p className="mt-3 text-2xl font-semibold text-emerald-600">${stats.totalIncome.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-surface p-4 shadow-sm">
            <p className="text-sm text-text-muted">Total expenses</p>
            <p className="mt-3 text-2xl font-semibold text-rose-600">${stats.totalExpenses.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-surface p-4 shadow-sm">
            <p className="text-sm text-text-muted">Current balance</p>
            <p className="mt-3 text-2xl font-semibold text-text-main">${stats.balance.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-surface p-4 shadow-sm">
            <p className="text-sm text-text-muted">Budget usage</p>
            <p className="mt-3 text-2xl font-semibold text-primary">{stats.budgetUsage.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[44vh] items-center justify-center rounded-3xl border border-slate-200 bg-surface p-8 shadow-sm">
          <Loader className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-text-main">Monthly income vs expenses</h2>
                  <p className="text-sm text-text-muted mt-1">Last 6 months of cash flow.</p>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyCashflow} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-text-main">Budget progress</h2>
                  <p className="text-sm text-text-muted mt-1">Current month budget vs actual spend.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(Number(e.target.value))}
                    className="rounded-2xl border border-slate-200 bg-background px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index + 1}>{month}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="2023"
                    value={filterYear}
                    onChange={(e) => setFilterYear(Number(e.target.value))}
                    className="rounded-2xl border border-slate-200 bg-background px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {budgetVsActual.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-text-muted">
                  No budgets found for the selected period.
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetVsActual} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="budget" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="spent" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-text-main">Expense distribution</h2>
                  <p className="text-sm text-text-muted mt-1">Where your spending is going.</p>
                </div>
              </div>

              {expenseDistribution.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-text-muted">
                  No expense data available yet.
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                      >
                        {expenseDistribution.map((entry, index) => (
                          <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-text-main">Recent transactions</h2>
                <p className="text-sm text-text-muted mt-1">Most recent activity.</p>
              </div>

              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-text-muted">
                    No recent transactions.
                  </div>
                ) : (
                  recentTransactions.map((tx) => (
                    <div key={tx._id} className="rounded-3xl border border-slate-200 bg-background p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-text-main">{tx.title}</p>
                          <p className="text-sm text-text-muted mt-1">{format(new Date(tx.date), "MMM dd, yyyy")}</p>
                        </div>
                        <p className={`font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                          ${Number(tx.amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{tx.type}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">{tx.category?.name || "Uncategorized"}</span>
                        {tx.note && <span className="rounded-full bg-slate-100 px-3 py-1">{tx.note}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
