import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const couponCreateSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "کد تخفیف باید حداقل ۳ کاراکتر باشد")
      .max(20, "کد تخفیف نمی‌تواند بیشتر از ۲۰ کاراکتر باشد")
      .regex(/^[A-Za-z0-9_-]+$/, "فقط حروف، اعداد، _ و - مجاز است"),

    description: z
      .string()
      .max(200, "توضیحات نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد")
      .optional(),

    discountType: z.enum(["percent", "amount"]),

    discountValue: z.number().positive("مقدار تخفیف باید مثبت باشد"),

    usageLimit: z
      .number()
      .int("باید عدد صحیح باشد")
      .positive("باید بیشتر از صفر باشد")
      .optional(),

    usedCount: z
      .number()
      .int("باید یک عدد صحیح باشد")
      .positive("باید بیشتر از صفر باشد")
      .optional(),

    startDate: z.coerce.date(),
    endDate: z.coerce.date(),

    isActive: z.boolean().default(true),

    scope: z.enum(["public", "private"]).default("public"),

    allowedUsers: z
      .array(z.string().regex(objectIdRegex, "ObjectId معتبر نیست"))
      .default([]),
  })

  .refine((data) => data.endDate > data.startDate, {
    message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
    path: ["endDate"],
  })

  .refine(
    (data) => {
      if (data.scope === "private") return data.allowedUsers.length > 0;
      return true;
    },
    {
      message: "کد شخصی باید حداقل یک کاربر داشته باشد",
      path: ["allowedUsers"],
    }
  )

  .refine(
    (data) => {
      if (data.scope === "public") return data.allowedUsers.length === 0;
      return true;
    },
    {
      message: "کد عمومی نباید کاربر اختصاصی داشته باشد",
      path: ["allowedUsers"],
    }
  );

export const couponUpdateSchema = couponCreateSchema
  .partial()
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      if (data.endDate <= data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
        });
      }
    }

    if (data.scope === "private") {
      if (!data.allowedUsers || data.allowedUsers.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["allowedUsers"],
          message: "کد شخصی باید حداقل یک کاربر داشته باشد",
        });
      }
    }

    if (data.scope === "public") {
      if (data.allowedUsers && data.allowedUsers.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["allowedUsers"],
          message: "کد عمومی نباید کاربر اختصاصی داشته باشد",
        });
      }
    }
  });
