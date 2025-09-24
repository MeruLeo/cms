import mongoose from "mongoose";

export interface IRefreshToken extends Document {
  jti: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
  revoked: boolean;
  replacedBy?: string | null;
}
