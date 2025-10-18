"use client";

import { create } from "zustand";
import {
  orderService,
  CreateOrderPayload,
  MonthlySalesResponse,
  FindOrdersOptions,
} from "@/services/order.service";
import { IOrder, OrderStatus } from "@/types/order.type";

interface OrderState {
  orders: IOrder[];
  selectedOrder: IOrder | null;
  totalRevenue: number;
  totalRevenueLoading: boolean;
  periodRevenue: number;
  periodRevenueLoading: boolean;
  monthlySales: MonthlySalesResponse[];
  countOrdersByUser: Record<string, number>;
  total: number;
  pages: number;
  loading: boolean;
  error: string | null;

  // actions
  setOrders: (orders: IOrder[]) => void;
  setSelectedOrder: (order: IOrder | null) => void;

  fetchMyOrders: () => Promise<void>;
  fetchAnotherUserOrders: (userId: string) => Promise<void>;
  fetchCountOrdersByUser: (userId: string) => Promise<void>;
  fetchAllOrders: (options: FindOrdersOptions) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  createOrder: (data: CreateOrderPayload) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  fetchTotalRevenue: () => Promise<void>;
  fetchPeriodRevenue: (
    period: "day" | "week" | "month" | "year"
  ) => Promise<void>;
  fetchMonthlySales: (year?: number) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  selectedOrder: null,
  totalRevenue: 0,
  totalRevenueLoading: false,
  periodRevenue: 0,
  periodRevenueLoading: false,
  monthlySales: [],
  countOrdersByUser: {},
  total: 0,
  pages: 0,
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.getOrdersByUser();
      set({ orders: res.data, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch user orders",
        loading: false,
      });
    }
  },

  fetchAnotherUserOrders: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.getOrdersByUser(userId);
      set({ orders: res.data, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch user orders",
        loading: false,
      });
    }
  },

  fetchCountOrdersByUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.countOrdersByUser(userId);
      set((state) => ({
        countOrdersByUser: {
          ...state.countOrdersByUser,
          [userId]: res.data,
        },
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch user orders",
        loading: false,
      });
    }
  },

  fetchAllOrders: async (options: FindOrdersOptions) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.findOrders(options);
      set({
        orders: res.data.orders,
        total: res.data.total,
        pages: res.data.pages,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch all orders",
        loading: false,
      });
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.findOrderById(id);
      set({ selectedOrder: res.data, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch order",
        loading: false,
      });
    }
  },

  createOrder: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.createOrder(data);
      set((state) => ({
        orders: [res.data, ...state.orders],
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create order",
        loading: false,
      });
      throw err;
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.updateOrderStatus(id, status);
      set((state) => ({
        orders: state.orders.map((o) => (o._id === id ? res.data : o)),
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update status",
        loading: false,
      });
    }
  },

  deleteOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      await orderService.deleteOrder(id);
      set((state) => ({
        orders: state.orders.filter((o) => o._id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete order",
        loading: false,
      });
    }
  },

  fetchTotalRevenue: async () => {
    set({ totalRevenueLoading: true, error: null });
    try {
      const res = await orderService.getTotalRevenue();
      set({ totalRevenue: res.data, totalRevenueLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch revenue",
        totalRevenueLoading: false,
      });
    }
  },

  fetchPeriodRevenue: async (period) => {
    set({ periodRevenueLoading: true, error: null });
    try {
      const res = await orderService.getRevenueByPeriod(period);
      set({ periodRevenue: res.data, periodRevenueLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch revenue",
        periodRevenueLoading: false,
      });
    }
  },

  fetchMonthlySales: async (year) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.getMonthlySales(year);
      set({ monthlySales: res.data, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch revenue",
        loading: false,
      });
    }
  },
}));
