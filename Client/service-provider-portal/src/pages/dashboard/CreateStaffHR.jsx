import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserCheck,
  UserPlus,
  Mail,
  Lock,
  Phone,
  Search,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  Trash2,
  ShieldAlert
} from "lucide-react";
import { createStaffApi, getStaffApi, deleteStaffApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import toast from "react-hot-toast";

const DEFAULT_STAFF = [
  {
    _id: "staff-1",
    name: "Aarav Sharma",
    email: "aarav.hr@metroexpress.com",
    phone: "+91 98450 11223",
    role: "provider_hr",
    accountStatus: "active",
    platformEmployeeDetails: {
      employeeId: "HR-101",
      department: "Human Resources",
      designation: "Senior HR Manager",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "staff-2",
    name: "Meera Krishnan",
    email: "meera.hr@metroexpress.com",
    phone: "+91 97410 44556",
    role: "provider_hr",
    accountStatus: "active",
    platformEmployeeDetails: {
      employeeId: "HR-102",
      department: "Crew & Rostering",
      designation: "Staff Coordinator",
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export default function CreateStaffHR() {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState(DEFAULT_STAFF);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isOperator = user?.role === "operator";
  const isServiceProvider = user?.role === "service_provider" || user?.role === "admin";
  const isHR = user?.role === "provider_hr";

  // ── Delete state ────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null); // { _id, name }
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    employeeId: "",
    department: "Human Resources",
    designation: "HR Manager",
  });

  // Fetch staff list from backend
  const fetchStaff = async () => {
    setIsLoadingList(true);
    try {
      const res = await getStaffApi();
      if (res.data?.success && res.data.staff?.length > 0) {
        setStaffList(res.data.staff);
      }
    } catch (err) {
      console.log("Using cached/fallback staff list.");
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error("Please fill required fields (Name, Email, Password).");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createStaffApi({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        employeeId: formData.employeeId.trim() || `HR-${Date.now().toString().slice(-4)}`,
        department: formData.department,
        designation: formData.designation,
      });

      if (res.data?.success) {
        toast.success(`Staff (HR) "${formData.name}" created successfully!`);
        if (res.data.staff) {
          setStaffList((prev) => [res.data.staff, ...prev]);
        }
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          employeeId: "",
          department: "Human Resources",
          designation: "HR Manager",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create Staff HR. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete Handlers ─────────────────────────────────────────────────────
  const openDeleteConfirm = (staff) => {
    setDeleteTarget(staff);
  };

  const closeDeleteConfirm = () => {
    if (!isDeleting) setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      // Try backend delete; fall back to local removal if offline
      try {
        await deleteStaffApi(deleteTarget._id);
      } catch (apiErr) {
        // If the ID is a local fallback id (e.g. "staff-1"), skip API error
        const isLocal = deleteTarget._id.startsWith("staff-");
        if (!isLocal) {
          throw apiErr;
        }
      }
      setStaffList((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success(`Staff member "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete staff member.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredStaff = staffList.filter((s) => {
    const query = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.platformEmployeeDetails?.employeeId?.toLowerCase().includes(query) ||
      s.platformEmployeeDetails?.department?.toLowerCase().includes(query)
    );
  });

  if (isOperator) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-lg mx-auto mt-12">
        <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Staff Management Restricted</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Staff HR administration is reserved for Service Providers and HR Administrators. As a registered bus operator, please access your assigned routes and shift telemetry from your dashboard.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all"
        >
          Return to My Duty & Route
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Human Resources Portal
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isHR ? "Staff (HR) Directory" : "Create Staff (HR)"}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              {isHR
                ? "Active personnel coordinators and managers administering crew rosters, depot onboarding, and service provider compliance."
                : "Add HR managers and personnel coordinators to administer driver shifts, depot onboarding, and service provider compliance."}
            </p>
          </div>

          <button
            onClick={fetchStaff}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingList ? "animate-spin" : ""}`} />
            <span>Refresh List</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left: Create Form (Only for Service Provider) ── */}
        {isServiceProvider && (
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Staff (HR) Registration</h3>
                  <p className="text-xs text-slate-400">Enter new coordinator details</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Work Email <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="aarav.hr@company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Account Password <span className="text-emerald-400">*</span>
                    <span className="text-[10px] text-slate-500 ml-1 font-normal">(min. 8 chars)</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      placeholder="Set temporary password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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

                {/* Phone & Employee ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      placeholder="HR-105"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Department & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Human Resources">Human Resources</option>
                      <option value="Crew & Rostering">Crew & Rostering</option>
                      <option value="Fleet Administration">Fleet Administration</option>
                      <option value="Safety & Compliance">Safety & Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Designation
                    </label>
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="HR Manager">HR Manager</option>
                      <option value="Staff Coordinator">Staff Coordinator</option>
                      <option value="Crew Dispatcher">Crew Dispatcher</option>
                      <option value="HR Lead">HR Lead</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Creating Staff Profile...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Staff (HR) Member</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Right: Roster Table ── */}
        <div className={isServiceProvider ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            {/* Table toolbar */}
            <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Active Staff (HR) Roster
                </h3>
                <p className="text-xs text-slate-400">
                  {filteredStaff.length} coordinator{filteredStaff.length !== 1 ? "s" : ""} registered
                </p>
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 uppercase font-semibold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Staff Name & ID</th>
                    <th className="px-5 py-3.5">Contact</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <tr
                        key={staff._id}
                        className="hover:bg-slate-850/60 transition-colors group"
                      >
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase">
                              {staff.name[0]}
                            </div>
                            <div>
                              <span className="font-bold text-white block">{staff.name}</span>
                              <span className="text-[11px] text-emerald-400 font-mono">
                                {staff.platformEmployeeDetails?.employeeId || "HR-NODE"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-slate-200 block">{staff.email}</span>
                          <span className="text-[11px] text-slate-400 block">
                            {staff.phone || "N/A"}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-medium text-slate-200 block">
                            {staff.platformEmployeeDetails?.designation || "Staff Coordinator"}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {staff.platformEmployeeDetails?.department || "Human Resources"}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        </td>

                        {/* ── Delete Button ── */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => openDeleteConfirm(staff)}
                            title={`Delete ${staff.name}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-rose-400 hover:text-white bg-rose-500/0 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-all group-hover:opacity-100 opacity-60"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-slate-500">
                        No Staff (HR) found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmation Delete Modal ─────────────────────────────────── */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={closeDeleteConfirm}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Delete Staff (HR) Member"
        itemName={deleteTarget?.name || ""}
        itemRole="Staff (HR) member"
      />
    </div>
  );
}
