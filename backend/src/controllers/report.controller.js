import * as reportService from "../services/report.service.js";

export const exportReport = async (req, res) => {
  try {
    const { month, year, format } = req.query;
    const userId = req.user._id;

    // Simple Validation
    if (!month || !year || !format) {
      return res.status(400).json({ message: "Month, year, and format are required." });
    }

    const report = await reportService.generateFinancialReport({
      userId,
      month: parseInt(month),
      year: parseInt(year),
      format
    });

    res.setHeader("Content-Type", report.mimeType);
    res.setHeader(
      "Content-Disposition", 
      `attachment; filename=Finance_Report_${month}_${year}.${report.extension}`
    );

    return res.send(report.data);

  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ message: "Could not generate report", error: error.message });
  }
};