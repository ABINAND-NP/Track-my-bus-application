import express from "express";
import {
  getDashboardStats,
  createPlatformEmployee,
  getPlatformEmployees,
} from "../controllers/adminController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Stats: accessible by admin and platform_employee
router.get("/stats", verifyToken, authorizeRoles("admin", "platform_employee"), getDashboardStats);

// Employees: GET accessible by admin and platform_employee
router.get("/employees", verifyToken, authorizeRoles("admin", "platform_employee"), getPlatformEmployees);

// Employees: POST (Create HR) restricted to admin only
router.post("/employees", verifyToken, authorizeRoles("admin"), createPlatformEmployee);

export default router;
