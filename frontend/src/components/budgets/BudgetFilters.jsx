import React from 'react';
import { Search, Filter, ArrowUpDown, ChevronDown, Calendar, ChevronRight } from 'lucide-react';

/**
 * Props:
 *  - searchQuery: string
 *  - setSearchQuery: (value: string) => void
 *  - filterMonth: number
 *  - setFilterMonth: (value: number) => void
 *  - filterYear: number
 *  - setFilterYear: (value: number) => void
 *  - statusFilter: string
 *  - setStatusFilter: (value: string) => void
 *  - sortBy: string
 *  - setSortBy: (value: string) => void
 *  - monthNames: string[]
 */
export default function BudgetFilters({
  searchQuery,
  setSearchQuery,
  filterMonth,
  setFilterMonth,
  filterYear,
  setFilterYear,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  monthNames,
}) {
  return (
    <div className="flex flex-col xl:flex-row gap-4 mb-8 items-start xl:items-center justify-between">
      {/* Search */}
      <div className="relative group w-full xl:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search by category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border border-slate-200 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-surface p-1.5 rounded-3xl border border-slate-200 shadow-sm w-full xl:w-auto">
        {/* Period Selector */}
        <div className="flex items-center px-3 py-1 bg-slate-50 rounded-2xl border border-slate-100 flex-1 sm:flex-none">
          <div className="relative flex items-center flex-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(Number(e.target.value))}
              className="bg-transparent pr-5 py-1.5 text-xs font-bold text-text-main outline-none appearance-none cursor-pointer w-full"
            >
              {monthNames.map((month, idx) => (
                <option key={month} value={idx + 1}>{month}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>
          <div className="w-px h-4 bg-slate-200 mx-3 shrink-0" />
          <input
            type="number"
            min="2024"
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="w-14 bg-transparent py-1.5 text-xs font-bold text-text-main outline-none focus:text-primary transition-colors text-center"
          />
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200" />

        {/* Status Filter */}
        <div className="relative flex-1 xl:flex-none xl:w-36">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-xs font-bold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="exceeded">Exceeded</option>
            <option value="near-limit">Near Limit</option>
            <option value="on-track">On Track</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200" />

        {/* Sort Control */}
        <div className="relative flex-1 xl:flex-none xl:w-36">
          <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-transparent text-xs font-bold text-text-main outline-none appearance- none cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <option value="name">Name (A-Z)</option>
            <option value="amount-desc">Highest Limit</option>
            <option value="amount-asc">Lowest Limit</option>
            <option value="usage-desc">Most Usage</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
