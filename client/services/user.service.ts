import apiClient from "@/lib/axios";
import { IUser } from "@/types/user.type";

export interface UsersListResponse {
  items: IUser[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface UserResponse {
  ok: boolean;
  user: IUser;
}

export const userService = {
  getAllUsers: (params?: {
    username?: string;
    email?: string;
    role?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => apiClient.get<UsersListResponse>("/users", { params }),

  getMe: () => apiClient.get<UserResponse>("/users/me"),

  getUserById: (id: string) => apiClient.get<UserResponse>(`/users/${id}`),

  updateUser: (id: string, data: Partial<IUser>) =>
    apiClient.put<UserResponse>(`/users/${id}`, data),

  deleteUser: (id: string) =>
    apiClient.delete<{ ok: boolean; message: string }>(`/users/${id}`),

  changeUserStatus: (id: string, status: string) =>
    apiClient.patch<UserResponse>(`/users/${id}/status`, { status }),

  changeUserPassword: (id: string, hashedPassword: string) =>
    apiClient.patch<{ ok: boolean; message: string }>(`/users/${id}/password`, {
      hashedPassword,
    }),
};
