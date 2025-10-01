import * as jalaali from "jalaali-js";
import { AppError } from "../middlewares/errorHandler";
import OrderModel from "../models/Order";
import {
  createOrderSchema,
  OrderStatus,
  orderStatusEnum,
} from "../validators/orders.schema";
import { couponService } from "./coupon.service";
import { Types } from "mongoose";
import { ProductModel } from "../models/Product";
import { CodeGenerator } from "../utils/codeGenerator";

interface OrderItem {
  productId: string;
  price: number;
  quantity: number;
}

interface CreateOrderInput {
  items: OrderItem[];
  shippingCost?: number;
  couponCode?: string;
}

export const orderService = {
  async createOrder(data: CreateOrderInput, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }

    const uid = new Types.ObjectId(userId);

    const subtotal = data.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    let appliedDiscount = 0;
    let couponDetails: any = null;

    if (data.couponCode) {
      try {
        const coupon = await couponService.applyCoupon(data.couponCode, uid);

        appliedDiscount =
          coupon.discountType === "percent"
            ? (subtotal * coupon.discountValue) / 100
            : coupon.discountValue;

        appliedDiscount = Math.min(appliedDiscount, subtotal);

        couponDetails = {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          appliedDiscount,
        };
      } catch (error) {
        throw new AppError(error as string);
      }
    }

    const totalAmount = Math.max(
      subtotal - appliedDiscount + (data.shippingCost || 0),
      0
    );

    const orderCode = CodeGenerator.generate({
      prefix: "ORD",
      includeDate: true,
      length: 6,
      onlyNumbers: true,
    });

    const order = await OrderModel.create({
      ...data,
      user: uid,
      subtotal,
      totalAmount,
      coupon: couponDetails,
      status: OrderStatus.Pending,
      code: orderCode,
    });

    for (const item of data.items) {
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { stockCount: -item.quantity },
      });
    }

    return order.toObject();
  },

  async getOrdersByUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) return [];
    return await OrderModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
  },

  async getAllOrders() {
    return await OrderModel.find()
      .populate("user", "username fullName email")
      .sort({ createdAt: -1 })
      .lean();
  },

  async findOrderById(orderId: string) {
    if (!Types.ObjectId.isValid(orderId)) return null;
    return await OrderModel.findById(orderId)
      .populate("user", "username email")
      .lean();
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    if (!Types.ObjectId.isValid(orderId)) return null;
    return await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).lean();
  },

  async deleteOrder(orderId: string) {
    if (!Types.ObjectId.isValid(orderId)) return null;
    return await OrderModel.findByIdAndDelete(orderId).lean();
  },

  async getTotalRevenue() {
    const result = await OrderModel.aggregate([
      {
        $match: {
          status: { $in: [OrderStatus.Delivered, OrderStatus.Paid] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    return result[0]?.total || 0;
  },

  async getRevenueByPeriod(
    period: "day" | "week" | "month" | "year"
  ): Promise<number> {
    const now = new Date();
    const utcNow = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );

    // Convert current UTC date to Jalali
    const jalaliNow = jalaali.toJalaali(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      now.getUTCDate()
    );

    let startJY: number, startJM: number, startJD: number;

    switch (period) {
      case "day":
        startJY = jalaliNow.jy;
        startJM = jalaliNow.jm;
        startJD = jalaliNow.jd;
        break;
      case "week": {
        // Calculate start of the week (Saturday = 6 in JS, but adjust for Jalali)
        const jalaliDayOfWeek = (new Date(utcNow).getUTCDay() + 1) % 7; // Adjust to Persian week: 0=Saturday, 1=Sunday, ..., 6=Friday? Wait, Persian week: Saturday=1? No.
        // In Jalali, week starts on Saturday (Shanbe = 0 in some libs).
        // We need to find the Saturday before or on today.
        // First, get Gregorian day of week: 0=Sun,1=Mon,...,6=Sat
        const gregDayOfWeek = now.getUTCDay();
        // Persian week starts on Saturday (6).
        const daysToSaturday = (gregDayOfWeek + 1) % 7; // Days back to Saturday
        const startGregDate = new Date(utcNow);
        startGregDate.setUTCDate(startGregDate.getUTCDate() - daysToSaturday);
        const startJalali = jalaali.toJalaali(
          startGregDate.getUTCFullYear(),
          startGregDate.getUTCMonth() + 1,
          startGregDate.getUTCDate()
        );
        startJY = startJalali.jy;
        startJM = startJalali.jm;
        startJD = startJalali.jd;
        break;
      }
      case "month":
        startJY = jalaliNow.jy;
        startJM = jalaliNow.jm;
        startJD = 1;
        break;
      case "year":
        startJY = jalaliNow.jy;
        startJM = 1;
        startJD = 1;
        break;
      default:
        throw new AppError("Invalid period");
    }

    // Convert start Jalali date back to Gregorian UTC
    const startGreg = jalaali.toGregorian(startJY, startJM, startJD);
    const startDate = new Date(
      Date.UTC(startGreg.gy, startGreg.gm - 1, startGreg.gd, 0, 0, 0, 0)
    );

    // Ensure startDate <= now
    if (startDate > now) {
      throw new AppError("Calculated start date is in the future");
    }

    const result = await OrderModel.aggregate([
      {
        $match: {
          status: { $in: [OrderStatus.Delivered, OrderStatus.Paid] },
          createdAt: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    return result[0]?.total || 0;
  },
};
