import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  AlertCircle,
  Bus,
  CheckCircle2,
  ShieldCheck,
  Users,
  UserCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(formData.email.trim(), formData.password);
      if (result.success) {
        const roleLabel =
          result.user?.role === "provider_hr"
            ? "Staff (HR)"
            : result.user?.role === "operator"
            ? result.user?.operatorDetails?.operatorType === "conductor"
              ? "Conductor"
              : "Driver"
            : "Service Provider";

        toast.success(`Welcome back, ${result.user?.name || "User"} (${roleLabel})!`);
        onClose();
        navigate("/dashboard");
      } else {
        setErrorMsg(result.message || "Failed to log in. Please check your credentials.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bus className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Sign In to Edge Portal
            </h3>
            <p className="text-xs text-slate-400">
              TrackMyBus <span className="text-emerald-400 font-semibold lowercase">edge</span> Unified Access
            </p>
          </div>
        </div>

        {/* Roles Supported Banner */}
        <div className="mb-5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            <span>Single Portal For All Roles:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold text-[10px]">
              <ShieldCheck className="w-3 h-3" />
              Service Provider
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/25 font-semibold text-[10px]">
              <UserCheck className="w-3 h-3" />
              Staff (HR)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 font-semibold text-[10px]">
              <Users className="w-3 h-3" />
              Driver & Conductor
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Account Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="provider@fleet.com, hr@metro.com, or driver@bus.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 shadow-lg shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In to Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Don't have a service provider account?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline inline-flex items-center gap-1 ml-1"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
