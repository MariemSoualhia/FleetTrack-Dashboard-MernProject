const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    generatedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["daily", "weekly", "custom", "trips", "alerts", "summary"], // ✅ ajoute les vrais types que tu veux utiliser
      required: true,
    },

    reportPeriodStart: {
      type: Date,
      required: true,
    },
    reportPeriodEnd: {
      type: Date,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
