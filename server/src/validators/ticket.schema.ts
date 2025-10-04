import { z } from "zod";
import {
  TicketStatus,
  TicketPriority,
  TicketCategory,
} from "../types/ticket.type";

export const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "عنوان باید حداقل 5 کاراکتر باشد" })
    .max(200, { message: "عنوان نمی‌تواند بیشتر از 200 کاراکتر باشد" }),

  description: z
    .string()
    .trim()
    .min(10, { message: "توضیحات باید حداقل 10 کاراکتر باشد" }),

  category: z.nativeEnum(TicketCategory, {
    message: "دسته‌بندی نامعتبر است",
  }),

  priority: z.nativeEnum(TicketPriority).optional(),
});

export const addMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, { message: "پیام باید حداقل 2 کاراکتر باشد" }),
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus, {
    message: "وضعیت نامعتبر است",
  }),
});

export const updatePrioritySchema = z.object({
  priority: z.nativeEnum(TicketPriority, {
    message: "اولویت نامعتبر است",
  }),
});
