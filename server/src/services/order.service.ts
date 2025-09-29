import z from "zod";
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
};
