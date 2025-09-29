"use client";

import { Chip } from "@heroui/chip";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import GradualBlurMemo from "../gradualBlur";

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
    <li className="bg-gray3 p-3 rounded-3xl">
      <header className="flex gap-8 justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">{fullName}</p>
          <Chip variant="faded">{email}</Chip>
        </div>
        <Chip variant="bordered" className="text-zinc- text-xs">
          عضو شده در
          {createdAt}
        </Chip>
      </header>
      <footer className="flex mt-4 justify-between items-center">
        <Chip variant="dot" color="success">
          خرید موفق: {countOfBuys}
        </Chip>
        <Link
          href={`/`}
          className="flex items-center gap-2 bg-foreground text-background p-2 rounded-full"
        >
          سوابق
          <ArrowLeft />
        </Link>
      </footer>
    </li>
  );
};

export const UsersPreview = () => {
  return (
    <>
      <ul className="w-full h-[350px] overflow-auto flex flex-col gap-2">
        <UserPreview
          countOfBuys={5}
          createdAt="1404/07/07"
          email="amirali@gmail.com"
          fullName="امیرعلی الله وردی"
        />
        <UserPreview
          countOfBuys={5}
          createdAt="1404/07/07"
          email="amirali@gmail.com"
          fullName="امیرعلی الله وردی"
        />
        <UserPreview
          countOfBuys={5}
          createdAt="1404/07/07"
          email="amirali@gmail.com"
          fullName="امیرعلی الله وردی"
        />
        <UserPreview
          countOfBuys={5}
          createdAt="1404/07/07"
          email="amirali@gmail.com"
          fullName="امیرعلی الله وردی"
        />
        <UserPreview
          countOfBuys={5}
          createdAt="1404/07/07"
          email="amirali@gmail.com"
          fullName="امیرعلی الله وردی"
        />
      </ul>
    </>
  );
};
