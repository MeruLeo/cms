import { NextFunction, Request, Response } from "express";
import * as productService from "../../services/products/product";
import { productSchema } from "../../validators/products/product";
import { AppError } from "../../middlewares/errorHandler";
import { IProduct, ProductStatus } from "../../types/product";
import mongoose from "mongoose";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = "1",
      limit = "20",
      sort = "-createdAt",
      ...filters
    } = req.query;

    const result = await productService.findProducts({
      filters,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: sort as string,
    });

    return res.json(result);
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
    const product = await productService.findProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
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
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      return next(new AppError(errors.join(", "), 400));
    }

    const images =
      (req.files as Express.Multer.File[])?.map((file) => file.path) || [];

    const productData = {
      ...parsed.data,
      images,
    };

    const { product, isNew } =
      await productService.createOrUpdateProduct(productData);

    return res.status(isNew ? 201 : 200).json({
      message: isNew
        ? "Product created successfully"
        : "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = productSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      return next(new AppError(errors.join(", "), 400));
    }

    const images =
      (req.files as Express.Multer.File[])?.map((f) => f.path) || [];

    const productData: any = {
      ...parsed.data,
      images,
    };

    if (parsed.data.status !== undefined) {
      productData.status = parsed.data.status as ProductStatus;
    }

    if (parsed.data.price !== undefined)
      productData.price = Number(parsed.data.price);
    if (parsed.data.stockCount !== undefined)
      productData.stockCount = Number(parsed.data.stockCount);

    const updatedProduct = await productService.updateProduct(
      req.params.id,
      productData
    );

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
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

    await productService.deleteProduct(id);
    res.status(200).json({ message: "product deleted successfuly" });
  } catch (error) {
    next(error);
  }
};
