import { useEffect, useMemo, useState } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { startOfDay } from "date-fns";

// Components
import TransactionForm from "../components/TransactionForm";
import DeleteTransactionModal from "../components/DeleteTransactionModal";
import TransactionsHeader from "../components/transactions/TransactionsHeader";
import TransactionSummary from "../components/transactions/TransactionSummary";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionList from "../components/transactions/TransactionList";

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
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchTransactions({ type: filterType, category: filterCategory });
  }, [fetchTransactions, filterType, filterCategory]);

  const handleDelete = (transaction) => {
    setTransactionToDelete(transaction);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      await deleteTransaction(transactionToDelete._id);
      setTransactionToDelete(null);
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
      (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterCategory("");
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <TransactionsHeader onNewTransaction={() => { setSelectedTransaction(null); setShowAddModal(true); }} />

      <TransactionSummary stats={stats} activeFilter={filterType} />

      <TransactionFilters 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        filterType={filterType} setFilterType={setFilterType}
        filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        sortBy={sortBy} setSortBy={setSortBy}
        categories={categories}
      />

      <TransactionList 
        groupedTransactions={groupedTransactions}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onResetFilters={handleResetFilters}
      />

      {showAddModal && (
        <TransactionForm
          transaction={selectedTransaction}
          onCancel={handleClose}
          onSave={handleSave}
          isSaving={isUpdating}
        />
      )}

      {transactionToDelete && (
        <DeleteTransactionModal
          transaction={transactionToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setTransactionToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
