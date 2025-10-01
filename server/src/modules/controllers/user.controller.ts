import { NextFunction, Request, Response } from "express";
import * as userService from "../../services/user.service";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = "1",
      limit = "20",
      sort = "-createdAt",
      ...filters
    } = req.query;

    const result = await userService.findUsers({
      filters,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: sort as string,
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await userService.findUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId as string;
    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
