"use client";

import { ChevronLeft, Ticket } from "lucide-react";
import Link from "next/link";
import AnimatedList from "@/components/animatedList";
import {
  TicketPreview,
  TicketPreviewProps,
} from "@/components/home/ticketPreview";
import { ITicket } from "@/types/ticket.type";

export function TicketsSection({ tickets }: { tickets: ITicket[] }) {
  return (
    <section className="bg-gray4 w-full p-4 rounded-4xl">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <Ticket className="w-5 h-5 text-gray" />
          <h4 className="text-xl text-gray">تیکت های اخیر</h4>
        </div>
        <Link
          href="/"
          className="flex bg-gray3 items-center text-xs p-2 rounded-full"
        >
          مشاهده همه
          <ChevronLeft className="size-5" />
        </Link>
      </header>
      <AnimatedList
        items={tickets}
        renderItem={(ticket, index) => (
          <TicketPreview
            title={ticket.title}
            category={ticket.category}
            code={ticket.code}
            createdAt={ticket.createdAt}
            fullName={ticket.user.fullName}
            status={ticket.status}
            key={index}
          />
        )}
        onItemSelect={(ticket) => console.log("انتخاب شد:", ticket)}
        displayScrollbar={false}
      />
    </section>
  );
}
