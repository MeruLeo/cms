"use client";

import { Chip } from "@heroui/chip";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface TicketPreviewProps {
  title: string;
  fullName: string;
  code: string;
  status: "open" | "in_progress" | "closed" | string;
  category: "order" | "payment" | "technical" | "general" | string;
  createdAt: any;
}

const statusMap: Record<
  TicketPreviewProps["status"],
  { label: string; color: "warning" | "danger" | "primary" }
> = {
  open: { label: "پاسخ داده نشده", color: "warning" },
  in_progress: { label: "در حال صحبت", color: "primary" },
  closed: { label: "بسته شده", color: "danger" },
};

const categoryMap: Record<
  TicketPreviewProps["category"],
  { labelC: string; colorC: "warning" | "success" | "primary" | "secondary" }
> = {
  order: { labelC: "پیگیری سفارش", colorC: "warning" },
  payment: { labelC: "مالی", colorC: "success" },
  technical: { labelC: "فنی", colorC: "secondary" },
  general: { labelC: "کلی", colorC: "primary" },
};

export const TicketPreview = ({
  title,
  fullName,
  code,
  category,
  status,
  createdAt,
}: TicketPreviewProps) => {
  const { label, color } = statusMap[status] ?? {
    label: "نامشخص",
    color: "danger",
  };

  const { labelC, colorC } = categoryMap[category] ?? {
    labelC: "نامشخص",
    colorC: "secondary",
  };

  const createdStr = createdAt
    ? new Date(createdAt).toLocaleString("fa-IR")
    : "";

  return (
    <li className="bg-gray3 p-3 gap-4 flex flex-col rounded-4xl">
      <header className="flex flex-col justify-between">
        <section className="text-xs text-default-500">{createdStr}</section>
        <section>
          <p className="text-xl font-bold mb-2">{title}</p>
          <p className="text-sm mb-2 text-gray">{code}</p>
          <Chip variant="flat" color={color}>
            {label}
          </Chip>
        </section>
      </header>
      <main className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-default-500 text-sm">گزارشگر</p>
          <p className="text-default-500 text-sm">دسته بندی</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs">{fullName}</span>
          <Chip variant="flat" color={colorC}>
            {labelC}
          </Chip>
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
