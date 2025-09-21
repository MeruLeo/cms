import { FilterQuery } from "mongoose";
import { IProduct } from "../../types/product";
import { ProductModel } from "../../models/Product";

export interface FindProductsOptions {
  filters: {
    title?: string;
    category?: string;
    status?: "available" | "out_of_stock" | "discontinued";
    priceMin?: number;
    priceMax?: number;
    inStock?: boolean;
    tags?: string[];
  };
  page: number;
  limit: number;
  sort: string;
}

export const findProducts = async ({
  filters,
  limit,
  page,
  sort,
}: FindProductsOptions) => {
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;
  const skip = (safePage - 1) * safeLimit;

  const query: FilterQuery<IProduct> = {};

  if (filters.title) {
    query.title = { $regex: filters.title, $options: "i" };
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    query.price = {};
    if (filters.priceMin !== undefined) {
      query.price.$gte = filters.priceMin;
    }
    if (filters.priceMax !== undefined) {
      query.price.$lte = filters.priceMax;
    }
  }

  if (filters.inStock !== undefined) {
    if (filters.inStock) {
      query.stock = { $gt: 0 };
    } else {
      query.stock = { $eq: 0 };
    }
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  const [items, total] = await Promise.all([
    ProductModel.find(query)
      .select("-__v")
      .sort(sort)
      .skip(skip)
      .limit(safeLimit),
    ProductModel.countDocuments(query),
  ]);

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    pages: Math.ceil(total / safeLimit),
  };
};
