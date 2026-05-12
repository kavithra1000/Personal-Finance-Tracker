import Transaction from "../models/transaction.model.js";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Change 1: Import the function directly

export const generateFinancialReport = async ({ userId, month, year, format }) => {
  // 1. Calculate Date Range
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  // 2. Fetch Transactions & Populate Category
  const transactions = await Transaction.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate }
  })
    .populate("category", "name")
    .sort({ date: -1 });

  // 3. Handle Excel Logic
  if (format === "excel") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Report ${month}-${year}`);

    sheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Title", key: "title", width: 30 },
      { header: "Category", key: "category", width: 20 },
      { header: "Type", key: "type", width: 12 },
      { header: "Amount", key: "amount", width: 15 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F2F2F2' }
    };

    transactions.forEach(t => {
      sheet.addRow({
        date: t.date ? t.date.toISOString().split('T')[0] : "N/A",
        title: t.title,
        category: t.category?.name || "Uncategorized",
        type: (t.type || "").toUpperCase(),
        amount: t.amount || 0
      });
    });

    return { 
      data: await workbook.xlsx.writeBuffer(), 
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      extension: "xlsx" 
    };
  }

  // 4. Handle PDF Logic
  if (format === "pdf") {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Monthly Financial Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Period: ${month}/${year}`, 14, 30);

    const tableData = transactions.map(t => [
      t.date ? t.date.toISOString().split('T')[0] : "N/A",
      t.title || "Untitled",
      t.category?.name || "N/A",
      (t.type || "").toUpperCase(),
      (t.amount || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    ]);

    // Change 2: Call autoTable(doc, options) instead of doc.autoTable(options)
    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Title', 'Category', 'Type', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    });

    return { 
      data: Buffer.from(doc.output("arraybuffer")), 
      mimeType: "application/pdf",
      extension: "pdf" 
    };
  }

  throw new Error("Unsupported format");
};