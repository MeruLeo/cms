"use client";

import { UsersSection } from "./footer/userSection";
import { OrdersSection } from "./footer/orderSection";
import { TicketsSection } from "./footer/ticketSection";
import { IOrder } from "@/types/order.type";
import { IUser } from "@/types/user.type";
import { ITicket } from "@/types/ticket.type";

export function FooterSection({
  users,
  orders,
  tickets,
}: {
  users: IUser[];
  orders: IOrder[];
  tickets: ITicket[];
}) {
  return (
    <footer className="flex justify-between gap-2 w-full items-stretch">
      <UsersSection users={users} />
      <OrdersSection orders={orders} />
      <TicketsSection tickets={tickets} />
    </footer>
  );
}
