const Trip = require("../models/Trip");
const Alert = require("../models/Alert"); // ⚡ importer Alert

// ➕ Create Trip
exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);

    // Vérification automatique pour création d'alertes
    if (trip.fuelUsed > 100) {
      // 🛢️ par exemple
      await Alert.create({
        type: "fuelOverconsumption",
        relatedTripId: trip._id,
        message: `Truck used too much fuel (${trip.fuelUsed}L).`,
      });
    }

    if (trip.deliveryStatus === "delayed") {
      await Alert.create({
        type: "excessiveDelay",
        relatedTripId: trip._id,
        message: "Delivery was delayed.",
      });
    }

    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// 📖 Get all Trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("driverId truckId");
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get Trip by ID
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate(
      "driverId truckId"
    );
    if (trip) res.json(trip);
    else res.status(404).json({ message: "Trip not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Trip
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ❌ Delete Trip
exports.deleteTrip = async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getTripsPerDay = async (req, res) => {
  try {
    const trips = await Trip.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
