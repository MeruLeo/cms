import { FilterQuery } from "mongoose";
import { IProduct } from "../types/product.type";
import { ProductModel } from "../models/Product";
import { AppError } from "../middlewares/errorHandler";

export interface FindProductsOptions {
  filters: {
    title?: string;
    slug?: string;
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
  if (filters.slug) {
    query.slug = { $regex: filters.slug, $options: "i" };
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

export const findProductById = async (id: string) => {
  return await ProductModel.findById(id).select("-__v");
};

export const createOrUpdateProduct = async (data: any) => {
  const existingProduct = await ProductModel.findOne({ slug: data.slug });

  if (existingProduct) {
    const stockCount = Number(data.stockCount) || 0;
    existingProduct.stockCount += stockCount;

    if (data.images && data.images.length > 0) {
      if (!Array.isArray(existingProduct.images)) {
        existingProduct.images = [];
      }
      existingProduct.images.push(...data.images);
    }

    await existingProduct.save();
    return { product: existingProduct, isNew: false };
  }

  const newProduct = new ProductModel({
    ...data,
    stockCount: Number(data.stockCount) || 0,
  });

  await newProduct.save();
  return { product: newProduct, isNew: true };
};

export const updateProduct = async (id: string, data: Partial<IProduct>) => {
  const product = await ProductModel.findById(id);
  if (!product) throw new AppError("Product not found", 404);

  const allowedFields: (keyof IProduct)[] = [
    "title",
    "description",
    "price",
    "status",
    "category",
    "tags",
    "stockCount",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      if (field === "tags") {
        const tags = data.tags as unknown;

        if (tags && typeof tags === "object" && "op" in (tags as any)) {
          const { op, val } = tags as {
            op: "push" | "pull";
            val: string | string[];
          };
          const values = Array.isArray(val) ? val : [val];

          if (op === "push") {
            product.tags = Array.from(
              new Set([...(product.tags || []), ...values])
            );
          } else if (op === "pull") {
            product.tags = (product.tags || []).filter(
              (tag) => !values.includes(tag)
            );
          }
        } else {
          product.tags = data.tags as string[];
        }
      } else {
        (product[field] as any) =
          field === "price" || field === "stockCount"
            ? Number(data[field])
            : data[field]!;
      }
    }
  });

  if (data.images && data.images.length > 0) {
    if (!Array.isArray(product.images)) product.images = [];
    product.images.push(...data.images);
  }

  await product.save();
  return product;
};

export const deleteProduct = async (id: string) => {
  return await ProductModel.findByIdAndDelete(id);
};
