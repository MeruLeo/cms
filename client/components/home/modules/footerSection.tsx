"use client";

import { UsersSection } from "./footer/userSection";
import { OrdersSection } from "./footer/orderSection";
import { TicketsSection } from "./footer/ticketSection";
import { IOrder } from "@/types/order.type";
import { IUser } from "@/types/user.type";

export function FooterSection({
  users,
  orders,
}: {
  users: IUser[];
  orders: IOrder[];
}) {
  return (
    <footer className="flex justify-between gap-2 w-full items-stretch">
      <UsersSection users={users} />
      <OrdersSection orders={orders} />
      <TicketsSection />
    </footer>
  );
}
