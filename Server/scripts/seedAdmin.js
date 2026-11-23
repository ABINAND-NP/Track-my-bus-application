import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bus_services_db";

const DEFAULT_ADMIN = {
  name: process.env.ADMIN_NAME || "System Administrator",
  email: (process.env.ADMIN_EMAIL || "admin@busservices.com").toLowerCase().trim(),
  phone: process.env.ADMIN_PHONE || "+1 800-555-0199",
  password: process.env.ADMIN_PASSWORD || "Admin@123456",
  role: "admin",
  accountStatus: "active",
  emailVerified: true,
};

export const seedAdmin = async () => {
  try {
    console.log(" Connecting to MongoDB at:", MONGO_URI.replace(/:([^@]+)@/, ":****@"));
    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB Connected Successfully.");

    // Check if an admin already exists with this email
    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, salt);

    if (existingAdmin) {
      console.log(` Admin user already exists with email: ${DEFAULT_ADMIN.email}`);
      console.log(" Updating admin details & ensuring password and active status...");

      existingAdmin.name = DEFAULT_ADMIN.name;
      existingAdmin.phone = DEFAULT_ADMIN.phone;
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      existingAdmin.accountStatus = "active";
      existingAdmin.emailVerified = true;
      existingAdmin.failedLoginAttempts = 0;
      existingAdmin.lockUntil = null;

      await existingAdmin.save();
      console.log(" Admin account updated successfully!");
    } else {
      console.log(" No admin user found with this email. Creating new admin user...");

      const newAdmin = new User({
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        phone: DEFAULT_ADMIN.phone,
        password: hashedPassword,
        role: "admin",
        accountStatus: "active",
        emailVerified: true,
      });

      await newAdmin.save();
      console.log(" Default Admin user created successfully!");
    }

    console.log("\n========================================");
    console.log(" ADMIN SEED CREDENTIALS:");
    console.log(`   Email:    ${DEFAULT_ADMIN.email}`);
    console.log(`   Password: ${DEFAULT_ADMIN.password}`);
    console.log(`   Role:     ${DEFAULT_ADMIN.role}`);
    console.log(`   Status:   ${DEFAULT_ADMIN.accountStatus}`);
    console.log("========================================\n");

    return true;
  } catch (error) {
    console.error(" Error seeding admin user:", error);
    throw error;
  }
};

// If run directly via node scripts/seedAdmin.js
if (process.argv[1] && process.argv[1].endsWith("seedAdmin.js")) {
  seedAdmin()
    .then(() => {
      console.log(" Seeding completed successfully. Exiting...");
      mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error(" Seeding failed:", err.message);
      mongoose.disconnect();
      process.exit(1);
    });
}

