export interface IUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
