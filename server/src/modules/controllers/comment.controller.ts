import { Request, Response, NextFunction } from "express";
import * as commentService from "../../services/comment.service";
import { commentCreateSchema } from "../../validators/comment.schema";
import { AppError } from "../../middlewares/errorHandler";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = commentCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      return next(new AppError(errors.join(", "), 400));
    }
    const comment = await commentService.createComment({
      ...parsed.data,
      user: req.user!.userId,
    });

    return res.status(201).json({ ok: true, data: comment });
  } catch (err) {
    next(err);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, productId, isApproved, page, limit } = req.query;

    const comments = await commentService.getComments({
      userId: userId as string | undefined,
      productId: productId as string | undefined,
      isApproved:
        typeof isApproved === "string" ? isApproved === "true" : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    return res.status(200).json({ ok: true, data: comments });
  } catch (err) {
    next(err);
  }
};

export const getCommentsByProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await commentService.getProductComments(
      productId,
      Number(page),
      Number(limit)
    );

    return res.status(200).json({ ok: true, data: comments });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const userId = req.user!.userId;
    const isAdmin = req.user!.role === "admin";

    await commentService.deleteComment(commentId, userId, isAdmin);

    return res.status(200).json({ ok: true, message: "کامنت حذف شد" });
  } catch (err) {
    next(err);
  }
};

export const approveComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user!.role !== "admin") {
      return res.status(403).json({ ok: false, message: "Access denied" });
    }

    const { commentId } = req.params;
    const comment = await commentService.approveComment(commentId, true);

    return res
      .status(200)
      .json({ ok: true, message: "کامنت تایید شد", data: comment });
  } catch (err) {
    next(err);
  }
};

export const rejectComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user!.role !== "admin") {
      return res.status(403).json({ ok: false, message: "Access denied" });
    }

    const { commentId } = req.params;
    const comment = await commentService.rejectComment(commentId);

    return res
      .status(200)
      .json({ ok: true, message: "کامنت رد شد", data: comment });
  } catch (err) {
    next(err);
  }
};
