import { model, Schema } from "mongoose";
import { ICreditCard } from "../types/creditCard.type";

const creditCardSchema = new Schema<ICreditCard>(
  {
    owner: { type: String, required: true },
    num: { type: String, required: true, unique: true },
    isActive: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export const CreditCardModel = model<ICreditCard>(
  "CreditCard",
  creditCardSchema
);
