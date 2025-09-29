import { actionsConfig } from "@/config/home/actions.config";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface ActionProps {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const Action = ({ label, href, icon }: ActionProps) => {
  return (
    <li>
      <Link
        href={href}
        className="flex gap-3 flex-col items-center justify-center"
      >
        <div className="bg-gray3 w-14 h-14 flex items-center justify-center rounded-full">
          {icon}
        </div>
        <h6 className="text-xs">{label}</h6>
      </Link>
    </li>
  );
};

export const Actions = () => {
  return (
    <ul className="flex flex-wrap gap-8 items-center">
      {actionsConfig.map((action, index) => (
        <Action key={index} {...action} />
      ))}
    </ul>
  );
};
