import { AppError } from "../../middlewares/errorHandler";
import { UserModel } from "../../models/User";
import bcrypt from "bcrypt";

interface LoginInput {
  identifier: string;
  password: string;
}

export const loginUser = async (input: LoginInput) => {
  const user = await UserModel.findOne({
    $or: [{ email: input.identifier }, { username: input.identifier }],
  });
  if (!user) {
    throw new AppError("Invalid email/username or password", 400);
  }

  const isValidPassword = await bcrypt.compare(input.password, user.password);
  if (!isValidPassword) {
    throw new AppError("Invalid email/username or password", 400);
  }

  const { password, ...userData } = user.toObject();
  return userData;
};
