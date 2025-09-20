import { AppError } from "../../middlewares/errorHandler";
import { UserModel } from "../../models/User";
import bcrypt from "bcrypt";

interface CreateUserInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export const craeteUser = async (input: CreateUserInput) => {
  const existingUser = await UserModel.findOne({
    $or: [{ email: input.email }, { username: input.username }],
  });
  if (existingUser) {
    throw new AppError("Email or username already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await UserModel.create({
    ...input,
    password: hashedPassword,
  });

  const { password, ...userData } = user.toObject();
  return userData;
};
