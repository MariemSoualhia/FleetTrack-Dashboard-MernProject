const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// Création de trajets par logisticsOperator ou manager
router.post(
  "/",
  protect,
  authorizeRoles("manager", "logisticsOperator"),
  tripController.createTrip
);
router.get("/", protect, tripController.getTrips);
router.get("/:id", protect, tripController.getTripById);
router.put(
  "/:id",
  protect,
  authorizeRoles("manager", "logisticsOperator"),
  tripController.updateTrip
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("manager"),
  tripController.deleteTrip
);
router.get(
  "/stats/trips-per-day",
  protect,
  authorizeRoles("manager", "supervisor"),
  tripController.getTripsPerDay
);

module.exports = router;
