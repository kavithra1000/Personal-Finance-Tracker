import { Search, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';

/**
 * Props:
 *  - searchQuery: string
 *  - setSearchQuery: (value: string) => void
 *  - typeFilter: string
 *  - setTypeFilter: (value: string) => void
 *  - sortBy: string
 *  - setSortBy: (value: string) => void
 *  - monthNames: string[] (optional, not used here)
 */
export default function CategoryFilters({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="flex flex-col xl:flex-row gap-4 mb-8 items-start xl:items-center justify-between">
      {/* Search */}
      <div className="relative group w-full xl:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border border-slate-200 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-surface p-1.5 rounded-3xl border border-slate-200 shadow-sm w-full xl:w-auto">
        {/* Type Filter */}
        <div className="relative flex-1 xl:flex-none xl:w-40">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-xs font-bold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200" />

        {/* Sort Control */}
        <div className="relative flex-1 xl:flex-none xl:w-44">
          <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-xs font-bold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="type">By Type</option>
            <option value="newest">Newest First</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
