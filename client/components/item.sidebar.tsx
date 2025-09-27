"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/button";
import { ChevronDown, ChevronUp, type LucideProps } from "lucide-react";

type LucideIconComponent =
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
  return (
    <Button
      fullWidth
      className={`flex bg-red items-center justify-between transition-colors duration-300
        ${
          active
            ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md"
            : ""
        }`}
      endContent={
        !isLink ? (
          isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )
        ) : null
      }
      as={isLink ? "a" : "button"}
      href={isLink ? href : undefined}
      onPress={!isLink && click ? click : undefined}
    >
      <div className="flex gap-2 items-center">
        {Icon ? <Icon className="w-5 h-5" /> : null}
        <span>{label}</span>
      </div>
    </Button>
  );
};

const DropdownBtnItem: React.FC<{
  href: string;
  label: string;
  active: boolean;
}> = ({ href, label, active }) => (
  <li>
    <Button
      as="a"
      href={href}
      fullWidth
      variant="faded"
      className={`my-1 transition-colors duration-300 ${
        active ? "bg-gradient-to-r from-indigo to-pink text-white shadow" : ""
      }`}
    >
      {label}
    </Button>
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
    : items?.some((it) => pathname.startsWith(it.href));

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
          } flex-col pr-10`}
        >
          {items.map((it) => (
            <DropdownBtnItem
              key={it.href}
              href={it.href}
              label={it.label}
              active={pathname === it.href}
            />
          ))}
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
