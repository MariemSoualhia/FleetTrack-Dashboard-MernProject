// cron/maintenanceCheck.js
const cron = require("node-cron");
const Truck = require("../models/Truck");
const Trip = require("../models/Trip");
const Alert = require("../models/Alert");

// 💡 La logique : un Truck qui n'a pas de trip récent -> besoin de maintenance
const checkMaintenance = async () => {
  try {
    console.log("🛠️ Checking for maintenance-needed trucks...");

    const trucks = await Truck.find();

    const now = new Date();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    for (const truck of trucks) {
      // Chercher le trip le plus récent de ce truck
      const lastTrip = await Trip.findOne({ truckId: truck._id }).sort({
        endTime: -1,
      });

      let needsMaintenance = false;

      if (!lastTrip) {
        // Jamais utilisé ➔ peut-être à vérifier manuellement
        needsMaintenance = true;
      } else {
        const lastTripEndTime = new Date(lastTrip.endTime);
        if (now - lastTripEndTime > THIRTY_DAYS_MS) {
          needsMaintenance = true;
        }
      }

      if (needsMaintenance) {
        // Vérifie s'il n'y a pas déjà une alerte existante ACTIVE pour ce truck
        const existingAlert = await Alert.findOne({
          type: "maintenanceNeeded",
          relatedTripId: null, // 🔥 maintenance liée au Truck directement
          message: { $regex: truck.plateNumber }, // éviter de recréer plusieurs fois
          status: "active",
        });

        if (!existingAlert) {
          await Alert.create({
            type: "maintenanceNeeded",
            message: `Truck ${truck.plateNumber} requires maintenance (no trip for 30+ days).`,
            status: "active",
          });

          console.log(
            `🛠️ Created maintenance alert for truck ${truck.plateNumber}`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error during maintenance check:", error.message);
  }
};

// Planifie la tâche : Tous les jours à minuit
const scheduleMaintenanceCheck = () => {
  cron.schedule("0 0 * * *", () => {
    console.log("⏰ Running scheduled maintenance check...");
    checkMaintenance();
  });
};

module.exports = { scheduleMaintenanceCheck };
