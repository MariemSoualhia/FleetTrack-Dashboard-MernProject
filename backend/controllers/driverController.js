const Driver = require("../models/Driver");

// ➕ Create Driver
exports.createDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📖 Get all Drivers
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get Driver by ID
exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (driver) res.json(driver);
    else res.status(404).json({ message: "Driver not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Driver
exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ❌ Delete Driver
exports.deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
