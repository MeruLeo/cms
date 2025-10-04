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

export interface OrderResponse {
  ok: boolean;
  message: string;
  order: IOrder;
}

export interface MonthlySalesResponse {
  month: number;
  sales: number;
}

export const orderService = {
  createOrder: (data: CreateOrderPayload) =>
    apiClient.post<OrderResponse>("/orders", data),

  getMyOrders: () => apiClient.get<{ orders: IOrder[] }>("/orders/user"),

  getAnotherOrders: (userId: string) =>
    apiClient.get<{ orders: IOrder[] }>(`/orders/user/${userId}`),

  getOrdersCountByUser: (userId: string) =>
    apiClient.get<{ count: number }>(`/orders/user/${userId}/count`),

  getAllOrders: () => apiClient.get<{ orders: IOrder[] }>("/orders"),

  getOrderById: (orderId: string) =>
    apiClient.get<{ order: IOrder }>(`/orders/${orderId}`),

  updateOrderStatus: (orderId: string, status: OrderStatus) =>
    apiClient.patch<{ order: IOrder }>(`/orders/${orderId}`, { status }),

  deleteOrder: (orderId: string) =>
    apiClient.delete<{ ok: boolean; message: string }>(`/orders/${orderId}`),

  getTotalRevenue: () =>
    apiClient.get<{ total: number }>("/orders/total-revenue"),

  getRevenueByPeriod: (period: "day" | "week" | "month" | "year") =>
    apiClient.get<{ total: number }>(`/orders/revenue?period=${period}`),

  getMonthlySalesHandler: (year?: number) =>
    apiClient.get<MonthlySalesResponse[]>(`/orders/monthly-sales?year=${year}`),
};
