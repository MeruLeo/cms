import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string; isActive: boolean };
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

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid auth header" });
    }

    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      role: payload.role,
      isActive: payload.isActive,
    };

    if (!req.user.isActive) {
      console.log(req.user);
      return res
        .status(401)
        .json({ ok: false, message: "Account is deactivated" });
    }

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ ok: false, message: "Invalid or expired token" });
  }
};
