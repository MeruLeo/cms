import { Router } from "express";
import {
  createComment,
  getCommentsByProduct,
  deleteComment,
  approveComment,
  rejectComment,
  getComments,
} from "../controllers/comment.controller";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/checkRole";

const router = Router();

router.post("/", authenticate, createComment);

router.get("/", authenticate, requireRole(["admin"]), getComments);

router.get("/:productId", getCommentsByProduct);

router.delete(
  "/:commentId",
  authenticate,
  requireRole(["admin"]),
  deleteComment
);
router.patch(
  "/:commentId/approve",
  authenticate,
  requireRole(["admin"]),
  approveComment
);
router.patch(
  "/:commentId/reject",
  authenticate,
  requireRole(["admin"]),
  rejectComment
);

export default router;
