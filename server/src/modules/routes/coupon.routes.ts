import express from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/checkRole";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from "../controllers/coupon.controller";

const router = express.Router();

router.post("/", authenticate, requireRole(["admin"]), createCoupon);
router.get("/", authenticate, requireRole(["admin"]), getCoupons);
router.get("/:id", authenticate, requireRole(["admin"]), getCoupon);
router.put("/:id", authenticate, requireRole(["admin"]), updateCoupon);
router.delete("/:id", authenticate, requireRole(["admin"]), deleteCoupon);
router.post(
  "/apply",
  authenticate,
  requireRole(["admin", "user"]),
  applyCoupon
);

export default router;
