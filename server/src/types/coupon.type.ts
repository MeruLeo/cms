import { Types } from "mongoose";

export type DiscountType = "percent" | "amount";
export type CouponScope = "public" | "private";

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  usageLimit?: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  scope: CouponScope;
  allowedUsers?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
