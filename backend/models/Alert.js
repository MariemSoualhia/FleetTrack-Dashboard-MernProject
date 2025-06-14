const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["fuelOverconsumption", "excessiveDelay", "maintenanceNeeded"],
      required: true,
    },
    relatedTripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
