import { z } from "zod";

const luhn = (num: string) => {
  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let digit = Number(num[15 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

export const createCreditCardSchema = (
  isNumUnique: (num: string) => Promise<boolean>
) => {
  return z
    .object({
      owner: z.string().min(1, "owner is required"),
      num: z
        .string()
        .regex(/^\d{16}$/, "card number must be 16 digits")
        .refine((s) => luhn(s), "card number failed Luhn check"),
      isActive: z.boolean().optional().default(true),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    })
    .superRefine(async (data, ctx) => {
      const ok = await isNumUnique(data.num);
      if (!ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "card number must be unique",
          path: ["num"],
        });
      }
    });
};
