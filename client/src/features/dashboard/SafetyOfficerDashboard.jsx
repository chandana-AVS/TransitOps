import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import Card from "../../components/ui/Card";

function getDaysUntil(dateStr) {
  const now = new Date();
  const expiry = new Date(dateStr);
  return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
}

export default function SafetyOfficerDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["safety-drivers"],
    queryFn: () => api.get("/drivers?limit=100"),
  });

  const drivers = data?.drivers || [];
  const expiredLicenses = drivers.filter((d) => getDaysUntil(d.licenseExpiryDate) <= 0);
  const expiringSoon = drivers.filter((d) => { const days = getDaysUntil(d.licenseExpiryDate); return days > 0 && days <= 14; });
  const expiringMonth = drivers.filter((d) => { const days = getDaysUntil(d.licenseExpiryDate); return days > 14 && days <= 30; });
  const suspendedDrivers = drivers.filter((d) => d.status === "SUSPENDED");
  const sortedByScore = [...drivers].sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0));

  if (isLoading) return (
    <div className="space-y-6 animate-fade-in">
      <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded-xl w-48 animate-shimmer" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-surface-200 dark:bg-surface-700 rounded-2xl animate-shimmer" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Safety Dashboard</h1>
        <p className="text-sm text-surface-500 mt-0.5">Driver compliance and license monitoring</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Expired Licenses</p>
          <p className="text-3xl font-bold text-accent-rose tabular-nums">{expiredLicenses.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Expiring in 14d</p>
          <p className="text-3xl font-bold text-accent-amber tabular-nums">{expiringSoon.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Expiring in 30d</p>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">{expiringMonth.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Suspended</p>
          <p className="text-3xl font-bold text-accent-rose tabular-nums">{suspendedDrivers.length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="License Expiry Alerts">
          {expiredLicenses.length === 0 && expiringSoon.length === 0 && expiringMonth.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-accent-emerald">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm font-medium">All licenses are valid</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...expiredLicenses, ...expiringSoon, ...expiringMonth].slice(0, 10).map((d) => {
                const days = getDaysUntil(d.licenseExpiryDate);
                let badge, badgeClass;
                if (days <= 0) { badge = "EXPIRED"; badgeClass = "bg-accent-rose/10 text-accent-rose"; }
                else if (days <= 14) { badge = `${days}d left`; badgeClass = "bg-accent-amber/10 text-accent-amber"; }
                else { badge = `${days}d left`; badgeClass = "bg-primary-500/10 text-primary-600 dark:text-primary-400"; }
                return (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700/30 rounded-xl text-sm transition-colors hover:bg-surface-100 dark:hover:bg-surface-700/50">
                    <div>
                      <p className="font-semibold text-surface-900 dark:text-white">{d.user?.name}</p>
                      <p className="text-[11px] text-surface-500 mt-0.5">{d.licenseNumber} · Exp: {new Date(d.licenseExpiryDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider ${badgeClass}`}>{badge}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card title="Driver Safety Scores">
          {drivers.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-surface-400">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <p className="text-sm">No drivers registered</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedByScore.slice(0, 10).map((d) => {
                const score = d.safetyScore || 0;
                const barColor = score >= 7 ? "bg-accent-emerald" : score >= 4 ? "bg-accent-amber" : "bg-accent-rose";
                return (
                  <div key={d.id} className="flex items-center gap-3 text-sm">
                    <span className="w-28 text-surface-700 dark:text-surface-300 truncate text-xs font-medium">{d.user?.name}</span>
                    <div className="flex-1 h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${(score / 10) * 100}%` }} />
                    </div>
                    <span className="w-8 text-right font-bold text-surface-900 dark:text-white tabular-nums text-xs">{score}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
