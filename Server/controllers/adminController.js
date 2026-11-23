import User from "../models/User.js";

/**
 * @desc    Get Admin Dashboard Stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
export const getDashboardStats = async (req, res) => { 
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "admin" });
    const operatorCount = await User.countDocuments({ role: "operator" });
    const serviceProviderCount = await User.countDocuments({ role: "service_provider" });
    const customerCount = await User.countDocuments({ role: "customer" });
    const employeeCount = await User.countDocuments({ role: "platform_employee" });
    const activeUsers = await User.countDocuments({ accountStatus: "active" });

    // Recent registered users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role accountStatus createdAt");

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        breakdown: {
          admin: adminCount,
          operator: operatorCount,
          serviceProvider: serviceProviderCount,
          customer: customerCount,
          platformEmployee: employeeCount,
        },
        fleet: {
          totalBuses: 24,
          activeRoutes: 12,
          activeTrips: 8,
          todayBookings: 142,
        },
        systemStatus: {
          server: "online",
          uptimeSeconds: Math.floor(process.uptime()),
          nodeVersion: process.version,
        },
      },
      recentUsers,
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics.",
    });
  }
};

