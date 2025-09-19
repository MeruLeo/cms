import { Request, Response } from "express";
import registerSchema from "../../validators/auth/register";
import { UserModel } from "../../models/User";
import bcrypt from "bcrypt";
import { craeteUser } from "../../services/auth/register";

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const user = craeteUser(parsed.data);

    return res.status(201).json({
      ok: true,
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};
