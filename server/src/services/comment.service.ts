import { CommentModel } from "../models/Comment";
import { Types } from "mongoose";
import { AppError } from "../middlewares/errorHandler";
import { IComment } from "../types/comment.type";

interface CreateCommentDTO {
  product: string;
  user: string;
  content: string;
}

export const createComment = async (
  data: CreateCommentDTO
): Promise<IComment> => {
  if (!Types.ObjectId.isValid(data.product))
    throw new AppError("شناسه محصول نامعتبر است", 400);

  const payload = {
    ...data,
    product: new Types.ObjectId(data.product),
    user: new Types.ObjectId(data.user),
  };

  return await CommentModel.create(payload);
};

interface GetCommentsOptions {
  userId?: string; // دریافت کامنت‌های یک کاربر
  productId?: string; // دریافت کامنت‌های یک محصول
  isApproved?: boolean; // تایید شده یا رد شده
  page?: number;
  limit?: number;
}

export const getComments = async (options: GetCommentsOptions) => {
  const { userId, productId, isApproved, page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  if (userId) {
    if (!Types.ObjectId.isValid(userId))
      throw new AppError("شناسه کاربر نامعتبر است", 400);
    filter.user = new Types.ObjectId(userId);
  }

  if (productId) {
    if (!Types.ObjectId.isValid(productId))
      throw new AppError("شناسه محصول نامعتبر است", 400);
    filter.product = new Types.ObjectId(productId);
  }

  if (typeof isApproved === "boolean") {
    filter.isApproved = isApproved;
  }

  const [comments, total] = await Promise.all([
    CommentModel.find(filter)
      .populate("user", "username fullName")
      .populate("product", "title slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CommentModel.countDocuments(filter),
  ]);

  return {
    comments,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getProductComments = async (
  productId: string,
  page = 1,
  limit = 10
) => {
  if (!Types.ObjectId.isValid(productId))
    throw new AppError("شناسه محصول نامعتبر است", 400);

  const skip = (page - 1) * limit;
  const [comments, total] = await Promise.all([
    CommentModel.find({
      product: new Types.ObjectId(productId),
      isApproved: true,
    })
      .populate("user", "username fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CommentModel.countDocuments({
      product: new Types.ObjectId(productId),
      isApproved: true,
    }),
  ]);

  return { comments, total, page, pages: Math.ceil(total / limit) };
};

export const getCommentById = async (commentId: string) => {
  if (!Types.ObjectId.isValid(commentId))
    throw new AppError("شناسه کامنت نامعتبر است", 400);

  const comment = await CommentModel.findById(commentId)
    .populate("user", "username fullName")
    .populate("product", "title slug")
    .exec();

  if (!comment) throw new AppError("کامنت یافت نشد", 404);
  return comment;
};

export const updateComment = async (
  commentId: string,
  data: Partial<IComment>,
  userId: string,
  isAdmin = false
) => {
  if (!Types.ObjectId.isValid(commentId))
    throw new AppError("شناسه کامنت نامعتبر است", 400);

  const comment = await CommentModel.findById(commentId).exec();
  if (!comment) throw new AppError("کامنت یافت نشد", 404);

  if (!isAdmin && comment.user.toString() !== userId)
    throw new AppError("شما اجازه ویرایش این کامنت را ندارید", 403);

  return await CommentModel.findByIdAndUpdate(commentId, data, {
    new: true,
    runValidators: true,
  })
    .populate("user", "username fullName")
    .exec();
};

export const deleteComment = async (
  commentId: string,
  userId: string,
  isAdmin = false
) => {
  if (!Types.ObjectId.isValid(commentId))
    throw new AppError("شناسه کامنت نامعتبر است", 400);

  const comment = await CommentModel.findById(commentId).exec();
  if (!comment) throw new AppError("کامنت یافت نشد", 404);

  if (!isAdmin && comment.user.toString() !== userId)
    throw new AppError("شما اجازه حذف این کامنت را ندارید", 403);

  return await CommentModel.findByIdAndDelete(commentId).exec();
};

export const countCommentsByProduct = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) return 0;
  return await CommentModel.countDocuments({
    product: new Types.ObjectId(productId),
    isApproved: true,
  });
};

export const approveComment = async (commentId: string, approve = true) => {
  if (!Types.ObjectId.isValid(commentId))
    throw new AppError("آیدی نامعتبر است", 400);

  const updated = await CommentModel.findByIdAndUpdate(
    commentId,
    { isApproved: approve },
    { new: true }
  )
    .populate("user", "username fullName")
    .exec();

  if (!updated) throw new AppError("کامنت یافت نشد", 404);
  return updated;
};

export const rejectComment = async (commentId: string) => {
  return approveComment(commentId, false);
};
