const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const driverRoutes = require("./routes/driverRoutes");
const truckRoutes = require("./routes/truckRoutes");
const tripRoutes = require("./routes/tripRoutes");
const userRoutes = require("./routes/userRoutes");

const { scheduleMaintenanceCheck } = require("./cron/maintenanceCheck");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/trips", tripRoutes);
const reportRoutes = require("./routes/reportRoutes");
const alertRoutes = require("./routes/alertRoutes");

app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);
const kpiRoutes = require("./routes/kpiRoutes");

app.use("/api/kpis", kpiRoutes);
app.use("/api/users", userRoutes);
const path = require("path");

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ➡️ Démarrer le cron job
scheduleMaintenanceCheck();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
