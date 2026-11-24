import mongoose from "mongoose";

// Subdocument Schema for Platform Employee Specific Details
const platformEmployeeDetailsSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            trim: true,
            default: null,
        },
        department: {
            type: String,
            trim: true,
            default: null,
        },
        designation: {
            type: String,
            trim: true,
            default: null,
        },
    },
    { _id: false }
);

// Subdocument Schema for Operator (Driver / Conductor) Specific Details
const operatorDetailsSchema = new mongoose.Schema(
    {
        operatorType: {
            type: String,
            enum: {
                values: ["driver", "conductor"],
                message: "{VALUE} is not a valid operator type",
            },
            required: function () {
                return this.role === "operator";
            },
        },
        licenseNumber: {
            type: String,
            trim: true,
            default: null,
        },
        licenseExpiryDate: {
            type: Date,
            default: null,
        },
    },
    { _id: false }
);

// Primary User Schema
const userSchema = new mongoose.Schema(
    {
        // --- Basic Information ---
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email address",
            ],
        },
        phone: {
            type: String,
            required: false,
            default: "",
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
            select: false,
        },
        role: {
            type: String,
            required: [true, "User role is required"],
            enum: {
                values: [
                    "admin",
                    "platform_employee",
                    "service_provider",
                    "provider_hr",
                    "operator",
                    "customer",
                ],
                message: "{VALUE} is not a valid role",
            },
        },
        profileImage: {
            type: String,
            trim: true,
            default: null,
        },

        // --- Account Status ---
        accountStatus: {
            type: String,
            enum: {
                values: ["active", "pending", "suspended", "rejected", "deactivated"],
                message: "{VALUE} is not a valid account status",
            },
            default: "pending",
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
            default: null,
        },

        // --- Service Provider Association ---
        serviceProviderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ServiceProvider",
            default: null,
            index: true,
        },

        // --- Subdocuments ---
        platformEmployeeDetails: {
            type: platformEmployeeDetailsSchema,
            default: null,
        },
        operatorDetails: {
            type: operatorDetailsSchema,
            default: null,
        },

        // --- Security and Login Metadata ---
        passwordChangedAt: {
            type: Date,
            default: null,
        },
        failedLoginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        strict: true,
    }
);

// Avoid recompilation error during hot reloads with Nodemon
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

