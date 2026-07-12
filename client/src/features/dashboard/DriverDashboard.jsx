import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useAuth } from "../auth/AuthProvider";
import Card from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function DriverDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: trips, isLoading } = useQuery({
    queryKey: ["my-trips"],
    queryFn: () => api.get("/trips?limit=20"),
  });

  const { data: vehicles } = useQuery({
    queryKey: ["available-vehicles"],
    queryFn: () => api.get("/vehicles?status=AVAILABLE&limit=10"),
  });

  const myTrips = trips?.trips || [];
  const activeTrips = myTrips.filter((t) => t.status === "DISPATCHED");
  const draftTrips = myTrips.filter((t) => t.status === "DRAFT");
  const recentCompleted = myTrips.filter((t) => t.status === "COMPLETED").slice(0, 5);

  if (isLoading) return (
    <div className="space-y-6 animate-fade-in">
      <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded-xl w-48 animate-shimmer" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-surface-200 dark:bg-surface-700 rounded-2xl animate-shimmer" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">My Dashboard</h1>
          <p className="text-sm text-surface-500 mt-0.5">Welcome back, {user?.name}</p>
        </div>
        <Button onClick={() => navigate("/trips")}>View All Trips</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Active Deliveries</p>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">{activeTrips.length}</p>
          <p className="text-xs text-surface-500 mt-1">Trips currently in progress</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Draft Trips</p>
          <p className="text-3xl font-bold text-accent-amber tabular-nums">{draftTrips.length}</p>
          <p className="text-xs text-surface-500 mt-1">Awaiting dispatch</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Available Vehicles</p>
          <p className="text-3xl font-bold text-accent-emerald tabular-nums">{vehicles?.vehicles?.length || 0}</p>
          <p className="text-xs text-surface-500 mt-1">Ready to assign</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Active Trips" actions={<Button size="sm" variant="ghost" onClick={() => navigate("/trips")}>View All</Button>}>
          {activeTrips.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-surface-400">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              <p className="text-sm">No active trips</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeTrips.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700/30 rounded-xl transition-colors hover:bg-surface-100 dark:hover:bg-surface-700/50">
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{t.source} → {t.destination}</p>
                    <p className="text-[11px] text-surface-500 mt-0.5">{t.cargoWeight} kg · {t.vehicle?.registrationNumber}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Recent Completed" actions={<Button size="sm" variant="ghost" onClick={() => navigate("/trips")}>View All</Button>}>
          {recentCompleted.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-surface-400">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm">No completed trips yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentCompleted.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm p-2.5 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                  <span className="text-surface-700 dark:text-surface-300">{t.source} → {t.destination}</span>
                  <span className="text-surface-500 tabular-nums">{t.actualDistance || t.plannedDistance} km</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
