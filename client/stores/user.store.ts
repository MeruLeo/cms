"use client";

import { create } from "zustand";
import { userService } from "@/services/user.service";
import { IUser } from "@/types/user.type";

interface UserState {
  users: IUser[];
  selectedUser: IUser | null;
  me: IUser | null;
  total: number;
  pages: number;
  loading: boolean;
  error: string | null;

  // actions
  setUsers: (users: IUser[]) => void;
  setSelectedUser: (user: IUser | null) => void;

  fetchAllUsers: (params?: any) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  updateUser: (id: string, data: Partial<IUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  changeUserStatus: (id: string, status: string) => Promise<void>;
  changeUserPassword: (id: string, hashedPassword: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  selectedUser: null,
  me: null,
  total: 0,
  pages: 0,
  loading: false,
  error: null,

  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchAllUsers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await userService.getAllUsers(params);
      set({
        users: res.data.items,
        total: res.data.total,
        pages: res.data.pages,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch users",
        loading: false,
      });
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await userService.getUserById(id);
      set({ selectedUser: res.data.user, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch user",
        loading: false,
      });
    }
  },

  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const res = await userService.getMe();
      set({ me: res.data.user, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch profile",
        loading: false,
      });
    }
  },

  updateUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await userService.updateUser(id, data);
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? res.data.user : u)),
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update user",
        loading: false,
      });
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await userService.deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete user",
        loading: false,
      });
    }
  },

  changeUserStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const res = await userService.changeUserStatus(id, status);
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? res.data.user : u)),
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to change user status",
        loading: false,
      });
    }
  },

  changeUserPassword: async (id, hashedPassword) => {
    set({ loading: true, error: null });
    try {
      await userService.changeUserPassword(id, hashedPassword);
      set({ loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to change password",
        loading: false,
      });
    }
  },
}));
