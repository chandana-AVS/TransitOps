const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./modules/auth/auth.routes");
const vehicleRoutes = require("./modules/vehicles/vehicles.routes");
const driverRoutes = require("./modules/drivers/drivers.routes");
const tripRoutes = require("./modules/trips/trips.routes");
const maintenanceRoutes = require("./modules/maintenance/maintenance.routes");
const fuelRoutes = require("./modules/fuel/fuel.routes");
const expenseRoutes = require("./modules/expenses/expenses.routes");
const reportRoutes = require("./modules/reports/reports.routes");
const chatRoutes = require("./modules/chat/chat.routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/drivers", driverRoutes);
app.use("/trips", tripRoutes);
app.use("/maintenance", maintenanceRoutes);
app.use("/fuel-logs", fuelRoutes);
app.use("/expenses", expenseRoutes);
app.use("/dashboard", reportRoutes);
app.use("/reports", reportRoutes);
app.use("/chat", chatRoutes);

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "TransitOps API running" });
});

app.use(errorHandler);

module.exports = app;
