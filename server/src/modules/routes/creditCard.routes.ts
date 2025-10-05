// routes/creditCard.router.ts
import express from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/checkRole";
import {
  create,
  getAll,
  getByUser,
  getActiveByUser,
  getById,
  update,
  remove,
} from "../controllers/creditCard.controller";

const router = express.Router();

router.post("/", authenticate, requireRole(["admin"]), create);

router.get("/", authenticate, requireRole(["admin"]), getAll);

router.get("/user", authenticate, requireRole(["admin"]), getByUser);

router.get(
  "/user/active",
  authenticate,
  requireRole(["admin"]),
  getActiveByUser
);

router.get("/:id", authenticate, requireRole(["admin"]), getById);

router.patch("/:id", authenticate, requireRole(["admin"]), update);

router.delete("/:id", authenticate, requireRole(["admin"]), remove);

export default router;
