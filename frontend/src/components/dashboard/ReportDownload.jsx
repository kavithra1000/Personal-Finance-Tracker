import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useInsightStore } from "../../store/useInsightStore"; // Adjusted path

export default function ReportDownload({ month, year }) {
  const { downloadReport } = useInsightStore();
  
  // Track specific loading states to prevent "both buttons loading"
  const [loadingType, setLoadingType] = useState(null); 

  const handleExport = async (format) => {
    setLoadingType(format);
    await downloadReport({ month, year, format });
    setLoadingType(null);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 sm:hidden">
        Export Options
      </span>
      
      <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
        {/* Excel Button */}
        <button
          onClick={() => handleExport("excel")}
          disabled={loadingType !== null}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-600 transition-all hover:bg-emerald-100 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 border border-emerald-100"
        >
          {loadingType === "excel" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="h-4 w-4" />
          )}
          <span>Excel</span>
        </button>

        {/* PDF Button */}
        <button
          onClick={() => handleExport("pdf")}
          disabled={loadingType !== null}
          className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 border border-rose-100"
        >
          {loadingType === "pdf" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          <span>PDF</span>
        </button>
      </div>
    </div>
  );
}