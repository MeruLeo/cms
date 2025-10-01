import express from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/checkRole";
import { getMe, getUserById, getUsers } from "../controllers/user.controller";

const router = express.Router();

router.get("/", authenticate, requireRole(["admin"]), getUsers);
router.get("/me", authenticate, getMe);
router.get("/:id", authenticate, requireRole(["admin"]), getUserById);

export default router;
