"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import React, { useState } from "react";

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  items?: { label: string; href: string }[];
}

type SidebarBtnProps = {
  isLink: boolean;
  label: string;
  href?: string;
  click?: () => void;
};

const SidebarBtn = ({ isLink, label, href, click }: SidebarBtnProps) => {
  return (
    <Button
      fullWidth
      className="flex justify-start"
      as={isLink ? "a" : "button"}
      href={isLink ? href : undefined}
      onPress={!isLink && click ? click : undefined}
    >
      {label}
    </Button>
  );
};

const DropdownBtn = ({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <SidebarBtn
        click={() => setIsOpen(!isOpen)}
        isLink={false}
        label={label}
      />
      <ul className={`${isOpen ? "flex" : "hidden"} flex-col pl-4`}>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export const SidebarItem = ({ label, href, items }: SidebarItemProps) => {
  if (href) {
    return (
      <li>
        <SidebarBtn isLink label={label} href={href} />
      </li>
    );
  }

  if (items && items.length > 0) {
    return <DropdownBtn label={label} items={items} />;
  }

  return null;
};
