import { Schema, model } from "mongoose";
import { IProduct, ProductStatus } from "../types/product.type";

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    description: { type: String },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.AVAILABLE,
    },
    category: { type: String },
    tags: [{ type: String }],
    images: [{ type: String }],
    stockCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProductModel = model<IProduct>("Product", productSchema);
