import { FilterQuery, UpdateQuery } from "mongoose";
import { UserModel } from "../models/User";
import { IUser } from "../types/user.type";

interface FindUsersOptions {
  filters: {
    username?: string;
    email?: string;
    role?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  };
  page: number;
  limit: number;
  sort: string;
}

export const findUsers = async ({
  filters,
  page,
  limit,
  sort,
}: FindUsersOptions) => {
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;
  const skip = (safePage - 1) * safeLimit;

  const query: FilterQuery<IUser> = {};

  if (filters.username) {
    query.username = { $regex: filters.username, $options: "i" };
  }
  if (filters.email) {
    query.email = { $regex: filters.email, $options: "i" };
  }
  if (filters.role) query.role = filters.role;
  if (filters.status) query.status = filters.status;

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.createdAt.$lte = new Date(filters.endDate);
    }
  }

  const [items, total] = await Promise.all([
    UserModel.find(query)
      .select("-password -__v")
      .sort(sort)
      .skip(skip)
      .limit(safeLimit),
    UserModel.countDocuments(query),
  ]);

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    pages: Math.ceil(total / safeLimit),
  };
};

export const findUserById = async (id: string) => {
  return UserModel.findById(id).select("-password -__v");
};

export const updateUser = async (id: string, data: UpdateQuery<IUser>) => {
  return UserModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password -__v");
};

export const deleteUser = async (id: string) => {
  return UserModel.findByIdAndDelete(id);
};

export const changeUserStatus = async (id: string, status: string) => {
  return UserModel.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).select("-password -__v");
};

export const changeUserPassword = async (
  id: string,
  hashedPassword: string
) => {
  return UserModel.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true }
  );
};
