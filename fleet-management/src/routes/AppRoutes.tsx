import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/mainlayout";

import Dashboard from "../pages/Dashboard/dashboard";
import Vehicles from "../pages/vehicle/vehicles";
import Drivers from "../pages/drivers";
import Trips from "../pages/trips";
import Maintenance from "../pages/maintenance";
import Fuel from "../pages/fuel";
import Expenses from "../pages/expenses";
import Reports from "../pages/reports";
import Login from "../pages/login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/vehicles" element={<Vehicles />} />

          <Route path="/drivers" element={<Drivers />} />

          <Route path="/trips" element={<Trips />} />

          <Route path="/maintenance" element={<Maintenance />} />

          <Route path="/fuel" element={<Fuel />} />

          <Route path="/expenses" element={<Expenses />} />

          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
