import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import FleetOverview from "./pages/dashboard/FleetOverview";
import CreateStaffHR from "./pages/dashboard/CreateStaffHR";
import CreateBusOperator from "./pages/dashboard/CreateBusOperator";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #1e293b",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
            },
          }}
        />

        <Routes>
          {/* Service Provider Portal Landing Page with Navbar, Content, Footer & Modals */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected Service Provider Dashboard with Sidebar Layout & Outlet */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<FleetOverview />} />
              <Route path="create-staff" element={<CreateStaffHR />} />
              <Route path="create-operator" element={<CreateBusOperator />} />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
