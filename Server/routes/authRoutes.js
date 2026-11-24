import express from "express";
import {
  adminLogin,
  providerLogin,
  providerRegister,
  getMe,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Operator / Service Provider authentication
router.post("/provider/register", providerRegister);
router.post("/register", providerRegister);
router.post("/provider/login", providerLogin);
router.post("/operator/login", providerLogin);

// Admin login endpoint
router.post("/admin/login", adminLogin);
router.post("/login", (req, res, next) => {
  // If role is admin, use adminLogin, otherwise use providerLogin
  const { role } = req.body;
  if (role === "admin" || role === "platform_employee") {
    return adminLogin(req, res, next);
  }
  return providerLogin(req, res, next);
});

// Protected self endpoint
router.get("/me", verifyToken, getMe);

export default router;
