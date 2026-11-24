import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "123456", {
    expiresIn: "7d",
  });
};

/**
 * @desc    Admin Login
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    // Find user by email including password field
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Verify role is admin or platform_employee
    const allowedRoles = ["admin", "platform_employee"];
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators and platform employees (HR) are authorized to log into this portal.",
      });
    }

    // Check account status
    if (user.accountStatus !== "active") {
      return res.status(403).json({
        success: false,
        message: `Account is currently ${user.accountStatus}. Please contact platform administrators.`,
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    user.failedLoginAttempts = 0;
    await user.save({ validateBeforeSave: false });

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Return response without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      accountStatus: user.accountStatus,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      platformEmployeeDetails: user.platformEmployeeDetails,
    };

    return res.status(200).json({
      success: true,
      message: `${user.role === "admin" ? "Admin" : "Platform HR"} authentication successful`,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during login.",
    });
  }
};

/**
 * @desc    Get Current User Profile
 * @route   GET /api/auth/me
 * @access  Private (Authenticated)
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile.",
    });
  }
};

/**
 * @desc    Service Provider / Operator Register
 * @route   POST /api/auth/provider/register
 * @access  Public
 */
export const providerRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const emailNormalized = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists. Please log in.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with service_provider role and active status
    const newUser = new User({
      name: name.trim(),
      email: emailNormalized,
      phone: phone ? phone.trim() : "",
      password: hashedPassword,
      role: "service_provider",
      accountStatus: "active",
      emailVerified: true,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.role);

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      profileImage: newUser.profileImage,
      accountStatus: newUser.accountStatus,
      emailVerified: newUser.emailVerified,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      success: true,
      message: "Service Provider account created successfully.",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Provider Register Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create account. Please try again.",
    });
  }
};

/**
 * @desc    Service Provider / Operator Login
 * @route   POST /api/auth/provider/login
 * @access  Public
 */
export const providerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Allowed roles: service_provider, operator, provider_hr, admin
    const allowedRoles = ["service_provider", "operator", "provider_hr", "admin"];
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only service providers and fleet operators are authorized for TrackMyBus Edge.",
      });
    }

    if (user.accountStatus !== "active") {
      return res.status(403).json({
        success: false,
        message: `Account is currently ${user.accountStatus}. Please contact support.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    user.lastLogin = new Date();
    user.failedLoginAttempts = 0;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      accountStatus: user.accountStatus,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      operatorDetails: user.operatorDetails,
      platformEmployeeDetails: user.platformEmployeeDetails,
      serviceProviderId: user.serviceProviderId,
    };

    const roleName =
      user.role === "provider_hr"
        ? "Staff (HR)"
        : user.role === "operator"
        ? user.operatorDetails?.operatorType === "conductor"
          ? "Conductor"
          : "Driver"
        : "Service Provider";

    return res.status(200).json({
      success: true,
      message: `${roleName} authentication successful.`,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Provider Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during login.",
    });
  }
};
