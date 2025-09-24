import { Schema, model, Document, Types } from "mongoose";
import { ICategory } from "../types/category.type";
import { makeSlug } from "../utils/makeSlug";

const categorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = makeSlug(this.title);
  }
  next();
});

categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });

export const CategoryModel = model<ICategory>("Category", categorySchema);
