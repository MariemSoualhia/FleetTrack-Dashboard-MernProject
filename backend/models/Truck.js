const mongoose = require("mongoose");

const truckSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    fuelType: {
      type: String,
      enum: ["diesel", "electric", "hybrid", "other"],
      default: "diesel",
    },
    capacity: {
      type: Number, // ➡️ Ajout de capacité en tonnes
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "inMaintenance"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Truck", truckSchema);
