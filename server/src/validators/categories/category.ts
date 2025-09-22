import { z } from "zod";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const categoryCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(120, { message: "Title should not exceed 120 characters" }),

  slug: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val), {
      message: "Slug can only include English letters, numbers, and '-'",
    }),

  description: z
    .string()
    .trim()
    .max(1000, { message: "Description cannot exceed 1000 characters" })
    .optional()
    .or(z.literal("")),

  parent: z
    .string()
    .trim()
    .refine((v) => v === "" || objectIdRegex.test(v), {
      message: "Parent must be a valid 24-character hex ObjectId",
    })
    .optional(),

  isActive: z.boolean().optional().default(true),
});

export const categoryUpdateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, { message: "Title must be at least 2 characters" })
      .max(120, { message: "Title should not exceed 120 characters" })
      .optional(),

    slug: z
      .string()
      .trim()
      .toLowerCase()
      .max(160, { message: "Slug is too long" })
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug can only include English letters, numbers, and '-'",
      })
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000, { message: "Description cannot exceed 1000 characters" })
      .optional()
      .or(z.literal("")),

    parent: z
      .string()
      .trim()
      .refine((v) => v === "" || objectIdRegex.test(v), {
        message: "Parent must be a valid 24-character hex ObjectId",
      })
      .optional(),

    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields were sent for update",
  });

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
