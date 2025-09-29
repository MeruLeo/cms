import { ActionProps } from "@/components/home/actions";
import {
  BringToFront,
  CircleAlert,
  MessageCircleX,
  Plus,
  TicketPercent,
  Tickets,
  Upload,
} from "lucide-react";

export const actionsConfig: ActionProps[] = [
  {
    label: "محصول جدید",
    href: "/",
    icon: <Plus />,
  },
  {
    label: "تیکت های باز",
    href: "/",
    icon: <Tickets />,
  },
  {
    label: "سفارش ها",
    href: "/",
    icon: <BringToFront />,
  },
  {
    label: "نظرات تایید نشده",
    href: "/",
    icon: <MessageCircleX />,
  },
  {
    label: "پرینت فروش ماه",
    href: "/",
    icon: <Upload />,
  },
  {
    label: "ایجاد کد تخفیف",
    href: "/",
    icon: <TicketPercent />,
  },
  {
    label: "محصولات رو به پایان",
    href: "/",
    icon: <CircleAlert />,
  },
];
