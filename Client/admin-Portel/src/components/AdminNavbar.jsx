import { Bus, ShieldCheck, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminNavbar({ onOpenLogin }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left: Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm ring-1 ring-orange-700/10 group-hover:bg-orange-700 transition-colors">
              <Bus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                TrackMyBus
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200/80">
                <ShieldCheck className="w-3 h-3 text-orange-600" />
                Admin Portal
              </span>
            </div>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition-colors shadow-sm cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
