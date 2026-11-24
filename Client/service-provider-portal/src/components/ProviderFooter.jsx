import { Bus, ShieldCheck, Activity, Mail, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProviderFooter({ onOpenLogin, onOpenRegister }) {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bus className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  TrackMyBus
                </span>
                <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent lowercase">
                  edge
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              TrackMyBus Edge is the premier enterprise platform for bus service providers and fleet operators.
              Streamline telemetry, optimize routes, coordinate drivers, and elevate passenger transit experiences.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Edge Dispatch Network: 100% Operational
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Portal Access
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Operator Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Create Account
                </button>
              </li>
              <li>
                <a href="#portal-overview" className="hover:text-emerald-400 transition-colors">
                  Platform Overview
                </a>
              </li>
              <li>
                <a href="#fleet-features" className="hover:text-emerald-400 transition-colors">
                  Fleet Features
                </a>
              </li>
            </ul>
          </div>

          {/* Fleet Operations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Operations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-slate-300 cursor-default">Real-Time Telemetry</span>
              </li>
              <li>
                <span className="hover:text-slate-300 cursor-default">Route Optimization</span>
              </li>
              <li>
                <span className="hover:text-slate-300 cursor-default">Driver Roster Engine</span>
              </li>
              <li>
                <span className="hover:text-slate-300 cursor-default">Conductor Fare Sync</span>
              </li>
            </ul>
          </div>

          {/* Support & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Security & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Enterprise Encrypted</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Activity className="w-4 h-4 text-teal-400 shrink-0" />
                <span>99.9% Uptime SLA</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>partner@trackmybus.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TrackMyBus Edge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Operator Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

