"use client";

import { create } from "zustand";
import {
  ticketService,
  CreateTicketPayload,
  GetTicketsParams,
} from "@/services/ticket.service";
import { ITicket, TicketStatus, TicketPriority } from "@/types/ticket.type";

interface TicketState {
  tickets: ITicket[];
  selectedTicket: ITicket | null;
  countTicketsByUser: Record<string, number>;
  loading: boolean;
  error: string | null;

  // actions
  setTickets: (tickets: ITicket[]) => void;
  setSelectedTicket: (ticket: ITicket | null) => void;

  fetchMyTickets: () => Promise<void>;
  fetchAnotherUserTickets: (userId: string) => Promise<void>;
  fetchCountTicketsByUser: (userId: string) => Promise<void>;
  fetchAllTickets: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  createTicket: (data: CreateTicketPayload) => Promise<void>;
  updateTicketStatus: (id: string, status: TicketStatus) => Promise<void>;
  updateTicketPriority: (id: string, priority: TicketPriority) => Promise<void>;
  addMessage: (id: string, message: string) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
}

export const useTicketStore = create<TicketState>((set) => ({
  tickets: [],
  selectedTicket: null,
  countTicketsByUser: {},
  loading: false,
  error: null,

  setTickets: (tickets) => set({ tickets }),
  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),

  fetchMyTickets: async () => {
    set({ loading: true, error: null });
    try {
      const res = await ticketService.getMyTickets();
      set({ tickets: res.data.tickets, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch user tickets",
        loading: false,
      });
    }
  },

  fetchAnotherUserTickets: async (userId) => {
    set({ loading: true, error: null });
    try {
      const params: GetTicketsParams = { userId };
      const res = await ticketService.getTickets(params);
      set({ tickets: res.data.tickets, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch user tickets",
        loading: false,
      });
    }
  },

  fetchCountTicketsByUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      const params: GetTicketsParams = { userId, limit: 0 };
      const res = await ticketService.getTickets(params);
      set((state) => ({
        countTicketsByUser: {
          ...state.countTicketsByUser,
          [userId]: res.data.total,
        },
        loading: false,
      }));
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || "Failed to fetch user tickets count",
        loading: false,
      });
    }
  },

  fetchAllTickets: async () => {
    set({ loading: true, error: null });
    try {
      const res = await ticketService.getTickets({});
      set({ tickets: res.data.tickets, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch all tickets",
        loading: false,
      });
    }
  },

  fetchTicketById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await ticketService.getTicketById(id);
      set({ selectedTicket: res.data.ticket, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch ticket",
        loading: false,
      });
    }
  },

  createTicket: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await ticketService.createTicket(data);
      set((state) => ({
        tickets: [res.data.ticket, ...state.tickets],
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create ticket",
        loading: false,
      });
      throw err;
    }
  },

  updateTicketStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const res = await ticketService.updateTicketStatus(id, status);
      set((state) => ({
        tickets: state.tickets.map((t) => (t._id === id ? res.data.ticket : t)),
        selectedTicket:
          state.selectedTicket?._id === id
            ? res.data.ticket
            : state.selectedTicket,
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update status",
        loading: false,
      });
    }
  },

  updateTicketPriority: async (id, priority) => {
    set({ loading: true, error: null });
    try {
      const res = await ticketService.updateTicketPriority(id, priority);
      set((state) => ({
        tickets: state.tickets.map((t) => (t._id === id ? res.data.ticket : t)),
        selectedTicket:
          state.selectedTicket?._id === id
            ? res.data.ticket
            : state.selectedTicket,
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update priority",
        loading: false,
      });
    }
  },

  addMessage: async (id, message) => {
    set({ loading: true, error: null });
    try {
      const res = await ticketService.addMessageToTicket(id, { message });
      set((state) => ({
        tickets: state.tickets.map((t) => (t._id === id ? res.data.ticket : t)),
        selectedTicket:
          state.selectedTicket?._id === id
            ? res.data.ticket
            : state.selectedTicket,
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to add message",
        loading: false,
      });
    }
  },

  deleteTicket: async (id) => {
    set({ loading: true, error: null });
    try {
      await ticketService.deleteTicket(id);
      set((state) => ({
        tickets: state.tickets.filter((t) => t._id !== id),
        selectedTicket:
          state.selectedTicket?._id === id ? null : state.selectedTicket,
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete ticket",
        loading: false,
      });
    }
  },
}));
