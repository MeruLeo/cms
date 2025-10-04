import { Types } from "mongoose";

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TicketCategory {
  ORDER = "order",
  PAYMENT = "payment",
  TECHNICAL = "technical",
  GENERAL = "general",
}

export interface ITicketMessage {
  sender: Types.ObjectId;
  message: string;
  createdAt: Date;
}

export interface CreateTicketInput {
  userId: string;
  title: string;
  description: string;
  category: string;
  priority?: TicketPriority;
}

export interface ITicket extends Document {
  user: Types.ObjectId;
  title: string;
  code: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  messages: ITicketMessage[];
  createdAt: Date;
  updatedAt: Date;
}
