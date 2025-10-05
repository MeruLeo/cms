import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../../middlewares/errorHandler";
import { creditCardService } from "../../services/creditCard.service";
import { createCreditCardSchema } from "../../validators/creditCard.schema";
import { CreditCardModel } from "../../models/CreditCard";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await CreditCardModel.find()
      .populate("owner", "username email")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ cards });
  } catch (error) {
    next(error);
  }
};

export const getByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError("User not authenticated", 401));

    const cards = await creditCardService.getCardsByUser(userId);
    return res.json(cards);
  } catch (error) {
    next(error);
  }
};

export const getActiveByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError("User not authenticated", 401));

    const active = await creditCardService.getActiveCard(userId);
    return res.json(active);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(new AppError("Invalid card id", 400));

    const card = await creditCardService.findCardById(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    return res.json(card);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError("User not authenticated", 401));

    const isNumUnique = async (num: string) => {
      const exists = await CreditCardModel.exists({ num });
      return !exists;
    };
    const schema = createCreditCardSchema(isNumUnique);
    const parsed = await schema.safeParseAsync(req.body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      return next(new AppError(errors.join(", "), 400));
    }

    const card = await creditCardService.createCard(parsed.data, userId);

    return res.status(201).json({
      message: "Card created successfully",
      data: card,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(new AppError("Invalid card id", 400));

    const updated = await creditCardService.updateCard(id, req.body);

    if (!updated) return res.status(404).json({ message: "Card not found" });

    return res.json({
      message: "Card updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(new AppError("Invalid card id", 400));

    const deleted = await creditCardService.deleteCard(id);
    if (!deleted) return res.status(404).json({ message: "Card not found" });

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    next(error);
  }
};
