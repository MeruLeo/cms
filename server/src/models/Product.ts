import { Schema, model } from "mongoose";
import { IProduct, ProductStatus } from "../types/product";

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
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
