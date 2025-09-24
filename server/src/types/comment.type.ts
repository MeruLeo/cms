import { Document, Types } from "mongoose";

export interface IComment extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
