"use client";

import { formatNumber } from "@/utils/persianNumber";
import { Chip } from "@heroui/chip";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface TicketPreviewProps {
  fullName: string;
  code: string;
  status: "open" | "in_progress" | "closed";
  category: "order" | "payment" | "technical" | "general";
  createdAt: string;
}

const statusMap: Record<
  TicketPreviewProps["status"],
  {
    label: string;
    color: "warning" | "danger" | "primary";
  }
> = {
  open: { label: "پاسخ داده نشده", color: "warning" },
  in_progress: { label: "در حال صحبت", color: "primary" },
  closed: { label: "بسته شده", color: "danger" },
};

const categoryMap: Record<
  TicketPreviewProps["category"],
  {
    labelC: string;
    colorC: "warning" | "success" | "primary" | "secondary";
  }
> = {
  order: { labelC: "پیگیری سفارش", colorC: "warning" },
  payment: { labelC: "مالی", colorC: "success" },
  technical: { labelC: "فنی", colorC: "secondary" },
  general: { labelC: "کلی", colorC: "primary" },
};

export const TicketPreview = ({
  fullName,
  code,
  category,
  status,
  createdAt,
}: TicketPreviewProps) => {
  const { label, color } = statusMap[status];
  const { labelC, colorC } = categoryMap[category];

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
