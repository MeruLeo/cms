import express from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/checkRole";
import {
  getMe,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  changeUserStatus,
  changeUserPassword,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/", authenticate, requireRole(["admin"]), getUsers);
router.get("/me", authenticate, getMe);
router.get("/:id", authenticate, requireRole(["admin"]), getUserById);

router.put("/:id", authenticate, requireRole(["admin"]), updateUser);

router.delete("/:id", authenticate, requireRole(["admin"]), deleteUser);

router.patch(
  "/:id/status",
  authenticate,
  requireRole(["admin"]),
  changeUserStatus
);

router.patch(
  "/:id/password",
  authenticate,
  requireRole(["admin", "user"]),
  changeUserPassword
);

export default router;
