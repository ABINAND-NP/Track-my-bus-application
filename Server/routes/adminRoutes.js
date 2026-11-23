import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected admin routes
router.use(verifyToken, authorizeRoles("admin"));

router.get("/stats", getDashboardStats);  

export default router;

