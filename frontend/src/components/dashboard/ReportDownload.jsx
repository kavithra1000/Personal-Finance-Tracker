import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useInsightStore } from "../../store/useInsightStore";

export default function ReportDownload({ month, year }) {
  const { downloadReport } = useInsightStore();
  const [loadingType, setLoadingType] = useState(null);

  const handleExport = async (format) => {
    setLoadingType(format);
    await downloadReport({ month, year, format });
    setLoadingType(null);
  };

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-surface rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto">
      
      <button
        onClick={() => handleExport("excel")}
        disabled={loadingType !== null}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-40"
      >
        {loadingType === "excel" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
        <span>Excel</span>

      </button>

      <div className="w-px h-4 bg-slate-200" />

      <button
        onClick={() => handleExport("pdf")}
        disabled={loadingType !== null}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
      >
        {loadingType === "pdf" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
        <span>PDF</span>
      </button>
    </div>
  );
}