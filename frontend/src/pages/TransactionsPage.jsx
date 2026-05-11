import { useEffect, useMemo, useState } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { format } from "date-fns";
import { Plus, Trash2, Edit3, ArrowUpRight, ArrowDownRight, Loader } from "lucide-react";
import TransactionForm from "../components/TransactionForm";

export default function TransactionsPage() {
  const { transactions, isLoading, fetchTransactions, addTransaction, deleteTransaction, updateTransaction, isDeleting, isUpdating } = useTransactionStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

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

  const filteredCategories = useMemo(
    () => {
      if (!filterType) return categories;
      return categories.filter((category) => category.type === filterType);
    },
    [categories, filterType]
  );

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Transactions</h1>
          <p className="text-text-muted mt-1">Manage your income and expenses.</p>
        </div>
        <button
          onClick={() => {
            setSelectedTransaction(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-background/50 grid gap-2 md:grid-cols-3">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterCategory("");
            }}
            className="px-3 py-2 rounded-lg bg-surface border border-slate-200 text-sm outline-none focus:border-primary text-text-main"
          >
            <option value="">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface border border-slate-200 text-sm outline-none focus:border-primary text-text-main"
          >
            <option value="">All Categories</option>
            {filteredCategories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>

          <div className="text-sm text-text-muted py-2">Showing {transactions.length} transaction{transactions.length === 1 ? "" : "s"}</div>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-text-muted">No transactions found.</p>
            <button
              onClick={() => {
                setSelectedTransaction(null);
                setShowAddModal(true);
              }}
              className="mt-4 text-primary hover:underline"
            >
              Add your first transaction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/80 text-text-muted text-sm border-b border-slate-200">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm text-text-muted whitespace-nowrap">
                      {format(new Date(tx.date), "MMM dd, yyyy")}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-text-main">{tx.title}</p>
                      {tx.note && <p className="text-xs text-text-muted mt-0.5 truncate max-w-[200px]">{tx.note}</p>}
                    </td>
                    <td className="p-4">
                      {tx.category ? (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                          style={{
                            backgroundColor: `${tx.category.color}15`,
                            color: tx.category.color,
                            borderColor: `${tx.category.color}30`,
                          }}
                        >
                          {tx.category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">Uncategorized</span>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {tx.type === "income" ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-semibold ${tx.type === "income" ? "text-green-600" : "text-text-main"}`}>
                          ${Number(tx.amount).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center flex justify-center gap-1">
                      <button
                        onClick={() => handleEdit(tx)}
                        className="p-2 text-text-muted hover:text-text-main hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        disabled={isDeleting}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
