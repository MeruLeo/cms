"use client";

import { ChevronLeft, UsersRound } from "lucide-react";
import Link from "next/link";
import AnimatedList from "@/components/animatedList";
import { UserPreview } from "@/components/home/userPriview";
import { IUser } from "@/types/user.type";
import { useOrderStore } from "@/stores/order.store";

export function UsersSection({ users }: { users: IUser[] }) {
  const { countOrdersByUser } = useOrderStore();

  return (
    <section className="bg-gray4 w-full p-4 rounded-4xl">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <UsersRound className="w-5 h-5 text-gray" />
          <h4 className="text-xl text-gray">مشریان جدید</h4>
        </div>
        <Link
          href="/"
          className="flex bg-gray3 items-center text-xs p-2 rounded-full"
        >
          مشاهده همه
          <ChevronLeft className="size-5" />
        </Link>
      </header>
      <AnimatedList
        items={users}
        renderItem={(user, index) => (
          <UserPreview
            countOfBuys={countOrdersByUser[user._id]}
            {...user}
            key={index}
          />
        )}
        onItemSelect={(user) => console.log("انتخاب شد:", user)}
        displayScrollbar={false}
      />
    </section>
  );
}
