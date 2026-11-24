import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  const { user, token, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-sm font-medium text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!token || !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const PublicRoute = ({ children }) => {
  const { token, isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (token && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

