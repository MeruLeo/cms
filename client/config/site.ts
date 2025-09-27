import {
  LayoutDashboard,
  Boxes,
  Users,
  ShoppingCart,
  MessageSquare,
  Ticket,
  Settings,
} from "lucide-react";

export const siteConfig = {
  name: "CMS",
  description: "cms for shops",
  navItems: [
    {
      label: "داشبورد",
      href: "/",
      icon: "LayoutDashboard",
    },
    {
      label: "انبار",
      href: "/store",
      icon: "Boxes",
    },
    {
      label: "مشتریان",
      href: "/customers",
      icon: "UsersRound",
    },
    {
      label: "سفارشات",
      icon: "ShoppingBasket",
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
      icon: "MessageCircle",
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
      icon: "Ticket",
      items: [
        {
          label: "همه تیکت ها",
          href: "/tickets",
        },
        {
          label: "در انتظار پاسخ",
          href: "/tickets/pending",
        },
        {
          label: "پاسخ داده شده",
          href: "/tickets/answered",
        },
      ],
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
  },
};
