import { HeaderWidgetStoreProps } from "@/components/store/header.widget";
import { CircleAlert, Flame, Warehouse } from "lucide-react";

export const widgetConfigStore: HeaderWidgetStoreProps[] = [
  {
    title: "همه محصولات",
    link: "/",
    bg: "bg-gradient-to-tr from-blue-900 to-blue",
    icon: <Warehouse className="w-20 h-20 text-blue" />,
    value: 5,
  },
  {
    title: "محصولات پرفروش",
    link: "/",
    bg: "bg-gradient-to-tr from-yellow to-yellow-900",
    icon: <Flame className="w-20 h-20 text-yellow-900" />,
    value: 5,
  },
  {
    title: "محصولات رو به اتمام",
    link: "/",
    bg: "bg-gradient-to-tr from-red-900 to-red",
    icon: <CircleAlert className="w-20 h-20 text-red" />,
    value: 5,
  },
];
