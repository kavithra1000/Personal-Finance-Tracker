import { useEffect, useMemo, useState } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { format, isToday, isYesterday, startOfDay } from "date-fns";
import { 
  Plus, Trash2, Edit3, ArrowUpRight, ArrowDownRight, 
  Loader, Search, Filter, Calendar, Tag, ChevronRight,
  TrendingUp, TrendingDown, Wallet
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
    return transactions.filter(tx => 
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [transactions, searchTerm]);

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
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .map(([date, items]) => ({
        date: new Date(date),
        items: items.sort((a, b) => new Date(b.date) - new Date(a.date))
      }));
  }, [filteredTransactions]);

  const getDateHeader = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM dd, yyyy");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-text-main tracking-tight">Transactions</h1>
          <p className="text-text-muted font-medium">Keep track of every cent in real-time.</p>
        </div>
        <button
          onClick={() => {
            setSelectedTransaction(null);
            setShowAddModal(true);
          }}
          className="group relative flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all active:scale-[0.98] shadow-xl shadow-primary/20 overflow-hidden"
        >
          <Plus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">New Transaction</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Filtered Income</p>
            <p className="text-xl font-black text-emerald-600">${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Filtered Expense</p>
            <p className="text-xl font-black text-rose-600">${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="p-5 rounded-3xl border border-slate-200 bg-surface shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-primary">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Net Result</p>
            <p className={`text-xl font-black ${stats.total >= 0 ? "text-primary" : "text-rose-600"}`}>
              {stats.total < 0 ? "-" : ""}${Math.abs(stats.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden mb-8">
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-12">
            <div className="md:col-span-6 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or note..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium"
              />
            </div>
            
            <div className="md:col-span-3 relative group">
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
               <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setFilterCategory("");
                }}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium appearance-none cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="md:col-span-3 relative group">
               <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
               <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.filter(c => !filterType || c.type === filterType).map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-24 flex flex-col items-center justify-center text-text-muted gap-4">
            <Loader className="w-12 h-12 animate-spin text-primary" />
            <p className="font-bold animate-pulse">Fetching your data...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-24 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-300" />
             </div>
            <p className="text-xl font-bold text-text-main">No matches found</p>
            <p className="text-text-muted">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("");
                setFilterCategory("");
              }}
              className="text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="px-6 md:px-8 pb-8 space-y-8">
            {groupedTransactions.map(group => (
              <div key={group.date.toISOString()} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="px-4 py-1.5 rounded-full bg-slate-100 text-[11px] font-black uppercase tracking-widest text-text-muted">
                    {getDateHeader(group.date)}
                  </div>
                  <div className="h-px grow bg-slate-100" />
                </div>

                <div className="grid gap-3">
                  {group.items.map(tx => (
                    <div 
                      key={tx._id} 
                      className="group relative flex items-center justify-between p-5 rounded-3xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-5">
                         <div className={`hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${
                            tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          }`}>
                            {tx.type === "income" ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownRight className="h-6 w-6" />}
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">{tx.title}</h3>
                              {tx.category && (
                                <span 
                                  className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tight border"
                                  style={{ 
                                    backgroundColor: `${tx.category.color}10`, 
                                    color: tx.category.color,
                                    borderColor: `${tx.category.color}30`
                                  }}
                                >
                                  {tx.category.name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                               <Calendar className="w-3.5 h-3.5" />
                               {format(new Date(tx.date), "hh:mm a")}
                               {tx.note && <span className="text-slate-300 mx-1">•</span>}
                               {tx.note && <span className="truncate max-w-[150px] italic">{tx.note}</span>}
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-6">
                         <div className="text-right">
                            <p className={`text-lg font-black ${tx.type === "income" ? "text-emerald-600" : "text-text-main"}`}>
                              {tx.type === "income" ? "+" : "-"}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                         </div>
                         
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                            <button
                              onClick={() => handleEdit(tx)}
                              className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-90"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(tx._id)}
                              disabled={isDeleting}
                              className="p-2.5 text-text-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
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
          onClose={handleClose}
          onSave={handleSave}
          isSaving={isUpdating}
        />
      )}
    </div>
  );
}
