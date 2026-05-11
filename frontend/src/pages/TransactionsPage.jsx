import { useEffect, useMemo, useState } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { format, isToday, isYesterday, startOfDay } from "date-fns";
import { 
  Plus, Trash2, Edit3, ArrowUpRight, ArrowDownRight, 
  Loader, Search, Filter, Calendar, Tag, ChevronRight,
  TrendingUp, TrendingDown, Wallet, ArrowUpDown, ChevronDown, MoreVertical
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
  const [expandedId, setExpandedId] = useState(null);

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
        items: items
      }));
  }, [filteredTransactions, sortBy]);

  const getDateHeader = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM dd, yyyy");
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      {/* Header section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-primary">Manage</p>
          <h1 className="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-text-main">Transactions</h1>
        </div>
        
        <button
          onClick={() => {
            setSelectedTransaction(null);
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 md:px-6 md:py-3.5 text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold text-sm md:text-base">New Transaction</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-4 mb-8">
        <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
          <div className="p-2 w-fit rounded-xl bg-emerald-50 mb-3 md:mb-4">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
          </div>
          <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Income</p>
          <p className="mt-0.5 text-lg md:text-xl font-bold text-emerald-600 truncate">${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        
        <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
          <div className="p-2 w-fit rounded-xl bg-rose-50 mb-3 md:mb-4">
            <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
          </div>
          <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Expense</p>
          <p className="mt-0.5 text-lg md:text-xl font-bold text-rose-600 truncate">${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
          <div className="p-2 w-fit rounded-xl bg-slate-100 mb-3 md:mb-4">
            <Wallet className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
          </div>
          <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Net Result</p>
          <p className={`mt-0.5 text-lg md:text-xl font-bold truncate ${stats.total >= 0 ? "text-text-main" : "text-rose-600"}`}>
            {stats.total < 0 ? "-" : ""}${Math.abs(stats.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-4 md:p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm hover:shadow-md transition-all">
          <div className="p-2 w-fit rounded-xl bg-blue-50 mb-3 md:mb-4">
            <Tag className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>
          <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">Active</p>
          <p className="mt-0.5 text-lg md:text-xl font-bold text-primary truncate capitalize">{filterType || "All"}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col xl:flex-row gap-4 mb-8 items-start xl:items-center justify-between">
        <div className="relative group w-full xl:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by title or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border border-slate-200 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-surface p-1.5 rounded-3xl border border-slate-200 shadow-sm w-full xl:w-auto overflow-hidden">
          {/* Type Filter */}
          <div className="relative flex-1 xl:flex-none xl:w-36">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilterCategory("");
              }}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-xs font-bold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="hidden sm:block w-px h-6 bg-slate-200" />

          {/* Category Filter */}
          <div className="relative flex-1 xl:flex-none xl:w-40">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-xs font-bold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="">Categories</option>
              {categories.filter(c => !filterType || c.type === filterType).map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="hidden sm:block w-px h-6 bg-slate-200" />

          {/* Sort Control */}
          <div className="relative flex-1 xl:flex-none xl:w-40">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-xs font-bold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
              <option value="title">Alphabetical</option>
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
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-xl font-bold text-text-main">No records found</p>
            <p className="text-text-muted mt-2 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("");
                setFilterCategory("");
              }}
              className="mt-6 px-6 py-2 rounded-xl bg-slate-100 text-text-main font-bold hover:bg-slate-200 transition-all"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {groupedTransactions.map(group => (
              <div key={group.date.toISOString()}>
                <div className="bg-slate-50/80 px-4 md:px-8 py-3 border-y border-slate-100 sticky top-0 z-10 backdrop-blur-sm">
                   <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-widest">
                      {getDateHeader(group.date)}
                   </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {group.items.map(tx => (
                    <div 
                      key={tx._id} 
                      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 md:px-8 hover:bg-slate-50 transition-all ${expandedId === tx._id ? 'bg-slate-50' : ''}`}
                    >
                      <div className="flex items-start md:items-center gap-3 md:gap-5">
                         <div className={`h-11 w-11 md:h-12 md:w-12 shrink-0 flex items-center justify-center rounded-2xl ${
                            tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          } shadow-sm`}>
                            {tx.type === "income" ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownRight className="h-6 w-6" />}
                         </div>
                         <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-text-main text-sm md:text-base truncate">{tx.title}</h3>
                              {tx.category && (
                                <span 
                                  className="px-2 py-0.5 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                                  style={{ 
                                    backgroundColor: `${tx.category.color}15`, 
                                    color: tx.category.color,
                                    border: `1px solid ${tx.category.color}20`
                                  }}
                                >
                                  {tx.category.name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] md:text-xs text-text-muted mt-1">
                               <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(new Date(tx.date), "hh:mm a")}
                               </span>
                               {tx.description && <span className="hidden sm:inline opacity-50">•</span>}
                               {tx.description && <span className="truncate italic hidden sm:inline max-w-[200px]">{tx.description}</span>}
                            </div>
                            {/* Mobile Note view */}
                            {tx.description && <p className="sm:hidden text-[10px] text-text-muted mt-1 italic truncate">{tx.description}</p>}
                         </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                         <p className={`text-base md:text-xl font-black ${tx.type === "income" ? "text-emerald-600" : "text-text-main"}`}>
                            {tx.type === "income" ? "+" : "-"}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </p>
                         
                         <div className="flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(tx)}
                              className="p-2 md:p-2.5 text-text-muted hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(tx._id)}
                              disabled={isDeleting}
                              className="p-2 md:p-2.5 text-text-muted hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
                              title="Delete"
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
