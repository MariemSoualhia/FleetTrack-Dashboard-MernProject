const Truck = require("../models/Truck");

// ➕ Create Truck
exports.createTruck = async (req, res) => {
  try {
    const truck = await Truck.create(req.body);
    res.status(201).json(truck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📖 Get all Trucks
exports.getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find();
    res.json(trucks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get Truck by ID
exports.getTruckById = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (truck) res.json(truck);
    else res.status(404).json({ message: "Truck not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Truck
exports.updateTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(truck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ❌ Delete Truck
exports.deleteTruck = async (req, res) => {
  try {
    await Truck.findByIdAndDelete(req.params.id);
    res.json({ message: "Truck deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
