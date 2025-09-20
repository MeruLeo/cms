import jwt from "jsonwebtoken";
import config from "../config/config";
import { v4 as uuidv4 } from "uuid";

export const generateAccessToken = (userId: string) => {
  const payload = { userId };

  const options: jwt.SignOptions = {
    expiresIn: config.auth
      .accessExpiresIn as unknown as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign(payload, config.auth.accessSecret, options);
};

export const generateRefreshToken = (userId: string, jti?: string) => {
  const tokenId = jti || uuidv4();
  const payload = { userId, jti: tokenId, type: "refresh" };

  const options: jwt.SignOptions = {
    expiresIn: config.auth
      .refreshExpiresIn as unknown as jwt.SignOptions["expiresIn"],
  };

  return {
    token: jwt.sign(payload, config.auth.refreshSecret, options),
    jti: tokenId,
  };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.auth.accessSecret) as any;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.auth.refreshSecret) as any;
};
