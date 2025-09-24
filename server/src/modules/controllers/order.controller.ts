import { Request, Response, NextFunction } from "express";
import { orderService } from "../../services/order.service";
import { AppError } from "../../middlewares/errorHandler";
import {
  createOrderSchema,
  orderStatusEnum,
} from "../../validators/orders.schema";
import mongoose from "mongoose";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError("User not authenticated", 401));

    const orders = await orderService.getOrdersByUser(userId);
    return res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid order id", 400));
    }

    const order = await orderService.findOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      return next(new AppError(errors.join(", "), 400));
    }

    const userId = req.user?.userId;
    if (!userId) return next(new AppError("User not authenticated", 401));

    const order = await orderService.createOrder(parsed.data, userId);

    return res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid order id", 400));
    }

    const { status } = req.body;
    const parsed = orderStatusEnum.safeParse(status);
    if (!parsed.success) {
      return next(new AppError("Invalid status value", 400));
    }

    const updated = await orderService.updateOrderStatus(id, parsed.data);

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      message: "Order status updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid order id", 400));
    }

    const deleted = await orderService.deleteOrder(id);
    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};
