import { CouponModel } from "../models/Coupon";
import { Types } from "mongoose";

export const couponService = {
  async createCoupon(data: {
    code: string;
    description?: string;
    discountType: "percent" | "amount";
    discountValue: number;
    usageLimit?: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    scope: "public" | "private";
    allowedUsers: string[];
  }) {
    return await CouponModel.create(data);
  },

  async getAllCoupons() {
    return await CouponModel.find().sort({ createdAt: -1 });
  },

  async getCouponById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return await CouponModel.findById(id);
  },

  async updateCoupon(id: string, data: Partial<any>) {
    if (!Types.ObjectId.isValid(id)) return null;
    return await CouponModel.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteCoupon(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return await CouponModel.findByIdAndDelete(id);
  },

  async applyCoupon(code: string, userId: Types.ObjectId) {
    const coupon = await CouponModel.findOne({ code, isActive: true });
    if (!coupon) throw new Error("کد تخفیف معتبر نیست یا غیرفعال است");

    const now = new Date();
    if (coupon.startDate > now || coupon.endDate < now) {
      throw new Error("کد تخفیف منقضی شده است");
    }

    if (coupon.scope === "private" && !coupon.allowedUsers?.includes(userId)) {
      throw new Error("این کد برای شما معتبر نیست");
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new Error("سقف استفاده از این کد تکمیل شده است");
    }

    return coupon;
  },

  async incrementUsage(id: string) {
    return await CouponModel.findByIdAndUpdate(
      id,
      { $inc: { usageCount: 1 } },
      { new: true }
    );
  },
};
