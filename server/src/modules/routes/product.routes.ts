import express from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/checkRole";
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/product.controller";
import { upload } from "../../utils/multer";

const router = express.Router();

router.get("/", authenticate, requireRole(["admin"]), getAll);
router.get("/:id", authenticate, requireRole(["admin"]), getById);

router.post(
  "/",
  authenticate,
  requireRole(["admin"]),
  upload.array("images", 5),
  create
);

router.put(
  "/:id",
  authenticate,
  requireRole(["admin"]),
  upload.array("images"),
  update
);
router.delete("/:id", authenticate, requireRole(["admin"]), remove);

export default router;
