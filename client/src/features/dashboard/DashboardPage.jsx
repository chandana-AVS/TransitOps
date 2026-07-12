import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import KPICard from "./KPICard";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const PIE_COLORS = ["#3B82F6", "#22C55E", "#EAB308", "#6B7280"];

export default function DashboardPage() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: () => api.get("/dashboard/kpis"),
  });

  const { data: util } = useQuery({
    queryKey: ["dashboard-utilization"],
    queryFn: () => api.get("/reports/utilization"),
  });

  const { data: fuelEff } = useQuery({
    queryKey: ["dashboard-fuel"],
    queryFn: () => api.get("/reports/fuel-efficiency"),
  });

  const { data: cost } = useQuery({
    queryKey: ["dashboard-cost"],
    queryFn: () => api.get("/reports/cost"),
  });

  if (kpisLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" /><div className="grid grid-cols-4 gap-4"><div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" /><div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" /><div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" /><div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" /></div></div>;

  const kpiData = kpis || {};
  const pieData = util?.breakdown ? Object.entries(util.breakdown).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Active Vehicles" value={kpiData.activeVehicles} />
        <KPICard label="Available Vehicles" value={kpiData.availableVehicles} />
        <KPICard label="In Maintenance" value={kpiData.inShopVehicles} />
        <KPICard label="Active Trips" value={kpiData.activeTrips} />
        <KPICard label="Pending Trips" value={kpiData.pendingTrips} />
        <KPICard label="Drivers On Duty" value={kpiData.driversOnDuty} />
        <KPICard label="Fleet Utilization" value={`${kpiData.fleetUtilization ?? 0}%`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pieData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Fleet Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {fuelEff && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Fuel Efficiency</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">Avg Km/Liter: <span className="font-bold text-gray-900 dark:text-white">{fuelEff.averageKmPerLiter}</span></p>
              <p className="text-gray-600 dark:text-gray-400">Total Trips: <span className="font-bold text-gray-900 dark:text-white">{fuelEff.totalTrips}</span></p>
              <p className="text-gray-600 dark:text-gray-400">Total Distance: <span className="font-bold text-gray-900 dark:text-white">{fuelEff.totalDistance} km</span></p>
              <p className="text-gray-600 dark:text-gray-400">Total Fuel: <span className="font-bold text-gray-900 dark:text-white">{fuelEff.totalFuel} L</span></p>
            </div>
          </div>
        )}

        {cost && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Operational Cost</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[{ name: "Fuel", value: cost.totalFuelCost }, { name: "Maintenance", value: cost.totalMaintenanceCost }, { name: "Other", value: cost.totalOtherExpenses }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-right mt-2 text-gray-600 dark:text-gray-400">Total: <span className="font-bold text-gray-900 dark:text-white">${cost.totalOperationalCost}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
