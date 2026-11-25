import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Calendar,
  Search,
  CheckCircle2,
  Bus,
  Ticket,
  RefreshCw,
  Sparkles,
  Eye,
  EyeOff,
  Trash2,
  ShieldAlert
} from "lucide-react";
import { createOperatorApi, getOperatorsApi, deleteOperatorApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import toast from "react-hot-toast"; 

const DEFAULT_OPERATORS = [
  {
    _id: "op-1",
    name: "Rajesh Kumar",
    email: "rajesh.driver@metroexpress.com",
    phone: "+91 99001 23456",
    role: "operator",
    accountStatus: "active",
    operatorDetails: {
      operatorType: "driver",
      licenseNumber: "KA-01-DL-2018091",
      licenseExpiryDate: "2029-08-15",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "op-2",
    name: "Suresh Gowda",
    email: "suresh.cond@metroexpress.com",
    phone: "+91 99002 88776",
    role: "operator",
    accountStatus: "active",
    operatorDetails: {
      operatorType: "conductor",
      licenseNumber: "COND-KA-9912",
      licenseExpiryDate: "2031-12-31",
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "op-3",
    name: "Venkatesh Rao",
    email: "venkatesh.driver@metroexpress.com",
    phone: "+91 98860 33441",
    role: "operator",
    accountStatus: "active",
    operatorDetails: {
      operatorType: "driver",
      licenseNumber: "KA-04-DL-2020144",
      licenseExpiryDate: "2030-05-20",
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export default function CreateBusOperator() {
  const { user } = useAuth();
  const isOperator = user?.role === "operator";

  const [operatorList, setOperatorList] = useState(DEFAULT_OPERATORS);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showPassword, setShowPassword] = useState(false);

  // ── Delete state ────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null); // { _id, name, operatorDetails }
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    operatorType: "driver",
    licenseNumber: "",
    licenseExpiryDate: "",
  });

  // Fetch operators from backend
  const fetchOperators = async () => {
    setIsLoadingList(true);
    try {
      const res = await getOperatorsApi();
      if (res.data?.success && res.data.operators?.length > 0) {
        setOperatorList(res.data.operators);
      }
    } catch (err) {
      console.log("Using cached/fallback operator list.");
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchOperators();
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
      const res = await createOperatorApi({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        operatorType: formData.operatorType,
        licenseNumber: formData.licenseNumber.trim() || `LIC-${Date.now().toString().slice(-6)}`,
        licenseExpiryDate: formData.licenseExpiryDate || null,
      });

      if (res.data?.success) {
        toast.success(
          `Bus Operator (${formData.operatorType.toUpperCase()}) ${formData.name} created successfully!`
        );
        if (res.data.operator) {
          setOperatorList((prev) => [res.data.operator, ...prev]);
        }
        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          operatorType: "driver",
          licenseNumber: "",
          licenseExpiryDate: "",
        });
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create Bus Operator. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete Handlers ─────────────────────────────────────────────────────
  const openDeleteConfirm = (op) => {
    setDeleteTarget(op);
  };

  const closeDeleteConfirm = () => {
    if (!isDeleting) setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      try {
        await deleteOperatorApi(deleteTarget._id);
      } catch (apiErr) {
        // If the ID is a local fallback id (e.g. "op-1"), skip API error
        const isLocal = deleteTarget._id.startsWith("op-");
        if (!isLocal) throw apiErr;
      }
      setOperatorList((prev) => prev.filter((op) => op._id !== deleteTarget._id));
      toast.success(
        `Bus Operator "${deleteTarget.name}" (${deleteTarget.operatorDetails?.operatorType?.toUpperCase() || "OPERATOR"
        }) deleted successfully.`
      );
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete bus operator.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOperators = operatorList.filter((op) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      op.name.toLowerCase().includes(query) ||
      op.email.toLowerCase().includes(query) ||
      op.operatorDetails?.licenseNumber?.toLowerCase().includes(query);

    const matchesType =
      typeFilter === "ALL" || op.operatorDetails?.operatorType === typeFilter;

    return matchesSearch && matchesType;
  });

  if (isOperator) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-lg mx-auto mt-12">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
          <Bus className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Operator Enrollment Restricted</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Enrolling drivers and conductors is reserved for Service Providers and Staff (HR). As a registered operator, your credentials and active shift details are available from your dashboard.
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-semibold text-cyan-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Fleet Crew Management
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Bus Operator (Driver & Conductor)
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Enroll heavy passenger drivers and transit conductors into your live dispatch system. Assign credentials for in-bus mobile telematics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOperators}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingList ? "animate-spin" : ""}`} />
              <span>Refresh Operators</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Create Operator */}
        <div className="lg:col-span-5">
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Operator Enrollment</h3>
                <p className="text-xs text-slate-400">Add driver or conductor credential</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Operator Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Operator Role <span className="text-cyan-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, operatorType: "driver" }))}
                    className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${formData.operatorType === "driver"
                        ? "bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                  >
                    <span>Driver</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, operatorType: "conductor" }))}
                    className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${formData.operatorType === "conductor"
                        ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/20"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Conductor</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={
                    formData.operatorType === "driver"
                      ? "e.g. Rajesh Kumar (Driver)"
                      : "e.g. Suresh Gowda (Conductor)"
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Operator Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Operator Login Email <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="operator@metroexpress.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password <span className="text-cyan-400">*</span>
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
                    placeholder="Set operator portal password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
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

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Contact Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 99000 11223"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* License Number & Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {formData.operatorType === "driver" ? "Driving License No." : "Conductor Badge No."}
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder={
                        formData.operatorType === "driver" ? "KA-01-DL-2022" : "COND-KA-4410"
                      }
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    License Expiry Date
                  </label>
                  <input
                    type="date"
                    name="licenseExpiryDate"
                    value={formData.licenseExpiryDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Registering Operator...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>
                      Enroll {formData.operatorType === "driver" ? "Driver" : "Conductor"}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Section: Operators Roster Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Active Bus Operators Roster
                </h3>
                <p className="text-xs text-slate-400">
                  {filteredOperators.length} drivers & conductors registered
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, license..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Roles</option>
                  <option value="driver">Drivers Only</option>
                  <option value="conductor">Conductors Only</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 uppercase font-semibold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Operator Name</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">License / Badge</th>
                    <th className="px-5 py-3.5">Contact</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredOperators.length > 0 ? (
                    filteredOperators.map((op) => {
                      const isDriver = op.operatorDetails?.operatorType === "driver";
                      return (
                        <tr key={op._id} className="hover:bg-slate-850/60 transition-colors group">
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${isDriver
                                    ? "bg-cyan-500/15 text-cyan-400"
                                    : "bg-amber-500/15 text-amber-400"
                                  }`}
                              >
                                {op.name[0]}
                              </div>
                              <div>
                                <span className="font-bold text-white block">{op.name}</span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {op.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            {isDriver ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                <span>Driver</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                <Ticket className="w-3 h-3" />
                                <span>Conductor</span>
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="font-mono text-slate-200 block">
                              {op.operatorDetails?.licenseNumber || "N/A"}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              Exp:{" "}
                              {op.operatorDetails?.licenseExpiryDate
                                ? new Date(op.operatorDetails.licenseExpiryDate).toLocaleDateString()
                                : "Perpetual"}
                            </span>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-slate-300 block">{op.phone || "N/A"}</span>
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
                              onClick={() => openDeleteConfirm(op)}
                              title={`Delete ${op.name}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-rose-400 hover:text-white bg-rose-500/0 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-all group-hover:opacity-100 opacity-60"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-slate-500">
                        No operators found matching your criteria.
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
        title={`Delete Bus Operator (${deleteTarget?.operatorDetails?.operatorType === "conductor" ? "Conductor" : "Driver"
          })`}
        itemName={deleteTarget?.name || ""}
        itemRole={deleteTarget?.operatorDetails?.operatorType === "conductor" ? "Conductor" : "Driver"}
      />
    </div>
  );
}

