import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const commentCreateSchema = z.object({
  product: z.string().regex(objectIdRegex, "شناسه محصول معتبر نیست"),
  content: z
    .string()
    .trim()
    .min(3, "متن کامنت باید حداقل ۳ کاراکتر باشد")
    .max(1000, "متن کامنت نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد"),
});

export const commentUpdateSchema = commentCreateSchema.partial();
