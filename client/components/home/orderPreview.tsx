"use client";

import { formatNumber } from "@/utils/persianNumber";
import { Chip } from "@heroui/chip";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type KnownStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled"
  | "paid";

export interface OrderPreviewProps {
  fullName: string;
  code: string;
  // اجازه بده هر رشته‌ای از API بیاد، اما KnownStatus رو هم تعریف کردیم
  status: KnownStatus | string;
  amount: number;
  createdAt: any;
}

const statusMap: Record<
  string,
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
  paid: { label: "پرداخت شده", color: "success" }, // اضافه شده
  unknown: { label: "نامشخص", color: "secondary" },
};

export const OrderPreview = ({
  fullName,
  code,
  amount,
  status,
  createdAt,
}: OrderPreviewProps) => {
  const key = (status ?? "unknown").toString().toLowerCase();
  const { label, color } = statusMap[key] ?? statusMap["unknown"];

  const createdStr = createdAt
    ? new Date(createdAt).toLocaleString("fa-IR")
    : "";

  return (
    <li className="bg-gray3 p-3 gap-4 flex flex-col rounded-4xl">
      <header className="flex flex-col justify-between">
        <section className="text-xs text-default-500">{createdStr}</section>
        <section>
          <p className="text-lg font-bold mb-2">{code}</p>
          <Chip variant="flat" color={color}>
            {label}
          </Chip>
        </section>
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
