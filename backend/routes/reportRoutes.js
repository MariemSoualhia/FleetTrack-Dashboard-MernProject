const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { protect } = require("../middlewares/authMiddleware");
const reportController = require("../controllers/reportController");

router.post(
  "/",
  protect,
  authorizeRoles("manager", "companyOwner"),
  reportController.createReport
);
router.get("/", protect, reportController.getReports);

module.exports = router;
