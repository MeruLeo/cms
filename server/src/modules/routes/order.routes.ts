import express from "express";
import { authenticate } from "../../middlewares/auth";
import {
  create,
  getAll,
  getById,
  getByUser,
  getRevenueByPeriodHandler,
  getTotalRevenue,
  remove,
  updateStatus,
} from "../controllers/order.controller";
import { requireRole } from "../../middlewares/checkRole";

const router = express.Router();

router.post("/", authenticate, create);

router.get("/", authenticate, requireRole(["admin"]), getAll);
router.get(
  "/total-revenue",
  authenticate,
  requireRole(["admin"]),
  getTotalRevenue
);
router.get(
  "/revenue",
  authenticate,
  requireRole(["admin"]),
  getRevenueByPeriodHandler
);
router.get("/:id", authenticate, getById);
router.get("/user", authenticate, getByUser);

router.patch("/:id", authenticate, requireRole(["admin"]), updateStatus);

router.delete("/", authenticate, requireRole(["admin"]), remove);

export default router;
