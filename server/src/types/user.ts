import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
