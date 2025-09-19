import { Request, Response } from "express";
import registerSchema from "../../validators/auth/register";
import { UserModel } from "../../models/User";
import bcrypt from "bcrypt";

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

    const { email, fullName, password, username } = parsed.data;

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: "Email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      ok: true,
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};
