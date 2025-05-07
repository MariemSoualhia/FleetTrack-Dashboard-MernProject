const Driver = require("../models/Driver");
const Truck = require("../models/Truck");
const Trip = require("../models/Trip");
const Report = require("../models/Report");
// 📊 Get overall KPIs
exports.getOverview = async (req, res) => {
  try {
    const totalDrivers = await Driver.countDocuments();
    const totalTrucks = await Truck.countDocuments();
    const totalTrips = await Trip.countDocuments();

    const availableTrucks = await Truck.countDocuments({ status: "available" });
    const inMaintenanceTrucks = await Truck.countDocuments({
      status: "inMaintenance",
    });

    const onTimeTrips = await Trip.countDocuments({
      deliveryStatus: "on-time",
    });
    const delayedTrips = await Trip.countDocuments({
      deliveryStatus: "delayed",
    });

    // 🚀 Ajout : calculer la distance totale parcourue
    const totalDistanceDrivenData = await Trip.aggregate([
      {
        $group: {
          _id: null,
          totalDistance: { $sum: "$distanceDriven" },
        },
      },
    ]);

    const totalDistanceDriven =
      totalDistanceDrivenData.length > 0
        ? totalDistanceDrivenData[0].totalDistance
        : 0;

    const tripsPerDay = await Trip.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const totalReports = await Report.countDocuments();
    const reportsByType = await Report.aggregate([
      {
        $group: {
          _id: "$reportType",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json({
      totalDrivers,
      totalTrucks,
      totalTrips,
      availableTrucks,
      inMaintenanceTrucks,
      onTimeTrips,
      delayedTrips,
      totalDistanceDriven, // ✅ Important à ajouter ici
      tripsPerDay,
      totalReports,
      reportsByType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching KPIs" });
  }
};
