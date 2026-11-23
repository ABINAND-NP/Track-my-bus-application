import express from "express";
import { adminLogin, getMe } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin login endpoint
router.post("/admin/login", adminLogin);
router.post("/login", adminLogin); // Also allow /login for convenience

// Protected self endpoint
router.get("/me", verifyToken, getMe);   

export default router;

