import { model, Schema } from "mongoose";
import {
  ITicket,
  ITicketMessage,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../types/ticket.type";

const TicketMessageSchema = new Schema<ITicketMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const TicketSchema = new Schema<ITicket>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, maxlength: 200 },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.OPEN,
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.MEDIUM,
    },
    category: {
      type: String,
      enum: Object.values(TicketCategory),
      default: TicketCategory.GENERAL,
    },
    messages: [TicketMessageSchema],
  },
  { timestamps: true }
);

export const TicketModel = model<ITicket>("Ticket", TicketSchema);
