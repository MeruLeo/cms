import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  slug: z.string().min(2, { message: "slug must be at least 3 characters" }),
  description: z
    .string()
    .max(1000, { message: "Description too long" })
    .optional(),
  price: z.coerce
    .number()
    .positive({ message: "Price must be greater than 0" }),
  status: z.enum(["available", "out_of_stock", "discontinued"]),
  category: z
    .string()
    .min(2, { message: "Category must be at least 2 characters" })
    .optional(),
  tags: z
    .union([
      z
        .array(z.string().min(1, { message: "Tag cannot be empty" }))
        .max(20, { message: "Too many tags" }),
      z.object({
        op: z.enum(["push", "pull"]),
        val: z.union([
          z.string().min(1, { message: "Tag cannot be empty" }),
          z.array(z.string().min(1, { message: "Tag cannot be empty" })),
        ]),
      }),
    ])
    .optional(),

  stockCount: z.coerce
    .number()
    .int({ message: "Stock count must be an integer" })
    .min(0, {
      message: "Stock cannot be negative",
    }),
});
