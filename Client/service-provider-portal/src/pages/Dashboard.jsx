import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  Menu,
  Radio,
  Bell,
  Bus,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Sidebar with Staff (HR), Bus Operator, Live Node: Active, Name & Sign Out at bottom */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-20 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800 lg:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                  TrackMyBus Edge
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-semibold text-emerald-400">
                  Fleet Control Node
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Enterprise service provider management portal
              </p>
            </div>
          </div>

          {/* Right Header Status Controls (Sign Out moved to bottom of sidebar!) */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All Systems Operational</span>
            </div>

            <button
              type="button"
              onClick={() => toast.success("All dispatch notifications are up to date.")}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Outlet for FleetOverview, CreateStaffHR, and CreateBusOperator */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
