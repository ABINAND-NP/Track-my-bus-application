import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bus, LogIn, UserPlus, LogOut, LayoutDashboard, Shield, Menu, X, Radio } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProviderNavbar({ onOpenLogin, onOpenRegister }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Web Name: TrackMyBus edge */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bus className="w-6 h-6 text-emerald-400 group-hover:rotate-[-6deg] transition-transform" />
              </div>
              {/* Pulsing signal indicator */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                  TrackMyBus
                </span>
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent lowercase">
                  edge
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/90 -mt-0.5">
                Service Provider Portal
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#portal-overview" className="hover:text-emerald-400 transition-colors">
              Overview
            </a>
            <a href="#fleet-features" className="hover:text-emerald-400 transition-colors">
              Fleet Features
            </a>
            <a href="#live-dispatch" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Live Telemetry
            </a>
            <a href="#provider-benefits" className="hover:text-emerald-400 transition-colors">
              Benefits
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 hover:border-emerald-500/50 transition-all shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name ? user.name[0] : "O"}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-white leading-tight truncate max-w-[110px]">
                      {user?.name || "Operator"}
                    </p>
                    <p className="text-[10px] text-emerald-400 capitalize">
                      {user?.role?.replace("_", " ") || "Partner"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Operator Login Button */}
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-slate-850 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 shadow-sm transition-all duration-200 active:scale-95"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>Operator Login</span>
                </button>

                {/* Account Creation Button */}
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-md shadow-emerald-500/20 transition-all duration-200 active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <a
              href="#portal-overview"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 transition-colors py-1"
            >
              Overview
            </a>
            <a
              href="#fleet-features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 transition-colors py-1"
            >
              Fleet Features
            </a>
            <a
              href="#live-dispatch"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 transition-colors py-1"
            >
              Live Telemetry
            </a>
            <a
              href="#provider-benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 transition-colors py-1"
            >
              Benefits
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800 border border-slate-700"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-850 hover:bg-slate-800 border border-slate-700"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  Operator Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegister();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

