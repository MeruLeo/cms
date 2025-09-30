"use client";

import { create } from "zustand";
import { IUser } from "@/types/user.type";
import {
  authService,
  LoginPayload,
  RegisterPayload,
} from "@/services/auth.service";

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // actions
  setAccessToken: (token: string | null) => void;
  setUser: (user: IUser | null) => void;
  register: (data: RegisterPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setAccessToken: (token) => {
    set((state) => ({
      ...state,
      accessToken: token,
      isAuthenticated: !!token,
    }));
  },

  setUser: (user) => {
    set((state) => ({
      ...state,
      user,
    }));
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.register(data);
      set({
        user: res.data.user,
        accessToken: res.data.accessToken,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Registration failed",
        loading: false,
      });
      throw err;
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.login(data);
      console.log(res);
      set({
        user: res.data.user,
        accessToken: res.data.accessToken,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Login failed",
        loading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));
