import { useEffect, useState } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { useInsightStore } from "../store/useInsightStore";
import { Loader } from "lucide-react";

// Components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import SummaryStats from "../components/dashboard/SummaryStats";
import BudgetAlerts from "../components/dashboard/BudgetAlerts";
import CashflowChart from "../components/dashboard/CashflowChart";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import ExpenseDistribution from "../components/dashboard/ExpenseDistribution";
import RecentTransactions from "../components/dashboard/RecentTransactions";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function DashboardPage() {
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const { transactions, fetchTransactions, isLoading: isTxLoading } = useTransactionStore();
  const { 
    summary, 
    expenseDistribution, 
    monthlyTrend, 
    budgetVsActual, 
    isLoading: isInsightLoading, 
    fetchAllInsights 
  } = useInsightStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchAllInsights({ periodMonth: filterMonth, periodYear: filterYear });
  }, [fetchAllInsights, filterMonth, filterYear]);

  const isLoading = isTxLoading || isInsightLoading;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <DashboardHeader 
        month={filterMonth} 
        year={filterYear} 
        onMonthChange={setFilterMonth} 
        onYearChange={setFilterYear} 
        months={months}
      />

      {!isLoading && <BudgetAlerts data={budgetVsActual} />}

      <SummaryStats summary={summary} />

      {isLoading ? (
        <div className="flex min-h-[44vh] items-center justify-center rounded-3xl border border-slate-200 bg-surface p-8 shadow-sm">
          <Loader className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8 mt-8">
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <CashflowChart data={monthlyTrend} />
            <BudgetProgress data={budgetVsActual} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <ExpenseDistribution data={expenseDistribution} />
            <RecentTransactions transactions={transactions} />
          </div>
        </div>
      )}
    </div>
  );
}
