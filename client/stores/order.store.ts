"use client";

import { create } from "zustand";
import { orderService, CreateOrderPayload } from "@/services/order.service";
import { IOrder, OrderStatus } from "@/types/order.type";

interface OrderState {
  orders: IOrder[];
  selectedOrder: IOrder | null;
  totalRevenue: number;
  periodRevenue: number;
  loading: boolean;
  error: string | null;

  // actions
  setOrders: (orders: IOrder[]) => void;
  setSelectedOrder: (order: IOrder | null) => void;

  fetchMyOrders: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  createOrder: (data: CreateOrderPayload) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  fetchTotalRevenue: () => Promise<void>;
  fetchPeriodRevenue: (
    period: "day" | "week" | "month" | "year"
  ) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  selectedOrder: null,
  totalRevenue: 0,
  periodRevenue: 0,
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.getMyOrders();
      set({ orders: res.data.orders, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch user orders",
        loading: false,
      });
    }
  },

  fetchAllOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.getAllOrders();
      set({ orders: res.data.orders, loading: false });
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
      const res = await orderService.getOrderById(id);
      set({ selectedOrder: res.data.order, loading: false });
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
        orders: [res.data.order, ...state.orders],
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
        orders: state.orders.map((o) => (o._id === id ? res.data.order : o)),
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
    set({ loading: true, error: null });
    try {
      const res = await orderService.getTotalRevenue();
      set({ totalRevenue: res.data.total, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch revenue",
        loading: false,
      });
    }
  },

  fetchPeriodRevenue: async (period) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.getRevenueByPeriod(period);
      set({ periodRevenue: res.data.total, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch revenue",
        loading: false,
      });
    }
  },
}));
