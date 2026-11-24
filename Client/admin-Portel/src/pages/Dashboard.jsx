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
  Building2,
  UserCheck,
  Calendar,
  Layers,
  ChevronRight,
  Search,
  Plus,
  Folder,
  FileText,
  FileCode,
  FileArchive,
  Video,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  UserPlus,
  Briefcase,
  BadgeCheck,
  Mail,
  Phone,
  Lock,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
} from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const isHR = user?.role === "platform_employee";

  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("overview");

  // State for Create Platform Employee (HR) Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingEmp, setIsSubmittingEmp] = useState(false);
  const [formError, setFormError] = useState("");
  const [empForm, setEmpForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    employeeId: `HR-${Math.floor(1000 + Math.random() * 9000)}`,
    department: "Human Resources (HR)",
    designation: "HR Administrator",
  });

  const fetchDashboardData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      const res = await api.get("/admin/stats");
      if (res.data?.success) {
        setStats(res.data.stats);
        if (showToast) toast.success("Dashboard metrics updated!");
      }
    } catch (err) {
      console.warn("Using offline demo telemetry stats:", err.message);
      setStats({
        totalUsers: 1,
        activeUsers: 1,
        breakdown: {
          admin: 1,
          operator: 18,
          serviceProvider: 6,
          customer: 1420,
          platformEmployee: employees.length || 1,
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
        toast.success("Metrics refreshed with live system defaults.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/admin/employees");
      if (res.data?.success) {
        setEmployees(res.data.employees || []);
      }
    } catch (err) {
      console.warn("Could not load employees from API:", err.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
  };

  const handleCreateEmployeeSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!empForm.name.trim() || !empForm.email.trim() || !empForm.phone.trim() || !empForm.password.trim()) {
      setFormError("Please fill in all required fields (Name, Email, Phone, Password).");
      return;
    }

    if (empForm.password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmittingEmp(true);
    try {
      const res = await api.post("/admin/employees", empForm);
      if (res.data?.success) {
        toast.success(`HR Employee ${res.data.employee?.name || empForm.name} created!`, {
          icon: "🎉",
        });

        // Add to local list immediately
        if (res.data.employee) {
          setEmployees((prev) => [res.data.employee, ...prev]);
        }

        // Reset form
        setEmpForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          employeeId: `HR-${Math.floor(1000 + Math.random() * 9000)}`,
          department: "Human Resources (HR)",
          designation: "HR Administrator",
        });

        setIsCreateModalOpen(false);
        setActiveNav("employees");
        fetchEmployees();
        fetchDashboardData();
      } else {
        setFormError(res.data?.message || "Failed to create HR employee.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to create HR employee. Please try again.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsSubmittingEmp(false);
    }
  };

  // Folders row (inspired by Drivea UI screenshot)
  const folderCards = isHR
    ? [
        {
          id: "operators",
          name: "Driver & Crew Onboarding",
          count: "18 Active Drivers & Conductors",
          icon: Folder,
          tab: "operators",
        },
        {
          id: "providers",
          name: "Provider HR Audits",
          count: "6 Transit Operator Agencies",
          icon: Folder,
          tab: "providers",
        },
        {
          id: "compliance",
          name: "Staff Shift Rosters",
          count: "24 Dispatch Corridors",
          icon: Folder,
          tab: "compliance",
        },
        {
          id: "safety",
          name: "HR Certifications & Safety",
          count: "All Crew Licenses Verified",
          icon: Folder,
          tab: "safety",
        },
      ]
    : [
        {
          id: "routes",
          name: "Transit Routes & Lines",
          count: `${stats?.fleet?.activeRoutes ?? 12} Active Corridors`,
          icon: Folder,
          tab: "routes",
        },
        {
          id: "fleet",
          name: "Fleet Management",
          count: `${stats?.fleet?.totalBuses ?? 24} Connected Buses`,
          icon: Folder,
          tab: "fleet",
        },
        {
          id: "operators",
          name: "Drivers & Conductors",
          count: `${stats?.breakdown?.operator ?? 18} Field Staff`,
          icon: Folder,
          tab: "operators",
        },
        {
          id: "providers",
          name: "Service Providers",
          count: `${stats?.breakdown?.serviceProvider ?? 6} Registered Companies`,
          icon: Folder,
          tab: "providers",
        },
      ];

  // Files row (inspired by Drivea UI screenshot)
  const fileItems = isHR
    ? [
        {
          name: "Driver_License_Verification.pdf",
          size: "2.14 MB",
          date: "Mar 5, 2026",
          icon: FileText,
          color: "text-rose-600 bg-rose-50 border-rose-100",
        },
        {
          name: "HR_Staff_Shift_Schedule.xlsx",
          size: "44.14 KB",
          date: "Mar 4, 2026",
          icon: FileCode,
          color: "text-cyan-600 bg-cyan-50 border-cyan-100",
        },
        {
          name: "Crew_Background_Checks.zip",
          size: "18.69 MB",
          date: "Mar 2, 2026",
          icon: FileArchive,
          color: "text-amber-600 bg-amber-50 border-amber-100",
        },
        {
          name: "Safety_Briefing_Workshop.mp4",
          size: "52.20 MB",
          date: "Mar 1, 2026",
          icon: Video,
          color: "text-purple-600 bg-purple-50 border-purple-100",
        },
      ]
    : [
        {
          name: "Transit_Telemetry_Config.json",
          size: "44.14 KB",
          date: "Mar 5, 2026",
          icon: FileCode,
          color: "text-cyan-600 bg-cyan-50 border-cyan-100",
        },
        {
          name: "Safety_Inspection_Manifest.pdf",
          size: "3.05 MB",
          date: "Mar 4, 2026",
          icon: FileText,
          color: "text-rose-600 bg-rose-50 border-rose-100",
        },
        {
          name: "GPS_Daily_Route_Logs.zip",
          size: "14.69 MB",
          date: "Mar 2, 2026",
          icon: FileArchive,
          color: "text-amber-600 bg-amber-50 border-amber-100",
        },
        {
          name: "Terminal_Surveillance_Cam.mp4",
          size: "46.25 MB",
          date: "Mar 4, 2026",
          icon: Video,
          color: "text-purple-600 bg-purple-50 border-purple-100",
        },
      ];

  const filteredFolders = folderCards.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = fileItems.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.platformEmployeeDetails?.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased">
      {/* 1. Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm ring-1 ring-orange-700/10">
                <Bus className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    TrackMyBus
                  </span>
                  <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                    {isHR ? "PLATFORM HR" : "ADMIN"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  {isHR ? "Human Resources Portal" : "Cloud Fleet Storage"}
                </p>
              </div>
            </div>

            {/* Wide Search Bar (Matching Screenshot) */}
            <div className="flex-1 max-w-xl mx-2 sm:mx-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files, routes, HR employees, and folders..."
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl bg-slate-100/80 border border-slate-200/60 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>
            </div>

            {/* Right: Actions, Sort & Avatar */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Sort / Refresh Button */}
              <button
                type="button"
                onClick={() => {
                  fetchDashboardData(true);
                  fetchEmployees();
                }}
                disabled={refreshing}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                title="Refresh metrics and employees"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort</span>
                {refreshing && <RefreshCw className="w-3 h-3 animate-spin text-orange-600 ml-1" />}
              </button>

              {/* User Avatar Circle (Orange Circle from Screenshot) */}
              <div className="flex items-center gap-2 pl-2">
                <div
                  className="w-9 h-9 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-orange-500/20 select-none cursor-default"
                  title={`${user?.name || "User"} (${user?.role})`}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : isHR ? "H" : "A"}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.name || (isHR ? "HR Administrator" : "Admin User")}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight capitalize">
                    {isHR ? "Platform Employee (HR)" : "Super Administrator"}
                  </p>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Signature Orange Announcement Ribbon (Exact Drivea Style) */}
      <div className="w-full bg-orange-600 text-white text-center py-2.5 px-4 text-xs sm:text-sm font-medium tracking-wide shadow-2xs flex items-center justify-center gap-2">
        <span>This is a sample UI platform designed exclusively for testing and prototyping.</span>
      </div>

      {/* 3. Layout Body: Sidebar + Main Content */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Left Sidebar */}
        <aside className="w-full md:w-60 lg:w-64 shrink-0 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Prominent Action Button */}
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold py-3 px-4 rounded-xl shadow-sm shadow-orange-600/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Create HR Employee</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  toast.success("Ready to onboard operator / verify driver documents", {
                    icon: "🪪",
                  });
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold py-3 px-4 rounded-xl shadow-sm shadow-orange-600/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Onboard Operator</span>
              </button>
            )}

            {/* Sidebar Navigation */}
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveNav("overview")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeNav === "overview"
                    ? "bg-orange-50 text-orange-600 border border-orange-200/80 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Bus className="w-4 h-4" />
                <span>{isHR ? "HR Workspace" : "My Drive"}</span>
              </button>

              {/* ADMIN ONLY: Create & Manage Platform Employees (HR) */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setActiveNav("employees")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                    activeNav === "employees"
                      ? "bg-orange-50 text-orange-600 border border-orange-200/80 font-semibold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-4 h-4" />
                    <span>Platform HR</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700">
                    {employees.length}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveNav("operators")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "operators"
                    ? "bg-orange-50 text-orange-600 border border-orange-200/80 font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Operators & Crew</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav("providers")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "providers"
                    ? "bg-orange-50 text-orange-600 border border-orange-200/80 font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Providers & HR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav("routes")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "routes"
                    ? "bg-orange-50 text-orange-600 border border-orange-200/80 font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Route className="w-4 h-4" />
                <span>{isHR ? "Duty Corridors" : "Shared Files"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav("trash")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "trash"
                    ? "bg-orange-50 text-orange-600 border border-orange-200/80 font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Trash</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Storage Widget (Matching Screenshot Bottom Left) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>{isHR ? "HR Active Operations" : "Storage"}</span>
              <span className="text-orange-600 font-bold">{isHR ? "100%" : "39%"}</span>
            </div>
            {/* Orange Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-600 h-full rounded-full transition-all duration-500"
                style={{ width: isHR ? "100%" : "39%" }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {isHR
                ? "Department: Human Resources (HR)"
                : "404.06 MB of 1 GB used"}
            </p>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 space-y-7">
          {/* Top Breadcrumb Pill */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs">
              <Bus className="w-3.5 h-3.5 text-orange-600" />
              <span>
                {activeNav === "employees"
                  ? "Platform Employees (HR Management)"
                  : isHR
                  ? "HR Control Center"
                  : "My Drive"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{isHR ? "HR Operations Online" : "Live Operations Connected"}</span>
            </div>
          </div>

          {/* VIEW A: Platform HR Employees Directory & Management (When activeNav === "employees") */}
          {activeNav === "employees" && isAdmin ? (
            <div className="space-y-6">
              {/* Header card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                      <UserPlus className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Platform Employees (HR) Directory
                      </h2>
                      <p className="text-xs text-slate-500">
                        Manage platform HR employees authorized to log into this portal
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New HR</span>
                </button>
              </div>

              {/* Employees List / Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Registered HR Staff ({filteredEmployees.length})
                  </span>
                  <span className="text-xs text-slate-400">Can log in with their email & password</span>
                </div>

                {filteredEmployees.length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 mx-auto flex items-center justify-center">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No Platform HR Employees Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Click below to create the first Human Resources platform employee. They will be able to log in using the same portal login page.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Platform Employee</span>
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 overflow-x-auto">
                    {filteredEmployees.map((emp) => (
                      <div
                        key={emp._id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-sm ring-1 ring-orange-200 shrink-0">
                            {emp.name ? emp.name.charAt(0).toUpperCase() : "H"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{emp.name}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {emp.accountStatus || "active"}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {emp.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {emp.phone}
                              </span>
                              <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                ID: {emp.platformEmployeeDetails?.employeeId || "HR-EMP"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:text-right shrink-0">
                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {emp.platformEmployeeDetails?.designation || "HR Administrator"}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {emp.platformEmployeeDetails?.department || "Human Resources"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(emp.email);
                              toast.success(`Copied login email: ${emp.email}`);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Copy Email"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* VIEW B: Default Overview (Folders & Files) */}

              {/* Section 1: FOLDERS (Matching Screenshot) */}
              <section className="space-y-3">
                <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Folders
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {filteredFolders.map((folder) => {
                    const IconComponent = folder.icon;
                    return (
                      <div
                        key={folder.id}
                        onClick={() => {
                          setActiveNav(folder.tab);
                          toast(`Opened ${folder.name}`, { icon: "📂" });
                        }}
                        className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all flex items-center gap-4 cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform">
                          <IconComponent className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                            {folder.name}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">{folder.count}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section 2: FILES (Matching Screenshot) */}
              <section className="space-y-3">
                <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Files
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredFiles.map((file, idx) => {
                    const FileIcon = file.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => toast(`File ready: ${file.name}`, { icon: "📄" })}
                        className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center group-hover:scale-105 transition-transform ${file.color}`}
                          >
                            <FileIcon className="w-5 h-5 stroke-[2]" />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {file.size}
                          </span>
                        </div>

                        <div>
                          <h4
                            className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors"
                            title={file.name}
                          >
                            {file.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1">{file.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section 3: Live Transit Operations & Role Breakdown */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                {/* Roles Breakdown */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {isHR ? "HR Platform Stakeholders" : "Platform Roles & User Accounts"}
                        </h3>
                        <p className="text-xs text-slate-500">Live account distribution</p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                      {stats?.totalUsers ?? 1} Registered
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Platform HR Employees</span>
                        <UserPlus className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {employees.length || stats?.breakdown?.platformEmployee || 1}
                        </span>
                        <span className="text-[11px] font-medium text-orange-600">
                          HR Operations
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Operators (Crew)</span>
                        <Bus className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {stats?.breakdown?.operator ?? 18}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">Field Drivers</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Service Providers</span>
                        <Building2 className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {stats?.breakdown?.serviceProvider ?? 6}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">Agencies</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Customers / App Users</span>
                        <UserCheck className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {stats?.breakdown?.customer ?? 1420}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">Pass Holders</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active User Profile Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                        <Shield className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {isHR ? "Active HR Profile" : "Active Admin Profile"}
                      </h3>
                    </div>

                    <div className="mt-4 flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-orange-600/20 ring-4 ring-orange-50 mb-2">
                        {user?.name ? user.name.charAt(0).toUpperCase() : isHR ? "H" : "A"}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {user?.name || (isHR ? "HR Administrator" : "Administrator")}
                      </h4>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                      <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>
                          {isHR
                            ? "Platform Employee (HR)"
                            : "Super Admin Access"}
                        </span>
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phone</span>
                        <span className="font-medium text-slate-800">{user?.phone || "+1 800-555-0199"}</span>
                      </div>
                      {isHR && user?.platformEmployeeDetails?.employeeId && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Employee ID</span>
                          <span className="font-mono text-slate-800 font-semibold">
                            {user.platformEmployeeDetails.employeeId}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <span className="font-semibold text-emerald-600 capitalize">
                          {user?.accountStatus || "active"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Portal Access</span>
                        <span className="font-mono text-[11px] text-slate-500">Same Login Entry</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {/* 4. MODAL: Create Platform Employee (HR) (Admin Only) */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                  <UserPlus className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Create Platform Employee (HR)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provisions HR credentials for this Admin Portal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateEmployeeSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={empForm.name}
                    onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Login Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={empForm.email}
                    onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                    placeholder="e.g. hr.sarah@busservices.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={empForm.phone}
                    onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                    placeholder="+1 800-555-0144"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={empForm.employeeId}
                    onChange={(e) => setEmpForm({ ...empForm, employeeId: e.target.value })}
                    placeholder="HR-1002"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={empForm.department}
                    onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={empForm.designation}
                    onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
                    placeholder="HR Administrator / Recruiter"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Portal Password (Min 8 Characters) *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={empForm.password}
                    onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })}
                    placeholder="Create employee login password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingEmp}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingEmp ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating HR...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create Platform HR</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
