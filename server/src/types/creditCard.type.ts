import { Document } from "mongoose";

export interface ICreditCard extends Document {
  owner: string;
  num: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
