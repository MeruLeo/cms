import express from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/checkRole";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/category.controller";

const router = express.Router();

router.post("/", authenticate, requireRole(["admin"]), create);

router.get("/", authenticate, requireRole(["admin"]), getAll);

router.get("/:id", authenticate, requireRole(["admin"]), getById);

router.put("/:id", authenticate, requireRole(["admin"]), update);

router.delete("/:id", authenticate, requireRole(["admin"]), remove);

export default router;
