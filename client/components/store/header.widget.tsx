import { formatNumber } from "@/utils/persianNumber";
import Link from "next/link";
import React from "react";

export interface HeaderWidgetStoreProps {
  title: string;
  value: string | number;
  link: string;
  bg: string;
  icon: React.ReactNode;
}

export const HeaderWidgetStore = ({
  title,
  value,
  link,
  icon,
  bg,
}: HeaderWidgetStoreProps) => {
  return (
    <li
      className={`${bg} w-full transition-all duration-200 hover:scale-95 p-4 rounded-4xl`}
    >
      <Link href={link}>
        <header className="flex justify-start items-start">
          <h3 className="">{title}</h3>
        </header>
        <main className="flex justify-start items-start">
          <p className="text-7xl">{formatNumber(value, "price")}</p>
        </main>
        <footer className="flex relative justify-end items-end">
          <span className="absolute">{icon}</span>
        </footer>
      </Link>
    </li>
  );
};
