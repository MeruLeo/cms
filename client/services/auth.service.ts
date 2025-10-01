import apiClient from "@/lib/axios";
import { IUser } from "@/types/user.type";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  ok: boolean;
  message: string;
  user: IUser;
  accessToken: string;
}

export const authService = {
  register: (data: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", data),

  login: (data: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", data),

  refreshToken: () =>
    apiClient.post<{ ok: boolean; accessToken: string }>("/auth/refresh", {}),

  logout: () =>
    apiClient.post<{ ok: boolean; message: string }>("/auth/logout"),

  getCurrentUser: () => apiClient.get<{ user: IUser }>("/users/me"),
};
