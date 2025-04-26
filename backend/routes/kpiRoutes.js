const express = require("express");
const { getOverview } = require("../controllers/kpiController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/overview", protect, getOverview);

module.exports = router;
