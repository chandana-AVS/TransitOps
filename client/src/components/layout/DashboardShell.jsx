import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";

const navItems = [
  { to: "/", label: "Dashboard", roles: ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
  { to: "/vehicles", label: "Vehicles", roles: ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
  { to: "/drivers", label: "Drivers", roles: ["FLEET_MANAGER", "SAFETY_OFFICER"] },
  { to: "/trips", label: "Trips", roles: ["FLEET_MANAGER", "DRIVER"] },
  { to: "/maintenance", label: "Maintenance", roles: ["FLEET_MANAGER"] },
  { to: "/fuel-expenses", label: "Fuel & Expenses", roles: ["FLEET_MANAGER", "FINANCIAL_ANALYST", "DRIVER"] },
];

export default function DashboardShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">TransitOps</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role?.replace("_", " ")}</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded text-sm ${isActive ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t dark:border-gray-700">
          <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 dark:text-red-400">Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
