"use client";

import { Button } from "@heroui/button";
import { Pen, Plus, Trash } from "lucide-react";
import React from "react";

interface ActionBtnProps {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

const actionBtns: ActionBtnProps[] = [
  {
    label: "شماره کارت جدید",
    action: () => console.log(true),
    icon: <Plus />,
  },
  {
    label: "ویرایش",
    action: () => console.log(true),
    icon: <Pen />,
  },
  {
    label: "حذف",
    action: () => console.log(true),
    icon: <Trash />,
  },
];

export const FooterWidget = ({ ownerName }: { ownerName: string }) => {
  return (
    <div className="flex justify-between items-center">
      <h5>{ownerName}</h5>
      <div className="flex gap-2">
        {actionBtns.map((btn, index) => (
          <Button
            isIconOnly
            radius="full"
            variant="ghost"
            key={index}
            onPress={btn.action}
          >
            {btn.icon}
          </Button>
        ))}
      </div>
    </div>
  );
};
