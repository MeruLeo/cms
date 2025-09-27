"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export function useCurrentNavLabel() {
  const pathname = usePathname();

  for (const item of siteConfig.navItems) {
    if (item.href && item.href === pathname) {
      return item.label;
    }
    if (item.items) {
      for (const sub of item.items) {
        if (sub.href === pathname) {
          return sub.label;
        }
      }
    }
  }

  return "CMS";
}
