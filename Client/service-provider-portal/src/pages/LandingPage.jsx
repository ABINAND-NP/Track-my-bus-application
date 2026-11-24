import { useState } from "react";
import {
  Bus,
  Shield,
  Activity,
  Zap,
  Navigation,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  Radio,
  Sliders,
  TrendingUp,
  Sparkles,
  LogIn,
  UserPlus
} from "lucide-react";
import ProviderNavbar from "../components/ProviderNavbar";
import ProviderFooter from "../components/ProviderFooter";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleHeroAccountCreation = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setIsRegisterOpen(true);
    }
  };

  const handleHeroLogin = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Navbar with Web Name "TrackMyBus edge" & "Operator Login" Button */}
      <ProviderNavbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section
          id="portal-overview"
          className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-800/80"
        >
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/15 to-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold tracking-wide shadow-sm shadow-emerald-500/10">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="uppercase tracking-wider">Service Provider Portal</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">Fleet Intelligence & Control</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Master Your Bus Network with{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  TrackMyBus Edge
                </span>
              </h1>

              {/* Subtitle / Description */}
              <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl mx-auto">
                The centralized command center for bus operators and transit authorities.
                Deploy real-time telematics, manage schedules, dispatch drivers, and monitor passenger flow with sub-second precision.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Account Creation Button */}
                <button
                  type="button"
                  onClick={handleHeroAccountCreation}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                {/* Operator Login Button */}
                <button
                  type="button"
                  onClick={handleHeroLogin}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/60 shadow-lg shadow-black/40 transition-all duration-200"
                >
                  <LogIn className="w-5 h-5 text-emerald-400" />
                  <span>Operator Login</span>
                </button>
              </div>

              {/* Instant Highlights */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Direct Dashboard Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero Initial Hardware Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant Driver & Route Sync</span>
                </div>
              </div>
            </div>

            {/* Dashboard Telemetry Live Preview Card */}
            <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-gradient-to-b from-slate-800/80 via-slate-900/90 to-slate-950 border border-slate-700/60 shadow-2xl p-5 sm:p-7 backdrop-blur-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Live Dispatch Telemetry Mock
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-emerald-400 font-mono">
                    NODE-EDG-09
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                  <span>GPS Latency: <strong className="text-emerald-400">18ms</strong></span>
                  <span>Active Fleets: <strong className="text-teal-400">18 Units</strong></span>
                  <span>System: <strong className="text-emerald-400">Online</strong></span>
                </div>
              </div>

              {/* Sample Fleet Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
                {/* Fleet Card 1 */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-white font-mono">BUS #TB-101</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      ON ROUTE
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200">Express Route 24: Downtown → Airport</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Driver: Marcus Vance</span>
                    <span className="text-emerald-400 font-mono">54 km/h</span>
                  </div>
                </div>

                {/* Fleet Card 2 */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-white font-mono">BUS #TB-104</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      BOARDING
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200">Suburban Line 9: West Terminal</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Driver: Elena Rostova</span>
                    <span className="text-cyan-400 font-mono">Departs in 3m</span>
                  </div>
                </div>

                {/* Fleet Card 3 */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-white font-mono">BUS #TB-218</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      SCHEDULED
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200">Intercity Corridor: Central Station</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Driver: Alex Chen</span>
                    <span className="text-amber-400 font-mono">Departs 14:30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES GRID */}
        <section id="fleet-features" className="py-20 bg-slate-950 relative border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Engineered for High-Frequency Transit
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Everything Operators Need in One Place
              </h2>
              <p className="text-sm text-slate-400">
                Designed to eliminate dispatch friction, increase on-time adherence, and give service providers complete control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all hover:bg-slate-900/90 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Real-Time GPS Telemetry</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Track every vehicle with high-frequency live GPS updates, instant ETA recalibrations, and route geofencing.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition-all hover:bg-slate-900/90 group">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Dynamic Route Schedules</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Easily adapt timetables, manage peak-hour frequencies, and notify waiting passengers instantaneously.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all hover:bg-slate-900/90 group">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Operator & Crew Rosters</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Assign drivers and conductors to specific buses and routes with automated shift verification and compliance.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all hover:bg-slate-900/90 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Operational Analytics</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Monitor fleet fuel economy, on-time punctuality percentages, passenger loads, and maintenance cycles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BANNER */}
        <section id="provider-benefits" className="py-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Onboarding
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Ready to elevate your bus fleet with TrackMyBus Edge?
                </h2>

                <p className="text-sm sm:text-base text-slate-300">
                  Create your service provider account in seconds with your name, email, and password. Get direct access to the operator dashboard immediately.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleHeroAccountCreation}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/20 transition-all duration-200"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Create Operator Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleHeroLogin}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-all"
                  >
                    <LogIn className="w-5 h-5 text-emerald-400" />
                    <span>Operator Sign In</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <ProviderFooter
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}

