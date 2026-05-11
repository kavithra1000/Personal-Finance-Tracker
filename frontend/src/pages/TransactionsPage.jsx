import { useEffect, useMemo, useState } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { format, isToday, isYesterday, startOfDay } from "date-fns";
import { 
  Plus, Trash2, Edit3, ArrowUpRight, ArrowDownRight, 
  Loader, Search, Filter, Calendar, Tag, ChevronRight,
  TrendingUp, TrendingDown, Wallet, ArrowUpDown, ChevronDown
} from "lucide-react";
import TransactionForm from "../components/TransactionForm";

export default function TransactionsPage() {
  const { 
    transactions, isLoading, fetchTransactions, addTransaction, 
    deleteTransaction, updateTransaction, isDeleting, isUpdating 
  } = useTransactionStore();
  
  const { categories, fetchCategories } = useCategoryStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchTransactions({ type: filterType, category: filterCategory });
  }, [fetchTransactions, filterType, filterCategory]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id);
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowAddModal(true);
  };

  const handleClose = () => {
    setShowAddModal(false);
    setSelectedTransaction(null);
  };

  const handleSave = async (transactionData, id) => {
    if (id) {
      return await updateTransaction(id, transactionData);
    }
    return await addTransaction(transactionData);
  };

  const filteredTransactions = useMemo(() => {
    let result = transactions.filter(tx => 
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Apply Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount-high") return Number(b.amount) - Number(a.amount);
      if (sortBy === "amount-low") return Number(a.amount) - Number(b.amount);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [transactions, searchTerm, sortBy]);

  const stats = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = filteredTransactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    return { income, expense, total: income - expense };
  }, [filteredTransactions]);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(tx => {
      const date = startOfDay(new Date(tx.date)).toISOString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(tx);
    });
    
    return Object.entries(groups)
      .sort(([a], [b]) => {
         if (sortBy === "oldest") return new Date(a) - new Date(b);
         return new Date(b) - new Date(a);
      })
      .map(([date, items]) => ({
        date: new Date(date),
        items: items // items are already sorted by the main filteredTransactions sort
      }));
  }, [filteredTransactions]);

  const getDateHeader = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM dd, yyyy");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header section matching Dashboard style */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">Manage</p>
          <h1 className="mt-3 text-3xl font-semibold text-text-main">Transactions</h1>
        </div>
        
        <button
          onClick={() => {
            setSelectedTransaction(null);
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-white shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Transaction</span>
        </button>
      </div>

      {/* Stats Summary - Matching Dashboard card style */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <div className="p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm transition-all hover:shadow-md">
          <div className="p-2 w-fit rounded-2xl bg-emerald-50 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-text-muted">Filtered Income</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        
        <div className="p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm transition-all hover:shadow-md">
          <div className="p-2 w-fit rounded-2xl bg-rose-50 mb-4">
            <TrendingDown className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-sm font-medium text-text-muted">Filtered Expense</p>
          <p className="mt-1 text-2xl font-semibold text-rose-600">${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm transition-all hover:shadow-md">
          <div className="p-2 w-fit rounded-2xl bg-slate-100 mb-4">
            <Wallet className="w-5 h-5 text-slate-600" />
          </div>
          <p className="text-sm font-medium text-text-muted">Net Result</p>
          <p className={`mt-1 text-2xl font-semibold ${stats.total >= 0 ? "text-text-main" : "text-rose-600"}`}>
            {stats.total < 0 ? "-" : ""}${Math.abs(stats.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm transition-all hover:shadow-md">
          <div className="p-2 w-fit rounded-2xl bg-blue-50 mb-4">
            <Tag className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-text-muted">Active Filter</p>
          <p className="mt-1 text-2xl font-semibold text-primary capitalize">{filterType || "All"}</p>
        </div>
      </div>

      {/* Unified Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center justify-between">
        <div className="relative group w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-[1.5rem] bg-surface border border-slate-200 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-surface p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm w-full lg:w-auto">
          {/* Type Filter */}
          <div className="relative flex-1 lg:flex-none lg:w-40 min-w-[120px]">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilterCategory("");
              }}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-sm font-semibold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="w-px h-6 bg-slate-200 hidden lg:block" />

          {/* Category Filter */}
          <div className="relative flex-1 lg:flex-none lg:w-44 min-w-[140px]">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-sm font-semibold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="">All Categories</option>
              {categories.filter(c => !filterType || c.type === filterType).map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="w-px h-6 bg-slate-200 hidden lg:block" />

          {/* Sort Control */}
          <div className="relative flex-1 lg:flex-none lg:w-40 min-w-[120px]">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-sm font-semibold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="amount-high">Amount: High</option>
              <option value="amount-low">Amount: Low</option>
              <option value="title">Title (A-Z)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Transaction List Container */}
      <div className="bg-surface rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="p-24 flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-24 text-center">
            <p className="text-xl font-medium text-text-main">No transactions found</p>
            <p className="text-text-muted mt-2">Adjust your search or filters to see more results.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("");
                setFilterCategory("");
              }}
              className="mt-4 text-primary font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {groupedTransactions.map(group => (
              <div key={group.date.toISOString()}>
                <div className="bg-slate-50/50 px-6 py-3 border-y border-slate-100">
                   <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      {getDateHeader(group.date)}
                   </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {group.items.map(tx => (
                    <div 
                      key={tx._id} 
                      className="group flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                         <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${
                            tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          }`}>
                            {tx.type === "income" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                         </div>
                         <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-text-main">{tx.title}</h3>
                              {tx.category && (
                                <span 
                                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider"
                                  style={{ 
                                    backgroundColor: `${tx.category.color}15`, 
                                    color: tx.category.color,
                                  }}
                                >
                                  {tx.category.name}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-text-muted mt-0.5">
                               {format(new Date(tx.date), "hh:mm a")}
                               {tx.note && <span className="mx-1">•</span>}
                               {tx.note && <span className="italic">{tx.note}</span>}
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-6">
                         <p className={`text-lg font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-text-main"}`}>
                            {tx.type === "income" ? "+" : "-"}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </p>
                         
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(tx)}
                              className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(tx._id)}
                              disabled={isDeleting}
                              className="p-2 text-text-muted hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <TransactionForm
          transaction={selectedTransaction}
          onCancel={handleClose}
          onSave={handleSave}
          isSaving={isUpdating}
        />
      )}
    </div>
  );
}
