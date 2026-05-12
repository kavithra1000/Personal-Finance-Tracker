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
import ReportDownload from "../components/dashboard/ReportDownload";

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

  console.log("Budget vs Actual:", budgetVsActual);

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
      <DashboardHeader
        month={filterMonth}
        year={filterYear}
        onMonthChange={setFilterMonth}
        onYearChange={setFilterYear}
        months={months}
      />

      <div className="flex flex-col gap-2">
        <p className="hidden lg:block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 ml-1">
          Download Statements
        </p>
        <ReportDownload month={filterMonth} year={filterYear} />
      </div>

      <div className="space-y-6 md:space-y-8">
        {!isLoading && budgetVsActual.some(b => b.actualSpent > b.budgetAmount) && (
          <BudgetAlerts data={budgetVsActual} />
        )}

        <SummaryStats summary={summary} />

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-slate-200 bg-surface p-8 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <Loader className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Calculating Insights...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Main Charts Row */}
            <div className="lg:col-span-1">
              <CashflowChart data={monthlyTrend} />
            </div>
            <div className="lg:col-span-1">
              <BudgetProgress data={budgetVsActual} />
            </div>

            {/* Distribution and Activity Row */}
            <div className="lg:col-span-1">
              <ExpenseDistribution data={expenseDistribution} />
            </div>
            <div className="lg:col-span-1">
              <RecentTransactions transactions={transactions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
