import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * @desc    Create Staff Member (HR) for Service Provider
 * @route   POST /api/provider/staff
 * @access  Private (Service Provider & Admin)
 */
export const createStaffHR = async (req, res) => {
  try {
    const { name, email, password, phone, employeeId, department, designation } = req.body;

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
    const existing = await User.findOne({ email: emailNormalized });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A user with this email address already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const generatedEmpId = employeeId?.trim() || `HR-${Date.now().toString().slice(-4)}`;

    const newStaff = new User({
      name: name.trim(),
      email: emailNormalized,
      phone: phone?.trim() || "",
      password: hashedPassword,
      role: "provider_hr",
      serviceProviderId: req.user._id,
      accountStatus: "active",
      emailVerified: true,
      platformEmployeeDetails: {
        employeeId: generatedEmpId,
        department: department?.trim() || "Fleet HR",
        designation: designation?.trim() || "HR Coordinator",
      },
    });

    await newStaff.save();

    return res.status(201).json({
      success: true,
      message: "Staff (HR) created successfully.",
      staff: {
        _id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        accountStatus: newStaff.accountStatus,
        platformEmployeeDetails: newStaff.platformEmployeeDetails,
        createdAt: newStaff.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Staff Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Staff HR.",
    });
  }
};

/**
 * @desc    Get All Staff (HR) for this Service Provider
 * @route   GET /api/provider/staff
 * @access  Private (Service Provider, Provider HR, Admin)
 */
export const getStaffHR = async (req, res) => {
  try {
    const query = { role: "provider_hr" };
    // If not global admin, filter by this provider
    if (req.user.role !== "admin") {
      query.serviceProviderId = req.user._id;
    }

    const staffList = await User.find(query)
      .sort({ createdAt: -1 })
      .select("name email phone role accountStatus platformEmployeeDetails createdAt");

    return res.status(200).json({
      success: true,
      count: staffList.length,
      staff: staffList,
    });
  } catch (error) {
    console.error("Get Staff Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch staff members.",
    });
  }
};

/**
 * @desc    Create Bus Operator (Driver / Conductor)
 * @route   POST /api/provider/operators
 * @access  Private (Service Provider, Provider HR, Admin)
 */
export const createBusOperator = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      operatorType,
      licenseNumber,
      licenseExpiryDate,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const validTypes = ["driver", "conductor"];
    const selectedType = operatorType?.toLowerCase().trim() || "driver";
    if (!validTypes.includes(selectedType)) {
      return res.status(400).json({
        success: false,
        message: "Operator type must be either 'driver' or 'conductor'.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const emailNormalized = email.toLowerCase().trim();
    const existing = await User.findOne({ email: emailNormalized });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A user with this email address already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOperator = new User({
      name: name.trim(),
      email: emailNormalized,
      phone: phone?.trim() || "",
      password: hashedPassword,
      role: "operator",
      serviceProviderId: req.user._id,
      accountStatus: "active",
      emailVerified: true,
      operatorDetails: {
        operatorType: selectedType,
        licenseNumber: licenseNumber?.trim() || `LIC-${Date.now().toString().slice(-6)}`,
        licenseExpiryDate: licenseExpiryDate ? new Date(licenseExpiryDate) : null,
      },
    });

    await newOperator.save();

    return res.status(201).json({
      success: true,
      message: `Bus Operator (${selectedType.toUpperCase()}) created successfully.`,
      operator: {
        _id: newOperator._id,
        name: newOperator.name,
        email: newOperator.email,
        phone: newOperator.phone,
        role: newOperator.role,
        accountStatus: newOperator.accountStatus,
        operatorDetails: newOperator.operatorDetails,
        createdAt: newOperator.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Operator Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Bus Operator.",
    });
  }
};

/**
 * @desc    Get All Bus Operators for this Service Provider
 * @route   GET /api/provider/operators
 * @access  Private (Service Provider, Provider HR, Admin)
 */
export const getBusOperators = async (req, res) => {
  try {
    const query = { role: "operator" };
    if (req.user.role !== "admin") {
      query.serviceProviderId = req.user._id;
    }

    const operators = await User.find(query)
      .sort({ createdAt: -1 })
      .select("name email phone role accountStatus operatorDetails createdAt");

    return res.status(200).json({
      success: true,
      count: operators.length,
      operators,
    });
  } catch (error) {
    console.error("Get Operators Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bus operators.",
    });
  }
};

/**
 * @desc    Delete a Staff (HR) member
 * @route   DELETE /api/provider/staff/:id
 * @access  Private (Service Provider, Admin)
 */
export const deleteStaffHR = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await User.findById(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    // Only allow deletion of provider_hr role
    if (staff.role !== "provider_hr") {
      return res.status(403).json({
        success: false,
        message: "This user is not a Staff (HR) member and cannot be deleted from this endpoint.",
      });
    }

    // Restrict: service_provider can only delete their own staff
    if (req.user.role === "service_provider" && staff.serviceProviderId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this staff member.",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Staff member "${staff.name}" has been permanently deleted.`,
      deletedId: id,
    });
  } catch (error) {
    console.error("Delete Staff Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete staff member.",
    });
  }
};

/**
 * @desc    Delete a Bus Operator (Driver / Conductor)
 * @route   DELETE /api/provider/operators/:id
 * @access  Private (Service Provider, Provider HR, Admin)
 */
export const deleteBusOperator = async (req, res) => {
  try {
    const { id } = req.params;

    const operator = await User.findById(id);
    if (!operator) {
      return res.status(404).json({
        success: false,
        message: "Bus operator not found.",
      });
    }

    // Only allow deletion of operator role
    if (operator.role !== "operator") {
      return res.status(403).json({
        success: false,
        message: "This user is not a bus operator and cannot be deleted from this endpoint.",
      });
    }

    // Restrict: service_provider / provider_hr can only delete their own operators
    if (
      (req.user.role === "service_provider" || req.user.role === "provider_hr") &&
      operator.serviceProviderId?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this operator.",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Bus Operator "${operator.name}" (${operator.operatorDetails?.operatorType || "operator"}) has been permanently deleted.`,
      deletedId: id,
    });
  } catch (error) {
    console.error("Delete Operator Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete bus operator.",
    });
  }
};

