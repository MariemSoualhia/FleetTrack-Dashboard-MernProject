const express = require("express");
const router = express.Router();
const truckController = require("../controllers/truckController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// Seuls manager peuvent créer et modifier les camions
router.post(
  "/",
  protect,
  authorizeRoles("manager"),
  truckController.createTruck
);
router.get("/", protect, truckController.getTrucks);
router.get("/:id", protect, truckController.getTruckById);
router.put(
  "/:id",
  protect,
  authorizeRoles("manager"),
  truckController.updateTruck
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("manager"),
  truckController.deleteTruck
);

module.exports = router;
