import mongoose, { Document, Schema } from "mongoose";
import { IRefreshToken } from "../types/refreshToken.type";

const RefreshTokenSchema = new Schema<IRefreshToken>({
  jti: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  replacedBy: { type: String, default: null },
});

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshTokenModel = mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);

export default RefreshTokenModel;
