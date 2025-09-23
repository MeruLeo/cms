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
    allowedUsers?: string[] | Types.ObjectId[];
  }) {
    if (data.scope === "private") {
      if (
        !data.allowedUsers ||
        !Array.isArray(data.allowedUsers) ||
        data.allowedUsers.length === 0
      ) {
        throw new Error(
          "For private scope, allowedUsers list must be provided"
        );
      }
      data.allowedUsers = data.allowedUsers.map(
        (u: any) => new Types.ObjectId(u)
      );
    } else {
      delete data.allowedUsers;
    }

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

    const allowedFields = [
      "code",
      "description",
      "discountType",
      "discountValue",
      "usageLimit",
      "startDate",
      "endDate",
      "isActive",
      "scope",
      "allowedUsers",
    ];

    const update: any = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        update[key] = (data as any)[key];
      }
    }

    if (update.scope === "public" && "allowedUsers" in update) {
      delete update.allowedUsers;
    }

    if ("allowedUsers" in update) {
      if (!Array.isArray(update.allowedUsers)) {
        throw new Error("allowedUsers must be an array of IDs");
      }
      update.allowedUsers = update.allowedUsers.map(
        (u: any) => new Types.ObjectId(u)
      );
    }

    if (
      update.scope === "private" &&
      (!update.allowedUsers || update.allowedUsers.length === 0)
    ) {
      throw new Error("For private scope, valid allowedUsers must be provided");
    }

    return await CouponModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );
  },

  async deleteCoupon(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return await CouponModel.findByIdAndDelete(id);
  },

  async applyCoupon(code: string, userId: Types.ObjectId | string) {
    const now = new Date();
    const uid = new Types.ObjectId(userId);

    const coupon = await CouponModel.findOneAndUpdate(
      {
        code,
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },

        $and: [
          {
            $or: [{ scope: "public" }, { scope: "private", allowedUsers: uid }],
          },
          {
            $or: [
              { usageLimit: { $exists: false } },
              { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
            ],
          },
        ],
      },
      { $inc: { usedCount: 1 } },
      { new: true, runValidators: true }
    );

    if (!coupon) throw new Error("Coupon code is invalid or cannot be used");

    return coupon;
  },

  async incrementUsage(id: string) {
    return await CouponModel.findByIdAndUpdate(
      id,
      { $inc: { usedCount: 1 } },
      { new: true }
    );
  },
};
