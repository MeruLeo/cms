import { Request, Response, NextFunction } from "express";
import registerSchema from "../../validators/auth/register";
import { craeteUser } from "../../services/auth/register";
import { AppError } from "../../middlewares/errorHandler";
import loginSchema from "../../validators/auth/login";
import { loginUser } from "../../services/auth/login";

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

    return res.status(201).json({
      ok: true,
      message: "User registered successfully",
      user,
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
    return res.status(200).json({
      ok: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};
