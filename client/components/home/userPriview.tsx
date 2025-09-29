"use client";

import { formatNumber } from "@/utils/persianNumber";
import { Chip } from "@heroui/chip";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UserPreviewProps {
  fullName: string;
  email: string;
  countOfBuys: number;
  createdAt: string;
}

interface UserPreviewProps {
  fullName: string;
  email: string;
  countOfBuys: number;
  createdAt: string;
}

export const UserPreview = ({
  fullName,
  email,
  countOfBuys,
  createdAt,
}: UserPreviewProps) => {
  return (
    <li className="bg-gray3 p-3 gap-4 flex flex-col rounded-4xl">
      <header className="flex justify-between">
        <section>
          <p className="text-xl font-bold mb-2">{fullName}</p>
          <Chip variant="faded">{email}</Chip>
        </section>
        <section className="text-xs text-default-500">{createdAt}</section>
      </header>
      <main className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-default-500 text-sm">خرید موفق</p>
          <p className="text-default-500 text-sm">تیکت ها</p>
        </div>
        <div className="flex flex-col gap-2">
          <Chip size="lg" color="success" variant="flat">
            {formatNumber("5", "price")}
          </Chip>
          <Chip size="lg" color="warning" variant="flat">
            {formatNumber("9", "price")}
          </Chip>
        </div>
      </main>
      <footer>
        <Link
          href={`/`}
          className="flex justify-center items-center gap-2 bg-foreground text-background p-2 rounded-full w-full"
        >
          سوابق
          <ArrowLeft />
        </Link>
      </footer>
    </li>
  );
};
