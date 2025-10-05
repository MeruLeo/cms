"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import { ChevronDown, ChevronUp, type LucideProps } from "lucide-react";

export type LucideIconComponent =
  | React.ForwardRefExoticComponent<
      LucideProps & React.RefAttributes<SVGSVGElement>
    >
  | undefined;

interface SubItem {
  label: string;
  href: string;
}

export interface SidebarItemProps {
  label: string;
  icon?: LucideIconComponent;
  href?: string;
  items?: SubItem[];
  index: number;
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
}

type SidebarBtnProps = {
  isLink: boolean;
  label: string;
  href?: string;
  click?: () => void;
  Icon?: LucideIconComponent;
  isOpen?: boolean;
  active?: boolean;
};

const SidebarBtn: React.FC<SidebarBtnProps> = ({
  isLink,
  label,
  href,
  click,
  Icon,
  isOpen,
  active,
}) => {
  const btnClass = `flex p-2 rounded-xl items-center justify-between transition-colors duration-300 ${
    active ? "bg-gray3 cursor-default" : "text-gray bg-transparent"
  }`;

  const inner = (
    <div className="flex gap-2 items-center">
      {Icon ? <Icon className="w-5 h-5" /> : null}
      <span>{label}</span>
    </div>
  );

  if (isLink && href) {
    return (
      <Link href={href} className={`block w-full ${btnClass}`}>
        <div className="w-full flex items-center">{inner}</div>
      </Link>
    );
  }

  return (
    <Button
      fullWidth
      className={btnClass}
      endContent={
        !isLink ? (
          isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )
        ) : null
      }
      onPress={!isLink && click ? click : undefined}
    >
      {inner}
    </Button>
  );
};

const DropdownBtnItem: React.FC<{
  href: string;
  label: string;
  active: boolean;
}> = ({ href, label, active }) => (
  <li>
    <Link
      href={href}
      className={`block w-full my-1 transition-colors duration-300 px-2 py-1 rounded-full ${
        active ? "bg-gradient-to-r from-gray3 to-gray4" : "hover:bg-gray3/20"
      }`}
    >
      {label}
    </Link>
  </li>
);

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  items,
  icon,
  index,
  openIndex,
  setOpenIndex,
}) => {
  const pathname = usePathname();
  const isOpen = openIndex === index;

  const isActive = href
    ? pathname === href
    : !!items?.some((it) => pathname.startsWith(it.href));

  if (href) {
    return (
      <li>
        <SidebarBtn
          isLink
          label={label}
          href={href}
          Icon={icon}
          active={isActive}
        />
      </li>
    );
  }

  if (items && items.length > 0) {
    return (
      <li>
        <SidebarBtn
          click={() => setOpenIndex(isOpen ? null : index)}
          isLink={false}
          label={label}
          Icon={icon}
          isOpen={isOpen}
          active={isActive}
        />
        <ul
          className={`transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } flex-row flex pr-5 gap-4`}
        >
          <div className="w-0.5 bg-gray3 rounded-full" />
          <ul className="flex flex-col">
            {items.map((it) => (
              <DropdownBtnItem
                key={it.href}
                href={it.href}
                label={it.label}
                active={pathname === it.href}
              />
            ))}
          </ul>
        </ul>
      </li>
    );
  }

  return null;
};

export const Sidebar: React.FC<{
  items: Omit<SidebarItemProps, "index" | "openIndex" | "setOpenIndex">[];
}> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <SidebarItem
          key={i}
          {...item}
          index={i}
          openIndex={openIndex}
          setOpenIndex={setOpenIndex}
        />
      ))}
    </ul>
  );
};
