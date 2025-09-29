"use client";

import { Chart } from "@/components/home/chart";
import { Actions } from "@/components/home/actions";
import { HeaderWidget } from "@/components/home/header.widget";
import { widgetConfig } from "@/config/home/widget.config";
import {
  ChartNoAxesColumn,
  ChevronLeft,
  Component,
  Ticket,
  Truck,
  UsersRound,
} from "lucide-react";
import { UserPreview } from "@/components/home/userPriview";
import AnimatedList from "@/components/animatedList";
import Link from "next/link";
import {
  OrderPreview,
  OrderPreviewProps,
} from "@/components/home/orderPreview";
import {
  TicketPreview,
  TicketPreviewProps,
} from "@/components/home/ticketPreview";

export default function Home() {
  const users = [
    {
      fullName: "علی رضایی",
      email: "ali@example.com",
      countOfBuys: 12,
      createdAt: "1402/07/01",
    },
    {
      fullName: "مریم محمدی",
      email: "maryam@example.com",
      countOfBuys: 5,
      createdAt: "1401/12/10",
    },
    {
      fullName: "مریم محمدی",
      email: "maryam@example.com",
      countOfBuys: 5,
      createdAt: "1401/12/10",
    },
    {
      fullName: "مریم محمدی",
      email: "maryam@example.com",
      countOfBuys: 5,
      createdAt: "1401/12/10",
    },
    {
      fullName: "مریم محمدی",
      email: "maryam@example.com",
      countOfBuys: 5,
      createdAt: "1401/12/10",
    },
  ];

  const orders: OrderPreviewProps[] = [
    {
      fullName: "امیرعلی الله وردی",
      code: "AM1404",
      createdAt: "1404/06/22",
      amount: 12_000_000,
      status: "pending",
    },
    {
      fullName: "امیرعلی الله وردی",
      code: "AM1404",
      createdAt: "1404/06/22",
      amount: 12_000_000,
      status: "delivered",
    },
    {
      fullName: "امیرعلی الله وردی",
      code: "AM1404",
      createdAt: "1404/06/22",
      amount: 12_000_000,
      status: "processing",
    },
    {
      fullName: "امیرعلی الله وردی",
      code: "AM1404",
      createdAt: "1404/06/22",
      amount: 12_000_000,
      status: "shipped",
    },
    {
      fullName: "امیرعلی الله وردی",
      code: "AM1404",
      createdAt: "1404/06/22",
      amount: 12_000_000,
      status: "canceled",
    },
  ];

  const tickets: TicketPreviewProps[] = [
    {
      category: "general",
      code: "Af56L",
      createdAt: "1404/07/22",
      fullName: "هستی اثنی عشری",
      status: "closed",
    },
    {
      category: "order",
      code: "Af56L",
      createdAt: "1404/07/22",
      fullName: "هستی اثنی عشری",
      status: "in_progress",
    },
    {
      category: "payment",
      code: "Af56L",
      createdAt: "1404/07/22",
      fullName: "هستی اثنی عشری",
      status: "open",
    },
    {
      category: "technical",
      code: "Af56L",
      createdAt: "1404/07/22",
      fullName: "هستی اثنی عشری",
      status: "open",
    },
  ];

  return (
    <section className="flex w-full overflow-auto h-fit flex-col items-center justify-center gap-2 py-5 px-4">
      <header className="w-full">
        <ul className="flex w-full gap-2 justify-between">
          {widgetConfig.map((w) => (
            <HeaderWidget key={w.header.title} {...w} />
          ))}
        </ul>
      </header>
      <main className="flex justify-between gap-2 w-full items-stretch">
        <section className="bg-gray4 p-4 rounded-4xl">
          <div className="flex items-center gap-2 mb-4">
            <ChartNoAxesColumn className="w-5 h-5 text-gray" />
            <h4 className="text-xl text-gray">آنالیز فروش سالانه</h4>
          </div>
          <Chart />
        </section>
        <section className="bg-gray4 p-4 rounded-4xl">
          <div className="flex items-center gap-2 mb-4">
            <Component className="w-5 h-5 text-gray" />
            <h4 className="text-xl text-gray">دسترسی سریع</h4>
          </div>
          <Actions />
        </section>
      </main>
      <footer className="flex justify-between gap-2 w-full items-stretch">
        <section className="bg-gray4 w-full p-4 rounded-4xl">
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-2 mb-4">
              <UsersRound className="w-5 h-5 text-gray" />
              <h4 className="text-xl text-gray">مشریان جدید</h4>
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
            items={users}
            renderItem={(user, index, selected) => <UserPreview {...user} />}
            onItemSelect={(user) => console.log("انتخاب شد:", user)}
            displayScrollbar={false}
          />
        </section>
        <section className="bg-gray4 w-full p-4 rounded-4xl">
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-gray" />
              <h4 className="text-xl text-gray">سفارش های اخیر</h4>
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
            items={orders}
            renderItem={(order, index, selected) => <OrderPreview {...order} />}
            onItemSelect={(order) => console.log("انتخاب شد:", order)}
            displayScrollbar={false}
          />
        </section>
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
            renderItem={(ticket, index, selected) => (
              <TicketPreview {...ticket} />
            )}
            onItemSelect={(ticket) => console.log("انتخاب شد:", ticket)}
            displayScrollbar={false}
          />
        </section>
      </footer>
    </section>
  );
}
