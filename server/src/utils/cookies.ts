import { CookieOptions } from "express";
import config from "../config/config";
import { parseDuration } from "./cookiesTime";

const isProd = process.env.NODE_ENV === "production";

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProd,
  sameSite: "strict",
  path: "/",
  maxAge: parseDuration(config.auth.accessExpiresIn),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProd,
  sameSite: "strict",
  path: "/",
  maxAge: parseDuration(config.auth.refreshExpiresIn),
});
