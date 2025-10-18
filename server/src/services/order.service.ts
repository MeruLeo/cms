import * as jalaali from "jalaali-js";
import { AppError } from "../middlewares/errorHandler";
import OrderModel from "../models/Order";
import { OrderStatus } from "../validators/orders.schema";
import { couponService } from "./coupon.service";
import { Types, FilterQuery, PipelineStage } from "mongoose";
import { ProductModel } from "../models/Product";
import { CodeGenerator } from "../utils/codeGenerator";
import { ProductStatus } from "../types/product.type";
import { IOrder } from "../types/order.type";

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

export interface FindOrdersOptions {
  filters: {
    code?: string;
    userId?: string;
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
  };
  page: number;
  limit: number;
  sort: string;
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
      const product = await ProductModel.findById(item.productId);
      if (!product) continue;

      product.stockCount = Math.max(product.stockCount - item.quantity, 0);
      if (product.stockCount === 0) {
        product.status = ProductStatus.OUT_OF_STOCK;
      }

      await product.save();
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

  async countOrdersByUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) return 0;
    return await OrderModel.countDocuments({ user: userId });
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
        const gregDayOfWeek = now.getUTCDay();
        const daysToSaturday = (gregDayOfWeek + 1) % 7;
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

  async getMonthlySalesJalali(year?: number) {
    const now = new Date();
    const jalaliNow = jalaali.toJalaali(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );
    const targetYear = year || jalaliNow.jy;

    const startGreg = jalaali.toGregorian(targetYear, 1, 1);
    const startDate = new Date(
      Date.UTC(startGreg.gy, startGreg.gm - 1, startGreg.gd, 0, 0, 0)
    );

    const endGreg = jalaali.toGregorian(targetYear, 12, 29);
    const endDate = new Date(
      Date.UTC(endGreg.gy, endGreg.gm - 1, endGreg.gd, 23, 59, 59)
    );

    const orders = await OrderModel.aggregate([
      {
        $match: {
          status: { $in: [OrderStatus.Delivered, OrderStatus.Paid] },
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $project: {
          createdAt: 1,
        },
      },
    ]);

    const monthlySales: { [key: number]: number } = {};

    for (let i = 1; i <= 12; i++) {
      monthlySales[i] = 0;
    }

    for (const order of orders) {
      const createdAt = new Date(order.createdAt);
      const jDate = jalaali.toJalaali(
        createdAt.getFullYear(),
        createdAt.getMonth() + 1,
        createdAt.getDate()
      );
      monthlySales[jDate.jm] = (monthlySales[jDate.jm] || 0) + 1;
    }

    return Object.keys(monthlySales).map((month) => ({
      month: parseInt(month),
      sales: monthlySales[parseInt(month)],
    }));
  },

  async findOrders({ filters, limit, page, sort }: FindOrdersOptions) {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 20;
    const skip = (safePage - 1) * safeLimit;

    const query: FilterQuery<IOrder> = {};

    if (filters.code) {
      query.code = { $regex: filters.code, $options: "i" };
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      const dateFilter: any = {};
      if (filters.startDate) dateFilter.$gte = new Date(filters.startDate);
      if (filters.endDate) dateFilter.$lte = new Date(filters.endDate);
      query.createdAt = dateFilter;
    }

    if (filters.userId) {
      if (!Types.ObjectId.isValid(filters.userId)) {
        throw new AppError("Invalid userId", 400);
      }
      query["user._id"] = new Types.ObjectId(filters.userId);
    }

    let searchOr: any[] = [];
    if (filters.search) {
      const searchRegex = { $regex: filters.search, $options: "i" };
      searchOr = [
        { code: searchRegex },
        { "user.username": searchRegex },
        { "user.email": searchRegex },
        { "user.fullName": searchRegex },
      ];
    }

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [{ $project: { username: 1, fullName: 1, email: 1 } }],
        },
      },
      { $unwind: "$user" },
    ];

    let finalMatch: any = query;
    if (searchOr.length > 0) {
      if (Object.keys(query).length > 0) {
        finalMatch = { $and: [query, { $or: searchOr }] };
      } else {
        finalMatch = { $or: searchOr };
      }
    }

    if (Object.keys(finalMatch).length > 0) {
      pipeline.push({ $match: finalMatch });
    }

    const parseSort = (sortStr: string): Record<string, 1 | -1> => {
      const sortObj: Record<string, 1 | -1> = {};
      sortStr.split(",").forEach((field) => {
        const trim = field.trim();
        const dir = trim.startsWith("-") ? -1 : 1;
        const key = trim.startsWith("-") ? trim.slice(1) : trim;
        sortObj[key] = dir;
      });
      return sortObj;
    };

    const effectiveSort = sort || "-createdAt";
    const sortObj = parseSort(effectiveSort);

    const itemsPipeline = [
      ...pipeline,
      { $sort: sortObj },
      { $skip: skip },
      { $limit: safeLimit },
      { $project: { __v: 0 } },
    ];

    const items = await OrderModel.aggregate(itemsPipeline).exec();

    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await OrderModel.aggregate(countPipeline).exec();
    const total = countResult[0]?.total || 0;

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      pages: Math.ceil(total / safeLimit),
    };
  },
};
