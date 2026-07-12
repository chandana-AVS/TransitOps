import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-surface-800 px-4 py-3 shadow-xl rounded-xl border border-surface-200 dark:border-surface-700 text-sm">
        <p className="text-surface-900 dark:text-white font-semibold mb-1">{payload[0].payload.registrationNumber || label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-surface-500 dark:text-surface-400 text-xs">
            {p.name}: {p.name === 'roi' ? `${p.value}%` : `$${Number(p.value).toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function FinancialAnalystDashboard() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["fa-kpis"],
    queryFn: () => api.get("/dashboard/kpis"),
  });

  const { data: cost } = useQuery({
    queryKey: ["fa-cost"],
    queryFn: () => api.get("/reports/cost"),
  });

  const { data: fuelEff } = useQuery({
    queryKey: ["fa-fuel"],
    queryFn: () => api.get("/reports/fuel-efficiency"),
  });

  const { data: roiData } = useQuery({
    queryKey: ["fa-roi"],
    queryFn: () => api.get("/reports/roi"),
  });

  const { data: util } = useQuery({
    queryKey: ["fa-util"],
    queryFn: () => api.get("/reports/utilization"),
  });

  const roi = roiData || [];
  const d = kpis || {};

  const costData = cost ? [
    { name: "Fuel", cost: cost.totalFuelCost },
    { name: "Maintenance", cost: cost.totalMaintenanceCost },
    { name: "Other", cost: cost.totalOtherExpenses },
  ] : [];

  const roiChartData = roi.map((r) => ({
    name: r.registrationNumber,
    registrationNumber: r.registrationNumber,
    roi: r.roi,
  }));

  if (kpisLoading) return (
    <div className="space-y-6 animate-fade-in">
      <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded-xl w-48 animate-shimmer" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-surface-200 dark:bg-surface-700 rounded-2xl animate-shimmer" />)}
      </div>
    </div>
  );

  const handleExport = () => {
    const token = localStorage.getItem("token");
    window.open(`/api/reports/export.csv?token=${encodeURIComponent(token || "")}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Financial Analytics</h1>
          <p className="text-sm text-surface-500 mt-0.5">Cost analysis and ROI reporting</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleExport}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Fleet Utilization</p>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">{util?.utilizationRate ?? 0}%</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Total Trips</p>
          <p className="text-3xl font-bold text-surface-900 dark:text-white tabular-nums">{(d.activeTrips || 0) + (d.pendingTrips || 0)}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Total Vehicles</p>
          <p className="text-3xl font-bold text-surface-900 dark:text-white tabular-nums">{util?.totalVehicles || 0}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Total Op. Cost</p>
          <p className="text-3xl font-bold text-accent-amber tabular-nums">${cost?.totalOperationalCost?.toLocaleString() || 0}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Operational Cost Breakdown">
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

        <Card title="Vehicle ROI">
          {roiChartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-surface-400">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <p className="text-sm">No ROI data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={roiChartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#64748B", fontSize: 11 }} width={80} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="roi" radius={[0, 8, 8, 0]}>
                  {roiChartData.map((entry, i) => (
                    <Cell key={i} fill={roi[i]?.roi >= 0 ? "#10B981" : "#F43F5E"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {fuelEff && (
          <Card title="Fuel Efficiency Summary">
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
                <p className="text-3xl font-bold text-accent-amber tabular-nums">${cost?.totalFuelCost?.toLocaleString()}</p>
                <p className="text-xs text-surface-500 font-medium uppercase tracking-wider">Fuel Cost</p>
              </div>
            </div>
          </Card>
        )}

        <Card title="Per-Vehicle ROI" actions={<Button size="sm" variant="ghost" onClick={() => window.open("/api/reports/export.csv")}>Export</Button>}>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {roi.map((r) => (
              <div key={r.vehicleId} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700/30 rounded-xl text-sm transition-colors hover:bg-surface-100 dark:hover:bg-surface-700/50">
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white text-sm">{r.registrationNumber}</p>
                  <p className="text-[11px] text-surface-500">Acq: ${r.acquisitionCost?.toLocaleString()} · Op: ${r.totalOperatingCost?.toLocaleString()}</p>
                </div>
                <span className={`font-bold text-sm tabular-nums ${r.roi >= 0 ? "text-accent-emerald" : "text-accent-rose"}`}>{r.roi}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
