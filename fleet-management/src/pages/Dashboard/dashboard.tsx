import DashboardHeader from "../../components/dashboard/dashboardheader/dashboardheader";
import WelcomeBanner from "../../components/dashboard/welcomebanner/welcomebanner";
import KPIGrid from "../../components/dashboard/KPIgrid/KPIgrid";
import Charts from "../../components/dashboard/charts/charts";
import FleetUtilization from "../../components/dashboard/fleetutilization/fleetutilization";
import Alerts from "../../components/dashboard/alerts/alerts";
import RecentActivity from "../../components/dashboard/recentactivity/recentactivity";
import QuickActions from "../../components/dashboard/quickactions/quickactions";

import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <DashboardHeader />

      <WelcomeBanner />

      <KPIGrid />

      <Charts />

      <div className="dashboard-row">
        <FleetUtilization />

        <Alerts />
      </div>

      <RecentActivity />

      <QuickActions />
    </div>
  );
}

export default Dashboard;
