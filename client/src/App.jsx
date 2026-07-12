import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/AuthProvider";
import LoginPage from "./features/auth/LoginPage";
import DashboardRouter from "./features/dashboard/DashboardRouter";
import VehicleListPage from "./features/vehicles/VehicleListPage";
import DriverListPage from "./features/drivers/DriverListPage";
import TripListPage from "./features/trips/TripListPage";
import MaintenanceListPage from "./features/maintenance/MaintenanceListPage";
import FuelLogPage from "./features/fuel-expenses/FuelLogPage";
import ChatPage from "./features/chat/ChatPage";
import SuspendedPage from "./features/auth/SuspendedPage";
import RoleGuard from "./routes/RoleGuard";
import DashboardShell from "./components/layout/DashboardShell";
import { ToastProvider } from "./components/ui/Toast";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "DRIVER" && user.driverStatus === "SUSPENDED") return <SuspendedPage />;
  return <DashboardShell>{children}</DashboardShell>;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          <Route path="/vehicles" element={
            <ProtectedRoute>
              <RoleGuard roles={["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"]}>
                <VehicleListPage />
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="/drivers" element={
            <ProtectedRoute>
              <RoleGuard roles={["FLEET_MANAGER", "SAFETY_OFFICER"]}>
                <DriverListPage />
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="/trips" element={
            <ProtectedRoute>
              <RoleGuard roles={["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"]}>
                <TripListPage />
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="/maintenance" element={
            <ProtectedRoute>
              <RoleGuard roles={["FLEET_MANAGER", "SAFETY_OFFICER"]}>
                <MaintenanceListPage />
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="/fuel-expenses" element={
            <ProtectedRoute>
              <RoleGuard roles={["FLEET_MANAGER", "FINANCIAL_ANALYST", "DRIVER"]}>
                <FuelLogPage />
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <RoleGuard roles={["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"]}>
                <ChatPage />
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
