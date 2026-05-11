import { Search, Filter, Tag, ArrowUpDown, ChevronDown } from "lucide-react";

export default function TransactionFilters({ 
  searchTerm, setSearchTerm, 
  filterType, setFilterType, 
  filterCategory, setFilterCategory, 
  sortBy, setSortBy, 
  categories 
}) {
  return (
    <div className="flex flex-col xl:flex-row gap-4 mb-8 items-start xl:items-center justify-between">
      {/* Search Input */}
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

      {/* Select Filters Container */}
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
  );
}
