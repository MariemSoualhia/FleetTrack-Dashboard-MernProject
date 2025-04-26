const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { protect } = require("../middlewares/authMiddleware");
const alertController = require("../controllers/alertController");

router.post(
  "/",
  protect,
  authorizeRoles("manager", "supervisor"),
  alertController.createAlert
);
router.get("/", protect, alertController.getAlerts);
router.put(
  "/:id/resolve",
  protect,
  authorizeRoles("manager", "supervisor"),
  alertController.resolveAlert
);

module.exports = router;
