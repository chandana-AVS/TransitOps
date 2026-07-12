import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/AuthProvider";
import LoginPage from "./features/auth/LoginPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import VehicleListPage from "./features/vehicles/VehicleListPage";
import DriverListPage from "./features/drivers/DriverListPage";
import TripListPage from "./features/trips/TripListPage";
import MaintenanceListPage from "./features/maintenance/MaintenanceListPage";
import FuelLogPage from "./features/fuel-expenses/FuelLogPage";
import RoleGuard from "./routes/RoleGuard";
import DashboardShell from "./components/layout/DashboardShell";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <DashboardShell>{children}</DashboardShell>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><VehicleListPage /></ProtectedRoute>} />
        <Route path="/drivers" element={<ProtectedRoute><DriverListPage /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute><TripListPage /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><MaintenanceListPage /></ProtectedRoute>} />
        <Route path="/fuel-expenses" element={<ProtectedRoute><FuelLogPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
