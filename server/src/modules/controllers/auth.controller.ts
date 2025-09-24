import { Request, Response, NextFunction } from "express";
import registerSchema from "../../validators/auth/register";
import { craeteUser } from "../../services/auth/register.service";
import { AppError } from "../../middlewares/errorHandler";
import loginSchema from "../../validators/auth/login";
import { loginUser } from "../../services/auth/login.service";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";
import {
  isRefreshTokenRevoked,
  issueRefreshTokenForUser,
  revokeRefreshToken,
  rotateRefreshToken,
} from "../../services/auth/token.service";
import { getRefreshTokenCookieOptions } from "../../utils/cookies";
import { UserModel } from "../../models/User";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(
        new AppError(parsed.error.issues.map((i) => i.message).join(", "), 400)
      );
    }

    const user = await craeteUser(parsed.data);

    const accessToken = generateAccessToken(
      user._id.toString(),
      user.role,
      user.isActive
    );

    const { token: refreshToken } = await issueRefreshTokenForUser(
      user._id.toString()
    );

    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

    return res.status(201).json({
      ok: true,
      message: "User registered successfully",
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const user = await loginUser(parsed.data);

    const accessToken = generateAccessToken(
      user._id.toString(),
      user.role,
      user.isActive
    );

    const { token: refreshToken } = await issueRefreshTokenForUser(
      user._id.toString()
    );

    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

    return res.status(200).json({
      ok: true,
      message: "Login successful",
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ ok: false, message: "No refresh token" });
    }

    let payload: any;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid refresh token" });
    }

    const { jti, userId } = payload;
    if (!jti || !userId) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid token payload" });
    }

    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // check DB if token is revoked/exists
    const revoked = await isRefreshTokenRevoked(jti);
    if (revoked) {
      return res
        .status(401)
        .json({ ok: false, message: "Refresh token revoked or expired" });
    }

    // rotate: create new refresh token in DB and revoke old one
    const { token: newRefreshToken } = await rotateRefreshToken(jti, userId);

    // issue new access token
    const newAccessToken = generateAccessToken(
      user._id.toString(),
      user.role,
      user.isActive
    );

    // set new refresh cookie
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());

    return res.status(200).json({
      ok: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const payload: any =
          require("../../utils/jwt").verifyRefreshToken(refreshToken);
        const { jti } = payload;
        if (jti) {
          await revokeRefreshToken(jti);
        }
      } catch (err) {
        next(err);
      }
    }

    res.clearCookie("refreshToken", { path: "/" });
    return res.status(200).json({ ok: true, message: "Logged out" });
  } catch (err) {
    next(err);
  }
};
