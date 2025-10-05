import { Types } from "mongoose";
import { AppError } from "../middlewares/errorHandler";
import { CreditCardModel } from "../models/CreditCard";
import { createCreditCardSchema } from "../validators/creditCard.schema";

export const creditCardService = {
  async createCard(data: any, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid userId");
    }

    const isNumUnique = async (num: string) => {
      const exists = await CreditCardModel.exists({ num });
      return !exists;
    };
    const validator = createCreditCardSchema(isNumUnique);
    const validated = await validator.parseAsync(data);

    if (validated.isActive) {
      await CreditCardModel.updateMany(
        { owner: userId },
        { $set: { isActive: false } }
      );
    }

    const card = await CreditCardModel.create({
      ...validated,
      owner: userId,
    });

    return card.toObject();
  },

  async getCardsByUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) return [];
    return await CreditCardModel.find({ owner: userId })
      .sort({ createdAt: -1 })
      .lean();
  },

  async findCardById(cardId: string) {
    if (!Types.ObjectId.isValid(cardId)) return null;
    return await CreditCardModel.findById(cardId).lean();
  },

  async updateCard(
    cardId: string,
    data: Partial<{ num: string; isActive: boolean }>
  ) {
    if (!Types.ObjectId.isValid(cardId)) return null;

    const card = await CreditCardModel.findById(cardId);
    if (!card) throw new AppError("Card not found");

    if (data.isActive === true) {
      await CreditCardModel.updateMany(
        { owner: card.owner },
        { $set: { isActive: false } }
      );
    }

    Object.assign(card, data);
    await card.save();
    return card.toObject();
  },

  async deleteCard(cardId: string) {
    if (!Types.ObjectId.isValid(cardId)) return null;
    return await CreditCardModel.findByIdAndDelete(cardId).lean();
  },

  async getActiveCard(userId: string) {
    if (!Types.ObjectId.isValid(userId)) return null;
    return await CreditCardModel.findOne({
      owner: userId,
      isActive: true,
    }).lean();
  },
};
