const mongoose = require("mongoose");

const kpiSchema = new mongoose.Schema({
  metricName: String,
  value: Number,
  calculatedAt: Date,
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "relatedEntityType",
  },
  relatedEntityType: {
    type: String,
    enum: ["Driver", "Truck"],
  },
});

module.exports = mongoose.model("Kpi", kpiSchema);
