const Alert = require("../models/Alert");

// ➕ Create an alert
exports.createAlert = async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📖 Get all alerts
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Resolve an alert
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
