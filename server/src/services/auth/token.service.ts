import mongoose from "mongoose";
import config from "../../config/config";
import RefreshTokenModel from "../../models/RefreshToken";
import { parseDuration } from "../../utils/cookiesTime";
import { generateRefreshToken } from "../../utils/jwt";
import { AppError } from "../../middlewares/errorHandler";

export const issueRefreshTokenForUser = async (userId: string) => {
  const { token, jti } = generateRefreshToken(userId);

  const expiresMs = parseDuration(config.auth.refreshExpiresIn);
  const expiresAt = new Date(Date.now() + expiresMs);

  await RefreshTokenModel.create({
    jti,
    userId: new mongoose.Types.ObjectId(userId),
    expiresAt,
  });

  return { token, jti, expiresAt };
};

export const rotateRefreshToken = async (oldJti: string, userId: string) => {
  const old = await RefreshTokenModel.findOne({ jti: oldJti });
  if (!old || old.revoked || old.userId.toString() !== userId) {
    throw new AppError("Invalid refresh token");
  }

  const { token: newToken, jti: newJti } = generateRefreshToken(userId);
  const expiresMs = parseDuration(config.auth.refreshExpiresIn);
  const expiresAt = new Date(Date.now() + expiresMs);

  await RefreshTokenModel.create({
    jti: newJti,
    userId: old.userId,
    expiresAt,
  });

  old.revoked = true;
  old.replacedBy = newJti;
  await old.save();

  return { token: newToken, jti: newJti, expiresAt };
};

export const revokeRefreshToken = async (jti: string) => {
  await RefreshTokenModel.updateOne({ jti }, { revoked: true });
};

export const isRefreshTokenRevoked = async (jti: string) => {
  const doc = await RefreshTokenModel.findOne({ jti });
  if (!doc) return true;
  if (doc.revoked) return true;
  if (doc.expiresAt < new Date()) return true;
  return false;
};
