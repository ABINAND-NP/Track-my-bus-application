import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Bus,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setErrors({});
    setApiError("");
    setSuccessMessage("");
    setIsSubmitting(false);
    onClose();
  };

  const validate = () => {
    const newErrors = {};
    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setApiError("");

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        setSuccessMessage(`Welcome back, ${result.user?.name || "Admin"}! Redirecting...`);
        toast.success(`Welcome back, ${result.user?.name || "Admin"}!`, {
          icon: "🚀",
        });

        setTimeout(() => {
          handleClose();
          navigate("/dashboard");
        }, 500);
      } else {
        const errorMsg = result.message || "Invalid credentials or unauthorized.";
        setApiError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || "An unexpected error occurred during login.";
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-headline"
    >
      {/* Modal Card */}
      <div
        className="relative w-full max-w-md bg-white rounded-xl border border-slate-200/90 shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Close Button */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <Bus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 id="modal-headline" className="text-lg font-bold text-slate-900">
                Admin & HR Sign In
              </h3>
              <p className="text-xs text-slate-500">
                TrackMyBus Management Console
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close login dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5" noValidate>
          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {apiError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{apiError}</span>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                  if (apiError) setApiError("");
                }}
                placeholder="admin@busservices.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50/70 border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white transition-all ${
                  errors.email
                    ? "border-red-400 focus:ring-2 focus:ring-red-400/20 focus:border-red-500"
                    : "border-slate-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-slate-700"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@busservices.com");
                  setPassword("Admin@123456");
                  setErrors({});
                  setApiError("");
                }}
                className="text-[11px] font-medium text-orange-600 hover:text-orange-700 cursor-pointer"
              >
                Fill sample
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }
                  if (apiError) setApiError("");
                }}
                placeholder="Enter admin password"
                className={`w-full pl-10 pr-11 py-2.5 rounded-lg bg-slate-50/70 border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white transition-all ${
                  errors.password
                    ? "border-red-400 focus:ring-2 focus:ring-red-400/20 focus:border-red-500"
                    : "border-slate-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 rounded-lg font-semibold text-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors shadow-sm disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Modal Footer Note */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Protected system &bull; Authorized administrators &amp; platform HR staff
          </p>
        </div>
      </div>
    </div>
  );
}
