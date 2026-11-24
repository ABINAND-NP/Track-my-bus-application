import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * @desc    Get Admin Dashboard Stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin & Platform Employee)
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

/**
 * @desc    Create Platform Employee (HR)
 * @route   POST /api/admin/employees
 * @access  Private (Admin only)
 */
export const createPlatformEmployee = async (req, res) => {
  try {
    const { name, email, phone, password, employeeId, department, designation } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const emailNormalized = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email address already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const generatedEmpId = employeeId?.trim() || `HR-${Date.now().toString().slice(-4)}`;

    const newEmployee = new User({
      name: name.trim(),
      email: emailNormalized,
      phone: phone.trim(),
      password: hashedPassword,
      role: "platform_employee",
      accountStatus: "active",
      emailVerified: true,
      platformEmployeeDetails: {
        employeeId: generatedEmpId,
        department: department?.trim() || "Human Resources (HR)",
        designation: designation?.trim() || "HR Administrator",
      },
    });

    await newEmployee.save();

    return res.status(201).json({
      success: true,
      message: "Platform Employee (HR) created successfully.",
      employee: {
        _id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        phone: newEmployee.phone,
        role: newEmployee.role,
        accountStatus: newEmployee.accountStatus,
        platformEmployeeDetails: newEmployee.platformEmployeeDetails,
        createdAt: newEmployee.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create platform employee.",
    });
  }
};

/**
 * @desc    Get All Platform Employees
 * @route   GET /api/admin/employees
 * @access  Private (Admin & Platform Employee)
 */
export const getPlatformEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "platform_employee" })
      .sort({ createdAt: -1 })
      .select("name email phone role accountStatus platformEmployeeDetails createdAt lastLogin");

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("Get Employees Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch platform employees.",
    });
  }
};
