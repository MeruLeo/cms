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
  getCurrentUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setAccessToken: (token) =>
    set({
      accessToken: token,
      isAuthenticated: !!token,
    }),

  setUser: (user) =>
    set({
      user,
    }),

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
    set({ loading: true });
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
        error: null,
      });
    }
  },

  getCurrentUser: async () => {
    set({ loading: true });
    try {
      const res = await authService.getCurrentUser();
      set({ user: res.data.user, loading: false });
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      set({ loading: false });
    }
  },

  initialize: async () => {
    if (!useAuthStore.getState().accessToken) {
      set({ loading: true });
      try {
        const res = await authService.refreshToken();
        set({ accessToken: res.data.accessToken, isAuthenticated: true });
        await useAuthStore.getState().getCurrentUser();
      } catch (err) {
        console.error("Initialization failed:", err);
        useAuthStore.getState().logout();
      } finally {
        set({ loading: false });
      }
    }
  },
}));
