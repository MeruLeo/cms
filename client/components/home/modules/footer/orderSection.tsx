"use client";

import { ChevronLeft, Truck } from "lucide-react";
import Link from "next/link";
import AnimatedList from "@/components/animatedList";
import { OrderPreview } from "@/components/home/orderPreview";
import { IOrder } from "@/types/order.type";

export function OrdersSection({ orders }: { orders: IOrder[] }) {
  return (
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
        renderItem={(order, index) => (
          <OrderPreview
            amount={order.totalAmount}
            code={order.code}
            createdAt={order.createdAt}
            fullName={order.user.fullName}
            status={order.status}
            key={index}
          />
        )}
        onItemSelect={(order) => console.log("انتخاب شد:", order)}
        displayScrollbar={false}
      />
    </section>
  );
}
