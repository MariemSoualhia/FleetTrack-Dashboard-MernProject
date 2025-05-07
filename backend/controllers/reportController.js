const Report = require("../models/Report");

// ➕ Create a report
exports.createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📖 Get all reports

// GET /api/reports?type=trips&from=2024-07-01&to=2024-07-15
exports.getReports = async (req, res) => {
  try {
    const { type, from, to } = req.query;
    const query = {};

    if (type) {
      query.reportType = type;
    }

    if (from && to) {
      query.reportPeriodStart = { $gte: new Date(from) };
      query.reportPeriodEnd = { $lte: new Date(to) };
    }

    const reports = await Report.find(query).populate(
      "generatedByUserId",
      "name email"
    );
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
