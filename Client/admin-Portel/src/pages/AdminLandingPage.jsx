import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminNavbar from "../components/AdminNavbar";
import AdminFooter from "../components/AdminFooter";
import LoginModal from "../components/LoginModal";
import {
  Bus,
  ShieldCheck,
  Building2,
  Route,
  Activity,
  ArrowRight,
} from "lucide-react";

export default function AdminLandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAccess = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-orange-100 selection:text-orange-950">
      {/* 1. Navbar */}
      <AdminNavbar onOpenLogin={() => setIsLoginOpen(true)} />

      {/* Signature Orange Announcement Ribbon */}
      <div className="w-full bg-orange-600 text-white text-center py-2.5 px-4 text-xs sm:text-sm font-medium tracking-wide shadow-2xs">
        This is a sample UI platform designed exclusively for testing and prototyping.
      </div>

      {/* 2. Main Content Section */}
      <main className="flex-1 flex flex-col justify-center relative overflow-hidden py-12 sm:py-16 lg:py-20">
        {/* Subtle Transportation / Route Network Background Graphics */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `radial-gradient(#ea580c 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Soft ambient orange gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-orange-100/60 via-amber-50/40 to-transparent rounded-full blur-3xl" />

          {/* Decorative geometric route transit lines */}
          <svg
            className="absolute top-10 right-0 w-1/3 h-full opacity-15 hidden lg:block text-orange-600"
            viewBox="0 0 400 600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M50 0 V220 Q50 280 120 280 H350" strokeDasharray="4 4" />
            <path d="M120 600 V380 Q120 320 190 320 H400" />
            <circle cx="50" cy="220" r="4" fill="currentColor" />
            <circle cx="120" cy="280" r="4" fill="currentColor" />
            <circle cx="350" cy="280" r="4" fill="currentColor" />
            <circle cx="190" cy="320" r="4" fill="currentColor" />
          </svg>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50/90 border border-orange-200/80 text-orange-800 text-xs font-semibold mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              <span>Transportation Management Platform</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Admin Portal
            </h1>

            {/* Description */}
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Manage bus service providers, monitor transportation operations, and
              oversee the TrackMyBus platform from one centralized control system.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={handleAccess}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
              >
                <span>{isAuthenticated ? "Go to Admin Dashboard" : "Access Admin Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleAccess}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>{isAuthenticated ? "Open Dashboard" : "Authorized Staff Login"}</span>
              </button>
            </div>

            {/* Platform Feature Cards */}
            <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {/* Card 1 */}
              <div className="bg-white/95 rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-3.5">
                  <Building2 className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Service Providers
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Onboard operators, verify credentials, and regulate transit partners.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/95 rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-3.5">
                  <Route className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Route Operations
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Oversee transit corridors, schedules, bus stops, and line updates.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/95 rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-3.5">
                  <Activity className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  System Oversight
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Centralized telemetry, platform health, user roles, and compliance.
                </p>
              </div>
            </div>

            {/* Live Status indicator */}
            <div className="mt-8 inline-flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>System Status: Core Transit Services Operational</span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <AdminFooter />

      {/* 4. Login Modal Overlay */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
