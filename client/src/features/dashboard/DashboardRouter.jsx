import { useAuth } from "../auth/AuthProvider";
import FleetManagerDashboard from "./FleetManagerDashboard";
import DriverDashboard from "./DriverDashboard";
import SafetyOfficerDashboard from "./SafetyOfficerDashboard";
import FinancialAnalystDashboard from "./FinancialAnalystDashboard";
import SuspendedDriverDashboard from "./SuspendedDriverDashboard";

export default function DashboardRouter() {
  const { user } = useAuth();

  if (user?.role === "DRIVER" && user?.driverStatus === "SUSPENDED") {
    return <SuspendedDriverDashboard />;
  }

  switch (user?.role) {
    case "FLEET_MANAGER":
      return <FleetManagerDashboard />;
    case "DRIVER":
      return <DriverDashboard />;
    case "SAFETY_OFFICER":
      return <SafetyOfficerDashboard />;
    case "FINANCIAL_ANALYST":
      return <FinancialAnalystDashboard />;
    default:
      return <FleetManagerDashboard />;
  }
}
