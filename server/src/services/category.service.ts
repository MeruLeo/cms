// services/category.service.ts
import { CategoryModel } from "../models/Category";
import { ICategory } from "../types/category.type";
import { Types } from "mongoose";
import {
  CategoryCreateInput,
  CategoryUpdateInput,
} from "../validators/category.schema";
import { AppError } from "../middlewares/errorHandler";

export async function createCategory(
  data: CategoryCreateInput
): Promise<ICategory> {
  const existing = await CategoryModel.findOne({ slug: data.slug });
  if (existing) {
    throw new AppError("یک دسته‌بندی با این slug از قبل وجود دارد");
  }

  const category = new CategoryModel(data);
  return category.save();
}

export async function getCategories(options?: {
  parent?: string;
  isActive?: boolean;
}): Promise<ICategory[]> {
  const query: any = {};
  if (options?.parent) query.parent = new Types.ObjectId(options.parent);
  if (typeof options?.isActive === "boolean") query.isActive = options.isActive;

  return CategoryModel.find(query).sort({ createdAt: -1 }).exec();
}

export async function getCategoryById(id: string): Promise<ICategory | null> {
  if (!Types.ObjectId.isValid(id)) throw new AppError("آیدی معتبر نیست");
  return CategoryModel.findById(id).exec();
}

export async function updateCategory(
  id: string,
  updates: CategoryUpdateInput
): Promise<ICategory | null> {
  if (!Types.ObjectId.isValid(id)) throw new AppError("آیدی معتبر نیست");

  const category = await CategoryModel.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).exec();

  return category;
}

export async function deleteCategory(id: string): Promise<void> {
  if (!Types.ObjectId.isValid(id)) throw new AppError("آیدی معتبر نیست");

  const hasChildren = await CategoryModel.exists({ parent: id });
  if (hasChildren) {
    throw new AppError("این دسته دارای زیردسته است و قابل حذف نیست");
  }

  await CategoryModel.findByIdAndDelete(id).exec();
}
