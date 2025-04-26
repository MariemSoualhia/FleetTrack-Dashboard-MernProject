const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },
    startLocation: {
      type: String,
      required: true,
    },
    endLocation: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    distanceDriven: {
      type: Number,
      required: true,
    },
    fuelUsed: {
      type: Number,
      required: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["on-time", "delayed"],
      default: "on-time",
    },
    delayReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
