import { TicketModel } from "../models/Ticket";
import {
  ITicket,
  TicketStatus,
  TicketPriority,
  CreateTicketInput,
} from "../types/ticket.type";
import { Types } from "mongoose";
import { AppError } from "../middlewares/errorHandler";

export const createTicket = async ({
  userId,
  title,
  description,
  category,
  priority = TicketPriority.MEDIUM,
}: CreateTicketInput): Promise<ITicket> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("شناسه کاربر نامعتبر است", 400);
  }

  const ticket = await TicketModel.create({
    user: userId,
    title,
    description,
    category,
    priority,
    status: TicketStatus.OPEN,
  });

  return ticket;
};

export const getTickets = async (
  filters: {
    userId?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: string;
  },
  page = 1,
  limit = 10
): Promise<{ tickets: ITicket[]; total: number }> => {
  const query: any = {};

  if (filters.userId && Types.ObjectId.isValid(filters.userId)) {
    query.user = filters.userId;
  }
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.category) query.category = filters.category;

  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    TicketModel.find(query)
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    TicketModel.countDocuments(query),
  ]);

  return { tickets, total };
};

export const getTicketById = async (
  ticketId: string,
  userId: string,
  isAdmin: boolean
): Promise<ITicket> => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw new AppError("شناسه تیکت نامعتبر است", 400);
  }
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("شناسه کاربر نامعتبر است", 400);
  }

  const query: any = { _id: ticketId };

  if (!isAdmin) {
    query.user = userId;
  }

  const ticket = await TicketModel.findOne(query).populate(
    "user",
    "username fullName email"
  );
  if (!ticket) throw new AppError("تیکت یافت نشد", 404);

  return ticket;
};

export const addMessageToTicket = async (
  ticketId: string,
  senderId: string,
  message: string
): Promise<ITicket> => {
  if (!Types.ObjectId.isValid(ticketId) || !Types.ObjectId.isValid(senderId)) {
    throw new AppError("شناسه نامعتبر است", 400);
  }

  const ticket = await TicketModel.findById(ticketId);
  if (!ticket) throw new AppError("تیکت یافت نشد", 404);

  if (ticket.status === "closed") {
    throw new AppError("This ticket is closed", 403);
  }

  ticket.messages.push({
    sender: new Types.ObjectId(senderId),
    message,
    createdAt: new Date(),
  });
  await ticket.save();

  return ticket;
};

export const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus
): Promise<ITicket> => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw new AppError("شناسه تیکت نامعتبر است", 400);
  }

  const ticket = await TicketModel.findByIdAndUpdate(
    ticketId,
    { status },
    { new: true }
  );
  if (!ticket) throw new AppError("تیکت یافت نشد", 404);

  return ticket;
};

export const updateTicketPriority = async (
  ticketId: string,
  priority: TicketPriority
): Promise<ITicket> => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw new AppError("شناسه تیکت نامعتبر است", 400);
  }

  const ticket = await TicketModel.findByIdAndUpdate(
    ticketId,
    { priority },
    { new: true }
  );
  if (!ticket) throw new AppError("تیکت یافت نشد", 404);

  return ticket;
};

export const deleteTicket = async (ticketId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw new AppError("شناسه تیکت نامعتبر است", 400);
  }

  const ticket = await TicketModel.findByIdAndDelete(ticketId);
  if (!ticket) throw new AppError("تیکت یافت نشد", 404);
};
