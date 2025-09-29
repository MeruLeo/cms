"use client";

import { formatNumber } from "@/utils/persianNumber";
import { Chip } from "@heroui/chip";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface OrderPreviewProps {
  fullName: string;
  code: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
  amount: number;
  createdAt: string;
}

const statusMap: Record<
  OrderPreviewProps["status"],
  {
    label: string;
    color: "success" | "warning" | "danger" | "primary" | "secondary";
  }
> = {
  pending: { label: "در انتظار", color: "warning" },
  processing: { label: "در حال پردازش", color: "primary" },
  shipped: { label: "ارسال شده", color: "secondary" },
  delivered: { label: "تحویل داده شد", color: "success" },
  canceled: { label: "لغو شده", color: "danger" },
};

export const OrderPreview = ({
  fullName,
  code,
  amount,
  status,
  createdAt,
}: OrderPreviewProps) => {
  const { label, color } = statusMap[status];

  return (
    <li className="bg-gray3 p-3 gap-4 flex flex-col rounded-4xl">
      <header className="flex justify-between">
        <section>
          <p className="text-xl font-bold mb-2">{code}</p>
          <Chip variant="flat" color={color}>
            {label}
          </Chip>
        </section>
        <section className="text-xs text-default-500">{createdAt}</section>
      </header>
      <main className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-default-500 text-sm">سفارش دهنده</p>
          <p className="text-default-500 text-sm">مبلغ</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs">{fullName}</span>
          <span className="text-xs">{formatNumber(amount, "price")}</span>
        </div>
      </main>
      <footer>
        <Link
          href={`/`}
          className="flex justify-center items-center gap-2 bg-foreground text-background p-2 rounded-full w-full"
        >
          مشاهده
          <ArrowLeft />
        </Link>
      </footer>
    </li>
  );
};
