// controllers/coupon.controller.ts
import { Request, Response, NextFunction } from "express";
import { couponService } from "../../services/coupon.service";
import {
  couponCreateSchema,
  couponUpdateSchema,
} from "../../validators/coupon";
import { AppError } from "../../middlewares/errorHandler";

export async function createCoupon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = couponCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      return next(new AppError(errors.join(", "), 400));
    }

    const coupon = await couponService.createCoupon(parsed.data);
    res.status(201).json({ ok: true, data: coupon });
  } catch (err) {
    next(err);
  }
}

export async function getCoupons(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json({ ok: true, data: coupons });
  } catch (err) {
    next(err);
  }
}

export async function getCoupon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const coupon = await couponService.getCouponById(req.params.id);
    if (!coupon) return next(new AppError("Coupon not found", 404));

    res.json({ ok: true, data: coupon });
  } catch (err) {
    next(err);
  }
}

export async function updateCoupon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = couponUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      return next(new AppError(errors.join(", "), 400));
    }

    const coupon = await couponService.updateCoupon(req.params.id, parsed.data);
    if (!coupon) return next(new AppError("Coupon not found", 404));

    res.json({ ok: true, data: coupon });
  } catch (err) {
    next(err);
  }
}

export async function deleteCoupon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const coupon = await couponService.deleteCoupon(req.params.id);
    if (!coupon) return next(new AppError("Coupon not found", 404));

    res.json({ ok: true, message: "Coupon deleted" });
  } catch (err) {
    next(err);
  }
}

export async function applyCoupon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { code, userId } = req.body;
    if (!code || !userId) {
      return next(new AppError("Code and user ID are required", 400));
    }

    const coupon = await couponService.applyCoupon(code, userId);
    res.json({ ok: true, data: coupon });
  } catch (err: any) {
    next(new AppError(err.message, 400));
  }
}
