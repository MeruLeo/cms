"use client";

import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { SidebarItem } from "./item.sidebar";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import { Divider } from "@heroui/divider";

type LucideIconComponent =
  | React.ForwardRefExoticComponent<
      LucideProps & React.RefAttributes<SVGSVGElement>
    >
  | undefined;

const getLucideIcon = (name?: string): LucideIconComponent => {
  if (!name) return undefined;
  const anyIcons = Icons as unknown as Record<string, unknown>;
  const found = anyIcons[name];
  return (found as LucideIconComponent) ?? undefined;
};

export const Sidebar: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const pathname = usePathname();

  const hiddenPaths = ["/auth"];
  const isAuthRoute = hiddenPaths.some((p) => pathname.startsWith(p));

  if (isAuthRoute) return null;

  return (
    <aside className="bg-gray4 border-l border-gray3 p-4 h-screen w-[20%]">
      {/* Header */}
      <AvatarGroup className="flex gap-4 items-center mb-6">
        <Avatar />
        <div className="">
          <h3 className="font-bold text-md">امیرعلی الله وردی</h3>
          <p className="text-sm text-gray">amiraliallahverdi1@gmail</p>
        </div>
      </AvatarGroup>

      <Divider className="mb-6" />

      {/* Menu */}
      <main className="flex flex-col gap-4">
        <ul className="space-y-2">
          {siteConfig.navItems.map((item, i) => {
            const Icon = getLucideIcon(item.icon);
            return (
              <SidebarItem
                key={item.label}
                {...item}
                icon={Icon}
                index={i}
                openIndex={openIndex}
                setOpenIndex={setOpenIndex}
              />
            );
          })}
        </ul>
      </main>
    </aside>
  );
};
