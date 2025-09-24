import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  title: string;
  slug: string;
  description?: string;
  parent?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
