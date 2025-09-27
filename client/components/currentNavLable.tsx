// components/CurrentNavbar.tsx
"use client";

import { Navbar } from "@/components/navbar";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

function getLabelFromPath(pathname: string): string {
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
  return "Overview"; // fallback
}

export function CurrentNavbar() {
  const pathname = usePathname();
  const label = getLabelFromPath(pathname);

  return <Navbar title={label} />;
}
