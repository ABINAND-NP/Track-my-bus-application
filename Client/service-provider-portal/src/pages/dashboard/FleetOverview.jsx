import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bus,
  Plus,
  Radio,
  Search,
  Users,
  MapPin,
  Clock,
  ShieldCheck,
  RefreshCw,
  X,
  UserCheck,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const INITIAL_FLEET = [
  {
    id: "TB-101",
    busNumber: "KA-01-F-4021",
    route: "Route 102: Central Metro ➔ Electronic City",
    driver: "Rajesh Kumar",
    conductor: "Suresh Gowda",
    status: "ON_ROUTE",
    speed: "48 km/h",
    currentStop: "Silk Board Junc.",
    nextStop: "Hosa Road",
    capacity: "42 / 50",
    eta: "6 mins",
  },
  {
    id: "TB-104",
    busNumber: "KA-01-F-5512",
    route: "Route 204: Kempegowda Bus Station ➔ Whitefield",
    driver: "Venkatesh Rao",
    conductor: "Manoj P.",
    status: "BOARDING",
    speed: "0 km/h",
    currentStop: "Majestic Platform 8",
    nextStop: "Corporation",
    capacity: "28 / 50",
    eta: "Departs 5m",
  },
  {
    id: "TB-109",
    busNumber: "KA-04-E-9014",
    route: "Route 335: Banashankari ➔ ITPL Express",
    driver: "Anil Deshmukh",
    conductor: "Praveen K.",
    status: "ON_ROUTE",
    speed: "52 km/h",
    currentStop: "Marathahalli Bridge",
    nextStop: "Kundalahalli",
    capacity: "48 / 50",
    eta: "2 mins",
  },
  {
    id: "TB-212",
    busNumber: "KA-05-AA-1120",
    route: "Airport Vayu Vajra: Indiranagar ➔ KIA Terminal 2",
    driver: "Mohammed Farooq",
    conductor: "Automated Ticket Sync",
    status: "SCHEDULED",
    speed: "0 km/h",
    currentStop: "Indiranagar Depot",
    nextStop: "Hebbal Flyover",
    capacity: "0 / 45",
    eta: "Departs 15:00",
  },
  {
    id: "TB-218",
    busNumber: "KA-01-F-7788",
    route: "Route 500D: Hebbal ➔ Silkboard Outer Ring",
    driver: "Sunil Verma",
    conductor: "Dinesh K.",
    status: "MAINTENANCE",
    speed: "0 km/h",
    currentStop: "Central Workshop",
    nextStop: "Inspection Bay 3",
    capacity: "--",
    eta: "Available 18:00",
  },
];

export default function FleetOverview() {
  const { user } = useAuth();
  const [fleet, setFleet] = useState(INITIAL_FLEET);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddBusModalOpen, setIsAddBusModalOpen] = useState(false);
  const [newBus, setNewBus] = useState({
    id: "",
    busNumber: "",
    route: "",
    driver: "",
  });

  const handleAddBus = (e) => {
    e.preventDefault();
    if (!newBus.id || !newBus.busNumber || !newBus.route) {
      toast.error("Please fill required bus details.");
      return;
    }

    const created = {
      id: newBus.id.toUpperCase(),
      busNumber: newBus.busNumber.toUpperCase(),
      route: newBus.route,
      driver: newBus.driver || "Unassigned",
      conductor: "Assigned upon dispatch",
      status: "SCHEDULED",
      speed: "0 km/h",
      currentStop: "Fleet Depot",
      nextStop: "First Route Stop",
      capacity: "0 / 50",
      eta: "Scheduled",
    };

    setFleet([created, ...fleet]);
    setNewBus({ id: "", busNumber: "", route: "", driver: "" });
    setIsAddBusModalOpen(false);
    toast.success(`Bus ${created.id} registered to fleet successfully!`);
  };

  const filteredFleet = fleet.filter((bus) => {
    const matchesSearch =
      bus.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.driver.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || bus.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "ON_ROUTE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            On Route
          </span>
        );
      case "BOARDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Boarding
          </span>
        );
      case "SCHEDULED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Scheduled
          </span>
        );
      case "MAINTENANCE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Maintenance
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const isServiceProvider = user?.role === "service_provider" || user?.role === "admin";
  const isHR = user?.role === "provider_hr";
  const isOperator = user?.role === "operator";
  const isDriver = isOperator && user?.operatorDetails?.operatorType !== "conductor";
  const isConductor = isOperator && user?.operatorDetails?.operatorType === "conductor";

  const getRoleBadgeInfo = () => {
    if (isHR) {
      return {
        label: `Staff HR Coordinator • ${user?.platformEmployeeDetails?.employeeId || "HR-NODE"}`,
        style: "bg-teal-500/15 border-teal-500/30 text-teal-400",
      };
    }
    if (isDriver) {
      return {
        label: `Active Fleet Driver • ${user?.operatorDetails?.licenseNumber || "Licensed"}`,
        style: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
      };
    }
    if (isConductor) {
      return {
        label: `Active Fleet Conductor • ${user?.operatorDetails?.licenseNumber || "Badge Verified"}`,
        style: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      };
    }
    return {
      label: "Verified Fleet Service Provider",
      style: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    };
  };

  const roleBadge = getRoleBadgeInfo();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold mb-3 ${roleBadge.style}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {roleBadge.label}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isOperator ? "My Duty & Route Dispatch" : "Fleet Overview & Live Dispatch"}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              {isOperator ? (
                <>
                  Welcome back, <span className="font-semibold text-cyan-400">{user?.name}</span>.
                  Your vehicle telemetry is linked with active passenger terminals and live GPS nodes.
                </>
              ) : isHR ? (
                <>
                  Welcome, <span className="font-semibold text-teal-400">{user?.name}</span>.
                  Monitor depot operations, coordinate active crew rosters, and oversee staff scheduling.
                </>
              ) : (
                <>
                  Welcome back, <span className="font-semibold text-emerald-400">{user?.name || "Partner"}</span>.
                  Monitor active routes, assign crews, and track GPS speed in real-time.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(isServiceProvider || isHR) && (
              <Link
                to="/dashboard/create-staff"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 hover:border-emerald-500/40 transition-all"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Staff (HR)</span>
              </Link>
            )}

            {(isServiceProvider || isHR) && (
              <Link
                to="/dashboard/create-operator"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 hover:border-cyan-500/40 transition-all"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Bus Operators</span>
              </Link>
            )}

            {isServiceProvider && (
              <button
                onClick={() => setIsAddBusModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Register Bus</span>
              </button>
            )}

            {isOperator && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Shift Status: Active on Route</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Fleet
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{fleet.length}</span>
            <span className="text-xs font-semibold text-emerald-400">+2 this month</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Operational buses in your company</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active On Route
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {fleet.filter((b) => b.status === "ON_ROUTE" || b.status === "BOARDING").length}
            </span>
            <span className="text-xs font-semibold text-cyan-400">Running Live</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Buses transmitting GPS coordinates</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              On-Time Punctuality
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">98.4%</span>
            <span className="text-xs font-semibold text-emerald-400">Top Tier</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Adherence to scheduled stops</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Passengers Today
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">2,480</span>
            <span className="text-xs font-semibold text-teal-400">+14% vs avg</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Estimated ticketing volume</p>
        </div>
      </div>

      {/* Fleet Control Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Live Fleet Roster & Dispatch
            </h3>
            <p className="text-xs text-slate-400">
              Real-time overview of active trips, drivers, and GPS speeds
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search bus, route, driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Status</option>
              <option value="ON_ROUTE">On Route</option>
              <option value="BOARDING">Boarding</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase font-semibold text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Vehicle / ID</th>
                <th className="px-5 py-3.5">Assigned Route</th>
                <th className="px-5 py-3.5">Crew (Driver / Conductor)</th>
                <th className="px-5 py-3.5">Live Status</th>
                <th className="px-5 py-3.5">Current Location / Speed</th>
                <th className="px-5 py-3.5">Capacity</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredFleet.length > 0 ? (
                filteredFleet.map((bus) => (
                  <tr key={bus.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                          <Bus className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block">{bus.id}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {bus.busNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-medium text-slate-200 block max-w-xs truncate">
                        {bus.route}
                      </span>
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        Next: {bus.nextStop}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-white font-medium block">{bus.driver}</span>
                      <span className="text-[11px] text-slate-400 block">{bus.conductor}</span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(bus.status)}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-slate-300 block">{bus.currentStop}</span>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        {bus.speed}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-mono text-slate-200">{bus.capacity}</span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => toast.success(`Pinging telemetry for ${bus.id}... 18ms latency.`)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all"
                      >
                        Ping GPS
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    No vehicles matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bus Modal */}
      {isAddBusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsAddBusModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 z-10">
            <button
              onClick={() => setIsAddBusModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Register New Vehicle</h3>
            <p className="text-xs text-slate-400 mb-5">
              Add a bus to your TrackMyBus Edge operational roster
            </p>

            <form onSubmit={handleAddBus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Fleet Call Sign (e.g. TB-220)
                </label>
                <input
                  type="text"
                  required
                  placeholder="TB-220"
                  value={newBus.id}
                  onChange={(e) => setNewBus({ ...newBus, id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Vehicle Registration Plate
                </label>
                <input
                  type="text"
                  required
                  placeholder="KA-01-AB-1234"
                  value={newBus.busNumber}
                  onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Assigned Route
                </label>
                <input
                  type="text"
                  required
                  placeholder="Route 45: Station A ➔ Station B"
                  value={newBus.route}
                  onChange={(e) => setNewBus({ ...newBus, route: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Assigned Driver
                </label>
                <input
                  type="text"
                  placeholder="Driver Name"
                  value={newBus.driver}
                  onChange={(e) => setNewBus({ ...newBus, driver: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-lg shadow-emerald-500/20"
              >
                Register & Initialize GPS
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

