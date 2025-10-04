import apiClient from "@/lib/axios";
import { ITicket, TicketStatus, TicketPriority } from "@/types/ticket.type";

export interface CreateTicketPayload {
  title: string;
  description: string;
  category: string;
  priority?: TicketPriority;
}

export interface TicketResponse {
  ok: boolean;
  message: string;
  ticket: ITicket;
}

export interface GetTicketsParams {
  userId?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  page?: number;
  limit?: number;
}

export interface GetTicketsResponse {
  tickets: ITicket[];
  total: number;
}

export interface AddMessagePayload {
  message: string;
}

export const ticketService = {
  createTicket: (data: CreateTicketPayload) =>
    apiClient.post<TicketResponse>("/tickets", data),

  getTickets: (params: GetTicketsParams) => {
    const queryString = new URLSearchParams({
      ...(params.userId && { userId: params.userId }),
      ...(params.status && { status: params.status }),
      ...(params.priority && { priority: params.priority }),
      ...(params.category && { category: params.category }),
      ...(params.page && { page: params.page.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
    }).toString();

    return apiClient.get<GetTicketsResponse>(`/tickets?${queryString}`);
  },

  //todo
  getMyTickets: () => apiClient.get<GetTicketsResponse>("/tickets/my"),

  getTicketById: (ticketId: string) =>
    apiClient.get<{ ticket: ITicket }>(`/tickets/${ticketId}`),

  addMessageToTicket: (ticketId: string, data: AddMessagePayload) =>
    apiClient.post<TicketResponse>(`/tickets/${ticketId}`, data),

  updateTicketStatus: (ticketId: string, status: TicketStatus) =>
    apiClient.patch<{ ticket: ITicket }>(`/tickets/${ticketId}/status`, {
      status,
    }),

  updateTicketPriority: (ticketId: string, priority: TicketPriority) =>
    apiClient.patch<{ ticket: ITicket }>(`/tickets/${ticketId}/priority`, {
      priority,
    }),

  deleteTicket: (ticketId: string) =>
    apiClient.delete<{ ok: boolean; message: string }>(`/tickets/${ticketId}`),
};
