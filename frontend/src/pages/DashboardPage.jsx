import { useEffect, useMemo, useState } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { useBudgetStore } from "../store/useBudgetStore";
import { Loader } from "lucide-react";

// Components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import SummaryStats from "../components/dashboard/SummaryStats";
import CashflowChart from "../components/dashboard/CashflowChart";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import ExpenseDistribution from "../components/dashboard/ExpenseDistribution";
import RecentTransactions from "../components/dashboard/RecentTransactions";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function DashboardPage() {
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const { transactions, isLoading: isTxLoading, fetchTransactions } = useTransactionStore();
  const { isLoading: isCatLoading, fetchCategories } = useCategoryStore();
  const { budgets, isLoading: isBgLoading, fetchBudgets } = useBudgetStore();

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [fetchCategories, fetchTransactions]);

  useEffect(() => {
    fetchBudgets({ periodMonth: filterMonth, periodYear: filterYear });
  }, [fetchBudgets, filterMonth, filterYear]);

  const isLoading = isTxLoading || isCatLoading || isBgLoading;

  // --- Logic for stats, charts, etc (Memoized) ---
  const stats = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const totalBudget = budgets.reduce((s, b) => s + Number(b.amount), 0);
    const totalSpent = budgets.reduce((s, b) => s + Number(b.spent || 0), 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      usage: totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 999) : 0,
    };
  }, [transactions, budgets]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <DashboardHeader 
        month={filterMonth} 
        year={filterYear} 
        onMonthChange={setFilterMonth} 
        onYearChange={setFilterYear} 
        months={months}
      />

      <SummaryStats stats={stats} />

      {isLoading ? (
        <div className="flex min-h-[44vh] items-center justify-center rounded-3xl border border-slate-200 bg-surface p-8 shadow-sm">
          <Loader className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8 mt-8">
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <CashflowChart transactions={transactions} month={filterMonth} year={filterYear} months={months} />
            <BudgetProgress budgets={budgets} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <ExpenseDistribution transactions={transactions} />
            <RecentTransactions transactions={transactions} />
          </div>
        </div>
      )}
    </div>
  );
}