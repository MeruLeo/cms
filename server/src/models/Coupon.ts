import { model, Schema } from "mongoose";
import { ICoupon } from "../types/coupon";

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    discountType: { type: String, required: true, enum: ["percent", "amount"] },
    discountValue: { type: Number, required: true, min: 0 },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    scope: { type: String, enum: ["public", "private"], default: "public" },
    allowedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });

export const CouponModel = model<ICoupon>("Coupon", couponSchema);
