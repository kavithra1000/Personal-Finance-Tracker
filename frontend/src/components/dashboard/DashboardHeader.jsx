import { Calendar, ChevronDown } from "lucide-react";

export default function DashboardHeader({ month, year, onMonthChange, onYearChange, months }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <p className="text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-primary">Dashboard</p>
        <h1 className="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-text-main">Financial Overview</h1>
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-surface rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
        <div className="relative flex-1 md:flex-none">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={month}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="w-full md:w-36 pl-9 pr-8 py-2 rounded-xl bg-transparent text-xs font-bold text-text-main outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
          >
            {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>
        
        <div className="w-px h-5 bg-slate-200" />
        
        <input
          type="number"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="w-20 md:w-24 px-3 py-2 text-xs font-bold text-text-main bg-transparent outline-none focus:text-primary transition-colors text-center"
        />
      </div>
    </div>
  );
}