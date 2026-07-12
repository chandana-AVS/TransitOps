import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";

const icons = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  vehicles: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8m-4-4v4M4 11h16M4 15h16M4 19h16" /></svg>,
  drivers: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  trips: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
  maintenance: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  fuel: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  chat: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
};

const navItems = [
  { to: "/", label: "Dashboard", icon: icons.dashboard, roles: ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
  { to: "/vehicles", label: "Vehicles", icon: icons.vehicles, roles: ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
  { to: "/drivers", label: "Drivers", icon: icons.drivers, roles: ["FLEET_MANAGER", "SAFETY_OFFICER"] },
  { to: "/trips", label: "Trips", icon: icons.trips, roles: ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
  { to: "/maintenance", label: "Maintenance", icon: icons.maintenance, roles: ["FLEET_MANAGER", "SAFETY_OFFICER"] },
  { to: "/fuel-expenses", label: "Fuel & Expenses", icon: icons.fuel, roles: ["FLEET_MANAGER", "FINANCIAL_ANALYST", "DRIVER"] },
  { to: "/chat", label: "Operations Chat", icon: icons.chat, roles: ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
];

const roleLabels = {
  FLEET_MANAGER: "Fleet Manager",
  DRIVER: "Driver",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
};

export default function DashboardShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return document.documentElement.classList.contains("dark");
  });

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };
  const filteredItems = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-surface-950/40 backdrop-blur-sm z-20 lg:hidden animate-fade-in" style={{ animationDuration: "0.15s" }} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky lg:top-0 inset-y-0 left-0 z-30 w-[260px] h-screen bg-white dark:bg-surface-900 border-r border-surface-200/80 dark:border-surface-800 transform transition-transform duration-300 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}>
        {/* Brand header */}
        <div className="px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8m-4-4v4M4 11h16M4 15h16M4 19h16" /></svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-surface-900 dark:text-white tracking-tight">TransitOps</h1>
              <p className="text-[10px] text-surface-500 dark:text-surface-500 uppercase tracking-wider font-medium">{roleLabels[user?.role] || user?.role}</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {filteredItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                ${isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300 shadow-sm"
                  : "text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-surface-200"}`
              }
            >
              <span className="flex-shrink-0 opacity-80">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-3 border-t border-surface-100 dark:border-surface-800 space-y-0.5">
          <button
            onClick={toggleDark}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800/60 w-full transition-all duration-200"
          >
            {dark ? (
              <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
            <span>{dark ? "Light Mode" : "Dark Mode"}</span>
          </button>

          {/* User profile card */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/60 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-surface-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-accent-rose hover:bg-accent-rose/5 dark:hover:bg-accent-rose/10 w-full transition-all duration-200"
          >
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200/80 dark:border-surface-800 px-4 py-3 flex items-center gap-3 lg:hidden sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8m-4-4v4M4 11h16M4 15h16M4 19h16" /></svg>
            </div>
            <h1 className="text-base font-bold text-surface-900 dark:text-white">TransitOps</h1>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 xl:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
