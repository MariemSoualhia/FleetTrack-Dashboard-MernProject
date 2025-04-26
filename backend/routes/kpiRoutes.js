const express = require("express");
const router = express.Router();
const kpiController = require("../controllers/kpiController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// 🛣️ Trajets par jour
router.get(
  "/trips-per-day",
  protect,
  authorizeRoles("manager", "supervisor"),
  kpiController.getTripsPerDay
);

// 🏆 Top drivers
router.get(
  "/top-drivers",
  protect,
  authorizeRoles("logisticsOperator", "manager"),
  kpiController.getTopDrivers
);

// ⛽ Fuel usage & delays
router.get(
  "/fuel-delay-stats",
  protect,
  authorizeRoles("supervisor", "manager"),
  kpiController.getFuelAndDelayStats
);

module.exports = router;
