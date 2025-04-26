const Trip = require("../models/Trip");
const Driver = require("../models/Driver");

// ➡️ Nombre de trajets par jour
exports.getTripsPerDay = async (req, res) => {
  try {
    const trips = await Trip.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
          tripsCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➡️ Top 5 Drivers les plus efficaces (ex: moins de fuel utilisé par km)
exports.getTopDrivers = async (req, res) => {
  try {
    const topDrivers = await Trip.aggregate([
      {
        $group: {
          _id: "$driverId",
          avgFuelPerKm: { $avg: { $divide: ["$fuelUsed", "$distanceDriven"] } },
          totalTrips: { $sum: 1 },
        },
      },
      { $sort: { avgFuelPerKm: 1 } }, // Moins de fuel par km est mieux
      { $limit: 5 },
      {
        $lookup: {
          from: "drivers",
          localField: "_id",
          foreignField: "_id",
          as: "driverInfo",
        },
      },
      { $unwind: "$driverInfo" },
      {
        $project: {
          driverName: "$driverInfo.name",
          avgFuelPerKm: 1,
          totalTrips: 1,
        },
      },
    ]);
    res.json(topDrivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➡️ Statistiques fuel usage et retards
exports.getFuelAndDelayStats = async (req, res) => {
  try {
    const stats = await Trip.aggregate([
      {
        $group: {
          _id: null,
          totalFuelUsed: { $sum: "$fuelUsed" },
          totalDistance: { $sum: "$distanceDriven" },
          delayedTrips: {
            $sum: { $cond: [{ $eq: ["$deliveryStatus", "delayed"] }, 1, 0] },
          },
          totalTrips: { $sum: 1 },
        },
      },
      {
        $project: {
          averageFuelPerKm: { $divide: ["$totalFuelUsed", "$totalDistance"] },
          delayRate: {
            $multiply: [{ $divide: ["$delayedTrips", "$totalTrips"] }, 100],
          },
        },
      },
    ]);
    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
