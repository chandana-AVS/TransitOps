import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import KPICard from "./KPICard";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PIE_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#94A3B8"];
const typeOptions = [{ value: "", label: "All Types" }, { value: "VAN", label: "Van" }, { value: "TRUCK", label: "Truck" }, { value: "BUS", label: "Bus" }, { value: "CAR", label: "Car" }];
const statusOptions = [{ value: "", label: "All Statuses" }, { value: "AVAILABLE", label: "Available" }, { value: "ON_TRIP", label: "On Trip" }, { value: "IN_SHOP", label: "In Shop" }, { value: "RETIRED", label: "Retired" }];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-surface-800 px-4 py-3 shadow-xl rounded-xl border border-surface-200 dark:border-surface-700 text-sm">
        <p className="text-surface-900 dark:text-white font-semibold mb-1">{payload[0].name || label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-surface-500 dark:text-surface-400 text-xs">{typeof p.value === 'number' && p.name !== 'roi' ? `$${p.value.toLocaleString()}` : p.value}</p>
        ))}
      </div>
    );
  }
  return null;
}

function CustomPieLabel({ cx, cy, midAngle, outerRadius, percent, name }) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="#64748B" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" className="text-[11px] font-medium">
      {name} ({(percent * 100).toFixed(0)}%)
    </text>
  );
}

export default function FleetManagerDashboard() {
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filterParams = new URLSearchParams();
  if (filterType) filterParams.set("type", filterType);
  if (filterStatus) filterParams.set("status", filterStatus);
  filterParams.set("limit", "100");
  const filterQS = filterParams.toString();

  const { data: filteredVehicles } = useQuery({
    queryKey: ["filtered-vehicles", filterType, filterStatus],
    queryFn: () => api.get(`/vehicles?${filterQS}`),
  });

  const fv = filteredVehicles?.vehicles || [];
  const filteredBreakdown = {};
  for (const v of fv) filteredBreakdown[v.status] = (filteredBreakdown[v.status] || 0) + 1;
  const filteredPieData = Object.entries(filteredBreakdown).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));

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

  const d = kpis || {};
  const pieData = util?.breakdown ? Object.entries(util.breakdown).map(([name, value]) => ({ name: name.replace(/_/g, " "), value })) : [];
  const costData = cost ? [
    { name: "Fuel", cost: cost.totalFuelCost },
    { name: "Maintenance", cost: cost.totalMaintenanceCost },
    { name: "Other", cost: cost.totalOtherExpenses },
  ] : [];

  if (kpisLoading) return (
    <div className="space-y-6 animate-fade-in">
      <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded-xl w-48 animate-shimmer" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(7)].map((_, i) => <div key={i} className="h-24 bg-surface-200 dark:bg-surface-700 rounded-2xl animate-shimmer" style={{ animationDelay: `${i * 100}ms` }} />)}
      </div>
    </div>
  );

  const activePieData = (filterType || filterStatus) ? filteredPieData : pieData;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with live indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Fleet Dashboard</h1>
          <p className="text-sm text-surface-500 mt-0.5">Real-time fleet operations overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-emerald/10 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald" />
          </span>
          <span className="text-xs font-medium text-accent-emerald">Live — refreshes every 5s</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select options={typeOptions} value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-40" />
        <Select options={statusOptions} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-40" />
        {(filterType || filterStatus) && (
          <button onClick={() => { setFilterType(""); setFilterStatus(""); }} className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            Clear filters
          </button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Active Vehicles" value={d.activeVehicles} icon="truck" color="blue" />
        <KPICard label="Available" value={d.availableVehicles} icon="check" color="green" />
        <KPICard label="In Maintenance" value={d.inShopVehicles} icon="wrench" color="yellow" />
        <KPICard label="Active Trips" value={d.activeTrips} icon="route" color="blue" />
        <KPICard label="Pending Trips" value={d.pendingTrips} icon="route" color="yellow" />
        <KPICard label="Drivers On Duty" value={d.driversOnDuty} icon="users" color="blue" />
        <KPICard label="Fleet Utilization" value={`${d.fleetUtilization ?? 0}%`} icon="truck" color="green" />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activePieData.length > 0 && (
          <Card title={`Fleet Status${(filterType || filterStatus) ? " (Filtered)" : ""}`} subtitle={(filterType || filterStatus) ? `${fv.length} vehicles match` : `${util?.totalVehicles || 0} total vehicles`}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={activePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={55} label={CustomPieLabel} animationBegin={0} animationDuration={800} strokeWidth={0}>
                  {activePieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {costData.length > 0 && (
          <Card title="Operational Cost Breakdown" subtitle={`Total: $${cost?.totalOperationalCost?.toLocaleString()}`}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={costData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
                  {costData.map((_, i) => (
                    <Cell key={i} fill={["#6366F1", "#10B981", "#F59E0B"][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {fuelEff && (
          <Card title="Fuel Efficiency" subtitle={`${fuelEff.totalTrips} completed trips analyzed`}>
            <div className="grid grid-cols-3 gap-4 text-center py-4">
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">{fuelEff.averageKmPerLiter}</p>
                <p className="text-xs text-surface-500 font-medium uppercase tracking-wider">Km/Liter</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-surface-900 dark:text-white tabular-nums">{fuelEff.totalDistance?.toLocaleString()}</p>
                <p className="text-xs text-surface-500 font-medium uppercase tracking-wider">Total Km</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-surface-900 dark:text-white tabular-nums">{fuelEff.totalFuel}</p>
                <p className="text-xs text-surface-500 font-medium uppercase tracking-wider">Total Liters</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
