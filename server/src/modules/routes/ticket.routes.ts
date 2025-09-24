import express from "express";
import { authenticate } from "../../middlewares/auth";
import {
  addMessageToTicket,
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicketPriority,
  updateTicketStatus,
} from "../controllers/ticket.controller";
import { requireRole } from "../../middlewares/checkRole";

const router = express.Router();

router.post("/", authenticate, createTicket);

router.get("/", authenticate, requireRole(["admin"]), getTickets);
router.get("/:id", authenticate, requireRole(["admin", "user"]), getTicketById);

router.post("/:id", authenticate, addMessageToTicket);

router.patch(
  "/status/:id",
  authenticate,
  requireRole(["admin"]),
  updateTicketStatus
);
router.patch("/priority/:id", authenticate, updateTicketPriority);

router.delete("/:id", authenticate, requireRole(["admin"]), deleteTicket);
export default router;
