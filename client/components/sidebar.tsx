// components/Sidebar.tsx
"use client";

import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import React, { useState } from "react";

import { siteConfig } from "@/config/site";
import { SidebarItem } from "./item.sidebar";
import { Logo } from "./icons"; // فرض بر این است که این فایل موجود است

// تایپ مخصوص آیکون‌های lucide
type LucideIconComponent =
  | React.ForwardRefExoticComponent<
      LucideProps & React.RefAttributes<SVGSVGElement>
    >
  | undefined;

// helper: از name، کامپوننت آیکون رو برمی‌گردونه (با cast امن)
const getLucideIcon = (name?: string): LucideIconComponent => {
  if (!name) return undefined;
  const anyIcons = Icons as unknown as Record<string, unknown>;
  const found = anyIcons[name];
  return (found as LucideIconComponent) ?? undefined;
};

export const Sidebar: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <aside className="bg-gray4 p-4 h-screen w-[20%]">
      {/* Header */}
      <header className="flex gap-2 items-center mb-6">
        <Logo />
        <p className="font-bold text-inherit">CMS</p>
      </header>

      {/* Menu */}
      <main className="flex flex-col gap-4">
        <p className="text-sm text-gray-400">منو</p>
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
