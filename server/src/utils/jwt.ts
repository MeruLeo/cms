import jwt from "jsonwebtoken";
import config from "../config/config";

export const generateAccessToken = (userId: string) => {
  const options: jwt.SignOptions = {
    expiresIn: config.auth
      .accessExpiresIn as unknown as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign({ userId }, config.auth.accessSecret, options);
};
export const generateRefreshToken = (userId: string) => {
  const options: jwt.SignOptions = {
    expiresIn: config.auth
      .refreshExpiresIn as unknown as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign({ userId }, config.auth.refreshSecret, options);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.auth.accessSecret);
};
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.auth.refreshSecret);
};
