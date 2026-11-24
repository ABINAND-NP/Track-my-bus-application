import express from "express";
import {
  createStaffHR,
  getStaffHR,
  deleteStaffHR,
  createBusOperator,
  getBusOperators,
  deleteBusOperator,
} from "../controllers/providerController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Staff (HR) routes ───────────────────────────────────────────────────────
router.get(
  "/staff",
  verifyToken,
  authorizeRoles("service_provider", "provider_hr", "admin"),
  getStaffHR
);

router.post(
  "/staff",
  verifyToken,
  authorizeRoles("service_provider", "admin"),
  createStaffHR
);

router.delete(
  "/staff/:id",
  verifyToken,
  authorizeRoles("service_provider", "admin"),
  deleteStaffHR
);

// ── Operator (Driver / Conductor) routes ────────────────────────────────────
router.get(
  "/operators",
  verifyToken,
  authorizeRoles("service_provider", "provider_hr", "admin"),
  getBusOperators
);

router.post(
  "/operators",
  verifyToken,
  authorizeRoles("service_provider", "provider_hr", "admin"),
  createBusOperator
);

router.delete(
  "/operators/:id",
  verifyToken,
  authorizeRoles("service_provider", "provider_hr", "admin"),
  deleteBusOperator
);

export default router;
