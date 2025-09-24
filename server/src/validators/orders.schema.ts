import { z } from "zod";

export enum OrderStatus {
  Pending = "pending",
  Paid = "paid",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
}
export const orderStatusEnum = z.nativeEnum(OrderStatus);

export type OrderStatusType = z.infer<typeof orderStatusEnum>;

const orderItemSchema = z.object({
  productId: z.string().trim().min(1, { message: "شناسه محصول الزامی است" }),
  quantity: z.coerce.number().int().min(1, { message: "حداقل تعداد 1 است" }),
  price: z.coerce.number().min(0, { message: "قیمت نمی‌تواند منفی باشد" }),
});

export const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, { message: "حداقل یک محصول لازم است" }),
  shippingCost: z.coerce.number().min(0).optional(),
  couponCode: z.string().trim().optional(),
});

const shippingAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: "نام و نام خانوادگی باید حداقل 3 کاراکتر باشد" }),
  phone: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, { message: "شماره تلفن معتبر نیست" }),
  address: z
    .string()
    .trim()
    .min(10, { message: "آدرس باید حداقل 10 کاراکتر باشد" }),
  city: z.string().trim().min(2, { message: "نام شهر الزامی است" }),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{10}$/, { message: "کد پستی باید 10 رقم باشد" }),
});
