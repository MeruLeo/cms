import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ ok: false, message: "No token provided" });
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid auth header" });
    }
    const token = parts[1];
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ ok: false, message: "Invalid or expired token" });
  }
};
