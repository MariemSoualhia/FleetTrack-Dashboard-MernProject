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

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("generatedByUserId", "email"); // ➡️ seulement l'email
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
