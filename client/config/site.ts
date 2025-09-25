export type SiteConfig = typeof siteConfig;
import { Component, Warehouse } from "lucide-react";

export const siteConfig = {
  name: "CMS",
  description: "cms for shops",
  navItems: [
    {
      label: "داشبورد",
      href: "/",
      icon: Component,
    },
    {
      label: "انبار",
      href: "/store",
      icon: Warehouse,
    },
    {
      label: "مشتریان",
      href: "/customers",
      icon: "",
    },
    {
      label: "سفارشات",
      icon: "",
      items: [
        {
          label: "همه سفارشات",
          href: "/orders",
        },
        {
          label: "تحویل داده شده ها",
          href: "/orders/delivered",
        },
        {
          label: "لغو شده ها",
          href: "/orders/canceled",
        },
      ],
    },
    {
      label: "نظرات",
      icon: "",
      items: [
        {
          label: "همه نظرات",
          href: "/comments",
        },
        {
          label: "نظرات تایید شده",
          href: "/comments/approveds",
        },
        {
          label: "نظرات تایید نشده",
          href: "/comments/rejecteds",
        },
      ],
    },
    {
      label: "تیکت‌ها",
      icon: "",
      items: [
        {
          label: "همه تیکت ها",
          href: "/tickets",
        },
        {
          label: "تیکت های در انتظار پاسخ",
          href: "/tickets",
        },
        {
          label: "تیکت های پاسخ داده شده",
          href: "/tickets",
        },
      ],
    },
    {
      label: "تنظیمات",
      icon: "",
      href: "/settings",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
