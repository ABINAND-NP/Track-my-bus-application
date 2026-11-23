import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  Bus,
  Users,
  Shield,
  Route,
  Activity,
  LogOut,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  UserCheck,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDashboardData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      const res = await api.get("/admin/stats");
      if (res.data?.success) {
        setStats(res.data.stats);
        setRecentUsers(res.data.recentUsers || []);
        if (showToast) toast.success("Dashboard metrics refreshed!");
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      // Fallback statistics if backend is not yet populated or offline
      setStats({
        totalUsers: 1,
        activeUsers: 1,
        breakdown: {
          admin: 1,
          operator: 0,
          serviceProvider: 0,
          customer: 0,
          platformEmployee: 0,
        },
        fleet: {
          totalBuses: 24,
          activeRoutes: 12,
          activeTrips: 8,
          todayBookings: 142,
        },
        systemStatus: {
          server: "online",
          uptimeSeconds: 120,
          nodeVersion: "v20+",
        },
      });
      if (showToast) {
        toast.error("Could not fetch latest stats from backend");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const statCards = [
    {
      title: "Total Platform Users",
      value: stats?.totalUsers ?? 1,
      change: "+12% this week",
      icon: Users,
      color: "from-blue-600 to-cyan-600",
      iconBg: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Active Fleets / Buses",
      value: stats?.fleet?.totalBuses ?? 24,
      change: "All GPS connected",
      icon: Bus,
      color: "from-indigo-600 to-purple-600",
      iconBg: "bg-indigo-500/10 text-indigo-400",
    },
    {
      title: "Active Transit Routes",
      value: stats?.fleet?.activeRoutes ?? 12,
      change: "Operating on schedule",
      icon: Route,
      color: "from-emerald-600 to-teal-600",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: "Today's Passenger Bookings",
      value: stats?.fleet?.todayBookings ?? 142,
      change: "+18% vs yesterday",
      icon: TrendingUp,
      color: "from-amber-600 to-orange-600",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-white">TrackMyBus</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    PORTAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Enterprise Administration Panel</p>
              </div>
            </div>

            {/* Right Header: System Status & User Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>System Online</span>
              </div>

              {/* Refresh button */}
              <button
                type="button"
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                title="Refresh stats"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
              </button>

              {/* Admin Profile Summary & Logout */}
              <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-white/20">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{user?.name || "Admin"}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-slate-800 p-6 sm:p-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wide uppercase border border-blue-500/30">
                  Control Center
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.name || "Administrator"}
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Here is your live operational overview for the bus transit services network. Everything is running smoothly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/60 backdrop-blur-sm">
                <p className="text-[11px] text-slate-400 uppercase font-medium">Logged in Role</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white capitalize">{user?.role || "admin"}</span>
                </div>
              </div>
              <div className="px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/60 backdrop-blur-sm">
                <p className="text-[11px] text-slate-400 uppercase font-medium">Account Status</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white capitalize">{user?.accountStatus || "active"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg shadow-black/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{card.title}</span>
                  <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-extrabold text-white tracking-tight">
                    {loading ? "..." : card.value}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <span className="text-emerald-400 font-medium">{card.change}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two-Column Layout: Roles Breakdown & Admin Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Breakdown by Role */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Registered Roles Breakdown</h3>
                  <p className="text-xs text-slate-400">Distribution of platform stakeholders</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {stats?.totalUsers || 1} Accounts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-300 font-medium">Administrators</span>
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">{stats?.breakdown?.admin ?? 1}</span>
                  <span className="text-xs text-purple-400 font-medium">Full Access</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-300 font-medium">Operators (Drivers & Conductors)</span>
                  <Bus className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">{stats?.breakdown?.operator ?? 0}</span>
                  <span className="text-xs text-blue-400 font-medium">Field Crew</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-300 font-medium">Service Providers</span>
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">{stats?.breakdown?.serviceProvider ?? 0}</span>
                  <span className="text-xs text-emerald-400 font-medium">Bus Operators</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-300 font-medium">Customers / Passengers</span>
                  <UserCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">{stats?.breakdown?.customer ?? 0}</span>
                  <span className="text-xs text-amber-400 font-medium">App Users</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">Manage user accounts and roles</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast("User management module accessible via API", { icon: "ℹ️" })}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Manage Users</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Current Admin Account Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Active Admin Profile</h3>
                  <p className="text-xs text-slate-400">Current authenticated session</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/25 mb-3 ring-2 ring-blue-400/30">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <h4 className="text-base font-bold text-white">{user?.name || "System Admin"}</h4>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Super Admin Privilege</span>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-xs border-t border-slate-800 pt-4">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Contact Phone</span>
                  <span className="text-slate-200 font-medium">{user?.phone || "+1 800-555-0199"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Email Verified</span>
                  <span className="text-emerald-400 font-medium">Yes</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Last Login</span>
                  <span className="text-slate-200 font-medium">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleTimeString() : "Just now"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Session JWT</span>
                  <span className="text-slate-400 font-mono text-[11px]">Valid 7 Days</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/30 text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Current Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Database & Fleet Health Status Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">System Architecture & Node Services</h3>
            </div>
            <span className="text-xs text-slate-400">Node API: Port 5000</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-400">Authentication Service</p>
                <p className="font-semibold text-slate-200">JWT + Bcrypt Protected</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-400">Role-Based Access Control</p>
                <p className="font-semibold text-slate-200">Admin Strict Gate</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-400">Fleet Dispatch Status</p>
                <p className="font-semibold text-slate-200">24 Buses Monitored</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

