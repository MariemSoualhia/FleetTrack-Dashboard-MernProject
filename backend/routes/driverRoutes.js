const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// Seuls manager et logisticsOperator peuvent gérer les chauffeurs
router.post(
  "/",
  protect,
  authorizeRoles("manager", "logisticsOperator"),
  driverController.createDriver
);
router.get("/", protect, driverController.getDrivers);
router.get("/:id", protect, driverController.getDriverById);
router.put(
  "/:id",
  protect,
  authorizeRoles("manager", "logisticsOperator"),
  driverController.updateDriver
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("manager"),
  driverController.deleteDriver
);

module.exports = router;
