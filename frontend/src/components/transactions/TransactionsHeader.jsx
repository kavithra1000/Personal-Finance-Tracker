import { Plus } from "lucide-react";

export default function TransactionsHeader({ onNewTransaction }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <p className="text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-primary">Manage</p>
        <h1 className="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-text-main">Transactions</h1>
      </div>
      
      <button
        onClick={onNewTransaction}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 md:px-6 md:py-3.5 text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" />
        <span className="font-bold text-sm md:text-base">New Transaction</span>
      </button>
    </div>
  );
}
