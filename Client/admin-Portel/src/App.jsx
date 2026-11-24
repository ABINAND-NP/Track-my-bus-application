import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLandingPage from "./pages/AdminLandingPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              border: "1px solid #334155",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
            },
          }}
        />

        <Routes>
          {/* Admin Portal Landing Page with Navbar, Main Content, Footer & Login Modal */}
          <Route path="/" element={<AdminLandingPage />} />

          {/* Protected Admin Dashboard */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<AdminLandingPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
