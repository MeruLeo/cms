import { Request, Response, NextFunction } from "express";
import * as ticketService from "../../services/ticket.service";
import {
  createTicketSchema,
  addMessageSchema,
  updateStatusSchema,
  updatePrioritySchema,
} from "../../validators/ticket.schema";
import { AppError } from "../../middlewares/errorHandler";
import { TicketStatus } from "../../types/ticket.type";

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createTicketSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      throw new AppError(errors.join(", "), 400);
    }

    const userId = req.user?.userId;
    if (!userId) throw new AppError("کاربر شناسایی نشد", 401);

    const ticket = await ticketService.createTicket({
      userId,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      priority: parsed.data.priority,
    });

    res.status(201).json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
};

export const getTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = "1",
      limit = "10",
      status,
      priority,
      category,
      userId,
    } = req.query;

    const result = await ticketService.getTickets(
      {
        userId: userId as string,
        status: status as any,
        priority: priority as any,
        category: category as string,
      },
      parseInt(page as string, 10),
      parseInt(limit as string, 10)
    );

    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getTicketById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId as string;
    const role = req.user?.role as string;

    const ticket = await ticketService.getTicketById(
      id,
      userId,
      role === "admin"
    );
    res.json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
};

export const addMessageToTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = addMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      throw new AppError(errors.join(", "), 400);
    }

    const { id } = req.params;
    const senderId = req.user?.userId;
    if (!senderId) throw new AppError("کاربر شناسایی نشد", 401);

    const ticket = await ticketService.addMessageToTicket(
      id,
      senderId,
      parsed.data.message
    );
    res.json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
};

export const updateTicketStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      throw new AppError(errors.join(", "), 400);
    }

    const { id } = req.params;
    const ticket = await ticketService.updateTicketStatus(
      id,
      parsed.data.status as TicketStatus
    );
    res.json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
};

export const updateTicketPriority = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = updatePrioritySchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      throw new AppError(errors.join(", "), 400);
    }

    const { id } = req.params;
    const ticket = await ticketService.updateTicketPriority(
      id,
      parsed.data.priority
    );
    res.json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
};

export const deleteTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await ticketService.deleteTicket(id);
    res.json({ ok: true, message: "تیکت با موفقیت حذف شد" });
  } catch (err) {
    next(err);
  }
};
