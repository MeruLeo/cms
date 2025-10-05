"use client";

import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { SidebarItem } from "./item.sidebar";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import { useAuthStore } from "@/stores/auth.store";

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
  const { getCurrentUser, user, loading } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const pathname = usePathname();

  const hiddenPaths = ["/auth"];
  const isAuthRoute = hiddenPaths.some((p) => pathname.startsWith(p));

  if (isAuthRoute) return null;

  return (
    <aside className="bg-gray4 border-l border-gray3 p-4 h-screen w-[25%]">
      {/* Header */}
      <header>
        <ul className="flex gap-2 mb-4 bg-gray3 w-fit p-1 rounded-full">
          <li className="w-3 h-3 bg-red rounded-full" />
          <li className="w-3 h-3 bg-yellow rounded-full" />
          <li className="w-3 h-3 bg-green rounded-full" />
        </ul>
        {user ? (
          <>
            <AvatarGroup className="flex gap-4 items-center mb-6">
              <Avatar />
              <div className="flex flex-col">
                <h3 className="font-bold text-md">{user.fullName}</h3>
                <p className="text-xs text-gray">{user.email}</p>
              </div>
            </AvatarGroup>
          </>
        ) : (
          <div className="max-w-[300px] w-full flex items-center gap-3">
            <div>
              <Skeleton className="flex rounded-full w-12 h-12" />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-3 w-3/5 rounded-lg" />
              <Skeleton className="h-3 w-4/5 rounded-lg" />
            </div>
          </div>
        )}
      </header>

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
