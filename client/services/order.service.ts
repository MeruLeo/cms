import apiClient from "@/lib/axios";
import { IOrder, OrderStatus } from "@/types/order.type";

export interface CreateOrderPayload {
  items: {
    productId: string;
    price: number;
    quantity: number;
  }[];
  shippingCost?: number;
  couponCode?: string;
}

export interface MonthlySalesResponse {
  month: number;
  sales: number;
}

export interface FindOrdersOptions {
  filters: {
    code?: string;
    userId?: string;
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
  };
  page: number;
  limit: number;
  sort: string;
}

export interface FindOrdersResponse {
  orders: IOrder[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const orderService = {
  createOrder: (data: CreateOrderPayload) =>
    apiClient.post<IOrder>("/orders", data),

  getOrdersByUser: (userId?: string) =>
    apiClient.get<IOrder[]>(`/orders/user${userId ? `/${userId}` : ""}`),

  countOrdersByUser: (userId: string) =>
    apiClient.get<number>(`/orders/user/${userId}/count`),

  findOrders: (options: FindOrdersOptions) =>
    apiClient.get<FindOrdersResponse>("/orders", {
      params: {
        ...options.filters,
        page: options.page,
        limit: options.limit,
        sort: options.sort,
      },
    }),

  findOrderById: (orderId: string) =>
    apiClient.get<IOrder>(`/orders/${orderId}`),

  updateOrderStatus: (orderId: string, status: OrderStatus) =>
    apiClient.patch<IOrder>(`/orders/${orderId}`, { status }),

  deleteOrder: (orderId: string) =>
    apiClient.delete<{ ok: boolean; message: string }>(`/orders/${orderId}`),

  getTotalRevenue: () => apiClient.get<number>("/orders/total-revenue"),

  getRevenueByPeriod: (period: "day" | "week" | "month" | "year") =>
    apiClient.get<number>(`/orders/revenue?period=${period}`),

  getMonthlySales: (year?: number) =>
    apiClient.get<MonthlySalesResponse[]>(`/orders/monthly-sales?year=${year}`),
};
