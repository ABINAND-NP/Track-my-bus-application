import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bus,
  LayoutDashboard,
  UserCheck,
  Users,
  LogOut,
  Radio,
  X,
  ShieldCheck,
  Ticket,
  Briefcase
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function DashboardSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const isServiceProvider = user?.role === "service_provider" || user?.role === "admin";
  const isHR = user?.role === "provider_hr";
  const isOperator = user?.role === "operator";

  // Navigation items filtered dynamically by the logged in user's role
  const navLinks = [
    {
      name: isOperator ? "My Duty & Route" : "Fleet Overview",
      to: "/dashboard",
      end: true,
      icon: LayoutDashboard,
      badge: isOperator ? "Active Shift" : "Live",
      allowed: true, // all roles access dashboard
    },
    {
      name: isHR ? "Staff (HR) Directory" : "Create Staff (HR)",
      to: "/dashboard/create-staff",
      end: false,
      icon: UserCheck,
      badge: "HR",
      allowed: isServiceProvider || isHR, // Providers and HR staff
    },
    {
      name: isHR ? "Enroll Operators" : "Create Bus Operator",
      to: "/dashboard/create-operator",
      end: false,
      icon: Users,
      badge: "Driver / Conductor",
      allowed: isServiceProvider || isHR, // Providers and HR staff
    },
  ].filter((item) => item.allowed);

  const getRoleDisplayName = () => {
    if (isHR) {
      const empId = user?.platformEmployeeDetails?.employeeId;
      return empId ? `Staff (HR) • ${empId}` : "Staff (HR)";
    }
    if (isOperator) {
      const isConductor = user?.operatorDetails?.operatorType === "conductor";
      return isConductor ? "Operator (Conductor)" : "Operator (Driver)";
    }
    return user?.role === "admin" ? "Platform Admin" : "Service Provider";
  };

  const getRoleBadgeStyle = () => {
    if (isHR) {
      return "text-teal-400 bg-teal-500/10 border-teal-500/30";
    }
    if (isOperator) {
      const isConductor = user?.operatorDetails?.operatorType === "conductor";
      return isConductor
        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
        : "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    }
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  };

  const getAvatarGradient = () => {
    if (isHR) return "from-teal-500 to-emerald-400";
    if (isOperator) {
      const isConductor = user?.operatorDetails?.operatorType === "conductor";
      return isConductor ? "from-amber-500 to-orange-400" : "from-cyan-500 to-blue-400";
    }
    return "from-emerald-500 via-teal-500 to-cyan-500";
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-slate-800/90 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bus className="w-5 h-5 text-emerald-400 group-hover:rotate-[-6deg] transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black tracking-tight text-white font-sans">
                  TrackMyBus
                </span>
                <span className="text-lg font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent lowercase">
                  edge
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest block -mt-1">
                Control Center
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isOperator ? "Driver & Conductor Operations" : "Management & Operations"}
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-emerald-400" : "text-slate-400"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Section: Live Node, User Name & Sign Out */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 space-y-3.5">
          {/* Live Node Indicator */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800/90 text-xs font-medium text-emerald-400 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-200">Live Node : Active</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              18ms
            </span>
          </div>

          {/* User Name & Profile Info */}
          <div className="flex items-center gap-3 px-2">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarGradient()} flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shrink-0`}
            >
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user?.name || "Transit Partner"}
              </p>
              <p className="text-xs text-emerald-400/90 capitalize truncate font-medium">
                {getRoleDisplayName()}
              </p>
            </div>
          </div>

          {/* Sign Out Button (Replaced from Navbar into bottom of Sidebar) */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-all duration-200 group active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4 text-rose-400 group-hover:rotate-[-6deg] transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
